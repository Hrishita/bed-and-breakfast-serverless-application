import React, { useState,useEffect,forwardRef } from 'react'
import "./Search.css"
import { toast } from 'react-toastify';
import logo from '../../Images/NoUser.jpg'
import {getRoomTypes,getReservations,addReservation,postInvoicePub,getRooms,updateRoomFieldById,postRoomPub} from '../../api/axiosCall';
import { Row,Container} from "react-bootstrap";
import {InputLabel ,MenuItem ,FormControl ,Select,TextField,ButtonBase } from '@mui/material';
import {Navigation} from '../Common/Navigation';
import { experimentalStyled as styled } from '@mui/material/styles';
import {Box,Paper,Grid,Typography} from '@mui/material';


function Search() {
    
    const [search, setSearch] = useState({ ReservationId:'',CustomerId:'',RoomId:'',BookingDate:new Date().toISOString().slice(0, 10),StartDate: '',EndDate: '',Occupancy: '',TotalAmt:null,RoomTypeId:'',RoomImage:'',RoomFacilityId: []});
    const [roomsData,setRoomsData] = useState([]);
    const [searchData,setSearchData] = useState([]);
    const [roomTypesData,setRoomTypesData] = useState([]);
    const [reservationsData,setReservationsData] = useState([]);
    const [warn,setWarn] = useState({ StartDate: false,EndDate: false });
    const [msg,setMsg] = useState({ StartDate: '',EndDate: ''});
    const user = localStorage.getItem("token");
    var json = JSON.parse(user);
    useEffect(() => {
        getRoomTypesData();
        getRoomsData();
        getReservationsData(); 
    }, []);
    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '2500px',
        height: '250px',
    });
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        margin: '15px',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        minWidth: '400px',
        color: theme.palette.text.secondary,
    }));
    React.useEffect(function getMaxId() {
        const ids = reservationsData.map(object => {
            return object.ReservationId;
        });
        (ids.length === 0)? setSearch({...search,ReservationId:1,CustomerId:'',RoomId:'',BookingDate:new Date().toISOString().slice(0, 10),StartDate: '',EndDate: '',Occupancy: '',TotalAmt:null,RoomTypeId:'',RoomImage:'',RoomFacilityId: [],ExtraFacilityId:[]}):
            setSearch({...search,ReservationId:Math.max(...ids)+1,CustomerId:'',RoomId:'',BookingDate:new Date().toISOString().slice(0, 10),StartDate: '',EndDate: '',Occupancy: '',TotalAmt:null,RoomTypeId:'',RoomImage:'',RoomFacilityId: [],ExtraFacilityId:[]});
        setWarn({...search,StartDate: false,EndDate: false});
        setMsg({...search,StartDate: '',EndDate: ''});
        getRoomsData();
    }, [reservationsData]);
    const getReservationsData = (e) =>  {
        getReservations().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setReservationsData(res.data.Data);
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 201) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('Reservations fetching Failed.');
                }
            });
    }
    const getRoomTypesData = (e) =>  {
        getRoomTypes().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setRoomTypesData(res.data.Data); 
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 201) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('RoomType fetching Failed.');
                }
            });
    }
    const getRoomsData = (e) =>  {
        getRooms().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setRoomsData(res.data.Data); 
                        setSearchData(res.data.Data);
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 201) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('RoomType fetching Failed.');
                }
            });
    }
 const getRoomName=(data)=>{
    let result = null;
    roomTypesData.forEach(item => {
        if (item.RoomTypeId===data) result=item.RoomTypeName;
    });
    return result;
 }
 const getRoomCost=(data)=>{
    let result = null;
    roomTypesData.forEach(item => {
        if (item.RoomTypeId===data) result=item.RoomTypeCost;
    });
    return result;
 };
  const onChangeRoomType=(event) =>{  
    const foundRoom =  [];  
    roomTypesData.forEach(x => {
        if (x.RoomTypeName.includes(event.target.value)) 
        {
            roomsData.forEach((room) => {
                if(room.RoomTypeId===x.RoomTypeId && room.RoomStatus==='Available'){
                   let arr=roomsData.filter((item) => item.RoomTypeId === x.RoomTypeId);
                    foundRoom.push(arr[0]);
                }
            })      
        } 
    });
    setSearchData(foundRoom);
    setSearch({...search,RoomTypeId:event.target.value});
  };
  const onChangeOccupancy=(event) =>{  
    const foundRoom =  [];  
    roomTypesData.forEach(x => {
        if (x.RoomMaxOcup>=event.target.value) 
        {
            roomsData.forEach((room) => {
                if(room.RoomTypeId===x.RoomTypeId && room.RoomStatus==='Available'){
                    let arr=roomsData.filter((item) => (item.RoomTypeId === x.RoomTypeId));
                    foundRoom.push(arr[0]);
                }
            })       
        }
    });
    setSearchData(foundRoom);
    setSearch({...search,Occupancy:event.target.value});
  };
   const onChangeAmt=(event) =>{  
    const foundRoom =  [];  
    roomTypesData.forEach(x => {
        if (x.RoomTypeCost<=event.target.value) 
        {
            roomsData.forEach((room) => {
                if(room.RoomTypeId===x.RoomTypeId && room.RoomStatus==='Available'){                    
                    let arr=roomsData.filter((item) => (item.RoomTypeId === x.RoomTypeId));
                    foundRoom.push(arr[0]);
                }
            })            
        }
    });
    setSearchData(foundRoom);
    setSearch({...search,TotalAmt:event.target.value});
  };
  
  const addReservationBtn=(room) =>{
    var date1 = new Date(search.StartDate);
    var date2 = new Date(search.EndDate);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    var TotalAmount= Difference_In_Days*getRoomCost(room.RoomTypeId);
    const body={ ReservationId:search.ReservationId,CustomerId:json.CustomerId,RoomId:room.RoomId,BookingDate:new Date().toISOString().slice(0, 10),StartDate: search.StartDate,EndDate: search.EndDate,TotalAmt:TotalAmount,ExtraFacilityId: [],RStatus:'Booked'};
    if (search.StartDate === "") {
                setWarn({ ...setWarn , StartDate:true});
                setMsg({ ...setMsg , StartDate:"Please Select Valid Start Date!"});
                return;
        }
        if (search.EndDate === "") {
                setWarn({ ...setWarn , EndDate:true});
                setMsg({ ...setMsg , EndDate:"Please Select Valid End Date!"});
                return;
        }
        addReservation(body)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    const roomStatus = {
                        RoomId: room.RoomId,
                        updateKey: "RoomStatus",
                        updateValue: 'Booked'
                    };
                    updateRoomFieldById(roomStatus)
                    .then((res) => {
                        if (res.status === 201) {
                            if (res.data["Status"]) {
                                getRoomsData();
                            }
                        }
                    })
                    .catch((err) => {
                        if (!err?.response) {
                        toast.error('No Server Response');
                        } else if (err.response?.status !== 201) {
                        toast.error(err.response?.data['Message']);
                        } else {
                        toast.error('Room updating Failed.');
                        }
                    });
                    const roomPub = { 
                        item_id: search.RoomId,
                        email: json.Email,
                        item_name: getRoomName(search.RoomTypeId),
                        item_count: '1',
                        order_id: search.ReservationId,
                        jwt_token:'',
                        Price:TotalAmount
                    };
                    postInvoicePub(roomPub)
                    .then((res) => {
                        if (res.status === 201) {
                            if (res.data["Status"]) {
                            }
                        }
                    })
                    .catch((err) => {
                        if (!err?.response) {
                        toast.error('No Server Response');
                        } else if (err.response?.status !== 201) {
                        toast.error(err.response?.data['Message']);
                        } else {
                        toast.error('RoomType updating Failed.');
                        }
                    });
                    postRoomPub(roomPub)
                    .then((res) => {
                        if (res.status === 201) {
                            if (res.data["Status"]) {
                            }
                        }
                    })
                    .catch((err) => {
                        if (!err?.response) {
                        toast.error('No Server Response');
                        } else if (err.response?.status !== 201) {
                        toast.error(err.response?.data['Message']);
                        } else {
                        toast.error('RoomType updating Failed.');
                        }
                    });
                    getRoomTypesData();
                    getRoomsData();
                    getReservationsData();
                }
            }
        })
        .catch((err) => {
            if (!err?.response) {
            toast.error('No Server Response');
            } else if (err.response?.status !== 201) {
            toast.error(err.response?.data['Message']);
            } else {
            toast.error('RoomType saving Failed.');
            }
        });
  };
  return (
    <>
    <Navigation />
    <Container className="cr-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="cr-container">
                    <div className="cr-card">
                        <div className="cr-form">
                            <div style={{display:'flex'}}>
                                <div className="cr-right-side">
                                    <div style={{height: "20%"}}>
                                        <div className="cr-hello">
                                            <h2>Search And Book</h2>
                                        </div>
                                    </div>
                                    <div style={{height: "80%"}}>
                                        <div className='cr-form' style={{width:'100%'}}>
                                            <div style={{display:'flex'}}>
                                                <div className='col-md-4 p-2'>
                                                    <FormControl required fullWidth>
                                                        <InputLabel id="RoomTypeId">Room Type</InputLabel>
                                                        <Select
                                                            labelId="RoomTypeId"
                                                            id="RoomTypeId"
                                                            value={(search.RoomTypeId==='')?0:search.RoomTypeId}
                                                            label="RoomTypeId"
                                                            onChange={(event)  =>  onChangeRoomType (event)}
                                                        >
                                                            <MenuItem key={0} value={0}>None</MenuItem>
                                                            <MenuItem key="Single" value="Single">Single</MenuItem>
                                                            <MenuItem key="Double" value="Double">Double</MenuItem>
                                                            <MenuItem key="Family" value="Family">Family</MenuItem>
                                                            <MenuItem key="Presidential" value="Presidential">Presidential</MenuItem>
                                                        </Select>
                                                    </FormControl></div>
                                                <div className='col-md-4 p-2'>
                                                    <TextField fullWidth
                                                        id="Occupancy"
                                                        label="Occupancy"
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={search.Occupancy}
                                                        onChange={(event) => onChangeOccupancy (event) }
                                                    />
                                                </div>
                                                <div className='col-md-4 p-2'>
                                                   <TextField fullWidth
                                                        
                                                        id="TotalAmt"
                                                        label="TotalAmt"
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={search.TotalAmt}
                                                        onChange={(event) => onChangeAmt (event)}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{display:'flex'}}>
                                                <div className='col-md-6' style={{display:'flex'}}>
                                                    <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> Start Date: </label></div>
                                                    <div className='col-md-9'><input style={{width:'100%'}} type="date" id="StartDate" name="StartDate" min={new Date().toISOString().slice(0, 10)} onChange={(event) => setSearch({...search,StartDate:event.target.value})}/> 
                                                        {warn.StartDate ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.StartDate}</p> : null}
                                                    </div> 
                                                </div>
                                                <div className='col-md-6' style={{display:'flex'}}>
                                                    <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> End Date: </label></div>
                                                    <div className='col-md-9'><input style={{width:'100%'}} type="date" id="EndDate" name="EndDate" min={(search.StartDate === '')?new Date().toISOString().slice(0, 10):search.StartDate} onChange={(event) => setSearch({...search,EndDate:event.target.value})}/> 
                                                        {warn.EndDate ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.EndDate}</p> : null}
                                                    </div> 
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                        <div className='ucontainer'>
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4  }}>
                                    {searchData.map((room) => (
                                        <Grid item  direction="column" spacing={1} style={{padding:'0px'}} >
                                            <Item className='gridcard' key={room.RoomId} >
                                                <Grid item xs={12} sm container >
                                                    <Grid item>
                                                        <ButtonBase sx={{ width: 250, height: 250 }}>
                                                            <Img alt="Image" src={(room.RoomImage==='')?logo:room.RoomImage} />
                                                        </ButtonBase>
                                                    </Grid>
                                                    <Grid item xs container direction="column" spacing={4}>
                                                        <Grid item xs>  
                                                            <Typography variant="subtitle1" component="div">
                                                            $  {getRoomCost(room.RoomTypeId)}
                                                            </Typography>                              
                                                        <Typography gutterBottom variant="subtitle1" component="div">
                                                                {getRoomName(room.RoomTypeId)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography sx={{ cursor: 'pointer' }} variant="body2" onClick={() => addReservationBtn(room)}>
                                                                Book
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Item>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>                            
                        </div>
                     </div>
                </div>
            </Row>
        </Container>
    </>
  )
}

export default Search

