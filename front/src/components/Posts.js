import '../styles/Posts.css'
import like from '../assets/Icons/like.png'
import dislike from '../assets/Icons/dislike.png'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetPosts} from '../services/posts.service'
import {AddComment} from '../services/comments.service'
import {Comments} from './Comments'

export const Posts = () => {
    const [isLoading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);

      useEffect(() => {
        GetPosts()
        .then(data => setPosts(data))
        .catch((err) => console.log(err)) 
      }, [])

    if (isLoading) {
        return <h1>LOADING...</h1>
    }
    return (
        <div className="posts">
            <div className='posts-padding'>
                <div className='posts-content'>
                <ul>
                {posts.map((post) =>
                    <li className='post' key={post.userId}>
                        <div className='post-content'>
                            <div>
                                <p>{post.userId}</p>
                            </div>
                            <div>
                                <p>{post.content}</p>
                            </div>
                        </div>
                        <div className='post-reviews'>
                            <div className='post-reviews-row'>
                                <div className='likes-dislikes'>
                                    <div className='post-like'>
                                        <a href='#'><img className='like-icon' src={like} width="20" height="20"></img></a> <p>{post.likes}</p>
                                    </div>
                                    <div className='post-dislike'>
                                        <a href='#'><img className='dislike-icon' src={dislike} width="20" height="20"></img></a> <p>{post.dislikes}</p>
                                    </div>
                                </div>
                                <div className='comments'>
                                    <a href='#' className='show-comment'><p onClick={handleClick}>comments</p></a>
                                </div>
                            </div>
                            <Comments id={post._id}/>
                        </div>
                        <div className='add-comment'>
                            <form onSubmit={(e) => handleSubmit(post._id,e)}>
                                <input name='input' className='add-comment-input'></input>
                                <button className='add-comment-button'>post</button>
                            </form>
                        </div>
                    </li>
                )}
                </ul>
                </div>
            </div>
        </div>
    )
}

function handleClick() {
    let x = document.getElementsByClassName("comments-frame-content");
    for(let i = 0; i < x.length;i++){
        if (x.item(i).style.display === "none") {
            x.item(i).style.display = "block";
        } else {
            x.item(i).style.display = "none";
        }
    }
}

function handleSubmit(postId,e) {
    e.preventDefault()
    let text = e.target['input'].value;
    console.log(postId);
    AddComment(postId,text);
}