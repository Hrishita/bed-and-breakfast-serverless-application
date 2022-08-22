
import React, { Component } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import "./AdminNavigation.css";
import { Routes, Route } from "react-router-dom";
import logo from "../../Images/Logo.png";
import ADashboard from "./ADashboard";
import Facilities from "./Facilities";
import Log from "./Log";
import Room from "./Room";
import AReservation from "./Reservation";
import Chart from "./ChartsPage";
import RoomType from "./RoomType";
import {addLog} from '../../api/axiosCall';
export class AdminNavigation extends Component {
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
                  href="/facilities"
                >
                  Facilities
                </Nav.Link>
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/roomtype"
                >
                  RoomType
                </Nav.Link>
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/room"
                >
                  Room
                </Nav.Link>
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/areservation"
                >
                  Room Reservation
                </Nav.Link>
                <Nav.Link
                  className="d-inline p-2 bg-secondary text-white"
                  href="/log"
                >
                  Logs
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route exact path="/home" element={<Chart />} />
          <Route exact path="/chart" element={<Chart />} />
          <Route exact path="/facilities" element={<Facilities />} />
          <Route exact path="/roomtype" element={<RoomType />} />
          <Route exact path="/room" element={<Room />} />
          <Route exact path="/log" element={<Log />} />
          <Route exact path="/areservation" element={<AReservation />} />
        </Routes>
      </>
    );
  }
}
