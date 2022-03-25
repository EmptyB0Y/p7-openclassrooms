import like from '../assets/Icons/like.png'
import nopic from '../assets/Icons/nopic.webp'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetComments,PostComment,GetAuthorProfile} from '../services/comments.service'

export const Comments = (id) => {
    const [comments, setComments] = useState([]);
    const [change, setChange] = useState(false);
    let authorProfiles = [];

    useEffect(() => {
        GetComments(id)
        .then(data => {
            console.log(data);
            setComments(data);
            for(let i = 0; i< comments.length; i++){
                GetAuthorProfile(i.author)
                .then((profile)=>{
                    authorProfiles[i.author] = profile;
                    console.log(profile);
                })
            }
            console.log(authorProfiles);
        })
        .catch((err) => console.log(err)) 
      }, [])

    const getProfile = (author) =>{
        /*GetAuthorProfile(author).then((profile)=>{
            profiles.push(profile);
            return profile.firstname;
        }).catch(()=>{return 'Loading'});*/
    }

    let commentsElement = (
        <ul>
        {comments.map((comment) =>
            <li className='comment' key={comment._id}>
                <img className='comment-profile-picture' src={nopic}></img>
                <div>
                    <p><a href='#' id='comment-author'>{comment.author}</a>~
                    {comment.text}
                    </p>
                </div>
            </li>)}
        </ul>
        );

    if(change){
        setChange(false);

        return (
        <ul>
        {comments.map((comment) =>
            <li className='comment' key={comment._id}>
                <img className='comment-profile-picture' src={nopic}></img>
                <div>
                    <p>{comment.author}~
                    {comment.text}
                    </p>
                </div>
            </li>)}
        </ul>
        );
    }

    if(comments.length === 0){
        commentsElement = (<p>No comments yet...</p>);
    }
    const refresh = () => {
        setChange(true);
        GetComments(id).then((data) =>{
            setComments(data);
        });
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        let text = e.target['input'].value; 
        PostComment(id.id,text)
        .then(() => { refresh()});
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