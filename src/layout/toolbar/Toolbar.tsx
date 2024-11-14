/* eslint-disable react-hooks/exhaustive-deps */
import './toolbar.css';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import image from "../../assets/images/Logo_App1.jpg"
import { loginUserPassword, signInWithGoogle,logout, resetpassword } from '../../api/googleAuth';
import { useEffect, useState } from 'react';
import * as formik from 'formik';
import * as yup from 'yup';
import { CreateUser, SingInUser } from '../../api/authRestApi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hook';
import { setUserData } from '../../redux/reducers/UserData';
import { User } from 'firebase/auth';
import Loading from '../../components/Loading/Loading';
import { GetUser } from '../../hooks/getUser.hook';
import { useCustomNavigation } from '../../hooks/useCustomNavigation';
import { Alert } from 'react-bootstrap';
import QRCode from 'react-qr-code';

const Toolbar = () => {
    const dispatch = useAppDispatch()
    const userData = useAppSelector((state) => state.userData.data)
    const [loading,setLoading] = useState(false)
    const [showError,setShowError] = useState(false)
    const [showQr,setShowQr] = useState(false)

    useEffect(()=>{
        setTimeout(()=>{
            setShowError(false)
        },3000)
    },[showError])

    const {
        user
    } = GetUser()
    const {
        navigateHome,
        navigateVenue,
        navigateBookings,
        navigateOpinions,
        navigateStadistics,
    } = useCustomNavigation()
    const onLogin = async (values:any) =>{
        setLoading(true)
        const user = await loginUserPassword(values.email,values.password)
        console.log('login',user)
        if(user !== null) {
            handleClose()
            logintoApp(user)
        } else {
            // error en la creacion de usuario
            setLoading(false)
            setShowError(true)
        }
    }

    const { Formik } = formik;

    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
    });
    const [email, setEmail] = useState('');

    const logintoApp = async (user:User) => {
        try {
            const token = await user.getIdToken()
            console.log(token)
            const userData = await SingInUser(token)
            dispatch(setUserData(userData))

        } catch (err) {
            console.log('err',err)
        }
        
        setLoading(false)
    } 

    const googleLogin = async () => {
        const user = await signInWithGoogle()
        console.log('login',user)
        const token = await user?.user.getIdToken()
        if(token) {
            setLoading(true)
            const newUser = await CreateUser(token,user?.user.displayName??'',user?.user.phoneNumber??'')
            console.log("new user",newUser,token)
            if(!newUser.description){
                dispatch(setUserData(newUser))
            } else {
                const userData = await SingInUser(token)
                dispatch(setUserData(userData))
            }
            setLoading(false)
        }
        handleClose()
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
    const [showPassChange, setShowPassChange] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowPassChange = () => {
        setShow(false)
        setShowPassChange(true)
    };
    const handleClosePassChange = () => {
        setShowPassChange(false)
        setShow(true)
    };

    const goToHome = () => {
        navigateHome()
    }
    const goToVenue = () => {
        navigateVenue()
    }

    const goToBookings = async () => {
        navigateBookings()
    }

    const goToOpinions = () => {
        navigateOpinions()
    }

    const goToStadistics = () => {
        navigateStadistics()
    }

    const generateQr = () => {
        setShowQr(true)
    }

    const logOut = async () => {
        logout()
        navigateHome()
        window.location.reload()
    }

    const recoverPassword = async () => {
        await resetpassword(email)
        handleClosePassChange()
    }
    return (
        <>
            {loading&&<Loading />}
            <Stack direction="horizontal" gap={3} className='toolbar'>
                <div style={{color:'white',cursor:'pointer'}} onClick={goToHome} className="p-2" >Chefcito <Image src={image} style={{maxHeight:30}} rounded /></div>
                {userData&&<div style={{color:'white'}} className="p-2 ms-auto link"  onClick={goToVenue}>Mi Local</div>}
                {userData&&<div style={{color:'white'}} className="p-2 link"  onClick={goToBookings}>Reservas</div>}
                {userData&&<div style={{color:'white'}} className="p-2 link"  onClick={goToOpinions}>Opiniones</div>}
                {userData&&<div style={{color:'white'}} className="p-2 link"  onClick={goToStadistics}>Estadisticas</div>}
                {userData&&<div style={{color:'white'}} className="p-2 link"  onClick={generateQr}>Generar QR</div>}
                {userData&&<div style={{color:'white'}} className="p-2 link"  onClick={logOut}>Log Out</div>}
                {/* <div style={{color:'white'}} className="p-2 link">Preguntas Frecuentes</div> */}
                {/* <div style={{color:'white'}} className="p-2 link">Preguntas Frecuentes</div> */}
                {!userData&&<Button className='portal-button' onClick={handleShow}>Ir al Portal</Button>}
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

                                    <Button className='submitButton' onClick={googleLogin}>
                                        Ingresar con Google
                                    </Button>

                                    <div className='recover-password'><span style={{cursor:'pointer'}} onClick={handleShowPassChange}>¿Olvidaste tu contraseña?</span></div>
                                </Form>
                            )}
                    </Formik>
                </Modal.Body>
            </Modal>
            <Modal show={showQr} onHide={()=>setShowQr(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Qr</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display:'flex',justifyContent:'center'}}>
                    {userData?.data?.localid&&<QRCode value={userData.data.localid} />}
                </Modal.Body>
            </Modal>
            <Modal show={showPassChange} onHide={handleClosePassChange}>
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
                        <Button className='submitButton' onClick={recoverPassword} disabled={email===''}>
                            Recuperar contraseña
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Alert variant="danger" show={showError} onClose={() => setShowError(false)} dismissible style={{position:'fixed',top:100,left:'30%',zIndex:100000}}>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                    Mail o contraseña incorrecto
                </p>
            </Alert>
        </>
    )
}

export default Toolbar;