import './Home.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Button,Modal } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import {createUserPassword,signInWithGoogle,resetpassword} from "../../api/googleAuth";
import { CreateUser } from '../../api/authRestApi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hook';
import Loading from '../../components/Loading/Loading';
import { useState } from 'react';
import { setUserData } from '../../redux/reducers/UserData';

const Home = () => {
    const { Formik } = formik;
    const userData = useAppSelector((state) => state.userData.data)
    const dispatch = useAppDispatch()
    const [loading,setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [email, setEmail] = useState('');

    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
        name:yup.string().required(),
        phone:yup.string().required(),
    });

    const createUser = async (values:any) => {
        setLoading(true)
        const user = await createUserPassword(values.email,values.password)
        if(user !== null) {
            // se creo el usuario en firebase
            try {
                const token = await user.getIdToken()
                const newUser = await CreateUser(token,values.name,values.phone)
                console.log("new user",newUser,token)
                dispatch(setUserData(newUser))
            } catch (err) {
                console.log('err',err)
            }
            setLoading(false)
            
        } else {
            // error en la creacion de usuario
        }
    }

    const googleLogin = async () => {
        const user = await signInWithGoogle()
        console.log('login',user)
        const token = await user?.user.getIdToken()
        if(token) {
            const newUser = await CreateUser(token,user?.user.displayName??'',user?.user.phoneNumber??'')
            console.log("new user",newUser,token)
            dispatch(setUserData(newUser))
        }
    }

    const recoverPassword = async () => {
        await resetpassword(email)
        handleClose()
    }
    return (
        <Container className="home">
            {loading&&<Loading />}
            <Row className='justify-content-end'>
                {!userData&&<Col md="auto">
                    <div className='formContainer'>
                        <div className='formTitle'>¡Registrá tu local ahora mismo!</div>
                        <Formik
                        validationSchema={schema}
                        onSubmit={createUser}
                        initialValues={{
                            email:'',
                            password:'',
                            name:'',
                            phone:''
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
                                        <Form.Control type="text" placeholder="Nombre*"
                                        value={values.name}
                                        onChange={handleChange}
                                        isValid={touched.name && !errors.name}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="password">
                                        <Form.Control type="text" placeholder="Telefono*"
                                        value={values.phone}
                                        onChange={handleChange}
                                        isValid={touched.phone && !errors.phone}
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
                                        Comenzar
                                    </Button>

                                    <Button className='submitButton' onClick={googleLogin}>
                                        Ingresar con Google
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                        <div className='recover-password'><span style={{cursor:'pointer'}} onClick={handleShow}>¿Olvidaste tu contraseña?</span></div>
                    </div>
                </Col>}
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Recuperar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Control type="email" placeholder="Email*"
                            value={email}
                            onChange={(value)=>setEmail(value.target.value)}
                            isValid={email!==''}
                            />
                        </Form.Group>
                        <Button className='submitButton' onClick={recoverPassword} disabled={email!==''}>
                            Ingresar con Google
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default Home;