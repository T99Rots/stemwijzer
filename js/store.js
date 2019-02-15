import { createStore, combineReducers, connect } from './redux-clone.js';
import { app } from './reducers/app.js';
export {connect};

export const store = createStore(app);