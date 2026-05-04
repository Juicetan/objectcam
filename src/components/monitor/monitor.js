import { guid } from '@/utils/string.js';

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
    this.cameraInfo = null;
  }

  setEl($el){
    this.$elem = $el;
  }

  setCameraInfo(cameraInfo){
    this.cameraInfo = cameraInfo;
    return this;
  }
}