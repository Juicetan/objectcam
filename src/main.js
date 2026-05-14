import '@fortawesome/fontawesome-free/css/all.css'
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"
import Alpine from 'alpinejs';
import { monitorStore } from '@/stores/monitor.js';
import { CameraPicker } from '@/components/cameraPicker/cameraPicker.js';
import { ForwarderConfig } from '@/components/forwarderConfig/forwarderConfig.js';
import '@/styles/main.scss'
import { OBJECT_TYPES } from '@/utils/detectionEngine.js';
import { guid } from '@/utils/string.js';

window.App = {};
App.toast = function(msg, type, duration){
  type = type || 'normal';

  if(typeof msg === 'object'){
    try{
      msg = JSON.stringify(msg);
    } catch(e){
      console.log('> toast stringify fail', e);
    }
  }

  var opt = {
    text: msg,
    gravity: 'bottom',
    duration: 3000,
  };
  if(type === 'error'){
    opt.backgroundColor = '#b20000';
    opt.duration = 7000;
  } else{
    opt.backgroundColor = '#0c94f2';
    opt.duration = 3000;
  }
  if(duration){
    opt.duration = duration;
  }

  Toastify(opt).showToast();
}


Alpine.data('app', () => ({
  monitorStore: monitorStore,
  objectTypes: Object.keys(OBJECT_TYPES).map(key => OBJECT_TYPES[key]),
  comps: {
    cameraPicker: new CameraPicker(document.querySelector('.camera-picker')),
    forwarderConfig: new ForwarderConfig(document.querySelector('.forwarder-config')),
  },
  utils: {
    guid: guid,
  },
  fn: {
    handleCameraSelected({camera, objectType, monitorName}){
      console.log('> camera selected', camera, objectType);
      monitorStore.addMonitor(camera, objectType, monitorName);
    }
  }
}));

Alpine.start();
