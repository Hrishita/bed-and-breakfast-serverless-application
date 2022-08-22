import React from "react";
import "./App.css";
import ADashboard from "./components/Admin/ADashboard";
import Dashboard from "./components/Common/Dashboard";
import About from "./components/Common/About";
import Facilities from "./components/Admin/Facilities";
import RoomType from "./components/Admin/RoomType";
import AReservation from "./components/Admin/Reservation";
import Chart from "./components/Admin/ChartsPage";
import Room from "./components/Admin/Room";
import Log from "./components/Admin/Log";
import PageNotFound from "./components/Common/PageNotFound";
import Feedback from "./components/Common/Feedback";
import UserNotAuthenticate from "./components/Common/UserNotAuthenticate";
import CSearch from "./components/Customer/Search";
import CReservation from "./components/Customer/Reservation";
import FoodItem from "./components/Customer/FoodItem";
import FoodOrder from "./components/Customer/FoodOrder";
import Chat from "./components/Common/Chat";
import Tourpackage from "./components/Common/Tourpackage";
import TourPckg1 from "./components/Common/TourPckg1";
import TourPckg2 from "./components/Common/TourPckg2";
import TourPckg3 from "./components/Common/TourPckg3";
import TourPckg4 from "./components/Common/TourPckg4";
import Recommendation from "./components/Common/Recommendation";
import SignIn from "./components/Common/signin";
import Registration from "./components/Common/registration";
import SignInSecurityQuestion from "./components/Common/signinSecurity";
import SignInCaesar from "./components/Common/singinCaeser";
import { Routes, Route} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  /* const body= {
    CustomerId: '1234',
    Type:'Admin',
  }
  localStorage.setItem("token", JSON.stringify(body)); */
  if(localStorage.getItem("token") === null)
  {
      const body= {
            CustomerId: '',
            Type:'Basic',
            AccessToken:'',
            Email:''
        }
        localStorage.setItem("token", JSON.stringify(body));
  }
  const user = localStorage.getItem("token");
  var json = JSON.parse(user);
  console.log(json);
  console.log(json.Type);
  return (
    <>
    <Chat/>
    <Routes>
        <Route exact path="/" element={<SignIn />} />
        {user && json.Type==='Common' && <Route exact path="/home" element={<CSearch />} />}
        {user && json.Type==='Common' && <Route exact path="/recommendation" element={<Recommendation />} />}
        {user && json.Type==='Common' && <Route exact path="/tourpckg" element={<Tourpackage />} />}
        {user && json.Type==='Common' && <Route exact path="/tourpckg1" element={<TourPckg1 />} />}
        {user && json.Type==='Common' && <Route exact path="/tourpckg2" element={<TourPckg2 />} />}
        {user && json.Type==='Common' && <Route exact path="/tourpckg3" element={<TourPckg3 />} />}
        {user && json.Type==='Common' && <Route exact path="/tourpckg4" element={<TourPckg4 />} />}
        {user && json.Type==='Common' && <Route exact path="/food" element={<FoodItem />} />}
        {user && json.Type==='Common' && <Route exact path="/foodorder" element={<FoodOrder />}  />}
        {user && json.Type==='Admin' && <Route exact path="/home" element={<Chart />} />}
        {user && json.Type==='Admin' && <Route exact path="/log" element={<Log />} />}
        {user && json.Type==='Admin' && <Route exact path="/chart" element={<Chart />} />}
        {user && json.Type==='Admin'&& <Route exact path="/facilities" element={<Facilities />} />}
        {user && json.Type==='Admin'&& <Route exact path="/roomtype" element={<RoomType />} />}
        {user && json.Type==='Admin'&& <Route exact path="/room" element={<Room />} />}
        {user && json.Type==='Common'&& <Route exact path="/creservation" element={<CReservation />} />}
        {user && json.Type==='Common'&& <Route exact path="/feedback" element={<Feedback />} />}
        {user && json.Type==='Common'&& <Route exact path="/csearch" element={<CSearch />} />}
        {user && json.Type==='Admin'&& <Route exact path="/areservation" element={<AReservation />} />}
        
        <Route exact path="/about" element={<About />} />
        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/signinSecurity" element={<SignInSecurityQuestion />} />
        <Route exact path="/signinCaeser" element={<SignInCaesar />} />
        <Route exact path="/registration" element={<Registration />} />
    </Routes>
    <ToastContainer position="bottom-right" autoClose={1000} />
    </>
  );
};

export default App;
