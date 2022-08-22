import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Feedback.css';
import {Navigation} from './Navigation';
import { Col,Row,Container} from "react-bootstrap";
export default function Recommendation () {
    const navigate = useNavigate();
  
  const handleSubmit = (event)=>{
    event.preventDefault();
    
    axios({
        method:'post',
        url:"https://us-central1-my-project-355622.cloudfunctions.net/tour-prediction",
   data:
    {
        "booking_id" : ""+Math.random() * (2000 - 1000) + 1000,
        "age": ""+Math.random() * (80 - 10) + 10,
        "number": ""+Math.random() * (200 - 0) + 0
        }
    })
    .then((response) => {
        console.log(response.data.data.tour);
        if(response.data.data.tour<=3){
            navigate("/tourpckg"+response.data.data.tour)
        }
        else{
            navigate("/tourpckg"+4)
        }
      }, (error) => {
        console.log(error);
      })
    // console.log(data);
};
//   console.log(data);
    
return(
    <>
    <Navigation />
    <Container className="fed-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="fed-container">
                    <div className="fed-card">
                        <div className="fed-form">
                            <form className="feedback-form" onSubmit={handleSubmit}>
                            <h2>Package Recommendation</h2>
                            
                            <center><button
                                className="Form-field"
                                type="submut">Get Tour Package </button></center>
                            </form>
                        </div>
                         </div>
                </div>
            </Row>
        </Container>
    </>
);

};
