
var cityname = "";
var searchCity = document.querySelector('#search-city-name');
var searchCityBtn = document.querySelector('#search-btn');
var currentCity = document.querySelector('#current-city');
var currentTemp = document.querySelector('#temperature');
var currentWind = document.querySelector('#wind-speed');
var currentHumidity = document.querySelector('#humidity');
var currentUv = document.querySelector('#uv-index');
var historyCity = [];

function displayWeather(event) {
    event.preventDefault();
    if (searchCity.value !=="") {
        cityname = searchCity.value;
        console.log(cityname);
        currentWeather(cityname);
    }
}

function currentWeather (cityname) {
  

    fetch ('http://api.openweathermap.org/data/2.5/weather?q=' + cityname + '&units=imperial&APPID=c6abcf46d3c1275bb6975cedbb19a731')


    .then (function (response) {
        response.json()
        
        .then (function(data){
        
       var weatherIcon = data.weather[0].icon;
       var iconurl = 'http://openweathermap.org/img/wn/'+ weatherIcon +'@2x.png';
       var date = new Date (data.dt*1000).toLocaleDateString();
       currentCity.innerHTML = data.name + '(' + date + ')' + '<img src=' + iconurl + '>';

       var tempF = (data.main.temp - 273.15) * 1.8 + 32;
       currentTemp.innerHTML = tempF.toFixed (2) + '&#8457';

       var ws = data.wind.speed;
       var winsmph = (ws*2.237).toFixed(1);
       currentWind.innerHTML = winsmph + 'MPH';
       
       currentHumidity.innerHTML = data.main.humidity + '%';

       UVIndex(data.coord.lon,data.coord.lat);
       forecast(data.id);
       if (data.cod ==200){
           historyCity = JSON.parse(localStorage.getItem('citylist'));

           if (historyCity == null ) {
               historyCity = [];
               historyCity.push(cityname.toUpperCase ());
               localStorage.setItem('citylist',JSON.stringify(historyCity));
               addToList (cityname);
           } else {
               if (find (cityname)> 0) {
                   historyCity.push(cityname.toUpperCase());
                   localStorage.setItem('citylist',JSON.stringify(historyCity));
                   addToList (cityname);
               }
           }
       }
    })
   })

   function UVIndex (ln,lt) {
       fetch ('http://api.openweathermap.org/data/2.5/uvi?appid=c6abcf46d3c1275bb6975cedbb19a731'+'&lat='+lt+'&lon='+ln) 
       .then (function(response) {
        response.json()
        .then (function (data) {
            currentUv.innerHTML = data.value;
        })   
        
       })
   }
   
   function forecast () {
       var dayover = false;
       
       fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + cityname + '&appid=c6abcf46d3c1275bb6975cedbb19a731' )
       .then (function (response) {
           response.json()
           .then (function (data) {
           for (i=0; i < 5; i++) {
               var date = new Date ((data.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
               var iconweather = data.list[((i+1)*8)-1].weather[0].icon;
               var iconurl = 'https://openweathermap.org/img/wn/'+ iconweather + '.png';
               var tempC = data.list[((i+1)*8)-1].main.temp;
               var tempF = (((tempC-273.5)*1.8)+32).toFixed(2);
               var humidity = data.list[((i+1)*8)-1].main.humidity;

               document.getElementById('#fDate'+i).innerHTML = date;
               document.getElementById('#fImg'+i).innerHTML = '<img src=' + iconurl+ '>';
               document.getElementById('#fTemp'+i).innerHTML = tempF + '&#8457';
               document.getElementById('#fHumidity'+i).innerHTML = humidity + '%';

           }
        })
       })
   }


}

function addToList () {
    var listEl = document.createElement('li');
    listEl.innerHTML = cityname;
    document.querySelector('.history-list').appendChild(listEl);
}



searchCityBtn.addEventListener('click',displayWeather);
