const DEFAULT_CURRENT_TIME = '0:00';
const DEFAULT_TOTAL_TIME = '0:00';
const DEFAULT_PROGRESS = 0;
const DEFAULT_VOLUME_LEVEL = 50;
const PLAY_BUTTON_APPEARANCE = 'M18 12L0 24V0';
const PAUSE_BUTTON_APPEARANCE = 'M0 0h6v24H0zM12 0h6v24h-6z';
const VOLUME_LEVEL_ZERO = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
const VOLUME_LEVEL_MIDDLE = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
const VOLUME_LEVEL_FULL = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
const WRAPPER_NAME = '.ebook-audio-player-wrapper';
const PLAYER_NAME = '.ebook-audio-player';
const VOLUME_SLIDER_HEIGHT = 135;
const HTML_LAYOUT = `
<div class="ebook-audio-player">
    <div class="loading" style="display: none;">
        <div class="loading__spinner"></div>
    </div>

    <button class="play-pause-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24">
            <path fill="#566574" fill-rule="evenodd" d="M18 12L0 24V0" class="play-pause-btn__icon"></path>
        </svg>
    </button>

    <div class="controls">
        <span class="controls__current-time"></span>
        <input type="range" class="controls__progress-range" min="0" max="100">
        <span class="controls__total-time">3:00</span>
    </div>

    <div class="volume">
        <button class="volume__button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path class="volume__speaker" fill="#566574" fill-rule="evenodd" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z"></path>
            </svg>
        </button>
        <div class="volume__controls hidden bottom">                
            <div class="volume__slider" data-direction="vertical">
                <input type="range" class="volume__progress" min="0" max="100">
            </div>
        </div>
    </div>
</div>
`;

window.addEventListener("DOMContentLoaded", () => {
    initAudioPlayers();
});

function initAudioPlayers() {
    const playerWrappers = document.querySelectorAll(WRAPPER_NAME);

    for (let index = 0; index < playerWrappers.length; index++) {
        const audioPlayer = new AudioPlayerConstructor(playerWrappers[index]);

        audioPlayer.setCurrentTime(DEFAULT_CURRENT_TIME);
        audioPlayer.setTotalTime(DEFAULT_TOTAL_TIME);
        audioPlayer.setProgress(DEFAULT_PROGRESS);
        audioPlayer.setVolumeLevel(DEFAULT_VOLUME_LEVEL);
    }
};

class AudioPlayerConstructor {

    constructor(wrapperRef) {

        wrapperRef.innerHTML = HTML_LAYOUT;

        this.audioPlayerRef = wrapperRef.querySelector(PLAYER_NAME);
        this.id = this.generateId();
        this.src = wrapperRef.dataset.src;

        this.currentTimeRef = this.audioPlayerRef.querySelector('.controls__current-time');
        this.totalTimeRef = this.audioPlayerRef.querySelector('.controls__total-time');
        this.progressRef = this.audioPlayerRef.querySelector('.controls__progress-range');
        this.loaderRef = this.audioPlayerRef.querySelector('.loading');
        this.playPauseButtonRef = this.audioPlayerRef.querySelector('.play-pause-btn');
        this.controlsWrapperRef = this.audioPlayerRef.querySelector('.controls');
        this.playPauseButtonPath = this.playPauseButtonRef.querySelector('path');
        this.volumeButtonRef = this.audioPlayerRef.querySelector('.volume__button');
        this.volumeButtonPath = this.volumeButtonRef.querySelector('path');
        this.volumeControlsRef = this.audioPlayerRef.querySelector('.volume__controls');
        this.volumeLevelRef = this.audioPlayerRef.querySelector('.volume__progress');

        this.initListeners();
    }

    generateId() {
        const {x, y, top, left, right, bottom} = this.audioPlayerRef.getBoundingClientRect();
        const zIndex = getComputedStyle(this.audioPlayerRef)['zIndex'];

        return `${x}-${y}-${top}-${left}-${right}-${bottom}-${zIndex}`;
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
        this.setVolumeButtonView(level);
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
        const buttonAppearance = this.playPauseButtonPath.getAttribute('d');
    
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

    setVolumeSliderPosition() {
        const enoughBottomSpace = (this.audioPlayerRef.getBoundingClientRect().bottom + VOLUME_SLIDER_HEIGHT) < window.innerHeight;
    
        if(enoughBottomSpace) {
            this.volumeControlsRef.classList.add('bottom');
            this.volumeControlsRef.classList.remove('top');
        } else {
            this.volumeControlsRef.classList.add('top');
            this.volumeControlsRef.classList.remove('bottom');
        }
    }

    setVolumeButtonView(level) {
        switch (true) {
            case level >= 0 && level <= 5:
                this.volumeButtonPath.setAttribute('d', VOLUME_LEVEL_ZERO);
                break;

            case level > 5 && level <= 50:
                this.volumeButtonPath.setAttribute('d', VOLUME_LEVEL_MIDDLE);
                break;

            case level > 50 && level <= 100:
                this.volumeButtonPath.setAttribute('d', VOLUME_LEVEL_FULL);
                break;
        }
    }

    closeOtherVolumeSlider() {
        const openedVolumeSliderContainer = document.body.querySelector('.volume__controls.opened');
        const openedVolumeButton = document.body.querySelector('.volume__button.opened');
    
        if(openedVolumeSliderContainer && openedVolumeSliderContainer !== this.volumeControlsRef) {
            openedVolumeSliderContainer.classList.add('hidden');
            openedVolumeSliderContainer.classList.remove('opened');
        }
    
        if(openedVolumeButton && openedVolumeButton !== this.volumeButtonRef) {
            openedVolumeButton.classList.remove('opened');
        }
    
        document.removeEventListener('click', outsideVolumeHandler);
    }
};

function playPauseHandler() {
    const buttonAppearance = this.playPauseButtonPath.getAttribute('d');

    if(buttonAppearance === PLAY_BUTTON_APPEARANCE) {
        this.onPlayClicked();
    } else {
        this.onPauseClicked();
    }
}

function volumeClickHandler() {
    this.closeOtherVolumeSlider();

    this.volumeButtonRef.classList.toggle('opened');
    this.volumeControlsRef.classList.toggle('hidden');
    this.volumeControlsRef.classList.toggle('opened');
    this.setVolumeSliderPosition();

    if( this.volumeButtonRef.classList.contains('opened')) {
        setTimeout(() => {
            document.addEventListener('click', outsideVolumeHandler);
        })
    }
}

function progressChangesHandler(event) {
    this.onProgressChanged(+event.target.value);
}

function volumeLevelChangesHandler(event) {
    this.setVolumeButtonView(+event.target.value);
    this.onVolumeLevelClicked(+event.target.value);
}

function outsideVolumeHandler(event) {
    const volumeSliderClicked = event.target.classList.contains('volume__progress');
    const volumeSliderContainerClicked = event.target.classList.contains('volume__controls');

    if(!volumeSliderClicked && !volumeSliderContainerClicked) {
        const openedVolumeSliderContainer = document.body.querySelector('.volume__controls.opened');
        const openedVolumeButton = document.body.querySelector('.volume__button.opened');

        if(openedVolumeSliderContainer) {
            openedVolumeSliderContainer.classList.add('hidden');
            openedVolumeSliderContainer.classList.remove('opened');
        }

        if(openedVolumeButton) {
            openedVolumeButton.classList.remove('opened');
        }

        document.removeEventListener('click', outsideVolumeHandler);
    }
}