import '../styles/Posts.css'
import like from '../assets/Icons/like.png'
import dislike from '../assets/Icons/dislike.png'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetPosts} from '../services/posts.service'
import {Comments} from './Comments'

export const Posts = () => {

    const [posts, setPosts] = useState([]);

      useEffect(() => {
        GetPosts()
        .then(data => setPosts(data))
        .catch((err) => console.log(err)) 
      }, [])


    let postsElement = (
        <ul>
          {posts.slice(0).reverse().map((post) =>
            <li className='post' key={post._id}>
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
                          <a href='#' className='show-comment'><p onClick={(e) => handleClick(post._id,e)}>comments</p></a>
                      </div>
                  </div>
                  <div className='comments-section' id={'comments-'+post._id}>
                    <Comments id={post._id}/>
                  </div>
              </div>
            </li>)}
        </ul>
        );

    if(posts.length == 0){
        postsElement = <h1>No posts yet</h1>
    }

    return (
        <div className="posts">
            <div className='posts-padding'>
                <div className='posts-content'>
                    {postsElement}
                </div>
            </div>
        </div>
    )
}

const handleClick = (postId,e) => {
    e.preventDefault();
    let x = document.getElementById("comments-"+postId);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}