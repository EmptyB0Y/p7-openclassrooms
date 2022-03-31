import '../styles/Posts.css'
import like from '../assets/Icons/like.png'
import dislike from '../assets/Icons/dislike.png'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetPosts} from '../services/posts.service'
import {SearchProfiles} from '../services/profiles.service'
import {Comments} from './Comments'

export const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [load,setLoad] = useState(false);
    const [profiles, setProfiles] = useState({});
    const [iterations, setIterations] = useState(10);
    
    const handleClickLoadMore = () => {
        setIterations((iterations+5));
    }

      useEffect(() => {
        GetPosts()
        .then(data => setPosts(data))
        .catch((err) => console.log(err)) 
      }, [])

      useEffect(() => {
        let authorUserIds = []
        for(let i = 0; i < posts.length; i++){
            if(!(authorUserIds.includes(posts[i].userId))){
                authorUserIds.push(posts[i].userId);
            }
        }

        SearchProfiles(authorUserIds)
        .then(data => {
            setProfiles(data);
            if(posts.length > 0){
                setLoad(true);
            }       
         })
        .catch((err) => console.log(err));
    }, [posts])

    let postsElement = (<div>"Loading..."</div>)

    if(load){
        postsElement = (
            <ul>
              {posts.slice(0,iterations).reverse().map((post) =>
                <li className='post' key={post._id}>
                    <div className='post-content'>
                      <div>
                          <p>{profiles[post.userId].firstname} {profiles[post.userId].lastname}</p>
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
    }

    if(posts.length == 0){
        postsElement = <h1>No posts yet</h1>
    }

    let loadElement = (<div></div>);
    if(iterations < posts.length){
        loadElement = (<div id="load-more" onClick={handleClickLoadMore}>LOAD MORE POSTS</div>);
    }

    return (
        <div className="posts">
            <div className='posts-padding'>
                <div className='posts-content'>
                    {postsElement}
                </div>
            </div>
            {loadElement}
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
