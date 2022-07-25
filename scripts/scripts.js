let date = new Date();
const inputValue = document.querySelector("#search-bar");

const search = () => {
    if(inputValue.value) {
        weather.weatherInfo(inputValue.value);
        inputValue.value = "";
        document.querySelector('#error-container').style.opacity = "0";
    }
};
const searchLocation = (position) => {
    const { latitude, longitude } = position.coords;
    weather.currentLocation(latitude, longitude);
}
const init = () => {
    window.navigator.geolocation.getCurrentPosition(searchLocation);
    weather.weatherInfo("Warsaw");
    document.querySelector(".date-dayname").innerText = date.toLocaleDateString('en-us', { weekday: 'long' });
    document.querySelector(".date").innerText = date.toLocaleDateString('en-us', { day: 'numeric', month: 'short', year: 'numeric' });;
    setTimeout(() => {
        document.querySelector(".icon").style.opacity = "1";
        document.querySelectorAll("div img").forEach(e => e.style.opacity = "1");
    },200);
}

let weather = {
    apiKey: "4a0c2a9143ffc504f8e10baa4140410f",
    weatherInfo(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=4&units=metric&appid=${weather.apiKey}`)
        .then((response) => { 
            if (response.ok) {
                return response.json();
            }
            throw new Error ();
        }).then((data) => {
            this.displayWeather(data);
        }).catch(() => {
            document.querySelector('#error-container').style.opacity = "1";
        });
    },
        
    currentLocation(latitude, longitude) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=4&units=metric&appid=${weather.apiKey}`)
        .then(response => response.json())
        .then((data) => {
            this.displayWeather(data);
        });
    },
    displayWeather(data) {
        const { name, country } = data.city;
        const { description, icon } = data.list[0].weather[0];
        const { temp, humidity, pressure } = data.list[0].main;
        const { speed } = data.list[0].wind;
        const { visibility } = data.list[0];
        document.querySelector(".weather-location").innerHTML = `<i class="icon-location"></i>${name}, ${country}`;
        document.querySelector(".weather-temperature").innerHTML = `${Math.floor(temp)} ℃`;
        document.querySelector(".weather-description").innerText = `${description}`;
        document.querySelector("#humidity #value").innerText = `${humidity}%`;
        document.querySelector("#wind #value").innerText = `${Math.floor(speed)} Mph`;
        document.querySelector("#pressure #value").innerText = `${pressure} hPa`;
        document.querySelector("#visibility #value").innerText = `${Math.round(visibility)/1000} km`;
        document.querySelector(".icon").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        for(let i = 0; i < 4; i++) {
            const { dt_txt } = data.list[`${i}`];
            const { icon } = data.list[`${i}`].weather[0];
            const { temp } = data.list[`${i}`].main;
            document.querySelector(`.icon${i}`).src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            document.querySelector(`#temp${i}`).innerText = `${Math.floor(temp)} ℃`;
            const date = new Date(dt_txt);
            h = (date.getHours() < 10 ? '0' : '') + date.getHours();
            m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
            document.querySelector(`#day${i}`).innerText = `${h}:${m}`;
        }
        if (description === 'clear sky' && date.getHours() > 19 || date.getHours < 5 ) {
            document.body.style.backgroundImage = "url('imgs/night.jpg')";
        } else if(description === 'clear sky') {
            document.body.style.backgroundImage = "url('imgs/clear-sky.jpg')";
        } else if (description === 'few clouds') {
            document.body.style.backgroundImage = "url('imgs/few-clouds.jpg')";
        } else if (description === 'scattered clouds' || description === 'broken clouds' ) {
            document.body.style.backgroundImage = "url('imgs/clouds.jpg')";
        } else if (description === 'shower rain' || description === 'rain' || description === 'light rain') {
            document.body.style.backgroundImage = "url('imgs/rain.jpg')";
        } else if (description === 'thunderstrom') {
            document.body.style.backgroundImage = "url('imgs/thunderstorm.jpg')";
        } else if (description === 'snow' || description === 'light snow') {
            document.body.style.backgroundImage = "url('imgs/snow.jpg')";
        } else if (description === 'mist') {
            document.body.style.backgroundImage = "url('imgs/mist.jpg')";
        }
    }
}

window.onload = init;
document.querySelector("#searching").addEventListener("click", search);
document.addEventListener("keypress", (e) => {
    if(e.key === "Enter") return search();
});