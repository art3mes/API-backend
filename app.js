const express = require("express");
const cors =require ("cors");           //to enable access from multiple domains
const bodyParser =require("body-parser");
const https=require ("https"); 
require('dotenv').config();
var validUrl = require('valid-url');
const request = require('request');
    
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.get("/", function(req,res){
    res.send("yes");
});

app.post("/weather", function(req,res){
    const query=req.body.cityName;
    const appKey=process.env.APPKEY;
    const metric="metric";

    const url=process.env.WEATHERURL+query+"&appid="+appKey+"&units="+metric;
    https.get(url,function(response){                                                                       
        response.on("data",function(data){                  
            const weatherDATA= JSON.parse(data);     
            try {
            const DATA = {
                temp: weatherDATA.main.temp + "°C",
                desc: weatherDATA.weather[0].description,
                imageURL: process.env.WEATHERIMAGEURL + weatherDATA.weather[0].icon + "@2x.png",
            };
                res.send(DATA);
            } catch (error) {
                res.send("Invalid Entry"); // Send an error response
            }
        });
    });
});

app.post("/qrcodegenerator", function(req,res){
    const link=req.body.URL;

    if (validUrl.isUri(link)){
        const url=process.env.QRCODEGENERATORURL+link;
        console.log(url);
        res.send(url);
    } else {
        console.log("error");
        res.send("error");
    } 
});

app.post("/qotd", function(req,res){
    
    let DATA = {};
    request.get({
    url: process.env.QOTDURL,
    headers: {
        'X-Api-Key': process.env.APININJAKEY
    },
    }, function(error, response, body) {
    if(error) return console.error('Request failed:', error);
    else if(response.statusCode != 200) 
        return console.error('Error:', response.statusCode, body.toString('utf8'));
    else {
        DATA=body;
        console.log(DATA)
        res.send(DATA);
    }     
    });
   
});

app.post("/riddle", function(req,res){
    let DATA = {};
    request.get({
    url: process.env.RIDDLEURL,
    headers: {
        'X-Api-Key': process.env.APININJAKEY
    },
    }, function(error, response, body) {
    if(error) return console.error('Request failed:', error);
    else if(response.statusCode != 200) 
    return console.error('Error:', response.statusCode, body.toString('utf8'));
    else {
        DATA = body;
        console.log(body);
        res.send(DATA);
    }
    });
});

app.post("/semantic", function(req,res){
    let DATA={};
    var text = req.body.text;
    request.get({
    url: 'https://api.api-ninjas.com/v1/sentiment?text=' + text,
    headers: {
        'X-Api-Key': process.env.APININJAKEY
    },
    }, function(error, response, body) {
    if(error) 
        return console.error('Request failed:', error);
    else if(response.statusCode != 200) 
        return console.error('Error:', response.statusCode, body.toString('utf8'));
    else{
        DATA = body;
        res.send(DATA);
    }   
    });
}); 
app.listen(process.env.ROOT||3001,function(){
    console.log("server is running");
});