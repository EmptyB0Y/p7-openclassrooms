import '../styles/Banner.css'
import logo from '../assets/Logos/icon.png'

export const Banner = () => {
    return <div className="gpm-banner">
        <img src={logo} alt="Groupomania" className="gpm-logo"></img>
        <h1>Groupomania</h1>
        </div>
}