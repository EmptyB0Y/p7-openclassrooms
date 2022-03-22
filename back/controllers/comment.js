const Comment = require('../models/comment');
const mongoose = require('mongoose');
const postController = require('./post'); 
const Post = postController.getPostSchema();
const userController = require('./user'); 
const User = userController.getUserSchema();
const uuid = require('uuid');

getAuth = () =>{
  return "mongodb+srv://"+String(process.env.DB_USERNAME)+":"+String(process.env.DB_USERPASS)+"@"+String(process.env.DB_CLUSTERNAME)+".ukoxa.mongodb.net/"+String(process.env.DB_NAME)+"?retryWrites=true&w=majority";
}

exports.getAllCommentsFromPost = (req,res) =>{
  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true }).then(() =>{
  Comment.find()
    .then(Comments => {
      postComments = [];
      for(let i = 0; i < Comments.length; i++){
        if(Comments[i].post === req.params.id){
          postComments.push(Comments[i]);
        }
      }
      res.status(200).json(postComments)
    })
    .catch(error => res.status(400).json({ error }));
  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
};

exports.getOneComment = (req,res) =>{
    mongoose.connect(getAuth(),
    { useNewUrlParser: true,
    useUnifiedTopology: true }).then(() =>{
    Comment.findOne({_id : req.params.id})
    .then((commentFound) =>{
      res.status(200).json(commentFound);
    })
    .catch(error => res.status(400).json({ error }));
  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
};

exports.postComment = (req,res) => {
    if(!req.body.comment){
      return res.status(400).send(new Error('Bad request!'));
    }
    else if(req.body.comment.length > 255){
      return res.status(400).send(new Error('Bad request!'));
    }

    mongoose.connect(getAuth(),
    { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() =>{
        Post.findOne({ _id: req.params.id })
        .then(post => {
          //Add comment
          const comment = new Comment({
              author : res.locals.userId,
              text : req.body.comment,
              post : post._id,
          });
          console.log(comment);
          comment.save()
          .then(() => {
            post.comments.push({commentId : String(comment._id)});
            let PostCommented = {
                "userId" : post.userId,
                "content" : post.content,
                "likes" : post.likes,
                "dislikes" : post.dislikes,
                "usersLiked" : post.usersLiked,
                "usersDisliked" : post.usersDisliked,
                "comments": post.comments
            };

          Post.updateOne({ _id: req.params.id }, { ...PostCommented, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Opération réussie !'}))
            .catch(() => res.status(400).json({ message: 'Erreur lors de l\'opération !'}));
          })
          .catch(() => res.status(500).json({ message : "Erreur lors de la création de l'objet !"}));
        })
        .catch(() => res.status(404).json({ message: "Objet non trouvé  !" }));
    })
    .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
  };

  exports.deleteComment = (req,res) => {
    let postId;
    mongoose.connect(getAuth(),
    { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() =>{
      Comment.findOne({ _id: req.params.id })
        .then(comment => {
          postId = comment.post;
          User.findOne({ _id: res.locals.userId })
          .then(userFound => {
            if (res.locals.userId !== comment.author && userFound.access !== "admin"){
              return res.status(401).json({message: "Unauthorized !"});
            }
            Comment.deleteOne({ _id: req.params.id })
            .then(() => {
              Post.findOne({_id : postId})
              .then(post => {

                let tab = [...post.comments];
                let tab2 = [];

                for(let i = 0; i < post.comments.length; i++){
                  if(String(tab[i].commentId) != String(req.params.id)){
                    tab2.push(tab[i]);
                  }
                }
                const PostModified = {
                  "userId" : post.userId,
                  "content" : post.content,
                  "likes" : post.likes,
                  "dislikes" : post.dislikes,
                  "usersLiked" : post.usersLiked,
                  "usersDisliked" : post.usersDisliked,
                  "comments" : tab2
                }
                console.log(PostModified);
                Post.updateOne({ _id: postId }, { ...PostModified, _id: postId })
                .then(() => res.status(200).json({ message: 'Opération réussie !'}))
                .catch(() => res.status(400).json({ message: 'Erreur lors de l\'opération !'}));              
              })
              .catch(error => res.status(400).json({ error }));
            })
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