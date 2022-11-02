//jsHint esversion:6
const express=require("express");
const bodyParser=require("body-parser")
const request=require("request");
const json = require("body-parser/lib/types/json");
const https=require("https");
const { response } = require("express");

const app=express()
const port=process.env.PORT || 3000;//heroku

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"\\signUp.html")
})

app.post("/",(req,res)=>{
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email
    console.log(firstName,lastName,email)

    //mailchimp data audience fields
    let data={
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }
        }

    let jsonData=JSON.stringify(data)
    
    // take help with Postman
    const url="https://us10.api.mailchimp.com/3.0/lists/572a699ad7/members" //from mailchimp api reference doc
    const options={
        method:"POST",
        auth:"Nikhil:b8448a4736a46092508e8f522e35570d-us10"
    }
    //const errorTitle=
   const request = https.request(url,options,(response)=>{
        response.on("data",(data)=>{
            console.log(JSON.parse(data))

            if(response.statusCode === 200){
                res.sendFile(__dirname + "\\success.html")
            }
            
            if(response.statusCode === 400){
                res.sendFile(__dirname + "\\failure.html")
            }
        })
    })

    request.write(jsonData)
    request.end()
})

app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.listen(port,()=>{
    console.log(`Server started at ${port} port`)
})

//Api key Mailchip.com => b8448a4736a46092508e8f522e35570d-us10

//Audience Id or list Id =>  572a699ad7