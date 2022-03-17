import '../styles/Posts.css'
import like from '../assets/Icons/like.png'
import dislike from '../assets/Icons/dislike.png'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetPosts} from '../services/posts.service'
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
                            <p>{post.content}</p>
                        </div>
                        <div className='post-reviews'>
                            <br></br>
                            <div className='likes-dislikes'>
                                <div className='post-like'>
                                    <a href='#'><img className='like-icon' src={like} width="20" height="20"></img></a> <p>{post.likes}</p>
                                </div>
                                <div className='post-dislike'>
                                    <a href='#'><img className='dislike-icon' src={dislike} width="20" height="20"></img></a> <p>{post.dislikes}</p>
                                </div>
                            </div>
                            <div className='comments'>
                                <a href='#'><p>comments</p></a>
                                <Comments id={post._id} token={sessionStorage.key("token")}/>
                            </div>
                        </div>
                    </li>
                )}
                </ul>
                </div>
            </div>
        </div>
    )
}