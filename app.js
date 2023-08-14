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
    //console.log(req.body.cityName);
    const query=req.body.cityName;
    const appKey=process.env.APPKEY;
    const metric="metric";

    const url=process.env.WEATHERURL+query+"&appid="+appKey+"&units="+metric;
    https.get(url,function(response){                                                                       
        response.on("data",function(data){                  
            const weatherDATA= JSON.parse(data);      
            const icon=weatherDATA.weather[0].icon;
            const DATA = {
                temp:weatherDATA.main.temp,
                desc: weatherDATA.weather[0].description,
                imageURL:process.env.WEATHERIMAGEURL+icon+"@2x.png"
            };
            res.send(DATA);
        });
    });
});

app.post("/animequote", async function(req,res){
    const title = req.body.title;
    //console.log(title);
    let DATA ={};
    let param = "";
    if(title.length != 0 ){
        param = "anime?title="+title;
    }else{
        param = "";
    }
    await fetch(process.env.ANIMEURL+param)
          .then((response) => response.json())
          .then((quote) => 
            DATA = quote
          );
    console.log(DATA);
    res.send(DATA);
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
    
    var category = req.body.category;
    let DATA = {};
    request.get({
    url: process.env.QOTDURL + category,
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


app.listen(process.env.ROOT||3001,function(){
    console.log("server is running");
});