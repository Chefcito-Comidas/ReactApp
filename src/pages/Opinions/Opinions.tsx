import { useEffect, useState } from "react"
import "./Opinions.css"
import { Opinion } from "../../models/opinion.model"
import { GetUser } from "../../hooks/getUser.hook"
import { GetOpinonProps, getOpinonsApi, getSummarieApi } from "../../api/opinions.api"
import { useAppSelector } from "../../redux/hooks/hook"
import Loading from "../../components/Loading/Loading"
import { Container, Row, Table } from "react-bootstrap"
import moment from "moment"

const Opinions = () => {
    const [loading,setLoading] = useState(false)
    const [opinons,setOpinions] = useState<Opinion[]>([])
    const userData = useAppSelector(state=>state.userData.data)
    const [summarie,setSummarie] = useState('')
    const {
        user
    } = GetUser()

    const getOpinons = async () => {
        try {
            if(user&&userData){
                setLoading(true)
                const props:GetOpinonProps = new GetOpinonProps()
                props.start = 0;
                props.limit = 100000;
                props.venue = userData.data.localid
                console.log('getOpinons',userData,props)
                const result = await getOpinonsApi(props,user)
                setOpinions(result.result)
            }
        } catch (err) {

        }
        setLoading(false)
        
    }

    const getSummarie = async () => {
        try {
            if(userData&&user) {
                const result = await getSummarieApi(userData.data.localid,user)
                setSummarie(result.text)
            }
        } catch (err) {
            console.error('getSummarie Error',err)
        }
    }

    useEffect(()=>{
        getOpinons()
        getSummarie()
    },[user,userData])
    return (
        <>
        <Container className="opinion-container">
            <Row>
                <div className="opinion-title">Opinones</div>
            </Row>

            <Row>
                <div className="opinion-summarie">Resumen: {summarie?summarie:'En estos momentos no hay un resumen de opiniones'}</div>
            </Row>
            <Row style={{justifyContent:'center',flexDirection:'column',alignContent:'center'}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th><div className="Center">Fecha</div></th>
                            <th><div className="Center">Reserva</div></th>
                            <th><div className="Center">Opinion</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {opinons.length>0&&
                        opinons.map((opinion)=>{
                            return(
                                <tr>
                                    <td>
                                        <div className="Center">{moment(opinion.date).format("DD/MM/YYYY HH:mm")}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{opinion.reservation}</div>
                                    </td>
                                    <td>
                                        <div className="Center">{opinion.opinion}</div>
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

export default Opinions