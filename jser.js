//<![CDATA[

var editor = $('editor');
var jser;

function cmd(name, args) {
	document.execCommand(name, false, args);
}

function setButtonOff(id) {
	$(id).removeClassName("active");
}

function setButtonOn(id) {
	$(id).addClassName("active");
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

function buttonPress(event) {
	event.stop();
	var id = event.findElement("DIV").id;
	toggleButton(id);
}

function dropdownPress(event) {
	event.stop();
	var id = event.currentTarget.id;
	$(id + '-menu').show();
}

function dropdownEntryPress(event) {
	event.stop();
	this.parentNode.hide();
	this.parentNode.parentNode.firstChild.update(this.textContent);
}

function keyPress(event) {
	if (event.ctrlKey) {
		// Stop the event from bubbling
		Event.stop(event);

		switch(event.which) {
			// Make ctrl-7 insert an ordered list
			case 55:
				toggleButton('ol');
				break;
			// Make ctrl-8 insert an unordered list
			case 56:
				toggleButton('ul');
				break;
			// Make ctrl-b toggle the bold button
			case 98:
				toggleButton('b');
				break;
			// Make ctrl-i toggle the italic button
			case 105:
				toggleButton('i');
				break;
			// Make ctrl-k insert a link
			case 107:
				toggleButton('link');
				break;
			// Make ctrl-i toggle the underline button
			case 117:
				toggleButton('u');
				break;
		}
	}
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

function createEditor() {
	// Create the editor div
	var editor = new Element('div', { 'id' : 'editor', 'contentEditable' : 'true' });
	jser.appendChild(editor);

	// Observe the editor for keyboard shortcuts
	editor.observe('keypress', keyPress);

	// Focus on the editor and add a new paragraph at the insertion point
	editor.focus();
	document.execCommand('insertParagraph', false, null);
}

function createButtons(menu) {
	var index;

	var buttons = [
	['b', 'Bold (Ctrl-B)'],
	['i', 'Italic (Ctrl-I)'],
	['u', 'Underline (Ctrl-U)'],
	['ol', 'Numbered List (Ctrl-7)'],
	['ul', 'Bullet List (Ctrl-8)'],
	['link', 'Insert hyperlink (Ctrl-K)'],
	['left', 'Left align text'],
	['center', 'Center text'],
	['right', 'Right align text'],
	['justify', 'Justify text']
	];

	// Add each button to the menu
	for (index = 0; index < buttons.size(); index++) {
		var button = new Element('div', { 'id' : buttons[index][0], 'title' : buttons[index][1], 'class' : 'button' });
		button.setStyle({ 'backgroundImage' : "url('jserIcons.png')", 'backgroundPosition' : (index * -24 + 4) + "px 4px", backgroundRepeat : 'no-repeat' });
		menu.appendChild(button);

		// Observe each button for the click event
		button.observe('click', buttonPress);
	}
}

function createDropdowns(menu) {
	var entry, index;

	var dropdowns = [
	['style', '90', ['Paragraph', 'Heading&nbsp;1', 'Heading&nbsp;2', 'Heading&nbsp;3', 'Heading&nbsp;4']],
	['fontFamily', '100', ['Serif', 'Sans-Serif', 'Monospace']],
	['fontSize', '55', ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt']]
	];

	// Add each dropdown menu to the menu
	for (index = 0; index < dropdowns.size(); index++) {
		// Create the dropdown button
		var dropdownButton = new Element('div', { id : dropdowns[index][0], 'class' : 'dropdown' });
		dropdownButton.setStyle({ 'width' : dropdowns[index][1] + 'px' });
		dropdownButton.appendChild((new Element('div', { 'class' : 'dropdown-title' })).setStyle({ 'width' : dropdowns[index][1] - 24 + 'px' }));

		// Create a control for the dropdown button
		dropdownButton.appendChild(new Element('div', { 'class' : 'dropdown-control' }));

		// Observe the dropdown button for the click event
		dropdownButton.observe('click', dropdownPress);
		
		// Add the dropdown button to the menu
		menu.appendChild(dropdownButton);

		// Create the dropdown menu
		dropdownMenu = new Element('div', { 'id' : dropdowns[index][0] + '-menu', 'class' : 'dropdown-menu' });
		dropdownMenu.hide();
		dropdownButton.appendChild(dropdownMenu);

		// Add each entry to the dropdown menu
		for (entry = 0; entry < dropdowns[index][2].size(); entry++) {
			var menuItem = new Element('div', { id : dropdowns[index][2][entry], 'class' : 'dropdown-menu-entry' }).update(dropdowns[index][2][entry]);
			menuItem.observe('click', dropdownEntryPress);
			dropdownMenu.appendChild(menuItem);
		}
	}

	// Select defaults for dropdown menus
	$('style').firstChild.update('Paragraph');
	$('fontFamily').firstChild.update('Serif');
	$('fontSize').firstChild.update('10pt');
}

// Create the menu
function createMenu() {
	var menu = new Element('div', { 'id' : 'menu' });
	jser.appendChild(menu);

	createDropdowns(menu);
	createButtons(menu);
}

function createLightbox() {
	// Create the lightbox and overlay divs
	var overlay = new Element('div', { 'id' : 'overlay' });
	overlay.observe('click', toggleLinkLightbox);
	jser.appendChild(overlay);

	var horizon = new Element('div', { 'id' : 'horizon' });
	jser.appendChild(horizon);

	var lightbox = new Element('div', { 'id' : 'lightbox' });
	lightbox.appendChild(new Element('label', { 'for' : 'link_url' }).update('URL:'));
	lightbox.appendChild(new Element('input', { 'id' : 'link_url', 'type' : 'text' }));
	lightbox.appendChild(new Element('br'));
	lightbox.appendChild(new Element('label', { 'for' : 'link_text' }).update('Link text:'));
	lightbox.appendChild(new Element('input', { 'id' : 'link_text', 'type' : 'text' }));
	lightbox.appendChild(new Element('br'));
	lightbox.appendChild(new Element('input', { 'id' : 'link_target', 'type' : 'checkbox' }));
	lightbox.appendChild(new Element('textNode').update('Open link in a new window'));
	lightbox.appendChild(new Element('br'));
	var insert_button = new Element('input', { 'type' : 'button', 'value' : 'Insert' });
	insert_button.observe('click', insertLink);
	lightbox.appendChild(insert_button);
	var cancel_button = new Element('input', { 'type' : 'button', 'value' : 'Cancel' });
	cancel_button.observe('click', toggleLinkLightbox);
	lightbox.appendChild(cancel_button);
	horizon.appendChild(lightbox);
}

// Initialize the editor
function init() {
	// Include the JSER stylesheet
	document.getElementsByTagName('head')[0].appendChild(new Element('link', { 'href' : 'style.css', 'rel' : 'stylesheet', 'type' : 'text/css' }));

	// Operate on the elements with class="jser"
	jser = $$('div.jser')[0];

	// Create the lightbox, menu, and editor div itself
	createLightbox();
	createMenu();
	createEditor();
}

// The fun starts here
init();

//]]>
