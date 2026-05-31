import { ConfigStore } from '@/stores/config.js';
import { randomAlphanumeric } from '@/utils/string.js';

export class ForwarderConfig {
  constructor($el) {
    this.$elem = $el;
    this.isOpen = false;
    this.cfg = {
      serviceType: '', // watchercam, custom
      forwarderUrl: '',
      storageKey: '',
    };

    this.$elem.addEventListener('close', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if(this.isOpen){
        this.$elem.showModal();
      }
    });
    this.$elem.addEventListener('cancel', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
  }

  open(){
    ConfigStore.ready.then(() => {
      this.cfg.serviceType = ConfigStore.serviceType;
      this.cfg.forwarderUrl = ConfigStore.forwarderUrl;
      this.cfg.storageKey = ConfigStore.storageKey;
      if(!this.cfg.serviceType){
        this.cfg.serviceType = 'watchercam';
      }
      if(!this.cfg.storageKey){
        this.cfg.storageKey = randomAlphanumeric(10);
      }
    });
    this.isOpen = true;
    this.$elem.classList.add('open');
    this.$elem.classList.remove('closing');
    this.$elem.showModal();
  } 

  close(){
    this.isOpen = false;
    this.$elem.classList.remove('open');
    this.$elem.classList.add('closing');
    setTimeout(() => {
      this.$elem.classList.remove('closing');
      this.$elem.close();
    }, 200);
  }

  save(){
    ConfigStore.serviceType = this.cfg.serviceType;
    ConfigStore.forwarderUrl = this.cfg.forwarderUrl;
    ConfigStore.storageKey = this.cfg.storageKey;
    ConfigStore.persist().then(() => {
      App.toast('Snapshot forwarding configured');
      this._emitEvt('config-saved');
    });
    this.close();
  }

  /**
   * Emit an event
   * @param {string} name 
   * @param {*} detail 
   * 
   * @example
   * this.#emitEvt('camera-selected', camera);
   */
  _emitEvt(name, detail) {
    this.$elem.dispatchEvent(new CustomEvent(name, { 
      detail,
      bubbles: false,
      composed: false
    }))
  }
}