//<![CDATA[

var editor = $('editor');
var cursor = $('cursor');
var cursorTimer;

function insertElement(type) {
	var element = new Element(type);
	var node = cursor.previousSibling;

	// If there is a node before the cursor and it is not a text node
	if ((node) && (node.nodeName != "#text")) {
		// If the node is a <br />
		if (node.nodeName == "BR") {
			editor.insertBefore(element, cursor);
		// For any other nodes (<b>, <i> etc)
		} else {
			// If the node's last child is not a text node or <br />
			if ((node.lastChild) && (node.lastChild.nodeName != "#text") && (node.lastChild.nodeName != "BR")) {
				// Append element to the node's last child
				node.lastChild.appendChild(element);
			} else {
				// Append element to the node before the cursor
				node.appendChild(element);
			}
		}
	} else {
		editor.insertBefore(element, cursor);
	}
}

function processKeyPress(event) {
	restartCursorTimer();
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
				toggleBold();
			} else {
				insertCharacter(event.which);
			}
			break;
		// Handle ctrl-i
		case 105:
			if (event.ctrlKey) {
				toggleItalic();
			} else {
				insertCharacter(event.which);
			}
			break;
		// Handle ctrl-u
		case 117:
			if (event.ctrlKey) {
				toggleUnderline();
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
		case (Event.KEY_DELETE):
		case 0:
			Event.stop(event);
			insertDelete();
			break;
		case (Event.KEY_ESC):
			Event.stop(event);
			break;
		case (Event.KEY_RIGHT):
			moveCursorForwards();
			break;
		case (Event.KEY_LEFT):
			moveCursorBackwards();
			break;
		// . key
		case 190:
			Event.stop(event);
			insertCharacter(46);
			break;
		default:
			break;
	}
}

function insertCharacter(ascii) {
	character = encodeCharacter(String.fromCharCode(ascii));

	var node = cursor.previousSibling;
	// If there is a node before the cursor
	if (node) {
		// Find the last descendant of the node before the cursor
		while (node.lastChild) {
			node = node.lastChild;
		}

		switch(node.nodeName) {
			case "BR":
				// Create a new text node after the <br /> in the parent node
				node.parentNode.appendChild(document.createTextNode(character));
				break;
			case "#text":
				// If this text node is not a direct child of #editor (ie its parent is <tag>)
				if (node.parentNode.id != "editor") {
					// Create a new text node as a child of this node's parent
					node.parentNode.appendChild(document.createTextNode(character));
				} else {
					// Create a new text node before the cursor
					editor.insertBefore(document.createTextNode(character), cursor);
				}
				break;
			default:
				// Create a new text node and append it to this node
				node.appendChild(document.createTextNode(character));
		}
	} else {
		// The cursor is at the start of the editor - create a text node before the cursor
		editor.insertBefore(document.createTextNode(character), cursor);
	}
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

function insertBackspace() {
	var content;
	var node = cursor.previousSibling;

	// If there is no node before the cursor
	if (!node) { return; }

	switch(node.nodeName) {
		// If the item before the cursor is plain text
		case "#text":
			content = node.nodeValue;
			break;
		// If the item before the cursor is a newline
		case "BR":
			editor.removeChild(node);
			return;
		// If the item before the cursor is bold, italic, or underlined text
		case "B":
		case "I":
		case "U":
			// Find the last descendant of the node before the cursor
			if (node) {
				while ((node) && (node.lastChild != "") && (node.lastChild != null)) {
					node = node.lastChild;
				}
				content = node.nodeValue;
			}

			// If this node is an empty tag (ie <b/>)
			if ((content == null) || (content == "")) {
				// Toggle the appearance of the appropriate button
				toggleButtonAppearance(node.nodeName);
				// Remove the node
				node.parentNode.removeChild(node);
				// Backspace again into the parent node
				insertBackspace();
				return;
			}
			break;
		default:
			alert("insertBackspace(): nodeName " + node.nodeName + " not handled");
	}

	content = content.slice(0, content.length - 1);

	if (content == "") {
		node.parentNode.removeChild(node);
	} else {
		node.nodeValue = content;
	}
}

// Determines whether str ends with suffix
function suffixed(str, suffix) {
	if (str.substring(str.length - suffix.length, str.length) == suffix) {
		return true;
	} else {
		return false;
	}
}

function insertDelete() {
	editor.innerHTML += ' delete ';
}

function insertNewline() {
	insertElement('BR');
}

function toggleBold() {
	toggleButton('b', 'B');
}

function toggleItalic() {
	toggleButton('i', 'I');
}

function toggleUnderline() {
	toggleButton('u', 'U');
}

function toggleButton(id, tag) {
	toggleButtonAppearance(id);
	// If the node before the cursor is not plain text
	if ((cursor.previousSibling) && (cursor.previousSibling.nodeName != "#text")) {
		// If the node before the cursor is already <tag> or is an ancestor of <tag>
		if ((cursor.previousSibling.nodeName == tag) || ((editor.lastChild).ancestors().include(tag))) {
			// Create an empty text node after the <tag> node to work with
			editor.insertBefore(document.createTextNode(""), cursor);
		} else {
			// Open a <tag>
			insertElement(tag);
		}
	} else {
		// Open a <tag>
		insertElement(tag);
	}
}

function toggleButtonAppearance(id) {
	// Ensure the id is lowercase
	id = id.toLowerCase();

	// If the button is already active
	if ($(id).classNames().include("active")) {
		// Deactivate it
		$(id).removeClassName("active");
	} else {
		// Activate it
		$(id).addClassName("active");
	}
}

function startCursorTimer() {
	cursorTimer = setTimeout("startCursorTimer(); toggleCursor()", 800);
}

function stopCursorTimer() {
	clearTimeout(cursorTimer);
}

function restartCursorTimer() {
	setCursorVisible();
	clearTimeout(cursorTimer);
	cursorTimer = setTimeout("startCursorTimer(); toggleCursor()", 800);
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
	stopCursorTimer();

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
	startCursorTimer();
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
		// And move it backwards again over the previous printed character
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
	}

	// If the cursor is now before a <tag>
	if ((cursor.nextSibling.nodeName != "#text") && (cursor.nextSibling.nodeName != "BR")) {
		// Toggle the tag's button appearance
		toggleButtonAppearance(cursor.nextSibling.nodeName);
		// And move into the <tag>
		placeCursor("before", cursor.nextSibling.firstChild);
	}
}

//]]>
