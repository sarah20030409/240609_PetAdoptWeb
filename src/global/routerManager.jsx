import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import SignUp from "../pages/signUp/signUp";
import Adopt from "../pages/adoptPage/adoption";
import AddPetPage from "../pages/addPetPage/addPetPage";
import MorePage from "../pages/moreInfo/moreInfo";

export default function RouterManager() {
    return (
        <BrowserRouter>
                <Routes>
                    <Route  path="/" element={<Home />} />
                    <Route  path="/Login" element={<Login />} />
                    <Route  path="/Signup" element={<SignUp />} />
                    <Route path="/Adopt"  element={<Adopt />}/>
                    <Route path="/AddPet"  element={<AddPetPage />}/>
                    <Route path="/MoreInfo"  element={<MorePage />}/>
                </Routes>
        </BrowserRouter>
    );
}