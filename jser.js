//<![CDATA[

var editor = $('editor');
var cursor = $('cursor');
var cursorInterval;
var nonprintingKeyInterval;

function insertElement(type) {
	// Create a new element and insert it before the cursor
	var element = new Element(type);

	// If the new element is a block element
	if ((type == 'UL') || (type == 'OL')) {
		// Move the cursor out of the containing <p>, <ul> or <ol>, if any exists
		node = findBlockAncestor(cursor);
		if (node) {
			placeCursor('after', node);
		}
	} 

	// Insert the new element before the cursor
	cursor.parentNode.insertBefore(element, cursor);

	// If the element was a <br />
	if (type == "BR") {
		// Move the cursor after it
		placeCursor("after", cursor.previousSibling);
	// For all other element types
	} else {
		// Move the cursor into the element
		placeCursor("top", cursor.previousSibling);

		// If the element was a <p>, <ul> or <ol>
		if ((type == "P") || (type == "UL") || (type == "OL")) {
			// Set the element as text-align: left
			toggleButton('left');
		}
	}
}

function processKeyPress(event) {
	restartCursorInterval();
	Event.stop(event);

	switch(event.which) {
		case (Event.KEY_BACKSPACE):
			insertBackspace(); 
			break;
		case (Event.KEY_DELETE):
		case 0:
			break;
		// Handle ctrl-b
		case 98:
			if (event.ctrlKey) {
				toggleButton('b');
			} else {
				insertCharacter(event.which);
			}
			break;
		// Handle ctrl-i
		case 105:
			if (event.ctrlKey) {
				toggleButton('i');
			} else {
				insertCharacter(event.which);
			}
			break;
		// Handle ctrl-u
		case 117:
			if (event.ctrlKey) {
				toggleButton('u');
			} else {
				insertCharacter(event.which);
			}
			break;
		case (Event.KEY_ESC):
			break;
		case (Event.KEY_RETURN):
			insertNewline(); 
			break;
		default:
			insertCharacter(event.which);
	}
}

function processKeyDown(event) {
	switch(event.which) {
		case (Event.KEY_ESC):
			Event.stop(event);
			break;
		case 0:
		case (Event.KEY_DELETE):
		// '.' key
		case 190:
			repeatNonprintingKey(event);
			processNonprintingKey(event);
			break;
		case (Event.KEY_RIGHT):
			if (event.ctrlKey) {
				// Move the cursor forward to the end of the word boundary
				node = findEndOfWord(cursor.nextSibling);
				if (node) {
					placeCursor("before", node);
				} else {
					placeCursor("bottom", cursor.parentNode);
				}
			} else {
				repeatNonprintingKey(event);
				processNonprintingKey(event);
			}
			break;
		case (Event.KEY_LEFT):
			if (event.ctrlKey) {
				// Move the cursor backward to the start of the word boundary
				node = findStartOfWord(cursor.previousSibling);
				if (node) {
					placeCursor("after", node);
				} else {
					placeCursor("top", cursor.parentNode);
				}
			} else {
				repeatNonprintingKey(event);
				processNonprintingKey(event);
			}
			break;
		case (Event.KEY_HOME):
			if (event.ctrlKey) {
				// Move the cursor to the start of #editor
				placeCursor("top", editor.firstChild);
			} else {
				// Move the cursor the the start of the current element
				placeCursor("top", cursor.parentNode);
			}
			break;
		case (Event.KEY_END):
			if (event.ctrlKey) {
				// Move the cursor to the end of #editor
				placeCursor("bottom", editor.lastChild);
			} else {
				// Move the cursor the the end of the current element
				placeCursor("bottom", cursor.parentNode);
			}
			break;
		default:
			break;
	}
}

function findEndOfWord(node) {
	do {
		node = node.nextSibling;
	}
	while ((node) && (node.nodeValue != "\u00a0"));
	return node;
}

function findStartOfWord(node) {
	do {
		node = node.previousSibling;
	}
	while ((node) && (node.nodeValue != "\u00a0"));
	return node;
}

function processKeyUp() {
	clearInterval(nonprintingKeyInterval);
}

function repeatNonprintingKey(event) {
	clearInterval(nonprintingKeyInterval);
	nonprintingKeyInterval = setInterval('processNonprintingKey(' + event.which + ')', 60);
}

function processNonprintingKey(key) {
	switch(key) {
		case 0:
		case (Event.KEY_DELETE):
			insertDelete();
			break;
		case (Event.KEY_RIGHT):
			moveCursorForwards();
			break;
		case (Event.KEY_LEFT):
			moveCursorBackwards();
			break;
		case 190:
			insertCharacter(46);
			break;
	}
}

function insertCharacter(ascii) {
	var character = encodeCharacter(String.fromCharCode(ascii));
	character = document.createTextNode(character);

	// If #editor is empty
	if (cursor.parentNode.id == "editor") {
		// Create a new paragraph and move the cursor into it
		editor.insertBefore(new Element("P"), cursor);
		placeCursor("top", cursor.previousSibling);

		// Set the paragraph as text-align: left
		toggleButton('left');
	}

	// Insert the new character before the cursor
	cursor.parentNode.insertBefore(character, cursor);
}

function encodeCharacter(character) {
	switch(character) {
		case " ":
			character = "\u00a0";
			break;
		case "<":
			character = "\u003c";
			break;
		case ">":
			character = "\u003e";
			break;
		case "&":
			character = "\u0026";
			break;
	}

	return character;
}

function removeCharacters(startNode, endNode) {
	// While startNode still exists
	while ((startNode != null) && (endNode != null)){
		// Remove the current end node
		if ((endNode.nodeName == "#text") || (endNode.nodeName == "BR")) {
			endNode.parentNode.removeChild(endNode);
		} else {

				// Find the last descendant of endNode
				while ((endNode) && (endNode.lastChild != "") && (endNode.lastChild != null)) {
					endNode = endNode.lastChild;
				}

				// Remove the last descendant of endNode
				endNode.parentNode.removeChild(endNode);

				// If endNode was an empty tag (ie <b/>)
				if ((endNode.nodeValue == null) || (endNode.nodeValue == "")) {
					// Toggle the appearance of the appropriate button
					toggleButtonAppearance(endNode.nodeName);
					// Backspace again into the parent endNode
					insertBackspace();
					return;
				}
		}

		// Decrement endNode
		endNode = endNode.previousSibling;
	}
}

function insertBackspace() {
	if (cursor.previousSibling) {
		removeCharacters(cursor.previousSibling, cursor.previousSibling);
	} else {
		node = cursor.parentNode;
		// FIXME
		// Cursor needs to move up to the parent, then down into the last descendant of the previousSibling of node (I think)
		// Move the cursor to before it's parent node
		placeCursor("before", cursor.parentNode);
		node.parentNode.removeChild(node);
	}
}

function insertDelete() {
	removeCharacters(cursor.nextSibling, cursor.nextSibling);
}

// FIXME: Refactor to allow styling tags within <li>...
// ie parentNode.parentNode is not necessarily the ul or ol
function insertNewline() {
	// If the cursor is in a <li>
	if (cursor.parentNode.nodeName == "LI") {
		// If the <li> isn't empty
		if (cursor.previousSibling) {
			// Insert a new <li> in the parent <ul> or <ol>
			cursor.parentNode.parentNode.appendChild(new Element("LI"));
			// Move the cursor into the new <li>
			placeCursor("top", cursor.parentNode.parentNode.lastChild);
		} else {
			// Remove the <li> and break out of the <ul> or <ol>
			var list = cursor.parentNode.parentNode
			var list_item = cursor.parentNode;
			placeCursor("after", list);
			//alert(list.lastChild);
			list_item.parentNode.removeChild(list_item);
		}
	} else {
		// If the cursor's previous sibling is a <br />
		if ((cursor.previousSibling) && (cursor.previousSibling.nodeName == "BR")) {
			// Remove the previous <br />
			cursor.parentNode.removeChild(cursor.previousSibling);
			// Move the cursor out of the current paragraph
			placeCursor("after", cursor.parentNode);
			// And start a new paragraph before the cursor
			insertElement('P');
		} else {
			// Insert a <br />
			insertElement('BR');
		}
	}
}

function buttonPress(event) {
	var id = Event.findElement(event, "DIV").id;
	toggleButton(id);
}

function toggleButton(id) {
	toggleButtonAppearance(id);

	switch(id) {
		case "b":
		case "i":
		case "u":
		case "ul":
		case "ol":
			tag = id.toUpperCase();
			break;
		case "link":
			toggleLinkLightbox();
			return;
		case "left":
		case "center":
		case "right":
			setTextAlign(id);
			return;
	}

	// If <tag> is an ancestor of the cursor
	ancestor = isAncestor(tag, cursor);
	if (ancestor) {
		if ((tag == "UL") || (tag == "OL")) {
			// Move the cursor out of the list itself, not just the li
			placeCursor("after", cursor.parentNode.parentNode);
		} else {
			// Move the cursor out of the <tag>
			placeCursor("after", cursor.parentNode);
		}
	} else {
		// Open a <tag>
		insertElement(tag);

		// If the tag was a <ul> or an <ol>
		if ((tag == "UL") || (tag == "OL")) {
			// Add a <li></li> as well
			insertElement("LI");
		}
	}

}

function setButtonOff(id) {
	$(id).removeClassName("active");
}

function setButtonOn(id) {
	$(id).addClassName("active");
}

function setTextAlign(alignment) {
	// Turn all text-alignment buttons off
	setButtonOff('left');
	setButtonOff('center');
	setButtonOff('right');

	// Turn this text-alignment button on
	setButtonOn(alignment);

	// Apply this text-align value to the surrounding <p>, <ul> or <ol>
	for (ancestor in cursor.ancestors()) {
		var nodeName = cursor.ancestors()[ancestor].nodeName;
		if ((nodeName == 'P') || (nodeName == 'UL') || (nodeName == 'OL')) {
			cursor.ancestors()[ancestor].style.textAlign = alignment;
			return;
		}
	}
}

function findBlockAncestor(node) {
	var blockAncestors = { 'P':'', 'UL':'', 'OL':'' };

	for (ancestor in node.ancestors()) {
		if (node.ancestors()[ancestor].nodeName in blockAncestors) {
			return node.ancestors()[ancestor];
		}
	}

	return false;
}

function isAncestor(name, node) {
	var ancestor;

	for (ancestor in node.ancestors()) {
		if (node.ancestors()[ancestor].nodeName == name) {
			return true;
		}
	}

	return false;
}

function toggleButtonAppearance(button) {
	// Ensure the id is lowercase
	var id = button.toLowerCase();

	// If the button is already active
	if ($(id).classNames().include("active")) {
		// Deactivate it
		setButtonOff(id);
	} else {
		// Activate it
		setButtonOn(id);
	}
}

function startCursorInterval() {
	cursorInterval = setInterval("toggleCursor()", 800);
}

function stopCursorInterval() {
	clearInterval(cursorInterval);
}

function restartCursorInterval() {
	setCursorVisible();
	clearInterval(cursorInterval);
	cursorInterval = setInterval("toggleCursor()", 800);
}

function toggleCursor() {
	if (cursor.style.visibility == "visible") {
		setCursorHidden();
	} else {
		setCursorVisible();
	}
}

function setCursorHidden() {
	cursor.style.visibility = "hidden";
}

function setCursorVisible() {
	cursor.style.visibility = "visible";
}

function placeCursor(position, node) {
	newCursor = cursor.cloneNode(true);
	cursor.remove();
	clearInterval(cursorInterval);

	switch(position) {
		case "top":
			Element.insert(node, {top: newCursor});
			break;
		case "bottom":
			Element.insert(node, {bottom: newCursor});
			break;
		case "before":
			Element.insert(node, {before: newCursor});
			break;
		case "after":
			Element.insert(node, {after: newCursor});
			break;
	}

	cursor = $('cursor');
	startCursorInterval();
}

function moveCursorBackwards() {
	// If the cursor is not at the start of the text or the start of a <tag>
	if (cursor.previousSibling) {
		switch (cursor.previousSibling.nodeName) {
			// If the previousSibling is a printed character node
			case "#text":
			case "BR":
				placeCursor("before", cursor.previousSibling);
				break;
			// If the previousSibling is a </tag>
			default:
				placeCursor("after", cursor.previousSibling.lastChild);
				moveCursorBackwards();
				break;
		}
	// If the cursor is the first node in a <tag>
	} else if (cursor.parentNode.id != "editor") {
		// Toggle the tag's button appearance
		toggleButtonAppearance(cursor.parentNode.nodeName);
		// Move the cursor out of the <tag>
		placeCursor("before", cursor.parentNode);
		// And move it backwards again over the actual printed character
		moveCursorBackwards();
	}
}

function moveCursorForwards() {
	// If the cursor is not the last node
	if (cursor.nextSibling) {
		switch (cursor.nextSibling.nodeName) {
			case "#text":
			case "BR":
				placeCursor("after", cursor.nextSibling);
				break;
			// If the next node is a <tag>
			default:
				toggleButtonAppearance(cursor.nextSibling.nodeName);
				placeCursor("after", cursor.nextSibling.firstChild);
				break;
		}

		if (cursor.nextSibling) {
			// If the cursor is now before a <tag>
			if ((cursor.nextSibling.nodeName != "#text") && (cursor.nextSibling.nodeName != "BR")) {
				// Toggle the tag's button appearance
				toggleButtonAppearance(cursor.nextSibling.nodeName);
				// And move into the <tag>
				placeCursor("before", cursor.nextSibling.firstChild);
			}	
		}
	}
}

function moveCursorToMouse(Event) {
	if (Event.explicitOriginalTarget == editor) {
		placeCursor("top", editor);
	} else {
		placeCursor("before", Event.explicitOriginalTarget);
	}
}

function insertLink(text, href, target) {
	var element = new Element('A');

	// Prepend 'http://' to the href if necessary
	if (href.substr(0, 7) == "http://") {
		element.href = href;
	} else {
		element.href = "http://" + href;
	}

	// Create a text node containing the link text
	var textNode = document.createTextNode(text);
	element.appendChild(textNode);

	// If 'Open link in a new window' was checked
	if (target) {
		element.target = "_blank";
	}

	// Insert the link before the cursor, and turn the lightbox off
	cursor.parentNode.insertBefore(element, cursor);
	toggleLinkLightbox();
}

function toggleLinkLightbox() {
	if ($('overlay').style.display == "block") {
		$('overlay').style.display = "none";
		$('lightbox').style.display = "none";
	} else {
		$('overlay').style.display = "block";
		$('lightbox').style.display = "block";
		$('lightbox').style.marginTop = "-" + ($('lightbox').offsetHeight / 2) + "px";
		$('lightbox').style.marginLeft = "-" + ($('lightbox').offsetWidth / 2) + "px";
	}
}

//]]>
