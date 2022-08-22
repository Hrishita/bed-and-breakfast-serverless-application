import React from 'react'
import './Feedback.css';
import {Navigation} from './Navigation';
import { Col,Row,Container} from "react-bootstrap";
export const TourPckg4=()=> {
  return (
    <>
    <Navigation />
    <Container className="fed-main-container" style={{marginTop: '4rem!important'}}> 
            <Row className="p-3">
                <div className="fed-container">
                    <div className="fed-card">
                        <div className="fed-form">
                           <div className='tourpckg4'>
  <h1>Welcome to Tour package-4</h1>
  Your Tour package is for:<br></br>
  3 Days<br></br>
  2 nights<br></br>
  Place:ontario
</div>
                        </div>
                         </div>
                </div>
            </Row>
        </Container>
    </>
  
);
      
}

export default TourPckg4;