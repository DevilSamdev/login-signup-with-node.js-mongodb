require('dotenv').config();
require('./model/database');
const auth=require('./middleware/auth')
const express=require("express");
var cookieParser = require('cookie-parser')
const bodyParser=require("body-parser");
const student=require('./model/user')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var app=express()
app.use(cookieParser())
app.set("view engine","ejs")
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

const port=process.env.PORT || 5000;

app.get("/thank", (req, res)=> {res.render("thank")});
app.get("/signup", function (req, res) {res.render("signup")});
// for signup
app.post('/signup',async (req,res)=>{
    try{
		const password=req.body.password;
		const cpassword=req.body.confirmpassword;
    if(password=== cpassword){
        const User=new student({
               name:req.body.name,
               email:req.body.email,
               password:password,
	         confirmpassword:cpassword,
               phone:req.body.phone 
    })
        console.log(`The success part ${User}`)
        const token=await User.ganerateAuthToken()

/**
 * cookie
 */
                res.cookie("jwt",token,{
                expires:new Date(Date.now()+10000),
                httpOnly:true
            });

            User.save()
                .then(result=>{
                    res.redirect("thank") 
                    })
                }
	else{
        res.send("password and confirm password should be same") 
	}
}
    catch(error){
        console.log(error)
        }
    })
app.post("/login",async(req,res)=>{
            try{
                const  email=req.body.email;
                const  password=req.body.password;
		 
        const user=await student.findOne({email:email})
        const isMatch=await bcrypt.compare(password,user.password)
                        console.log(`The success part ${user}`)
                        const token=await user.ganerateAuthToken()
            // cookie
                    res.cookie("jwt",token,{
                    expires:new Date(Date.now()+100000),
                    httpOnly:true
            });
            // console.log(`this is the cookie awesome ${req.cookies.jwt}`)              
                    if(isMatch){
                        res.status(201).redirect("front");
                    }else{
                        res.send("Invalid password details")
                    }
        }
        catch(error){
			return res.send(error)
        }
})

app.get("/pages",  (req, res)=>{
    // console.log(`cookies-  ${req.cookies.jwt}`)
    res.render("pages")});
//for logout
app.get("/logout",auth,async  (req, res)=> {
    try{
        console.log(req.user)

        req.user.tokens=req.user.tokens.filter((token)=>{
            return  token.token !== req.token;
        })


        res.clearCookie("jwt")
        console.log("logout successfully")
        await req.user.save()
        res.render("login")
    }catch(error){
        res.status(500).send(error)
    }
   }); 


app.get("/front",auth,(req, res)=> {res.render("front")});
app.post("/signup", function (req, res) {res.render("signup")});
app.get("/home", function (req, res) {res.render("home")});
app.get("/login", function (req, res) {res.render("login")});
app.post("/thank", (req, res)=> { res.render("thank")});
app.listen(port, () => {
    console.log(`Server running at http://${port}/`);
});
app.get('/', (req, res)=> {res.render('home')});
  module.exports = app;	