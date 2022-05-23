
require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')
const app = express()
const XMLHttpRequest = require('xhr2')

const request = require('request')
const http = require('http')

//LOGIN
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
//LOGIN ENDS

const bodyParser = require('body-parser')
const i18n = require('i18n')
const cookieParser = require('cookie-parser')

i18n.configure({
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    cookie: 'lang',
    directory: __dirname + '/locales'
})


//LOGIN 
 async function getUserByEmail(email)
{
    return await Users.findOne({email: email});
}

async function getUserById(id)
{
    return await Users.findById(id);
}

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  getUserByEmail,
  getUserById
)
const Users = require('./models/users')
//LOGIN ENDS

const Media = require('./models/media')


const Pusher = require('pusher');
const { response } = require('express')
const { read } = require('fs')
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER
});

mongoose.connect(process.env.MONGO_URL); //need for login

app.use(express.json())
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(flash())

//LOGIN
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
///LOGIN ENDS


app.use(cookieParser())
app.use(i18n.init)


app.get("/now", checkAuthenticated, async (req, res)=>
{
    var images = await Media.find({type: 'img'});
    var tikToks = await Media.find({type: 'tiktok'});
    var youTubes = await Media.find({type: 'youtube'});
    var username ="";
    try{
        username=req.user.name;
    } catch{}

    res.render("now", {images: images, tikToks: tikToks, youTubes: youTubes, user: username});
})

app.post('/now/:id/act', async(req, res) => {
    const action = req.body.action;
    const counter = action == 'Like' ? 1 : -1;
    const socketId = req.body.socket_id;
    const mediaId = req.params.id;
    const mediaData = await Media.findById(mediaId).exec();
    const users = mediaData.users; 
    const username  = req.user.name;
    const index = users.indexOf(username);
    if(action =="Like"){ 
        if (index <= -1) {
            users.push(username);
        }    
    }
    else if(action =="Unlike"){
        if (index > -1) {
            users.splice(index, 1);
        }      
    }
    Media.updateOne({_id: mediaId}, {$inc: {likes: counter}, users:users}, {}, (err, numberAffected) => {
        pusher.trigger('post-events', 'postAction', { action: action, username: username, imgId: mediaId }, {socket_id: socketId});
        res.send('');
    });
});

app.get("/socials", checkAuthenticated, (req, res)=>
{
    var defaultUsername ="";
    try{
        defaultUsername=req.user.name;
    } catch{}
    res.render("socials", {user:defaultUsername})
})

app.get("/home", checkAuthenticated, (req, res)=>
{
    var defaultUsername ="";
    try{
        defaultUsername=req.user.name;
    } catch{}
    res.render("home", {user :defaultUsername})
})

app.get("/", (req, res)=>
{
    res.redirect("/home")
})

//LOGIN
app.get("/log", checkNotAuthenticated, (req, res)=>
{
    res.render("login")
})

// app.post("/log", checkNotAuthenticated, async(req, res)=>
// {
//     // const options = {
//     //     hostname: 'localhost',
//     //     port: 4000,
//     //     path: '/log',
//     //     method: 'POST',
//     //     headers: {
//     //         'content-type': 'application/json',
//     //         'accept': 'application/json'
//     //     }
//     // };
//     // var postData = JSON.stringify({
//     //     email: req.body.email,
//     //     password: req.body.password
//     // })

//     request.post(
//         {
//             headers: {
//                 'content-type': 'application/json',
//                 'accept': 'application/json'
//             },
//             url: 'http://localhost:4000/log',          
//             json: {
//                 "email": req.body.email,
//                 "password": req.body.password
//             }
//         }, (error, response, body) =>{
//             if (error | response.statusCode != 200)
//             {
//                 console.log(response.statusCode);
//                 console.log(error);
//                 res.redirect("/log");
//             }
//             if(!error && response.statusCode == 200)
//             {
//                 console.log(response.statusCode);
                
//                 console.log(body.name);
//                 console.log(req.session.passport);
//                 //req.session.passport.user.name =  body.name;
//                 //console.log(req.session.user);
//                 res.redirect("/home");
//             }
//         })
// })

app.post("/log", checkNotAuthenticated, passport.authenticate('local',
{
    successRedirect: "/",
    failureRedirect:"/log",
    failureFlash: true
}))

app.get("/register", checkNotAuthenticated, (req, res)=>
{
    res.render("registration")
})

app.post("/register", checkNotAuthenticated, async (req, res)=>
{
    request.post(
        {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            url: process.env.LOGIN_URL,          
            json: {
                'registrationUsername': req.body.registrationUsername,
                'registrationEmail': req.body.registrationEmail,
                'registrationPassword': req.body.registrationPassword
            }
        }, (error, response, body) =>{
            if(!error && (response && response.statusCode == 200))
            {
                res.redirect("/log");
            }
            else {
                if(response) console.log(response.statusCode);
                if(error) console.log(error);
                res.redirect("/register");
            }
        })
})
//LOGIN ENDS


app.get("/message", (req, res) =>
{
    var defaultUsername ="";
    try{
        defaultUsername=req.user.name;
    } catch{}
    res.render("bot", {message: "", user: defaultUsername})
})

app.post("/message", (req, res) =>
{
    var messageData = {name: req.body.name, message: req.body.message}
    //console.log("Resieved data:", messageData)
    
    var lines = messageData.message.split('\n');
    var my_text = `<b>${messageData.name} sent you a message:</b>%0A`;
    for(var i = 0; i < lines.length; i++){
        my_text += `${lines[i]}%0A`;
    }

    var token = "5229361122:AAEX4f_7wI76f4UHVNDoOX-RcqVlkQbgRs4";
    var chat_id = -630008424;
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${my_text}&parse_mode=html`

    var api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    res.redirect("/message")
})



app.delete("/logout", (req, res) =>
{
    req.logout()
    res.redirect("/log")
})

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}

function checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/log')
    }
    next()
}

app.listen(3000)
