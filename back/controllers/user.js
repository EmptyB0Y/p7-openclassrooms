const User = require('../models/user');
const Profile = require('../models/profile');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

getAuth = () =>{
  return "mongodb+srv://"+String(process.env.DB_USERNAME)+":"+String(process.env.DB_USERPASS)+"@"+String(process.env.DB_CLUSTERNAME)+".ukoxa.mongodb.net/"+String(process.env.DB_NAME)+"?retryWrites=true&w=majority";
}

getAuthorizedAdminIps = () =>{
  let str = ""+String(process.env.AUTHORIZED_ADMIN_IPS)+"";
  let tab = [];
  let s = "";
  let j = 0;
  for(let i = 0; i < str.length; i++){
    if(str.charAt(i) === ';'){
      tab[j] = s;
      s = "";
      j++;
    }else{
    s += str.charAt(i); 
    }
  }
  return tab;
}

exports.login = (req,res) =>{
  if (!req.body.email || !req.body.password) {
    return res.status(400).send(new Error('Bad request!'));
  }

    mongoose.connect(getAuth(),
    { useNewUrlParser: true,
    useUnifiedTopology: true }).then(() =>{
      User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' })
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.JSON_TOKEN,
                { expiresIn: '24h' }
              )    
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
  })  
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
};

  exports.register = (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.firstname) {
        return res.status(400).send(new Error('Bad request!'));
      }

    mongoose.connect(getAuth(),
    { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() =>{
      //Utilisation de Bcrypt pour hasher le mot de passe
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
        let access = "user";

      if(req.body.superPassword){
        console.log("Admin creation request from "+req.ip);
        authip = getAuthorizedAdminIps();
        if (process.env.SUPER_PASS === req.body.superPassword && authip.include(req.ip)) {
          console.log(data.toString());
          access = "admin";
        }
        else {
          return res.status(401).json({message: "Unauthorized !"});
        }
      }
      const user = new User({
        email: req.body.email,
        password: hash,
        access: access
      });

      user.save()
      .then(() => {
        const profile = new Profile({...req.body});
        profile.userId = user._id;
        console.log(profile);
        profile.save()
        .then(() => res.status(201).json({ message: 'Profil créé !' }))
        .catch((e)=> res.status(500).json({ message: 'Erreur lors de la création du profil !', error: e }));
      })
      .catch(()=> res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur !' }));
    })
    .catch(() => res.status(500).json({ message: 'Erreur lors du hashage du mot de passe !' }));
    })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));

  };

exports.delete = (req, res) =>{
 
  mongoose.connect(getAuth(),
  { useNewUrlParser: true, 
  useUnifiedTopology: true })
  .then(() =>{
      User.deleteOne({_id : req.body.userId})
      .then(() => {
        Profile.find((profiles) => {
          for(let i = 0; i < profiles.length; i++){
            if(profiles[i].userId === res.locals.userId){
              Profile.deleteOne({_id: profiles[i]._id})
              .then(() => {
                  res.status(200).json({ message: 'Profil supprimé !'});
              })
              .catch(() => res.status(400).json({ message: 'Erreur lors de la deletion du profil !' }));
            }
          }
        })
        .catch(() => res.status(404).json({message: 'Not found !'}));
      })
      .catch(() => res.status(400).json({ message: 'Erreur lors de la deletion de l\'utilisateur !' }));
  })
  .catch(() => {
    return res.status(404).json({ message: "Connexion à MongoDB échouée !" });
  });
};

//ADMIN
exports.getAllUsers = (req,res) =>{
  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
    User.findOne({ _id: res.locals.userId })
    .then(user => {
      if(user.access === "admin"){
        User.find()
        .then(Users => res.status(200).json(Users))
        .catch(error => res.status(400).json({ error }));
      }
      else{
        return res.status(403).json({message: "Forbidden !"});
      }
    });
  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
};

exports.getOneUser = (req, res) => {
  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
    User.findOne({ _id: res.locals.userId })
    .then(user => {
      if(user.access === "admin"){
        User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
      }
      else{
        return res.status(403).json({message: "Forbidden !"});
      }
    });
  })  
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
};
//ADMIN

exports.getProfile = (req, res) =>{
  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
    Profile.findOne({userId : res.locals.userId})
    .then((ProfileFound) => {
      console.log(ProfileFound);
      res.status(200).json(ProfileFound)
    })
    .catch(() => res.status(404).json({message: 'Not found !'}));

  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
}

exports.getUserProfile = (req, res) =>{

  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
      Profile.findOne({userId : req.params.id})
      .then((ProfileFound) => {
        console.log(ProfileFound);
        res.status(200).json(ProfileFound)
      })
      .catch(() => res.status(404).json({message: 'Not found !'}));
  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
}

exports.getUserSchema = () =>{
  return User;
}