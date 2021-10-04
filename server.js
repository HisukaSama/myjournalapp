/* importing dependacies */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const apiKey = 'dd2106f9677001b62e7a12a2e1b9a869';
const port = 3030;
let projectData={
    weather:{},
    date:'',
    userResponse:''
};



/* setting up my app */ 
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    console.log(req.hostname);
    console.log(req.path);
    next();
});

//setting the public folder
app.use(express.static('static'));

//firing up the server and logging info

app.use((req,res,next)=>{
    console.log(req.hostname);
    console.log(req.path);
    next();
});

app.listen(port,()=>{
    console.log(`server is up and running at http://127.0.0.1:${port}`);
});

/* handling GETs */
app.get('/',(req,res) => res.sendFile('.static/index.html') );

//location-based requests
app.get('/locate-me/lat=:lat/lon=:lon',async(req,res)=>{
    console.log(req.params);
    const lat = req.params.lat;
    const lon = req.params.lon;
    console.log('lat is ',lat +'lon is ', lon);
    const data = await getDataWithCoords(lat,lon);
    console.log('data is ',data);
    res.send(data);
});

//zip-based requests
app.get('/locate-me/zip=:zip',async(req,res)=>{
    console.log('fired');
    console.log(req.params);
    const zip= req.params.zip;
    const data = await getDataWithZip(zip);
    console.log(data);
    res.send(data);
});

app.post('/post',async(req,res)=>{
    console.log('post came!');
    projectData.weather = req.body.weather;
    projectData.date = req.body.date;
    projectData.userResponse= req.body.userResponse;

    console.log(`post is `,projectData);
    res.send(projectData);
});


/*getting weather stuff from api */

const getDataWithZip = async (zip)=>{
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=metric`);
    console.log(res.status);
    const data = await res.json();
    if(res.status === 200){
        const weather = processWeather(data);
        return weather;
    }else {
        console.log(data);
        return data;
    }
   
};

const getDataWithCoords= async (lat, lon)=>{
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const json = await res.json();
    const weather = processWeather(json);
    return weather;
}

/* deconstructing the data coming from the api */

const processWeather = (data={})=>{
    let processedData = {
        cod :200,
        name : data.name,
        temp : data.main.temp,
        description : data.weather[0].description,
        icon : data.weather[0].icon,
    }
    return processedData;
};
