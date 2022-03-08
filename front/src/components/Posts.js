
function GetPosts(){
    let url = "http://127.0.0.1:3000/api/posts/";
    fetch(url).then(blob => blob.json())
    .then(data => {
        Posts(data);
    })
    .catch((error) => {return error});
  }

function Posts(posts) {
    console.log(posts);
    return <div className="posts">
        <ul>
            {posts.map((post,index) => (
                <li key={`${post}-${index}`}>{ post }</li>
                ))}
        </ul>
        </div>
}

export default GetPosts