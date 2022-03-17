import like from '../assets/Icons/like.png'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetComments} from '../services/comments.service'


export const Comments = () => {
    const [isLoading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);

      useEffect(() => {
        GetComments()
        .then(data => setComments(data))
        .catch((err) => console.log(err)) 
      }, [])

    if (isLoading) {
        return <h1>LOADING...</h1>
    }
    if(comments.length == 0){
        return (<div className='commments-content'><p>No comments yet...</p></div>)
    }
   /* return (<div className='commments-content'>
        <ul>
        {comments.map((comment) =>
            <li className='comment' key={comment._id}>
            </li>)}
        </ul>
    </div>)*/
    return(<div><p>.</p></div>)
}