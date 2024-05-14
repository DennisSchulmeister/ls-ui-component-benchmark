import Tonic from "@socketsupply/tonic";

/**
 * Root component of the whole application.
 */
export class MyApplication extends Tonic {
    /**
     * Handle mouse click events.
     */
    click() {
        alert("Mouse click detected!");
    }

    /**
     * Render HTML template.
     */
    render() {
        return this.html`
            <h1>My Tonic Application</h1>
            <p>More to come ...</p>
        `;
    }
}

Tonic.add(MyApplication);