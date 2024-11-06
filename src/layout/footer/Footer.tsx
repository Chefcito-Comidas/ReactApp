import './Footer.css';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import image from "../../assets/images/Logo_App1.jpg"
import { Row } from 'react-bootstrap';
const Footer = () => {

    return (
        <Stack direction="horizontal" gap={3} className='footer'>
            <Row className="p-2">
                <div style={{color:'white'}}>Chefcito <Image src={image} style={{maxHeight:30}} rounded /></div>
                <div style={{color:'white'}}>Crezcamos Juntos</div>
            </Row>
            {/* <Button className='p-2 ms-auto' style={{backgroundColor:'transparent',border:'none'}}>Ir al Portal</Button> */}
        </Stack>
    )
}

export default Footer;