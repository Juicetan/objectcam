import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"
import Alpine from 'alpinejs';
import { monitorStore } from '@/stores/monitor.js';
import { CameraPicker } from '@/components/cameraPicker/cameraPicker.js';
import '@/styles/main.scss'

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
  comps: {
    cameraPicker: new CameraPicker(document.querySelector('.camera-picker')),
  },
  fn: {
    handleCameraSelected(camera){
      console.log('> camera selected', camera);
      monitorStore.addMonitor(camera);
    }
  }
}));

Alpine.start();
