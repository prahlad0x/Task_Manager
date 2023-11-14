const url = "https://quiz-server-27y4.onrender.com/Task/user";

let container = document.getElementById("container");
let loader = document.getElementById("loader");
/// for registering
let usernameInp = document.getElementById("usernameInp");
let emailInp = document.getElementById("emailInp");
let passwordInp = document.getElementById("pass1Inp");
let pass2Inp = document.getElementById("pass2Inp");
let si_Btn = document.getElementById("signin_btn");

// for login
let l_email = document.getElementById("l_emailInp");
let l_pass = document.getElementById("l_passInp");
let lo_Btn = document.getElementById("login_btn");

// register logic

si_Btn.addEventListener("click", (e) => {
  let username = usernameInp.value;
  let email = emailInp.value;
  let password = passwordInp.value;

  if (username == "" || email == "" || password == "") {
    swal("Please enter valid details!", {
      icon: "warning",
    });
    return;
  }

  if (password != pass2Inp.value) {
    swal("Password does not match!", { icon: "warning" });
    return;
  }

  if (password.length < 4) {
    swal("Password must contain atleast 4 characters!", { icon: "warning" });
    return;
  }

  fetch(`${url}/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.isOk) {
        swal("Registration Successful ", { icon: "success" }).then((re) => {
          toggle();
        });
      } else {
        swal(data.msg, { icon: "info" });
      }
      loader.style.display = "none";
    });
});

// login logic
lo_Btn.addEventListener("click", (e) => {
  let email = l_email.value;
  let password = l_pass.value;

  if (email == "" || password == "") {
    swal("Please enter valid details!", {
      icon: "warning",
    });
    return;
  }

  loader.style.display = "flex";

  fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.isOk) {
        swal("Login Successful ", { icon: "success" }).then((re) => {
          localStorage.setItem("token", data.token);
          window.location.href = "../index.html";
        });
      } else {
        swal(data.msg, { icon: "info" });
      }
      loader.style.display = "none";
    });
});

/// toggling wala thing
toggle = () => {
  container.classList.toggle("sign-in");
  container.classList.toggle("sign-up");
};

setTimeout(() => {
  container.classList.add("sign-in");
}, 200);
