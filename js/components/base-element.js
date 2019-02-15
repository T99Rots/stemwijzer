const ElementsList = class extends Array {
  constructor(...elements) {
    super(...elements)
  }
  text (value) {
    for(let elem of this) {
      elem.innerText = value;
    }
  }
}

export class BaseElement extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this._shadowRoot = this.attachShadow({mode: 'open'});
    const html = this.constructor.html;
    const props = this.constructor.properties;
    this.__renderScheduled = false;
    this.__changedProps = {};
    this.__firstRender = true;
    this.__connected = false;
    const elements = this.__elems = {};

    if(Array.isArray(props)) {

      if(typeof html === 'string') {
        shadowRoot.innerHTML = html;
        const dataElements = shadowRoot.querySelectorAll('[data-class]');
        for(let elem of dataElements) {
          elem.getAttribute('data-class').split(' ').forEach(attr => {
            if(Array.isArray(elements[attr])) {
              elements[attr].push(elem);
            } else {
              elements[attr] = new ElementsList(elem);
            }
          });
        }
      }
      let propertyListeners = {};
      for(let property of props) {
        propertyListeners[property] = {
          get: () => {
            return this[`__${property}`];
          },
          set: value => {
            changedProps[property] = {
              newValue: value,
              oldValue: (changedProps[property]&&changedProps[property].oldValue) || this[`__${property}`] || null
            }
            this[`__${property}`] = value;
            if(typeof this.shouldRender === 'function') {
              if(!this.shouldRender()) {
                return;
              }
            }
            this.requestUpdate();
          }
        }
      }
      Object.defineProperties(this,propertyListeners);

      const observer = new MutationObserver(mutationList => {
        for(let mutation of mutationList) {
          if(mutation.type == 'attributes'&&props.includes(mutation.attributeName)) {
            console.log(mutation);
            this[mutation.attributeName] = mutation.newValue;
          }
        }
      })
      observer.observe(this,{
        attributes: true
      })
    }
  }
  connectedCallback() {
    this.__connected = true;
    if(this.__firstRender) {
      if(typeof this.firstUpdate === 'function') {
        this.firstUpdate();
      }
      this.__firstRender = false;
      this.performUpdate();
    } else if (this.__renderScheduled) {
      this.performUpdate();
    }
  }
  disconnectedCallback() {
    this.__connected = false;
  }
  get elements () {
    return this.__elems;
  }
  requestUpdate() {
    if(!this.__renderScheduled) {
      this.__renderScheduled = true;
      if(this.__connected) requestAnimationFrame(this.performUpdate());
    }
  }
  performUpdate () {
    const props = this.constructor.properties;
    if(typeof this.render === 'function') {
      const dataObj = {};
      for(let property of props) {
        console.log(property);
        const changed = property in changedProps;
        dataObj[property] = {
          changed,
          elements: elements[property] || null,
          value: this[`__${property}`] || null
        }
        if(changed) {
          dataObj[property] = {
            ...dataObj[property],
            ...changedProps[property]
          }
        }
      }
      try {
        this.render(dataObj);
      } catch (err) {
        console.error(err);
      }
      changedProps = {};
    }
    this.__renderScheduled = false;
  }
}

export const bind = (...dataObjects) => {
  for(let dataObject of dataObjects) {
    if(dataObject.changed) {
      dataObject.elements.text(dataObject.value);
    }  
  }
}