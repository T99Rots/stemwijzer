const randomString = () => Math.random().toString(36).substring(7).split('').join('.');

const ActionTypes = {
  INIT: `@@redux/INIT${randomString()}`,
  REPLACE: `@@redux/REPLACE${randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
}

export const createStore = (reducer, state) => {
	if(typeof reducer !== 'function') {
		throw new Error('Reducer must be a function');
	}

	const subscribers = [];

	let subscriberUpdateScheduled  = false;

	const store = {
    __state: state,
		dispatch: (action) => {
			if(typeof action !== 'object') {
				throw new Error('Action must be a Object');
			}
			if(typeof action.type !== 'string') {
				throw new Error('Property type of action is either missing or not a string');
			}
			state = reducer(state, action);
			if(!subscriberUpdateScheduled) {
				subscriberUpdateScheduled = true;
				setTimeout(() => {
					subscriberUpdateScheduled = false;
					for(let subscriber of subscribers) {
						subscriber();
					}
				});
			}
		},
		getState: () => {
			return state;
		},
		subscribe: (subscriber) => {
			if(typeof subscriber === 'function') {
				subscribers.push(subscriber);
      }
      return () => {
        const index = subscribers.indexOf(subscriber);
        if(!(index === -1)) {
          subscribers.splice(index,1);
        }
      }
		},
		replaceReducer: (nextReducer) => {
			if(typeof nextReducer !== 'function') {
				throw new Error('Reducer must be a function');
			}
			reducer = nextReducer;
		}
	}
	store.dispatch({
    type: ActionTypes.INIT
  });

	return store;
}

export const combineReducers = (reducers) => {
	if(typeof reducers !== 'object') {
		throw new Error('Reducers must be a Object');
	}
	for(let reducer in reducers) {
		if(typeof reducer !== 'function') {
			throw new Error('All properties of reducers must be a function');
		} 
	}
	return (state, action) => {
		const newState = {...state};
		for(let reducer in reducers) {
			newState[reducer] = reducers[reducer](newState[reducer], action);
		}
		return newState;
	}
}

export const connect = (store) => (BaseElement) => class extends BaseElement {
  connectedCallback() {
    if(super.connectedCallback) {
      super.connectedCallback();
      this.__storeUnsubscribe = store.subscribe(() => this.stateChanged(store.getState()));
    }
  }
  disconnectedCallback() {
    this.__storeUnsubscribe();
    if(super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}