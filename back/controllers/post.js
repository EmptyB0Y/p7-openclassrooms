const Post = require('../models/post');
const mongoose = require('mongoose');
const fs = require('fs')
const userController = require('./user'); 
const User = userController.getUserSchema();

getAuth = () =>{
  return "mongodb+srv://"+String(process.env.DB_USERNAME)+":"+String(process.env.DB_USERPASS)+"@"+String(process.env.DB_CLUSTERNAME)+".ukoxa.mongodb.net/"+String(process.env.DB_NAME)+"?retryWrites=true&w=majority";
}

exports.getAllPosts = (req,res) =>{
  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true }).then(() =>{
  Post.find()
    .then(Posts => res.status(200).json(Posts))
    .catch(error => res.status(400).json({ error }));
  });
  };

  exports.getAllPostsFromUser = (req,res) =>{
    mongoose.connect(getAuth(),
    { useNewUrlParser: true,
    useUnifiedTopology: true }).then(() =>{
        Post.find()
        .then(posts => {
          let postsFromUser = []
          for(let i = 0; i < posts.length; i++){
            if(posts[i].userId === req.params.id){
              postsFromUser.push(posts[i]);
            }
          }
          res.status(200).json(postsFromUser)
        })
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
  };
  
  exports.getOnePost = (req, res) => {
    mongoose.connect(getAuth(),
    { useNewUrlParser: true,
    useUnifiedTopology: true }).then(() =>{
    Post.findOne({ _id: req.params.id })
    .then(Post => res.status(200).json(Post))
    .catch(error => res.status(404).json({ error }));
    });
  };

  exports.postPost = (req, res) => {

      /*Post format : 
      {"content":String}*/

      if (!req.body.post) {
      return res.status(400).send(
        `post : {"content":String}`
        );
    }

    let PostCreated = {...req.body.post};
    console.log("Post created : ");
    console.log(PostCreated);
    PostCreated.userId = res.locals.userId;
    if(PostCreated.likes || 
      PostCreated.dislikes || 
      PostCreated.usersDisliked || 
      PostCreated.usersLiked || 
      PostCreated.comments){
      return res.status(401).send(new Error('Unauthorized !'));
    }

    if(req.file){
      PostCreated.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    mongoose.connect(getAuth(),
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => {
          const post = new Post({ ...PostCreated });
          post.save().then(() => {
            res.status(201).json({message: "Objet créé !"});
          })
          .catch(() => {

            if(req.file){
              if(PostCreated.imageUrl !== "noimage"){
                fs.unlink('../back/images/' + PostCreated.imageUrl.split('/images/')[1], (err) => {
                  if (err) {
                    console.error(err)
                  }
                })
              }
            }
            res.status(500).json({message: "Erreur lors de la création de l'objet !"})
        });
        })
        .catch(() => {

          if(req.file){
            if(PostCreated.imageUrl){
              fs.unlink('../back/images/' + PostCreated.imageUrl.split('/images/')[1], (err) => {
                if (err) {
                  console.error(err)
                }
              })
            }
          }
          res.status(500).json({message: "Connexion à MongoDB échouée !"})
      });
  };

  exports.editPost = (req,res) => {

    if (!(req.body.content &&  
      !req.body.likes &&
      !req.body.dislikes &&
      !req.body.usersLiked &&
      !req.body.usersDisliked &&
      !req.body.comments) && !req.body.post) {
        return res.status(400).send(new Error('Bad request!')
          );
    }
    
    let PostModified;
    if(req.body.post){
      /*Post format : 
      {"content":"..."}*/
      
      PostModified = JSON.parse(req.body.post);
    }
    else{
      PostModified = { ...req.body};
      if(PostModified.likes || 
        PostModified.dislikes || 
        PostModified.usersDisliked || 
        PostModified.usersLiked || 
        PostModified.comments){
          return res.status(401).send(new Error('Unauthorized!'));
        }
    }
    if(req.file){
      PostModified.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    mongoose.connect(getAuth(),
    { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() =>{
        Post.findOne({_id : req.params.id})
        .then(post => {
          User.findOne({ _id: res.locals.userId })
          .then(userFound => {
            if (res.locals.userId !== post.userId && userFound.access !== "admin"){
              return res.status(401).json({message: "Unauthorized !"});
            }
          if(req.file){

            if(post.imageUrl !== "noimage"){
              fs.unlink('../back/images/' + post.imageUrl.split('/images/')[1], (err) => {
                if (err) {
                  console.error(err)
                }
              })
            }
          }
      
          PostModified.userId = post.userId;
          Post.updateOne({ _id: req.params.id }, { ...PostModified, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => {
            if(req.file){
              if(PostModified.imageUrl !== "noimage"){
                fs.unlink('../back/images/' + PostModified.imageUrl.split('/images/')[1], (err) => {
                  if (err) {
                    console.error(err)
                  }
                })
              }
            }
            res.status(400).json({ error })
          });
      });
    })
  .catch(error => res.status(404).json({ error }));
  })
    .catch(() => {
      if(req.file){
        if(PostModified.imageUrl !== "noimage"){
          fs.unlink('../back/images/' + PostModified.imageUrl.split('/images/')[1], (err) => {
            if (err) {
              console.error(err)
            }
          })
        }
      }
      res.status(404).json({message: 'Connexion à MongoDB échouée !'})
    });
  };

  exports.deletePost = (req,res) => {

    mongoose.connect(getAuth(),
    { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() =>{
      Post.findOne({ _id: req.params.id })
        .then(post => {
          User.findOne({ _id: res.locals.userId })
          .then(userFound => {
            if (res.locals.userId !== post.userId && userFound.access !== "admin"){
              return res.status(401).json({message: "Unauthorized !"});
            }

            if(post.imageUrl !== "noimage"){
              fs.unlink('../back/images/' + post.imageUrl.split('/images/')[1], (err) => {
                if (err) {
                  console.error(err)
                }
              })
            }
            Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
          });
        })
        .catch(error => {
          console.log(error);
          return res.status(404).json({ message: "Objet non trouvé  !" });
        });
    })
    .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
  };

  exports.postLike = (req,res) => {
    mongoose.connect(getAuth(),
    { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() =>{
      if(req.body.like && req.body.like <= 1 || req.body.like >= -1){
        Post.findOne({ _id: req.params.id })
        .then(post => {

          if(post.userId === res.locals.userId){
            return res.status(401).json({message: "Unauthorized !"});
          }
          //Like
          if(req.body.like == 1){

            if(!post.usersLiked.includes(res.locals.userId)){
              post.likes += 1;
              post.usersLiked.push(res.locals.userId);

              if(post.usersDisliked.includes(res.locals.userId)){
                post.dislikes -= 1;
                post.usersDisliked.splice(post.usersDisliked.indexOf(res.locals.userId));
              }
            }
            else{
              return res.status(401).json({message: "Unauthorized !"});
            }
            /*else{
              Post.likes -= 1;
              Post.usersLiked.splice(Post.usersLiked.indexOf(res.locals.userId));
            }*/
          }
          //Dislike
          else if(req.body.like == -1){
            if(!post.usersDisliked.includes(res.locals.userId)){
              post.dislikes += 1;
              post.usersDisliked.push(res.locals.userId);

              if(post.usersLiked.includes(res.locals.userId)){
                Post.likes -= 1;
                Post.usersLiked.splice(post.usersLiked.indexOf(res.locals.userId));
              }
            }
            else{
              return res.status(401).json({message: "Unauthorized !"});
            }
            /*else{
              Post.dislikes -= 1;
              Post.usersDisliked.splice(Post.usersDisliked.indexOf(res.locals.userId));  
            }*/
          }
          //Remove like or dislike
          else if(req.body.like == 0){

            if(post.usersDisliked.includes(res.locals.userId)){
              post.dislikes -= 1;
              post.usersDisliked.splice(post.usersDisliked.indexOf(res.locals.userId)); 
            }
            else if(post.usersLiked.includes(res.locals.userId)){
              post.likes -= 1;
              post.usersLiked.splice(post.usersLiked.indexOf(res.locals.userId));
            }
            else{
              return res.status(401).json({message: "Unauthorized !"});
            }
          }
          let PostLiked = {
              "userId" : post.userId,
              "content" : post.content,
              "likes" : post.likes,
              "dislikes" : post.dislikes,
              "usersLiked" : post.usersLiked,
              "usersDisliked" : post.usersDisliked
        };

        Post.updateOne({ _id: req.params.id }, { ...PostLiked, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Like ajouté !'}))
          .catch(() => res.status(400).json({ message: 'Erreur lors de l\'ajout du like !'}));
        })
        .catch(() => res.status(404).json({ message: "Objet non trouvé  !" }));
      }
      else{
        return res.status(400).send(new Error('Bad request!'));
      }
    })
    .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
  };
  
  exports.getPostSchema = () =>{
    return Post;
  }