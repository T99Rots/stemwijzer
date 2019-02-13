export default class extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this._shadowRoot = this.attachShadow({mode: 'open'});
    const html = this.constructor.html;
    const props = this.constructor.properties;
    this.__renderScheduled = false;
    let changedProps = {};
    const elements = this._elems = {};

    if(Array.isArray(props)) {

      if(typeof html === 'string') {
        shadowRoot.innerHTML = html;
        const dataElements = shadowRoot.querySelectorAll('[data-class]');
        for(let elem of dataElements) {
          elem.getAttribute('data-class').split(' ').forEach(attr => {
            if(Array.isArray(elements[attr])) {
              elements[attr].push(elem);
            } else {
              elements[attr] = [elem];
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
            if(!this.__renderScheduled) {
              this.__renderScheduled = true;
              requestAnimationFrame(() => {
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