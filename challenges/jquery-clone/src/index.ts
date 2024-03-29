import fetch from "node-fetch";

function isHtmlElement(e: unknown): e is HTMLElement {
  return e instanceof HTMLElement;
}

class SelectorResult {
  #elements;

  constructor(elements: NodeListOf<Element>) {
    this.#elements = elements;
  }
  html(contents: string) {
    this.#elements.forEach((elem) => {
      elem.innerHTML = contents;
    });
  }
  on<K extends keyof HTMLElementEventMap>(
    eventName: K,
    cb: (event: HTMLElementEventMap[K]) => void
  ) {
    this.#elements.forEach((elem) => {
      if (isHtmlElement(elem)) elem.addEventListener(eventName, cb);
    });
  }
  show() {
    this.#elements.forEach((elem) => {
      if (isHtmlElement(elem)) elem.style.visibility = "visible";
    });
  }
  hide() {
    this.#elements.forEach((elem) => {
      if (isHtmlElement(elem)) elem.style.visibility = "hidden";
    });
  }
}

function $(selector: string) {
  return new SelectorResult(document.querySelectorAll(selector));
}

// Note we wrap a namespace around the $ function to add methods
namespace $ {
  export function ajax({
    url,
    success,
  }: {
    url: string;
    success: (data: any) => void;
  }): Promise<Response | void> {
    return fetch(url)
      .then((resp) => resp.json())
      .then(success);
  }
}

export default $;

// --

$("button.continue").html("Next Step...");

const hiddenBox = $("#banner-message");
$("#button-container button").on("click", (event) => {
  hiddenBox.show();
});

$.ajax({
  url: "https://jsonplaceholder.typicode.com/posts/33",
  success: (result) => {
    $("#post-info").html("<strong>" + result.title + "</strong>" + result.body);
  },
});
