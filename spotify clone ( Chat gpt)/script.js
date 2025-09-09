console.log("Spotify Clone Loaded");

let audio = new Audio();
let songs = [
  "AZUL.mp3",
  "Lalkaara.mp3",
  "King Shit.mp3",
  "Excuses.mp3",
  "Mann Mera.mp3",
]; // <-- apne mp3 file names yahan likh do
let currentIndex = 0;

// Convert seconds to MM:SS format
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Render songs in sidebar
function renderSongList() {
  let songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";
  songs.forEach((song, i) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <div class="info">
        <div>${song}</div>
        <div class="text-grey">Artist</div>
      </div>
      <div class="playnow hover bright">
        <span>Play</span>
        <img class="invert" src="keshav/play.svg" alt="play">
      </div>
    `;
    li.addEventListener("click", () => playSong(i));
    songUL.appendChild(li);
  });
}

// Play selected song
function playSong(index) {
  currentIndex = index;
  audio.src = `songs/${songs[index]}`; // songs folder se load hoga
  audio.play();
  document.querySelector("#play").src = "keshav/pause.svg";
  document.querySelector(".songinfo").innerText = songs[index];
  document.querySelector(".songtime").innerText = `00:00 / ${formatTime(
    audio.duration
  )}`;
}

// Toggle play/pause
function togglePlay() {
  if (audio.paused) {
    audio.play();
    document.querySelector("#play").src = "keshav/pause.svg";
  } else {
    audio.pause();
    document.querySelector("#play").src = "keshav/play.svg";
  }
}

// Next/Previous controls
function nextSong() {
  if (currentIndex < songs.length - 1) playSong(currentIndex + 1);
}

function prevSong() {
  if (currentIndex > 0) playSong(currentIndex - 1);
}

// Seekbar update
function updateSeekbar() {
  let percent = (audio.currentTime / audio.duration) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  document.querySelector(".songtime").innerText = `${formatTime(
    audio.currentTime
  )} / ${formatTime(audio.duration)}`;
}

// Event Listeners
document.querySelector("#play").addEventListener("click", togglePlay);
document.querySelector("#next").addEventListener("click", nextSong);
document.querySelector("#previous").addEventListener("click", prevSong);

document.querySelector(".seekbar").addEventListener("click", (e) => {
  let percent =
    (e.offsetX / e.target.getBoundingClientRect().width) * audio.duration;
  audio.currentTime = percent;
});

audio.addEventListener("timeupdate", updateSeekbar);

// Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

document.querySelector(".close")?.addEventListener("click", () => {
  document.querySelector(".left").style.left = "-100%";
});

// Init
renderSongList();
if (songs.length > 0) playSong(0);

// Volume control
document.querySelector("input[name='volume']").addEventListener("input", (e) => {
  audio.volume = e.target.value / 100; // slider 0 - 100, audio.volume 0 - 1 hota hai
});

// Card play button functionality
document.querySelectorAll(".card .play").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // card ke dusre clicks ignore kare
    let card = btn.closest(".card");
    let song = card.getAttribute("data-song"); // data-song attribute se song naam lo
    if (song) {
      let index = songs.indexOf(song);
      if (index !== -1) {
        playSong(index);
      } else {
        console.warn("Song not found:", song);
      }
    }
  });
});
