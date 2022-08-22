import React, { useState,useEffect,forwardRef,useRef } from 'react'
import "./Room.css"
import { toast } from 'react-toastify';
import logo from '../../Images/NoUser.jpg'
import {getRoomTypes,getFacilities,addRoom,getRooms,deleteRoomById,updateRoomById} from '../../api/axiosCall';
import { Col,Row,Container} from "react-bootstrap";
import {Button,InputLabel ,MenuItem ,FormControl ,Select,Checkbox ,OutlinedInput,ListItemText ,TextField,FormHelperText,ButtonBase } from '@mui/material';
import MaterialTable from "material-table";
import {ViewColumn,ArrowDownward,ChevronLeft,ChevronRight,Clear,DeleteOutline,Edit,Remove,Search,FilterList,FirstPage,LastPage} from '@material-ui/icons';
import {AdminNavigation} from './AdminNavigation';
import { experimentalStyled as styled } from '@mui/material/styles';
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

function Room() {
    const [room, setRoom] = useState({ RoomId:'',RoomTypeId:'',RoomFacilityId: [],RoomImage: '',RoomStatus: 'Available'});
    const [roomsData,setRoomsData] = useState([]);
    const [roomTypesData,setRoomTypesData] = useState([]);
    const [facilitiesData,setFacilitiesData] = useState([]);
    const [state, setState] = useState('start');
    const [warn,setWarn] = useState({ RoomId:false,RoomTypeId:false,RoomFacilityId: false,RoomImage: false,RoomStatus: false});
    const [msg,setMsg] = useState({ RoomId:'',RoomTypeId:'',RoomFacilityId: [],RoomImage: '',RoomStatus: '' });
    const inputRef = useRef(null);
    const tableRef = React.createRef();
    useEffect(() => {
        getRoomsData();
        getRoomTypesData(); 
        getFacilitiesData();
        getMaxId();
    }, []);
   
    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '200px',
        height: '200px',
    });
      
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
                    toast.error('Room fetching Failed.');
                }
            });
    }
    const getMaxId = (e) =>  {
        const ids = roomsData.map(object => {
            return object.RoomId;
        });
        inputRef.current.value = null;
        (ids.length === 0)? setRoom({...room,RoomId:1,RoomTypeId:'',RoomFacilityId: [],RoomImage: '',RoomStatus: 'Available'}):
            setRoom({...room,RoomId:Math.max(...ids)+1,RoomTypeId:'',RoomFacilityId: [],RoomImage: '',RoomStatus: 'Available'});
        
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
        if (room.RoomTypeId === 0 || room.RoomTypeId === "0" || room.RoomTypeId === '') {
                setWarn({ ...setWarn , RoomTypeId:true});
                setMsg({ ...setMsg , RoomTypeId:"Please Select Valid Room Type!"});
                return;
        }
        addRoom(room)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    setState('start');
                    getRoomTypesData(); 
                    getRoomsData(); 
                    getFacilitiesData();
                    getMaxId();
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
    const updateForm = async(e) => {
        e.preventDefault();
        if (room.RoomTypeId === 0 || room.RoomTypeId === "0" || room.RoomTypeId === '') {
                setWarn({ ...setWarn , RoomTypeId:true});
                setMsg({ ...setMsg , RoomTypeId:"Please Select Valid Room Type!"});
                return;
        }
        updateRoomById(room)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    setState('start');
                    getRoomTypesData(); 
                    getRoomsData(); 
                    getFacilitiesData();
                    getMaxId();
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
        inputRef.current.value = null;
        setState('start');
        getRoomTypesData(); 
        getRoomsData(); 
        getFacilitiesData();
        getMaxId();
    };
    const onRowEdit=(Room)=>{
    setRoom({...room,RoomId:Room.RoomId,RoomTypeId:Room.RoomTypeId,RoomFacilityId: Room.RoomFacilityId,RoomImage: Room.RoomImage,RoomStatus: Room.RoomStatus});
    setState('Edit');
    }
  const onChangeRoomType=(e) =>{
    setRoom({...room,RoomTypeId:parseInt(e.target.value)})
  };
  const onChangeRoomFacility=(e) =>{
    const {
      target: { value },
    } = e;
    setRoom({...room,RoomFacilityId:typeof value === 'string' ? value.split(',') : value})
  };
  const onRowDelete=(Room)=>{
    deleteRoomById(Room.RoomId)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    setState('start');
                    getRoomTypesData(); 
                    getRoomsData(); 
                    getFacilitiesData();
                    getMaxId();
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
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const onRoomImageUpload= async (event)=>{
     const file = event.target.files[0];
    const base64 = await convertToBase64(file);
    setRoom({...room,RoomImage:base64});
  };
   
 const getRoomTypeTable=(rowData)=>{
    let result = null;

    roomTypesData.forEach(item => {
        if (item.RoomTypeId===rowData.RoomTypeId) result=item.RoomTypeName;
    });
    return result;
 };
 const getRoomFacilityTable=(rowData)=>{
    let result = '';
    facilitiesData.forEach(item => {
        rowData.RoomFacilityId.forEach(x => {
            if (item.FacilityId===x) (result==='')?result=result + item.FacilityName:result= result +','+ item.FacilityName;
        });
    });
    return result;
 };
  return (
    <>
    <AdminNavigation />
    <Container className="r-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="r-container">
                    <div className="r-card">
                        <div className="r-form">
                            <div style={{display:'flex'}}>
                                <div className="r-left-side">
                                    <ButtonBase sx={{ width: 200, height: 200 }}>
                                        <Img alt="Name" src={(room.RoomImage==='')?logo:room.RoomImage} />
                                    </ButtonBase>
                                </div>
                                <div className="r-right-side">
                                    <div style={{height: "20%"}}>
                                        <div className="r-hello">
                                            <h2>Room</h2>
                                        </div>
                                    </div>
                                    <div style={{height: "80%"}}>
                                        <div className='r-form' style={{width:'100%'}}>
                                            <div className='r-input_text'>
                                            <TextField fullWidth
                                                    disabled
                                                    id="RoomId"
                                                    label="RoomId"
                                                    value={room.RoomId}
                                                />
                                            </div>
                                            <div className='r-input_text'>
                                                {warn.RoomTypeId ? <>                                    
                                            <FormControl error required fullWidth>
                                                <InputLabel id="RoomTypeId">Room Type</InputLabel>
                                                <Select
                                                        labelId="RoomTypeId"
                                                        id="RoomTypeId"
                                                        value={(room.RoomTypeId==='')?0:room.RoomTypeId}
                                                        label="RoomTypeId"
                                                        onChange={(event)  =>  onChangeRoomType (event)}
                                                    >
                                                        <MenuItem value={0}>None</MenuItem>
                                                        {roomTypesData.map((object) => (
                                                            <MenuItem key={object.RoomTypeId} value={object.RoomTypeId}>{object.RoomTypeName}</MenuItem>
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
                                                        value={(room.RoomTypeId==='')?0:room.RoomTypeId}
                                                        label="RoomTypeId"
                                                        onChange={(event)  =>  onChangeRoomType (event)}
                                                    >
                                                        <MenuItem key={0} value={0}>None</MenuItem>
                                                        {roomTypesData.map((object) => (
                                                            <MenuItem key={object.RoomTypeId} value={object.RoomTypeId}>{object.RoomTypeName}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </>}
                                                
                                            </div>
                                            <div className='r-input_text'>
                                                {warn.RoomFacilityId ? <>                                    
                                            <FormControl error required fullWidth >
                                                <InputLabel id="RoomFacilityId">Room Facility</InputLabel>
                                                    <Select
                                                        labelId="RoomFacilityId"
                                                        id="RoomFacilityId"
                                                        multiple
                                                        value={room.RoomFacilityId}
                                                        label="RoomFacilityId"
                                                        input={<OutlinedInput />}
                                                        onChange={(event)  =>  onChangeRoomFacility (event)}
                                                        renderValue={(selected) => selected.join(', ')}
                                                    >
                                                        {facilitiesData.map((object) => (
                                                            <MenuItem key={object.FacilityId} value={object.FacilityId}>
                                                                <Checkbox checked={room.RoomFacilityId.indexOf(object.FacilityId) > -1} />
                                                                <ListItemText primary={object.FacilityName} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                <FormHelperText id="component-error-text">{msg.RoomFacilityId}</FormHelperText> 
                                            </FormControl>
                                            </> : <>
                                                <FormControl required fullWidth>
                                                    <InputLabel id="RoomFacilityId">Room Facility</InputLabel>
                                                    <Select
                                                        labelId="RoomFacilityId"
                                                        id="RoomFacilityId"
                                                        multiple
                                                        value={room.RoomFacilityId}
                                                        label="RoomFacilityId"
                                                        input={<OutlinedInput />}
                                                        onChange={(event)  =>  onChangeRoomFacility (event)}
                                                        renderValue={(selected) => selected.join(', ')}
                                                    >
                                                        {facilitiesData.map((object) => (
                                                            <MenuItem key={object.FacilityId} value={object.FacilityId}>
                                                                <Checkbox checked={room.RoomFacilityId.indexOf(object.FacilityId) > -1} />
                                                                <ListItemText primary={object.FacilityName} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </>}
                                            </div>    
                                            <div className='r-input_text'>
                                                <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> Room Image: </label></div>
                                                <div className='col-md-9'><input type="file" accept="image/*" onChange={onRoomImageUpload} ref={inputRef}/></div>                                            
                                            </div>                      
                                        <div className="r-btn">
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
                                                        { title: 'Id', field: 'RoomId', type: 'numeric', hidden: true },
                                                        { title: 'Type', field: 'RoomType' , render: rowData => getRoomTypeTable(rowData) },
                                                        { title: 'Facility', field: 'RoomFacility', render: rowData => getRoomFacilityTable(rowData)},
                                                        { title: 'Image', field: 'RoomImage', render: rowData => <img src={rowData.RoomImage} style={{width: 40, borderRadius: '50%'}}/> },
                                                        { title: 'Status', field: 'RoomStatus'}
                                                ]}
                                                data={roomsData}
                                                title="Room"  
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
                                                    >
                                                        edit
                                                    </Button> <span> &nbsp;</span><Button
                                                        onClick={(event) => onRowDelete ( props.data )}
                                                        color="error"
                                                        variant="contained"
                                                        style={{textTransform: 'none'}}
                                                        size="small"
                                                    >
                                                        delete
                                                    </Button></>
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

export default Room