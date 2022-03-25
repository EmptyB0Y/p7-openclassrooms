import '../styles/Profile.css'
import '../styles/Posts.css'
import like from '../assets/Icons/like.png'
import dislike from '../assets/Icons/dislike.png'
import pen from '../assets/Icons/pen.webp'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetProfile,GetProfilePosts} from '../services/profiles.service'
import {Comments} from './Comments'

export const Profile = (userId) =>{
    const [profile, setProfileInfos] = useState([]);
    const [posts, setProfilePosts] = useState([]);

      useEffect(() => {
        GetProfile(userId)
        .then(data => setProfileInfos(data))
        .catch((err) => console.log(err)) 
      }, [])

      useEffect(() => {
        GetProfilePosts(userId)
        .then(data => setProfilePosts(data))
        .catch((err) => console.log(err)) 
      }, [])

  let editMainInfosElement = (<button id='edit-main-infos-btn'><img id='edit-main-infos-img' src={pen} width='20' height='20'></img></button>);
  let editSecondaryInfosElement = (<button id='edit-secondary-infos-btn'><img id='edit-secondary-infos-img' src={pen} width='20' height='20'></img></button>);
  
  if(profile.userId !== sessionStorage.getItem("userId")){
    editMainInfosElement = (<></>);
    editSecondaryInfosElement = (<></>);
  }
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
    )
    if(posts.length == 0){
      postsElement = <h1>No posts yet</h1>
    }

    return (
    <div>
      <div className='profile-frame'>
        <div id='main-infos'>
          <div>
            <h2>{profile.firstname} {profile.lastname}</h2>
          </div>
            {editMainInfosElement}        
        </div>
        <div id='secondary-infos'>
          <div id='picture-frame'>
            <img id="profile-picture" src={profile.pictureUrl}></img>
          </div>
          <div id='description'>
            <h3>{profile.description}</h3>
          </div>
            {editSecondaryInfosElement}        
        </div>
      </div>
      <div id='posts-frame'>
        {postsElement}
      </div>
    </div>
        )
}

const handleClick = (id,e) => {
  e.preventDefault();
  let x = document.getElementById("comments-"+id);
  if (x.style.display === "none") {
      x.style.display = "block";
  } else {
      x.style.display = "none";
  }
}