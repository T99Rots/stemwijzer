export default class extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this._shadowRoot = this.attachShadow({mode: 'open'});
    const html = this.constructor.html;
    const props = this.constructor.properties;
    this.__renderScheduled = false;
    let changedProps = {};

    if(Array.isArray(props)) {

      if(typeof html === 'string') {
        shadowRoot.innerHTML = html;
        this.elements = props.reduce((obj, prop) => {
          const elem = shadowRoot.querySelector(`[data-id=${prop}]`);
          if(elem) {
            return {
              ...obj,
              [prop]: elem
            }
          } else {
            return obj
          }
        }, {})
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
              oldValue: (changedProps[property]&&changedProps[property].oldValue) || this[`__${property}`] 
            }
            this[`__${property}`] = value;
            if(!this.__renderScheduled) {
              this.__renderScheduled = true;
              requestAnimationFrame(() => {
                if(typeof this.render === 'function') {
                  const dataObj = {};
                  for(let property of props) {
                    const changed = property in changedProps;
                    dataObj[property] = {
                      changed,
                      element: this.elements[property],
                      value
                    }
                    if(changed) {
                      dataObj[property] = {
                        ...dataObj[property],
                        ...changedProps[property]
                      }
                    }
                  }
                  this.render(dataObj);
                  changedProps = {};
                  this.__renderScheduled = false;
                }
              })
            }
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
}