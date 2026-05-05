import { guid } from '@/utils/string.js';
import { closeMediaStream } from '@/utils/media.js';
import { getModel, OBJECT_TYPES } from '@/utils/detectionEngine.js';

export class Monitor {
  constructor() {
    this.id = guid();
    this.name = `Monitor ${this.id.slice(0, 8)}`;
    this.objType = OBJECT_TYPES.PERSON;
    this.$elem = null;
    this.$video = null;
    this.stream = null;
    this.cameraInfo = null;
    this.detecting = false;
  }

  setEl($el){
    this.$elem = $el;
    this.$video = this.$elem.querySelector('.monitor-feed');
    if(this.cameraInfo){
      this.startFeed();
    }
    return this;
  }

  setCameraInfo(cameraInfo){
    this.cameraInfo = cameraInfo;
    return this;
  }

  async startFeed(){
    console.log('startFeed', this.cameraInfo);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        deviceId: {
          exact: this.cameraInfo.deviceId,
        },
      },
    });
    this.$video.srcObject = stream;
    this.stream = stream;
    this._startDetectionLoop();
  }

  _stopDetectionLoop(){
    this.detecting = false;
    return this;
  }

  async _startDetectionLoop(){
    this._stopDetectionLoop();
    const detectionModel = await getModel();
    this.detecting = true;
    const detectLoop = async () => {
      if(!this.detecting){
        return;
      }
      
      if(!detectionModel || !this.$video?.videoWidth){
        setTimeout(detectLoop, 1000);
        return;
      }
      try {
        const predictions = await detectionModel.detect(this.$video, {
          objType: this.objType
        });
        console.log('predictions', predictions);
        window.requestAnimationFrame(detectLoop);
      } catch(err){
        console.error('detection error', err);
        setTimeout(detectLoop, 1000);
      }
    }
    detectLoop();
  }

  stopFeed(){
    this._stopDetectionLoop();
    if(this.stream){
      closeMediaStream(this.stream);
    }
    this.$video.srcObject = null;
    this.stream = null;
    return this;
  }


}