import '../styles/Top.css'
import options from '../assets/Icons/options.png'

export const Top = () =>{
    return (
    <div className="top"> 
        <a href="#" className="options-button"><img src={options} alt="options" className="options-icon"></img></a>
        <div className="navbar">
            <a href="#">PROFIL</a>
            <a href="#" onClick={handleClick} >SE DECONNECTER</a>
        </div>
    </div>
        )
}

function handleClick() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    window.location.reload();
}