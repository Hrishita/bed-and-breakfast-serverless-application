/**
 * Author : Hrishita Mavani (B00901658)
 * this component is used to subscribe/unsubscribe from newsletter
 */
import React, { useState } from "react";

const NavTitle = () => {
   const [title, setTitle] = useState("Subscribe to Newsletter");
    const [subscribed, setSubscribed] = useState(false);
    const [show, setShow] = useState(false);

 const handleClick
    = () => {
        if (title === "Subscribe to Newsletter") {
            setTitle("Unsubscribe from Newsletter");
            setSubscribed(true);
          }
          else {
              setTitle("Subscribe to Newsletter");
                setSubscribed(false);
          }
    }

   return <h6 onClick={handleClick}>{title}</h6>;
}

export default NavTitle;