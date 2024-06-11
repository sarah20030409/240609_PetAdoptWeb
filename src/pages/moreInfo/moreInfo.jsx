import React,{useState,useEffect} from "react";
import BackBtn from "../backBtn/backBtn";
import Loading from "../../global/Loading/Loading";
import "./moreInfo.css";
import axios from "axios";


export default function MorePage() {

    return (
        <div className="More_Page">
        <div className="Layout">
            <div className="More_backBtn">
                <BackBtn path={'/adopt'} morePid={true} />
            </div>
            <div className="Left_Info">
                <Left_Info/>
            </div>

            <div className="Right_Comments">
                <Right_Comments/>
            </div>
        </div>
        </div>
    )
}

export function Left_Info() {
    const morePid = localStorage.getItem('morePid');
    const [mPetInfo,setmPetInfo] = useState([]);
    const [loading,setLoading] = useState(true);


    async function getCurrnetPid(){
        try{
            const response = await axios.get(`http://localhost:5000/currentPet/${morePid}`);
            setmPetInfo(response.data[0]);
        }
        catch(error){
            console.error("There was an error fetching the pet card data!", error);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getCurrnetPid();
    }, []);

    return(
        <div className="Info">
        {loading ? <Loading /> :
        <>
            <p className="name">{mPetInfo.name}</p>
            <div className="imgOutFrame">
            {/* <img className="InfoImg" src={SampleImg} /> */}
            <img className="InfoImg" src={`http://localhost:5000/${mPetInfo.petImage}`} />
            </div>
            <div className="InfoText">
            <p className="age"><span className="bold">Age:</span>{mPetInfo.age} years old</p>
            <p className="variety"><span className="bold">Variety:</span>{mPetInfo.variety}</p>

            <div className="infoTxt">
            <p className="info_Title"><span className="bold">information:</span></p>
            <p className="info">{mPetInfo.information}</p>
            </div>
            </div>
        </>
        }
        </div>
    );
}



export function Right_Comments() {
    return(
        <div className="comments">
            <div className="comments_Title">
                <h1>User's Comments</h1>
            </div>

            <div className="AllComments">
                <CommentBlock />
            </div>

            <div className="CommentText">
                <CommentTextarea />
            </div>
        </div>
    );
}

// 以下都是右邊區塊的元件
export function CommentBlock() {
    const [userComments,setUserComments] = useState([]);
    

    async function GetComments(){
        const morePid = localStorage.getItem('morePid');

        try{
            const response = await axios.get(`http://localhost:5000/getComment/${morePid}`);
            setUserComments(response.data);
            console.log(response.data);

        }
        catch(error){
            console.error("There was an error get comments!", error);
        }
    }

    useEffect(() => {
        GetComments();
    }, []);

    return(
        <>
        {userComments.map((userComments,i) => (
        <div className="commentBlock">
                <h3 className="userName">{userComments.name}:</h3>
                <p className="comment">{userComments.comments}</p>
        </div>
        ))}
        </>
    );
}

export function CommentTextarea() {
    const addComment = async(event) =>{
        event.preventDefault();
        const userId = localStorage.getItem('userId');
        const morePid = localStorage.getItem('morePid');

        const formData = new FormData(event.target);
        const comment = formData.get('comment');

        try{
            const response = await fetch('http://localhost:5000/saveComment',{
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({userId,morePid,comment})
            });

            const data = await response.json();
            console.log(data);
            
            if(data.success){
                window.location.reload();
            }
            else{
                alert(`Add comment failed! ${data.error}`);
            }
        }
        catch(error){
            console.error('There was an error inserting current pet data!', error);
        }

    }

    return(
        <form className="commentForm" onSubmit={addComment}>
            <input className="commentInput" name="comment" type="text" placeholder="Comments.." autoComplete='off' maxLength="100" required></input>
            <input className='sendBTN' type='submit' value='→'></input>
        </form>
    )
}