const inputValue = document.querySelector("#search-bar");

const search = () => {
    if(inputValue.value) {
        weather.weatherInfo(inputValue.value);
        inputValue.value = "";
    }
};
const searchLocation = (position) => {
    const { latitude, longitude } = position.coords;
    weather.currentLocation(latitude, longitude);
}
const init = () => {
    window.navigator.geolocation.getCurrentPosition(searchLocation);
    weather.weatherInfo("Warsaw");
    setTimeout(() => {
        document.querySelector(".icon").style.opacity = "1";
        document.querySelectorAll("div img").forEach(e => e.style.opacity = "1");
    },200);
}

let weather = {
    weatherInfo(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=4&units=metric&appid=4a0c2a9143ffc504f8e10baa4140410f`)
        .then((response) => { 
            if (response.ok) {
                return response.json();
            }
            throw new Error ();
        }).then((data) => {
            this.displayWeather(data);
        }).catch(() => {
            document.querySelector('#error-container').style.opacity = "1";
            setTimeout(() => {
                document.querySelector('#error-container').style.opacity = "0";
            }, 2000)
        });
    },
    currentLocation(latitude, longitude) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=4&units=metric&appid=4a0c2a9143ffc504f8e10baa4140410f`)
        .then(response => response.json())
        .then((data) => {
            this.displayWeather(data);
        });
    },
    displayWeather(data) {
        const { name, country, timezone } = data.city;
        const { description, icon } = data.list[0].weather[0];
        const { temp, humidity, pressure } = data.list[0].main;
        const { speed } = data.list[0].wind;
        const { visibility } = data.list[0];
        const { pod } = data.list[0].sys;
        let count =  0;
        document.querySelector(".weather-location").innerHTML = `<i class="icon-location"></i>${name}, ${country}`;
        document.querySelector(".weather-temperature").innerHTML = `${Math.floor(temp)} ℃`;
        document.querySelector(".weather-description").innerText = `${description}`;
        document.querySelector("#humidity #value").innerText = `${humidity}%`;
        document.querySelector("#wind #value").innerText = `${Math.floor(speed)} Mph`;
        document.querySelector("#pressure #value").innerText = `${pressure} hPa`;
        document.querySelector("#visibility #value").innerText = `${Math.floor(Math.round(visibility)/1000)} km`;
        document.querySelector(".icon").src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        for(let i = 0; i < 4; i++) {
            const { dt_txt } = data.list[`${i}`];
            const { icon } = data.list[`${i}`].weather[0];
            const { temp } = data.list[`${i}`].main;
            document.querySelector(`.icon${i}`).src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            document.querySelector(`#temp${i}`).innerText = `${Math.floor(temp)} ℃`;

            const curLocalDate = new Date(dt_txt);
            let curLocalMiliSec = curLocalDate.getTime();
            let utcOffsetInMiliSec = timezone * 1000;
            let offSetDelay = 180 * 60 * 1000;
            let utcTime = new Date(curLocalMiliSec + utcOffsetInMiliSec - offSetDelay);

            let utcHours = utcTime.getHours()
            let utcMinutes = utcTime.getMinutes();

            h = (utcHours < 10 ? '0' : '') + utcHours;
            m = (utcMinutes < 10 ? '0' : '') + utcMinutes;
            document.querySelector(`#day${i}`).innerText = `${h}:${m}`;
            if (count === 0) {
                document.querySelector(".date-dayname").innerText = utcTime.toLocaleDateString('en-us', { weekday: 'long' });
                document.querySelector(".date").innerText = utcTime.toLocaleDateString('en-us', { day: 'numeric', month: 'short', year: 'numeric' });
            }
            count++;
        }

        if (pod === 'd') {
            document.querySelector('#long-term-container').style.background = "linear-gradient(0deg, rgba(251,251,251,1) 0%, rgba(79,174,245,1) 100%)";
            document.querySelector('#long-term-container').style.color = "#000";
        }
        if ( pod === 'n' ) {
            document.querySelector('#long-term-container').style.background = "linear-gradient(0deg, rgba(45,44,44, .9) 0%, rgba(0,0,0,1) 100%)";
            document.querySelector('#long-term-container').style.color = "#fff";
        }
        if (description === 'clear sky' && pod === 'n') {
            document.body.style.backgroundImage = "url('imgs/night.jpg')";
        }
        if(description === 'clear sky' && pod ==='d') {
            document.body.style.backgroundImage = "url('imgs/clear-sky.jpg')";
        }
        if (description === 'few clouds') {
            document.body.style.backgroundImage = "url('imgs/few-clouds.jpg')";
        }
        if (description === 'scattered clouds' || description === 'broken clouds' || description === 'overcast clouds') {
            document.body.style.backgroundImage = "url('imgs/clouds.jpg')";
        }
        if (description === 'shower rain' || description === 'rain' || description === 'light rain' || description === 'moderate rain') {
            document.body.style.backgroundImage = "url('imgs/rain.jpg')";
        }
        if (description === 'thunderstrom') {
            document.body.style.backgroundImage = "url('imgs/thunderstorm.jpg')";
        }
        if (description === 'snow' || description === 'light snow') {
            document.body.style.backgroundImage = "url('imgs/snow.jpg')";
        }
        if (description === 'mist') {
            document.body.style.backgroundImage = "url('imgs/mist.jpg')";
        }
    }
}

window.onload = init;
document.querySelector("#searching").addEventListener("click", search);

document.addEventListener("keypress", (e) => {
    if(e.key === "Enter") return search();
});