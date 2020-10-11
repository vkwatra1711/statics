const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Vansh:Naman1703@cluster0.zdswl.mongodb.net', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const app = express();
const port = 3000;
const base = `${__dirname}/public`;
const cookie = require('cookie-session');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

const User = mongoose.model('User', new mongoose.Schema({
    googleID: String,
    name: String,
    isAdmin: Boolean
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
dotenv.config();

passport.use(new GoogleStrategy(
    {
        clientID: "1067748629868-d6n3l0vva0v3ilqahh5uvdgkmv479po3.apps.googleusercontent.com",
        clientSecret: "TaNejxrXTpvRwDBhmkrVVFSv",
        callbackURL: "/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleID: profile.id}).then((currentUser)=> {
            if(currentUser){
                done(null,currentUser);
            }else{
                new User({
                    googleID: profile.id,
                    name: profile.name.givenName,
                    isAdmin: false
                }).save().then((newUser)=>{
                    done(null,newUser);
                });
            }
        })
    }
));

app.use(cookie({
    maxAge: 24*60*60*1000,
    keys:[process.env.COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
});

app.use(cors());
app.get('/register-device', (req, res) => {
    res.sendFile(`${base}/register-device.html`);
});
app.get('/add', (req, res) => {
    res.sendFile(`${base}/add.html`);
});
app.get('/index', (req, res) => {
    res.sendFile(`${base}/index.html`);
});
app.get('/send-command', (req, res) => {
    res.sendFile(`${base}/send-command.html`);
});
app.get('/store-list', (req, res) => {
    res.sendFile(`${base}/store-list.html`);
});
app.get('/registration', (req, res) => {
    res.sendFile(`${base}/registration.html`);
});
app.get('/register-list', (req, res) => {
    res.sendFile(`${base}/register-list.html`);
});
app.get('/article_lookup', (req, res) => {
    res.sendFile(`${base}/article_lookup.html`);
});
app.get('/addarticle', (req, res) => {
    res.sendFile(`${base}/addarticle.html`);
});
app.get('/updatearticlelookupprice', (req, res) => {
    res.sendFile(`${base}/updatearticlelookupprice.html`);
});
app.get('/updatearticlelookuplocation', (req, res) => {
    res.sendFile(`${base}/updatearticlelookuplocation.html`);
});
app.get('/home1', (req, res) => {
    res.sendFile(`${base}/home1.html`);
});
app.get('/home2', (req, res) => {
    res.sendFile(`${base}/home2.html`);
});
app.get('/deletearticle', (req, res) => {
    res.sendFile(`${base}/deletearticle.html`);
});
app.get('/login', (req, res) => {
    res.sendFile(`${base}/login.html`);
});
app.get('/deletestore', (req, res) => {
    res.sendFile(`${base}/deletestore.html`);
});
app.get('/deletefridge', (req, res) => {
    res.sendFile(`${base}/deletefridge.html`);
});
app.get('/register-fridge', (req, res) => {
    res.sendFile(`${base}/register-fridge.html`);
});
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));
app.get('/auth/google/redirect', passport.authenticate('google'),(req,res)=>{
    const user = req.user;
    app.locals.user = user;
    res.redirect('/home2');
});

app.get('/auth/google/user', (req,res)=>{
    res.send(app.locals.user)
});
app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
