import './Home.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import {createUserPassword} from "../../api/googleAuth";
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
    const schema = yup.object().shape({
        email:yup.string().required(),
        password:yup.string().required(),
    });

    const createUser = async (values:any) => {
        setLoading(true)
        const user = await createUserPassword(values.email,values.password)
        if(user !== null) {
            // se creo el usuario en firebase
            try {
                const token = await user.getIdToken()
                const newUser = await CreateUser(token)
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
                                        Comenzar
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Col>}
            </Row>
        </Container>
    )
}

export default Home;