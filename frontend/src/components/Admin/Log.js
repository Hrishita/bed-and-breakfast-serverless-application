import React, { useState,useEffect,forwardRef } from 'react'
import "./Reservation.css"
import { toast } from 'react-toastify';
import {getLogs} from '../../api/axiosCall';
import {Row,Container} from "react-bootstrap";
import {Button} from '@mui/material';
import MaterialTable from "material-table";
import {ViewColumn,ArrowDownward,ChevronLeft,ChevronRight,Clear,DeleteOutline,Edit,Remove,Search,FilterList,FirstPage,LastPage} from '@material-ui/icons';
import {AdminNavigation} from '../Admin/AdminNavigation';
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

function Log() {
    const [LogData,setLogData] = useState([]);
    const tableRef = React.createRef();
    const user = localStorage.getItem("token");
    var json = JSON.parse(user);
    useEffect(() => {   
        getLogData();
    }, []);
    const getLogData = (e) =>  {
        getLogs().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setLogData(res.data.Data); 
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 201) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('Log fetching Failed.');
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
                        <div style={{marginTop:'5px'}}>
                            <MaterialTable
                                tableRef={tableRef}
                                columns={[
                                        { title: 'CustomerId', field: 'CustomerId' },
                                        { title: 'Timestamp', field: 'Timestamp' },
                                        { title: 'Status', field: 'Status'  }
                                ]}
                                data={LogData}
                                title="Logs"  
                                icons={tableIcons}
                                options={{
                                    filtering: true
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

export default Log
