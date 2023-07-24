
require('dotenv').config()
const express=require("express")
const app= express();
const encrypt=require("mongoose-encryption")
const bodyParser=require("body-parser")

const mongoose=require("mongoose")
main().catch(err => console.log(err));

const ejs=require("ejs")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine","ejs")
async function main()
{

await mongoose.connect("mongodb://127.0.0.1/secretDB")
console.log("Connected")

const userSchema=mongoose.Schema({
    email:String,
    password:String
});
//encryption being done using npm mongoose-encryption
const secret=process.env.SECRET;//using the .env
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});
const User=mongoose.model("User",userSchema);



app.get("/",function(request,response)
{
    response.render("home")
})
app.get("/login",function(request,response)
{
    response.render("login")
})
app.post("/login",async function(request,response)
{
    await User.findOne({email:request.body.username})
    .then(function(user)
    {if(user)
        {
            if(user.password===request.body.password)
            {
                response.render("secrets");
            }
            else{
                console.log("Not found")
            }
        }
        else{
            console.log("Not found")
        }
      
    })
    .catch(function(err)
    {
        console.log(err)
    })
})




app.get("/register",function(request,response)
{
    response.render("register")
})

app.post("/register",function(request,response)
{
    const user= new User({
        email:request.body.username,
        password:request.body.password


    })
    user.save()
    .then(function()
    {
        response.render("secrets")
    })
    .catch(function(err)
    {
        console.log(err)
    })
})


app.listen(3000,function()
{
    console.log("Server at port 3000 deployed.")
})



}