import save from '../assets/Icons/save.webp'
import pen from '../assets/Icons/pen.webp'
import {EditProfile} from '../services/profiles.service'
import { useEffect, useState } from 'react'

export const EditSecondaryInfos = (profile) =>{
    const [state,setState] = useState(<div></div>);
    const [description,setDescription] = useState(profile.profile.description)

    useEffect(()=>{

        setState( 
        <div>
            <div id='description'>
                <h3>{profile.profile.description}</h3>
          </div>
            <button id='edit-secondary-infos-btn' onClick={() => handleClickSecondaryInfos()}><img id='edit-secondary-infos-img' src={pen} width='20' height='20'></img></button>
        </div>)
    }, []);

    const handleClickSecondaryInfos = () => {
        let editform = 
        <form id='edit-secondary-infos' onSubmit={(e) => handleSubmitSecondaryInfos(e)}>
            <input id='set-description' name='set-description'></input>
            <button><img src={save} width='10' height='10'></img></button>
        </form>;
       setState(editform);
      }

      const handleSubmitSecondaryInfos = (e) => {
        e.preventDefault();
        let ProfileModified = profile.profile;
        ProfileModified.description = e.target['set-description'].value;
        EditProfile(ProfileModified)
        .then((data)=>{
          console.log(data);
          setState( 
            <div>
                <div id='description'>
                    <h3>{profile.profile.description}</h3>
                </div>
                <button id='edit-secondary-infos-btn' onClick={() => handleClickSecondaryInfos()}><img id='edit-secondary-infos-img' src={pen} width='20' height='20'></img></button>
            </div>)
        });
      }

      const handleChange = (e) => {
        if(description.length > 256){
            e.stopPropagation();
            document.getElementById("set-description").value = description;
        }
        setDescription(document.getElementById("set-description").value);
      }

    return state;
}