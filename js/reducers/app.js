import {
  NAVIGATE
} from '../actions/app.js'

export const app = (state, action) => {
  switch(action.type) {
    case NAVIGATE:
      return {
        ...state,
        page: action.page
      }
    default:
      return state;
  }
}