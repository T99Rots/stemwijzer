export default class extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this._shadowRoot = this.attachShadow({mode: 'opened'});
    const html = this.constructor.html;
    const props = this.constructor.properties;
    this.__renderScheduled = true;
    const changedProps = {};

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

      this.defineProperties(this, props.reduce((obj, prop) => ({
        ...obj,
        [prop]: {
          get: () => {
            return this[`__${prop}`];
          },
          set: value => {
            changedProps[prop] = {
              newValue: value,
              oldValue: changedProps[prop] || this[`__${prop}`] 
            }
            this[`__${prop}`] = value;
            if(!this.__renderScheduled) {
              this.__renderScheduled = true;
              requestAnimationFrame(() => {
                if(typeof this.render === 'function') {
                  this.render(props.reduce((obj, prop) => {
                    const changed = prop in changedProps;
                    const propObj = {
                      ...obj,
                      element: elements[prop],
                      changed
                    }
                    if(changed) {
                      return {
                        ...propObj,
                        ...changedProps[prop]
                      }
                    }
                    return propObj
                  },{}));
                  changedProps = {};
                  this.__renderScheduled = false;
                }
              })
            }
          }
        }
      })), {});

      const observer = new MutationObserver(mutationList => {
        for(let mutation of mutationList) {
          if(mutation.type == 'attributes'&&props.includes(mutation.attributeName)) {
            this[mutation.attributeName] = mutation.newValue;
          }
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
}