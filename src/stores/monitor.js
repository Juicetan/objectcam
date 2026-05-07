import Alpine from 'alpinejs';
import { Monitor } from '@/components/monitor/monitor.js';
import { removeObject } from '@/utils/array.js';

Alpine.store('monitor', {
  monitors: [],
  snapshots: [],
  addMonitor(camera){
    const existingMonitor = this.monitors.find(m => m.cameraInfo?.deviceId === camera.deviceId);
    if(existingMonitor){
      return existingMonitor;
    }

    const monitor = new Monitor().setCameraInfo(camera);
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