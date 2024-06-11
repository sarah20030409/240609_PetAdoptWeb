import React from "react";
import { useState, useEffect } from "react";
// import SampleImg from "../../../Imgs/sempleImg01.webp";
import Loading from "../../../global/Loading/Loading";
import "./petsCard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function AllPets({setDataFetched}){
    const [Pet,setPet] = useState([]);
    const [loading,setLoading] = useState(true);

    async function fetchPetData(){
    try{
        const response = await axios.get(`http://localhost:5000/allPets`);

        response.data.map((data,i) =>{
            if(data.OwnerId === null){
                response.data[i].isClicked = false; 
            }
            else{
                response.data[i].isClicked = true;
            }
        });
        
        setPet(response.data);
        setDataFetched(true);
        } 
        catch(error){
            console.error("There was an error fetching the pet card data!", error);
            }
        finally{
            setTimeout(() => {
                setLoading(false);
            }, 1000);}
        };

    useEffect(() => {
        fetchPetData();
    }, []);

    return(
        <div className="allPets">
        {loading ? <Loading /> :
        <>
        {Pet.map((Pet) => (
        <PetsCard 
        key={Pet.pId} 
        id={Pet.pId} 
        name={Pet.name} 
        age={Pet.age} 
        variety={Pet.variety} 
        petImage={`http://localhost:5000/${Pet.petImage}`}
        isDisabled={Pet.isClicked}
        />
        ))} 
        </>}
        </div>
     
    );
}



export function PetsCard({id,name,age,variety,petImage,isDisabled}) {
    const[isClicked,setIsClicked] = useState(isDisabled);
    const userId = localStorage.getItem('userId'); 
    const [noOwner,setNoOwner] = useState(false);
    const [owner, setOwner] = useState(null);
    const navigate = useNavigate();

    const goMore = () =>{
        localStorage.setItem('morePid',id);
        navigate('/MoreInfo');
    }

    const handleClick = () => {
        axios.post("http://localhost:5000/adoptedPet", {id, userId})
        .then(response => {
            console.log(response,"Adoption successful!");
            alert("Adoption successful!");
            setIsClicked(true);
            window.location.reload();
        })
        .catch(error => {
            console.log(error,"Adoption failed!");
        });
    }

    async function GetNameById(pId){
        try{
            const response = await axios.get(`http://localhost:5000/owner/${pId}`);
            if(response.data.name) {
                setOwner(response.data.name);
            } else {
                setNoOwner(true);
            }
        }
        catch(error){
            console.error("There was an error fetching the pet card's owner name!", error);
        }
    }
    useEffect(() => {
            GetNameById(id);
    }, [id]);

    return(
        <div className="petsCard" >
            <div className="cardBackground">
            <div className="imgOutFrame">
            <img className="cardImg" src={petImage} />
            </div>
            <div className="petInfo">
            <p className="Id"><span className="bold">ID:</span>#{id}</p>
            <p className="name"><span className="bold">Name:</span>{name}</p>
            <p className="age"><span className="bold">Age:</span>{age} years old</p>
            <p className="variety"><span className="bold">Variety:</span>{variety}</p>
            </div>

            <div className="btnMiddle">
            <button className={isClicked ? "adoptBtn clicked" : "adoptBtn"} onClick={handleClick} disabled={isClicked}>ADOPT</button>
            <p className="more" onClick={goMore}>More →</p>
            </div>

            <p className={noOwner ?  "Owner NoOwner" :  "Owner"}><span className="bold">Owner:</span>{owner}</p>
            
            </div>
        </div>
    );
}