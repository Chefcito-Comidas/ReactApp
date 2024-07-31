import { Spinner } from "react-bootstrap"
const Loading = () => {
    return(
        <div style={{
            position:'absolute',
            top:0,
            bottom:0,
            left:0,
            right:0,
            width:'100vw',
            height:'100vh',
            display:'flex',
            justifyContent:'center',
            justifyItems:'center',
            backgroundColor:'rgba(158, 158, 158, 0.7)'
        }}>
            <Spinner variant="primary" style={{width:120,height:120}}/>
        </div>
    )
}

export default Loading