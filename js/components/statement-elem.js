import { BaseElem, bind } from './base-element.js';

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
    bind(
      title,
      statement
    )
  }
}

customElements.define('statement-elem', StatementElem);