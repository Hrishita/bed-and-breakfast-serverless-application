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
import { useNavigate,Navigate,Link , createSearchParams } from 'react-router-dom';
import axios from "axios";
import Constants from '../../api/constants';
window.Buffer = window.Buffer || require("buffer").Buffer;


const poolData = {
   /*  UserPoolId: Constants.COGNITO_USER_POOL_ID,
    ClientId: Constants.COGNITO_CLIENT_ID */
     UserPoolId: "us-east-1_EusrluNY8",
    ClientId: "44g86k8a7d3a2q11ls0ql8ehvp"
}

const UserPool = new CognitoUserPool(poolData);

const theme = createTheme();
var error = {}

export default function SignIn() {
 const goRegister = () => {
      navigate("/registration");
    }
 const navigate = useNavigate();

 const  handleSubmit = (event) => {
 event.preventDefault();

//  Getting the form Data
    const UserData = new FormData(event.currentTarget);
    const user = new CognitoUser({
        Username:UserData.get("email"),
        Pool:UserPool
    })

    const userDetails = new AuthenticationDetails({
        Username:UserData.get("email"),
        Password:UserData.get("password")
    })

    user.authenticateUser(userDetails,{
        onSuccess:(data) => {
          navigate("/signinSecurity", {state: 
              {
                email: UserData.get("email"), 
                data: {...data}
              }
            });
        }, onFailure:(err) =>{
            if(err.toString() === "NotAuthorizedException: Incorrect username or password."){
                alert("Incorrect username or password or Email is still not varified!");
            }
        }
    });

  };

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
            id="email"
            label="Email Address"
            name="email"
            autoFocus
          />
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
