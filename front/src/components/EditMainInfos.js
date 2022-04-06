import save from '../assets/Icons/save.webp'
import pen from '../assets/Icons/pen.webp'
import {EditProfile} from '../services/profiles.service'
import { useEffect, useState } from 'react'

export const EditMainInfos = (profile) =>{
    const [state,setState] = useState(<div></div>);


    useEffect(()=>{
        let editElement = <div></div>;

        if(profile.profile.canEdit){
            editElement = (<button id='edit-main-infos-btn' onClick={() => handleClickMainInfos()}><img id='edit-main-infos-img' src={pen} width='20' height='20'></img></button>);
        }
        setState(
        <div>
            <div id='firstname-lastname'>
                <h2>{profile.profile.firstname} {profile.profile.lastname}</h2>
            </div>
            {editElement}
        </div>)
    }, []);

    const handleClickMainInfos = () => {
        let editform = 
        <form id='edit-main-infos' onSubmit={(e) => handleSubmitMainInfos(e)}>
            <input name='set-firstname'></input>
            <input name='set-lastname'></input>
            <button><img src={save} width='10' height='10'></img></button>
        </form>;
       setState(editform);
      }


    const handleSubmitMainInfos = (e) => {
        e.preventDefault();
        let ProfileModified = profile.profile;
        ProfileModified.firstname = e.target['set-firstname'].value;
        ProfileModified.lastname = e.target['set-lastname'].value;
        console.log(ProfileModified);
        EditProfile(ProfileModified)
        .then((data)=>{
            console.log(data);
            setState( 
            <div>
                <div id='firstname-lastname'>
                    <h2>{profile.firstname} {profile.lastname}</h2>
                </div>
                <button id='edit-main-infos-btn' onClick={() => handleClickMainInfos()}><img id='edit-main-infos-img' src={pen} width='20' height='20'></img></button>
            </div>)
        });
    }

    return state;
}