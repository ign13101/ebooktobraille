"use strict";


function main() {
    
    headerModify();
}

function headerModify() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    const linkElement = document.querySelector(`a[href='${page}']`);
    linkElement.classList.add("active");
}

document.addEventListener("DOMContentLoaded", main);