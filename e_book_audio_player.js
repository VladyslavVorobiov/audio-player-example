var EBOOK_AUDIO_PLAYER_ID = 'ebook-audio-player-1';
var DEFAULT_CURRENT_TIME = '0:00';
var DEFAULT_TOTAL_TIME = '0:00';
var DEFAULT_PROGRESS = 0;
var DEFAULT_VOLUME_LEVEL = 50;
var PLAY_BUTTON_APPEARANCE = 'M18 12L0 24V0';
var PAUSE_BUTTON_APPEARANCE = 'M0 0h6v24H0zM12 0h6v24h-6z';

var eBookAudioPlayer;

window.addEventListener("DOMContentLoaded", () => {
    initAudioPlayer();
});

function initAudioPlayer() {
    eBookAudioPlayer = new AudioPlayerConstructor(EBOOK_AUDIO_PLAYER_ID);

    eBookAudioPlayer.setCurrentTime(DEFAULT_CURRENT_TIME);
    eBookAudioPlayer.setTotalTime(DEFAULT_TOTAL_TIME);
    eBookAudioPlayer.setProgress(DEFAULT_PROGRESS);
    eBookAudioPlayer.setVolumeLevel(DEFAULT_VOLUME_LEVEL);

    eBookAudioPlayer.initListeners();

    // showcase loading:
    // setTimeout(() => {
    //     eBookAudioPlayer.toggleLoading(true);
    // }, 1000);

    // setTimeout(() => {
    //     eBookAudioPlayer.toggleLoading(false);
    // }, 5000);

};

class AudioPlayerConstructor {

    constructor(id){
        this.audioPlayerRef = document.querySelector(`div[id=${id}]`);

        this.currentTimeRef = this.audioPlayerRef.querySelector('.controls__current-time');
        this.totalTimeRef = this.audioPlayerRef.querySelector('.controls__total-time');
        this.progressRef = this.audioPlayerRef.querySelector('.controls__progress-range');
        this.loaderRef = this.audioPlayerRef.querySelector('.loading');
        this.playPauseButtonRef = this.audioPlayerRef.querySelector('.play-pause-btn');
        this.controlsWrapperRef = this.audioPlayerRef.querySelector('.controls');
        this.playPauseButtonPath = this.playPauseButtonRef.querySelector('path');
        this.volumeButtonRef = this.audioPlayerRef.querySelector('.volume__button');
        this.volumeControlsRef = this.audioPlayerRef.querySelector('.volume__controls');
        this.volumeLevelRef = this.audioPlayerRef.querySelector('.volume__progress');
    }

    // time type: string like '2:59'
    setCurrentTime(time) {
        this.currentTimeRef.textContent = time;
    }

    // time type: string like '10:00'
    setTotalTime(time) {
        this.totalTimeRef.textContent = time;
    }

    // progress type: number between 0 and 100
    setProgress(progress) {
        this.progressRef.value = progress;
    }

    // level type: number between 0 and 100
    setVolumeLevel(level) {
        this.volumeLevelRef.value = level;
    }

    // loading type: boolean
    toggleLoading(loading) {
        if(loading) {
            this.loaderRef.style.display = 'block';
            this.playPauseButtonRef.disabled = true;
            this.progressRef.disabled = true;
            this.controlsWrapperRef.classList.add('disabled');
        } else {
            this.loaderRef.style.display = 'none';
            this.playPauseButtonRef.disabled = false;
            this.progressRef.disabled = false;
            this.controlsWrapperRef.classList.remove('disabled');
        }
    }

    togglePlayPauseButton() {
        var buttonAppearance = this.playPauseButtonPath.getAttribute('d');
    
        if(buttonAppearance === PLAY_BUTTON_APPEARANCE) {
            this.playPauseButtonPath.setAttribute('d', PAUSE_BUTTON_APPEARANCE);
        } else {
            this.playPauseButtonPath.setAttribute('d', PLAY_BUTTON_APPEARANCE);
        }
    }
    
    initListeners() {
        this.playPauseButtonRef.addEventListener('click', playPauseHandler.bind(this));
        this.volumeButtonRef.addEventListener('click', volumeClickHandler.bind(this));
        this.progressRef.addEventListener('change', progressChangesHandler.bind(this));
        this.volumeLevelRef.addEventListener('change', volumeLevelChangesHandler.bind(this));
    }
    
    removeListeners() {
        this.playPauseButtonRef.removeEventListener('click', playPauseHandler);
        this.volumeButtonRef.removeEventListener('click', volumeClickHandler);
        this.progressRef.removeEventListener('change', progressChangesHandler);
        this.volumeLevelRef.removeEventListener('change', volumeLevelChangesHandler);
    }

    onPlayClicked() {
        //TODO place your logic here on play button clicked
        this.togglePlayPauseButton();
    }
    
    onPauseClicked() {
        //TODO place your logic here on pause button clicked
        this.togglePlayPauseButton();
    }
    
    // progress type: number between 0 and 100
    onProgressChanged(progress) {
        //TODO place your logic here on progress changed
    }
    
    // level type: number between 0 and 100
    onVolumeLevelClicked(level) {
        //TODO place your logic here on volume level clicked
    }

};

function playPauseHandler() {
    var buttonAppearance = this.playPauseButtonPath.getAttribute('d');

    if(buttonAppearance === PLAY_BUTTON_APPEARANCE) {
        this.onPlayClicked();
    } else {
        this.onPauseClicked();
    }
}

function volumeClickHandler() {
    this.volumeButtonRef.classList.toggle('opened');
    this.volumeControlsRef.classList.toggle('hidden');
}

function progressChangesHandler(event) {
    this.onProgressChanged(+event.target.value);
}

function volumeLevelChangesHandler(event) {
    this.onVolumeLevelClicked(+event.target.value);
}
