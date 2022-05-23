require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// const passport = require('passport')
// const flash = require('express-flash')
// const session = require('express-session')
// const methodOverride = require('method-override')
const bodyParser = require('body-parser')

// async function getUserByEmail(email)
// {
//     return await Users.findOne({email: email});
// }

// async function getUserById(id)
// {
//     return await Users.findById(id);
// }

// const initializePassport = require('./passport-config')
// initializePassport(
//   passport,
//   getUserByEmail,
//   getUserById
// )
const Users = require('./models/users');
const { get } = require('express/lib/response');

mongoose.connect(process.env.MONGO_URL);

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
// app.use(flash())

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
//   }))
//   app.use(passport.initialize())
//   app.use(passport.session())
//   app.use(methodOverride('_method'))

app.get('/', (req, res)=> {
    console.log('Request recieved')
    res.send({'message': 'Hi'})
});

app.post("/register", async(req, res)=>
{
    console.log('Registration request recieved');
    try{
        const hashedPassword = await bcrypt.hash(req.body.registrationPassword, 10);
        const newUser = new Users({
            name: req.body.registrationUsername,
            email: req.body.registrationEmail,
            password: hashedPassword
        })
        await newUser.save();
        res.statusCode = 200;
        res.setHeader( 'Content-Type', 'application/json')
        res.send({"message": 'Success'});
    }
    catch(e){
        res.statusCode = 400;
        res.setHeader( 'Content-Type', 'application/json')
        res.send({"errors": e});
    }
    
})

//LOGIN
//{
// app.get('/successfullogin', (req, res)=> {
//     console.log('Login successful')
//     res.setHeader( 'Content-Type', 'application/json')
//     res.statusCode = 200;
//     res.send({"message":'Success'})
// });


// app.get('/unsuccessfullogin', (req, res)=> {
//     console.log('Login failed')
//     res.setHeader( 'Content-Type', 'application/json')
//     res.statusCode = 400;
//     res.json({"errors": req.flash('error')})
// });


// app.get("/log", (req, res)=> {
//     res.setHeader( 'Content-Type', 'application/json')
//     if (req.flash('error')!='')
//     {
//         console.log('Login failed')
//         res.statusCode = 400;
//         res.json({"errors": req.flash('error')})
//     } else{
//         res.statusCode = 200;
//         res.json({"message":'Success'})
//     }
// });

// app.post("/log",(req, res)=> {
//     console.log(req);
// });

// app.post("/log", passport.authenticate('local',
// {
//     successRedirect: "/successfullogin",   
//     failureRedirect:"/unsuccessfullogin", 
//     failureFlash: true
// }))

// app.post("/log", passport.authenticate('local'), function(req, res){
//     res.json({"message": "Success", "name": req.user.name});
// })
//}

app.listen(4000)