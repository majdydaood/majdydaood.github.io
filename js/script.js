let history = [];
let historyIndex = -1;
let color = "default";
let lang = "fr";
let theme = "dark";

let cons = document.getElementById("console");
var input = document.getElementById("input");

translate();

document.addEventListener("keydown", function (event) {
  if (event.code == "NumpadEnter" || event.code == "Enter" || event.key == "Enter") {
    event.preventDefault();

    let div = document.createElement("div");
    div.classList.add("command");

    let prefix =
      "<div><span>" +
      _("prefix") +
      "</span><span class='margin-start'>" +
      input.value +
      "</span></div>";

    let reponse = document.createElement("div");

    let command = input.value;
    command = command.toLowerCase().trim();

    let runCommand = function (page) {
      let httpRequest = new XMLHttpRequest();

      if (!httpRequest) {
        return false;
      }
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            putData(httpRequest.responseText);
          } else {
            putData(_("commandErrorMsg"));
          }
        }
      };
      httpRequest.open("GET", page);
      httpRequest.send();
    };

    let putData = function (data) {
      div.innerHTML = prefix;
      reponse.innerHTML = data;
      div.appendChild(reponse);
      cons.appendChild(div);
      window.scrollTo(0, document.body.scrollHeight);
      coloring(color);
    };

    // parsing commands

    // cls
    if (command == "cls") {
      document.querySelectorAll(".command").forEach((element) => {
        element.remove();
      });

      // help
    } else if (command == "help" || command == "h") {
      runCommand(_("helpCmd"));

      // md -p
    } else if (command == "md -p" || command == "p" || command == "cd p") {
      runCommand(_("pCmd"));

      // md -f
    } else if (command == "md -f" || command == "f" || command == "cd f") {
      runCommand(_("fCmd"));

      // md -e
    } else if (command == "md -e" || command == "e" || command == "cd e") {
      runCommand(_("eCmd"));

      // md -c
    } else if (command == "md -c" || command == "c" || command == "cd c") {
      runCommand(_("cCmd"));

      // md -r
    } else if (command == "md -r" || command == "r" || command == "cd r") {
      runCommand(_("rCmd"));

      // md -i
    } else if (command == "md -i" || command == "i" || command == "cd i") {
      runCommand(_("iCmd"));

      // md -v
    } else if (command == "md -v" || command == "v") {
      putData(_("head"));

      // dir
    } else if (command == "dir") {
      runCommand(_("dirCmd"));

      // cd
    } else if (command.startsWith("cd")) {
      putData(_("cdMsg"));

      // empty
    } else if (command == "") {
      putData("");

      // color
    } else if (command == "color green") {
      color = "green";
    } else if (command == "color blue") {
      color = "blue";
    } else if (command == "color default") {
      color = "default";

      // theme
    } else if (command == "theme dark") {
      theme = "dark";
    } else if (command == "theme light") {
      theme = "light";

      // lang
    } else if (command == "lang en") {
      lang = "en";
    } else if (command == "lang fr") {
      lang = "fr";
      //
    } else {
      putData("'" + command + "' " + _("commandNotFoundMsg"));
    }

    history.push(command);
    historyIndex = -1;
    input.value = "";
    resizeInput.call(input);
    coloring(color);
    translate();
  }

  // manage command history
  if (event.code == "ArrowUp") {
    if (historyIndex == -1) {
      historyIndex = history.length - 1;
    } else {
      if (historyIndex != 0) {
        historyIndex -= 1;
      }
    }
    if (historyIndex != -1) {
      input.value = history[historyIndex];
      resizeInput.call(input);
    }
  } else if (event.code == "ArrowDown") {
    if (historyIndex == -1) {
      historyIndex = history.length - 1;
    } else {
      if (historyIndex != history.length) {
        historyIndex += 1;
      }
    }
    if (historyIndex != history.length && historyIndex !== -1) {
      input.value = history[historyIndex];
      resizeInput.call(input);
    }
  }
});

let toggle = false;
setInterval(() => {
  document.getElementById("marker").innerHTML = toggle ? "_" : "";
  toggle = !toggle;
}, 500);

document.addEventListener("keydown", function () {
  input.focus();
});

document.addEventListener("touchend", function () {
  input.focus();
  input.click();
});

document.addEventListener("click", function () {
  input.focus();
  input.click();
});

input.addEventListener("input", resizeInput);
resizeInput.call(input);

input.focus();
input.click();

function resizeInput() {
  this.style.width = this.value.length+1 + "ch";
  var _this = this;
  setTimeout(() => {
    _this.selectionStart = _this.selectionEnd = _this.value.length;
  }, 0);
}

function coloring(color) {
  document.querySelectorAll("body,a,#input").forEach((element) => {
    element.classList.value = "";

    if (theme == "dark") {
      switch (color) {
        case "default":
          element.classList.add("white");
          break;
        case "blue":
          element.classList.add("lightblue");
          break;
        case "green":
          element.classList.add("lightgreen");
          break;
      }
    } else if (theme == "light" ) {
      switch (color) {
        case "default":
          element.classList.add("black");
          break;
        case "blue":
          element.classList.add("darkblue");
          break;
        case "green":
          element.classList.add("darkgreen");
          break;
      }
    }
    element.classList.add(theme);
  });
}

function _(str) {
  if (lang == "fr") {
    return strings[str].fr;
  } else {
    return strings[str].en;
  }
}

function translate() {
  document.getElementById("prefix").innerHTML = _("prefix");
  document.getElementById("head").innerHTML = _("head");
}
