import '../styles/Top.css'
import options from '../assets/Icons/options.png'
import {Profile} from './Profile'
import {Banner} from './Banner'
import {Posts} from './Posts'
import { AddPost } from './AddPost'
import { Searchbar } from './Searchbar'
import ReactDOM from 'react-dom';

export const Top = () =>{
    return (
    <div className="top">
        <div id='options'>
            <div id='options-anchor'>
                <div id='options-padding'>
                </div>
                <a href="#" id="options-button"><img src={options} alt="options" className="options-icon"></img></a>
            </div>
            <Searchbar />
        </div>
        <div className="navbar">
            <a href="#" onClick={(e) => handleClickProfile(e)}>PROFILE</a>
            <a href="#" onClick={(e)=>handleClickHome(e)}>HOME</a>
            <a href="#" onClick={handleClickLogout} >LOG OUT</a>
        </div>
    </div>
        )
}

function handleClickProfile(e){
    e.preventDefault();
    ReactDOM.render(
        <div>
        </div>,
          document.getElementById('root')
    );
    setTimeout(() => {
        ReactDOM.render(
            <div>
                <div className="top"> 
                    <div id='options'>
                        <div id='options-anchor'>
                            <div id='options-padding'>
                            </div>
                            <a href="#" id="options-button"><img src={options} alt="options" className="options-icon"></img></a>
                        </div>                                                     
                        <Searchbar />
                    </div>
                    <div className="navbar">
                        <a href="#" onClick={(e) => handleClickProfile(e)}>PROFILE</a>
                        <a href="#" onClick={(e)=>handleClickHome(e)}>HOME</a>
                        <a href="#" onClick={handleClickLogout} >LOG OUT</a>
                    </div>
                </div>
                <Profile id={sessionStorage.getItem("userId")} />
            </div>,
              document.getElementById('root')
        );
      }, 100);
}

function handleClickLogout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    window.location.reload();
}

function handleClickHome(e) {
    e.preventDefault();
    ReactDOM.render(
        <div>
            <div><Banner /><Top /></div>
            <div><AddPost /><Posts /></div>
        </div>,
        document.getElementById('root')
    );
}

function handleClickOptions(e){
    e.preventDefault();
    ReactDOM.render(<div id='options-padding'></div>,document.getElementById("options-anchor"));
}

function handleLeaveOptions(){
    ReactDOM.render(<div></div>,document.getElementById("options-anchor"));
}
