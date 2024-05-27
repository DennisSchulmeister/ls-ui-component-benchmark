declare module '@socketsupply/tonic' {
    export interface TonicTemplate {
        constructor(rawText: any, templateStrings: any, unsafe: any);
        isTonicTemplate: boolean;
        unsafe: any;
        rawText: any;
        templateStrings: any;
        valueOf(): any;
        toString(): any;
    };

    export type Properties = {
        [k in string]: any
    };

    export class Tonic<Properties = never> extends HTMLElement {
        //
        // Manually added typings based on the documentation on the website
        //

        render(): TonicTemplate;

        mouseover(e: MouseEvent);
        change(e: Event);
        willConnect();
        connected();
        disconnected();
        updated();
        click(e: MouseEvent);

        styles(): {};
        stylesheet(): string;
        static stylesheet(): string;

        static nonce: string;

        //
        // Typings generated with the TypeScript playground from file index.js
        // and then manually cleaned up
        //

        static get version(): string;
        static get SPREAD(): RegExp;
        static get ESC(): RegExp;
        static get AsyncFunctionGenerator(): Function;
        static get AsyncFunction(): Function;

        static get MAP(): {
            '"': string;
            "&": string;
            "'": string;
            "<": string;
            ">": string;
            "`": string;
            "/": string;
        };
        
        static match(el: any, s: any): any;
        static getTagName(camelName: any): any;
        static getPropertyNames(proto: any): string[];
        static add(c: any, htmlName?: string): any;
        static registerStyles(stylesheetFn: any): void;
        static escape(s: any): any;
        static unsafeRawString(s: any, templateStrings: any): TonicTemplate;

        preventRenderOnReconnect: boolean;
        props: Properties;
        elements: Element[];
        nodes: ChildNode[];
        get isTonicComponent(): boolean;

        set state(newState: any);
        get state(): any;

        dispatch(eventName: any, detail?: any): void;
        html(strings: any, ...values: any[]): TonicTemplate;
        scheduleReRender(oldProps: any): any;
        pendingReRender: any;
        reRender(o?: {}): any;
        handleEvent(e: any): void;
        connectedCallback(): any;
        root: any;
        isInDocument(target: any): boolean;
        disconnectedCallback(): void;
    }
    
    export default Tonic;
}