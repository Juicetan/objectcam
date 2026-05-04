import Alpine from 'alpinejs';
import { Monitor } from '@/components/monitor/monitor.js';
import { removeObject } from '@/utils/array.js';

Alpine.store('monitor', {
  monitors: [],
  addMonitor(camera){
    const existingMonitor = this.monitors.find(m => m.cameraInfo?.deviceId === camera.deviceId);
    if(existingMonitor){
      return existingMonitor;
    }

    this.monitors.push(new Monitor().setCameraInfo(camera));
  },
  removeMonitor(monitor){
    monitor.stopFeed();
    removeObject(this.monitors, monitor);
  },
});

export const monitorStore = Alpine.store('monitor');