const url = "http://localhost:3000/"
const onlineUrl = "https://pacific-thicket-17763.herokuapp.com/"

function genericGetFetch(urlAddition) {
	return (fetch(onlineUrl + urlAddition)
	    .then(response => response.json()))
}

function genericNonGetFetch(urlAddition, configObj) {
	return (fetch(onlineUrl + urlAddition, configObj)
	    .then(response => {
	    	debugger
	    	response.json()}))
}

export default {genericGetFetch: genericGetFetch, 
				genericNonGetFetch: genericNonGetFetch}