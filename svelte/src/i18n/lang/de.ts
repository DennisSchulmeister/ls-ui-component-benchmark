import type {I18N} from "../index.js";

const i18n: I18N = {
    StudyBook: {
        Title: "Titel des Lehrbuchs",
    },

    BookContentPage: {
        Button: {
            Previous: "Zurück",
            Next: "Weiter",
        }
    },

    Error404: {
        TriggerLink: "404 Seite auslösen",
        Title:       "Seite nicht gefunden",
        Message1:    "Es tut uns fürchterlich Leid, aber die angeforderte Seite <b>$url$</b> wurde nicht gefunden.",
        Message2:    'Wollen Sie stattdessen zur <a href="#/">Startseite</a> zurückgehen und sich einen anderen Käse schnappen?',
    },
};

export default i18n;