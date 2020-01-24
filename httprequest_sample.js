/* Request data from
 * url - file with data
 * returnFunction function similar to HandleRequest(response) */ 
function Request(url, returnFunction){
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
		if (Http.status != 200)
            console.log("File: " + url + " Not found.");
        if (Http.responseText)
            returnFunction(Http.responseText);
    }
}

/* Sample function for handling response from request. */
function HandleRequest(response){
    console.log(response);
}