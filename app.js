const express = require("express");
const cors =require ("cors");           //to enable access from multiple domains
const bodyParser =require("body-parser");
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

app.post("/weather", function(req,res){
    // console.log(req.body.cityName);
    const query=req.body.cityName;
    const appKey=process.env.APPKEY;
    const metric="metric";

    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+appKey+"&units="+metric;
    https.get(url,function(response){          
        console.log(response.statusCode);                                                               
        response.on("data",function(data){                  
            const weatherDATA= JSON.parse(data);      
            const temp=weatherDATA.main.temp;
            const desc=weatherDATA.weather[0].description;
            const icon=weatherDATA.weather[0].icon;
            const imageURL="http://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.write("<h1>Current temperature in "+query+" is "+temp+" degrees Celcius</h1>");
            res.write("<p>The current weather description is "+desc+".<p>");
            res.write("<img src="+imageURL+">");
            res.send();
        });
    });
});


app.listen(process.env.ROOT||4000,function(){
    console.log("server is running");
});