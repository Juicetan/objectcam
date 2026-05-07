import { closeMediaStream } from '@/utils/media.js';

export class CameraPicker {
  constructor($el) {
    this.$elem = $el;
    this.isOpen = false;

    this.cameras = [];
    this.isLoadingCameras = false;

    this.$elem.addEventListener('close', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if(this.isOpen){
        this.$elem.showModal();
      }
    });
    this.$elem.addEventListener('cancel', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
  }

  open(){
    this.refreshCameras();
    this.isOpen = true;
    this.$elem.classList.add('open');
    this.$elem.classList.remove('closing');
    this.$elem.showModal();
  }

  close(){
    this.isOpen = false;
    this.$elem.classList.remove('open');
    this.$elem.classList.add('closing');
    setTimeout(() => {
      this.$elem.classList.remove('closing');
      this.$elem.close();
    }, 200);
  }

  /**
   * Emit an event
   * @param {string} name 
   * @param {*} detail 
   * 
   * @example
   * this.#emitEvt('camera-selected', camera);
   */
  _emitEvt(name, detail) {
    this.$elem.dispatchEvent(new CustomEvent(name, { 
      detail,
      bubbles: false,
      composed: false
    }))
  }

  async refreshCameras(){
    // Force the user to grant permission to access the camera
    this.isLoadingCameras = true;
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.cameras = devices.filter(device => device.kind === 'videoinput');
        console.log('> cameras', this.cameras);
      } finally {
        closeMediaStream(stream);
      }
    } catch(e){
      console.error(e);
      App.toast('Error accessing cameras: ' + e.message, 'error');
    }
    this.isLoadingCameras = false;
  }

  /**
   * Select a camera and close the picker
   * @param {InputDeviceInfo} camera 
   * @param {string} objectType
   * @param {string} monitorName
   */
  selectCamera(camera, objectType, monitorName){
    this._emitEvt('camera-selected', {
      camera,
      objectType,
      monitorName,
    });
    this.close();
  }
}