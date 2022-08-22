import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Feedback } from "./Feedback";
import TourPckg1 from "./TourPckg1";
import TourPckg2 from "./TourPckg2";
import TourPckg3 from "./TourPckg3";
import TourPckg4 from "./TourPckg4";


const RouteR = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Feedback />} /> */}
        <Route path="/tp1" element={<TourPckg1 />} />
        <Route path="/tp2" element={<TourPckg2 />} />
        <Route path="/tp3" element={<TourPckg3 />} />
        <Route path="/tp4" element={<TourPckg4 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteR;
