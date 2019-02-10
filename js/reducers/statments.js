const INITIAL_STATE = {
  statements: [],
  currentStatement: 0,
  progress: 0,
  statementsCount: 0,
  answers: []
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SET_STATEMENTS:
      return {
        ...state,
        statements: action.statements,
        statementsCount: action.statements
      }
    case NAVIGATE:
      return {
        ...state,
        currentStatement: action.index,
        progress: action.index / state.statementsCount || 0
      }
    case SET_ANSWER:
      return {
        ...state,
        answers: state.answers[action.index] = action.answer
      }
  }
}