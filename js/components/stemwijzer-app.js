import BaseElem from './base-elem.js';
import './into-element.js';
import './statement-element.js';
import './parties-element.js';
import './results-element.js';

class StemwijzerApp extends BaseElem {
  static get properties() {
    return [
      'title',
      'statement',
      'opinions',
      'progress'
    ];
  }
  
  static get html() {
    /*html*/
    return `
      <style>
        :host {
          width: 1255px;
          height: 800px;
          background: white;
          display: block;
        }
        [data-class="page"] {
          display: none;
        }
        [data-class="page"][selected] {
          display: block;
        }
      </style>

      <div id="page-container">
        <ce-intro data-class="page" selected></ce-intro>
        <ce-statement-container data-class="page"></ce-statement>
        <ce-parties data-class="page"></ce-parties>
        <ce-results data-class="page"></ce-results>
        <ce-results-overview data-class="page"></ce-results-overview>
      </div>
    `
  }

  render() {
    if(title.changed) {
      title.element.innerText = title.value;
    }
    if(statement.changed) {
      statement.element.innerText = statement.value;
    }
    
  }
}

customElements.define('stemwijzer-app', StemwijzerApp);