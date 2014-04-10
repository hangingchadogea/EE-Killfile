default_config = {"kill_regex": "quote_author..(Yun Taragoashi)",
                  "autoignore": true,
                  "hide_images": true}

function save_options() {
  var text_area = document.getElementById("kill_regex");
  var kill_regex = text_area.value;

  var hide_images = document.getElementById("hide_images").checked;

  var autoignore = document.getElementById("autoignore").checked;

  var configuration = {"kill_regex": kill_regex,
                       "hide_images": hide_images,
                       "autoignore": autoignore};
  chrome.storage.sync.set({"configuration": configuration}, updateStatus);
}

// Update status to let user know options were saved.
function updateStatus() {
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function load_config() {
  chrome.storage.sync.get("configuration", restore_options);
}

// Restores select box state to saved value from localStorage.
function restore_options(response) {
  if (response && response.configuration)
    var configuration = response.configuration;
  else {
    var configuration = default_config;
  }
  var kill_regex = configuration.kill_regex;
  var text_area = document.getElementById("kill_regex");
  text_area.value = kill_regex;

  var hide_images = configuration.hide_images;
  document.getElementById("hide_images").checked = hide_images;

  var autoignore = configuration.hide_images;
  document.getElementById("autoignore").checked = autoignore;
}

function string_to_bool(string, default_option){
  if (default_option) 
    return (string.toLowerCase().charAt(0) != "f" );
  else
    return (string.toLowerCase().charAt(0) == "t" );
}

document.addEventListener('DOMContentLoaded', load_config);
document.querySelector('#save').addEventListener('click', save_options);
