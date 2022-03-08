import '../styles/Top.css'
import options from '../assets/Icons/options.png'

function Top() {
    return (
    <div className="top"> 
        <a href="#" className="options-button"><img src={options} alt="options" className="options-icon"></img></a>
        <div className="navbar">
            <a href="#">ACCEUIL</a>
            <a href="#">PROFIL</a>
        </div>
    </div>
        )
    }

export default Top