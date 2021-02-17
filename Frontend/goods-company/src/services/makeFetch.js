import Cookie from "js-cookie";

const makeFetch = (method, requestUrl, body = "") => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method !== "GET" && method !== "DELETE") {
    options.body = JSON.stringify(body);
  }
  const token = Cookie.get("token");
  options.headers.Authorization = "Bearer " + token;
  return fetch(requestUrl, options).then((response) => response);
};

const makeGetFetch = (url) => {
  return makeFetch("GET", url);
};

const makePostFetch = (url, body) => {
  return makeFetch("POST", url, body);
};

const makePutFetch = (url, body) => {
  return makeFetch("PUT", url, body);
};

const makeDeleteFetch = (url) => {
    return makeFetch("DELETE", url);
  };

export { makeFetch, makeGetFetch, makePostFetch, makePutFetch, makeDeleteFetch };
