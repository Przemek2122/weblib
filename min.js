// Created by Przemysław Wiewióra

function StartLoading() {
    Show(document.getElementById('loader'), 1000);
    document.body.style.overflow = "hidden"; 
}

function StopLoading() {
    Hide(document.getElementById('loader'), 1000);
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
    }
}