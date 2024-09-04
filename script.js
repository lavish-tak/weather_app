
    const userTab = document.querySelector("[data-user-weather]");
    const searchTab = document.querySelector("[data-search-weather]");
    const grantAccessButton = document.querySelector("[grantAccess]");
    const searchInput = document.querySelector("[data-searchForm] input");
    const searchForm = document.querySelector("[data-searchForm]");
    const userContainer = document.querySelector(".weather-container");
    const loadingScreen = document.querySelector(".loading-container");
    const userInfoContainer = document.querySelector(".user-info-container");
    const grantAccessContainer = document.querySelector(".grant-location-container");

    let currentTab = userTab;
    const API_key = "60847f2a302151945777391ceece5023";

    currentTab.classList.add("current-tab");
    getFromSessionStorage();

    function switchTab(clickedTab) {
        if (clickedTab !== currentTab) {
            currentTab.classList.remove("current-tab");
            currentTab = clickedTab;
            currentTab.classList.add("current-tab");

            if (!searchForm.classList.contains("active")) {
                userInfoContainer.classList.remove("active");
                grantAccessContainer.classList.remove("active");
                searchForm.classList.add("active");
            } else {
                searchForm.classList.remove("active");
                userInfoContainer.classList.remove("active");
                getFromSessionStorage();
            }
        }
    }

    if (userTab) {
        userTab.addEventListener('click', () => switchTab(userTab));
    }

    if (searchTab) {
        searchTab.addEventListener('click', () => switchTab(searchTab));
    }

    function getFromSessionStorage() {
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if (!localCoordinates) {
            grantAccessContainer.classList.add("active");
        } else {
            const coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
    }

    async function fetchUserWeatherInfo(coordinates) {
        const { lat, lon } = coordinates;
        grantAccessContainer.classList.remove("active");
        loadingScreen.classList.add("active");
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
            );
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } catch (err) {
            loadingScreen.classList.remove("active");
            console.error("Error fetching user weather info:", err);
        }
    }

    function renderWeatherInfo(weatherInfo) {
        const cityName = document.querySelector("[cityName]");
        const countryIcon = document.querySelector("[countryIcon]");
        const desc = document.querySelector("[weatherDesc]");
        const weatherIcon = document.querySelector("[weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windSpeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-Clouds]");

        // if (cityName && countryIcon && desc && weatherIcon && temp && windSpeed && humidity && cloudiness) {
            cityName.innerText = weatherInfo.name;
            countryIcon.src = `https://flagcdn.com/16x12/${weatherInfo.sys.country.toLowerCase()}.png`;
            desc.innerText = weatherInfo.weather[0].description;
            weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`;
            temp.innerText = `${weatherInfo.main.temp} °C`;
            windSpeed.innerText = `${weatherInfo.wind.speed} m/s`;
            humidity.innerText = `${weatherInfo.main.humidity} %`;
            cloudiness.innerText = `${weatherInfo.clouds.all} %`;
        // } else {
        //     console.error("Failed to render weather info. Check if all elements and weatherInfo properties exist.");
        // }
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleError);
        } else {
            alert("Geolocation is not supported.");
        }
    }

    function handleError(error) {
        console.error("Geolocation error:", error);
        alert("Error: " + error.message);
    }

    function showPosition(position) {
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };
        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
    }

    if (grantAccessButton) {
        grantAccessButton.addEventListener('click', getLocation);
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let cityName = searchInput.value.trim();
            if (cityName) {
                fetchSearchWeatherInfo(cityName);
            }
        });
    }

    async function fetchSearchWeatherInfo(city) {
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } catch (err) {
            console.error("Error fetching search weather info:", err);
            alert("No such location");
            loadingScreen.classList.remove("active");
        }
    }

