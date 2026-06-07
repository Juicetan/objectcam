import { ConfigStore } from '@/stores/config.js';
import { apiFetch } from '@/utils/api.js';

export const toForwarderData = (snapshot) => {
  return {
    key: ConfigStore.storageKey,
    objType: snapshot.monitor.objType,
    imgDataURL: snapshot.imgDataURL,
    monitorId: snapshot.monitor.id,
    monitorName: snapshot.monitor.name,
    datetime: snapshot.datetime.toISOString(),
    predictions: snapshot.predictions,
  };
};

export const ForwarderStore = {
  _isForwarding: false,
  _throttleTimer: null,
  _heartbeatTimer: null,
  queue: [],
  _isHealthCheck: false,
  async forward(snapshot) {
    const fwdData = toForwarderData(snapshot);
    if(!ConfigStore.isFwdSet()){
      return;
    }

    this.queue.push(fwdData);
    this.process();
  },
  _throttle() {
    if(!this._throttleTimer){
      this._throttleTimer = setTimeout(() => {
        this._throttleTimer = null;
        this.process();
      }, 1000);
    }
  },
  async process() {
    if(this.queue.length === 0){
      return;
    }

    if(this._isForwarding){
      this._throttle();
      return;
    }

    this._isForwarding = true;
    const data = this.queue.shift();
    try{
      const response = await apiFetch(ConfigStore.forwarderUrl, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('> forward success', data, response);
    } catch(error){
      console.error('> forward error', error);
    } finally{
      this._isForwarding = false;
      this._throttle();
    }
  },
  initHealthCheck() {
    if(this._isHealthCheck || !ConfigStore.isFwdSet() || ConfigStore.serviceType !== 'watchercam'){
      return;
    }
    this._isHealthCheck = true;
    this.reportHeartbeat();
  },
  stopHealthCheck() {
    this._isHealthCheck = false;
    clearTimeout(this._heartbeatTimer);
  },
  async reportHeartbeat() {
    try{
      const response = await apiFetch(ConfigStore.WATCHERCAM_HEARTBEAT_URL, {
        method: 'POST',
        body: JSON.stringify({
          key: ConfigStore.storageKey
        }),
      });
      console.log('> reportHeartbeat success', response);
    } catch(error){
      console.error('> reportHeartbeat error', error);
    }
    this._heartbeatTimer = setTimeout(() => {
      if(this._isHealthCheck){
        this.reportHeartbeat();
      }
    }, 60000);
  },
}