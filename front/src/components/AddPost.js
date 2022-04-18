import '../styles/AddPost.css'
import {PostPost} from '../services/posts.service'
import {GifSearch} from './GifSearch'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

export const AddPost = (topic) => {

    const [height,setHeight] = useState(90);
    const [publish,setPublish] = useState(false);
    const [topicSegment,setTopic] = useState(<input id='set-topic-input' name='set-topic-input'></input>);
    const [image,setImage] = useState(null);

    useEffect(()=>{
        document.getElementById("addpost-frame").style.height = height+"px";
        console.log(topic.topic);
        if(topic.topic !== 'notopic'){
            setTopic(<input id='set-topic-input' value={topic.topic}></input>);
        }
    },[]);

    function handleInput(){
        let element = document.getElementById("addpost-frame");
        let input = document.getElementById("addpost-input");
        let j = 90;
        for(let i = 0; i < input.innerText.length; i++){
            if(input.innerText.charAt(i) === '\n'){
                j += 10;
            }
        }
        setHeight(j);
        console.log(height);
        element.style.height = height+"px";
    }
    
    function handleClick(e){
        if(e.target.innerText === "What's on your mind ?"){
            e.target.innerText = "";
            setPublish(true);
        }
    }
    
    function handleSubmit(e){
        e.preventDefault();
        if(document.getElementById("addpost-input").innerText !== '' && publish){
            let text = document.getElementById("addpost-input").innerText;
            let topic = e.target['set-topic-input'].value;
            if(topic === ''){
                topic = 'notopic';
            }
            PostPost(text,topic,image);
            window.location.reload();
        }
    }
    
    function handleInputImage(e){
        const file = Array.from(e.target.files);
        console.log("file: "+file[0].name);
        if(file[0].name.endsWith(".jpg") || file[0].name.endsWith(".jpeg") || file[0].name.endsWith(".png")){
          console.log("ok");
          setImage(file[0]);
        }
        else{
        }
      }

    function handleClickGifs(){
        ReactDOM.render(<GifSearch place='addpost'/>, document.getElementById('gif-anchor-addpost'));
    }

    return <div id="addpost-frame">
        <form id='addpost-form' onSubmit={(e) => handleSubmit(e)} onClick={(e) => handleClick(e)} onInput={()=>handleInput()}>
            <div id='set-topic'><p>Topic #</p>{topicSegment}</div>
            <span contentEditable={true} role='textbox' id='addpost-input' name='addpost-input'>What's on your mind ?</span>
            <button id='addpost-submit' name='addpost-submit'>POST</button>
            <div id='media'>
                <input type='file' id='upload' onInput={(e) => handleInputImage(e)} width='20' height='20' multiple/>
                <a className='gifs' onClick={handleClickGifs}>GIFS</a>
                <div id='gif-anchor-addpost'></div>
            </div>
        </form>
        </div>
}