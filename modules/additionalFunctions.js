export function formatSeconds(value) {
	let secondTime = parseInt(value);
	let minuteTime = 0;
	let hourTime = 0;
	if (secondTime > 60) {
		minuteTime = parseInt(secondTime / 60);
		secondTime = parseInt(secondTime % 60);
		if(minuteTime > 60) {
			hourTime = parseInt(minuteTime / 60);
			minuteTime = parseInt(minuteTime % 60);
		}
	}
	let result = `${minuteTime < 1 ? '00:': ''}${secondTime < 10 ? '0' : ''}` + parseInt(secondTime);

	if(minuteTime > 0) {
		result = `${minuteTime < 10 ? '0' : ''}` + parseInt(minuteTime) + ":" + result;
	}
	if(hourTime > 0) {
		result =  `${hourTime < 10 ? '0' : ''}` + parseInt(hourTime) + ":" + result;
	}
	return result;
}

function setHeight() {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setHeight();
window.addEventListener('resize', setHeight);