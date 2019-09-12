const beforeFetched = {
	exchangesData: null,
	wantHaveData: null,
	haveMatchData: null,
	wantMatchData: null,
	userDetailsData: null
}

export default (state = beforeFetched, action) => {
	switch (action.type) {
		case 'FETCH_EXCHANGES_DATA': {
			return {...state, exchangesData: action.exchangesData}
		}
		case 'FETCH_WANTHAVE_DATA': {
			return {...state, wantHaveData: action.wantHaveData}
		}
		case 'FETCH_HAVE_MATCH_DATA': {
			return {...state, haveMatchData: action.haveMatchData}
		}
		case 'FETCH_WANT_MATCH_DATA': {
			return {...state, wantMatchData: action.wantMatchData}
		}
		case 'FETCH_USER_DETAILS_DATA': {
			return {...state, userDetailsData: action.userDetailsData}
		}
		case 'ADD_THIS_CARD': {
			const card = action.card
			if (card.wantHaveRemoved === "buy") {
				const list = state.wantHaveData.users[0].wantList
				let newList = [{id: card.id, productName: card.productName, productImagePath: card.productImagePath, additionalInfo: card.additionalInfo}, ...list]
				let newState = {...state}
				newState.wantHaveData.users[0].wantList = newList
				return newState
			}
			else if (card.wantHaveRemoved === "sell") {
				const list = state.wantHaveData.users[0].haveList
				let newList = [{id: card.id, productName: card.productName, productImagePath: card.productImagePath, additionalInfo: card.additionalInfo, listingPrice: card.listingPrice}, ...list]
				let newState = {...state}
				newState.wantHaveData.users[0].haveList = newList
				return newState
			}
			else {
				return state
			}
		}
		case 'DELETE_THIS_CARD': {
			const card = action.card
			const wantList = state.wantHaveData.users[0].wantList
			const haveList = state.wantHaveData.users[0].haveList
			if (wantList.findIndex((cardInList) => cardInList.id === card.id) !== -1) {
				let list = [...state.wantHaveData.users[0].wantList]
				const index = list.findIndex((cardInList) =>  cardInList.id === card.id )
				list.splice(index,1)
				let newState = {...state}
				newState.wantHaveData.users[0].wantList = list
				return newState
			}
			else if (haveList.findIndex((cardInList) => cardInList.id === card.id) !== -1) {
				let list = [...state.wantHaveData.users[0].haveList]
				const index = list.findIndex((cardInList) =>  cardInList.id === card.id )
				list.splice(index,1)
				let newState = {...state}
				newState.wantHaveData.users[0].haveList = list
				return newState
			}
			else {
				return state
			} 
		}
		default: {
			return state
		}
	}
}