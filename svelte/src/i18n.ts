import type {I18N}        from "./i18n/index.js";
import {fallbackLanguage} from "./i18n/index.js";
import {defaultLanguage}  from "./i18n/index.js";
import {writable}         from "svelte/store";
import {readable}         from "svelte/store";

let setTranslations: (value: I18N) => void;

/**
 * Message catalogue with all translations of the currently active language.
 * This is just a deeply structured key/value object, that can be directly
 * accessed with `$i18n.someKey` in the UI components.
 */
export const i18n = readable(await createTranslations(defaultLanguage), function(set) {
    setTranslations = set;
});

/**
 * Currently active language.
 */
export const language = writable(defaultLanguage);

language.subscribe(async function(newLanguage: string) {
    if (!setTranslations) return;
    setTranslations(await createTranslations(newLanguage));
});

/**
 * Utility function to replace placeholders in the form of `$key$` in the given
 * text with the property of the object given in the second parameter.
 * 
 * @param text Original text
 * @param values Key/values to insert
 * @return Text with replaced placeholders
 */
export function _(text: string, values: any): string {
    let result = text;

    for (let key of Object.keys(values) || []) {
        text = text.replaceAll(`\$${key}\$`, values[key]);
    }

    return result;
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