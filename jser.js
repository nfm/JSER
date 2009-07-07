//<![CDATA[

var editor = $('editor');

function insertElement(elementType) {
	var element = new Element(elementType);
	editor.appendChild(element);
}

function processKeyPress(event) {
	Event.stop(event);

	switch(event.which) {
		case (Event.KEY_BACKSPACE):
			insertBackspace(); 
			break;
		case (Event.KEY_DELETE):
		case 0:
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
			character = "&nbsp;";
			break;
		case "<":
			character = "&lt;";
			break;
		case ">":
			character = "&gt;";
			break;
		case "&":
			character = "&amp;";
			break;
	}

	// If editor has a last child and it's not a text node
	if ((editor.lastChild) && (editor.lastChild.nodeName != "#text")) {
		// Append the character to the last child
		editor.lastChild.innerHTML += character;
	} else {
		editor.innerHTML += character;
	}
}

function insertBackspace() {
	// If editor is empty, return
	if (!(editor.lastChild)) {
		return;
	}

	switch(editor.lastChild.nodeName) {
		// If the item before the cursor is a character
		case "#text":
			// If the text item is a &nbsp;
			if (suffixed(editor.innerHTML, "&nbsp;")) {
				editor.innerHTML = editor.innerHTML.slice(0, editor.innerHTML.length - 6);
			// If the text item is a &lt;
			} else if (suffixed(editor.innerHTML, "&lt;")) {
				editor.innerHTML = editor.innerHTML.slice(0, editor.innerHTML.length - 4);
			// If the text item is a &gt;
			} else if (suffixed(editor.innerHTML, "&gt;")) {
				editor.innerHTML = editor.innerHTML.slice(0, editor.innerHTML.length - 4);
			// If the text item is a &amp;
			} else if (suffixed(editor.innerHTML, "&amp;")) {
				editor.innerHTML = editor.innerHTML.slice(0, editor.innerHTML.length - 5);
			} else {
				editor.innerHTML = editor.innerHTML.slice(0, editor.innerHTML.length - 1);
			}
			break;
		// If the item before the cursor is a newline
		case "BR":
			editor.removeChild(editor.lastChild);
			break;
		case "B":
		case "I":
		case "U":
			editor.lastChild.innerHTML = editor.lastChild.innerHTML.slice(0, editor.lastChild.innerHTML.length - 1);
			break;
		default:
			alert("insertBackspace(): nodeName not handled");
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
	editor.insert(new Element('br'));
}

//]]>
