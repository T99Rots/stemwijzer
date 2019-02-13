import BaseElem from './base-elem.js';
// import './into-element.js';
// import './statement-element.js';
// import './parties-element.js';
// import './results-element.js';

class StemwijzerApp extends BaseElem {
  static get properties() {
    return [
      'title',
      'statement',
      'opinions',
      'progress',
      'page'
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
        <ce-intro data-class="page" page="intro"></ce-intro>
        <ce-statement-container data-class="page" page="statement-container"></ce-statement-container>
        <ce-parties data-class="page" page="parties"></ce-parties>
        <ce-results data-class="page" page="results"></ce-results>
        <ce-results-overview data-class="page" page=""></ce-results-overview>
      </div>
    `
  }

  render({page}) {
    if(page.changed) {
      page.elements.forEach(element => {
        if(element.getAttribute('page') === page.value) {
          element.setAttribute('selected','')
        } else {
          element.removeAttribute('selected')
        }
      });
    }
  }
}

customElements.define('stemwijzer-app', StemwijzerApp);