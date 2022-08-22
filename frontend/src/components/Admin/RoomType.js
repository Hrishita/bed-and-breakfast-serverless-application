import React, { useState,useEffect,forwardRef  } from 'react'
import "./RoomType.css"
import { toast } from 'react-toastify';
import {addRoomType,getRoomTypes,updateRoomTypeById,deleteRoomTypeById } from '../../api/axiosCall';
import { Col,Row,Container} from "react-bootstrap";
import {Button } from '@mui/material';
import MaterialTable from "material-table";
import {ViewColumn,ArrowDownward,ChevronLeft,ChevronRight,Clear,DeleteOutline,Edit,Remove,Search,FilterList,FirstPage,LastPage} from '@material-ui/icons';
import {AdminNavigation} from './AdminNavigation';

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

function RoomType() {
    const [roomType, setRoomType] = useState({ RoomTypeId:'',RoomTypeName: '',RoomTypeCost: '',RoomMaxOcup: ''});
    const [roomTypesData,setRoomTypesData] = useState([]);
    const [state, setState] = useState('start');
    const tableRef = React.createRef();
    const NameRegex = /^[a-zA-Z]+$/;
    const CostRegex = /^[0-9]+$/;
    const [warn,setWarn] = useState({ RoomTypeId:false,RoomTypeName: false,RoomTypeCost:false,RoomMaxOcup: false });
    const [msg,setMsg] = useState({ RoomTypeId:'',RoomTypeName: '',RoomTypeCost:'' ,RoomMaxOcup: ''});

    useEffect(() => {
        getRoomTypesData(); 
        getMaxId();
    }, []);
    const getRoomTypesData = (e) =>  {
        getRoomTypes().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setRoomTypesData(res.data.Data); 
                        const ids = res.data.Data.map(object => {
                            return object.RoomTypeId;
                        });
                        (ids.length === 0)? setRoomType({...roomType,RoomTypeId:1,RoomTypeName: '',RoomTypeCost: '',RoomMaxOcup: ''}):
                       setRoomType({...roomType,RoomTypeId:Math.max(...ids)+1,RoomTypeName: '',RoomTypeCost: '',RoomMaxOcup: ''});
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
    const getMaxId = (e) =>  {
        const ids = roomTypesData.map(object => {
                            return object.RoomTypeId;
                        });
                        (ids.length === 0)? setRoomType({...roomType,RoomTypeId:1,RoomTypeName: '',RoomTypeCost: '',RoomMaxOcup: ''}):
                       setRoomType({...roomType,RoomTypeId:Math.max(...ids)+1,RoomTypeName: '',RoomTypeCost: '',RoomMaxOcup: ''});
                       setWarn({...warn,RoomTypeId:false,RoomTypeName: false,RoomTypeCost:false,RoomMaxOcup: false});
                       setMsg({...msg,RoomTypeId:'',RoomTypeName: '',RoomTypeCost:'' ,RoomMaxOcup: ''});
    }
    const inputEvent = (e) => {
        if (e.target.RoomTypeName === "RoomTypeName") {
            if (!NameRegex.test(e.target.value) && e.target.value) {
                setWarn({ ...setWarn , RoomTypeName:true});
                setMsg({ ...setMsg , RoomTypeName:"Please Enter Valid RoomType Name!"});
            }
            else {
                setWarn({ ...setWarn , RoomTypeName:false});
                setMsg({ ...setMsg , RoomTypeName:''});
            }
        }
        if (e.target.RoomTypeCost === "RoomTypeCost") {
            if (!CostRegex.test(e.target.value) && e.target.value) {
                setWarn({ ...setWarn , RoomTypeCost:true});
                setMsg({ ...setMsg , RoomTypeCost:"Please Enter Valid RoomType Cost!"});
            }
            else {
                setWarn({ ...setWarn , RoomTypeCost:false});
                setMsg({ ...setMsg , RoomTypeCost:''});
            }
        }
        if (e.target.RoomMaxOcup === "RoomMaxOcup") {
            if (!CostRegex.test(e.target.value) && e.target.value) {
                setWarn({ ...setWarn , RoomMaxOcup:true});
                setMsg({ ...setMsg , RoomMaxOcup:"Please Enter Valid Room Max Occupancy!"});
            }
            else {
                setWarn({ ...setWarn , RoomMaxOcup:false});
                setMsg({ ...setMsg , RoomMaxOcup:''});
            }
        }
        setRoomType((lastValue) => {
            return { ...lastValue, [e.target.name]: e.target.value }
        });
    };
    const submitForm = async(e) => {
        e.preventDefault();
        if (roomType.RoomTypeName === "") {
                setWarn({ ...setWarn , RoomTypeName:true});
                setMsg({ ...setMsg , RoomTypeName:"Please Enter Valid RoomType Name!"});
                return;
        }
        if (roomType.RoomTypeCost === "") {
                setWarn({ ...setWarn , RoomTypeCost:true});
                setMsg({ ...setMsg , RoomTypeCost:"Please Enter Valid RoomType Cost!"});
                return;
        }
        if (roomType.RoomMaxOcup === "") {
                setWarn({ ...setWarn , RoomMaxOcup:true});
                setMsg({ ...setMsg , RoomMaxOcup:"Please Enter Valid Room Max Occupancy!"});
                return;
        }
        addRoomType(roomType)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    getRoomTypesData();
                    setState('start');
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
        const body = {
          RoomTypeId: roomType.RoomTypeId,
          updateKey: "RoomTypeCost",
          updateValue: roomType.RoomTypeCost
        };
        updateRoomTypeById(body )
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    getRoomTypesData();
                    setState('start');
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
            toast.error('RoomType updating Failed.');
            }
        });
    };
    const resetForm = async(e) => {
        e.preventDefault();
        getRoomTypesData();
        setState('start');
        getMaxId();        
    };
    const onRowEdit=(RoomType)=>{
        setRoomType({...roomType,RoomTypeId:RoomType.RoomTypeId,RoomTypeName: RoomType.RoomTypeName,RoomTypeCost: RoomType.RoomTypeCost,RoomMaxOcup:RoomType.RoomMaxOcup});
        setState('Edit');
    }
    const onRowDelete=(RoomType)=>{
        deleteRoomTypeById(RoomType.RoomTypeId)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    getRoomTypesData();
                    setState('start');
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
  }
   
  return (
    <>
    <AdminNavigation />
    <Container className="rt-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="rt-container">
                    <div className="rt-card">
                        <div className="rt-form">
                            <div className="rt-right-side">
                                <div style={{height: "20%"}}>
                                    <div className="rt-hello">
                                        <h2>Room Type</h2>
                                    </div>
                                </div>
                                <div style={{height: "80%"}}>
                                    <div className='rt-form' style={{width:'100%'}}>
                                        <div className='rt-input_text'>
                                            <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> RoomType Id: </label></div>
                                            <div className='col-md-9'><input disabled type="text" name="RoomTypeId" placeholder="Enter RoomType Id" value={roomType.RoomTypeId} /></div>                                            
                                        </div>
                                        <div className='rt-input_text'>
                                            <div className='col-md-3'> <label className="label" style={{paddingLeft:"10px"}}> RoomType Name: </label></div>
                                            <div className='col-md-9'>
                                            {state === 'Edit' && (
                                                <input type="text" disabled name="RoomTypeName" placeholder="Enter RoomType Name" value={roomType.RoomTypeName}  />
                                            )} 
                                            {state === 'start' && (
                                            <>
                                                <input type="text" className={` ${warn.RoomTypeName ? "rt-warning" : ""}`} name="RoomTypeName" placeholder="Enter RoomType Name" value={roomType.RoomTypeName} onChange={inputEvent} />
                                                {warn.RoomTypeName ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.RoomTypeName}</p> : null}
                                            </>
                                            )}
                                            </div>
                                        </div>
                                        <div className='rt-input_text'>
                                            <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> RoomType Cost: </label></div>
                                            <div className='col-md-9'><input type="number" className={` ${warn.RoomTypeCost ? "rt-warning" : ""}`} name="RoomTypeCost" placeholder="Enter RoomType Cost" value={roomType.RoomTypeCost} onChange={inputEvent} />
                                            {warn.RoomTypeCost ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.RoomTypeCost}</p> : null}</div>                                            
                                        </div>  
                                        <div className='rt-input_text'>
                                            <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> RoomType Max Occupancy: </label></div>
                                            <div className='col-md-9'><input type="number" className={` ${warn.RoomMaxOcup ? "rt-warning" : ""}`} name="RoomMaxOcup" placeholder="Enter RoomType Max Occupancy" value={roomType.RoomMaxOcup} onChange={inputEvent} />
                                            {warn.RoomMaxOcup ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.RoomMaxOcup}</p> : null}</div>                                            
                                        </div>                         
                                    <div className="rt-btn">
                                        <center>
                                            {state === 'Edit' && (
                                                <Col className="d-flex justify-content-center">
                                                <Button variant="contained" onClick={updateForm} disabled={(!Boolean(warn.RoomTypeCost) && !Boolean(warn.RoomTypeName)) ?  false: true}>
                                                Update
                                                </Button>
                                                <Button style={{marginLeft:'10px'}}variant="contained" onClick={resetForm} disabled={(!Boolean(warn.RoomTypeCost) && !Boolean(warn.RoomTypeName)) ?  false: true}>
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
                        <div>
                            <MaterialTable
                                    tableRef={tableRef}
                                    columns={[
                                            { title: 'Id', field: 'RoomTypeId', type: 'numeric', hidden: true },
                                            { title: 'Name', field: 'RoomTypeName' },
                                            { title: 'Cost', field: 'RoomTypeCost', type: 'numeric' },
                                            { title: 'Max Occupancy', field: 'RoomMaxOcup', type: 'numeric' }
                                    ]}
                                    data={roomTypesData}
                                    title="RoomType"  
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

export default RoomType