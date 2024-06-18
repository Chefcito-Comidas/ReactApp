import './Home.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import {createUserPassword} from "../../api/googleAuth";

const Home = () => {
    const { Formik } = formik;

    const schema = yup.object().shape({
        firstName:yup.string().required(),
        lastName:yup.string().required(),
        phone:yup.string().required(),
        email:yup.string().required(),
        password:yup.string().required(),
    });

    const createUser = async (values:any) => {
        const user = await createUserPassword(values.email,values.password)
        if(user !== null) {
            // se creo el usuario en firebase
        } else {
            // error en la creacion de usuario
        }
    }

    return (
        <Container className="home">
            <Row className='justify-content-end'>
                <Col md="auto">
                    <div className='formContainer'>
                        <div className='formTitle'>¡Registrá tu local ahora mismo!</div>
                        <Formik
                        validationSchema={schema}
                        onSubmit={createUser}
                        initialValues={{
                            firstName:'',
                            lastName:'',
                            phone:'',
                            email:'',
                            password:''
                        }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="firstName">
                                        <Form.Control type="text" placeholder="Nombre*"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        isValid={touched.firstName && !errors.firstName}
                                         />
                                    </Form.Group>
        
                                    <Form.Group className="mb-3" controlId="lastName">
                                        <Form.Control type="text" placeholder="Apellido*" 
                                        value={values.lastName}
                                        onChange={handleChange}
                                        isValid={touched.lastName && !errors.lastName}
                                        />
                                    </Form.Group>
        
                                    <Form.Group className="mb-3" controlId="phone">
                                        <Form.Control type="text" placeholder="Telefono*" 
                                        value={values.phone}
                                        onChange={handleChange}
                                        isValid={touched.phone && !errors.phone}
                                        />
                                    </Form.Group>
        
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
                </Col>
            </Row>
        </Container>
    )
}

export default Home;