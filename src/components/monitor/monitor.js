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
    this.$vidWrap = null;
    this.stream = null;
    this.cameraInfo = null;
    this.detecting = false;
    this.predictionBoxes = [];
  }

  setEl($el){
    this.$elem = $el;
    this.$video = this.$elem.querySelector('.monitor-feed');
    this.$vidWrap = this.$elem.querySelector('.canvas-wrap');
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

  stopFeed(){
    this._stopDetectionLoop();
    if(this.stream){
      closeMediaStream(this.stream);
    }
    this.$video.srcObject = null;
    this.stream = null;
    return this;
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
        this._renderPredictions(predictions);
        window.requestAnimationFrame(detectLoop);
      } catch(err){
        console.error('detection error', err);
        setTimeout(detectLoop, 1000);
      }
    }
    detectLoop();
  }

  _renderPredictions(predictions){
    this._clearPredictions();

    const vidResolution = {
      width: this.$video.videoWidth,
      height: this.$video.videoHeight,
    };
    const vidWrapDim = this.$vidWrap.getBoundingClientRect();
    const widthScale = vidWrapDim.width / vidResolution.width;
    const heightScale = vidWrapDim.height / vidResolution.height;

    predictions.forEach(prediction => {
      const { objType, confidence, position } = prediction;
      const { x, y, width, height } = position;
      const rect = document.createElement('div');
      rect.classList.add('prediction-box');
      rect.style.position = 'absolute';
      rect.style.left = `${x * widthScale}px`;
      rect.style.top = `${y * heightScale}px`;
      rect.style.width = `${width * widthScale}px`;
      rect.style.height = `${height}px`;
      
      const label = document.createElement('div');
      label.classList.add('pb-label');
      label.innerText = `${objType} ${Math.round(confidence*100)}%`;
      rect.appendChild(label);
      
      this.predictionBoxes.push(rect);
      this.$vidWrap.appendChild(rect);
    });
  }

  _clearPredictions(){
    this.predictionBoxes.forEach(box => {
      box.remove();
    });
    this.predictionBoxes = [];
    return this;
  }
}