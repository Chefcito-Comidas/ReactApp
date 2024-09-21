import { Col, Container, Row } from "react-bootstrap"
import "./Stadistics.css"
import { useEffect, useState } from "react"
import { GetUser } from "../../hooks/getUser.hook"
import { useAppSelector } from "../../redux/hooks/hook"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart,Pie, Bar, BarChart } from 'recharts';
import { getStadistics } from "../../api/stadistics.api"

type ChartData = {
    name:string;
    value:number
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
                const result = await getStadistics(userData.localid,user)
                setLowAssitance(((result.expired+result.canceled)/result.total)>0.5)
                setBookingStats([
                    {name:'Cancelado',value:result.canceled},
                    {name:'Expirado',value:result.expired},
                    {name:'Finalizado',value:result.total-result.expired-result.canceled},
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
            <Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>
                {bookingStats.length>0&&<Col>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400} title="Estados de las Reservas">
                            <Pie
                            dataKey="value"
                            isAnimationActive={false}
                            data={bookingStats}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Col>}
                {dates.length>0&&<Col>
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
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>}
                {turns.length>0&&<Col>
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
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                    </ResponsiveContainer>
                </Col>}
            </Row>
        </Container>
        </>
    )
}

export default Stadistics