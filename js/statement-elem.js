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