/*Author : Parthkumar Patel (B00899800)*/
import React from 'react';
import './Dashboard.css';
import {AdminNavigation} from './AdminNavigation';
import { Row, Container, Col } from 'react-bootstrap';
const ADashboard = (props) => {
  return (
    <>
      <AdminNavigation />
      <Container className="d-bg-container d-container">
        <Row className="p-3">
          <Col>
            <h3>Dashboard</h3>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ADashboard;
