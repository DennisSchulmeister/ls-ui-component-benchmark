import { TonicComponent } from "../../TonicComponent.js";
import "./SimpleButton.less";

type Properties = {
    type?: "" | "primary";
    disabled?: boolean;
};

/**
 * A simple button component. Renders a simple styled button.
 */
export class SimpleButton extends TonicComponent<Properties> {
    render() {
        return this.html`
            <Button>${this.children}</Button>
        `;
    }
}

TonicComponent.add(SimpleButton);