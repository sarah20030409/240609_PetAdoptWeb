import React from "react";
import BackBtn from "../backBtn/backBtn";
import './addPetPage.css';
import { useNavigate } from "react-router-dom";

export default function AddPetPage() {
    const navigate = useNavigate();

    const goAdopt = () =>{
        navigate('/adopt');
    }
    
        const addPet = async(event) =>{
        event.preventDefault();

        const formData = new FormData(event.target);
        const name = formData.get('name');
        const age = formData.get('age');
        const variety = formData.get('variety');
        const info = formData.get('information');
        const image = formData.get('image');

        formData.append('name',name);
        formData.append('age',age);
        formData.append('variety',variety);
        formData.append('info',info);
        formData.append('image',image);
        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);
        console.log(image);

    try{
        const response = await fetch('http://localhost:5000/addPet',{
            method:'POST',
            body:formData
        });

        const data = await response.json();
        handlesAddPetResponse(response,data);
    }
    catch(error){
        console.log(error);
        alert(`fetch error! ${error}`);
        }
    };

    function handlesAddPetResponse(response,data){
        if(response.ok){
            alert(`Add pet success!`);
            goAdopt();
        }
        else{
            alert(`Add pet failed! ${data.error}`);
        }
    }
    
    return (
        <div className="addPet_Page">
            <div className='ls_page'>
      <BackBtn path={'/adopt'}/>
      <h1>NEW PET</h1>
      <div className='container'> 

      <form className='formStyle' onSubmit={addPet}>

    <div className="formLayout">
    {/* FormLeft */}
    <div className="formLeft">
        {/* name */}
        <div className='nameTable'>
        <label>NAME:</label>
        <input className='inputBlock' type='text' name='name' autoComplete='off' maxLength='50' required></input>
        </div>

        {/* age */}
        <div className='ageTable'>
        <label>AGE:</label>
        <input className='inputBlock' type='number' name='age' autoComplete='off' maxLength='50' required></input>
        </div>

        {/* age */}
        <div className='varietyTable'>
        <label>VARIETY:</label>
        <input className='inputBlock' type='text' name='variety' autoComplete='off' maxLength='50' required></input>
        </div>
    </div>

    {/* FormRight */}
    <div className="formRight">
        {/* information */}
        <div className='informationTable'>
        <label>INFORMATION:</label>
        <textarea className='inputBlock' type='text' name='information' autoComplete='off' maxLength='250' required></textarea>
        </div>

        {/* Image */}
        <div className='imageTable'>
        <label>UPLOAD PET IMAGE:</label>
        <input className='inputBlock' type='file' name='image' autoComplete='off' maxLength='50' required></input>
        </div>

    </div>
    </div>

        <input className='addBtn' type='submit' value='ADD'></input>
      </form>
      </div>
    </div>
        </div>
    );
}