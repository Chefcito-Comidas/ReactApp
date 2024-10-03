import { Button, Col, Container, Row,Table } from "react-bootstrap"
import "./BookingHistory.css"
import Loading from "../../components/Loading/Loading"
import { useEffect, useState } from "react"
import { AcceptBooking, CancelBooking, GetReservationProps, GetReservations } from "../../api/bookings"
import { GetUser } from "../../hooks/getUser.hook"
import { Reservation } from "../../models/Reservations.model"
import { useAppSelector } from "../../redux/hooks/hook"
import moment from "moment"
import { BookingStatus } from "../../models/BookingStatus.enum"
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"

const BookingHistory = () => {
    const [loading,setLoading] = useState(false)
    const [date,setDate] = useState(moment())
    const [endDate,setEndDate] = useState(moment().add(1,'month'))
    const [bookings,setBookings] = useState<Reservation[]>([
        // {
        //     id:'asdfgagfahf',
        //     user:'Juan',
        //     venue:'',
        //     time:'2024-08-09T23:00:38.664Z',
        //     people:3,
        //     status:{
        //         status:'Uncomfirmed'
        //     }
        // },
        // {
        //     id:'asdfgagfahf',
        //     user:'Carlos',
        //     venue:'',
        //     time:'2024-08-11T00:30:38.664Z',
        //     people:1,
        //     status:{
        //         status:BookingStatus.Accepted
        //     }
        // },
        // {
        //     id:'asdfgagfahf',
        //     user:'Ivan',
        //     venue:'',
        //     time:'2024-08-11T00:30:38.664Z',
        //     people:4,
        //     status:{
        //         status:'Uncomfirmed'
        //     }
        // },
        // {
        //     id:'asdfgagfahf',
        //     user:'Santiago',
        //     venue:'',
        //     time:'2024-08-11T00:00:38.664Z',
        //     people:7,
        //     status:{
        //         status:'Canceled'
        //     }
        // },
    ])

    const {
        user
    } = GetUser()

    const getBookings = async () =>{
        try {
            if(user) {
                const props = new GetReservationProps()
                props.start = 0;
                props.limit = 100000;
                props.from_time = date.startOf('day').toISOString()
                props.to_time = endDate.endOf('day').toISOString()
                setLoading(true)
                const result = await GetReservations(props,user)
                console.log('booking',result)
                setBookings([...result.result])
            }
        } catch (err) {
            console.log("get bookings err",err)
        }
        setLoading(false)
        
    }

    useEffect(()=>{
        getBookings()
    },[user,date])

    const AceptBooking = async (reserrvation:Reservation) =>{
        setLoading(true)
        try {
            if(user) {
                const result = await AcceptBooking(reserrvation,user)
                alert("Reserva Aceptada exitosamente")
                getBookings()
            }
        } catch (err) {
            console.log("accept booking error",err)
        }
        setLoading(false)
    }

    const RejectBooking = async (reserrvation:Reservation) => {
        setLoading(true)
        try {
            if(user) {
                const result = await CancelBooking(reserrvation,user)
                alert("Reserva Rechazada exitosamente")
                getBookings()
            }
        } catch (err) {
            console.log("reject booking error",err)
        }
        setLoading(false)
    }

    return(
        <>
        <Container className="history-container">
            <Row>
                <div className="booking-title">Mis Reservas</div>
            </Row>
            <Row style={{marginBottom:8,marginTop:4}}>
                <DatePicker
                value={[date.toDate(),endDate.toDate()]}
                onChange={(date)=>{
                    console.log(date)
                    date&&date.length>0&&setDate(moment(date[0].format('YYYY-MM-DDTHH:mm')))
                    date&&date.length>1&&setEndDate(moment(date[1].format('YYYY-MM-DDTHH:mm')))
                }}
                range
                format="DD/MM/YYYY"
                plugins={[
                    <DatePanel markFocused />
                ]}
                render={
                    <Button variant="outline-info">
                        Fecha Elegida: desde {date.format('DD/MM/YYYY')} hasta {endDate.format('DD/MM/YYYY')}
                    </Button>
                }
                />
            </Row>
            <Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th><div className="Center">Estado</div></th>
                            <th><div className="Center">Cliente</div></th>
                            <th><div className="Center">Cantidad de Personas</div></th>
                            <th><div className="Center">Fecha</div></th>
                            <th><div className="Center">Acciones</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length>0&&
                        bookings.map((booking)=>{
                            return(
                                <tr>
                                    <td 
                                    >
                                        <div 
                                        className={(booking.status.status===BookingStatus.Accepted||booking.status.status===BookingStatus.Assisted)?BookingStatus.Accepted:((booking.status.status===BookingStatus.Canceled||booking.status.status===BookingStatus.Expired)?BookingStatus.Canceled:BookingStatus.Uncomfirmed) + ' Center'}
                                        >{booking.status.status}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{booking.user}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{booking.people}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{moment(booking.time).format("DD/MM/YYYY HH:mm")}</div>
                                    </td>
                                    <td>
                                        <div className="actionsCol">
                                            {booking.status.status===BookingStatus.Uncomfirmed&&<Button variant="outline-success" style={{marginRight:4}} onClick={()=>AceptBooking(booking)}>Aceptar Reserva</Button>}
                                            {(booking.status.status===BookingStatus.Accepted||booking.status.status===BookingStatus.Uncomfirmed)&&<Button variant="outline-danger" onClick={()=>RejectBooking(booking)}>Rechazar Reserva</Button>}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </Table>
            </Row>
        </Container>
        {loading&&<Loading></Loading>}
        </>
    )
}

export default BookingHistory