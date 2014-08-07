default_config = {"kill_regex": "quote_author..(Yun Taragoashi)",
                  "autoignore": true,
                  "hide_images": true,
                  "hide_fully": false,
                  "hide_link_numbers": false}

function save_options() {
  var text_area = document.getElementById("kill_regex");
  var kill_regex = text_area.value;

  var hide_images = document.getElementById("hide_images").checked;

  var autoignore = document.getElementById("autoignore").checked;

  var hide_fully = document.getElementById("hide_fully").checked;

  var hide_link_numbers = document.getElementById("hide_link_numbers").checked;

  var configuration = {"kill_regex": kill_regex,
                       "hide_images": hide_images,
                       "autoignore": autoignore,
                       "hide_fully": hide_fully,
                       "hide_link_numbers": hide_link_numbers};
  console.log("Saving configuration:");
  console.log(configuration);
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
  if (response && response.configuration) {
    var configuration = response.configuration;
    console.log("Using configuration from chrome.sync:")
    console.log(configuration);
    for (var key in default_config) {
      if (configuration[key] == undefined) {
        console.log(key + " was undefined, using default value.");
        configuration[key] = default_config[key];
      }
    }
  }
  else {
    console.log("Using default configuration.")
    var configuration = default_config;
  }

  var text_area = document.getElementById("kill_regex");
  text_area.value = configuration.kill_regex;

  var boolean_properties = ["hide_images", "autoignore", "hide_fully", "hide_link_numbers"];
  for (i = 0; i < boolean_properties.length; ++i) {
    document.getElementById(boolean_properties[i]).checked = configuration[
        boolean_properties[i]];
  }
}

function string_to_bool(string, default_option){
  if (default_option) 
    return (string.toLowerCase().charAt(0) != "f" );
  else
    return (string.toLowerCase().charAt(0) == "t" );
}

document.addEventListener('DOMContentLoaded', load_config);
document.querySelector('#save').addEventListener('click', save_options);
