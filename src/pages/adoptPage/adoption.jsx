import React,{ useState, useEffect } from "react";
import "./adoption.css";
import AllPets from "./components/petsCard";
import PetList from "../adoptPage/components/yourPets";
import Loading from "../../global/Loading/Loading";
import {useNavigate} from "react-router-dom";


export default function AdoptPage() {
    const userName = localStorage.getItem('userName');
    const [dataFetched,setDataFetched] = useState(false);

    return (
        <div className="adopt_Page">
            <LeftArea userName={userName} dataFetched={dataFetched} />
            <RightArea setDataFetched={setDataFetched} />
        </div>  
            
    );
}

export function LeftArea({userName,dataFetched}){
    const navigate = useNavigate();
    // const goHome = () => {
    //     navigate('/');
    // }

    const goHome = async() => {
        try{
            const response = await fetch('http://localhost:5000/logout',{
                method:'POST'
            });
            
            if(response.ok){
                localStorage.removeItem('userId');
                localStorage.removeItem('userName');
                navigate('/');
            }else{
                alert(`Logout failed!`);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <div className="leftArea">
        {/* Left-user */}
        <div className="userTitle">
        <h1>HI!</h1>
        <h1>{userName}</h1>
        </div>

        {/* pet list */}
        <div className="petList">
        <div className="yourPetsTable">
            <h1>YourPets</h1>
            <div className="yourPetsList">
                <PetList dataFetched={dataFetched} />
            </div>
        </div>
        </div>
        
        {/* Logout */}
        <button className="logout" onClick={goHome}>LOGOUT</button>
        </div>
    );}

export function RightArea({setDataFetched}){
    const navigate = useNavigate();

    const goAddPet = () => {
        navigate('/AddPet');
    }

    return(
        <div className="rightArea">
        {/* right-pet */}
        <div className="upArea">
        <h1 className="title">Pets List:</h1>
        <button className="addPet" onClick={goAddPet}>ADD PET</button>
        </div>
        <AllPets setDataFetched={setDataFetched} />
        </div>
 
    );
}

