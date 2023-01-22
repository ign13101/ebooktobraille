"use strict";

function main() {
    console.log("Start");
    let registerForm = document.getElementById("form-ebook-upload");
    registerForm.onsubmit = handleSubmitFile;
}

function handleSubmitFile(event) {
    event.preventDefault();
    const zip = new JSZip();
    let form = event.target;
    let formData = new FormData(form);
    let file = formData.get("file");
    zip.loadAsync(file).then(function (zip) {
        zip.folder("OPS").forEach(function (relativePath, zipEntry) {
            if (zipEntry.name.endsWith(".xhtml")) {
                zip.file(zipEntry.name).async("string").then(function (content) {
                    console.log(zipEntry.name);
                    console.log(content);
                });
            }
        });
    });
    console.log("Success");
}


document.addEventListener("DOMContentLoaded", main);
