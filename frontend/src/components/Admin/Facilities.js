import React, { useState,useEffect,forwardRef  } from 'react'
import "./Facilities.css"
import { toast } from 'react-toastify';
import {addFacility,getFacilities,updateFacilityById,deleteFacilityById } from '../../api/axiosCall';
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

function Facilities() {
    const [facility, setFacility] = useState({ FacilityId:'',FacilityName: '',FacilityCost: ''});
    const [facilitiesData,setFacilitiesData] = useState([]);
    const [state, setState] = useState('start');
    const tableRef = React.createRef();
    const NameRegex = /^[a-zA-Z]+$/;
    const CostRegex = /^[0-9]+$/;
    const [warn,setWarn] = useState({ FacilityId:false,FacilityName: false,FacilityCost:false });
    const [msg,setMsg] = useState({ FacilityId:'',FacilityName: '',FacilityCost:'' });
    useEffect(() => {
        getFacilitiesData(); 
        getMaxId();
    }, []);
    const getFacilitiesData = (e) =>  {
        getFacilities().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setFacilitiesData(res.data.Data); 
                        const ids = res.data.Data.map(object => {
                            return object.FacilityId;
                        });
                        (ids.length === 0)? setFacility({...facility,FacilityId:1,FacilityName: '',FacilityCost: ''}):
                        setFacility({...facility,FacilityId:Math.max(...ids)+1,FacilityName: '',FacilityCost: ''});
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
    const getMaxId = (e) =>  {
        const ids = facilitiesData.map(object => {
            return object.FacilityId;
        });
        (ids.length === 0)? setFacility({...facility,FacilityId:1,FacilityName: '',FacilityCost: ''}):
        setFacility({...facility,FacilityId:Math.max(...ids)+1,FacilityName: '',FacilityCost: ''});
    }
    const inputEvent = (e) => {
       if (e.target.FacilityName === "FacilityName") {
            if (!NameRegex.test(e.target.value) && e.target.value) {
                setWarn({ ...setWarn , FacilityName:true});
                setMsg({ ...setMsg , FacilityName:"Please Enter Valid Facility Name!"});
            }
            else {
                setWarn({ ...setWarn , FacilityName:false});
                setMsg({ ...setMsg , FacilityName:''});
            }
        }
        if (e.target.FacilityCost === "FacilityCost") {
            if (!CostRegex.test(e.target.value) && e.target.value) {
                setWarn({ ...setWarn , FacilityCost:true});
                setMsg({ ...setMsg , FacilityCost:"Please Enter Valid Facility Cost!"});
            }
            else {
                setWarn({ ...setWarn , FacilityCost:false});
                setMsg({ ...setMsg , FacilityCost:''});
            }
        }
        setFacility((lastValue) => {
            return { ...lastValue, [e.target.name]: e.target.value }
        });
    };
    const submitForm = async(e) => {
        e.preventDefault();
        if (facility.FacilityName === "") {
                setWarn({ ...setWarn , FacilityName:true});
                setMsg({ ...setMsg , FacilityName:"Please Enter Valid Facility Name!"});
                return;
        }
        if (facility.FacilityCost === "") {
                setWarn({ ...setWarn , FacilityCost:true});
                setMsg({ ...setMsg , FacilityCost:"Please Enter Valid Facility Cost!"});
                return;
        }
        addFacility(facility)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    getFacilitiesData();
                }
            }
        })
        .catch((err) => {
            if (!err?.response) {
            toast.error('No Server Response');
            } else if (err.response?.status !== 201) {
            toast.error(err.response?.data['Message']);
            } else {
            toast.error('Facility saving Failed.');
            }
        });
    };
    const updateForm = async(e) => {
        e.preventDefault();
        const body = {
          FacilityId: facility.FacilityId,
          updateKey: "FacilityCost",
          updateValue: facility.FacilityCost
        };
        updateFacilityById(body )
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    getFacilitiesData();
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
            toast.error('Facility updating Failed.');
            }
        });
    };
    const resetForm = async(e) => {
        e.preventDefault();
        setState('start');
        getMaxId();        
    };
    const onRowEdit=(Facility)=>{
        setFacility({...facility,FacilityId:Facility.FacilityId,FacilityName: Facility.FacilityName,FacilityCost: Facility.FacilityCost});
        setState('Edit');
    }
    const onRowDelete=(Facility)=>{
        const body = {
        FacilityId: Facility.FacilityId
        };
        deleteFacilityById(Facility.FacilityId)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    getFacilitiesData();
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
            toast.error('Facility updating Failed.');
            }
        });
    }
   
  return (
    <>
    <AdminNavigation />
    <Container className="f-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="f-container">
                    <div className="f-card">
                        <div className="f-form">
                            <div className="f-right-side">
                                <div style={{height: "20%"}}>
                                    <div className="f-hello">
                                        <h2>Facilities</h2>
                                    </div>
                                </div>
                                <div style={{height: "80%"}}>
                                    <div className='f-form' style={{width:'100%'}}>
                                        <div className='f-input_text'>
                                            <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> Facility Id: </label></div>
                                            <div className='col-md-9'><input disabled type="text" name="FacilityId" placeholder="Enter Facility Id" value={facility.FacilityId} /></div>
                                            
                                        </div>
                                        <div className='f-input_text'>
                                            <div className='col-md-3'> <label className="label" style={{paddingLeft:"10px"}}> Facility Name: </label></div>
                                            <div className='col-md-9'>
                                            {state === 'Edit' && (
                                                <input type="text" disabled name="FacilityName" placeholder="Enter Facility Name" value={facility.FacilityName}  />
                                            )} 
                                            {state === 'start' && (
                                            <>
                                               <input type="text" className={` ${warn.FacilityName ? "f-warning" : ""}`} name="FacilityName" placeholder="Enter Facility Name" value={facility.FacilityName} onChange={inputEvent} />
                                                {warn.FacilityName ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.FacilityName}</p> : null}
                                            </>
                                            )}
                                            </div>
                                        </div>
                                        <div className='f-input_text'>
                                            <div className='col-md-3'><label className="label" style={{paddingLeft:"10px"}}> Facility Cost: </label></div>
                                            <div className='col-md-9'><input type="number" className={` ${warn.FacilityCost ? "f-warning" : ""}`} name="FacilityCost" placeholder="Enter Facility Cost" value={facility.FacilityCost} onChange={inputEvent} />
                                            {warn.FacilityCost ? <p style={{ color: "red" }}><i className="fa fa-warning"></i>{msg.FacilityCost}</p> : null}</div>
                                            
                                        </div>                           
                                    <div className="f-btn">
                                        <center>
                                            {state === 'Edit' && (
                                                <Col className="d-flex justify-content-center">
                                                <Button variant="contained" onClick={updateForm} disabled={(!Boolean(warn.FacilityCost) && !Boolean(warn.FacilityName)) ?  false: true}>
                                                Update
                                                </Button>
                                                <Button style={{marginLeft:'10px'}}variant="contained" onClick={resetForm} disabled={(!Boolean(warn.FacilityCost) && !Boolean(warn.FacilityName)) ?  false: true}>
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
                                        { title: 'Id', field: 'FacilityId', type: 'numeric', hidden: true },
                                        { title: 'Name', field: 'FacilityName' },
                                        { title: 'Cost', field: 'FacilityCost', type: 'numeric' }
                                ]}
                                data={facilitiesData}
                                title="Facilities"  
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

export default Facilities