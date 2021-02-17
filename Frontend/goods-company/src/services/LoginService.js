
const loginUrl = "http://localhost:8080/api/users/login";

const loginUser = (loginData) => {
    return fetch(loginUrl, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(loginData),
      })
      .then( (response) => response
      );
};

export default loginUser;
