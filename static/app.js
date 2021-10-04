
const myURL = 'http://127.0.0.1:3030'
const generate = document.getElementById('generate');
const zip_txt = document.getElementById('zip');
let d = new Date();
let newDate = d.getDate()+'/'+ (d.getMonth()+1)+'/'+ d.getFullYear();




/* callback functions  */
const updateUI= (data,feels)=>{

    if(data.cod == 200){
        //formulating our postdata
        const post = {
            weather: data, 
            date :newDate,
            userResponse: feels
        };

        //posting it and then updating our UI with the response
        fetch(myURL+'/post',{
        'method' :'POST',
        'credintials':'same-origin',
        'headers':{'Content-Type':'application/json'},
            body : JSON.stringify(post)

        }).then(res=>res.json())
        .then((data)=>{
            document.getElementById('date').textContent= data.date;
            document.getElementById('w_img').setAttribute('src',`http://openweathermap.org/img/w/${data.weather.icon}.png`);
            document.getElementById('w_img').style.display = 'inline';
            document.getElementById('content').textContent= data.userResponse;
            document.getElementById('temp').innerHTML = data.weather.temp+'&deg;C' + ' '+ data.weather.description;
            document.getElementById('error').style.display= 'none';

        
    });
    //handling error
    }else{
            console.log(data.message);
            document.getElementById('error').textContent= data.message;
            document.getElementById('error').style.display= 'block';
            
    }
  
}

//zip-based requests

const zipReq = async() =>{
    const zip = zip_txt.value;
    console.log(zip);

    //getting weather by zip
    const res =await fetch(myURL+`/locate-me/zip=${zip}`);
    const data = await res.json();
    console.log(data);
    return data;
};



/* event-listeners */

generate.addEventListener('click',async()=>{
    const zip = zip_txt.value;
    const feels = document.getElementById('feelings').value;
    if(!feels){
        alert(`why don't you share your feels ?`);
        return; 
    }
    
    console.log('fired',zip);
    if(zip){
        console.log('using zip');
        let data = await zipReq();
        console.log('final data',data); 
       
        console.log(newDate);
        
        updateUI(data,feels);
    }else{
        console.log('using coords');

        let geo = navigator.geolocation 
        geo.getCurrentPosition( async position => {
        console.log(`latitude is ${position.coords.latitude}, longitude is ${position.coords.longitude}`);
        const res = await fetch(myURL+`/locate-me/lat=${position.coords.latitude}/lon=${position.coords.longitude}`);
        const data =  await res.json();
        updateUI(data,feels);
        });
    }
    
});