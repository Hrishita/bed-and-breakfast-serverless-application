import React from 'react'
import './Feedback.css';
import {Navigation} from './Navigation';
import { Col,Row,Container} from "react-bootstrap";
export const Tourpackage=()=> {
  return (
    <>
    <Navigation />
    <Container className="fed-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="fed-container">
                    <div className="fed-card">
                        <div className="fed-form">
                            <h1>Welcome to Tour package</h1>
                        </div>
                         </div>
                </div>
            </Row>
        </Container>
    </>
);
      
}

export default Tourpackage;