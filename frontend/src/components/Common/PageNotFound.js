/*Author : Parthkumar Patel (B00899800)*/
import React from 'react'
import "./PageNotFound.css";
import {useNavigate} from "react-router-dom";

function PageNotFound() {

  const navigate =useNavigate();
  const goBack = () => {
    navigate(-1);
  }

  return (
    <div className='pnf-container'>      
      <div id="error-page">
         <div className='content'>
            <h2 className="header" data-text="404">
               404
            </h2>
            <h4 data-text="Opps! Page not found">
               Opps! Page not found
            </h4>
            <p>
               Sorry, the page you're looking for doesn't exist. 
               <br/>
               We can't find the page you're looking for.
            </p>
            <div className="btns">
              <button onClick={goBack}>Go Back</button>               
            </div>
         </div>
      </div>
    </div>
    
  )
}

export default PageNotFound
