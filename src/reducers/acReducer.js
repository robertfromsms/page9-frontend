const defaultState = {
	loading: true
}

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'LOADING': {
			return {loading: true}
		}
		case 'STOP_LOADING': {
			return {loading: false}
		}
		default: {
			return state
		}
	}
}