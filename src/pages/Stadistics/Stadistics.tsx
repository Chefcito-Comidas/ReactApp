/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row } from "react-bootstrap"
import "./Stadistics.css"
import { useEffect, useState } from "react"
import { GetUser } from "../../hooks/getUser.hook"
import { useAppSelector } from "../../redux/hooks/hook"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart,Pie, Bar, BarChart,Cell } from 'recharts';
import { getStadistics } from "../../api/stadistics.api"

type ChartData = {
    name:string;
    value:number;
    color?:string;
}
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

    const stadistics = async () => {
        try {
            if(user&&userData) {
                const result = await getStadistics(userData.data.localid,user)
                setLowAssitance(((result.expired+result.canceled)/result.total)>0.5)
                setBookingStats([
                    {name:'Cancelado',value:result.canceled,color:'orange'},
                    {name:'Expirado',value:result.expired,color:'red'},
                    {name:'Finalizado',value:result.total-result.expired-result.canceled,color:'green'},
                ])
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
                        name:key,
                        value:result.days.means[key]
                    })
                }
                setDates(date)

                // setBookingStats([
                //     {name:'Cancelado',value:9,color:'orange'},
                //     {name:'Expirado',value:11,color:'red'},
                //     {name:'Finalizado',value:157,color:'green'},
                // ])
                // setPeople(Math.floor(Math.random() * 6)+1,)
                // const turn:ChartData[] = []
                // turn.push(
                //     {
                //         name:"10:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"10:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"11:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"11:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"12:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"12:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"13:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"13:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"14:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"14:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"15:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"15:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"16:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"16:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"17:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"17:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"18:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"18:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"19:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"19:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"20:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"20:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"21:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"21:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"22:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"22:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"23:00",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                //     {
                //         name:"23:30",
                //         value:Math.floor(Math.random() * 30)+1,
                //     },
                // )
                // setTurns(turn)

                // const date:ChartData[] = []
                // date.push(
                //     {"name": "03/10/2024", "value": 38},
                //     {"name": "04/10/2024", "value": 4},
                //     {"name": "05/10/2024", "value": 32},
                //     {"name": "06/10/2024", "value": 60},
                //     {"name": "07/10/2024", "value": 29},
                //     {"name": "08/10/2024", "value": 24},
                //     {"name": "09/10/2024", "value": 58},
                //     {"name": "10/10/2024", "value": 10},
                //     {"name": "11/10/2024", "value": 61},
                //     {"name": "12/10/2024", "value": 17},
                //     {"name": "13/10/2024", "value": 99},
                //     {"name": "14/10/2024", "value": 83},
                //     {"name": "15/10/2024", "value": 77},
                //     {"name": "16/10/2024", "value": 94},
                //     {"name": "17/10/2024", "value": 38},
                //     {"name": "18/10/2024", "value": 56},
                //     {"name": "19/10/2024", "value": 82},
                //     {"name": "20/10/2024", "value": 79},
                //     {"name": "21/10/2024", "value": 18},
                //     {"name": "22/10/2024", "value": 55},
                // )
                // setDates(date)
            }
        } catch (err) {
            console.error('get stats error',err)
        }
    }

    useEffect(()=>{
        stadistics()
    },[user,userData])

    useEffect(()=>{
        if(lowAssitance) {
            alert("Bajo indice de Asistencias")
        }
    },[lowAssitance])
    return(
        <>
        <Container className="stadisics-container">
            <Row>
                <div className="stadisics-title">Estadisticas {lowAssitance&&<span className="low-assitance">Bajo Indice de Asistencias</span>}</div>
            </Row>
            {people&&<Row style={{marginBottom:8,marginTop:4,textAlign:'center'}}>
                Promedio de personas por reserva: {people}
            </Row>}
            {bookingStats.length>0&&<Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center',height:'50vh'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={500} height={500} title="Estados de las Reservas">
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
            {dates.length>0&&<Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center',height:'50vh'}}>
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
            {turns.length>0&&<Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center',height:'50vh'}}>
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
        </Container>
        </>
    )
}

export default Stadistics