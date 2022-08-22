import React from "react";
import { Navigation } from './Navigation';
import logo from '../../Images/About.jpg'
import {ButtonBase} from '@mui/material'; 
import { experimentalStyled as styled } from '@mui/material/styles';
import {Row,Container} from "react-bootstrap";
import "./About.css"
const About = () => {
    
   
    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
      });
  return (
    <main>
        <Navigation/>
        <Container className="upf-main-bg-container upf-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="ab-container">
                    <div className="ab-card">
                        <div className="ab-form">
                            <div className="ab-left-side">
                                <ButtonBase sx={{ width: 500, height: 500 }}>
                                    <Img alt="Name" src={logo} />
                                </ButtonBase>
                            </div>

                            <div className="ab-right-side">
                                    
                                <div style={{height: "20%"}}>
                                    <div className="up-hello mb-5">
                                        <h2>Book a Hotel</h2>
                                    </div>
                                </div>
                                <div style={{height: "80%"}}>
                                    <span>We strive to make the lives of our patrons easier by multiplying revenue channels and using our technological expertise to maximize demand.</span>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Row>
        </Container>
    </main>
    
  );
};

export default About;
