var EBOOK_AUDIO_PLAYER_ID = 'ebook-audio-player-1';
var DEFAULT_CURRENT_TIME = '0:00';
var DEFAULT_TOTAL_TIME = '0:00';
var DEFAULT_PROGRESS = 0;
var PLAY_BUTTON_PATH = 'M18 12L0 24V0';
var PAUSE_BUTTON_PATH = 'M0 0h6v24H0zM12 0h6v24h-6z';

var eBookAudioPlayer;

window.addEventListener("DOMContentLoaded", () => {
    initAudioPlayer();
});

function initAudioPlayer() {
    eBookAudioPlayer = new AudioPlayerConstructor(EBOOK_AUDIO_PLAYER_ID);

    eBookAudioPlayer.setCurrentTime(DEFAULT_CURRENT_TIME);
    eBookAudioPlayer.setTotalTime(DEFAULT_TOTAL_TIME);
    eBookAudioPlayer.setProgress(DEFAULT_PROGRESS);

    eBookAudioPlayer.initListeners();

    setTimeout(() => {
        eBookAudioPlayer.toggleLoading(true);
    }, 1000);

    setTimeout(() => {
        eBookAudioPlayer.toggleLoading(false);
    }, 5000);

};

function AudioPlayerConstructor(id) {
    this.audioPlayerRef = document.querySelector(`div[id=${id}]`);

    this.currentTimeRef = this.audioPlayerRef.querySelector('.controls__current-time');
    this.totalTimeRef = this.audioPlayerRef.querySelector('.controls__total-time');
    this.progressRef = this.audioPlayerRef.querySelector('.controls__progress.gap-progress');
    this.loaderRef = this.audioPlayerRef.querySelector('.loading');
    this.playPauseButtonRef = this.audioPlayerRef.querySelector('.play-pause-btn');
    this.controlsWrapperRef = this.audioPlayerRef.querySelector('.controls');
    this.playPauseButtonPath = this.playPauseButtonRef.querySelector('path');
};

AudioPlayerConstructor.prototype.setCurrentTime = setCurrentTime;
AudioPlayerConstructor.prototype.setTotalTime = setTotalTime;
AudioPlayerConstructor.prototype.setProgress = setProgress;
AudioPlayerConstructor.prototype.toggleLoading = toggleLoading;
AudioPlayerConstructor.prototype.initListeners = initListeners;
AudioPlayerConstructor.prototype.playClicked = playClicked;
AudioPlayerConstructor.prototype.pauseClicked = pauseClicked;


// time type: string
function setCurrentTime(time) {
    this.currentTimeRef.textContent = time;
};

// time type: string
function setTotalTime(time) {
    this.totalTimeRef.textContent = time;
};

// progress type: number
function setProgress(progress) {

    if(progress < 0) {
        progress = 0;
    }

    if(progress > 100) {
        progress = 100;
    }

    this.progressRef.style.width = progress + '%';
};

// loading type: boolean
function toggleLoading(loading) {
    if(loading) {
        this.loaderRef.style.display = 'block';
         this.playPauseButtonRef.disabled = true;
        this.controlsWrapperRef.classList.add('disabled');
    } else {
        this.loaderRef.style.display = 'none';
         this.playPauseButtonRef.disabled = false;
        this.controlsWrapperRef.classList.remove('disabled');
    }
};

function initListeners() {
    this.playPauseButtonRef.addEventListener('click', function () {

        var dAttribute = eBookAudioPlayer.playPauseButtonPath.getAttribute('d');

        if(dAttribute === PLAY_BUTTON_PATH) {
            eBookAudioPlayer.playPauseButtonPath.setAttribute('d', PAUSE_BUTTON_PATH);
            eBookAudioPlayer.playClicked();
        } else {
            eBookAudioPlayer.playPauseButtonPath.setAttribute('d', PLAY_BUTTON_PATH);
            eBookAudioPlayer.pauseClicked();
        }
    });
}

function playClicked() {
    //TODO place your logic here on play button clicked
}

function pauseClicked() {
    //TODO place your logic here on pause button clicked
}