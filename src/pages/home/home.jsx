import "./css/home.css";
import Btn from "../home/components/btn"
import home_Title from "../../Imgs/home_title.webp"


export default function Home(){
    return(
        <div className="home_Page">
        {/* <h1>Home page</h1> */}
        <div className="wrap">
            <div className="title_img">
            <img className="home_title" src={home_Title} />
            </div>
            <div className="BTN_container">
                <Btn cnName="LOGIN" name="LOGIN" route="/Login"/>
                <Btn cnName="SIGNUP" name="SIGN UP" route="/Signup"/>
            </div>
        </div>
        </div>
    );
}