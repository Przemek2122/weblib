// Created by Przemysław Wiewióra

"use strict";

function StartLoading(time = 1000) {
    Show(document.getElementById('loader'), time);
    document.body.style.overflow = "hidden"; 
}

function StopLoading(time = 1000) {
    Hide(document.getElementById('loader'), time);
    document.body.style.overflow = "auto";  
}

/* @element to show
 * @time in ms 
 * function use css opacity to show. */
function Show(element, time) {
    ShowSlowly(element, time, parseInt(new Date().getTime()));
    element.style.pointerEvents = "auto";
}

/* Helper function. Don't call use Show(element, time) instead */
function ShowSlowly(element, time, startTime) {
    if (new Date().getTime() < startTime + time ){
        let opacity = (new Date().getTime() - startTime) / time;
        element.style.opacity = opacity;
        setTimeout(function() { ShowSlowly(element, time, startTime) }, 25); // 25 is 40 times per sec
    } else {
        element.style.opacity = 1.0;
    }
}

/* @element to hide
 * @time in ms 
 * function use css opacity to hide. */
function Hide(element, time) {
    HideSlowly(element, time, parseInt(new Date().getTime()));
    element.style.pointerEvents = "none";
}

/* Helper function. Don't call use Show(element, time) instead */
function HideSlowly(element, time, startTime) {
    if (new Date().getTime() < startTime + time ){
        let opacity = -(new Date().getTime() - startTime - time) / time;
        element.style.opacity = opacity;
        setTimeout(function() { HideSlowly(element, time, startTime) }, 25); // 25 is 40 times per sec
    } else {
        element.style.opacity = 0.0;
    }
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

function IsElementVisible(element) {
    return element.length > 0;
}

function RemoveInvisible() {
    let All = document.querySelectorAll( '*' );

    for (const elem of All.entries()){
        console.log(document.body.childElementCount);
    }

}