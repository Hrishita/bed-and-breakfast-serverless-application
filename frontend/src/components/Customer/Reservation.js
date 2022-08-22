import React, { useState,useEffect,forwardRef } from 'react'
import "./Reservation.css"
import { toast } from 'react-toastify';
import {getReservations,getRoomTypes,deleteReservationById,getRooms,updateRoomFieldById,getFacilities} from '../../api/axiosCall';
import {Row,Container} from "react-bootstrap";
import {Button} from '@mui/material';
import MaterialTable from "material-table";
import {ViewColumn,ArrowDownward,ChevronLeft,ChevronRight,Clear,DeleteOutline,Edit,Remove,Search,FilterList,FirstPage,LastPage} from '@material-ui/icons';
import {Navigation} from '../Common/Navigation';
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

function Reservation() {
    const [reservationsData,setReservationsData] = useState([]);
    const [roomTypesData,setRoomTypesData] = useState([]);
    const [facilitiesData,setFacilitiesData] = useState([]);
    const [roomsData,setRoomsData] = useState([]);
    const tableRef = React.createRef();
    const user = localStorage.getItem("token");
    var json = JSON.parse(user);
    useEffect(() => {
        getReservationsData();
        getRoomTypesData();  
        getFacilitiesData();
        getRoomsData();   
    }, []);
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
 
  return (
    <>
    <Navigation />
        <Container className="cr-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="cr-container">
                    <div className="cr-card">
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
                                        { title: 'Amount', field: 'TotalAmt', type: 'numeric'}
                                ]}
                                data={reservationsData.filter((item) => (item.CustomerId === json.CustomerId))}
                                title="Reservation"  
                                icons={tableIcons}
                                actions={[{}]}
                                options={{
                                    actionsColumnIndex: -1,
                                    filtering: true
                                }}
                                components={{
                                    Action: props => (<><Button
                                        onClick={(event) => onRowDelete ( props.data )}
                                        color="error"
                                        variant="contained"
                                        style={{textTransform: 'none'}}
                                        size="small"
                                        disabled={props.data.EndDate < new Date().toISOString().slice(0, 10) || props.data.RStatus ==="Check-Out"} 
                                    >
                                        Cancel
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

export default Reservation
