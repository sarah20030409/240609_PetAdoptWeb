import React from 'react'
import BackBtn from '../backBtn/backBtn';
import '../login_signUp.css';
import { useNavigate } from 'react-router-dom';

export default function SignUp(){
  const navigate = useNavigate();

  // goLogin() handle page change
  const goLogin = () =>{
    navigate('/login');
  }

  // signUp() handle form submit，prevent Default
  //https://ithelp.ithome.com.tw/articles/10263449 async await 文章
  const signUp = async (event) =>{
    event.preventDefault(); //prevent Default action
    //為了防止預設行為，我們使用preventDefault()方法來防止預設行為，
    //這也代表我們無法用<form>自帶的功能，要自己處理提交表單的行為。

    // get form data
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const password = formData.get('password');
    const gender = formData.get('gender');

    // send data to server
    try{
      const response = await fetch('http://localhost:5000/signUp', {
        method:'POST',
        body: JSON.stringify({ name, password, gender }),
        headers:{
          'Content-Type':'application/json'
        }
      });
      // 下面json要await的原因請看下文
      // https://stackoverflow.com/questions/59555534/why-is-json-asynchronous
      const data = await response.json();

      // handle response
      // 所以以下function還是需要調用 因為response的ok or not 並不屬於error.
      // 可以說只是一個states.
      handlesSignUpResponse(response,data);
    }
    catch(error){
      // 這裡是為了避免fetch的error, 像是剛剛的伺服器沒開 or 逾時等等
      alert(`fetch error! ${error}`);
    }

  };

   function handlesSignUpResponse(response,data){

     console.log(response.status); //狀態馬訊號
     if(response.ok){
      alert(data.message);
      goLogin();
    }
    else{
      alert(`Sign up failed! ${data.error}`);
    }
  }

  return (
  <div className='ls_page'>
  <BackBtn path={'/'}/>
  <h1>SIGN UP</h1>
  <div className='container'> 
  <form className='formStyle' onSubmit={signUp}>

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

    {/* gender */}
    <div className='genderTable'>
    <label>GENDER:</label>
    <select className='inputBlock genderBlock' type='checkbox' name='gender' autoComplete='off' maxLength='50' required>
        <option value='' disabled>Select Gender</option>
        <option value='male'>Male</option>
        <option value='female'>Female</option>
    </select>
    </div>

    <input className='goBtn' type='submit' value='GO→' ></input>
  </form>
  </div>
</div>
  );
}

