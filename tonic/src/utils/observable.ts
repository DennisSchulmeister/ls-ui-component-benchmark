export type Validator<T> = (newValue: T, oldValue: T) => boolean;
export type Callback<T> = (newValue: T, oldValue: T) => void|Promise<void>;

type Binding<T> = {
    callback?: Callback<T>,
    element?: HTMLElement,
    escape?: boolean,
};

/**
 * Utility class borrowed from @dschulmeis/ls-utils to implement a simple version
 * of the observer pattern. The idea is to have objects of this class at the application
 * or page level for each value that represents a global state that affects multiple
 * components deep in the DOM tree. The molecule components can register callbacks
 * on these values and rerender their sub-components as necessary.
 */
export class Observable<T> {
    #value:      T;
    #bindings:   Map<number, Binding<T>> = new Map();
    #validators: Map<number, Validator<T>> = new Map();
    #sequence:   number = 0;

    /**
     * The constructor.
     * @param value Initial value
     */
    constructor(value: T) {
        this.#value = value;
    }

    /**
     * Getter to make usage of this class transparent for clients reading the value.
     * @returns the current value
     */
    get value(): T {
        return this.#value;
    }

    /**
     * Setter to make usage of this class transparent for clients changing the value.
     * @param newValue New value
     */
    set value(newValue: T) {
        let oldValue = this.#value;

        if (!this._callValidators(newValue, oldValue)) return;
        this.#value = newValue;
        this._callObservers(newValue, oldValue);
    }

    /**
     * Add a validator function which will be called before the actual update occurs.
     * This function, which will be given the new and the old value, must return true,
     * if the update is allowed or false, if the update is not allowed.
     *
     * @param func Validator function
     * @returns Key to remove the validator function later
     */
    addValidator(func: Validator<T>): number {
        this.#sequence++;
        this.#validators.set(this.#sequence, func);
        return this.#sequence;
    }

    /**
     * Unregister previously registered validator function.
     * @param key Key of the validator function
     */
    removeValidator(key: number) {
        this.#validators.delete(key);
    }

    /**
     * Register a callback function to be called when the value changes. The function will
     * be called with the new and the old value.
     * 
     * @param func Callback function
     * @returns Key to unbind the callback function later
     */
    bindFunction(func: Callback<T>): number {
        this.#sequence++;
        this.#bindings.set(this.#sequence, { callback: func });
        return this.#sequence;
    }

    /**
     * Register a HTML element to be updated when the value changes. The update will be
     * done by setting `element.innerHTML` or `element.innerText` depending on whether
     * HTML strings should be escaped.
     *
     * @param element The element to be updated
     * @param escape Whether to escape HTML entities (default: true)
     * @returns Key to unbind the element later
     */
    bindElement(element: HTMLElement, escape: boolean): number {
        this.#sequence++;
        if (escape == undefined) escape = true;
        this.#bindings.set(this.#sequence, { element, escape });
        return this.#sequence;
    }

    /**
     * Unregister a previously registered callback function.
     * @param key Key of the binding to remove
    */
    unbind(key: number) {
            this.#bindings.delete(key);
    }

    /**
     * Call all validators before an update to check whether it can be performed.
     */
    _callValidators(newValue: T, oldValue: T): boolean {
        for (let validator of this.#validators.values()) {
            if (!validator(newValue, oldValue)) return false;
        }

        return true;
    }

    /**
     * Call all observers in the order they were bound.
     */
    async _callObservers(newValue: T, oldValue: T) {
        for (let binding of this.#bindings.values()) {
            if (binding.callback) {
                await binding.callback(newValue, oldValue);
            }

            if (binding.element) {
                if (binding.escape) {
                    binding.element.textContent = `${newValue}`;
                } else {
                    binding.element.innerHTML = `${newValue}`;
                }
            }
        }
    }
}
