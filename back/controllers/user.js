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
        const authip = getAuthorizedAdminIps();
        let ok = false;
        for(let i = 0; i < authip.length; i++){
          if(authip[i] === req.ip){
            ok = true;
          }
        }

        if (process.env.SUPER_PASS === req.body.superPassword && ok) {
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
        profile.access = user.access;
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

exports.getOneProfile = (req, res) =>{

  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
      Profile.findOne({userId : req.params.id})
      .then((ProfileFound) => {
        console.log(req.params.id);
        console.log("Profile found : " + ProfileFound);
        res.status(200).json(ProfileFound)
      })
      .catch(() => res.status(404).json({message: 'Not found !'}));
  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
}

exports.getAllProfiles = (req,res) =>{
  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
        Profile.find()
        .then(Profiles => res.status(200).json(Profiles))
        .catch(error => res.status(400).json({ error }));
    })
      .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
}

exports.searchProfiles = (req, res) =>{

  if(!req.body.profiles){
    return res.status(400).send(new Error('Bad request!'));
  }

  const profilesSearch = req.body.profiles;
  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
      Profile.find()
      .then((profiles) => {
        let profilesFound = {};
          for(let j = 0; j < profilesSearch.length; j++){
            for(let i = 0; i < profiles.length; i++){

            if(String(profilesSearch[j]) === String(profiles[i].userId)){
              profilesFound[profiles[i].userId] = profiles[i];
            }
          }
        }
        res.status(200).json(profilesFound);

      })
      .catch((e) => res.status(404).json({message: 'Not found !', error: e}));
  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
}

exports.textSearchProfile = (req, res) =>{

  if(!req.body.query){
    return res.status(400).send(new Error('Bad request!'));
  }

  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
    let q = req.body.query;
    let query = {
      "$or": [{firstname: {"$regex": q, "$options": "i"}}, {lastname: {"$regex": q, "$options": "i"}}]
    };
      Profile.find(query)
      .then((profiles) => {

        res.status(200).json(profiles);

      })
      .catch((e) => res.status(404).json({message: 'Not found !', error: e}));
  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
}
exports.editProfile = (req, res) =>{

  if((!req.body.firstname &&
    !req.body.lastname &&
    !req.body.description &&
    !req.file) && !req.body.profile){
    return res.status(400).send(new Error('Bad request!'));
  }
  let ProfileModified;

  mongoose.connect(getAuth(),
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() =>{
      Profile.findOne({userId : req.params.id})
      .then((ProfileFound) => {
        User.findOne({userId : res.locals.userId})
        .then((UserFound) => {
          if(ProfileFound.userId !== String(UserFound._id) && UserFound.access !== "admin"){
            return res.status(403).json({message: 'Forbidden !'})
          }

          if(req.body.profile){
            ProfileModified = req.body.profile;
          }
          else{
            ProfileModified = {
              "firstname" : ProfileFound.firstname,
              "lastname" : ProfileFound.lastname,
              "description" : ProfileFound.description,
              "pictureUrl" : ProfileFound.pictureUrl,
              "userId" : ProfileFound.userId,
              "access" : ProfileFound.access,
            };

            if(req.body.firstname){
              ProfileModified.firstname = req.body.firstname;
            }
            if(req.body.lastname){
              ProfileModified.lastname = req.body.lastname;
            }
            if(req.body.description){
              ProfileModified.description = req.body.description;
            }
          }
          if(req.file){
            if(ProfileModified.pictureUrl !== 'http://127.0.0.1:3000/images/default/nopic.webp'){
              fs.unlink('../back/images/' + ProfileModified.pictureUrl.split('/images/')[1], (err) => {
                if (err) {
                  console.error(err)
                }
              })
            }
            ProfileModified.pictureUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          }
          Profile.updateOne({ _id: ProfileFound._id}, { ...ProfileModified, _id: ProfileFound._id })
          .then(() => {
            res.status(200).json({message: 'Objet modifié !'})
          })
          .catch(() => res.status(500).json({message: 'Erreur lors de l\'édition de l\'objet !'}));
        })
        .catch(() => res.status(404).json({message: 'Not found !'}));
      })
      .catch(() => res.status(404).json({message: 'Not found !'}));
  })
  .catch(() => res.status(500).json({message: 'Connexion à MongoDB échouée !'}));
}
exports.getUserSchema = () =>{
  return User;
}