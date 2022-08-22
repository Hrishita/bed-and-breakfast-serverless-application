import React, { useState,useEffect,forwardRef } from 'react'
import "./Reservation.css"
import { toast } from 'react-toastify';
import logo from '../../Images/NoUser.jpg'
import {getRoomTypes,getFacilities,getRooms,postInvoicePub,updateRoomFieldById,getReservations,addReservation,deleteReservationById,postRoomPub,updateReservationFieldById} from '../../api/axiosCall';
import { Col,Row,Container} from "react-bootstrap";
import {Button,InputLabel ,MenuItem ,FormControl ,Select,Checkbox ,OutlinedInput,ListItemText ,TextField,FormHelperText,ButtonBase } from '@mui/material';
import {AdminNavigation} from './AdminNavigation';
import { experimentalStyled as styled } from '@mui/material/styles';
import {Paper} from '@mui/material';
import MaterialTable from "material-table";
import {ViewColumn,ArrowDownward,ChevronLeft,ChevronRight,Clear,DeleteOutline,Edit,Remove,Search,FilterList,FirstPage,LastPage} from '@material-ui/icons';
function Reservation() {
    const [reservation, setReservation] = useState({ ReservationId:'',RoomId:'',BookingDate:new Date().toISOString().slice(0, 10),StartDate: '',EndDate: '',TotalAmt:null,RoomTypeId:'',RoomFacilityId: [],RoomImage: '',ExtraFacilityId: []});
    const [roomsData,setRoomsData] = useState([]);
    const [reservationsData,setReservationsData] = useState([]);
    const [roomTypesData,setRoomTypesData] = useState([]);
    const [facilitiesData,setFacilitiesData] = useState([]);
    const [extraFacilitiesData,setExtraFacilitiesData] = useState([]);
    const [state, setState] = useState('start');
    const [warn,setWarn] = useState({ RoomTypeId:false,StartDate: false,EndDate: false});
    const [msg,setMsg] = useState({ RoomTypeId:'',StartDate: '',EndDate: '' });
    const tableRef = React.createRef();
    const user = localStorage.getItem("token");
    var json = JSON.parse(user);
    useEffect(() => {
        getRoomTypesData(); 
        getFacilitiesData();
        getRoomsData();   
        getReservationsData(); 
    }, []);
    
    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '250px',
        height: '250px',
    });
      
    React.useEffect(function getMaxId() {
        const ids = reservationsData.map(object => {
            return object.ReservationId;
        });
        (ids.length === 0)? setReservation({...reservation,ReservationId:1,RoomId:'',BookingDate:new Date().toISOString().slice(0, 10),StartDate: '',EndDate: '',TotalAmt:0,RoomTypeId:'',RoomFacilityId: [],RoomImage: '',ExtraFacilityId: []}):
            setReservation({...reservation,ReservationId:Math.max(...ids)+1,RoomId:'',BookingDate:new Date().toISOString().slice(0, 10),StartDate: '',EndDate: '',TotalAmt:0,RoomTypeId:'',RoomFacilityId: [],RoomImage: '',ExtraFacilityId: []});
        setWarn({...reservation,RoomTypeId:false,StartDate: false,EndDate: false});
        setMsg({...reservation,RoomTypeId:'',StartDate: '',EndDate: ''});
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
    
    const getFacilitiesData = (e) =>  {
        getFacilities().then((res) => {
            if (res.status === 201) {
                if (res.data !== null && res.data.Data !== null) {
                    
                    setFacilitiesData(res.data.Data);
                } 
            }
        }).catch((err) => {
            if (!err?.response) {
                toast.error('No Server Response');
            } else if (err.response?.status !== 201) {
                toast.error(err.response?.data["Message"]);
            } else {
                toast.error('Facilities fetching Failed.');
            }
        });
    }

    const submitForm = async(e) => {
        e.preventDefault();
       
        var date1 = new Date(reservation.StartDate);
        var date2 = new Date(reservation.EndDate);
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        var TotalAmount= Difference_In_Days*reservation.TotalAmt;
        
        const body={ ReservationId:reservation.ReservationId,CustomerId:json.CustomerId,RoomId:reservation.RoomId,BookingDate:new Date().toISOString().slice(0, 10),StartDate: reservation.StartDate,EndDate: reservation.EndDate,TotalAmt:TotalAmount,ExtraFacilityId: reservation.ExtraFacilityId,RStatus:'Booked'};
        if (reservation.RoomTypeId === "") {
                    setWarn({ ...setWarn , RoomTypeId:true});
                    setMsg({ ...setMsg , RoomTypeId:"Please Select Valid Room Type!"});
                    return;
            }
        if (reservation.StartDate === "") {
                setWarn({ ...setWarn , StartDate:true});
                setMsg({ ...setMsg , StartDate:"Please Select Valid Start Date!"});
                return;
        }
        if (reservation.EndDate === "") {
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
                        RoomId: reservation.RoomId,
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
                        item_id: reservation.RoomId,
                        email: json.Email,
                        item_name: getRoomTypeTable({RoomId:reservation.RoomId}),
                        item_count: '1',
                        order_id: reservation.ReservationId,
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
    const tableIcons = {
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };
  
    const updateForm = async(e) => {
        e.preventDefault();
        var date1 = new Date(reservation.StartDate);
        var date2 = new Date(reservation.EndDate);
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        var TotalAmount= Difference_In_Days*reservation.TotalAmt;
        
        const body={ ReservationId:reservation.ReservationId,CustomerId:json.CustomerId,RoomId:reservation.RoomId,BookingDate:new Date().toISOString().slice(0, 10),StartDate: reservation.StartDate,EndDate: reservation.EndDate,TotalAmt:TotalAmount,ExtraFacilityId: reservation.ExtraFacilityId,RStatus:'Booked'};
        if (reservation.RoomTypeId === "") {
                    setWarn({ ...setWarn , RoomTypeId:true});
                    setMsg({ ...setMsg , RoomTypeId:"Please Select Valid Room Type!"});
                    return;
            }
        if (reservation.StartDate === "") {
                setWarn({ ...setWarn , StartDate:true});
                setMsg({ ...setMsg , StartDate:"Please Select Valid Start Date!"});
                return;
        }
        if (reservation.EndDate === "") {
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
                        RoomId: reservation.RoomId,
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
                        toast.error('RoomType updating Failed.');
                        }
                    });
                    setState('start');
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
    const resetForm = async(e) => {
        e.preventDefault();
        getRoomTypesData(); 
        getFacilitiesData();
        getRoomsData();   
        getReservationsData(); 
        setState('start');
    };
    const onRowEdit=(RowData)=>{
        let RoomTypeId,RoomFacilityId,RoomImage;
        roomsData.forEach(item => {
            if (item.RoomId===RowData.RoomId) 
            {
                RoomTypeId=item.RoomTypeId;
                RoomFacilityId=item.RoomFacilityId;
                RoomImage=item.RoomImage;
            }
        });
        
        let ExtraFacility = facilitiesData.filter(function(word) {
        return !RoomFacilityId.includes(word.FacilityId);
        });
        setExtraFacilitiesData(ExtraFacility);
        setReservation({...reservation,ReservationId:RowData.ReservationId,RoomId:RowData.RoomId,StartDate:RowData.StartDate,EndDate:RowData.EndDate,TotalAmt:RowData.TotalAmt,RoomTypeId:RoomTypeId,RoomFacilityId: RoomFacilityId,RoomImage: RoomImage,ExtraFacilityId: RowData.ExtraFacilityId});
        setState('Edit');
    } 
    const onChangeRoomType=(e) =>{
        let amount,RoomId,RoomImage,RoomFacilityId;
        roomsData.forEach(item => {
            if (item.RoomTypeId===parseInt(e.target.value)) 
            {
                roomTypesData.forEach(x => {
                    if (x.RoomTypeId===parseInt(e.target.value)) 
                    {
                        amount=x.RoomTypeCost;
                        RoomId=item.RoomId;
                        RoomImage=item.RoomImage;
                        RoomFacilityId=item.RoomFacilityId;
                    }
                });
            }
        });
        setReservation({...reservation,RoomId:RoomId,RoomTypeId:parseInt(e.target.value),RoomImage:RoomImage,RoomFacilityId:RoomFacilityId,TotalAmt:amount});
        
        let ExtraFacility = facilitiesData.filter(function(word) {
        return !RoomFacilityId.includes(word.FacilityId);
        });
        setExtraFacilitiesData(ExtraFacility);
    };
  const onChangeRoomFacility=(e) =>{
    const {
      target: { value },
    } = e;
    let amount=0;
    roomTypesData.forEach(item => {
        if (item.RoomTypeId===reservation.RoomTypeId) 
        {
            amount=parseInt(item.RoomTypeCost);
        }
    });
    extraFacilitiesData.forEach(item => {
        (e.target.value).forEach(x => {
            if (item.FacilityId===x) 
            {
              
                amount=parseInt(amount)+parseInt(item.FacilityCost);
            }
        }
    )});
    setReservation({...reservation,ExtraFacilityId:typeof value === 'string' ? value.split(',') : value,TotalAmt:amount});
    
  };
 const getRoomTypeTable=(rowData)=>{
    let result = null;
    roomsData.forEach(item => {
        if (item.RoomId===rowData.RoomId) 
        {   
            roomTypesData.forEach(x => {
                if (x.RoomTypeId===item.RoomTypeId) 
                {   
                    result=x.RoomTypeName;
                }
            })
        }
    });
    return result;
 };
 const getExtraFacilityIdTable=(rowData)=>{
  
    let result = '';
    if(rowData.ExtraFacilityId.length===0){
        result='None';
    }
    else{
        facilitiesData.forEach(item => {
            rowData.ExtraFacilityId.forEach(x => {
                if (item.FacilityId===x) (result==='')?result=result + item.FacilityName:result= result +','+ item.FacilityName;
            });
        });
    }
    return result;
 };
 const onRowDelete=(data)=>{
    deleteReservationById(data.ReservationId)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    const roomStatus = {
                        RoomId: data.RoomId,
                        updateKey: "RoomStatus",
                        updateValue: 'Available'
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
            toast.error('Room updating Failed.');
            }
        });
  }
  const onRowCheckIn=(data)=>{
    const Status = {
        ReservationId: data.ReservationId,
        updateKey: "RStatus",
        updateValue: 'Check-In'
    };
    updateReservationFieldById(Status)
    .then((res) => {
        if (res.status === 201) {
            if (res.data["Status"]) {
                toast.success("Check-In Successfully !");
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
        toast.error('Reservation updating Failed.');
        }
    });
  }
  const onRowCheckOut=(data)=>{
    const Status = {
        ReservationId: data.ReservationId,
        updateKey: "RStatus",
        updateValue: 'Check-Out'
    };
    updateReservationFieldById(Status)
    .then((res) => {
        if (res.status === 201) {
            if (res.data["Status"]) {
                getReservationsData();
                const roomStatus = {
                        RoomId: data.RoomId,
                        updateKey: "RoomStatus",
                        updateValue: 'Available'
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
                    toast.success("Check-Out Successfully !");
            }
        }
    })
    .catch((err) => {
        if (!err?.response) {
        toast.error('No Server Response');
        } else if (err.response?.status !== 201) {
        toast.error(err.response?.data['Message']);
        } else {
        toast.error('Reservation updating Failed.');
        }
    });
  }
  return (
    <>
    <AdminNavigation />
    <Container className="cr-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="cr-container">
                    <div className="cr-card">
                        <div className="cr-form">
                            <div style={{display:'flex'}}>
                                <div className="cr-left-side">
                                    <ButtonBase sx={{ width: 200, height: 200 }}>
                                        <Img alt="Name" src={(reservation.RoomImage==='')?logo:reservation.RoomImage} />
                                    </ButtonBase>
                                </div>
                                <div className="cr-right-side">
                                    <div style={{height: "20%"}}>
                                        <div className="cr-hello">
                                            <h2>Reservation</h2>
                                        </div>
                                    </div>
                                    <div style={{height: "80%"}}>
                                        <div className='cr-form' style={{width:'100%'}}>
                                            <div className='cr-input_text'>
                                            <TextField fullWidth
                                                    disabled
                                                    id="ReservationId"
                                                    label="ReservationId"
                                                    value={reservation.ReservationId}
                                                />
                                            </div>
                                            <div className='cr-input_text'>
                                                {state === 'Edit' && (
                                                    <FormControl disabled fullWidth>
                                                        <InputLabel id="RoomTypeId">Room Type</InputLabel>
                                                        <Select
                                                            labelId="RoomTypeId"
                                                            id="RoomTypeId"
                                                            value={reservation.RoomTypeId}
                                                            label="RoomTypeId"
                                                        >
                                                            {roomTypesData.map((object) => (
                                                                <MenuItem key={object.RoomTypeId} value={object.RoomTypeId}>{object.RoomTypeName}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                                {state === 'start' && (
                                                    warn.RoomTypeId ? <>                                    
                                                    <FormControl error required fullWidth>
                                                        <InputLabel id="RoomTypeId">Room Type</InputLabel>
                                                        <Select
                                                                labelId="RoomTypeId"
                                                                id="RoomTypeId"
                                                                value={(reservation.RoomTypeId==='')?0:reservation.RoomTypeId}
                                                                label="RoomTypeId"
                                                                onChange={(event)  =>  onChangeRoomType (event)}
                                                            >
                                                                <MenuItem value={0}>None</MenuItem>
                                                                {roomTypesData.map((object) => (
                                                                    roomsData.forEach((room) => (
                                                                        (room.RoomTypeId===object.RoomTypeId && room.RoomStatus==='Available')?<MenuItem key={object.RoomTypeId} value={object.RoomTypeId}>{object.RoomTypeName}</MenuItem>:null
                                                                    ))
                                                                ))}
                                                            </Select>
                                                        <FormHelperText id="component-error-text">{msg.RoomTypeId}</FormHelperText> 
                                                    </FormControl>
                                                    </> : <>
                                                    <FormControl required fullWidth>
                                                            <InputLabel id="RoomTypeId">Room Type</InputLabel>
                                                            <Select
                                                                labelId="RoomTypeId"
                                                                id="RoomTypeId"
                                                                value={(reservation.RoomTypeId==='')?0:reservation.RoomTypeId}
                                                                label="RoomTypeId"
                                                                onChange={(event)  =>  onChangeRoomType (event)}
                                                            >
                                                                <MenuItem key={0} value={0}>None</MenuItem>
                                                                {roomTypesData.map((object) => (
                                                                    roomsData.map((room) => (
                                                                        (room.RoomTypeId===object.RoomTypeId && room.RoomStatus==='Available')?<MenuItem key={object.RoomTypeId} value={object.RoomTypeId}>{object.RoomTypeName}</MenuItem>:null
                                                                    ))
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </>
                                                    )}
                                                
                                                
                                            </div>
                                            <div className='cr-input_text'>
                                                <FormControl disabled fullWidth>
                                                    <InputLabel id="RoomFacilityId">Room Facility</InputLabel>
                                                    <Select
                                                        labelId="RoomFacilityId"
                                                        id="RoomFacilityId"
                                                        multiple
                                                        value={reservation.RoomFacilityId}
                                                        label="RoomFacilityId"
                                                        input={<OutlinedInput />}
                                                        renderValue={(selected) => {
                                                            let result = '';
                                                            facilitiesData.forEach(item => {
                                                                selected.forEach(x => {
                                                                    if (item.FacilityId===x) (result==='')?result=result + item.FacilityName:result= result +','+ item.FacilityName;
                                                                });
                                                            });
                                                            return result;}}
                                                    >
                                                        {facilitiesData.map((object) => (
                                                            <MenuItem key={object.FacilityId} value={object.FacilityId}>
                                                                        <Checkbox checked={reservation.RoomFacilityId.indexOf(object.FacilityId) > -1} />
                                                                        <ListItemText primary={object.FacilityName} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>  
                                            <div className='cr-input_text'>
                                                <FormControl fullWidth>
                                                    <InputLabel id="ExtraFacilityId">Extra Facility</InputLabel>
                                                    <Select
                                                        labelId="ExtraFacilityId"
                                                        id="ExtraFacilityId"
                                                        multiple
                                                        value={reservation.ExtraFacilityId}
                                                        label="ExtraFacilityId"
                                                        input={<OutlinedInput />}
                                                        onChange={(event)  =>  onChangeRoomFacility (event)}
                                                        
                                                        renderValue={(selected) => {
                                                            let result = '';
                                                            facilitiesData.forEach(item => {
                                                                selected.forEach(x => {
                                                                    if (item.FacilityId===x) (result==='')?result=result + item.FacilityName:result= result +','+ item.FacilityName;
                                                                });
                                                            });
                                                            return result;}}
                                                    >
                                                        {extraFacilitiesData.map((object) => (
                                                            <MenuItem key={object.FacilityId} value={object.FacilityId}>
                                                                <Checkbox checked={reservation.ExtraFacilityId.indexOf(object.FacilityId) > -1}/>
                                                                    <ListItemText primary={object.FacilityName} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>   
                                            <div className='cr-input_text'>
                                                <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> Start Date: </label></div>
                                                <div className='col-md-9'><input style={{width:'100%'}} type="date" id="StartDate" name="StartDate" min={new Date().toISOString().slice(0, 10)} onChange={(event) => setReservation({...reservation,StartDate:event.target.value})} value={reservation.StartDate}/> 
                                                {warn.StartDate ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.StartDate}</p> : null}</div> 
                                                
                                            </div>
                                            <div className='cr-input_text'>
                                                <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> End Date: </label></div>
                                                <div className='col-md-9'><input style={{width:'100%'}} type="date" id="EndDate" name="EndDate" min={(reservation.StartDate === '')?new Date().toISOString().slice(0, 10):reservation.StartDate} onChange={(event) => setReservation({...reservation,EndDate:event.target.value})} value={reservation.EndDate}/> 
                                                {warn.EndDate ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.EndDate}</p> : null}
                                                </div> 
                                                
                                            </div>
                                            <div className='cr-input_text'>
                                                <TextField fullWidth
                                                    disabled
                                                    id="TotalAmt"
                                                    label="TotalAmt"
                                                    type="number"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    value={reservation.TotalAmt}
                                                />
                                            </div>               
                                        <div className="cr-btn">
                                            <center>
                                                {state === 'Edit' && (
                                                    <Col className="d-flex justify-content-center">
                                                    <Button variant="contained" onClick={updateForm} >
                                                    Update
                                                    </Button>
                                                    <Button style={{marginLeft:'10px'}}variant="contained" onClick={resetForm} >
                                                    Cancel
                                                    </Button>
                                                    </Col>
                                                )}
                                                {state === 'start' && (
                                            <Button  type="submit" variant="contained" onClick={submitForm}>
                                                Save
                                            </Button>
                                            )}
                                            </center>
                                        </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                        <div style={{marginTop:'5px'}}>
                            <MaterialTable
                                tableRef={tableRef}
                                columns={[
                                        { title: 'Id', field: 'ReservationId', type: 'numeric', hidden: true },
                                        { title: 'Room Id', field: 'RoomId' },
                                        { title: 'Room Type', field: 'RoomType'  , render: rowData => getRoomTypeTable(rowData)},
                                        { title: 'Extra Facility', field: 'ExtraFacilityId'  , render: rowData => getExtraFacilityIdTable(rowData)},
                                        { title: 'Booking Date', field: 'BookingDate'},
                                        { title: 'Start Date', field: 'StartDate'},
                                        { title: 'End Date', field: 'EndDate'},
                                        { title: 'Amount', field: 'TotalAmt', type: 'numeric'},
                                        { title: 'Status', field: 'RStatus'}
                                ]}
                                data={reservationsData}
                                title="Reservation"  
                                icons={tableIcons}
                                actions={[{}]}
                                options={{
                                    actionsColumnIndex: -1,
                                    filtering: true
                                }}
                                components={{
                                    Action: props => (<>
                                        <Button
                                            onClick={(event)  =>  onRowEdit ( props.data )}
                                            color="primary"
                                            variant="contained"
                                            style={{textTransform: 'none'}}
                                            size="small"
                                        >edit</Button> 
                                        <span> &nbsp;</span>
                                        <Button
                                            onClick={(event) => onRowDelete ( props.data )}
                                            color="error"
                                            variant="contained"
                                            style={{textTransform: 'none'}}
                                            size="small"
                                        >Delete</Button>
                                        <span> &nbsp;</span>
                                        <Button
                                            onClick={(event) => onRowCheckIn ( props.data )}
                                            color="primary"
                                            variant="contained"
                                            style={{textTransform: 'none'}}
                                            size="small"
                                            disabled={props.data.RStatus ==="Check-Out"} 
                                        >Check-In</Button>
                                        <span> &nbsp;</span>
                                        <Button
                                            onClick={(event) => onRowCheckOut ( props.data )}
                                            color="error"
                                            variant="contained"
                                            style={{textTransform: 'none'}}
                                            size="small"
                                            disabled={props.data.RStatus ==="Check-Out"} 
                                        >Check-Out</Button>
                                    </>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Row>
        </Container>
    </>
  )
}

export default Reservation
