import "./Venue.css"
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Button, Col, Row, Image } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import { useAppSelector } from "../../redux/hooks/hook";
import { useEffect, useReducer, useState } from "react";
import { GetUser } from "../../hooks/getUser.hook";
import { CreateVenue, EditVenue, getVenue } from "../../api/venue";
import { Venue as  VenueModel, VenuePost} from "../../models/venues.model";
import Loading from "../../components/Loading/Loading";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import { ref, uploadBytesResumable, getDownloadURL,getStorage } from "firebase/storage";
import Map, {Marker} from 'react-map-gl';
import { MAP_BOX_KEY } from "../../utils/constants";

const Venue = () => {
    const { Formik } = formik;
    const userData = useAppSelector(state=>state.userData.data)
    const [venue,setVenue] = useState<VenueModel|null>(null)
    const [loading,setLoading] = useState(false)
    const [option,setOption] = useState<any[]>([])
    const [send,setSend] = useState(false)
    const [position, setPosition] = useState<any>(null);
    const [location, setLocation] = useState<any>(null);

    const [postData,setPostData] = useReducer((state:any,action:any)=>{
        return {...state,...action}
    },{
        name: '',
        location:'',
        capacity:'',
        logo: '',
        pictures: [],
        slots: []
    })
    const {
        user
    } = GetUser()

    const schema = yup.object().shape({
        name:yup.string().required(),
        capacity:yup.number().required()
    });

    const [mainImage,setMainImage] = useState<any>(null)
    const [secondaryImages,setSecondaryImages] = useState<any[]>([])
    const [secondaryImagesUrl,setSecondaryImagesUrl] = useState<string[]>([])

    const setMarker = (event:any) => {
        const data = {
            lat:event.lngLat.lat,
            lng:event.lngLat.lng,
        }
        console.log('marker',data)
        setLocation(data)
    }

    const getPositionSuccess = (position:any) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setPosition({lat:latitude,lng:longitude})
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }
      
    const getPositionError = () => {
        console.log("Unable to retrieve your location");
    }

    const getVenueData =async () => {
        if(userData&&user){
            setLoading(true)
            try {
                const data = await getVenue(user,userData.localid)
                if(data.length>0) {
                    setVenue(data[0])
                }
            } catch (err) {
                console.log('err get venue',err)
            }
            setLoading(false)
        }
    }

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError);
        // getVenueData()
    },[userData,user])

    useEffect(()=>{
        if(venue) {
            setOption(venue.slots.map((item)=>{return {value:moment(item).format("HH:mm"),label:moment(item).format("HH:mm")}}))
        }
    },[venue])

    useEffect(()=>{
        if(secondaryImagesUrl.length===secondaryImages.length){
            setPostData({pictures:secondaryImagesUrl})
        }
    },[secondaryImagesUrl])

    const updateLogo = () =>{
        const storage = getStorage();
        const storageRef = ref(storage, user?.email + "/" + new Date().getTime());
        const uploadTask = uploadBytesResumable(storageRef, mainImage);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                
            },
            (error) => {},
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setPostData({logo:downloadURL})
                });
            }
        );
    }

    const updateImages = () =>{
        const storage = getStorage();
        secondaryImages.forEach((image,index)=>{
            const storageRef = ref(storage, user?.email + "/secondaryImage/"+index+'/' + new Date().getTime());
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    
                },
                (error) => {},
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setSecondaryImagesUrl([...secondaryImagesUrl,downloadURL])
                    });
                }
            );
        })
        
    }

    const sendData = async (values:any) => {
        const data = {
            name: values.name,
            location:`${location.lat};${location.lng}`,
            capacity:values.capacity,
            slots: option.map((item)=>moment().set('hour',parseInt(item.value.split(':')[0])).set('minute',parseInt(item.value.split(':')[1])).format("YYYY-MM-DDTHH:mm"))
        }
        setPostData(data)
        updateLogo()
        updateImages()
        setSend(true)
        
    }

    const processData = async () => {
        if(user)
        if(venue&&venue.id) {
            try {
                const result = await EditVenue(user,venue.id,postData)
                if(result) getVenueData()
            } catch (err) {
                console.log("error edit venue",err)
            }
        } else {
            try {
                const result = await CreateVenue(user,postData)
                if(result) getVenueData()
            } catch (err) {
                console.log("error create venue",err)
            }
        }
        setSend(false)
    }

    useEffect(()=>{
        if(postData.logo&&(postData.pictures.length===secondaryImages.length)&&send) {
            processData()
        }
    },[postData,send])

    const deleteImage = (index:number) => {
        console.log(index)
        setSecondaryImages(secondaryImages.splice(index,1))
    }

    return(
        <Container className="Venue">
            {loading&&<Loading />}
            <Row>
                <div style={{fontSize:24,marginBottom:8}}>Mi Local</div> 
            </Row>
            <Row>
                <Formik
                validationSchema={schema}
                onSubmit={sendData}
                initialValues={{
                    name:venue?venue.name:'',
                    capacity:venue?venue.capacity:''
                }}>
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Control  placeholder="Nombre*"
                                value={values.name}
                                onChange={handleChange}
                                isValid={touched.name && !errors.name}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="location">
                                
                                {position&&
                                    <Map
                                    mapboxAccessToken={MAP_BOX_KEY}
                                    initialViewState={{
                                        longitude: position.lng,
                                        latitude: position.lat,
                                        zoom: 14
                                    }}
                                    style={{width: 600, height: 400}}
                                    mapStyle="mapbox://styles/mapbox/streets-v9"
                                    onClick={setMarker}
                                    >
                                        <Marker longitude={location.lng} latitude={location.lat}></Marker>
                                    </Map>
                                }
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="capacity">
                                <Form.Control placeholder="Capacidad*"
                                value={values.capacity}
                                onChange={handleChange}
                                isValid={touched.capacity && !errors.capacity}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="Horarios">
                                <MultiSelect
                                    options={[
                                        '8:00',
                                        '8:30',
                                        '9:00',
                                        '9:30',
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
                                    ].map((item)=>{return {label:item,value:item}})}
                                    value={option}
                                    onChange={(item:any)=>{
                                        setOption(item)
                                    }}
                                    labelledBy="Select"
                                />
                            </Form.Group>
                            <Form.Group  controlId="fotoPrincipal" className="mb-3">
                                <Form.Label>Logo</Form.Label>
                                <Col>
                                    <input type='file' accept='image/jpeg, image/png' onChange={(files:any)=>setMainImage(files.target.files[0])}></input>
                                    <Col xs={4} md={4}>
                                        {mainImage&&<Image src={URL.createObjectURL(mainImage)} thumbnail  />}
                                    </Col>
                                </Col>
                            </Form.Group>
                            <Form.Group  controlId="fotoPrincipal" className="mb-3">
                                <Form.Label >Fotos Secundarias</Form.Label>
                                <Row>
                                    <Col>
                                        <input type='file' accept='image/jpeg, image/png' onChange={(files:any)=>setSecondaryImages([...secondaryImages,files.target.files[0]])}></input>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    {secondaryImages.map((item,index)=>
                                        <Col xs={2} md={2} style={{position:'relative'}}>
                                            <Button style={{position:'absolute',right:0,backgroundColor:'transparent',color:'black',border:'none'}} onClick={()=>deleteImage(index)}>
                                                X
                                            </Button>
                                            <Image src={URL.createObjectURL(item)} thumbnail  />
                                        </Col>
                                    )}
                                </Row>
                            </Form.Group>
                            <Button className='submitButton' type="submit">
                                Guardar Datos
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Row>
            
        </Container>
    )
}

export default Venue 