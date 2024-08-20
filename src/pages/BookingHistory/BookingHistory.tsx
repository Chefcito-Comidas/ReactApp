import { Button, Card, Col, Container, Pagination, Row } from "react-bootstrap"
import "./BookingHistory.css"
import Loading from "../../components/Loading/Loading"
import { useEffect, useState } from "react"
import { AcceptBooking, CancelBooking, GetReservationProps, GetReservations } from "../../api/bookings"
import { GetUser } from "../../hooks/getUser.hook"
import { Reservation } from "../../models/Reservations.model"
import { useAppSelector } from "../../redux/hooks/hook"
import moment from "moment"

const BookingHistory = () => {
    const [loading,setLoading] = useState(false)
    const [page,setPage] = useState(0)
    const [pageSize,setPageSize] = useState(100)
    const [cantPages,setPageCant] = useState(1)

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
        //         status:'Accepted'
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
    const [bookingsToShow,setBookingsToShow] = useState<Reservation[]>([])
    const userData = useAppSelector(state => state.userData.data)

    const {
        user
    } = GetUser()

    const getBookings = async () =>{
        try {
            if(user) {
                const props = new GetReservationProps()
                props.start = 0;
                props.limit = pageSize;
                setLoading(true)
                const result = await GetReservations(props,user)
                console.log('booking',result)
                setBookingsToShow(result.result.slice(page*pageSize,(page+1)*pageSize))
                setPageCant(Math.ceil(result.result.length/pageSize))
                
                setBookings([...result.result])
            }
        } catch (err) {
            console.log("get bookings err",err)
        }
        setLoading(false)
        
    }

    useEffect(()=>{
        if(bookings.length) setBookingsToShow(bookings.slice(page*pageSize,(page+1)*pageSize))
    },[page])

    useEffect(()=>{
        getBookings()
    },[user])

    const getPaginationItems = () => {
        const items = []
        for(let i = 0; i < cantPages;i++) {
            items.push(
                <Pagination.Item key={i} active={i === page} onClick={()=>{setPage(i)}}>
                    {i+1}
                </Pagination.Item>
            )
        } 
        return items
    }

    const AceptBooking = async (reserrvation:Reservation) =>{
        setLoading(true)
        try {
            if(user) {
                const result = await AcceptBooking(reserrvation,user)
                alert("Reserva Aceptada exitosamente")
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
            }
        } catch (err) {
            console.log("reject booking error",err)
        }
        setLoading(false)
    }

    return(
        <>
        <Container className="history-container">
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>
                    <Row>
                        Reservas
                    </Row>
                </Card.Title>
                <Card.Body>
                    <Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>
                        {(bookingsToShow.length>0)&&bookingsToShow.map((item,index)=>{
                            return <Card style={{paddingLeft:0,paddingRight:0,maxWidth:600,marginBottom:12}} key={`${item?.id}${index}`}>
                                <Card.Title style={{color:'white',paddingLeft:8}} className={item.status.status==='Accepted'?'Accepted':item.status.status==='Uncomfirmed'?'Uncomfirmed':'Canceled'}><Row style={{marginTop:4}} ><Col>Santiago Marinaro</Col></Row></Card.Title>
                                <Card.Body>
                                    <Row>Fecha de Reserva: {moment(item.time).format('DD/MM/YYYY HH:mm')}</Row>
                                    <Row>Cantidad de personas: {item.people}</Row>
                                    {(item.status.status==='Uncomfirmed')&&<Row>
                                        <Col><Button onClick={()=>AceptBooking(item)} style={{backgroundColor:'green'}}>Aceptar</Button></Col>
                                        <Col><Button onClick={()=>RejectBooking(item)} style={{backgroundColor:'red'}}>Rechazar</Button></Col>
                                    </Row>}
                                    {(item.status.status==='Accepted')&&<Row>
                                        <Col><Button onClick={()=>RejectBooking(item)} style={{backgroundColor:'red'}}>Cacelar Reserva</Button></Col>
                                    </Row>}
                                </Card.Body>
                            </Card>
                        })}
                    </Row>
                    <Pagination style={{justifyContent:'center'}}>
                        <Pagination.First onClick={()=>setPage(0)} />
                        <Pagination.Prev onClick={()=>{
                            if(page-1>=0) {
                                setPage(page-1)
                            }
                        }}/>
                        {getPaginationItems()}
                        <Pagination.Next  onClick={()=>{
                            if(page+1<cantPages) {
                                setPage(page+1)
                            }
                        }}/>
                        <Pagination.Last onClick={()=>setPage(cantPages-1)}/>
                    </Pagination>
                </Card.Body>
            </Card>
        </Container>
        {loading&&<Loading></Loading>}
        </>
    )
}

export default BookingHistory