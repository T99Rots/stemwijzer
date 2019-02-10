import BaseElem from './base-elem.js';

class StatementElem extends BaseElem {
  static get properties() {
    return [
      'title',
      'statement',
      'opinions'
    ];
  }
  
  static get html() {
    /*html*/
    return `
      <h1 data-id="title">Beep Beep Lettuce</h1>
    `
  }

  render({title, statement, opinions}) {
    if(title.changed) {
      title.element.innerText = title.value;
    }
    if(statement.changed) {
      statement.element.innerText = statement.value;
    }
    
  }
}

customElements.define('statement-elem', StatementElem);