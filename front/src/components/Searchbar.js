import { TextSearchProfiles } from "../services/profiles.service";
import ReactDOM from 'react-dom';

export const Searchbar = () =>{

    return (
    <div className="searchbar">
        <form id='search-form' onKeyUpCapture={(e)=>{handleKeyUp(e)}}>
                <input id='search-input'></input>
                <button id='search-button'>SEARCH</button>
                <span id='search-results'></span>
            </form>
    </div>
        )

    function handleKeyUp(e){
        e.preventDefault();
        if(e.target.value !== ''){
            TextSearchProfiles(e.target.value).then((profiles) =>{
            ReactDOM.render(
            <ul id='search-list'>
                {profiles.map((profile) => 
                <li key={profile.userId}>
                    {profile.firstname}
                </li>)}
            </ul>,
            document.getElementById("search-results"));
            }); 
        }
        else{
            ReactDOM.render(
                <ul id='search-list'>
                </ul>,
                document.getElementById("search-results"));
        }
    }
}