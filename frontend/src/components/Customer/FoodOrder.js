import React, { useState,useEffect,forwardRef } from 'react'
import "./Reservation.css"
import { toast } from 'react-toastify';
import {getFoodItems,getFoodOders,deleteFoodOderById} from '../../api/axiosCall';
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

function FoodOrder() {
    const [foodorderData,setFoodOrderData] = useState([]);
    const [foodData,setFoodData] = useState([]);
    const tableRef = React.createRef();
    const user = localStorage.getItem("token");
    var json = JSON.parse(user);
    useEffect(() => {
        getFoodOrdersData();   
        getFoodItemsData();
    }, []);
    const getFoodOrdersData = (e) =>  {
        getFoodOders().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setFoodOrderData(res.data.Data); 
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
     const getFoodItemsData = (e) =>  {
        getFoodItems().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setFoodData(res.data.Data);
                    } 
                }
            }).catch((err) => {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status !== 201) {
                    toast.error(err.response?.data["Message"]);
                } else {
                    toast.error('Food Items fetching Failed.');
                }
            });
    }
    const onRowDelete=(data)=>{
        deleteFoodOderById(data.orderId)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success(res.data["Message"]);
                    getFoodOrdersData(); 
                }
            }
        })
        .catch((err) => {
            if (!err?.response) {
            toast.error('No Server Response');
            } else if (err.response?.status !== 201) {
            toast.error(err.response?.data['Message']);
            } else {
            toast.error('Food Order updating Failed.');
            }
        });
  }
  const getFoodNameTable=(rowData)=>{
    let result = null;
    foodData.forEach(item => {
        if (item.ItemId===rowData.DishId) 
        {   
            result=item.ItemName;
        }
    });
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
                                        { title: 'Id', field: 'orderId', type: 'numeric', hidden: true },
                                        { title: 'Dish Id', field: 'DishId' , hidden: true},
                                        { title: 'Dish Name', field: 'DishName'  , render: rowData => getFoodNameTable(rowData)},
                                        { title: 'Number of Dishes', field: 'Number_of_Dishes'  , type: 'numeric'},
                                        { title: 'Amount', field: 'TotalAmt', type: 'numeric'}
                                ]}
                                data={foodorderData.filter((item) => (item.CustomerId === json.CustomerId))}
                                title="Food Orders"  
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

export default FoodOrder
