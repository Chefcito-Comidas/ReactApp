import './toolbar.css';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import image from "../../assets/images/chefcito.jpg"
const Toolbar = () => {

    return (
        <Stack direction="horizontal" gap={3} className='toolbar'>
            <div style={{color:'white'}} className="p-2">Chefcito <Image src={image} style={{maxHeight:30}} rounded /></div>
            <div style={{color:'white'}} className="p-2 ms-auto link">¿Como Funcionamos?</div>
            <div style={{color:'white'}} className="p-2 link">Preguntas Frecuentes</div>
            <Button variant="primary">Ir al Portal</Button>
        </Stack>
    )
}

export default Toolbar;