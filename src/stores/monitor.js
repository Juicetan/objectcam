import Alpine from 'alpinejs';
import { Monitor } from '@/components/monitor/monitor.js';
import { removeObject } from '@/utils/array.js';

Alpine.store('monitor', {
  monitors: [],
  snapshots: [],
  addMonitor(camera, objectType, monitorName){
    const existingMonitor = this.monitors.find(m => m.name === monitorName);
    if(existingMonitor){
      App.toast('Monitor already exists', 'error');
      return existingMonitor;
    }

    const monitor = new Monitor({
      cameraInfo: camera,
      name: monitorName,
    });
    if(objectType){
      monitor.setObjectType(objectType);
    }

    monitor.on('snapshot', (snapshot) => {
      this.snapshots.push(snapshot);
    });
    this.monitors.push(monitor);
  },
  removeMonitor(monitor){
    monitor.stopFeed();
    removeObject(this.monitors, monitor);
  },
});

export const monitorStore = Alpine.store('monitor');