import '../styles/AddPost.css'
import {PostPost} from '../services/posts.service'
import { useState } from 'react'

export const AddPost = () => {

    const [margin,setMargin] = useState(60);

    function handleInput(e){
        let element = document.getElementById("addpost-frame");
        if(e.nativeEvent.inputType === "insertParagraph"){
            setMargin(margin+5);
        }
        else if(e.nativeEvent.inputType === "deleteContentBackward" && margin > 80){
            setMargin(margin-5);
        }
        element.style.height = margin+"px";
    }
    
    function handleClick(e){
        if(e.target.innerText === "What's on your mind ?"){
            e.target.innerText = "";        
        }
    }
    
    function handleSubmit(e){
        if(document.getElementById("addpost-input").innerText !== ''){
            let text = e.target["addpost-input"].innerText;
            PostPost(text);
        }
    }
    
    return <div id="addpost-frame">
        <form id='addpost-form' onSubmit={(e) => handleSubmit(e)} onClick={(e) => handleClick(e)} onInput={(e)=>handleInput(e)}>
            <span contentEditable={true} role='textbox' id='addpost-input' name='addpost-input'>What's on your mind ?</span>
            <button id='addpost-submit' name='addpost-submit'>POST</button>
        </form>
        </div>
}