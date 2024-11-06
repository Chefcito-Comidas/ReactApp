/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Button, Container, OverlayTrigger, Row,Table, Tooltip } from "react-bootstrap"
import "./BookingHistory.css"
import Loading from "../../components/Loading/Loading"
import { useEffect, useState } from "react"
import { AcceptBooking, CancelBooking, GetReservationProps, GetReservations } from "../../api/bookings"
import { GetUser } from "../../hooks/getUser.hook"
import { Reservation } from "../../models/Reservations.model"
import moment from "moment"
import { BookingStatus } from "../../models/BookingStatus.enum"
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"

const BookingHistory = () => {
    const [loading,setLoading] = useState(false)
    const [showSuccess,setShowSuccess] = useState(false)
    const [showCancelSuccess,setShowCancelSuccess] = useState(false)
    const [showError,setShowError] = useState(false)
    const [date,setDate] = useState(moment().local())
    const [endDate,setEndDate] = useState(moment().local().add(1,'month'))
    const [bookings,setBookings] = useState<Reservation[]>([])

    useEffect(()=>{
        setTimeout(()=>{
            setShowError(false)
            setShowCancelSuccess(false)
            setShowSuccess(false)
        },1000)
    },[showError,showSuccess,showCancelSuccess])

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
                setShowSuccess(true)
                getBookings()
            }
        } catch (err) {
            console.log("accept booking error",err)
            setShowError(true)
        }
        setLoading(false)
    }

    const RejectBooking = async (reserrvation:Reservation) => {
        setLoading(true)
        try {
            if(user) {
                const result = await CancelBooking(reserrvation,user)
                setShowCancelSuccess(true)
                getBookings()
            }
        } catch (err) {
            console.log("reject booking error",err)
            setShowError(true)
        }
        setLoading(false)
    }

    const renderTooltip = (props:any) => (
        <Tooltip id="button-tooltip" {...props}>
          Bajo Indice de Asistencias
        </Tooltip>
    );

    const AlertView = () => {
        return(
            <OverlayTrigger
            overlay={renderTooltip}
            >
                <div className="alerta-inasistentcia">!</div>
            </OverlayTrigger>
        )
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
                    if(date&&date.length===2) {
                        setDate(moment(date[0].format('YYYY-MM-DDTHH:mm')).local())
                        setEndDate(moment(date[1].format('YYYY-MM-DDTHH:mm')).local())
                    }
                }}
                range
                rangeHover
                format="DD/MM/YYYY"
                plugins={[
                    <DatePanel markFocused />
                ]}
                render={
                    <Button variant="outline-info">
                        Fecha Elegida: desde {date.local().format('DD/MM/YYYY')} hasta {endDate.local().format('DD/MM/YYYY')}
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
                            <th><div className="Center">Asistidos</div></th>
                            <th><div className="Center">Expirados</div></th>
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
                                        <div className="Center">{booking.user.name} {(booking.user.times_assisted<booking.user.times_expired)?AlertView():''}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{booking.user.times_assisted}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{booking.user.times_expired}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{booking.people}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{moment(booking.time).local().format("DD/MM/YYYY HH:mm")}</div>
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
            <Alert variant="danger" show={showError} onClose={() => setShowError(false)} dismissible style={{position:'fixed',top:50,left:'30%',zIndex:1000}}>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                    Hubo un error al intentar modificar el Estado de la reserva. Intente otravez pasado un tiempo
                </p>
            </Alert>
            <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible style={{position:'fixed',top:50,left:'40%',zIndex:1000}}>
                <Alert.Heading>Exito</Alert.Heading>
                <p>
                    Reserva Aceptada con exito
                </p>
            </Alert>
            <Alert variant="success" show={showCancelSuccess} onClose={() => setShowCancelSuccess(false)} dismissible style={{position:'fixed',top:50,left:'40%',zIndex:1000}}>
                <Alert.Heading>Exito</Alert.Heading>
                <p>
                    Reserva Rechazada con exito
                </p>
            </Alert>
        </Container>
        {loading&&<Loading></Loading>}
        </>
    )
}

export default BookingHistory