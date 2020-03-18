const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Nothing to see here."));
app.get("/newsletter", (req, res) => res.sendFile(__dirname + "/public/signup.html"));

app.post("/newsletter", (req, res) => {
    const first = req.body.firstName;
    const last = req.body.lastName;
    const email = req.body.emailAddress;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const urlMailchimp = "https://us19.api.mailchimp.com/3.0/lists/c0c502802f";
    const options = {
        method: "POST",
        auth: "natanaelk:845bd4591288148aa61800c6db4c67d7-us19"
    }
    const request = https.request(urlMailchimp, options, (response) => {
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/public/success.html");
        }else{
            res.sendFile(__dirname+"/public/failure.html");
        }
        console.log(response.statusCode);
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

app.post("/failure", (req,res) => res.redirect("/newsletter"));

app.listen(process.env.PORT || 3000, () => console.log("Running on port: 3000"));



// list id
// c0c502802f