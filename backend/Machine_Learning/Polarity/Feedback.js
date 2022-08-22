// import React from "react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export const Feedback = ()=> {
//     const navigate = useNavigate();
//   var [fields, setFields] = useState({
//     email_id: "",
//     feedback: "",
//   });

//   const[submitted, setSubmitted]=useState(false);
//   const[valid, setValid]=useState(false);

//   const handleEmailInputChange=(event)=>{
//     setFields({...fields,email_id:event.target.value})
//   }
//   const handleMsgInputChange=(event)=>{
//     setFields({...fields, feedback:event.target.value})
//   }

//   const handleSubmit = (event)=>{
//     event.preventDefault();
//     if(fields.email_id && fields.feedback){
//       setValid(true);
//     }
//     setSubmitted(true);
//     // navigate("/bookings");;

//     axios.post("https://yqmccozql3.execute-api.us-east-1.amazonaws.com/dev/feedback",
//       {
//         email_id: fields.email_id,
//         feedback: fields.feedback
        
//       }
      
//     )};
// return(
//   <div className="form-container">
   
//     <form className="feedback-form" onSubmit={handleSubmit}>
//     <h2>Feedback Form</h2>
//         {submitted && valid ? <div className="success-message">Thank you! Your feedback was submitted</div> :null }
//       <input type="Email"
//         onChange={handleEmailInputChange}
//         value={fields.email_id}
//         className="form-field"
//         placeholder="Email"
//         name="email"/>
//         {submitted && !fields.email_id ? <span>Please enter an email</span>:null }
//       <textarea
//         onChange={handleMsgInputChange}
//         value={fields.feedback}
//         className="form-field"
//         placeholder="Write feedback here.."
//         name="msg"/>
//         {submitted && !fields.feedback ? <span>Please enter the feedback</span> : null }
//       <button
//         className="Form-field"
//         type="submut">Submit Feedback</button>
//     </form>
//   </div>
// );

// };
