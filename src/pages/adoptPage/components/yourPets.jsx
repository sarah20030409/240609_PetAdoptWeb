import React from "react";
import "./yourPets.css";
import { useState, useEffect } from "react";
import axios from "axios";


export default function PetList({dataFetched}){
    const userId = localStorage.getItem('userId');
    const [Pet,setPet] = useState([]);

    async function fetchPetListData(){
        try{
            const response = await axios.get(`http://localhost:5000/petList/${userId}`);
            setPet(response.data);
        }
        catch(error){
            console.error("There was an error fetching the pet list data!", error);
        }
        }
        
    useEffect(() => {
    if(dataFetched){
        fetchPetListData();} 
    }, [dataFetched]);
    

    return(
        <>
        {Pet.map((Pet) => (
                <YourPets key={Pet.pId} petName={Pet.name} petId={Pet.pId} petVariety={Pet.variety} />
        ))}
        </>
    );
}

export function YourPets({petName,petId,petVariety}){
    return(
        <div className="yourPets_item">
            <p className="name">{petName}</p>
            <div className="petInfo">
                <p className="id">#{petId}</p>
                <p className="variety">{petVariety}</p>
            </div>
        </div>
    );
}