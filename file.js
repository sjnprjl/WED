function openFiles() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";

  // Append the input element to the body
  document.body.appendChild(fileInput);

  // Trigger a click event on the input element
  fileInput.click();

  return new Promise((res, _) => {
    // Listen for the change event on the input element
    fileInput.addEventListener("change", function(e) {
      // Handle the selected file here
      document.body.removeChild(fileInput);
      res(e.target.files);
    });
  });
}

async function readFile(file) {
  const reader = new FileReader();

  reader.readAsText(file);
  return new Promise((res, rej) => {
    reader.onload = function(e) {
      if (/*TODO: error */ false) {
        rej();
      }
      return res(e.target.result);
    };
  });
}
