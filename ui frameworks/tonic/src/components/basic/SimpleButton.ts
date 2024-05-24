import Tonic from "@socketsupply/tonic";
import "./SimpleButton.less";

type Properties = {
    type?: "" | "primary";
    disabled?: boolean;
};

/**
 * A simple button component. Renders a simple styled button.
 */
export class SimpleButton extends Tonic<Properties> {
    render() {
        return this.html`
            <Button>${this.children}</Button>
        `;
    }
}

Tonic.add(SimpleButton);