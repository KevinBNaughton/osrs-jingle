import { parse } from "node-html-parser";

export function decodeHTML(encodedString: string): string {
  const root = parse(encodedString);
  // const parser = new DOMParser();
  // var html_doc = parser.parseFromString(encodedString, "text/html");
  // var body: HTMLElement = html_doc.body;
  // if (body.textContent) {
  //   return body.textContent;
  // }
  if (root.textContent) {
    return root.textContent;
  }
  throw new Error("No Text Content, debug this");
}
