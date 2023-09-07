// ==UserScript==
// @name         Leiden Supercharger
// @description  Enhances the Leiden University course sites with a unified and improved design
// @namespace    https://liacs.leidenuniv.nl/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leidenuniv.nl
// @version      1.1
// @author       MrKev312
// @match        https://liacs.leidenuniv.nl/~*/
// @match        https://liacs.leidenuniv.nl/~*/*.html
// @match        https://liacs.leidenuniv.nl/~*/*.php
// @updateURL    https://github.com/MrKev312/Leiden-Supercharger/raw/main/Leiden-Supercharger.user.js
// ==/UserScript==
const CSSTemplate = `
body {
    font-family: Arial, sans-serif;
    font-size: 1em;
    color: #333;
    line-height: 1.5;
    width: 100%;
    margin: 0;
    background-color: #D9E4ED;
}

.container {
    width: 1000px;
    max-width: 90%;
    margin: 0 auto 50px;
    padding: 0 25px;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

h1.title {
    background-color: #006699;
    color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: 100%;
}

a {
    color: #006699;
    text-decoration: underline;
}

h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0.5em;
    text-align: center;
    color: #006699;
}

h1 {
    font-size: 3em;
}

h2 {
    font-size: 1.5em;
}

hr {
    border: 0;
    border-top: 1px solid #ddd;
}

ul {
    list-style-type: circle;
    padding: 0;
}

li {
    margin-bottom: 1em;
    margin-left: 2em;
}

table {
    border-collapse: collapse;
    margin: 0 auto;
}

td,
th {
    border: 1px solid #ccc;
    padding: 0.5em;
}

th {
    background-color: #ddd;
}`;

const TitlebarCSS = `
h1.title {
    margin: 0;
}

td.titlerow {
    background-color: #E5EFF4 !important;
}

nav ul a {
    text-decoration: none;
}

nav.navcontainer {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    z-index: 1;
    background-color: #E5EFF4;
    position: sticky;
    top: 0px;
}

nav ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: auto;
    align-items: center;
    padding: 0;
}

nav ul li {
    margin: 0 10px;
}

nav ul li form {
    margin: 0;
    padding: 0;
}

nav ul ul {
    list-style: "»";
    margin: 0;
    padding: 0;
}

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #E5EFF4;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    border: 1px solid;
    z-index: 2;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-content a {
    padding: 8px 8px;
    text-decoration: none;
    display: block;
}

.dropdown-content a:hover {
    background-color: #ddd;
}`;

var searchURL;

(function() {
    'use strict';
    var logMessage = "Script loaded\n\t";
    var urlFunctions = {
        'https:\/\/liacs.leidenuniv.nl\/~kosterswa\/pm\/': PMHTML,
        'https:\/\/liacs\.leidenuniv\.nl\/~stefanovtp\/courses\/[A-Za-z0-9_]+\/': PlainHTML,
        'https:\/\/liacs\.leidenuniv\.nl\/~vlietrvan1\/[A-Za-z0-9_]+\/': PlainHTML,
        'https:\/\/liacs\.leidenuniv\.nl\/~hoogeboomhj\/[A-Za-z0-9_]+\/': PlainHTML,
        'https:\/\/liacs\.leidenuniv\.nl\/~basoldh\/education\/[A-Za-z0-9_]+\/': BasoldhHTML,

    };

    for (var url in urlFunctions) {
        var regex = new RegExp(url);
        var match = regex.exec(window.location.href);
        if (match) {
            console.log(logMessage + `- Running in ${urlFunctions[url].name} mode\n\t- Search scope of ${match[0]}`);
            searchURL = match[0];
            urlFunctions[url](); // pass the first group match to the function

            break;
        }
    }
})();

function PMHTML() {
    // Eerst ff opschonen
    CleanUp();

    // Get the page container
    const container = document.querySelector('.container');

    // Does this page have a container with height of 84?
    if (container && container.querySelector('table[height="84"]')) {
        // Remove pics
        let imgFound = false;
        while (container.firstChild && container.firstChild.nodeName !== 'IMG') {
            container.removeChild(container.firstChild);
            imgFound = true;
        }

        if (imgFound) {
            container.removeChild(container.firstChild);
        }

        const imgElements = document.querySelectorAll('img[src="images/bottom.jpg"]');

        for (const img of imgElements) {
            img.remove();
        }

        const navbar = "<h1 class=\"title\">Programmeermethoden</h1>";

        const navItems = `
<li><a href="index.php">Home</a></li>
<li class="dropdown">
    <a href="#">Algemeen</a>
    <ul class="dropdown-content">
        <li><a href="inhoud.php">Inhoud</a></li>
        <li><a href="schema.php">Activiteiten</a></li>
        <li><a href="staf.php">Personeel</a></li>
    </ul>
</li>
<li class="dropdown">
    <a href="#">Materiaal</a>
    <ul class="dropdown-content">
        <li><a href="college.php">Sheets</a></li>
        <li><a href="videos.php">Videos</a></li>
        <li><a href="handouts.php">Handouts</a></li>
        <li><a href="boeken.php">Boeken</a></li>
        <li><a href="tentamens.php">Oude tentamens</a></li>
        <li><a href="links.php">Links</a></li>
    </ul>
</li>
<li class="dropdown">
    <a href="#">Opdrachten en Cijfers</a>
    <ul class="dropdown-content">
        <li><a href="opdrachten.php">Opdrachten</a></li>
        <li><a href="inlever.php">Inleveren</a></li>
        <li><a href="https://brightspace.universiteitleiden.nl/">Cijfers: Brightspace</a></li>
        <li><a href="huisregels.php">Huisregels</a></li>
    </ul>
</li>`
        container.insertAdjacentHTML("beforebegin", navbar);
        GenerateNavbarHTML(container, navItems)
    }
    else {
        PlainHTML();
        return;
    }

    SetCSS(CSSTemplate);
}

function BasoldhHTML() {
    // First, perform cleanup on the page
    CleanUp();

    // Wrap the page content in a container div
    const container = Containerize();

    // Delete useless elements
    document.querySelector("aside").outerHTML = "";
    document.querySelector("div.footer-container").outerHTML = "";

    // Find all div elements with class vertnav
    var navul = document.querySelector("div.vertnav").querySelector("ul");
    var vertnavs = navul.children;

    // For each vertnav found, get the inner ul and apply the class dropdown-content
    for (var i = 0; i < vertnavs.length; i++) {
        var ul = vertnavs[i].querySelector("ul");
        if (!ul) {
            // If no inner ul is found, skip to the next one
            continue;
        }
        var oldParent = ul.parentNode;
        // Add the dropdown-content class to the inner ul
        ul.classList.add("dropdown-content");
        // Reparent the inner ul to the parent's parent and remove the old parent
        ul.parentNode.parentNode.insertBefore(ul, ul.parentNode);
        oldParent.parentNode.removeChild(oldParent);
        // Add the dropdown class to the new parent
        ul.parentNode.classList.add("dropdown");
    }

    // Generate the navigation bar using the container and the inner HTML of the navul
    GenerateNavbarHTML(container, navul.innerHTML);

    // Remove the original navigation bar from the page
    navul.parentNode.removeChild(navul);

    // Add CSS styles to the page using the CSSTemplate
    SetCSS(CSSTemplate);
}

function PlainHTML() {
    // First, perform cleanup on the page
    CleanUp();

    // Wrap the page content in a container div
    const container = Containerize();

    // Generate the navigation bar
    GenerateNavbarHTML(container, null)

    // Add CSS styles to the page using the CSSTemplate
    SetCSS(CSSTemplate);
}

function Containerize() {
    // Banner
    var h1Element = null;
    // Create a new div element to be used as a container
    var container = document.createElement("div");
    container.className = "container";

    container.innerHTML = document.body.innerHTML

    // Get a list of child elements of the body to keep
    var childElements = Array.from(container.children).filter(function(element) {
        // Check if the current element is an H1 and if it is the first one found
        if (!h1Element && element.tagName === 'H1') {
            // Store the H1 element for later use
            h1Element = element;
            // Do not include the H1 element in the childElements list
            return false;
        }
        // Include all other elements in the childElements list
        return true;
    });

    // Check if an H1 element was found
    if (h1Element) {
        // Add the 'title' class to the H1 element
        h1Element.className = "title";
    } else if (document.title){
        // Create a new H1 element with the title of the page
        h1Element = document.createElement("h1");
        h1Element.innerHTML = document.title;
        h1Element.className = "title";
    }

    // Remove the original body and make a new one
    var newBody = document.createElement("body");
    document.body.parentNode.replaceChild(newBody, document.body);

    // Reparent the title if it exists
    if (h1Element){
        document.body.appendChild(h1Element);
    }

    // Append the container to the new body
    newBody.appendChild(container);
    // Return the container
    return container;
}

function RemoveCSS() {
    // Remove all stylesheets
    for (let i = 0; i < document.styleSheets.length; i++) {
        document.styleSheets[i].disabled = true;
    }

    // Remove all style elements
    for (let styleElement of document.querySelectorAll('style')) {
        styleElement.parentNode.removeChild(styleElement);
    }
}

function RemoveFonts() {
    // Get all font elements
    var fontElements = document.querySelectorAll('font');
    for (var i = 0; i < fontElements.length; i++) {
        var fontElement = fontElements[i];
        var fontColor = fontElement.getAttribute("color");

        //Check if the font element is inside a header tag
        var insideHeader = fontElement.closest('h1, h2, h3, h4, h5, h6');

        if (fontColor && !insideHeader){
            Array.from(fontElement.attributes).forEach(attribute => {
                if (attribute.name !== "color") {
                    fontElement.removeAttribute(attribute.name);
                }
            });

            continue;
        }

        // Get all child nodes of the font element
        var childNodes = fontElement.childNodes;

        // Loop through all child nodes and add them to the parent element
        while (childNodes.length > 0) {
            var currentChild = childNodes[0];
            if(!insideHeader && fontColor){
                currentChild.style.color = fontColor;
            }
            fontElement.parentNode.insertBefore(currentChild, fontElement);
        }

        // Remove the font element from the parent element
        fontElement.parentNode.removeChild(fontElement);
    }
}

function CleanUp() {
    /// Remove empty rows from tables
    RemoveEmptyRows();

    /// Remove all CSS
    RemoveCSS();

    /// Remove all fonts
    RemoveFonts();

    /// Remove all other stylings and empty elements
    // Get all elements
    var elements = document.querySelectorAll('*');

    // Loop through all elements
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        // Remove align, color, and style attributes
        element.removeAttribute("style");
        element.removeAttribute("width");
        element.removeAttribute("background");

        // Images can keep alignment!
        if(element.nodeName !== "IMG") {
            element.removeAttribute("align");
        }

        // Don't remove the font colors!
        if(element.nodeName !== "FONT"){
            element.removeAttribute("color");
        }

        const nonEmptyTags = ["HR", "BR", "IMG", "TD", "TH"];
        if (!nonEmptyTags.includes(element.tagName) && element.children.length === 0 && element.textContent.trim() === "") {
            element.parentNode.removeChild(element);
            element.remove();
        }
    }
}

function RemoveEmptyRows() {
    /// Remove empty rows from tables
    // Get all tables
    const tables = document.querySelectorAll('table');
    // Loop through all tables
    for (var i = 0; i < tables.length; i++) {
        const table = tables[i];

        // Get all rows in the table
        const rows = table.querySelectorAll("tr");

        // Loop through all rows
        for (var j = 0; j < rows.length; j++) {
            var row = rows[j];

            // If the row has no cells or only empty cells, remove it
            if ((row.querySelectorAll("td").length == 0 ||
                 row.textContent.trim() == "") && row.querySelectorAll('img').length == 0) {
                row.parentNode.removeChild(row);
            }
        }
    }
}

function GenerateNavbarHTML(container, navItems) {
    let navbarHTML = `<nav class="navcontainer"><ul>`;

    if (navItems){
        navbarHTML += navItems;
    }

    if (searchURL) {
        navbarHTML += `<li><div>
        <form action="https://www.google.com/search" class="searchform" method="get" name="searchform">
            <input name="sitesearch" type="hidden" value="${searchURL}">
            <input autocomplete="on" class="form-control search" name="q" placeholder="Search in ${document.title}" required="required" type="text">
            <button class="button" type="submit">Search</button>
        </form></div></li>`;
    }

    navbarHTML += '</ul></nav>';

    if (document.querySelector('.title')){
        document.querySelector('.title').insertAdjacentHTML("afterend", navbarHTML);
    } else if (container){
        container.insertAdjacentHTML("beforebegin", navbarHTML);
    }

    SetCSS(TitlebarCSS);
}

function SetCSS(css) {
    // Create a new style element
    var styleElement = document.createElement('style');

    // Set the style element's content to be the CSS
    styleElement.innerHTML = css;

    // Add the style element to the head of the document
    document.head.appendChild(styleElement);
}
