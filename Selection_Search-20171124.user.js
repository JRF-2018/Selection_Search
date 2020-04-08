// ==UserScript==
// @name        Selection Search
// @namespace   http://jrf.cocolog-nifty.com/
// @include     *
// @version     0.2
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.openInTab
// @grant       GM_openInTab
// ==/UserScript==

var aboutmeURL = "http://jrf.cocolog-nifty.com/statuses/jumpbytitle.html?q=";
var googleURL = "http://www.google.com/search?hl=en&safe=off&lr=lang_ja&pws=0&q=";
var wikipediaURL = "http://ja.wikipedia.org/wiki/:Search?fulltext=%E6%A4%9C%E7%B4%A2&search=";
var amazonURL = "http://www.amazon.co.jp/exec/obidos/external-search/?mode=blended&field-keywords=";

var contextMenu = document.body.getAttribute('contextmenu');
var cmenu = (contextMenu)? $('menu#' + contextMenu) : null;
if (! cmenu) {
  cmenu = document.createElement('menu');
  cmenu.setAttribute('id', 'gm-registered-menu');
  cmenu.setAttribute('type', 'context');
  document.body.appendChild(cmenu);
  document.body.setAttribute('contextmenu', 'gm-registered-menu');
}

var menu = document.createElement('menu');
menu.innerHTML = '<menuitem label="Open Text Links"></menuitem>\
                  <menuitem label="Google"></menuitem>\
                  <menuitem label="Wikipedia"></menuitem>\
                  <menuitem label="Amazon"></menuitem>';
menu.setAttribute('id', "selection-search-menu");
menu.setAttribute('label', "Search\u2026");
cmenu.appendChild(menu);

var html = document.documentElement;
// If browser supports contextmenu
if ("contextMenu" in html && "HTMLMenuItemElement" in window) {
  // Executed on clicking a menuitem
  $("#selection-search-menu").addEventListener("click", search, false);
}

function search(e) {
  var text = window.getSelection().toString();
  if (text == "") {
    var node = document.activeElement;
    if (node && (node.type == "text" || node.type == "textarea")
	&& 'selectionStart' in node
	&& node.selectionStart != node.selectionEnd) {
      var start = Math.min(node.selectionStart, node.selectionEnd);
      var end = Math.max(node.selectionStart, node.selectionEnd);
      text = node.value.substr(start, end - start);
    }
  }
  if (text == "") {
    text = prompt("Search:", "");
  }
  if (! text) return;

  switch (e.target.label) {
    case "Open Text Links":
      open_text_links(text);
      break;
    case "Google":
      text = encodeURIComponent(text);
      GM.openInTab(googleURL + text);
      break;
    case "Wikipedia":
      text = encodeURIComponent(text);
      GM.openInTab(wikipediaURL + text);
      break;
    case "Amazon":
      text = encodeURIComponent(text);
      GM.openInTab(amazonURL + text);
      break;
    default:
      alert(title + "\n" + url);
  }
}

function open_text_links (sel) {
  var links = [];

  for (var s = sel, sel = ""; s.match(/(?:(?:cocolog|aboutme)\:[01-9]+)|(?:(?:h?ttps?|ftp)(?::\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))/m);) {
    s = RegExp.rightContext;
    var href = RegExp.lastMatch;
    if (href.match(/^ttp/)) {
      href = "h" + href;
    }
    if (href.match(/\)$/) && ! href.match(/\(/)) {
      href = href.substr(0, href.length - 1);
    }
    links.push(href);
  }

  if (links.length == 0) {
    alert("No link.");
    return;
  }

  for (var i = 0; i < links.length; i++) {
    var href = links[i];
    if (href.match(/^(?:cocolog|aboutme)/)) {
      href = aboutmeURL + encodeURIComponent(href);
    }
    GM.openInTab(href);
  }
}

function $(aSelector, aNode) {
  return (aNode || document).querySelector(aSelector);
}
