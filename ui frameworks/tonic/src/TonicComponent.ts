import type { Validator } from "./utils/observable";
import type { Callback }  from "./utils/observable";

import { Observable }     from "./utils/observable";
import Tonic              from "@socketsupply/tonic";

/**
 * Specialized variant of the `Tonic` base-class for web components, that adds some convenience
 * for working with `Observable` values. Strictly speaking, no special treatment is needed for
 * observable values. However, this class simplifies the usage by automating the cleanup after
 * when a component has "disconnected" from the DOM.
 */
export class TonicComponent<Properties = never> extends Tonic<Properties> {
    #validators: Map<Observable<any>, number[]> = new Map();
    #bindings: Map<Observable<any>, number[]> = new Map();

    /**
     * Automatic removal of all validators and bindings on disconnect from the DOM.
     */
    disconnected() {
        this.#validators.forEach((keys, observable) => {
            for (let key of keys) {
                observable.removeValidator(key);
            }
        });

        this.#bindings.forEach((keys, observable) => {
            for (let key of keys) {
                observable.unbind(key);
            }
        });

        this.#validators = new Map();
        this.#bindings = new Map();
    }

    /**
     * Add a validator function to the given observable value. It will be called before
     * the update occurs to validate if the update is allowed.
     * 
     * @param observable Observable value
     * @param func Validator function
     */
    addValidator<T>(observable: Observable<T>, func: Validator<T>) {
        let keys = this.#validators.get(observable) || [];
        keys.push(observable.addValidator(func));
        this.#validators.set(observable, keys);
    }

    /**
     * Register a callback function for the given observable value to be called when the
     * value changes. The function will be given the new and the old value.
     * 
     * @param observable Observable value
     * @param func Callback function
     */
    bindFunction<T>(observable: Observable<T>, func: Callback<T>) {
        let keys = this.#bindings.get(observable) || [];
        keys.push(observable.bindFunction(func));
        this.#bindings.set(observable, keys);
    }

    /**
     * Register a HTML element with the given observable value to be updated when the
     * value changes, by setting the `textContent` or `innerHTML` property.
     * 
     * @param observable Observable value
     * @param element HTML Element
     * @param escape Escape HTML entities (default: true)
     */
    bindElement<T>(observable: Observable<T>, element: HTMLElement, escape: boolean) {
        let keys = this.#bindings.get(observable) || [];
        keys.push(observable.bindElement(element, escape));
        this.#bindings.set(observable, keys);
    }
}