
import React, { Component } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import "./Navigation.css";
import { Routes, Route } from "react-router-dom";
import logo from "../../Images/Logo.png";
import Dashboard from "./Dashboard";
import CSearch from "../Customer/Search";
import About from "../Common/About";
import Feedback from "../Common/Feedback";
import CReservation from "../Customer/Reservation";
import FoodItem from "../Customer/FoodItem";
import FoodOrder from "../Customer/FoodOrder";
import {addLog} from '../../api/axiosCall';
export class Navigation extends Component {
   handleLogout = () => {
    
       const bodydata={ CustomerId:JSON.parse(localStorage.getItem("token")).CustomerId,Timestamp:new Date(),Status: 'Logged-Out'};
        
                        addLog(bodydata)
                        .then((res) => {
                            if (res.status === 201) {
                                if (res.data["Status"]) {
                                  alert("Logged-Out");
                                  localStorage.removeItem("token");
                                  const body= {
                                          CustomerId: '',
                                          Type:'Basic',
                                          AccessToken:'',
                                          Email:''
                                      }
                                      localStorage.setItem("token", JSON.stringify(body));
                                   window.location = `/signin`;
                                }
                            }
                        })
                        .catch((err) => {
                            alert(err.response?.data['Message']);
                        });
   
  };
  handleAbout = () => {
    window.location = `/about`;
  };
  render() {
    return (
      <>
        <Navbar collapseOnSelect className=" App-header" expand="lg" bg="dark" variant="dark">
          <Container style={{ marginLeft: "unset", minWidth: "100%" }}>
            <Navbar.Brand href="/home">
              <img
                src={logo}
                className="n-App-logo rounded-circle pe-3"
                alt="logo"
              />
              B &amp; B Hotels
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav>
                <NavDropdown
                  align="end"
                  title={
                    <i
                      className="fas fa-user-alt rounded-circle c-white"
                      alt="profile"
                      width="30"
                    ></i>
                  }
                >
                  <NavDropdown.Item onClick={this.handleAbout}>
                    About Us
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={this.handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Navbar collapseOnSelect className="bg-secondary" expand="lg">
          <Container style={{ marginLeft: "unset" }}>
            <Navbar.Toggle aria-controls="responsive-navbaritem-nav" />
            <Navbar.Collapse id="responsive-navbaritem-nav">
              <Nav className="me-auto">
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/home"
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/creservation"
                >
                  Room Reservation
                </Nav.Link>
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/food"
                >
                  Food Booking
                </Nav.Link>
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/foodorder"
                >
                  Food Orders
                </Nav.Link>
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/feedback"
                >
                  Feedback
                </Nav.Link>
                 <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/recommendation"
                >
                  Recommendation
                </Nav.Link>
                 <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/about"
                >
                  About Us
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route exact path="/home" element={<CSearch />} />
          <Route exact path="/creservation" element={<CReservation />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/food" element={<FoodItem />} />
          <Route exact path="/foodorder" element={<FoodOrder />} />
          <Route exact path="/feedback" element={<Feedback />} />
        </Routes>
      </>
    );
  }
}
