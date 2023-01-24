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
    zip.loadAsync(file).then(function (unzippedFile) {
        const unzipFile = unzippedFile;
        unzippedFile.forEach(function (relativePath, zipEntry) {
            if (zipEntry.name.endsWith(".opf")) {
                unzippedFile.file(zipEntry.name).async("string").then(function (content) {
                    // let readableContent = parseXhtml(content);
                    // console.log(content);
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
                    // console.log(spineIds);
                    const hrefs = []
                    for (const id of spineIds) {
                        hrefs.push(manifest.querySelector('item[id=' + id + ']').getAttribute("href"));
                    }
                    console.log(hrefs);
                    switch (version) {
                        case 3:
                            // parseEpub3(unzippedFile)
                            for (const href of hrefs) {
                                // unzipFile.filter(filename => filename.contains(href));
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
                                // unzipFile.filter(filename => filename.contains(href));
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
                        default:
                            break;
                    }

                });
            };
        });
    });


    console.log("Success");
};


function parseEpubV3(xhtmlText) {
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
