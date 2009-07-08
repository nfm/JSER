//<![CDATA[

var editor = $('editor');
var cursor = $('cursor');
var cursorTimer;

function insertElement(type) {
	var element = new Element(type);
	// If editor has children and the last child is not text
	if ((editor.lastChild) && (editor.lastChild.nodeType != "3")) {
		// If the last child is a <br />
		if (editor.lastChild.nodeName == "BR") {
			editor.appendChild(element);
		} else {
			editor.lastChild.appendChild(element);
		}
	} else {
		editor.appendChild(element);
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
	character = String.fromCharCode(ascii);

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

	// If editor has a last child and it's not a text node
	if (cursor.previousSibling) {
		var node = cursor.previousSibling;
		// If the last descendant is a <br />
		if (node.nodeName == "BR") {
			while (node.nodeName == "BR") {
				// Iterate up to find the first non <br />
				node = node.previousSibling();
			}
			// Insert the character here
			node.nodeValue += character;
		} else {
			// Append the character to the last descendant
			node.nodeValue += character;
		}
	} else {
		// Create an initial text node before the cursor
		editor.insertBefore(document.createTextNode(character), cursor);
	}
}

function insertBackspace() {
	var content;

	// If editor is empty, return
	if (!(cursor.previousSibling)) {
		return;
	}

	switch(cursor.previousSibling.nodeName) {
		// If the item before the cursor is plain text
		case "#text":
			content = cursor.previousSibling.nodeValue;
			break;
		// If the item before the cursor is a newline
		case "BR":
			editor.removeChild(cursor.previousSibling);
			return;
			//break;
		// If the item before the cursor is bold, italic, or underlined text
		case "B":
		case "I":
		case "U":
			content = cursor.previousSibling.nodeValue;
			// If this node has no content
			if (content == "") {
				// Remove the node
				editor.removeChild(cursor.previousSibling);
				return;
			}
			break;
		default:
			alert("insertBackspace(): nodeName " + cursor.previousSibling.nodeName + " not handled");
	}

	// If the text item is a &nbsp;
	if (suffixed(content, "&nbsp;")) {
		content = content.slice(0, content.length - 6);
	// If the text item is a &lt;
	} else if (suffixed(content, "&lt;")) {
		content = content.slice(0, content.length - 4);
	// If the text item is a &gt;
	} else if (suffixed(content, "&gt;")) {
		content = content.slice(0, content.length - 4);
	// If the text item is a &amp;
	} else if (suffixed(content, "&amp;")) {
		content = content.slice(0, content.length - 5);
	} else {
		content = content.slice(0, content.length - 1);
	}

	// Update the contents of editor
	switch(cursor.previousSibling.nodeName) {
		case "#text":
			cursor.previousSibling.nodeValue = content;
			break
		case "B":
		case "U":
		case "I":
			cursor.previousSibling.nodeValue = content;
			break;
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
	toggleButton('bold', 'B');
}

function toggleItalic() {
	toggleButton('italic', 'I');
}

function toggleUnderline() {
	toggleButton('underline', 'U');
}

function toggleButton(id, tag) {
	toggleButtonAppearance(id);
	if ((editor.lastChild) && (editor.lastChild.nodeName != "#text")) {
		// If the current node is <tag> or a parent node is <tag>
		if ((editor.lastChild.nodeName == tag) || ((editor.lastChild).ancestors().include(tag))) {
			// Create an empty text node after the <tag> node to work with
			editor.appendChild(document.createTextNode(""));
		} 
	} else {
		// Open a <tag>
		insertElement(tag);
	}
}

function toggleButtonAppearance(id) {
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

//]]>
