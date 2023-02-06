const Username = "daniel";
const Password = "password";

let userName = document.getElementById("username");
let passWord = document.getElementById("password");
let logIn = document.getElementById("login");

function checkCredentials(e) {
  e.preventDefault();
  if (userName.value === Username && passWord.value === Password) {
    console.log("success");
    window.location.href = "../index.html";
  } else if (userName.value !== "daniel" || passWord.value !== "password") {
    console.log("fail");
    alert("Incorrect username or password");
  } else {
    console.log("error");
    alert("error 404");
  }
}

logIn.addEventListener("click", checkCredentials);
