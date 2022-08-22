import React, { useState,useEffect,forwardRef } from 'react'
import "./Search.css"
import { toast } from 'react-toastify';
import logo from '../../Images/NoUser.jpg'
import {getFoodItems,getFoodOders,addFoodOder,postInvoicePub,postRoomPub} from '../../api/axiosCall';
import { Row,Container} from "react-bootstrap";
import {InputLabel ,MenuItem ,FormControl ,Select,TextField,ButtonBase } from '@mui/material';
import {Navigation} from '../Common/Navigation';
import { experimentalStyled as styled } from '@mui/material/styles';
import {Box,Paper,Grid,Typography} from '@mui/material';


function FoodItem() {
    
    const [foodorder, setFoodOrder] = useState({ orderId:'',CustomerId:'',DishId:'',Number_of_Dishes: 0,TotalAmt: ''});
    const [foodData,setFoodData] = useState([]);
    const [foodorderData,setFoodOrderData] = useState([]);
    const [warn,setWarn] = useState({ Number_of_Dishes: false});
    const [msg,setMsg] = useState({ Number_of_Dishes: ''});
    const user = localStorage.getItem("token");
    var json = JSON.parse(user);
    useEffect(() => {
        getFoodItemsData();
        getFoodOrdersData();
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
        const ids = foodorderData.map(object => {
            return object.orderId;
        });
        (ids.length === 0)? setFoodOrder({...foodorder, orderId:1,CustomerId:'',DishId:'',Number_of_Dishes: 0,TotalAmt: ''}):
             setFoodOrder({...foodorder, orderId:Math.max(...ids)+1,CustomerId:'',DishId:'',Number_of_Dishes: 0,TotalAmt: ''});
        setWarn({...warn,Number_of_Dishes: false});
        setMsg({...msg,Number_of_Dishes: ''});
    }, [foodorderData]);
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
 
  const getFoomCost=(data)=>{
    let result = null;
    foodData.forEach(item => {
        if (item.ItemId===data) result=item.price;
    });
    return result;
 };
 const getFoodName=(rowData)=>{
    let result = null;
    foodData.forEach(item => {
        if (item.ItemId===rowData) 
        {   
            result=item.ItemName;
        }
    });
    return result;
 };
  const addFoodOrderBtn=(food) =>{
    var TotalAmount= foodorder.Number_of_Dishes*getFoomCost(food.ItemId);
    const body={  orderId:foodorder.orderId,CustomerId:json.CustomerId,DishId:food.ItemId,Number_of_Dishes: foodorder.Number_of_Dishes,TotalAmt: TotalAmount};
        if (foodorder.Number_of_Dishes === 0) {
                setWarn({ ...warn , Number_of_Dishes:true});
                setMsg({ ...msg , Number_of_Dishes:"Please Enter Valid Number of Dishes!"});
                return;
        }
        addFoodOder(body)
        .then((res) => {
            if (res.status === 201) {
                if (res.data["Status"]) {
                    toast.success("Your order will be delivered in "+food.PrepTime);
                    getFoodOrdersData();
                    const roomPub = { 
                        item_id: food.ItemId,
                        email: json.Email,
                        item_name: getFoodName(food.ItemId),
                        item_count: foodorder.Number_of_Dishes,
                        order_id: foodorder.orderId,
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
                                                <div className='p-2'>
                                                    {warn.Number_of_Dishes ? <>                                    
                                            <TextField error fullWidth
                                                        id="Number_of_Dishes"
                                                        label="Number_of_Dishes"
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={foodorder.Number_of_Dishes}
                                                        onChange={(event) =>   setFoodOrder({...foodorder,Number_of_Dishes:event.target.value}) }
                                                        helperText={msg.Number_of_Dishes}
                                                    />
                                            </> : <>
                                            <TextField required fullWidth
                                                        id="Number_of_Dishes"
                                                        label="Number_of_Dishes"
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={foodorder.Number_of_Dishes}
                                                        onChange={(event) =>   setFoodOrder({...foodorder,Number_of_Dishes:event.target.value}) }
                                                    /></>}
                                                    {/* <TextField fullWidth
                                                        id="Number_of_Dishes"
                                                        label="Number_of_Dishes"
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        value={foodorder.Number_of_Dishes}
                                                        onChange={(event) =>   setFoodOrder({...foodorder,Number_of_Dishes:event.target.value}) }
                                                    /> */}
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
                                    {foodData.map((food) => (
                                        <Grid item  direction="column" spacing={1} style={{padding:'0px'}} >
                                            <Item className='gridcard' key={food.ItemId} >
                                                <Grid item xs={12} sm container >
                                                    <Grid item>
                                                        <ButtonBase sx={{ width: 250, height: 250 }}>
                                                            <Img alt="Image" src={(food.ImageUrl==='')?logo:food.ImageUrl} />
                                                        </ButtonBase>
                                                    </Grid>
                                                    <Grid item xs container direction="column" spacing={4}>
                                                        <Grid item xs>  
                                                            <Typography variant="subtitle1" component="div">
                                                            $  {food.price}
                                                            </Typography>                              
                                                        <Typography gutterBottom variant="subtitle1" component="div">
                                                                {food.ItemName}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography sx={{ cursor: 'pointer' }} variant="body2" onClick={() => addFoodOrderBtn(food)}>
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

export default FoodItem

