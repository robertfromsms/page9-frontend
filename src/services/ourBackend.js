const url = "http://localhost:3000/"

function genericGetFetch(urlAddition) {
	return (fetch(url + urlAddition)
	    .then(response => response.json()))
}

function genericNonGetFetch(urlAddition, configObj) {
	return (fetch(url + urlAddition, configObj)
	    .then(response => response.json()))
}

export default {genericGetFetch: genericGetFetch, 
				genericNonGetFetch: genericNonGetFetch}