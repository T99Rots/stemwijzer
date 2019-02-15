import BaseElem from './base-element.js/index.js';

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
  render({progress}) {}

}