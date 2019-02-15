import { BaseElement } from '../components/base-element.js';
import { store, connect } from '../store.js'
// import './into-element.js';
// import './statement-element.js';
// import './parties-element.js';
// import './results-element.js';


class StemwijzerApp extends connect(store)(BaseElement) {
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
          background: url('/img/background-1024.jpg');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          min-height: 100vh;
          width: 100%;
          font-family: Arial, Helvetica, sans-serif;
          --primary-color: rgb(1, 180, 220);
        }
        page-container {
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
        <intro-page data-class="page" page="intro"></intro-page>
        <statements-page data-class="page" page="statement-container"></statement-page>
        <parties-page data-class="page" page="parties"></parties-page>
        <results-page data-class="page" page="results"></results-page>
        <results-overview-page data-class="page" page=""></results-overview-page>
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
  stateChanged (state) {
    this._page = state.page;
  }
}

customElements.define('stemwijzer-app', StemwijzerApp);