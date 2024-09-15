import type { Properties } from "@socketsupply/tonic";

export type Languages = {
    [k in LanguageCode]: Messages;
};

export type Messages = {
    [k in MessageKey]: string
}

export type LanguageCode = string;

export type MessageKey = "StudyBook/Title"
                       | "BookContentPage/Button/Previous"
                       | "BookContentPage/Button/Next"
                       | "404-Page/TriggerLink"
                       | "404-Page/Title"
                       | "404-Page/Message1"                       
                       | "404-Page/Message2";

const languages: Languages = {
    // Built-in english message catalogue
    en: {
        "StudyBook/Title": "Title of the study book",

        "BookContentPage/Button/Previous": "Previous",
        "BookContentPage/Button/Next":     "Next",

        "404-Page/TriggerLink": "Trigger 404 Page",
        "404-Page/Title":       "Page not found",
        "404-Page/Message1":    "We are terribly sorry, but the requested page <b>$url$</b> cannot be found.",
        "404-Page/Message2":    `Maybe go back to the <a href="#/">home page</a> and grab some other cheese, instead?`,
    },

    de: {
        "StudyBook/Title": "Titel des Lehrbuchs",

        "BookContentPage/Button/Previous": "Zurück",
        "BookContentPage/Button/Next":     "Weiter",

        "404-Page/TriggerLink": "404 Seite auslösen",
        "404-Page/Title":       "Seite nicht gefunden",
        "404-Page/Message1":    "Es tut uns fürchterlich Leid, aber die angeforderte Seite <b>$url$</b> wurde nicht gefunden.",
        "404-Page/Message2":    `Wollen Sie stattdessen zur <a href="#/">Startseite</a> zurückgehen und sich einen anderen Käse schnappen?`,
    }
};

let currentLanguages: LanguageCode[] = ["en"];

/**
 * @returns List of available language codes
 */
export function getAvailableLanguages(): string[] {
    return Object.keys(languages).sort();
}

/**
 * Add message catalogue for a new language or overwrite the messages of the
 * given language.
 * 
 * @param languageCode Language code (e.g. "en" or "de")
 * @param messages Object with message codes and translations
 */
export function addLanguage(languageCode: LanguageCode, messages: Messages) {
    languages[languageCode] = messages;
}

/**
 * Set the currently used language codes in the order of precedence. Translations
 * will be searched for the first language, then the second and so on, until a
 * translation string is found.
 * 
 * @param languageCodes Language codes in order of precedence
 */
export function setCurrentLanguages(...languageCodes: LanguageCode[]) {
    currentLanguages = languageCodes;
}

/**
 * @returns The currently used language codes
 */
export function getCurrentLanguages(): LanguageCode[] {
    return currentLanguages;
}

/**
 * Get a translated text from the message catalogues.
 * 
 * @param key Message code
 * @param properties Values for `$placeholder$` variables
 * @returns Translated text or message code
 */
export function getText(key: MessageKey, properties?: Properties): string {
    let text: string = key;

    for (let languageCode of currentLanguages) {
        let text1 = languages[languageCode]?.[key];

        if (text1 !== undefined) {
            text = text1;
            break;
        }
    }

    if (properties) {
        for (let propertyName of Object.keys(properties) || []) {
            text = text.replaceAll(`\$${propertyName}\$`, properties[propertyName]);
        }
    }

    return text;
}

/**
 * Shorthand for the `getText()` function.
 */
export const _ = getText;