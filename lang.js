// Created by Przemysław Wiewióra

//
//  CONFIG
//
var LangDir = "/lang/"; // Directory with languages
var SupportedLanguages = ["pl", "en"]; // Which languages are supported?
var DownloadedLanguages = new Map(); // Map with saved languages
var DefaultLanguage = "pl"; // Chose default language - Only used when user prefered language is unavaiable
var CurrentLanguage = "";// Currently used language
var DefaultSite = "index.php"; // "index.html" or "index.php" ...
var UseCookies = true; // Should this script be allowed to use cookies?
var CustomPageSet = false; // Is custom page? use when script doesn't know what page is this.
var CustomPage = "index.php"; // Custom page path
var CustomPages = ['navbar']; // What should be always loaded, like navbar, footer, etc.. Use just name eg '/lang/en/navbar.json' will be 'navbar'

//
//  INFO
//
// Hierarchy
// lang/en/page.json will be for example page.html or page.php
//

var Loader = new Loading($("#loader"));

/**
 * Download language
 */
class RequestLangData extends BasicObject {
    constructor(url) {
        super();
        this.Http = new XMLHttpRequest();
        this.Http.open("GET", url);
        this.Http.send();
        this.onFinished = new Delegate();

        this.Http.onreadystatechange = (e) => {
            if (this.Http.status != 200 && this.Http.status != 0) {
                Log.l_Error("[Lang]: File: " + url + " Not found. Http.status: " + this.Http.status);
                this.destructor();
            }
            else if (this.Http.responseText)
            {
                this.onFinished.Broadcast(this.Http.responseText);
                this.destructor();
            }
        }
    }

    getDefaultElement() { return null; }

    destructor() {
        super.destructor();
        this.Http.abort(); // Close request
        this.Http = null;
    }
}

/**
 * Download missing language
 */
function Request() {
    let RequestNum = 1;
    let PageLang = new RequestLangData(GetLangURL());
    PageLang.onFinished.Add(function (json_data) {
        DownloadedLanguages.set(CurrentLanguage, new Map([...DownloadedLanguages.get(CurrentLanguage), ...JsonToWordsMap(json_data)]));
        Check();
    });
    for (let i = 0; i < CustomPages.length; i++) {
        let CurrPage = new RequestLangData(LangDir + CurrentLanguage + "/" + CustomPages + ".json");
        RequestNum++;
        CurrPage.onFinished.Add(function (json_data) {
            DownloadedLanguages.set(CurrentLanguage, new Map([...DownloadedLanguages.get(CurrentLanguage), ...JsonToWordsMap(json_data)]));
            Check();
        });
    }
    
    // Apply when everything downloaded
    function Check() {
        RequestNum--;
        if (!RequestNum)
            ApplyLang();
    }

    // Just reserve place
    // Fill later (async request)
    DownloadedLanguages.set(CurrentLanguage, Array());
}

/**
 * Get path of language to download 
 */
function GetLangURL() {
    return LangDir + CurrentLanguage + "/" + GetPage() + ".json";
}

/**
 * Set custom page when it doesn't work as it should. 
 */
function SetCustomPage(page) {
    CustomPageSet = true;
    CustomPage = page;
}

function GetPage() {
    if (CustomPageSet) { return CustomPage; }

    let page = Array.from(window.location.pathname.split('/')); // eg index.html

    if (page[page.length - 1].replace(".html", "") == page[page.length - 1] 
    &&  page[page.length - 1].replace(".html", "") == page[page.length - 1])
    {
        page[page.length - 1] = DefaultSite;
    }

    page[page.length - 1] = page[page.length - 1].replace(".html", "");
    page[page.length - 1] = page[page.length - 1].replace(".php", "");

    let finalPage = "";
    for (let i = 0; i < page.length; i++){
        if (page[i].length == 0) continue;

        if (i == page.length - 1)
            finalPage += page[i];
        else
            finalPage += page[i] + "/";
    }

    return finalPage;
}

/**
 * Check browser lanugage
 */
function AutoDetectLanguage() {
    if (UseCookies)
    {
        let lang = Cookie.Get("lang");

        if (lang && lang != "")
        {
            const IsSupported = SupportedLanguages.find(function(element) { 
                return element == lang.substring(0, 2); 
            }); 

            if (IsSupported){
                ChangeLanguage(lang.substring(0, 2));
                return;
            }
        }
    }

    GetLanguage();
}

function GetLanguage() {
    const PreferedLang = (window.navigator.userLanguage || window.navigator.language).substring(0, 2);
    const IsSupported = SupportedLanguages.find(function(element) { 
        return element == PreferedLang; 
    }); 
    
    if (IsSupported){
        ChangeLanguage(PreferedLang);
    } else {
        console.log('[Lang]: Unsupported language.');
    }
}

function ChangeLanguage(lang){
    const IsSupported = SupportedLanguages.find(function(element) { 
        return element == lang; 
    }); 

    if(CurrentLanguage == lang || !IsSupported){
        console.log((IsSupported) ? '[Lang]: Same as current language.' : '[Lang]: Not supported.');
        return;
    } else if (DownloadedLanguages.get(lang)) {
        console.log('[Lang]: Setting cached language.');
        CurrentLanguage = lang;
        ApplyLang();
        return;
    } else {
        console.log('[Lang]: Download language request.');
        CurrentLanguage = lang;
        Loader.Show(0);
        Request();
    }
}

function ApplyLang() {
    console.log('[Lang]: Language changed. Current lang: ' + CurrentLanguage);
    let jsonMap = DownloadedLanguages.get(CurrentLanguage);

    jsonMap.forEach( function(value, key, map) { 
        let elem = document.getElementById(key);
        if (elem) 
            document.getElementById(key).innerHTML = value;
        else
            console.log("[Lang]: ID: " + key + " not found.");
    });

    // Set cookie
    if (UseCookies)
        Cookie.Set("lang", CurrentLanguage, 360);

    Loader.Hide(1000);
}


// Auto - run
AutoDetectLanguage();