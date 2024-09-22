import "./index.css";

window.addEventListener("DOMContentLoaded", function() {
    console.log("Application is ready!");

    // Deliberate typing error to prove that TypeScript is checking the code!
    test("Wrong!");
});

function test(x: number): void {
    console.log(x);
}