import {createStore, combineReducers} from 'redux'
import fetchReducer from './reducers/fetchReducer'
import acReducer from './reducers/acReducer'

const rootReducer = combineReducers({
	fetchedInfo: fetchReducer,
	appcentricState: acReducer
})

export default createStore(
	rootReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)