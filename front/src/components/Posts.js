import '../styles/Posts.css'
import like from '../assets/Icons/like.png'
import dislike from '../assets/Icons/dislike.png'
import Trash from '../assets/Icons/Trash.webp'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetPosts,DelPost} from '../services/posts.service'
import {SearchProfiles} from '../services/profiles.service'
import {Comments} from './Comments'
import ReactDOM from 'react-dom'

export const Posts = () => {

    const [posts, setPosts] = useState([]);
    const [load,setLoad] = useState(false);
    const [profiles, setProfiles] = useState({});
    const [iterations, setIterations] = useState(10);
    const [change,setChange] = useState(false);
    
    const handleClickLoadMore = () => {
        setIterations((iterations+5));
    }

    const handleClickDelete = (e) => {
        let postId = ReactDOM.findDOMNode(e.target).parentNode.id;
        if(postId === ''){
            postId = ReactDOM.findDOMNode(e.target).parentNode.parentNode.id
        }

        DelPost(postId)
        .then(()=>{ refresh() });
    }
    const refresh = () => {
        setChange(!change);
    }

    const getAccess = (userId) =>{
        if(profiles[userId] !== undefined){
            return profiles[userId].access;
        }
        return("none");
    }

      useEffect(() => {
        GetPosts()
        .then(data => setPosts(data))
        .catch((err) => console.log(err)) 
      }, [change])

      useEffect(() => {
        let authorUserIds = []
        for(let i = 0; i < posts.length; i++){
            if(!(authorUserIds.includes(posts[i].userId))){
                authorUserIds.push(posts[i].userId);
            }
        }
        authorUserIds.push(sessionStorage.getItem("userId"));

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
        let deletePostElement = {};
        deletePostElement[sessionStorage.getItem("userId")] = (<button className='delete-post' onClick={(e) => handleClickDelete(e)}><img className='delete-post-icon' src={Trash} width='10' height='10'></img></button>);
        if(getAccess(sessionStorage.getItem("userId")) === "admin"){
            for(let i = 0;i < posts.length; i++){
                deletePostElement[posts[i].userId] = deletePostElement[sessionStorage.getItem("userId")];
            }
        }
        postsElement = (
            <ul>
              {posts.slice(0,iterations).reverse().map((post) =>
                <li className='post' key={post._id}>
                    <div className='post-title'>
                        <div>
                          <p>{profiles[post.userId].firstname} {profiles[post.userId].lastname}</p>
                        </div>
                        <div id={post._id}>
                          {deletePostElement[post.userId]}
                        </div>
                      </div>
                    <div className='post-content'>
                        <p>{post.content}</p>
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
