// todo: скелетон лоадинг
// ? поиск песен (по алгоритму к примеру бинароному поиску)

import { formatSeconds } from './modules/additionalFunctions.js';
import { songs } from './modules/data.js';

window.addEventListener('DOMContentLoaded', () => {
	console.log('Привет! Я Егор - автор этого плеера. Если ты хочешь себе сайт, могу предложить свои услуги, посмотри мои работы на сайте портфолио(https://yegormurunov.gq). И если тебе понравится, обязательно напиши мне! 😉');
	// dom
	const dom = {
		skeleton: document.getElementById('skeleton'),
		player: document.getElementById('player'),
		audio: document.getElementById('audio'),
		poster: document.getElementById('audio-poster'),
		title: document.getElementById('audio-title'),
		author: document.getElementById('audio-author'),
		time: {
			currentTime: document.getElementById('audio-currentTime'),
			allTime: document.getElementById('audio-allTime'),
		},
		progressContainer: document.getElementById('audio-progressContainer'),
		progressBar: document.getElementById('audio-progressBar'),
		play: {
			btn: document.getElementById('audio-play'),
			icon: document.getElementById('audio-play').querySelector('i'),
		},
		volume: {
			input: document.getElementById('volume-input'),
			icon: document.getElementById('volume-icon'),
		},
		backward: document.getElementById('audio-backward'),
		forward: document.getElementById('audio-forward'),
		songNumber: {
			currentSong: document.getElementById('current-song'),
			numberOfSongs: document.getElementById('all-songs'),
		}
	}
	
	setTimeout(() => {
		dom.skeleton.classList.add('hidden');
		dom.player.classList.remove('hidden');
	}, 1000);

	// vars
	let isPlay = false;
	let isMute = false;
	let currentSong = 0;
	
	// render audio
	const renderAudio = (num) => {
		dom.audio.src = `assets/music/${songs[num].audio}`;
		dom.poster.src = `assets/posters/${songs[num].poster}`;
		dom.title.innerHTML = `${songs[num].title}`;
		dom.author.innerHTML = `${songs[num].author}`;
		dom.poster.alt = `${songs[num].title}`;
		dom.songNumber.currentSong.innerHTML = `${currentSong+1}`;
		dom.songNumber.numberOfSongs.innerHTML = `${songs.length}`;
	}
	renderAudio(currentSong);
	
	// functions
	const playPause = () => {
		isPlay ? pauseAudio() : playAudio();
		isPlay = !isPlay;
	}
	const playAudio = () => {
		dom.audio.play();
		dom.play.icon.classList.remove('fa-play');
		dom.play.icon.classList.add('fa-pause');
		dom.player.classList.add('play');
	}
	const pauseAudio = () => {
		dom.audio.pause();
		dom.play.icon.classList.remove('fa-pause');
		dom.play.icon.classList.add('fa-play');
		dom.player.classList.remove('play');
	}
	
	const stopAudio = () => {
		isPlay = false;
		dom.audio.pause();
		dom.audio.currentTime = 0;
		updateProgress();
	}
	
	const updateProgress = () => {
		let duration = dom.audio.duration;
		let currentTime = dom.audio.currentTime;
		dom.progressBar.style.width = `${(currentTime / duration) * 100}%`;
		updateTime(currentTime);
	}
	
	const updateTime = (seconds) => {
		dom.time.currentTime.innerHTML = `${formatSeconds(seconds)}`;
	}
	updateTime(0);
	const updateDuration = () => {
		dom.time.allTime.innerHTML = `${formatSeconds(dom.audio.duration)}`;
	}
	
	const rewindAudio = (e) => {
		let x = e.offsetX;
		let width = dom.progressContainer.offsetWidth;
		let duration = dom.audio.duration;
		dom.audio.currentTime = duration * (x/width);
	}
	const rewindSong = (currentSong) => {
		stopAudio();
		renderAudio(currentSong);
		isPlay = true;
		playAudio()
	}
	const prevSong = () => {
		dom.audio.currentTime >= 20 ? dom.audio.currentTime = 0
			:
				currentSong === 0 ? currentSong = songs.length-1 : currentSong--;
				rewindSong(currentSong);
	}
	const nextSong = () => {
		currentSong === songs.length-1 ? currentSong = 0 : currentSong++;
		rewindSong(currentSong);
	}
	
	const changeVolumeIcon = () => {
		if ( +dom.volume.input.value >= 70 ) {
			dom.volume.icon.className = 'fa-solid volume__icon fa-volume-high';
		} else if ( +dom.volume.input.value > 0 && +dom.volume.input.value <= 40 ) {
			dom.volume.icon.className = 'fa-solid volume__icon fa-volume-low';
		} else if ( +dom.volume.input.value == 0 ) { // if +dom.volume.input.value == 0
			dom.volume.icon.className = 'fa-solid volume__icon fa-volume-xmark';
		}
	}
	const changeVolume = () => {
		let value = dom.volume.input.value;
		dom.audio.volume = value * 0.01;
		changeVolumeIcon();
	}
	const volumeUp = () => {
		isMute = false;
		dom.volume.input.value = +dom.volume.input.value + 10;
		changeVolume();
	}
	const volumeDown = () => {
		dom.volume.input.value = +dom.volume.input.value - 10;
		changeVolume();
	}
	const mute = () => {
		isMute ? dom.volume.input.value = 10 : dom.volume.input.value = 0;
		changeVolume();
		isMute = !isMute;
	}
	
	const checkKey = (e) => {
		switch(e.keyCode) {
			case 32: // space
				e.preventDefault();
				playPause();
				break;
			case 37: // arrow left
				e.preventDefault();
				prevSong();
				break;
			case 39: // arrow right
				e.preventDefault();
				nextSong();
				break;
			case 38: // arrow up
				e.preventDefault();
				volumeUp();
				break;
			case 40: // arrow down
				e.preventDefault();
				volumeDown();
				break;
			case 77: // m
				e.preventDefault();
				mute();
				break;
			default:
				return;
		}
	}
	
	// call functions
	// btns navigation
	dom.play.btn.onclick = playPause;
	dom.backward.onclick = prevSong;
	dom.forward.onclick = nextSong;
	
	// video end
	dom.audio.onended = nextSong;
	
	// volume
	dom.volume.input.oninput = changeVolume;
	dom.volume.icon.onclick = mute;
	
	// time
	dom.audio.ontimeupdate = updateProgress;
	dom.progressContainer.onclick = rewindAudio;
	dom.audio.ondurationchange = updateDuration;
	
	// keyboard navigation
	window.addEventListener('keydown', checkKey);
});
