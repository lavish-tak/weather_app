const userTab = document.querySelector("[data-user-weather]");
const searchTab = document.querySelector("[data-search-weather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector("user-info-container");

let currentTab = userTab;
const API_key = "60847f2a302151945777391ceece5023";
currentTab.classList.add("current-tab");

