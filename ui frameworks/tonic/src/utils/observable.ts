export type Validator<T> = (newValue: T, oldValue: T) => boolean;
export type Callback<T> = (newValue: T, oldValue: T) => void;

type Binding<T> = {
    callback?: Callback<T>,
    element?: HTMLElement,
    escape?: boolean,
};

/**
 * Utilits class borrowed from @dschulmeis/ls-utils to implement a simple version
 * of the observer pattern. The idea is to have objects of this class at the application
 * or page level for each value that represents a global state that affects multiple
 * components deep in the DOM tree. The molecule components can register callbacks
 * on these values and rerender their sub-components as necessary.
 */
export class Observable<T> {
    _value: T;
    _bindings: Binding<T>[] = [];
    _validators: Validator<T>[] = [];

    /**
     * The constructor.
     * @param value Initial value
     */
    constructor(value: T) {
        this._value = value;
    }

    /**
     * Getter to make usage of this class transparent for clients reading the value.
     * @returns the current value
     */
    get value(): T {
        return this._value;
    }

    /**
     * Setter to make usage of this class transparent for clients changing the value.
     * @param newValue New value
     */
    set value(newValue: T) {
        let oldValue = this._value;

        if (!this._callValidators(newValue, oldValue)) return;
        this._value = newValue;
        this._callObservers(newValue, oldValue);
    }

    /**
     * Add a validator function which will be called before the actual update occurs.
     * This function, which will be given the new and the old value, must return true,
     * if the update is allowed or false, if the update is not allowed.
     *
     * @param func Validator function
     */
    addValidator(func: Validator<T>) {
        this._validators.push(func);
    }

    /**
     * Unregister previously registered validator function.
     * @param func Validator function
     */
    removeValidator(func: Validator<T>) {
        this._validators = this._validators.filter(v => v != func);
    }

    /**
     * Register a callback function to be called when the value changes. The function will
     * be called with the new and the old value.
     * 
     * @param func Callback function
     */
    bindFunction(func: Callback<T>) {
        this._bindings.push({ callback: func });
    }

    /**
     * Unregister a previously registered callback function.
     * @param func Callback function
     */
    unbindFunction(func: Callback<T>) {
        this._unbind({ callback: func });
    }

    /**
     * Register a HTML element to be updated when the value changes. The update will be
     * done by setting `element.innerHTML` or `element.innerText` depending on whether
     * HTML strings should be escaped.
     *
     * @param element The element to be updated
     * @param escape Whether to escape HTML entities (default: true)
     */
    bindElement(element: HTMLElement, escape: boolean) {
        this._bindings.push({ element, escape });
    }

    /**
     * Unregister a previously registered HTML element.
     * @param element HTML Element
     */
    unbindElement(element: HTMLElement) {
        this._unbind({ element });
    }

    /**
     * Remove all bindings for a given callback function or HTML element.
     */
    _unbind(binding: Binding<T>) {
        this._bindings = this._bindings.filter(entry => {
            if (binding.callback) return entry.callback == binding.callback;
            if (binding.element)  return entry.element  == binding.element;
            return true;
        });
    }

    /**
     * Call all validators before an update to check whether it can be performed.
     */
    _callValidators(newValue: T, oldValue: T): boolean {
        for (let i = 0; i < this._validators.length; i++) {
            let validator = this._validators[i];
            if (!validator(newValue, oldValue)) return false;
        }

        return true;
    }

    /**
     * Call all observers in the order they were bound.
     */
    _callObservers(newValue: T, oldValue: T) {
        for (let binding of this._bindings) {
            if (binding.callback) {
                binding.callback(newValue, oldValue);
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
