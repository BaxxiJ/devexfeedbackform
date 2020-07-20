const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");
const { response } = require('express');

const app = express();

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// serve static files (i.e CSS) from foilder "public"
app.use(express.static("public")); 

// create parser to retrieve form posted elements
app.use(bodyParser.urlencoded({extended: true}));  

//present signup page on opening site root
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
    console.log("index sent");
    
});

// send post request to endpoint
app.post("/", function(req, res) {
    
    data = req.body;
    data.dateTime = new Date();
    console.log(data);
    var jsonData = JSON.stringify(data);
    console.log(jsonData);

    //minimise JSON object to a single string
    var jsonData = JSON.stringify(data);

    // set url to API endpoint (e383... is the list ID I'm editing)
    // setting constant inproves readability of actual request code
    const url = "https://us10.api.mailchimp.com/3.0/lists/e383805f31"; // change to endpoint url

    // options are the META data for the request, Data is being posted by user:apiKey
    const options = {
        method: "POST",
        auth: "jbaxter69:db9e0a4d44fcce380764ad50dc5477e8-us10"
    } 

    //create request object using https.request
    const request = https.request(url , options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    });


    //add JSOn data to request object, then send it
    request.write(jsonData);
    request.end();


});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(port, ip, function() {
    console.log("server is running on port 3000");
    
});
