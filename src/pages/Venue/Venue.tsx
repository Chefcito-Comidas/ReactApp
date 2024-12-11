/* eslint-disable react-hooks/exhaustive-deps */
import "./Venue.css"
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Button, Col, Row, Image, Alert } from 'react-bootstrap';
import { useAppSelector } from "../../redux/hooks/hook";
import { useEffect, useReducer, useRef, useState } from "react";
import { GetUser } from "../../hooks/getUser.hook";
import { CreateVenue, EditVenue, getVenue } from "../../api/venue";
import { Venue as  VenueModel} from "../../models/venues.model";
import Loading from "../../components/Loading/Loading";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import { ref, uploadBytesResumable, getDownloadURL,getStorage } from "firebase/storage";
import Map, {Marker} from 'react-map-gl';
import { MAP_BOX_KEY } from "../../utils/constants";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

const Venue = () => {
    const tags = [
        "Arepas",
        "Cafeteria",
        "Carnes",
        "Comida Armenia",
        "Comida China",
        "Comida Japonesa",
        "Comida Mexicana",
        "Comida Vegana",
        "Comida Vegetariana",
        "Empanadas",
        "Hamburguesas",
        "Helados",
        "Licuado y jugos",
        "Lomitos",
        "Milanesas",
        "Panaderia",
        "Panchos",
        "Pasta",
        "Pescado y mariscos",
        "Picadas",
        "Pizzas",
        "Poke",
        "Pollo",
        "Postres",
        "Saludable",
        "Sushi",
        "Sándwiches",
        "Tartas",
        "Tortillas",
        "Woks",
        "Wraps",
    ]
    const hours = [
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
        '22:00',
        '22:30',
        '23:00',
        '23:30',
    ]
    const features = [
        "Estacionamiento",
        "Wifi",
        "Mascotas",
        "Aire libre",
        "Veggie",
        "Movilidad reducida",
        "Musica en vivo",
        "Area fumadores"
    ];
    const userData = useAppSelector(state=>state.userData.data)
    const [venue,setVenue] =  useReducer((state:VenueModel,action:Partial<VenueModel>)=>{
        return {...state,...action}
    },{
        id: "",
        name: "",
        location: "",
        capacity: 0,
        logo: "",
        pictures: [],
        slots: [],
        characteristics: [],
        vacations: [],
        features:[],
        reservationLeadTime: 0,
        status: {
            status: "Unconfirmed"
        },
        menu:"",
    })
    const [showSuccess,setShowSuccess] = useState(false)
    const [showError,setShowError] = useState(false)
    const [loading,setLoading] = useState(false)
    const [option,setOption] = useState<any[]>([])
    const [tagsOption,setTagsOption] = useState<any[]>([])
    const [featuresOption,setFeaturesOption] = useState<any[]>([])
    const [position, setPosition] = useState<any>(null);
    const [location, setLocation] = useState<any>(null);
    const newData = useRef(true)
    const {
        user
    } = GetUser()

    const setMarker = (event:any) => {
        const data = {
            lat:event?.lngLat?.lat,
            lng:event?.lngLat?.lng,
        }
        console.log('marker',data)
        setLocation(data)
    }

    useEffect(()=>{
        console.log('option',option)
    },[option])
    const getPositionSuccess = (position:any) => {
        console.log('position',position)
        const latitude = position?.coords?.latitude;
        const longitude = position?.coords?.longitude;
        setPosition({lat:latitude,lng:longitude})
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }
      
    const getPositionError = () => {
        console.log("Unable to retrieve your location");
    }

    const getVenueData =async () => {
        if(userData&&user&&userData.data&&userData.data.localid){
            setLoading(true)
            try {
                const data = await getVenue(user)
                if(data&&!data.description&&!data.endpoint) {
                    setVenue({...data,id:userData.data.localid})
                    setLocation({
                        lat:data.location.split(',')[0],
                        lng:data.location.split(',')[1]
                    })
                } else {
                    setVenue({id:userData.data.localid,name:userData.data.name})
                }
                if(data && data.name) {
                    newData.current = false
                }
            } catch (err) {
                console.log('err get venue',err)
                console.log('userData',userData)
                setVenue({id:userData.data.localid,name:userData.data.name})
            }
            setLoading(false)
        }
    }
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError);
    },[])

    useEffect(()=>{
        setTimeout(()=>{
            setShowError(false)
            setShowSuccess(false)
        },1000)
    },[showError,showSuccess])

    useEffect(()=>{
        getVenueData()
    },[userData,user])

    useEffect(()=>{
        if(venue) {
            setOption(venue.slots.map((item)=>{return {value:moment(item).add(-3,'hour').local().format("HH:mm"),label:moment(item).add(-3,'hour').local().format("HH:mm")}}))
            setTagsOption(venue.characteristics.map((item)=>{return {value:item,label:item}}))
            setFeaturesOption(venue.features.map((item)=>{return {value:item,label:item}}))
        }
    },[venue])

    const updateLogo = (image:any) =>{
        const storage = getStorage();
        const storageRef = ref(storage, user?.email + "/" + new Date().getTime());
        const uploadTask = uploadBytesResumable(storageRef, image);
        setLoading(true)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                
            },
            (error) => {},
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setLoading(false)
                    setVenue({
                        logo:downloadURL
                    })
                });
            }
        );
    }

    const updateMenu = (menu:any) =>{
        const storage = getStorage();
        const storageRef = ref(storage, user?.email + "/menu/" + new Date().getTime());
        const uploadTask = uploadBytesResumable(storageRef, menu);
        setLoading(true)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                
            },
            (error) => {},
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setLoading(false)
                    setVenue({
                        menu:downloadURL
                    })
                });
            }
        );
    }

    const updateImages = (file:any) =>{
        const storage = getStorage();
        const storageRef = ref(storage, user?.email + "/secondaryImage/"+venue.pictures.length+1+'/' + new Date().getTime());
        const uploadTask = uploadBytesResumable(storageRef, file);
        setLoading(true)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                
            },
            (error) => {},
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setLoading(false)
                    setVenue({
                        pictures:[...venue.pictures,downloadURL]
                    })
                });
            }
        );
        
    }

    const sendData = async (values:any) => {
        try {
            if(user) {
                if(newData.current) {
                    venue.location = location.lat +','+location.lng
                    CreateVenue(user,venue)
                } else {
                    EditVenue(user,venue)
                }
            }
            setShowSuccess(true)
        } catch (err){
            console.log('error guardando datos del local',err)
            setShowError(true)
        }
        
    }

    return(
        <Container className="Venue">
            {loading&&<Loading />}
            <Row>
                <div style={{fontSize:24,marginBottom:8}}>Mi Local</div> 
            </Row>
            <Row>
            <Form validated>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Nombre*</Form.Label>
                            <Form.Control  placeholder="Nombre*" required
                            value={venue.name}
                            onChange={(event)=>{
                                setVenue({
                                    name:event.target.value
                                })
                            }}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className="mb-3" controlId="capacity">
                            <Form.Label>Capacidad*</Form.Label>
                            <Form.Control placeholder="Capacidad*" required
                            value={venue.capacity}
                            onChange={(event)=>{
                                setVenue({
                                    capacity:parseInt(event.target.value)
                                })
                            }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="Horarios">
                            <Form.Label>Horarios*</Form.Label>
                            <MultiSelect
                            options={hours.map((item)=>{return {label:item,value:item}})}
                            value={option}
                            onChange={(data:any)=>{
                                setOption(data)
                                setVenue({
                                    slots:data.map((item:any)=>moment().set('hour',parseInt(item.value.split(':')[0])).set('minute',parseInt(item.value.split(':')[1])).toISOString())
                                })
                            }}
                            labelledBy="Select"
                            className={option.length>0?'field-ready':''}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className="mb-3" controlId="reservationLeadTime">
                            <Form.Label>Tiempo Antes de la Reserva en días*</Form.Label>
                            <Form.Control placeholder="Tiempo Antes de la Reserva en días*" required
                            value={venue.reservationLeadTime}
                            onChange={(event)=>{
                                setVenue({
                                    reservationLeadTime:parseInt(event.target.value)
                                })
                            }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="fecha">
                            <Form.Label column>
                                <DatePicker
                                value={venue.vacations.map((item)=>moment(item).toDate())}
                                onChange={(date)=>{
                                    setVenue({vacations:[
                                        ...date.map(item=>moment(item.format('YYYY-MM-DDTHH:mm')).toISOString())
                                    ]})
                                }}
                                format="DD/MM/YYYY"
                                sort
                                multiple
                                plugins={[
                                    <DatePanel markFocused />
                                ]}
                                render={
                                    <Button>
                                        Editar Vacaciones
                                    </Button>
                                }
                                />
                            </Form.Label>
                            <Col >
                                {
                                    venue.vacations.map((item)=><Row>{moment(item).local().format('DD/MM/YYYY')}</Row>)
                                }
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group className="mb-3" controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <MultiSelect
                            ClearSelectedIcon={null}
                            options={tags.map((item)=>{return {label:item,value:item}})}
                            value={tagsOption}
                            onChange={(data:any)=>{
                                setTagsOption(data)
                                setVenue({
                                    characteristics:data.map((item:any)=>item.value)
                                })
                            }}
                            labelledBy="Select"
                            className={tagsOption.length>0?'field-ready':''}
                            />
                        </Form.Group>
                    </Col>
                    
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="features">
                            <Form.Label>Caracteristicas</Form.Label>
                            <MultiSelect
                            ClearSelectedIcon={null}
                            options={features.map((item)=>{return {label:item,value:item}})}
                            value={featuresOption}
                            onChange={(data:any)=>{
                                setFeaturesOption(data)
                                setVenue({
                                    features:data.map((item:any)=>item.value)
                                })
                            }}
                            labelledBy="Select"
                            className={featuresOption.length>0?'field-ready':''}
                            />
                        </Form.Group>
                    </Col>
                    <Col></Col>
                </Row>
                
                <Form.Group className="mb-3" controlId="location">
                    <Form.Label>Ubicacion</Form.Label>
                    {position&&
                        <Map
                        mapboxAccessToken={MAP_BOX_KEY}
                        initialViewState={{
                            longitude: position?.lng,
                            latitude: position?.lat,
                            zoom: 14
                        }}
                        style={{width: 600, height: 400}}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        onClick={setMarker}
                        >
                            {location&&<Marker longitude={location?.lng} latitude={location?.lat}></Marker>}
                        </Map>
                    }
                </Form.Group>
                <Form.Group  controlId="fotoPrincipal" className="mb-3">
                    <Form.Label>Logo</Form.Label>
                    <Col>
                        <input type='file' accept='image/jpeg, image/png' onChange={(files:any)=>updateLogo(files.target.files[0])}></input>
                        <Col xs={4} md={4}>
                            {venue.logo&&<Image src={venue.logo} thumbnail  />}
                        </Col>
                    </Col>
                </Form.Group>
                <Form.Group  controlId="fotoPrincipal" className="mb-3">
                    <Form.Label>Menu</Form.Label>
                    <Col>
                        <input type='file' accept='.pdf' onChange={(files:any)=>updateMenu(files.target.files[0])}></input>
                        {/* <Col xs={4} md={4}>
                            {venue.menu&&<Image src={venue.menu} thumbnail  />}
                        </Col> */}
                    </Col>
                </Form.Group>
                <Form.Group  controlId="fotoPrincipal" className="mb-3">
                    <Form.Label >Fotos Secundarias</Form.Label>
                    <Row>
                        <Col>
                            <input type='file' accept='image/jpeg, image/png' onChange={(files:any)=>updateImages(files.target.files[0])}></input>
                        </Col>
                    </Row>
                    
                    <Row>
                        {venue.pictures.map((item,index)=>
                            <Col xs={2} md={2} style={{position:'relative'}} key={index}>
                                <Button 
                                onClick={()=>{
                                    setVenue({
                                        pictures:[...venue.pictures.filter((image=>image!==item))]
                                    })
                                }}
                                style={{position:'absolute',right:0,backgroundColor:'transparent',color:'black',border:'none',fontWeight:'500'}}>
                                    X
                                </Button>
                                <Image src={item} thumbnail  />
                            </Col>
                        )}
                    </Row>
                </Form.Group>
                <Button className='submitButton' type="button" onClick={sendData}>
                    Guardar Datos
                </Button>
            </Form>
            </Row>
            <Alert variant="danger" show={showError} onClose={() => setShowError(false)} dismissible style={{position:'fixed',top:50,left:'30%',zIndex:1000}}>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                    Hubo un error al intentar guardar los datos del local. Intente otravez pasado un tiempo
                </p>
            </Alert>
            <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible style={{position:'fixed',top:50,left:'40%',zIndex:1000}}>
                <Alert.Heading>Exito</Alert.Heading>
                <p>
                    Datos guardados con exito
                </p>
            </Alert>
        </Container>
    )
}

export default Venue 