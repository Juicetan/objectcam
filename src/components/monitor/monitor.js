import { guid } from '@/utils/string.js';
import { closeMediaStream } from '@/utils/media.js';

export class Monitor {
  static objTypes = {
    PERSON: 'person',
    DOG: 'dog',
    CAT: 'cat',
    BIRD: 'bird',
  }

  constructor() {
    this.id = guid();
    this.name = `Monitor ${this.id.slice(0, 8)}`;
    this.objType = Monitor.objTypes.PERSON;
    this.$elem = null;
    this.$video = null;
    this.stream = null;
    this.cameraInfo = null;
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
    return this;
  }

  stopFeed(){
    if(this.stream){
      closeMediaStream(this.stream);
    }
    this.$video.srcObject = null;
    this.stream = null;
    return this;
  }


}