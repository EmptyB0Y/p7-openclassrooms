import Trash from '../assets/Icons/Trash.webp'
import { useState, useEffect, useRef, useCallback } from 'react'
import {DelComment, GetComments,PostComment} from '../services/comments.service'
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

    const getProfilePic = (userId) =>{
        if(profiles[userId] !== undefined){
            return profiles[userId].pictureUrl;
        }
        return("");
    }

    const getAccess = (userId) =>{
        if(profiles[userId] !== undefined){
            return profiles[userId].access;
        }
        return("none");
    }

    const refresh = () => {
        setChange(!change);
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
    const handleClickDelete = (e) => {
        let commentId = ReactDOM.findDOMNode(e.target).parentNode.id;
        if(commentId === ''){
            commentId = ReactDOM.findDOMNode(e.target).parentNode.parentNode.id
        }
        DelComment(commentId)
        .then(()=>{ refresh() });
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
        authorUserIds.push(sessionStorage.getItem("userId"));

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
        let deleteCommentElement = {};
        deleteCommentElement[sessionStorage.getItem("userId")] = (<button className='delete-comment' onClick={(e) => handleClickDelete(e)}><img className='delete-comment-icon' src={Trash} width='10' height='10'></img></button>);
        if(getAccess(sessionStorage.getItem("userId")) === "admin"){
            for(let i = 0;i < comments.length; i++){
                deleteCommentElement[comments[i].author] = deleteCommentElement[sessionStorage.getItem("userId")];
            }
        }

        commentsElement = (
            <ul>
            {comments.map((comment) =>
                <li className='comment' key={comment._id} id={comment._id}>
                    <img className='comment-profile-picture' src={getProfilePic(comment.author)}></img>
                    <div className='comment-content'>
                        <a href='#' className='comment-author' onClick={(e) => handleClick(e,comment.author)}>{getFirstname(comment.author)} {getLastname(comment.author)}</a>~
                        {comment.text}
                    </div>
                    {deleteCommentElement[comment.author]}
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