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
    console.log(file);
    zip.loadAsync(file).then(function (unzippedFile) {
        console.log("zip " + zip);
    // it is necesary to check the version of the epub before converting it to text, they have different structures
    // it is redundant to check for the OPS folder, it may instead appear as OEBPS, or not at all
    // to check the version you need to look for the version attribute in the package tag in the .opf file
    // version 2 epubs use html files, so you'll have to take that into account
        unzippedFile.folder("OPS").forEach(function (relativePath, zipEntry) {
            console.log("relative path " + relativePath);
            console.log("zipentry " + zipEntry)
            if (zipEntry.name.endsWith(".xhtml")) {
                unzippedFile.file(zipEntry.name).async("string").then(function (content) {
                    let readableContent = parseXhtml(content);
                    
                    // console.log(zipEntry.name);
                    // console.log(readableContent);
                });
            }
        });
    });
    console.log("Success");
}

function parseXhtml(xhtmlText) {
    const parser = new DOMParser();
    const xhtmlDoc = parser.parseFromString(xhtmlText, "application/xhtml+xml");
    const allElements = xhtmlDoc.getElementsByTagName("*");
    let readableText = "";
    for (let i = 0; i < allElements.length; i++) {
        readableText += allElements[i].textContent + " ";
    }
    
    return readableText;

}


document.addEventListener("DOMContentLoaded", main);
