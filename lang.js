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

function Request(){
    let Http = new XMLHttpRequest();
    let CalledAlready = false;
    Http.open("GET", LangDir + CurrentLanguage + ".json");
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.status != 200)
            console.log("[Lang]: File: " + url + " Not found.");
        else if (Http.responseText)
        {
            DownloadedLanguages.set(CurrentLanguage, JSON.parse(Http.responseText));
            if (!CalledAlready){
                //console.log(DownloadedLanguages.get(CurrentLanguage));
                CalledAlready = true;
                ApplyLang();
            }
        }
    }
}

function AutoDetectLanguage() {
    const PreferedLang = window.navigator.userLanguage || window.navigator.language;
    const IsSupported = SupportedLanguages.find(function(element) { 
        return element == PreferedLang.substring(0, 2); 
    }); 
    console.log(PreferedLang.substring(0, 2));
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
        StartLoading(800);
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

    StopLoading(1000);
}