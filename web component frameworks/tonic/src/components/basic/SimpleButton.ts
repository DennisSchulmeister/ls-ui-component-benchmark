import type { Properties } from "@socketsupply/tonic";

import { TonicComponent }  from "../../utils/TonicComponent.js";
import "./SimpleButton.less";

type SimpleButtonProperties = {
    type?: "" | "primary";
    disabled?: "true"|"false";
    attributes?: Properties
};

/**
 * A simple button component. Renders a simple styled button.
 */
export class SimpleButton extends TonicComponent<SimpleButtonProperties> {
    render() {
        return this.html`
            <Button ...${this.props.attributes || {}}>${this.children}</Button>
        `;
    }

    click(e: MouseEvent) {
        if (this.props?.disabled === "true") {
            e.stopImmediatePropagation();
        }
    }
}

TonicComponent.add(SimpleButton);