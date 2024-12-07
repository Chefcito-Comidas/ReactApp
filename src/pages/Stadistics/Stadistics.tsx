/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Container, Row } from "react-bootstrap"
import "./Stadistics.css"
import { useEffect, useState } from "react"
import { GetUser } from "../../hooks/getUser.hook"
import { useAppSelector } from "../../redux/hooks/hook"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart,Pie, Bar, BarChart,Cell } from 'recharts';
import { getStadistics } from "../../api/stadistics.api"
import { GetReservationProps, GetReservations } from "../../api/bookings"
import { ReservationData } from "../../models/Reservations.model"

type ChartData = {
    name:string;
    value:number;
    color?:string;
}

const days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']

const Stadistics = () => {

    const {
        user
    } = GetUser()
    const userData = useAppSelector(state=>state.userData.data)

    const [bookingStats,setBookingStats] = useState<ChartData[]>([])
    const [dates,setDates] = useState<ChartData[]>([])
    const [turns,setTurns] = useState<ChartData[]>([])
    const [people,setPeople] = useState<number|null>(null)
    const [lowAssitance,setLowAssitance] = useState<boolean>(false)
    const [topBookings,setTopBookings] = useState<ChartData[]>([])
    const [topFaults,setTopFaults] = useState<ChartData[]>([])

    const setFalseStatdistics = () => {
        setLowAssitance(false)
        setBookingStats([
            {name:'Cancelado',value:9,color:'orange'},
            {name:'Expirado',value:11,color:'red'},
            {name:'Finalizado',value:157,color:'green'},
        ])
        setPeople(Math.floor(Math.random() * 6)+1,)
        const turn:ChartData[] = []
        turn.push(
            {
                name:"10:00",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"10:30",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"11:00",
                value:Math.floor(Math.random() * 15)+1,
            },
            {
                name:"11:30",
                value:Math.floor(Math.random() * 20)+1,
            },
            {
                name:"12:00",
                value:Math.floor(Math.random() * 30)+1,
            },
            {
                name:"12:30",
                value:Math.floor(Math.random() * 30)+10,
            },
            {
                name:"13:00",
                value:Math.floor(Math.random() * 30)+10,
            },
            {
                name:"13:30",
                value:Math.floor(Math.random() * 30)+10,
            },
            {
                name:"14:00",
                value:Math.floor(Math.random() * 20)+10,
            },
            {
                name:"14:30",
                value:Math.floor(Math.random() * 20)+1,
            },
            {
                name:"15:00",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"15:30",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"16:00",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"16:30",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"17:00",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"17:30",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"18:00",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"18:30",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"19:00",
                value:Math.floor(Math.random() * 5)+1,
            },
            {
                name:"19:30",
                value:Math.floor(Math.random() * 10)+1,
            },
            {
                name:"20:00",
                value:Math.floor(Math.random() * 20)+1,
            },
            {
                name:"20:30",
                value:Math.floor(Math.random() * 30)+10,
            },
            {
                name:"21:00",
                value:Math.floor(Math.random() * 30)+10,
            },
            {
                name:"21:30",
                value:Math.floor(Math.random() * 30)+10,
            },
            {
                name:"22:00",
                value:Math.floor(Math.random() * 30)+10,
            },
            {
                name:"22:30",
                value:Math.floor(Math.random() * 30)+10,
            },
            {
                name:"23:00",
                value:Math.floor(Math.random() * 20)+10,
            },
            {
                name:"23:30",
                value:Math.floor(Math.random() * 20)+10,
            },
        )
        setTurns(turn)

        const date:ChartData[] = []
        date.push(
            {"name": "03/10/2024", "value": 38},
            {"name": "04/10/2024", "value": 4},
            {"name": "05/10/2024", "value": 32},
            {"name": "06/10/2024", "value": 60},
            {"name": "07/10/2024", "value": 29},
            {"name": "08/10/2024", "value": 24},
            {"name": "09/10/2024", "value": 58},
            {"name": "10/10/2024", "value": 10},
            {"name": "11/10/2024", "value": 61},
            {"name": "12/10/2024", "value": 17},
            {"name": "13/10/2024", "value": 99},
            {"name": "14/10/2024", "value": 83},
            {"name": "15/10/2024", "value": 77},
            {"name": "16/10/2024", "value": 94},
            {"name": "17/10/2024", "value": 38},
            {"name": "18/10/2024", "value": 56},
            {"name": "19/10/2024", "value": 82},
            {"name": "20/10/2024", "value": 79},
            {"name": "21/10/2024", "value": 18},
            {"name": "22/10/2024", "value": 55},
        )
        setDates(date)
    }

    const stadistics = async () => {
        try {
            if(user&&userData) {
                const result = await getStadistics(userData.data.localid,user)
                setLowAssitance(((result.expired+result.canceled)/result.total)>0.5)
                if(result.total>0) {
                    const canceled = Math.round(result.canceled*result.total)
                    const expired = Math.round(result.expired*result.total)
                    const asisted = Math.round(result.total*(1-result.canceled-result.expired))
                    setBookingStats([
                        {name:'Cancelado',value:canceled,color:'orange'},
                        {name:'Expirado',value:expired,color:'red'},
                        {name:'Asistido',value:asisted,color:'green'},
                    ])
                }
                
                setPeople(result.people)
                const turn:ChartData[] = []
                for(const key in result.turns.turns) {
                    turn.push({
                        name:key,
                        value:result.turns.turns[key]
                    })
                }
                setTurns(turn)

                const date:ChartData[] = []
                for(const key in result.days.means) {
                    date.push({
                        name:days[parseInt(key)],
                        value:result.days.means[key]
                    })
                }
                setDates(date)

                // setFalseStatdistics()
                
            }
        } catch (err) {
            console.error('get stats error',err)
        }
    }

    const getFalseResult = ():ReservationData => {
        const result:ReservationData = {
            total:10,
            result:[
                {
                    "id": '1',
                    "user": {
                      "id": "1",
                      "name": "Santiago Jose",
                      "phone": "1145788596",
                      "times_assisted": 100,
                      "times_expired": 5
                    },
                    "venue": "string",
                    "time": "2024-10-21T19:49:24.364Z",
                    "people": 0,
                    "status": {
                      "status": "string"
                    }
                },
                {
                    "id": '1',
                    "user": {
                      "id": "1",
                      "name": "Santiago Jose",
                      "phone": "1145788596",
                      "times_assisted": 20,
                      "times_expired": 5
                    },
                    "venue": "string",
                    "time": "2024-10-21T19:49:24.364Z",
                    "people": 0,
                    "status": {
                      "status": "string"
                    }
                },
                {
                    "id": '1',
                    "user": {
                      "id": "1",
                      "name": "Juan cruz",
                      "phone": "1145788596",
                      "times_assisted": 5,
                      "times_expired": 15
                    },
                    "venue": "string",
                    "time": "2024-10-21T19:49:24.364Z",
                    "people": 0,
                    "status": {
                      "status": "string"
                    }
                },
                {
                    "id": '1',
                    "user": {
                      "id": "1",
                      "name": "Javier Pereira",
                      "phone": "1145788596",
                      "times_assisted": 15,
                      "times_expired": 0
                    },
                    "venue": "string",
                    "time": "2024-10-21T19:49:24.364Z",
                    "people": 0,
                    "status": {
                      "status": "string"
                    }
                },
                {
                    "id": '1',
                    "user": {
                      "id": "1",
                      "name": "Florencia Martinez",
                      "phone": "1145788596",
                      "times_assisted": 20,
                      "times_expired": 3
                    },
                    "venue": "string",
                    "time": "2024-10-21T19:49:24.364Z",
                    "people": 0,
                    "status": {
                      "status": "string"
                    }
                },
                {
                    "id": '1',
                    "user": {
                      "id": "1",
                      "name": "Carlos Kent",
                      "phone": "1145788596",
                      "times_assisted": 0,
                      "times_expired": 28
                    },
                    "venue": "string",
                    "time": "2024-10-21T19:49:24.364Z",
                    "people": 0,
                    "status": {
                      "status": "string"
                    }
                },
                {
                    "id": '1',
                    "user": {
                      "id": "1",
                      "name": "Marta Gonzales",
                      "phone": "1145788596",
                      "times_assisted": 15,
                      "times_expired": 0
                    },
                    "venue": "string",
                    "time": "2024-10-21T19:49:24.364Z",
                    "people": 0,
                    "status": {
                      "status": "string"
                    }
                },
                {
                    "id": '1',
                    "user": {
                      "id": "1",
                      "name": "Rodrigo Pereira",
                      "phone": "1145788596",
                      "times_assisted": 5,
                      "times_expired": 10
                    },
                    "venue": "string",
                    "time": "2024-10-21T19:49:24.364Z",
                    "people": 0,
                    "status": {
                      "status": "string"
                    }
                },
            ]
        }
        return result
    }
    const getBookings = async () =>{
        try {
            if(user) {
                const props = new GetReservationProps()
                props.start = 0;
                props.limit = 100000;
                const result:ReservationData = await GetReservations(props,user)
                // const result:ReservationData = getFalseResult()
                if(result&&result.result&&result.result.length>0) {
                    const bookings = result.result.map((item)=>item.user)
                    const set = new Set(bookings.map((item)=>JSON.stringify(item)))
                    const topBookings = Array.from(set).map((item)=>JSON.parse(item))
                    const topReservations = [...topBookings].sort((a,b)=>b.times_assisted-a.times_assisted)
                    const topCanceletions = [...topBookings].sort((a,b)=>b.times_expired-a.times_expired)
                    let index = 0;
                    let TopBookings:ChartData[] = []
                    for(const item of topReservations){
                        TopBookings.push({
                            name:item.name,
                            value:item.times_assisted,
                        })
                        index++
                        if(index>=10) break;
                    }
                    setTopBookings(TopBookings)
                    index = 0;
                    let TopFaults:ChartData[] = []
                    for(const item of topCanceletions){
                        TopFaults.push({
                            name:item.name,
                            value:item.times_expired,
                        })
                        index++
                        if(index>=10) break;
                    }
                    setTopFaults(TopFaults)
                }
            }
        } catch (err) {
            console.log("get bookings err",err)
        }
        
    }

    useEffect(()=>{
        stadistics()
        getBookings()
        // setFalseStatdistics()
        // getFalseResult()
    },[user,userData])

    return(
        <>
        <Container className="stadisics-container">
            <Row>
                <div className="stadisics-title">Estadisticas {lowAssitance&&<span className="low-assitance">Bajo Indice de Asistencias</span>}</div>
            </Row>
            {people&&<Row style={{marginBottom:8,marginTop:4,textAlign:'center'}}>
                Promedio de personas por reserva: {people}
            </Row>}
            {bookingStats.length>0&&<Row className="chart-title" style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>Estados de las Reservas</Row>}
            {bookingStats.length>0&&<Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center',height:'25vh', marginBottom:12,minHeight:200}}>
                <ResponsiveContainer width="100%" height="100%" >
                    <PieChart width={600} height={600} title="Estados de las Reservas">
                        <Pie
                        dataKey="value"
                        isAnimationActive={false}
                        data={bookingStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        label
                        >
                            {
                                bookingStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color??'green'}/>
                                ))
                            }
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Row>}
            {dates.length>0&&<Row className="chart-title" style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>Reserva por Fecha</Row>}
            {dates.length>0&&<Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center',height:'40vh', marginBottom:12}}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                    width={400}
                    height={400}
                    data={dates}
                    title="Reserva por Fecha"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Row>}
            {turns.length>0&&<Row className="chart-title" style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>Reservas por Turno</Row>}
            {turns.length>0&&<Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center',height:'40vh', marginBottom:12}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    width={400}
                    height={400}
                    data={turns}
                    title="Reservas por Turno"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                </ResponsiveContainer>
            </Row>}

            {topBookings.length>0&&<Row className="chart-title" style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>Top 10 Reservas por usuarios</Row>}
            {topBookings.length>0&&<Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center',height:'40vh', marginBottom:12}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    width={400}
                    height={400}
                    data={topBookings}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="green"/>
                    </BarChart>
                </ResponsiveContainer>
            </Row>}

            {topFaults.length>0&&<Row className="chart-title" style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>Top 10 Expiraciones por usuarios</Row>}
            {topFaults.length>0&&<Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center',height:'40vh', marginBottom:12}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    width={400}
                    height={400}
                    data={topFaults}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="red"/>
                    </BarChart>
                </ResponsiveContainer>
            </Row>}
        </Container>
        <Alert variant="danger" show={lowAssitance} onClose={() => setLowAssitance(false)} dismissible style={{position:'fixed',top:100,left:'30%',zIndex:1000}}>
            <Alert.Heading>Elevado incide de inasistencias</Alert.Heading>
            <p>
                Bajo indice de Asistencias
            </p>
        </Alert>
        </>
    )
}

export default Stadistics