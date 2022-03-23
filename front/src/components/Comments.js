import like from '../assets/Icons/like.png'
import nopic from '../assets/Icons/nopic.webp'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetComments} from '../services/comments.service'

export const Comments = (id) => {
    const [isLoading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);

      useEffect(() => {
        GetComments(id)
        .then(data => {console.log(data);setComments(data);})
        .catch((err) => console.log(err)) 
      }, [])

    if (isLoading) {
        return <h1>LOADING...</h1>
    }
    
    let commentsElement = (
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
        
    if(comments.length == 0){
        commentsElement = (<p>No comments yet...</p>);
    }
    return (
    <div className='commments-frame'>
        <div className='comments-frame-content'>
            {commentsElement}
        </div>
    </div>)
    
    /*console.log(comments);
    console.log(typeof comments);
    return(<div><p>.</p></div>)*/
}