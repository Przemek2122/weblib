// Created by Przemysław Wiewióra

"use strict";

/* All elements being shown or hidden*/
var ChangingElements = Array();
/* Menus */
var Menus = new Map();

window.onresize = OnSizeChanged;
function OnSizeChanged() {
    Menus.forValues(function(elem) {
        elem.OnWindowChanged();
    });
}

/**
 * $(querySelector)
 * @param {*} querySelector 
 * eg: #id or .css-class
 * $('#someid')
 */
function $(querySelector) { return document.querySelector(querySelector); }
Object.prototype.$ = function() { return document.querySelector(querySelector);}
/**
 * @param {*} time in MS
 */
Object.prototype.Show = function(time) { new ShownElement(this, time); }
/**
 * @param {*} time in MS
 */
Object.prototype.Hide = function(time) { new HidenElement(this, time); }

/**
 * Example ussage
 * array.remove(someItem)
 */
Array.prototype.remove = function() { 
    this.splice(arguments[0], 1); 
};
/**
 * Example ussage
 * array.removeIf(function(elem) { return true; })
 */
Array.prototype.removeIf = function() {
    for (let i = 0; i < this.length; i++) {
        if (arguments[0]) {
            this.remove(this[i]);
        }
    }
};
/**
 * array.for(function(elem) { console.log(elem); })
 * @param {*} callback -- function callback or function(elem) { // Do sth with ...(elem);}
 */
Array.prototype.for = function() {
    for (let i = 0; i < this.length; i++) {
        arguments[0](this[i]);
    }
};

/**
 * Iterate by keys
 */
Map.prototype.forKey = function() {
    for (let key of this.keys()) {
        arguments[0](key);
    }
};
/**
 * Iterate by values
 */
Map.prototype.forValues = function() {
    for (let value of this.values()) {
        arguments[0](value); 
    }
};

class Loading {
    constructor(element = $("#loader")) {
        this.element = element;
    }

    Start(time = 1000) {
        if (this.element)
        {
            Show(document.getElementById('loader'), time);
            document.body.style.overflow = "hidden"; 
        }
    }
    
    Stop(time = 1000) {
        if (this.element)
        {
            Hide(document.getElementById('loader'), time);
            document.body.style.overflow = "auto"; 
        } 
    }
}

/**
 * Class for making clickable menu.
 * Sample ussage: 
 * Create like this: var Menu = new MenuClickable($("#menu"));
 * Destroy like this:  Menu.destructor();
 * To make sure it's garbage collected: Menu = null;
 * 
 * How should menu look like?
 * nav
 *    div @element -- This element will be clickable
 *    a (link) -- This will hide / show on click
 *    a (link) -- This will hide / show on click
 * /nav
 * 
 * Important
 * Menu MUST HAVE AN ID
 */
class MenuClickable {
    constructor(element) {
        if (!element) {
            Log.l_Warn("MenuClickable: element isn't valid."); return;
        }

        this.element = element;
        this.elements = Array.from(element.parentElement.getElementsByTagName("a"));
        this.displayMethod = element.style.display;
        this.element.addEventListener( "click", this.OnClickedMenu );
        this.isOpened = true;
        Menus.set(this.GetID(), this);
    }
    destructor(){
        this.element.removeEventListener( "click", this.OnClickedMenu );
        Menus.delete(this.GetID());
    }

    /**
     * Called by event click
     * @param {e} event
     */
    OnClickedMenu(e) { GetMenu(e.target.id).SwitchMenu(e.target); }

    OnWindowChanged() {
        if (window.innerWidth > 800) {
            if (!this.isOpened)
                this.SwitchMenu();
        }
    }

    SwitchMenu() {
        if (this.isOpened){
            this.element.innerHTML = "[ ↑↑ ]";
            this.CloseMenu();
            this.isOpened = false;
        } else {
            this.element.innerHTML = "[ ↓↓ ]";
            this.OpenMenu();
            this.isOpened = true;
        }
    }

    OpenMenu() { this.OpenMenuHelper(); }
    OpenMenuHelper(){
        let display = this.displayMethod;

        this.elements.for(function(elem) {
            elem.style.display = display;
        });
    }

    CloseMenu() { this.CloseMenuHelper(); }
    CloseMenuHelper(){
        this.elements.for(function(elem) {
            elem.style.display = "none";
        });
    }

    GetID() { return this.element.id; }
}
function GetMenu(id) { return Menus.get(id); }

/* Use to check if scrolled below element with @id */
function IsPassedID(id) {
    let elementTarget = document.getElementById(id);

    if (!elementTarget){
        Log.l_Warn("ID: " + id + " not found!");
        return "ID: " + id + " not found!";
    }
    else if (window.scrollY > (elementTarget.offsetTop + elementTarget.offsetHeight)) 
        return true;
       
    return false;
}

/* Use to check if scroll is on element with @id */
function IsOnID(id) {
    let elementTarget = document.getElementById(id);

    if (!elementTarget){
        Log.l_Warn("ID: " + id + " not found!");
        return;
    }

    if (window.scrollY + window.innerHeight > elementTarget.offsetTop) 
        return true;
       
    return false;
}

/**
 * Remove css class from all element
 * @param {*} cssClass - Class to remove
 */
function RemoveClassByClass(cssClass) {
    let Selected = Array.from(document.getElementsByClassName(cssClass));

    Selected.for(function(entry){
        entry.classList.remove(cssClass);
    });
}

/**
 * Add css class to element
 * @param {*} id - Element id
 * @param {*} cssClass - Class to add
 */
function AddClassToID(id, cssClass) {
    let Elem = document.getElementById(id);
    if (Elem)
        document.getElementById(id).classList += cssClass;
    else
        Log.l_Warn("AddClassToID(id, cssClass) ID: " + id + " not found.");
        
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

/**
 * 
 */
class ChangingElement {
    constructor(element) {
        this.element = element;
        this.deleted = false;

        // Check if not exists already in array
        ChangingElements.for(function(elem){
            if (elem.element == element)
                elem.destructor();
        });

        // Than add
        ChangingElements.push(this);
    }
    /**
     * Remove itself from array and mark as deleted.
     */ 
    destructor() {
        this.deleted = true;
        ChangingElements.remove(this);
    }
}

/**
 * Class used to show element 
 * @see Object.prototype.Show(time) OR
 * @see function Show(element, time)
 */
class ShownElement extends ChangingElement {
    constructor(element, time){
        super(element);
        this.element,
        this.time = time;
        this.startTime = parseInt(new Date().getTime())

        // Make clickable
        element.style.pointerEvents = "auto";
    
        this.Slowly(this);
    } 

    Slowly(inClass) {
        if (this.deleted) { return }
        else if (new Date().getTime() < this.startTime + this.time ){
            let opacity = PercentTimeAscending(this.startTime, this.time);
            this.element.style.opacity = opacity;
            setTimeout(function() { inClass.Slowly(inClass) }, 25); // 25 is 40 times per sec
        } else {
            this.element.style.opacity = 1.0;
        }
    }
}

/**
 * Class used to show element 
 * @see Object.prototype.Hide(time) OR
 * @see function Hide(element, time)
 */
class HidenElement extends ChangingElement {
    constructor(element, time){
        super(element);
        this.element,
        this.time = time;
        this.startTime = parseInt(new Date().getTime())

        // Make unclickable (click transparent)
        element.style.pointerEvents = "none";
    
        this.Slowly(this);
    }
    
    Slowly(inClass) {
        if (this.deleted) { return }
        else if (new Date().getTime() < this.startTime + this.time ){
            let opacity = PercentTimeDescending(this.startTime, this.time);
            this.element.style.opacity = opacity;
            setTimeout(function() { inClass.Slowly(inClass) }, 25); // 25 is 40 times per sec
        } else {
            this.element.style.opacity = 0.0;
        }
    }
}

/**
 * Function use css opacity to show.
 * 
 * @param {*} element to show
 * @param {*} time in MS
 */
function Show(element, time) {
    if (element)
        new ShownElement(element, time);    
    else
        Log.l_Warn("function Show() element is NULL.");
}
/**
 * Function use css opacity to hide.
 * 
 * @param {*} element to hide
 * @param {*} time in MS
 */
function Hide(element, time) {
    if (element)
        new HidenElement(element, time);
    else
        Log.l_Warn("function Hide() element is NULL.");
}

function PercentTimeDescending(startTime, time) {
    return -(new Date().getTime() - startTime - time) / time;
}
function PercentTimeAscending(startTime, time) {
    return (new Date().getTime() - startTime) / time;
}

var Log = {
    l_Info(sth) { console.log("[lib.js]: " + sth); },
    l_Warn(sth) { console.warn("[lib.js]: " + sth); },
    l_Error(sth) { console.error("[lib.js]: " + sth); }
};

var Cookie = {
    /**
     * Sets cookie with
     * @param {*} cname  -- Cookie name
     * @param {*} cvalue -- Cookie value
     * @param {*} exdays -- Cokie expirations days
     */
    Set() {
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    /**
     * @param {*} cname returns cookie with name @cname
     */
    Get() {
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
};