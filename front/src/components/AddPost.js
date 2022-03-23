import '../styles/AddPost.css'
import arrow from '../assets/Icons/arrow-right.webp'
import {PostPost} from '../services/posts.service'

export const AddPost = () => {
    return <div id="addpost-frame">
        <form id='addpost-form' onSubmit={(e) => handleSubmit(e)}>
            <input id='addpost-input' name='addpost-input'></input>
            <button id='addpost-submit' name='addpost-submit'><img id='addpost-arrow-submit' src={arrow}></img></button>
        </form>
        </div>
}

function handleSubmit(e){
    let text = e.target["addpost-input"].value;
    PostPost(text);
}