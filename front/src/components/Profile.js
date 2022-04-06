import '../styles/Profile.css'
import '../styles/Posts.css'
import like from '../assets/Icons/like.png'
import dislike from '../assets/Icons/dislike.png'
import pen from '../assets/Icons/pen.webp'
import { useState, useEffect, useRef, useCallback } from 'react'
import {GetProfile,GetProfilePosts} from '../services/profiles.service'
import {Comments} from './Comments'
import {EditMainInfos} from './EditMainInfos'
import {EditSecondaryInfos} from './EditSecondaryInfos'

export const Profile = (userId) =>{
    const [profile, setProfileInfos] = useState({});
    const [viewingProfile, setViewingProfile] = useState({});
    const [posts, setProfilePosts] = useState([]);
    const [iterations, setIterations] = useState(10);
    const [load, setLoad] = useState(false);


    const handleClickLoadMore = () => {
      if((iterations+5 > posts.length)){
        setIterations(posts.length);
      }
      else{
        setIterations((iterations+5));
      }
    }

      useEffect(() => {
        GetProfile(userId)
        .then(data => setProfileInfos(data))
        .catch((err) => console.log(err))
      }, [])

      useEffect(() => {
        GetProfile({id : sessionStorage.getItem("userId")})
          .then(data => setViewingProfile(data))
          .catch((err) => console.log(err))  
      }, [])

      useEffect(() => {
        if(viewingProfile !== undefined && profile !== undefined){
          setLoad(true);
        }
      }, [viewingProfile,profile])

      useEffect(() => {
        GetProfilePosts(userId)
        .then(data => setProfilePosts(data))
        .catch((err) => console.log(err)) 
      }, [])

      let editMainInfosElement = <></>;
      let editSecondaryInfosElement = <></>;
           
      if(load && profile.firstname !== undefined){
        let p = {...profile,canEdit : false};
        editMainInfosElement = <EditMainInfos profile={p}/>;
        editSecondaryInfosElement = <EditSecondaryInfos profile={p}/>;
        if(profile.userId === sessionStorage.getItem("userId") || viewingProfile.access === "admin"){
          p.canEdit = true
          console.log(profile.userId);
          console.log(sessionStorage.getItem("userId"));
          editMainInfosElement = <EditMainInfos profile={p}/>;
          editSecondaryInfosElement = <EditSecondaryInfos profile={p}/>;
      }
    }
    let postsElement = (        
    <ul>
      {posts.slice(0,iterations).reverse().map((post) =>
        <li className='post' key={post._id}>
            <div className='post-content'>
              <div>
                  <p>{profile.firstname} {profile.lastname}</p>
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

    let loadElement = (<div></div>);
    if(iterations < posts.length){
        loadElement = (<div id="load-more" onClick={handleClickLoadMore}>LOAD MORE POSTS</div>);
    }

    return (
    <div>
      <div className='profile-frame'>
        <div id='main-infos'>
            {editMainInfosElement}        
        </div>
        <div id='secondary-infos'>
          <div id='picture-frame'>
            <img id="profile-picture" src={profile.pictureUrl}></img>
          </div>
            {editSecondaryInfosElement}        
        </div>
      </div>
      <div id='posts-frame'>
            <div className='posts-padding'>
                <div className='posts-content'>
                    {postsElement}
                </div>
            </div>
            {loadElement}
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