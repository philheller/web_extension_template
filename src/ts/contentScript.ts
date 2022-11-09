import { isFuture } from "date-fns";

function add(a: number, b: number): number {
  return a + b;
}

function countClick(): void {
  chrome.runtime.sendMessage(
    { message: "incrementCounter" },
    function (response) {
      console.log(response.result);
    }
  );
}

const body = document.querySelector("body");
body?.addEventListener("click", () => countClick());

export { add };
