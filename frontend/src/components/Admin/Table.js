import React, { useState } from 'react';
import { Row, Container, Col, Toast } from 'react-bootstrap';
import { AdminNavigation } from './AdminNavigation';
import './Dashboard.css';

const DUMMY = [
    {
        order_id: 1,
        price: 1000,
        item_name: "ABC"
    },
    {
        order_id: 3,
        price: 1005,
        item_name: "LMN"
    },
    {
        order_id: 2,
        price: 908,
        item_name: "XYZ"
    }
]

const Table = () => {

  return (
    <>
      <AdminNavigation />
      <Container className="d-bg-container d-container">
        <Row className="p-3">
          <Col>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Order Id</th>
                    <th scope="col">Price</th>
                    <th scope="col">Item name</th>
                    
                    </tr>
                </thead>
                <tbody>
                    {
                        DUMMY.map(d => {
                            return (
                            <tr>
                                <th scope="row">{d.order_id}</th>
                                <td>{d.price}</td>
                                <td>{d.item_name}</td>
                            </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Table;
