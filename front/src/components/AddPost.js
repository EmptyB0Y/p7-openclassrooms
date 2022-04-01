import '../styles/AddPost.css'
import {PostPost} from '../services/posts.service'
import { useState } from 'react'

export const AddPost = () => {

    const [margin,setMargin] = useState(80);
    const [publish,setPublish] = useState(false);


    function handleInput(){
        let element = document.getElementById("addpost-frame");
        let input = document.getElementById("addpost-input");
        let j = 80;
        for(let i = 0; i < input.innerText.length; i++){
            console.log(input.innerText.charAt(i));
            if(input.innerText.charAt(i) === '\n'){
                j += 10;
            }
        }
        setMargin(j);
        console.log(margin);
        element.style.height = margin+"px";
    }
    
    function handleClick(e){
        if(e.target.innerText === "What's on your mind ?"){
            e.target.innerText = "";
            setPublish(true);
        }
    }
    
    function handleSubmit(){
        if(document.getElementById("addpost-input").innerText !== '' && publish){
            let text = document.getElementById("addpost-input").innerText;
            PostPost(text);
            window.location.reload();
        }
    }
    
    return <div id="addpost-frame">
        <form id='addpost-form' onSubmit={() => handleSubmit()} onClick={(e) => handleClick(e)} onInput={()=>handleInput()}>
            <span contentEditable={true} role='textbox' id='addpost-input' name='addpost-input'>What's on your mind ?</span>
            <button id='addpost-submit' name='addpost-submit'>POST</button>
        </form>
        </div>
}