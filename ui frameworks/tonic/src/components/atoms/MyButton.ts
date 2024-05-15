import Tonic from "@socketsupply/tonic";
import "./MyButton.less";

/**
 * A simple button component. Renders a simple styled button.
 */
export class MyButton extends Tonic {
    count: number = 0;

    click() {
        this.count += 1;
        this.reRender();
    }

    render() {
        return this.html`
            <Button>${this.count.toString()}</Button>
        `;
    }
}

Tonic.add(MyButton);