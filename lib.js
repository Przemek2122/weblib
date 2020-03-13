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
 * //////////
 * PROTOTYPES
 * //////////
 */


/**
 * Returns value between min and max.
 * Bigger or equal min to smaller than max.
 * @param {*} min 
 * @param {*} max 
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * Returns value between min to max.
 * Bigger or equal min to smaller or equal max. 
 * @param {*} min 
 * @param {*} max 
 */
function getRandomIntInc(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * $(querySelector)
 * @param {*} querySelector 
 * eg: #id or .css-class
 * $('#someid')
 */
function $(querySelector) { return document.querySelector(querySelector); }1
Object.prototype.$ = function() { return this.querySelector(arguments[0]);}
/**
 * @param {*} cssRule - Rule you want to get.
 */
Object.prototype.getStyle = function() {
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
        strValue = document.defaultView.getComputedStyle(this, "").getPropertyValue(arguments[0]);
    }
    else if(this.currentStyle){
        arguments[0] = arguments[0].replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
        strValue = this.currentStyle[arguments[0]];
    }
    return strValue;
}
/**
 * @param {*} time in MS
 */
Object.prototype.Show = function() { new ShownElement(this, arguments[0]); }
/**
 * @param {*} time in MS
 */
Object.prototype.Hide = function() { new HidenElement(this, arguments[0]); }

/**
 * Iterate through letters in string
 */
String.prototype.for = function() {
    for (var i = 0; i < this.length; i++) {
        arguments[0](this.charAt(i));
    }
}
/**
 * Iterate through letters (reversed). Starts from rear.
 */
String.prototype.forRev = function(elem) {
    let i = this.length;
    while (i--) {
        arguments[0](this.charAt(i));
    }
}

/**
 * Check if array contains element
 */
Array.prototype.contains = function() { 
    for (let i = 0; i < this.length; i++) {
        if (arguments[0] == this[i])
            return true;
    }
    return false;
};
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
 * Iterate map with key and value.
 */
Map.prototype.for = function() {
    this.forEach( function(value, key, map) { 
        arguments[0](value, key, map);
    });
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


/**
 * /////////
 * FUNCTIONS
 * /////////
 */


/**
 * Brings sleep to JS.
 * Shouldn't be used on main thread.
 * @param {*} milliseconds How long?
 */
function Sleep(milliseconds = 0) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

/**
 * Usage:
 * Delay(2000).then(() => { console.log("World!"); });
 * @param {*} ms How long to wait before executing?
 */
function Delay(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calling again will reset timer.
 * Usefull for blocking too much clicking (SPAM)
 * Requires variable handle.
 * @param {*} handle Variable used to retrigger
 * @param {*} ms Timer like in normal delay
 * @param {*} callback function() { console.log(); }
 */
function ReTriggerableDelay(handle, ms, callback) {
    if (handle.isHandle != true) {
        handle.isHandle = true;
    } else {
        clearTimeout(handle.timeout);
    }

    handle.timeout = setTimeout(function(){ 
        ReTriggerableDelay(handle, ms, callback); 
    }, ms);
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

function RemovePX(numWithPXs) {
    return( parseInt( numWithPXs.replace('px',''), 10) ); 
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

function JsonToWordsMap(json_data) {
    // What is json?
    // {
    //      "whatdata": "data",
    //      "tag": "data"
    // }

    let map = new Map();
    let isData = true;
    let add = false;
    let data = "";
    let tag = "";

    for(let i in json_data){
        // Start
        if (json_data[i] == '{')
        { }
        else if (json_data[i] == '}')
        {
            if (data != "" && tag != "")
                map.set(tag, data);
        }
        // Word start
        else if (json_data[i] == '"') // Word start or end
        { 
            add = !add;
        }
        // Now data ( "tag": "data" )
        else if (json_data[i] == ':')
        {
            isData = false;
        }
        // End of line
        else if (json_data[i] == ',')
        {
            if (data != "" && tag != "")
                map.set(tag, data);
                
            isData = true;
            add = false;
            data = "";
            tag = "";
        }
        // Normal data
        else
        {
            if (!add)
                continue;

            if (isData)
                tag += json_data[i];
            else
                data += json_data[i];
        }
    }

    return map;
}

function PercentTimeDescending(startTime, time) {
    return -(new Date().getTime() - startTime - time) / time;
}
function PercentTimeAscending(startTime, time) {
    return (new Date().getTime() - startTime) / time;
}


/**
 * ///////
 * CLASSES
 * ///////
 */


class BasicObject {
    constructor(element = this.getDefaultElement()) {
        this.element = element;
        this.deleted = false;
        this.oncreated();
    }

    /**
     * Call to "destroy" this class
     */
    destructor() { 
        this.deleted = true; 
        this.ondestroyed();
    }

    /**
     * Default element if nothing passed in constructor.
     */
    getDefaultElement() {
        Log.l_Error("getDefaultElement() is empty and element is not valid in constructor.");
        return $("elem");
    }

    /**
     * Called by constructor
     */
    oncreated() { }
    
    /**
     * Called by destructor
     */
    ondestroyed() { }
}

class Delegate {
    constructor() {
        this.functions = Array();
    }

    Add(func) {
        this.functions.push(func);
    }

    Broadcast(params) {
        this.functions.for( function(func) {
            func(params);
        });
    }

    Clear(func) {
        this.functions = Array();
    }
}

class Loading extends BasicObject {
    getDefaultElement() { return $("#loader"); }

    Show(time = 1000) {
        if (this.element)
        {
            Show(this.element, time);
            document.body.style.overflow = "hidden"; 
        }
    }
    
    Hide(time = 1000) {
        if (this.element)
        {
            Hide(this.element, time);
            document.body.style.overflow = "auto"; 
        } 
    }
}

class StaticFooter extends BasicObject { 
    getDefaultElement() { return $("footer"); }

    oncreated() {
        let tClass = this;
        this.onChange(tClass);

        window.onresize = function(event) {
            tClass.onChange(tClass);
        };
    }

    onChange(tClass) {
        var bodyHeight = document.body.offsetHeight;
        var vwptHeight = window.innerHeight;
        var gap = vwptHeight - bodyHeight;

        if (vwptHeight > bodyHeight)
        {
            tClass.lockBottom(tClass);
            console.log("StaticFooter - Lock");
        }
        else
        {
            tClass.unlockBottom(tClass);
            console.log("StaticFooter - Unlock");
        }
    }

    lockBottom(tClass) {
        tClass.position = tClass.element.style.position;
        tClass.bottom = tClass.element.style.bottom;
        tClass.width = tClass.element.style.width;
        tClass.element.style.position = 'absolute';
        tClass.element.style.bottom = '0';
        tClass.element.style.width = "calc(100% - " + tClass.getOffset() + ")";
    }

    unlockBottom(tClass) {
        tClass.element.style.position = tClass.position;
        tClass.element.style.bottom = tClass.bottom;
        tClass.element.style.width = tClass.width;
    }

    getOffset() {
        return "8%";
    }
}

/**
 * Class for making clickable menu.
 * Sample ussage: 
 * Create like this: var Menu = new MenuClickable($("#menu"));
 * Destroy like this:  Menu.destructor();
 * To make sure it's garbage collected: Menu = null;
 * (Destroy only if needed)
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
class MenuClickable extends BasicObject {
    getDefaultElement() { return $("#menu"); }
    
    oncreated() {       
        this.elements = Array.from(this.element.parentElement.getElementsByClassName("navbtn"));
        this.displayMethod = this.element.style.display;
        this.element.addEventListener( "click", this.OnClickedMenu );
        this.isOpened = true;
        Menus.set(this.GetID(), this);
    }
    
    ondestroyed() {
        this.element.removeEventListener( "click", this.OnClickedMenu );
        Menus.delete(this.GetID());
    }

    /**
     * @param {e} event from click
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
            this.element.innerHTML = "↓↓";
            this.CloseMenu();
            this.isOpened = false;
        } else {
            this.element.innerHTML = "↑↑";
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
/**
 * Helper function for MenuClickable class
 * @param {id} id 
 */
function GetMenu(id) { return Menus.get(id); }

/**
 * Cookies info element
 */
class CookieInfoElement extends BasicObject {
    getDefaultElement() { return $("#cookieinfo"); }
    constructor(element) {
        super(element);

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
        super.destructor();
        ChangingElements.remove(this);
    }
}

/**
 * Base class for changing elements like
 * ShownElement or HidenElement
 * Delegate onFinish
 */
class ChangingElement extends BasicObject {
    constructor(element) {
        super(element);
        this.onFinish = new Delegate();

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
        super.destructor();
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
        try { element.style.pointerEvents = "auto"; } catch {}
        
        this.Slowly(this);
    } 

    Slowly(inClass) {
        if (this.deleted) { return }
        else if (new Date().getTime() < this.startTime + this.time ) {
            // (loop - every frame ...)
            let opacity = PercentTimeAscending(this.startTime, this.time);
            this.element.style.opacity = opacity;
            setTimeout(function() { inClass.Slowly(inClass) }, 25); // 25 is 40 times per sec
        } else {
            // Finish
            this.element.style.opacity = 1.0;
            this.onFinish.Broadcast();
        }
    }
}

/**
 * Class used to show element 
 * @see Object.prototype.Hide(time) OR
 * @see function Hide(element, time) 
 * has event this.onFinish = new Event('finish');
 * 
 * NOTE: I know spelling is hard ...
 */
class HidenElement extends ChangingElement {
    constructor(element, time){
        super(element);
        this.element,
        this.time = time;
        this.startTime = parseInt(new Date().getTime())

        // Make unclickable (click transparent)
        try { element.style.pointerEvents = "none"; } catch {}
    
        this.Slowly(this);
    }
    
    Slowly(inClass) {
        if (this.deleted) { return }
        else if (new Date().getTime() < this.startTime + this.time ) {
            // (loop - every frame ...)
            let opacity = PercentTimeDescending(this.startTime, this.time);
            this.element.style.opacity = opacity;
            setTimeout(function() { inClass.Slowly(inClass) }, 25); // 25 is 40 times per sec
        } else {
            // Finish
            this.element.style.opacity = 0.0;
            this.onFinish.Broadcast();
        }
    }
}


/**
 * //////////
 * NAMESPACES
 * //////////
 */


var Log = {
    l_Info(sth) { console.log("[lib.js]: " + sth); },
    l_Warn(sth) { console.warn("[lib.js]: " + sth); },
    l_Error(sth) { console.error("[lib.js]: " + sth); }
};

var Cookie = {
    /**
     * Sets cookie with
     * @param {*} name   Cookie name
     * @param {*} value  Cookie value
     * @param {*} exdays  Cokie expirations days
     */
    Set(name, value, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },

    /**
     * @param {*} cname returns cookie with name @cname
     */
    Get(cname) {
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