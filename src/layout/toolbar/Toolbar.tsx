import './toolbar.css';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import image from "../../assets/images/chefcito.jpg"
import { loginUserPassword, auth } from '../../api/googleAuth';
import { useEffect, useState } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';

const Toolbar = () => {
    const onLogin = async (values:any) =>{
        const user = await loginUserPassword(values.email,values.password)
        console.log('login',user)
        if(user !== null) {
            // se creo el usuario en firebase
        } else {
            // error en la creacion de usuario
        }
    }

    const { Formik } = formik;

    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
    });

    useEffect(()=>{
        auth.authStateReady().then(()=>{
            console.log(auth.currentUser)
        })
    },[])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Stack direction="horizontal" gap={3} className='toolbar'>
                <div style={{color:'white'}} className="p-2">Chefcito <Image src={image} style={{maxHeight:30}} rounded /></div>
                <div style={{color:'white'}} className="p-2 ms-auto link">¿Como Funcionamos?</div>
                <div style={{color:'white'}} className="p-2 link">Preguntas Frecuentes</div>
                <div style={{color:'white'}} className="p-2 link">Preguntas Frecuentes</div>
                <Button variant="primary" onClick={handleShow}>Ir al Portal</Button>
            </Stack>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Log in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                            validationSchema={schema}
                            onSubmit={onLogin}
                            initialValues={{
                                email:'',
                                password:''
                            }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Control type="email" placeholder="Email*"
                                        value={values.email}
                                        onChange={handleChange}
                                        isValid={touched.email && !errors.email}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Control type="password" placeholder="Contraseña*"
                                        value={values.password}
                                        onChange={handleChange}
                                        isValid={touched.password && !errors.password}
                                        />
                                    </Form.Group>
                                    <Button className='submitButton' type="submit">
                                        Ingresar
                                    </Button>
                                </Form>
                            )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Toolbar;