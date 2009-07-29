//<![CDATA[

var editor = $('editor');

function cmd(name, args) {
	document.execCommand(name, false, args);
}

function insertElement(type) {
	// Create a new element
	var element = new Element(type);
	var node;

	// If the new element is a block element
	if (isBlockNode(element)) {
		// Move the cursor out of the containing <p>, <ul> or <ol>, if any exists
		for (i = 0; i < cursor.ancestors().size(); i++) {
			node = isBlockNode(cursor.ancestors()[i]);
			if (node) {
				placeCursor('after', node);
				break;
			}
		}
	}

	// Insert the new element before the cursor
	node = cursor.parentNode.insertBefore(element, cursor);

	// If the element was not a <br />
	if (type != "BR") {
		// Move the cursor into the element
		placeCursor("top", node);

		// If the element was a block element
		if (isBlockNode(element)) {
			// Set the element as text-align: left
			//toggleButton('left');
		}
	}
}

function processKeyPress(event) {
	restartCursorInterval();
	Event.stop(event);

	switch(event.which) {
		// Handle ctrl-b
		case 98:
			if (event.ctrlKey) {
				toggleButton('b');
			}
			break;
		// Handle ctrl-i
		case 105:
			if (event.ctrlKey) {
				toggleButton('i');
			}
			break;
		// Handle ctrl-u
		case 117:
			if (event.ctrlKey) {
				toggleButton('u');
			}
			break;
	}
}

function processKeyDown(event) {
	switch(event.which) {
		case (Event.KEY_ESC):
			Event.stop(event);
			break;
	}
}

function buttonPress(event) {
	Event.stop(event);
	var id = Event.findElement(event, "DIV").id;
	toggleButton(id);
}

function toggleButton(id) {
	toggleButtonAppearance(id);

	switch(id) {
		case "b":
			cmd('bold');
			break;
		case "i":
			cmd('italic');
			break;
		case "u":
			cmd('underline');
			break;
		case "ul":
			cmd('insertUnorderedList');
			break;
		case "ol":
			cmd('insertOrderedList');
			break;
		case "link":
			toggleLinkLightbox();
			return;
		case "left":
			cmd('justifyLeft');
			break;
		case "center":
			//cmd('justifyCenter');
			document.execCommand('justifycenter', false, null);
			break;
		case "right":
			cmd('justifyRight');
			break;
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
	cursor.ancestors().each( function(ancestor) {
		if (isBlockNode(ancestor)) {
			ancestor.style.textAlign = alignment;
			return;
		}
	});
}

function isBlockNode(node) {
	var blockNodes = ['P', 'UL', 'OL'];

	if (blockNodes.include(node.nodeName)) {
		return node;
	}
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

function insertLink(text, href, target) {
	var element = new Element('A');

	// Check that an href and link text were entered
	if (!window.href) {
		alert('Enter a value for the URL');
		return;
	}
	if (!window.text) {
		alert('Enter a value for the link text');
		return;
	}

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
