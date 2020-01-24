// Created by Przemysław Wiewióra

"use strict";

/* All elements being shown or hidden*/
var ChangingElements = Array();

function StartLoading(time = 1000) {
    Show(document.getElementById('loader'), time);
    document.body.style.overflow = "hidden"; 
}

function StopLoading(time = 1000) {
    Hide(document.getElementById('loader'), time);
    document.body.style.overflow = "auto";  
}

/* Return position in array or false. */
function IsBeingChanged(element) {
    for (let i = 0; i < ChangingElements.length; i++)
    {
        if (ChangingElements[i] == element)
            return i;
    }
    return false;
}

function RemoveChangingByID(id) {
    ChangingElements.splice(id, 1);
}

/* @element to show
 * @time in ms 
 * function use css opacity to show. */
function Show(element, time) {
    element.style.pointerEvents = "auto";

    let id = IsBeingChanged(element);
    if (id != false)
        RemoveChangingByID(id);

    id = ChangingElements.push(element) - 1;

    ShowSlowly(element, time, parseInt(new Date().getTime()), id);
}

/* Helper function. Don't call use Show(element, time) instead */
function ShowSlowly(element, time, startTime, posID) {
    if (ChangingElements[posID] == element) {}
    else if (new Date().getTime() < startTime + time ){
        let opacity = (new Date().getTime() - startTime) / time;
        element.style.opacity = opacity;
        setTimeout(function() { ShowSlowly(element, time, startTime, posID) }, 25); // 25 is 40 times per sec
        return
    }
    element.style.opacity = 1.0;
    ChangingElements.splice(posID, 1);
}

/* @element to hide
 * @time in ms 
 * function use css opacity to hide. */
function Hide(element, time) {
    element.style.pointerEvents = "none";

    let id = IsBeingChanged(element);
    if (id != false)
        RemoveChaningByID(id);

    id = ChangingElements.push([element, true]) - 1;

    HideSlowly(element, time, parseInt(new Date().getTime()), id);
}

/* Helper function. Don't call use Show(element, time) instead */
function HideSlowly(element, time, startTime, posID) {
    if (ChangingElements[posID] == element) {}
    else if (new Date().getTime() < startTime + time ){
        let opacity = -(new Date().getTime() - startTime - time) / time;
        element.style.opacity = opacity;
        setTimeout(function() { HideSlowly(element, time, startTime, posID) }, 25); // 25 is 40 times per sec
        return;
    }
    element.style.opacity = 0.0;
    ChangingElements.splice(posID, 1);
}

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') 
            c = c.substring(1);
        if (c.indexOf(name) == 0) 
            return c.substring(name.length, c.length);
        
    }
    return "";
}// Created by Przemysław Wiewióra

"use strict";

/* All elements being shown or hidden*/
var ChangingElements = Array();

function StartLoading(time = 1000) {
    Show(document.getElementById('loader'), time);
    document.body.style.overflow = "hidden"; 
}

function StopLoading(time = 1000) {
    Hide(document.getElementById('loader'), time);
    document.body.style.overflow = "auto";  
}

/* Return position in array or false. */
function IsBeingChanged(element) {
    for (let i = 0; i < ChangingElements.length; i++)
    {
        if (ChangingElements[i] == element)
            return i;
    }
    return false;
}

function RemoveChangingByID(id) {
    ChangingElements.splice(id, 1);
}

/* @element to show
 * @time in ms 
 * function use css opacity to show. */
function Show(element, time) {
    element.style.pointerEvents = "auto";

    let id = IsBeingChanged(element);
    if (id != false)
        RemoveChangingByID(id);

    id = ChangingElements.push(element) - 1;

    ShowSlowly(element, time, parseInt(new Date().getTime()), id);
}

/* Helper function. Don't call use Show(element, time) instead */
function ShowSlowly(element, time, startTime, posID) {
    if (ChangingElements[posID] == element) {}
    else if (new Date().getTime() < startTime + time ){
        let opacity = (new Date().getTime() - startTime) / time;
        element.style.opacity = opacity;
        setTimeout(function() { ShowSlowly(element, time, startTime, posID) }, 25); // 25 is 40 times per sec
        return
    }
    element.style.opacity = 1.0;
    ChangingElements.splice(posID, 1);
}

/* @element to hide
 * @time in ms 
 * function use css opacity to hide. */
function Hide(element, time) {
    element.style.pointerEvents = "none";

    let id = IsBeingChanged(element);
    if (id != false)
        RemoveChaningByID(id);

    id = ChangingElements.push([element, true]) - 1;

    HideSlowly(element, time, parseInt(new Date().getTime()), id);
}

/* Helper function. Don't call use Show(element, time) instead */
function HideSlowly(element, time, startTime, posID) {
    if (ChangingElements[posID] == element) {}
    else if (new Date().getTime() < startTime + time ){
        let opacity = -(new Date().getTime() - startTime - time) / time;
        element.style.opacity = opacity;
        setTimeout(function() { HideSlowly(element, time, startTime, posID) }, 25); // 25 is 40 times per sec
        return;
    }
    element.style.opacity = 0.0;
    ChangingElements.splice(posID, 1);
}

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') 
            c = c.substring(1);
        if (c.indexOf(name) == 0) 
            return c.substring(name.length, c.length);
        
    }
    return "";
}