import BaseElem from './base-elem.js';

class ProgressBar extends BaseElem {
  static get html() {
    return /*html*/`

    `
  }
  static get properties () {
    return [
      'progress'
    ]
  }
  render({progress}) 

}