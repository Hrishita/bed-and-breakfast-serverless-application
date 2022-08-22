import { React, useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {CognitoUserPool,CognitoUser,AuthenticationDetails} from 'amazon-cognito-identity-js'
import { db } from "../../config/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate,Navigate,useLocation } from 'react-router-dom';
import axios from "axios";
import Constants from '../../api/constants';
import { Token } from "@mui/icons-material";
import AWS from 'aws-sdk';
import {getCust,addLog} from '../../api/axiosCall';
window.Buffer = window.Buffer || require("buffer").Buffer;

const theme = createTheme();


export default function SignInCaesar(props) {
     useEffect(() => {
        getCustData();  
    }, []);
    
   
    const [custData,setCustData] = useState([]);
const getCustData = (e) =>  {
        getCust().then((res) => {
                if (res.status === 201) {
                    if (res.data !== null && res.data.Data !== null) {
                        setCustData(res.data.Data); 
                    } 
                }
            }).catch((err) => {
                alert(err.response?.data["Message"]);
            });
    }
    const getCustId=(rowData)=>{
    let result = null;
    custData.forEach(item => {
        if (item.email===rowData) 
        {   
            console.log(item.customerid);
            result=item.customerid;
        }
    });
    return result;
 };
    function fillLocalStorage(data,email){
        const body= {
            CustomerId: getCustId(state.email),
            Type:(getCustId(state.email)==='parth1658615812307')?'Admin':'Common',
            AccessToken:data.accessToken.jwtToken,
            Email:state.email
        }
        localStorage.setItem("token", JSON.stringify(body));
        console.log(body);
        localStorage.setItem("accessToken", data.accessToken.jwtToken);
        localStorage.setItem("email", email);
        localStorage.setItem("userid-cognito", data.accessToken.payload["username"]);

    }
    const navigate = useNavigate();
const goRegister = () => {
      navigate("/registration");
    }
    const { state } = useLocation();
        const key = state.key;
        var data = state.data
        var email = state.email
        console.log(data);
        const [fireuser , getUser] = useState([]);
        const [UserCipher , setUserCipher] = useState("");
        const [GcpCipher,setGcpCipher] = useState("");
         useEffect( () => {
                    axios.get(Constants.AXIOS_CAESER + "text=ABC&" + `key=${state.key}`).then(resp => {
                        setUserCipher(data => resp.data.output)
                    });
                } , [UserCipher]);
         const  handleSubmit = (event) => {
                event.preventDefault();
                //  Getting the form Data
                const UserData = new FormData(event.currentTarget);
                if(UserData.get("ceaser").toString() === UserCipher.toString()){
                        fillLocalStorage(state.data,UserData.get("email"));
                        const body={ CustomerId:getCustId(UserData.get("email")),Timestamp:new Date(),Status: 'Logged-In'};
        
                        addLog(body)
                        .then((res) => {
                            if (res.status === 201) {
                                if (res.data["Status"]) {
                                }
                            }
                        })
                        .catch((err) => {
                            alert(err.response?.data['Message']);
                        });
                       navigate("/home");
                    }
                    else{
                        alert("Your Decrypted password is wrong!");
                    }
                }

            return (
                <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                   
                    <CssBaseline />
                    <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="ceaser"
                        label="Enter Ceaser cipher of ABC" 
                        type="text"
                        id="ceaser"
                        />
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Sign in
                        </Button>
                        <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                        </Grid>
                        </Grid>
                    </Box>
                    </Box>
                </Container>
                </ThemeProvider>
            );
}
