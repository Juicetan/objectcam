export class ForwarderConfig {
  constructor($el) {
    this.$elem = $el;
    this.isOpen = false;

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

    this.serviceType = 'watchercam';
  }

  open(){
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