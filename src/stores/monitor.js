import Alpine from 'alpinejs';
import { Monitor } from '@/components/monitor/monitor.js';

Alpine.store('monitor', {
  monitors: [],
  addMonitor(camera){
    const existingMonitor = this.monitors.find(m => m.cameraInfo?.deviceId === camera.deviceId);
    if(existingMonitor){
      return existingMonitor;
    }

    this.monitors.push(new Monitor().setCameraInfo(camera));
  }
});

export const monitorStore = Alpine.store('monitor');