import React from 'react'
import './Feedback.css';
import {Navigation} from './Navigation';
import { Col,Row,Container} from "react-bootstrap";
export const TourPckg2=()=> {
  return (
    <>
    <Navigation />
    <Container className="fed-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="fed-container">
                    <div className="fed-card">
                        <div className="fed-form">
                            <div className='tourpckg2'>
  <h1>Welcome to Tour package-2</h1>
  Your Tour package is for:<br></br>
  7 Days<br></br>
  6 nights<br></br>
  Place:Halifax
</div>
                        </div>
                         </div>
                </div>
            </Row>
        </Container>
    </>
  
);
      
}

export default TourPckg2;