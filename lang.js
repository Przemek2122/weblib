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

//
//  INFO
//
// Hierarchy
// lang/en/page.json will be for example page.html or page.php
//

var Loader = new Loading($("#loader"));

function Request(){
    let Http = new XMLHttpRequest();
    let CalledAlready = false;
    Http.open("GET", GetLangURL());
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.status != 200 && Http.status != 0){
            console.log("[Lang]: File: " + GetLangURL() + " Not found. Http.status: " + Http.status);
            Http.abort();
            Http = null;
        }
        else if (Http.responseText)
        {
            DownloadedLanguages.set(CurrentLanguage, JSON.parse(Http.responseText));
            if (!CalledAlready){
                CalledAlready = true;
                ApplyLang();
                Http.abort();
                Http = null;
            }
        }
    }
}

function GetLangURL() {
    return LangDir + CurrentLanguage + "/" + GetPage() + ".json";
}

function GetPage() {
    let page;
    if (window.location.pathname == "/")
        page = DefaultSite;
    else
        page = window.location.pathname.split('/').pop(); // eg index.html

    page = page.replace(".html", "");
    page = page.replace(".php", "");
    return page;
}

function AutoDetectLanguage() {
    const PreferedLang = window.navigator.userLanguage || window.navigator.language;
    const IsSupported = SupportedLanguages.find(function(element) { 
        return element == PreferedLang.substring(0, 2); 
    }); 
    
    if (IsSupported){
        ChangeLanguage(PreferedLang.substring(0, 2));
    } else {
        console.log('[Lang]: Unsupported language.');
    }
}

function ChangeLanguage(lang){
    const IsSupported = SupportedLanguages.find(function(element) { 
        return element == lang; 
    }); 

    if(CurrentLanguage == lang || !IsSupported){
        console.log('[Lang]: CurrentLanguage == lang || !IsSupported');
        return;
    } else if (DownloadedLanguages.get(lang)) {
        console.log('[Lang]: Setting cached language.');
        CurrentLanguage = lang;
        ApplyLang();
        return;
    } else {
        console.log('[Lang]: Download language request.');
        CurrentLanguage = lang;
        Loader.Start(800);
        Request();
    }
}

function ApplyLang() {
    console.log('[Lang]: Language changed. Current lang: ' + CurrentLanguage);
    let json = DownloadedLanguages.get(CurrentLanguage);

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            let elem = document.getElementById(key);
            if (elem){
                document.getElementById(key).innerHTML = json[key];
            } else {
                console.log("[Lang]: ID: " + key + " not found.");
            }
        }
    }

    Loader.Stop(1000);
}