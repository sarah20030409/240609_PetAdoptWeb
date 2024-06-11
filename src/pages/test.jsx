import React, { useState, useEffect } from "react";
//useState use to retrieve the date from the backend.
//useEffect use to fetch the backend API on the first render of the page.
import axios from "axios";

export default function Test(){
    const [message, setmassage] = useState("");

  const fetchAppData = () => {
    axios
      .get("http://localhost:5000/owner/all") //axios get the data from the backend,returns a promise
      .then((response) => {
        setmassage(response.data[0].name);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };
  useEffect(fetchAppData, []);

    
    return(
        <>
        <div className="App"><h1>Wellcome, {message} !</h1></div>
        </>
    );
}