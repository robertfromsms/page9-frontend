import {createStore, combineReducers} from 'redux'
import fetchReducer from './reducers/fetchReducer'

const rootReducer = combineReducers({
	fetchedInfo: fetchReducer
})

export default createStore(
	rootReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)