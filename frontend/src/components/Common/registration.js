import  React  ,{useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Number from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {CognitoUserPool} from 'amazon-cognito-identity-js'
import { db } from "../../config/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import AWS from 'aws-sdk';
import { Alert,Row } from 'react-bootstrap';
import { useNavigate,Navigate } from "react-router-dom";
import axios from 'axios';
import Constants from '../../api/constants';

window.Buffer = window.Buffer || require("buffer").Buffer;
AWS.config.update({ region:Constants.AWS_REGION, credentials: new AWS.Credentials(Constants.AWS_ACCESS_KEY_ID,  Constants.AWS_SECRET_ACCESS_KEY,Constants.AWS_SESSION_TOKEN)});
const poolData = {
   /*  UserPoolId: Constants.COGNITO_USER_POOL_ID,
    ClientId: Constants.COGNITO_CLIENT_ID */
     UserPoolId: "us-east-1_EusrluNY8",
    ClientId: "44g86k8a7d3a2q11ls0ql8ehvp"
}

const UserPool = new CognitoUserPool(poolData);
const theme = createTheme();

export default function Registration() {
    const goSignIn = () => {
      navigate("/signin");
    }
    let navigate = useNavigate();
    const[CustomerId,setCustomerId] = useState("")
    const [error, setErrors] = ([])
    const validateFields = (values)=> {
        const errors = {}
        if(values.get("firstName") === ""){
            errors.firstname = "First name Required!"
        }
        else if (!/^[A-Za-z]+$/.test(values.get("firstName"))) {
            errors.firstname = "First name can only have characters!";
        }
        if(values.get("lastName") === ""){
            errors.lastname = "Last name Required!"
        }
        else if (!/^[A-Za-z]+$/.test(values.get("lastName"))) {
            errors.lastname = "First name can only have characters!";
            
        }
        if(values.get("email") === ""){
            errors.email = "Email Required! "
        }
        if(values.get("password") === ""){
            errors.password = "password is required";
        }
        else if(values.get("password").length < 8){
             errors.password = "password length is less then 8";
         }
         else if(!/^[ A-Za-z0-9_@./#&+-]*$/.test(values.get("password"))){
            errors.password = "Only special characters and alphanumeric is allowed!";
        }
        if(!/^[A-Za-z0-9]+$/.test(values.get("SecurityAnswerOne")) ){
            errors.answer1 = "Only Alphanumeric is allowed"
        }
        
        if(!/^[A-Za-z0-9]+$/.test(values.get("SecurityAnswerTwo")) ){
            errors.answer2 = "Only Alphanumeric is allowed"
        }
        if(!/^[A-Za-z0-9]+$/.test(values.get("SecurityAnswerThree")) ){
            errors.answer3 = "Only Alphanumeric is allowed"
        }
        
        if(!/^[0-9]+$/.test(values.get("ceasercipher")) ){
            errors.answer3 = "Only Alphanumeric is allowed"
        }
        return errors;

    }
     const handleSubmit = (event) => {
    
    event.preventDefault();
    const UserData = new FormData(event.currentTarget);

//  User Registration in Cognito 
    UserPool.signUp(UserData.get("email"),UserData.get("password"),[],null,(err,data) => {
        if(err){
            Alert("Either Email is already valid or password is not in valid format!");
            return null;
        }
    })
    console.log("Store In Cognito")
// Storing the infromation in firbase
    const userCol = collection(db, "serverlessAuthentication");
    var ceaserKey  = parseInt(UserData.get("ceasercipher"))%26
    var chk = addDoc(userCol, {
        email: UserData.get("email"),
        Question1: UserData.get("SecurityAnswerOne"),
        Question2: UserData.get("SecurityAnswerTwo"),
        Question3: UserData.get("SecurityAnswerThree"),
        ceasercipherKey : ceaserKey
      });
// Calling Lambda Functions

    // await axios.post(Constants.AXIOS_CUSTOMER_ID,
    // {
    //   firstName : UserData.get("firstName")
    // }).then((data) => {
    //       setCustomercsId(data.data);
          
    // })

   var name = UserData.get("firstName"); 
   var curTime = Date.now()
   var custId = name + curTime;

   console.log(custId);
   
    axios.post(Constants.AXIOS_CUSTOMER,{
          email: UserData.get("email"),
          firstName:  UserData.get("firstName"),
          lastName:   UserData.get("lastName"),
          customerid: custId,
          phone:   UserData.get("Phone").toString()
      }).then((data)=> {
        navigate("/signin");
      })
    console.log("Cstoer ID:" , custId);



}
  return (
    <>
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
                Register
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="firstName"
                  label="First Name"
                  type="firstName"
                  id="firstName"
                />
                {/* <p>{error.firstname}</p> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  type="lastName"
                  id="lastName"
                />
                {/* <p>{error.lastname}</p> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoFocus
                />
                {/* <p>{error.email}</p> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Phone"
                  label="Phone"
                  type="Phone"
                  id="Phone"
                />
                {/* <p>{error.phone}</p> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="SecurityAnswerOne"
                  label="What’s your favorite movie? (Security Question 1)"
                  type="SecurityAnswerOne"
                  id="SecurityAnswerOne"
                />
                {/* <p>{error.answer1}</p> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="SecurityAnswerTwo"
                  label="What’s your favorite Food? (Security Question 2)"
                  type="SecurityAnswerTwo"
                  id="SecurityAnswerTwo" />
                {/* <p>{error.answer2}</p> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="SecurityAnswerThree"
                  label="What’s your favorite person? (Security Question 3)"
                  type="SecurityAnswerThree"
                  id="SecurityAnswerThree" />
                {/* <p>{error.answer3}</p> */}
                <Number
                  margin="normal"
                  required
                  fullWidth
                  name="ceasercipher"
                  label="ceasercipher key"
                  type="ceasercipher"
                  id="ceasercipher" />
                {/* <p>{error.ceaser}</p> */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                {/* <p>{error.password}</p> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Register
                </Button>
                <Grid container>
                  <Grid item xs>
                  </Grid>
                  <Grid item>
                    <Button
                  onClick={goSignIn}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Already Have An Account? Sign In
                </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
    </>
    
  );
}
