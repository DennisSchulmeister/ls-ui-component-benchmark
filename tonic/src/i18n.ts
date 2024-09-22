import type {Properties}  from "@socketsupply/tonic";
import type {I18N}        from "./i18n/index.js";

import {fallbackLanguage} from "./i18n/index.js";
import {defaultLanguage}  from "./i18n/index.js";
import {Observable}       from "./utils/observable.js";

export {languages}        from "./i18n/index.js";
export {defaultLanguage}  from "./i18n/index.js";
export {fallbackLanguage} from "./i18n/index.js";

let customLanguages: any = {};

/**
 * Message catalogue with all translations of the currently active language.
 * This is just a deeply structured key/value object, that can be directly
 * accessed with `$i18n.someKey` in the UI components.
 */
export const i18n: I18N = await createTranslations(defaultLanguage);

/**
 * Currently active language.
 */
export const language = new Observable<string>(defaultLanguage);

language.bindFunction(async function(newValue) {
    for (let key of Object.keys(i18n)) {
        delete i18n[key as keyof typeof i18n];
    }

    let newI18n = await createTranslations(newValue);
    Object.assign(i18n, newI18n);
});

/**
 * Utility function to replace placeholders in the form of `$key$` in the given
 * text with the property of the object given in the second parameter.
 * 
 * @param text Original text
 * @param values Key/values to insert
 * @return Text with replaced placeholders
 */
export function _(text: string, values: Properties): string {
    let result = text;

    for (let key of Object.keys(values) || []) {
        text = text.replaceAll(`\$${key}\$`, values[key]);
    }

    return result;
}

/**
 * Utility function for study book authors to translate the application
 * into a custom language.
 * 
 * @param language 
 * @param translations 
 */
export function addCustomLanguage(language: string, translations: I18N) {
    customLanguages[language] = translations;
}

/**
 * Create a new message catalogue from the given langauge and the fallback language.
 * 
 * @param newLanguage Language code
 * @returns New message catalogue
 */
async function createTranslations(newLanguage: string): Promise<I18N> {
    let i18n = await import(`./i18n/lang/${fallbackLanguage}.ts`);
    let translations = deepCopy({}, i18n.default);

    if (newLanguage !== fallbackLanguage) {
        let i18n = await import(`./i18n/lang/${newLanguage}.ts`);
        deepCopy(translations, i18n.default);
    }

    if (newLanguage in customLanguages) {
        deepCopy(translations, customLanguages[newLanguage]);
    }

    return translations;
}

/**
 * Deep copy of an object with translatable texts, similar to `Object.assign()`.
 * Note that the object properties must be strings or nested translation objects.
 * If a property is an object, the function will copy its content by recursively
 * calling itself. All other values are copied via a simple assignment.
 * 
 * Properties of the target object that are missing in the source object remain
 * unmodified.
 * 
 * @param target Target object
 * @param source Source object
 * @returns Target object
 */
function deepCopy(target: any, source: any): any {
    for (let key of Object.keys(source)) {
        let value = source[key];

        if (typeof value === "object") {
            target[key] = {};
            deepCopy(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }

    return target;
}