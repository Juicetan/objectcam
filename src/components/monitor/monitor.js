import { guid } from '@/utils/string.js';
import { closeMediaStream } from '@/utils/media.js';
import { getModel, OBJECT_TYPES } from '@/utils/detectionEngine.js';

export class Monitor {
  constructor(opts = {}) {
    this.id = guid();
    this.name = opts.name || `Monitor ${this.id.slice(0, 4)}`;
    this.objType = opts.objType || OBJECT_TYPES.PERSON;
    this.$elem = null;
    this.$video = null;
    this.$vidWrap = null;
    this.stream = null;
    this.cameraInfo = opts.cameraInfo || null;
    this.detecting = false;
    this.predictionBoxes = [];
    this.lastPredictionCount = 0;
    this.evtListeners = [];
  }

  get displayName(){
    return `${this.name} (${this.objType})`;
  }
  
  get renderScale(){
    const vidResolution = {
      width: this.$video.videoWidth,
      height: this.$video.videoHeight,
    };
    const vidWrapDim = this.$vidWrap.getBoundingClientRect();
    return {
      width: vidWrapDim.width / vidResolution.width,
      height: vidWrapDim.height / vidResolution.height,
    };
  }

  setObjectType(objectType){
    this.objType = objectType;
    return this;
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

  on(event, callback){
    this.evtListeners.push({ event, callback });
    return this;
  }

  off(event, callback){
    this.evtListeners = this.evtListeners.filter(listener => listener.event !== event || listener.callback !== callback);
    return this;
  }

  _emit(event, data){
    this.evtListeners.forEach(listener => {
      if(listener.event === event){
        listener.callback(data);
      }
    });
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
        if(predictions.length > this.lastPredictionCount){
          const snapshot = this._snapshot(predictions);
          console.log('snapshot', snapshot);
          this._emit('snapshot', snapshot);
        }
        this.lastPredictionCount = predictions.length;
        this._renderPredictions(predictions);
        setTimeout(detectLoop, 100);
      } catch(err){
        console.error('detection error', err);
        setTimeout(detectLoop, 1000);
      }
    }
    detectLoop();
  }

  _renderPredictions(predictions){
    this._clearPredictions();

    const scale = this.renderScale;
    
    predictions.forEach(prediction => {
      const { objType, confidence, position } = prediction;
      const { x, y, width, height } = position;
      const rect = document.createElement('div');
      rect.classList.add('prediction-box');
      rect.style.position = 'absolute';
      rect.style.left = `${x * scale.width}px`;
      rect.style.top = `${y * scale.height}px`;
      rect.style.width = `${width * scale.width}px`;
      rect.style.height = `${height * scale.height}px`;
      
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

  _snapshot(predictions){
    const canvas = document.createElement('canvas');
    canvas.width = this.$video.videoWidth;
    canvas.height = this.$video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.$video, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    predictions.forEach(prediction => {
      const { objType, confidence, position } = prediction;
      const { x, y, width, height } = position;
      
      ctx.strokeRect(x, y, width, height);

      const label = `${objType} ${Math.round(confidence*100)}%`;
      const textDim = ctx.measureText(label);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(x, y, textDim.width + 40, 22 + 10);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(label, x + 10, y + 20);
    });

    return {
      monitor: this,
      datetime: new Date(),
      predictions: predictions,
      imgDataURL: canvas.toDataURL('image/webp', 0.85),
    };
  }
}