const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
  } catch (_) {
    return false;
  }

  return true;
};

let getUrls = (urlString: string): string[] => {
  if (!isValidUrl(urlString)) {
    return [];
  }

  const url = new URL(urlString);
  const searchParams = url.searchParams;
  const paths: string[] = url.pathname.split("/");
  const hash = url.hash;
  return Array.from(
    new Set([
      url.toString(),
      ...paths.flatMap((path) => {
        return [
          ...getUrls(decodeURI(path)),
          ...getUrls(decodeURIComponent(path)),
        ];
      }),
      ...Array.from(searchParams).flatMap(([, value]: [string, string]) => {
        return [
          ...getUrls(value),
          ...getUrls(decodeURI(value)),
          //...getUrls(decodeURIComponent(value)),
        ];
      }),
      ...getUrls(hash),
    ])
  );
};


const input = document.getElementById("input");
const list = document.getElementById("list");

const createLink = (url) => {
  const a = document.createElement("a");
  const link = document.createTextNode(url);
  a.appendChild(link);
  a.title = url;
  a.href = url;
  return a;
};
input.addEventListener("input", (event) => {
  const urls = getUrls(event.target.value);

  const listItems = [];
  list.innerHTML = "";
  for (const url of urls) {
    const li = document.createElement("li");
    const a = createLink(url);
    li.appendChild(a);
    listItems.push(li);
    list.appendChild(li);
  }
});
