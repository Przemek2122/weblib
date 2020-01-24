// Created by Przemysław Wiewióra

"use strict";

// Directory with languages
var LangDir = "/lang/";
// Supported languages
var SupportedLanguages = ["pl", "en"];
var DownloadedLanguages = new Map();
// Chose default language - Only used when user prefered language is unavaiable
var DefaultLanguage = "pl";
// Currently used language
var CurrentLanguage = "";
// Event called when language is changed
var LanguageChangedEvent = new Event('langchange');
//elem.addEventListener('langchange', function (e) { /* ... */ }, false);
//elem.dispatchEvent(LanguageChangedEvent);

function Request(){
    let Http = new XMLHttpRequest();
    Http.open("GET", LangDir + CurrentLanguage + ".json");
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.status != 200)
            console.log("[Lang]: File: " + url + " Not found.");
        else if (Http.responseText)
        {
            DownloadedLanguages.set(CurrentLanguage, JSON.parse(Http.responseText));
            ApplyLang();
        }
    }
}

function ChangeLanguage(lang){
    const IsSupported = SupportedLanguages.find(function(element) { 
        return element == lang; 
    }); 

    if(CurrentLanguage == lang || !IsSupported)
        return;

    CurrentLanguage = lang;
    document.dispatchEvent(LanguageChangedEvent);
    //StartLoading(800);

    Request();
}

function AutoDetectLanguage() {
    const PreferedLang = window.navigator.userLanguage || window.navigator.language;

    const IsSupported = SupportedLanguages.find(function(element) { 
        return element == PreferedLang; 
    }); 

    if (IsSupported){
        ChangeLanguage(PreferedLang);
    }
}
AutoDetectLanguage();

function ApplyLang() {
    console.log('[Lang]: Language changed. Current lang: ' + CurrentLanguage);
    console.log(DownloadedLanguages.get(CurrentLanguage));

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
}

function logMapElements(value, key, map) {
    console.log(`m[${key}] = ${value}`);
    let elem = document.getElementById(key);
    if (elem){
        elem.innerHTML = value;
    } else {
        console.log("[Lang]: Element with ID: " + key + " not found.");
    }
}