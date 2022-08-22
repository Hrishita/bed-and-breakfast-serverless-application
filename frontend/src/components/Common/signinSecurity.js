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
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { db } from "../../config/firebase-config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate, params, Navigate,useLocation } from 'react-router-dom';
const axios = require('axios');
const theme = createTheme();

export default function SignInSecurityQuestion(props) {
const goRegister = () => {
      navigate("/registration");
    }
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state.email
    const data = state.data
    var Question1 = "What’s your favorite Movie?"
    var Question2 = "What’s your favorite Food?"
    var Question3 = "What’s your favorite Person?"
    var CurQuestion = ""
    var RandomNum = Math.floor(Math.random() * (3 - 1)) + 1;

    if (RandomNum == 1) CurQuestion = Question1;
    if (RandomNum == 2) CurQuestion = Question2;
    if (RandomNum == 3) CurQuestion = Question3;

    const [fireuser, setfireuser] = useState([]);
    const [UserData, setUserData] = useState();
    const [question, setQuestion] = useState("");


    const handleSubmit = (event) => {
        event.preventDefault();
        const UserDocData = new FormData(event.currentTarget);
                    fireuser.map((user) => {
                        console.log(user.ceasercipherKey)
                        if (user.email === email) {
                            if (`Question${RandomNum}` === "Question1" && user.Question1.toString() === UserDocData.get("question")) {
                                navigate("/signinCaeser", {state: 
                                    {
                                      key: user.ceasercipherKey, 
                                      email:email,
                                      data: {...data}
                                    }
                                  });
                            } 
                            else if (`Question${RandomNum}` === "Question2" && user.Question2.toString() ===UserDocData.get("question")) {
                                navigate("/signinCaeser", {state: 
                                    {
                                      key: user.ceasercipherKey, 
                                      email:email,
                                      data: {...data}
                                    }
                                  });
                            } else if (`Question${RandomNum}` === "Question3" && user.Question3.toString() === UserDocData.get("question")) {
                                navigate("/signinCaeser", {state: 
                                    {
                                      key: user.ceasercipherKey, 
                                      email:email,
                                      data: {...data}
                                    }
                                  });
                            }
                            else {
                                alert("Your security Answer is incorrect!");
                            }
                        }
                    });
            };

    async function  getFireuser(){
        const userDoc = collection(db, "serverlessAuthentication");
        const data =  await getDocs(userDoc);
        console.log("data" + data);
        setfireuser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    useEffect(() => {
        getFireuser();
    },[])
    
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
            id="question"
            label={CurQuestion}
            name="question"
            
            autoFocus
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
               <Button
                  onClick={goRegister}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Don't Have An Account? Sign up
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    );
}