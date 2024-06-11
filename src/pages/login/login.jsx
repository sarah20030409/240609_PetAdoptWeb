import React from 'react'
import BackBtn from '../backBtn/backBtn';
import '../login_signUp.css';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const navigate = useNavigate();

  const goAdopt = () =>{
    navigate('/Adopt');
  }

  const login = async (event) =>{
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('name');
    const password = formData.get('password');

    try{
      const reaponse = await fetch ('http://localhost:5000/login',{
        method:'POST',
        body:JSON.stringify({name,password}),
        headers:{
          'Content-Type':'application/json'
        }
      });

      const data = await reaponse.json();
      handlesLoginResponse(reaponse,data);

    }
    catch(error){
      alert(`fetch error! ${error}`);
    }
  };

  function handlesLoginResponse(response,data){
    console.log(data.name,data.oId);
    if(response.ok){
      const userName = localStorage.setItem('userName',data.name);
      const userId = localStorage.setItem('userId',data.oId);
      goAdopt();
    }
    else{
      alert(`Login failed! ${data.error}`);
    }
  }

  return (
    <div className='ls_page'>
      <BackBtn path={'/'}/>
      <h1>LOGIN</h1>
      <div className='container'> 
      <form 
      className='formStyle' 
      onSubmit={login}
      >

        {/* name */}
        <div className='nameTable'>
        <label>NAME:</label>
        <input className='inputBlock' type='text' name='name' autoComplete='off' maxLength='50' required></input>
        </div>

        {/* password */}
        <div className='passwordTable'>
        <label>PASSWORD:</label>
        <input className='inputBlock' type='password' name='password' autoComplete='off' maxLength='50' required></input>
        </div>

        <input className='goBtn' type='submit' value='GO→'></input>
      </form>
      </div>
    </div>
  );
}

