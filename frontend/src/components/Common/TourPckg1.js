import React from 'react'
import './Feedback.css';
import {Navigation} from './Navigation';
import { Col,Row,Container} from "react-bootstrap";
export const  TourPckg1=()=> {
  return (
    <>
    <Navigation />
    <Container className="fed-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="fed-container">
                    <div className="fed-card">
                        <div className="fed-form">
                            <h1>Welcome to Tour package-1</h1>
                            Your Tour package is for:<br></br>
                            5 Days<br></br>
                            4 nights<br></br>
                            Place:British Columbia
                        </div>
                         </div>
                </div>
            </Row>
        </Container>
    </>
);
      
}

export default TourPckg1;