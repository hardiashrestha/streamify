console.log("Welcome to Shrestha Stream");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    {songName: "Winning Speech - Karan Aujla", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Bachke Bachke - Karan Aujla (Unplugged)", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
    {songName: "52 Bars - Karan Aujla", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "No Loss - Kr$na", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
    {songName: "I Guess - Kr$na", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
    {songName: "Dusk till Dawn - Zayn & Sia", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
    {songName: "Bilionera - Otilia", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
    {songName: "Williow Tree - NCS", filePath: "songs/8.mp3", coverPath: "covers/8.jpg"},
    {songName: "Soni Soni - Darshan Raval", filePath: "songs/9.mp3", coverPath: "covers/9.jpg"},
    {songName: "You and Me - Shubh", filePath: "songs/10.mp3", coverPath: "covers/10.jpg"},
]

songItems.forEach((element, i)=>{ 
    element.getElementsByTagName("img")[0].src = songs[i].coverPath; 
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName; 
})

// Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
})

// Listen to Events
audioElement.addEventListener('timeupdate', ()=>{ 
    // Update Seekbar
    progress = parseInt((audioElement.currentTime/audioElement.duration)* 100); 
    myProgressBar.value = progress;
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
})

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })
}

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click', (e)=>{ 
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        audioElement.src = `songs/${songIndex+1}.mp3`;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    })
})

document.getElementById('next').addEventListener('click', ()=>{
    if(songIndex>=9){
        songIndex = 0
    }
    else{
        songIndex += 1;
    }
    audioElement.src = `songs/${songIndex+1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
})

document.getElementById('previous').addEventListener('click', ()=>{
    if(songIndex<=0){
        songIndex = 0
    }
    else{
        songIndex -= 1;
    }
    audioElement.src = `songs/${songIndex+1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
})

// Spotify API integration
document.getElementById('searchButton').addEventListener('click', searchSong);

function searchSong() {
  const searchTerm = document.getElementById('searchInput').value;
  const apiUrl = `https://v1.nocodeapi.com/youtoob/spotify/VzKUxSDpJlNmJUYx/browse/categories${searchTerm}&type=track`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Clear previous search results
      document.getElementById('searchResults').innerHTML = '';

      // Loop through the search results and create HTML elements
      data.tracks.items.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('searchResult');

        const coverElement = document.createElement('img');
        coverElement.src = track.album.images[0].url;
        coverElement.alt = 'Album Cover';

        const titleElement = document.createElement('h3');
        titleElement.textContent = track.name;

        const artistElement = document.createElement('p');
        artistElement.textContent = track.artists[0].name;

        const durationElement = document.createElement('p');
        durationElement.textContent = formatDuration(track.duration_ms);

        const playButton = document.createElement('button');
        playButton.textContent = 'Play';
        playButton.addEventListener('click', () => playSong(track.preview_url));

        trackElement.appendChild(coverElement);
        trackElement.appendChild(titleElement);
        trackElement.appendChild(artistElement);
        trackElement.appendChild(durationElement);
        trackElement.appendChild(playButton);

        document.getElementById('searchResults').appendChild(trackElement);
      });
    })
    .catch(error => console.error(error));
}

function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

function playSong(previewUrl) {
  audioElement.src = previewUrl;
  audioElement.play();
  masterPlay.classList.remove('fa-play-circle');
  masterPlay.classList.add('fa-pause-circle');
}
