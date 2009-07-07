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
	var content;

	// If editor is empty, return
	if (!(editor.lastChild)) {
		return;
	}

	switch(editor.lastChild.nodeName) {
		// If the item before the cursor is plain text
		case "#text":
			content = editor.innerHTML;
			break;
		// If the item before the cursor is a newline
		case "BR":
			editor.removeChild(editor.lastChild);
			return;
			//break;
		// If the item before the cursor is bold, italic, or underlined text
		case "B":
		case "I":
		case "U":
			content = editor.lastChild.innerHTML;
			// If this node has no content
			if (content == "") {
				// Remove the node
				editor.removeChild(editor.lastChild);
				return;
			}
			break;
		default:
			alert("insertBackspace(): nodeName " + editor.lastChild.nodeName + " not handled");
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
	switch(editor.lastChild.nodeName) {
		case "#text":
			editor.innerHTML = content;
			break
		case "B":
		case "U":
		case "I":
			editor.lastChild.innerHTML = content;
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
	editor.insert(new Element('br'));
}

//]]>
