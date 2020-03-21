// Created by Przemysław Wiewióra

"use strict";

/* All elements being shown or hidden*/
var ChangingElements = Array();
/* Menus */
var Menus = new Map();
/* Draggable elements */
/* Draggable elementsd */
var Draggables = new Map();

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
    let strValue = "";
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
    for (let i = 0; i < this.length; i++) {
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
 * array.removeIf( function(elem) { return true; } )
 * array.removeIf( / function returning condition / } )
 * returns how many elements have been removed, 0 otherwise
 */
Array.prototype.removeIf = function() {
    let remElems = 0;

    for( let i = 0; i < this.length; i++) { 
        if ( arguments[0](this[i]) ) 
        { this.splice(i, 1); i--; remElems++; }
    }

    return remElems;
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
 * Coppies str to user clipboard
 * @param {*} str string to coppy
 */
function CopyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

/**
 * @param {*} perc range 0 - 1 where 0 means 0% and 1 means 100%
 */
function GetPercentWidthPX(perc) {
    return window.width * perc;
}

/**
 * @param {*} perc range 0 - 1 where 0 means 0% and 1 means 100%
 */
function GetPercentHeightPX(perc) {
    return window.height * perc;
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
    let isInWord = false;
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
            isInWord = !isInWord;
        }
        // Now data ( "tag": "data" )
        else if (json_data[i] == ':')
        {
            isData = false;
        }
        // End of line
        else if (json_data[i] == ',' && !isInWord)
        {
            if (data != "" && tag != "")
                map.set(tag, data);
                
            isData = true;
            isInWord = false;
            data = "";
            tag = "";
        }
        // Normal data
        else
        {
            if (!isInWord)
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
    }

    /**
     * Call to "destroy" this class
     */
    destructor() { 
        this.deleted = true; 
    }

    /**
     * Default element if nothing passed in constructor.
     */
    getDefaultElement() {
        Log.l_Error("getDefaultElement() is empty and element is not valid in constructor.");
        return $("elem");
    }
}

class Delegate {
    constructor() {
        this.functions = Array();
    }

    /**
     * Add new function to delegate
     * @param {*} func function
     * this function can have single parameter
     */
    Add(func) {
        this.functions.push(func);
    }

    /**
     * Execute all function in delegate with possibe
     * @param {*} params parameters
     */
    Broadcast(params) {
        this.functions.for( function(func) {
            func(params);
        });
    }

    /**
     * Clear deletgate.
     * Remove all functions.
     */
    Clear() {
        this.functions = Array();
    }
}

/**
 * JS Request
 */
class RequestData extends BasicObject {
    constructor(url, type = "GET") {
        super();
        this.Http = new XMLHttpRequest();
        this.Http.open(type, url);
        this.Http.send();
        this.onFinished = new Delegate();

        this.Http.onreadystatechange = (e) => {
            if (this.Http.status != 200 && this.Http.status != 0) {
                Log.l_Error("File: " + url + " Not found. Http.status: " + this.Http.status);
                this.destructor();
            }
            else if (this.Http.responseText)
            {
                this.onFinished.Broadcast(this.Http.responseText);
                this.destructor();
            }
        }
    }

    destructor() {
        super.destructor();
        this.Http.abort(); // Close request
        this.Http = null;
    }

    getDefaultElement() { return null; }
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

/**
 * @param {*} element 
 * @param {*} isVisible Is visible by default?
 */
class DraggableObject extends BasicObject { 
    getDefaultElement() { return null; }
    constructor(element, isVisible = true) {
        super(element);
        if (this.element)
        {
            // Bind
            Draggables.set(this.element.id, this);
            this.isVisible = isVisible;
            (isVisible) ? element.style.display = 'block' : element.style.display = 'none';
            this.element.onmousedown = this.dragMouseDown;
            this.pos1 = 0, this.pos2 = 0, this.pos3 = 0, this.pos4 = 0;
        }
        else
        {
            Log.l_Warn("DraggableObject not found. Element is empty.");
        }
    }

    destructor() {
        super.destructor();
        Draggables.delete(this.element.id);
    }
    
    dragMouseDown(e) {
        let tClass = GetDraggable(this.id);

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        tClass.pos3 = e.clientX;
        tClass.pos4 = e.clientY;
        document.onmouseup = tClass.closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = tClass.elementDrag;
    }

    elementDrag(e) {
        let tClass = GetDraggable(e.srcElement.id);
        if (!tClass)
            tClass = GetDraggable(e.srcElement.parentNode.id);

        if (!tClass) { return; }

        e = e || window.event;
        e.preventDefault();

        // Calculate the new cursor position:
        tClass.pos1 = tClass.pos3 - e.clientX;
        tClass.pos2 = tClass.pos4 - e.clientY;
        tClass.pos3 = e.clientX;
        tClass.pos4 = e.clientY;

        // Set the element's new position:
        tClass.element.style.top = (tClass.element.offsetTop - tClass.pos2) + "px";
        tClass.element.style.left = (tClass.element.offsetLeft - tClass.pos1) + "px";
    }
    
    closeDragElement() {
        // Stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    //getDefaultOffset() { return 50, 50; } // Perc 50 -> 50%
    
    toggle() {
        if (this.isVisible)
            this.hide();
        else
            this.show();
    }

    show() {
        if (this.isVisible) return;
        else this.isVisible = !this.isVisible;

        let showElem = new ShownElement(this.element, 800);

        this.element.style.display = 'block';
    }

    hide() {
        if (!this.isVisible) return;
        else this.isVisible = !this.isVisible;

        let hidingElem = new HidenElement(this.element, 800);

        let tClass = this;

        hidingElem.onFinish.Add(function () { 
            tClass.element.style.display = 'none';
        }, false);
    }
}
function GetDraggable(id) { return Draggables.get(id); }

class StaticFooter extends BasicObject { 
    getDefaultElement() { return $("footer"); }

    constructor(element) {
        super(element);
        let tClass = this;
        this.onChange(tClass);

        window.onresize = function(event) {
            tClass.onChange();
        };
    }

    onChange() {
        if (document.body.offsetHeight < window.innerHeight)
        {
            this.lockBottom();
            Log.l_Info("StaticFooter - Lock");
        }
        else
        {
            this.unlockBottom();
            Log.l_Info("StaticFooter - Unlock");
        }
    }

    lockBottom() {
        this.position = this.element.style.position;
        this.bottom = this.element.style.bottom;
        this.width = this.element.style.width;
        this.element.style.position = 'absolute';
        this.element.style.bottom = '0';
        this.element.style.width = "calc(100% - " + this.getOffset() + ")";
    }

    unlockBottom() {
        this.element.style.position = this.position;
        this.element.style.bottom = this.bottom;
        this.element.style.width = this.width;
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
    
    constructor(element) {
        super(element);       
        this.elements = Array.from(this.element.parentElement.getElementsByClassName("navbtn"));
        this.displayMethod = this.element.style.display;
        let tClass = this;
        this.element.addEventListener( "click", function() { tClass.OnClickedMenu(tClass); } );
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
    OnClickedMenu(tClass) { tClass.SwitchMenu(); }

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
        let tElem = this.element;
        if ( !ChangingElements.removeIf( function(elem) { return elem.element == tElem; } ) ) 
            Log.l_Warn("ChangingElement: Unable to remove itself from ChangingElements.");
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
 * Cookies info element.
 * Suggested HTML:
 * <cookieinfo>
 *     <p>Some cookies notice</p>
 *     <cookiex>Close</cookiex>
 * </cookieinfo>
 */
class CookieInfoElement extends BasicObject {
    getDefaultElement() { return $("cookieinfo"); }
    getDefaultClose() { return $("#cookieinfo"); }
    constructor(element) {
        super(element);

        // Called every time, doesn't matter if cookie closed already
        this.onCookieInfoClosed = new Delegate();

        if(Cookie.Get("cookieinfo") === "1")
        {
            this.element.style.display = "none";
            this.onCookieInfoClosed.Broadcast();
            this.destructor();
            return;
        }

        let tClass = this;
        this.closeElem = this.element.$("cookiex").onclick = function () {
            tClass.OnClicked();
        };
        console.log(this.element);
    }
    /**
     * Remove itself from array and mark as deleted.
     */ 
    destructor() {
        super.destructor();
    }

    OnClicked() {
        this.onCookieInfoClosed.Broadcast();
        new HidenElement(this.element, 1000);
        Cookie.Set("cookieinfo", "1", 360);
        this.destructor();
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