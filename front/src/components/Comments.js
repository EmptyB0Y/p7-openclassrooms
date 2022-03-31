import like from '../assets/Icons/like.png'
import nopic from '../assets/Icons/nopic.webp'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetComments,PostComment} from '../services/comments.service'
import {SearchProfiles} from '../services/profiles.service'
import {Profile} from './Profile'
import { Top } from './Top'
import ReactDOM from 'react-dom'

export const Comments = (id) => {
    const [comments, setComments] = useState([]);
    const [change, setChange] = useState(false);
    const [load,setLoad] = useState(false);
    const [profiles, setProfiles] = useState({});

    let commentsElement = (<p>Loading...</p>);

    const getFirstname = (userId) =>{
        if(profiles[userId] !== undefined){
            return profiles[userId].firstname;
        }
        return("Loading...");
    }

    const getLastname = (userId) =>{
        if(profiles[userId] !== undefined){
            return profiles[userId].lastname;
        }
        return("");
    }

    const refresh = () => {
        setChange(true);
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        let text = e.target['input'].value; 
        e.target['input'].value = "";
        PostComment(id.id,text)
        .then(() => { refresh()});
    }

    const handleClick = (e,profileId) => {
        e.preventDefault();
        ReactDOM.render(
            <div>
            </div>,
              document.getElementById('root')
        );
        setTimeout(() => {
            ReactDOM.render(
                <div>
                    <Top />
                    <Profile id={profileId} />
                </div>,
                  document.getElementById('root')
            );
          }, 100);

    }
    useEffect(() => {
        GetComments(id)
        .then(data => {
            setComments(data);
        })
        .catch((err) => console.log(err)) 
      }, [change]);

      useEffect(() => {
        let authorUserIds = []
        for(let i = 0; i < comments.length; i++){
            if(!(authorUserIds.includes(comments[i].author))){
                authorUserIds.push(comments[i].author);
            }
        }

        SearchProfiles(authorUserIds)
        .then(data => {
            setProfiles(data);
            if(comments.length > 0){
                setLoad(true);
            }       
         })
        .catch((err) => console.log(err));
      }, [comments]);

    if(load){
        commentsElement = (
            <ul>
            {comments.map((comment) =>
                <li className='comment' key={comment._id}>
                    <img className='comment-profile-picture' src={nopic}></img>
                    <div>
                        <a href='#' className='comment-author' onClick={(e) => handleClick(e,comment.author)}><p className='firstname'>{getFirstname(comment.author)}</p><p className='lasttname'> {getLastname(comment.author)}</p></a>~
                        {comment.text}
                        
                    </div>
                </li>)}
            </ul>
        );
    }


    if(comments.length === 0){
        commentsElement = (<p>No comments yet...</p>);
    }

    return (
    <div className='commments-frame'>
        <div className='comments-frame-content'>
            {commentsElement}
        </div>
        <div className='add-comment'>
            <form onSubmit={(e) => {handleSubmit(e)}}>
                <input name='input' className='add-comment-input'></input>
                <button className='add-comment-button'>post</button>
            </form>
        </div>
    </div>
    )
}