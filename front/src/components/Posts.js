import '../styles/Posts.css'
import like from '../assets/Icons/like.png'
import dislike from '../assets/Icons/dislike.png'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetPosts} from '../services/posts.service'
import {PostComment} from '../services/comments.service'
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

    let postsElement = (        
        <ul>
          {posts.map((post) =>
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
                    <Comments postId={post._id}/>
                  </div>
              </div>
              <div className='add-comment'>
                  <form onSubmit={(e) => handleSubmit(post._id)}>
                      <input name='input' className='add-comment-input'></input>
                      <button className='add-comment-button'>post</button>
                  </form>
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

function handleClick(id,e) {
    e.preventDefault();
    let x = document.getElementById("comments-"+id);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function handleSubmit(postId,e) {
    let text = e.target['input'].value;
    PostComment(postId,text);
}