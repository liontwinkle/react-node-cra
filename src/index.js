/* eslint-disable import/extensions */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import 'pretty-checkbox/src/pretty-checkbox.scss';
import 'react-sortable-tree/style.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-tippy/dist/tippy.css';
import 'filepond/dist/filepond.css';
import 'handsontable/dist/handsontable.full.css';
import 'react-checkbox-tree-enhanced/lib/react-checkbox-tree.css';

import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/plugins/code_view.min.css';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/css/plugins/code_view.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror.js';

import 'codemirror/mode/xml/xml.js';
import './style.scss';

import store, { history } from './redux/store';
import App from './App';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
