const express = require("express");
const cors =require ("cors");           //to enable access from multiple domains
const bodyParser =require("body-parser");
const https=require ("https"); 
require('dotenv').config();
    
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
    console.log(req.body.cityName);
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


app.listen(process.env.ROOT||3001,function(){
    console.log("server is running");
});