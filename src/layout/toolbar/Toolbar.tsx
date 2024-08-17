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
import { SingInUser } from '../../api/authRestApi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hook';
import { setUserData } from '../../redux/reducers/UserData';
import { User } from 'firebase/auth';
import Loading from '../../components/Loading/Loading';
import { GetUser } from '../../hooks/getUser.hook';
import { useCustomNavigation } from '../../hooks/useCustomNavigation';
import { UserPost } from '../../models/user.model';

const Toolbar = () => {
    const dispatch = useAppDispatch()
    const userData = useAppSelector((state) => state.userData.data)
    const [loading,setLoading] = useState(false)
    const {
        user
    } = GetUser()
    const {
        navigateHome,
        navigateVenue,
        navigateBookings,
    } = useCustomNavigation()
    const onLogin = async (values:any) =>{
        setLoading(true)
        const user = await loginUserPassword(values.email,values.password)
        console.log('login',user)
        if(user !== null) {
            logintoApp(user)
        } else {
            // error en la creacion de usuario
        }
    }

    const { Formik } = formik;

    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
    });

    const logintoApp = async (user:User) => {
        try {
            const token = await user.getIdToken()
            console.log(token)
            // const userData = await SingInUser(token)
            const userData:UserPost = {
                email:'',
                localid:'',
            }
            dispatch(setUserData(userData))
        } catch (err) {
            console.log('err',err)
        }
        
        setLoading(false)
    } 

    useEffect(()=>{
        setLoading(true)
        if(user) {
            logintoApp(user)
        } else {
            setLoading(false)
        }
    },[user])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const goToHome = () => {
        navigateHome()
    }
    const goToVenue = () => {
        navigateVenue()
    }

    const goToBookings = () => {
        navigateBookings()
    }
    return (
        <>
            {loading&&<Loading />}
            <Stack direction="horizontal" gap={3} className='toolbar'>
                <div style={{color:'white',cursor:'pointer'}} onClick={goToHome} className="p-2" >Chefcito <Image src={image} style={{maxHeight:30}} rounded /></div>
                {userData&&<div style={{color:'white'}} className="p-2 ms-auto link"  onClick={goToVenue}>Ver mi Local</div>}
                {userData&&<div style={{color:'white'}} className="p-2 link"  onClick={goToBookings}>Ver Reservas</div>}
                {/* <div style={{color:'white'}} className="p-2 link">Preguntas Frecuentes</div> */}
                {/* <div style={{color:'white'}} className="p-2 link">Preguntas Frecuentes</div> */}
                {!userData&&<Button variant="primary" onClick={handleShow}>Ir al Portal</Button>}
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