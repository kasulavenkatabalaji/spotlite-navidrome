// ---- CONFIG ----
const API_URL = "https://spotlite-navidrome.onrender.com";
const USERNAME = "santosh";
const PASSWORD = "1234@balu";
const API_VERSION = "1.16.1";
const CLIENT = "spotlite";

const audioPlayer = new Audio();
let currentSong = null;
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
let recentlyPlayed = JSON.parse(localStorage.getItem("recently")) || [];

// ---- AUTH (Navidrome-compatible) ----
function getAuthParams() {
  return `u=${USERNAME}&p=${PASSWORD}&v=${API_VERSION}&c=${CLIENT}&f=json`;
}

// ---- FETCH ALBUMS ----
async function fetchAlbums() {
  try {
    const res = await fetch(`${API_URL}/getAlbumList2.view?${getAuthParams()}&type=newest`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const response = data["subsonic-response"];
    if (response.status === "failed") throw new Error(response.error.message);

    const albums = response.albumList2?.album || response.albumList?.album || [];
    displayAlbums(albums);
  } catch (err) {
    console.error("Error fetching albums:",err);
  }
}

// ---- DISPLAY ALBUMS ----
function displayAlbums(albums) {
  const albumList = document.getElementById("album-list");
  albumList.innerHTML = "";
  albums.forEach(album => {
    const card = document.createElement("div");
    card.classList.add("album-card");
    card.innerHTML = `
      <img src="${API_URL}/getCoverArt.view?id=${album.coverArt || album.id}&${getAuthParams()}"
           alt="${album.name}" 
           onerror="this.src='default.jpg'">
      <p>${album.name}</p>
    `;
    card.addEventListener("click", () => fetchSongs(album.id));
    albumList.appendChild(card);
  });
}

// ---- FETCH SONGS ----
async function fetchSongs(albumId) {
  try {
    const res = await fetch(`${API_URL}/getAlbum.view?id=${albumId}&${getAuthParams()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const songs = data["subsonic-response"].album.song;
    document.getElementById("song-section").classList.remove("hidden");
    displaySongs(songs, "song-list");
  } catch (err) {
    console.error("Error fetching songs:", err);
  }
}

// ---- DISPLAY SONGS ----
function displaySongs(songs, containerId) {
  const list = document.getElementById(containerId);
  list.innerHTML = "";
  songs.forEach(song => {
    const div = document.createElement("div");
    div.classList.add("song");
    const isFav = isFavourite(song.id);
    div.innerHTML = `
      <img src="${API_URL}/getCoverArt.view?id=${song.coverArt || song.id}&${getAuthParams()}" alt="${song.title}">
      <div class="info">
        <div class="title">${song.title}</div>
        <div class="artist">${song.artist}</div>
      </div>
      <div class="song-actions">
        <button class="fav-btn">${isFav ? "❤️" : "🤍"}</button>
      </div>
    `;
    div.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavourite(song);
      displaySongs(songs, containerId);
    });
    div.addEventListener("click", () => playSong(song));
    list.appendChild(div);
  });
}

// ---- PLAYER ----
function playSong(song) {
  currentSong = song;
  const stream = `${API_URL}/stream.view?id=${song.id}&${getAuthParams()}`;
  audioPlayer.src = stream;
  audioPlayer.play();

  document.querySelector(".now-playing-cover").src = `${API_URL}/getCoverArt.view?id=${song.coverArt}&${getAuthParams()}`;
  document.querySelector(".song-title").textContent = song.title;
  document.querySelector(".song-artist").textContent = song.artist;
  document.getElementById("playPauseBtn").textContent = "⏸";

  updateFullPlayer(song);
  addToRecently(song);
}

document.getElementById("playPauseBtn").addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    document.getElementById("playPauseBtn").textContent = "⏸";
  } else {
    audioPlayer.pause();
    document.getElementById("playPauseBtn").textContent = "▶";
  }
});

audioPlayer.addEventListener("timeupdate", () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  document.querySelector(".progress-bar").style.width = `${progress}%`;
});

// ---- FULL PLAYER ----
const nowPlayingBar = document.querySelector(".now-playing-bar");
const fullPlayer = document.querySelector(".full-player");
const closePlayer = document.getElementById("closePlayer");

nowPlayingBar.addEventListener("click", () => {
  fullPlayer.classList.remove("hidden");
  setTimeout(() => fullPlayer.classList.add("show"), 10);
});
closePlayer.addEventListener("click", (e) => {
  e.stopPropagation();
  fullPlayer.classList.remove("show");
  setTimeout(() => fullPlayer.classList.add("hidden"), 400);
});

function updateFullPlayer(song) {
  document.getElementById("playerCover").src = `${API_URL}/getCoverArt.view?id=${song.coverArt}&${getAuthParams()}`;
  document.getElementById("playerTitle").textContent = song.title;
  document.getElementById("playerArtist").textContent = song.artist;
}

// ---- FAVOURITES & RECENTLY ----
function toggleFavourite(song) {
  const index = favourites.findIndex(f => f.id === song.id);
  if (index >= 0) favourites.splice(index, 1);
  else favourites.push(song);
  localStorage.setItem("favourites", JSON.stringify(favourites));
  displayFavourites();
}
function isFavourite(id) {
  return favourites.some(f => f.id === id);
}
function displayFavourites() {
  displaySongs(favourites, "favourite-list");
}
function addToRecently(song) {
  recentlyPlayed = recentlyPlayed.filter(s => s.id !== song.id);
  recentlyPlayed.unshift(song);
  if (recentlyPlayed.length > 10) recentlyPlayed.pop();
  localStorage.setItem("recently", JSON.stringify(recentlyPlayed));
  displayRecently();
}
function displayRecently() {
  displaySongs(recentlyPlayed, "recently-list");
}

// ---- NAVIGATION ----
document.getElementById("albumsTab").addEventListener("click", () => showSection("albums"));
document.getElementById("favouritesTab").addEventListener("click", () => showSection("favourites"));
document.getElementById("recentlyTab").addEventListener("click", () => showSection("recently"));

function showSection(section) {
  document.getElementById("album-list").classList.toggle("hidden", section !== "albums");
  document.getElementById("song-section").classList.toggle("hidden", section !== "albums");
  document.getElementById("favourite-section").classList.toggle("hidden", section !== "favourites");
  document.getElementById("recently-section").classList.toggle("hidden", section !== "recently");
  document.getElementById("sectionTitle").textContent =
    section === "albums" ? "Albums" : section === "favourites" ? "Favourites" : "Recently Played";
}

// ---- INIT ----
fetchAlbums();
displayFavourites();
displayRecently();