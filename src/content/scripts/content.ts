function getAllLinks() {
  const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll("a");
  return Array.from(links);
}

function addClassToElements<T extends HTMLElement>(
  elements: T[],
  className: string
) {
  for (const element of elements) {
    element.classList.add(className);
  }
}

console.log("injecting content script");
const links = getAllLinks();
console.log("links", links);
addClassToElements(links, "custom-styling");

export { getAllLinks };
