export default class extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({mode: 'opened'});

    const observer = new MutationObserver(mutationList => {
      for(let mutation of mutationList) {

      }
      if(typeof this.render === 'function') {
        this.template()
      };
    })
    observer.observe(this,{
      attributes: true
    })


  }

  
}