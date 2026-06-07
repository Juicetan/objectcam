import IDBStore from '@/utils/idb';
import Deferred from '@/models/deferred';

const deferredReady = new Deferred();
const configStore = new IDBStore();
  
export const ConfigStore = {
  WATCHERCAM_HEARTBEAT_URL: 'https://api.watchercam.com/health',
  WATCHERCAM_REPORT_URL: 'https://api.watchercam.com/snapshot',
  ready: deferredReady.promise,
  forwarderUrl: '',
  storageKey: '',
  serviceType: '',
  isFwdSet(){
    return (this.serviceType === 'watchercam' && this.storageKey) || (this.serviceType === 'custom' && this.forwarderUrl);
  },
  hydrate(){
    const fwdUrlFetch = configStore.getItem('forwarderUrl').then(url => {
      this.forwarderUrl = url;
    });
    const storageKeyFetch = configStore.getItem('storageKey').then(key => {
      this.storageKey = key;
    });
    const serviceTypeFetch = configStore.getItem('serviceType').then(type => {
      this.serviceType = type;
    });
    return Promise.allSettled([
      fwdUrlFetch,
      storageKeyFetch,
      serviceTypeFetch,
    ]).then(() => {
      deferredReady.resolve();
    });
  },
  persist(){
    const fwdUrlPersist = configStore.setItem('forwarderUrl', this.forwarderUrl);
    const storageKeyPersist = configStore.setItem('storageKey', this.storageKey);
    const serviceTypePersist = configStore.setItem('serviceType', this.serviceType);
    return Promise.allSettled([
      fwdUrlPersist,
      storageKeyPersist,
      serviceTypePersist,
    ])
  },
  reset(){
    this.forwarderUrl = '';
    this.storageKey = '';
    this.serviceType = '';
    return this.persist();
  },
}
