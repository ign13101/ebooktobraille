"use strict";

function main() {

    console.log("Start");
    let registerForm = document.getElementById("form-ebook-upload");
    registerForm.onsubmit = handleSubmitFile;
}

// TO DO: reformat this into different functions, maybe different files
// TO DO: add meaningful coments
// TO DO: check if EPUBv3 can have html files, and consider using the same functions for both
// TO DO: check if the variable types used are optimal

function handleSubmitFile(event) {

    event.preventDefault();
    const zip = new JSZip();
    let form = event.target;
    let formData = new FormData(form);
    let file = formData.get("file");
    zip.loadAsync(file).then(function (unzippedFile) {
        const unzipFile = unzippedFile;
        unzippedFile.forEach(function (relativePath, zipEntry) {
            if (zipEntry.name.endsWith(".opf")) {
                unzippedFile.file(zipEntry.name).async("string").then(function (content) {
                    const parser = new DOMParser();
                    const opfDoc = parser.parseFromString(content, "text/xml");
                    console.log(opfDoc.querySelector("package"));
                    const version = parseInt(opfDoc.querySelector("package").getAttribute("version"));
                    const spine = opfDoc.querySelector("spine");
                    const manifest = opfDoc.querySelector("manifest");
                    console.log(version);
                    console.log(spine);
                    const spineIds = []
                    for (const item of spine.querySelectorAll("itemref")) {
                        spineIds.push(item.getAttribute("idref"));
                    }
                    const hrefs = []
                    for (const id of spineIds) {
                        hrefs.push(manifest.querySelector('item[id=' + id + ']').getAttribute("href"));
                    }
                    console.log(hrefs);
                    switch (version) {
                        case 3:
                            for (const href of hrefs) {
                                unzipFile.forEach(function (relativePath, zipEntry) {
                                    if (zipEntry.name.includes(href)) {
                                        if (zipEntry.name.endsWith(".xhtml") || zipEntry.name.endsWith(".html")) {
                                            console.log(zipEntry.name);
                                            unzipFile.file(zipEntry.name).async("string").then(function (content) {
                                                let readableContent = parseEpubV3(content);
                                                console.log(readableContent)
                                                // console.log(readableContent);
                                            });
                                        }
                                    }
                                });
                            }
                            break;

                        case 2:
                            for (const href of hrefs) {
                                unzipFile.forEach(function (relativePath, zipEntry) {
                                    if (zipEntry.name.includes(href)) {
                                        if (zipEntry.name.endsWith(".xhtml")) {
                                            console.log(zipEntry.name);
                                            unzipFile.file(zipEntry.name).async("string").then(function (content) {
                                                let readableContent = parseEpubV3(content);
                                                // check if it contains any character different from whitespace
                                                if (/\S/.test(readableContent)) {
                                                    console.log(readableContent);
                                                }
                                            });
                                        }
                                        if (zipEntry.name.endsWith(".html")) {
                                            console.log(zipEntry.name);
                                            unzipFile.file(zipEntry.name).async("string").then(function (content) {
                                                let readableContent = parseEpubV2(content);
                                                // check if it contains any character different from whitespace
                                                if (/\S/.test(readableContent)) {
                                                    console.log(readableContent);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            break;
                        default:
                            break;
                    }
                });
            };
        });
    });


    console.log("Success");
};


// you should consider excluding a tags, as they usually have no meaning in the book, only digital books 
// whose purpose is to skip a couple of pages might use it

function parseEpubV3(xhtmlText) {
    const parser = new DOMParser();
    const xhtmlDoc = parser.parseFromString(xhtmlText, "application/xhtml+xml");
    const allElements = xhtmlDoc.body.getElementsByTagName("*");
    let readableText = "";
    for (let i = 0; i < allElements.length; i++) {
        readableText += allElements[i].textContent + " ";
    }
    return readableText;

}

function parseEpubV2(htmlText) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlText, "application/xhtml+xml");
    const allElements = htmlDoc.body.getElementsByTagName("*");
    let readableText = "";
    for (let i = 0; i < allElements.length; i++) {
        readableText += allElements[i].textContent + " ";
    }

    return readableText;

}


document.addEventListener("DOMContentLoaded", main);
