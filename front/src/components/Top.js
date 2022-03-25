import '../styles/Top.css'
import options from '../assets/Icons/options.png'
import {Profile} from './Profile.js'
import {Banner} from './Banner'
import {Posts} from './Posts'
import { AddPost } from './AddPost'
import ReactDOM from 'react-dom';

export const Top = () =>{
    return (
    <div className="top"> 
        <a href="#" className="options-button"><img src={options} alt="options" className="options-icon"></img></a>
        <div className="navbar">
            <a href="#" onClick={handleClickProfile}>PROFILE</a>
            <a href="#" onClick={handleClickLogout} >LOG OUT</a>
        </div>
    </div>
        )
}

function handleClickProfile(){
    ReactDOM.render(
        <div>
            <div className="top"> 
                <a href="#" className="options-button"><img src={options} alt="options" className="options-icon"></img></a>
                <div className="navbar">
                    <a href="#" onClick={handleClickHome}>HOME</a>
                    <a href="#" onClick={handleClickLogout} >LOG OUT</a>
                </div>
            </div>
            <Profile id={sessionStorage.getItem("userId")} />
        </div>,
          document.getElementById('root')
    );
}

function handleClickLogout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    window.location.reload();
}

function handleClickHome() {
    ReactDOM.render(
        <div><Banner /><Top /><div><AddPost /><Posts /></div></div>,
        document.getElementById('root')
    );
}