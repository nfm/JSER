//<![CDATA[

var jser;

function $(id) {
	return document.getElementById(id);
}

function $$(name) {
	return document.getElementsByClassName(name);
}

function createElement(type, args) {
	var el, name, value, arg;

	el = document.createElement(type);
	for (arg in args) {
		name = arg;
		value = args[arg];
		if (name == "textNode") {
			el.appendChild(document.createTextNode(value));
		} else {
			el.setAttribute(name, value);
		}
	}

	return el;
}

function observe(element, eventType, functionName) {
	element.addEventListener(eventType, functionName, true);
}

function setStyle(element, args) {
	var name, value, style, arg;

	for (arg in args) {
		name = arg;
		value = args[arg];
		style = element.getAttribute('style') || "";
		element.setAttribute('style', style + (name + ": " + value + ";"));
	}
}

function update(el, text) {
	el.textContent = text;
}

function show(el) {
	setStyle(el, { 'display' : 'block' });
}

function hide(el) {
	setStyle(el, { 'display' : 'none' });
}

function findElement(el, nodeName) {
	while ((el.parentNode) && (el.nodeName != nodeName)) {
		el = el.parentNode;
	}

	if ((el) && (el.nodeName == nodeName)) {
		return el;
	} else {
		return null;
	}
}

function include(arr, value) {
	var i;

	for (i = 0; i < arr.length; i++) {
		if (arr[i] == value) {
			return true;
		}
	}

	return false;
}

function classNames(el) {
	var name;
	var names = [];
	var classes = el.className.split(" ");
	for (name in classes) {
		names.push(classes[name]);
	}

	return names;
}

function addClassName(el, name) {
	el.className += " " + name;
}

function removeClassName(el, name) {
	var pos = el.className.indexOf(name);
	// If name was in el.className
	if (pos != -1) {
		// Remove name from el.className
		el.className = el.className.substr(0, pos) + el.className.substr(pos + name.length);
	}

	return;
}

function cmd(name, args) {
	document.execCommand(name, false, args);
	$('editor').focus();
}

function setButtonOff(el) {
	removeClassName(el, "active");
}

function setButtonOn(el) {
	addClassName(el, "active");
}

function toggleButtonAppearance(button) {
	// Ensure the id is lowercase
	var el = $(button.toLowerCase());

	// If the button is already active
	if (include(classNames(el), "active")) {
		// Deactivate it
		setButtonOff(el);
	} else {
		// Activate it
		setButtonOn(el);
	}
}

function hideLinkLightbox() {
	$('overlay').style.display = "none";
	$('lightbox').style.display = "none";
	setButtonOff($('link'));
}

function showLinkLightbox() {
	$('overlay').style.display = "block";
	$('lightbox').style.display = "block";
	$('lightbox').style.marginTop = "-" + ($('lightbox').offsetHeight / 2) + "px";
	$('lightbox').style.marginLeft = "-" + ($('lightbox').offsetWidth / 2) + "px";
}

function toggleLinkLightbox() {
	if ($('overlay').style.display == "block") {
		hideLinkLightbox();
	} else {
		showLinkLightbox();
	}
}

function selectJustifyButton(buttonId) {
	setButtonOff($('left'));
	setButtonOff($('center'));
	setButtonOff($('right'));
	setButtonOff($('justify'));
	setButtonOn($(buttonId));
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
			selectJustifyButton('left');
			cmd('justifyLeft');
			break;
		case "center":
			selectJustifyButton('center');
			cmd('justifyCenter');
			break;
		case "right":
			selectJustifyButton('right');
			cmd('justifyRight');
			break;
		case "justify":
			// FIXME:
			// Moz content editable doesn't support text-align: justify
			//selectJustifyButton('justify');
			//cmd('justifyRight');
			alert('text-align: justify not yet implemented');
			break;
	}
}

function buttonPress(event) {
	event.stopPropagation();
	var id = findElement(event.target, 'DIV').id;
	toggleButton(id);
}

function hideDropdowns() {
	var i;
	var menus = $$('dropdown-menu');
	for (i = 0; i < menus.length; i++) {
		hide(menus[i]);
	}
}

function dropdownPress(event) {
	var id = event.currentTarget.id;
	var menu = $(id + "-menu");

	// If this dropdown menu was already open
	if ((menu.style.display == "block")) {
		hide(menu);
	} else {
		// Hide all dropdown menus and show the clicked dropdown menu
		hideDropdowns();
		show(menu);
	}
}

function dropdownEntryPress(event) {
	var dropdownMenu = this.parentNode;
	var dropdownTitle = dropdownMenu.parentNode.firstChild;
	var dropdown = this.parentNode.parentNode;

	event.stopPropagation();
	hide(dropdownMenu);
	update(dropdownTitle, this.textContent);
	cmd(dropdown.id, this.id);
}

function keyDown(event) {
	// Make ESC hide the dropdown menus and link lightbox
	if (event.which == 27) {
		event.stopPropagation();
		hideDropdowns();
		hideLinkLightbox();
	}
}

function keyPress(event) {
	var stopPropagation = false;
	if (event.ctrlKey) {
		switch(event.which) {
			// Make ctrl-7 insert an ordered list
			case 55:
				toggleButton('ol');
				stopPropagation = true;
				break;
			// Make ctrl-8 insert an unordered list
			case 56:
				toggleButton('ul');
				stopPropagation = true;
				break;
			// Make ctrl-b toggle the bold button
			case 98:
				toggleButton('b');
				stopPropagation = true;
				break;
			// Make ctrl-i toggle the italic button
			case 105:
				toggleButton('i');
				stopPropagation = true;
				break;
			// Make ctrl-k insert a link
			case 107:
				toggleButton('link');
				stopPropagation = true;
				break;
			// Make ctrl-i toggle the underline button
			case 117:
				toggleButton('u');
				stopPropagation = true;
				break;
		}

		if (stopPropagation) {
			// Stop the event from bubbling or triggering the browser default action
			event.stopPropagation();
			event.preventDefault();
		}
	}
}

function isBlockNode(node) {
	var blockNodes = ['P', 'UL', 'OL'];

	if (blockNodes.include(node.nodeName)) {
		return node;
	} else {
		return null;
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
	var element = createElement('A');

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
	var editor = createElement('div', { 'id' : 'editor', 'contentEditable' : 'true' });
	jser.appendChild(editor);

	// Observe the editor for keyboard shortcuts
	observe(editor, 'keypress', keyPress);

	// Observe the document for keydown events
	observe(document, 'keydown', keyDown);

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
	for (index = 0; index < buttons.length; index++) {
		var button = createElement('div', { 'id' : buttons[index][0], 'title' : buttons[index][1], 'class' : 'button' });
		setStyle(button, { 'background-image' : "url('jserIcons.png')", 'background-position' : (index * -24 + 4) + "px 4px", 'background-repeat' : 'no-repeat' });
		menu.appendChild(button);

		// Observe each button for the click event
		observe(button, 'click', buttonPress);
	}
}

function createDropdowns(menu) {
	var entry, index;

	var dropdowns = [
	['formatBlock', '90', [['paragraph', 'Paragraph'], ['H1', 'Heading 1'], ['H2', 'Heading 2'], ['H3', 'Heading 3'], ['H4', 'Heading 4']]],
	['fontName', '100', [['serif', 'Serif'], ['sans-serif', 'Sans-Serif'], ['monospace', 'Monospace']]],
	['fontSize', '55', [['1', '8pt'], ['2', '10pt'], ['3', '12pt'], ['4', '14pt'], ['5', '18pt'], ['6', '24pt'], ['7', '36pt']]]
	];

	// Add each dropdown menu to the menu
	for (index = 0; index < dropdowns.length; index++) {
		// Create the dropdown button
		var dropdownButton = createElement('div', { 'id' : dropdowns[index][0], 'class' : 'dropdown' });
		setStyle(dropdownButton, { 'width' : dropdowns[index][1] + 'px' });
		var dropdownTitle = createElement('div', { 'class' : 'dropdown-title' });
		setStyle(dropdownTitle, { 'width' : dropdowns[index][1] - 24 + 'px' });
		dropdownButton.appendChild(dropdownTitle);

		// Create a control for the dropdown button
		dropdownButton.appendChild(createElement('div', { 'class' : 'dropdown-control' }));

		// Observe the dropdown button for the click event
		observe(dropdownButton, 'click', dropdownPress);
		
		// Add the dropdown button to the menu
		menu.appendChild(dropdownButton);

		// Create the dropdown menu
		var dropdownMenu = createElement('div', { 'id' : dropdowns[index][0] + '-menu', 'class' : 'dropdown-menu' });
		hide(dropdownMenu);
		dropdownButton.appendChild(dropdownMenu);

		// Add each entry to the dropdown menu
		for (entry = 0; entry < dropdowns[index][2].length; entry++) {
			var menuItem = createElement('div', { id : dropdowns[index][2][entry][0], 'class' : 'dropdown-menu-entry', 'textNode' : dropdowns[index][2][entry][1] });
			observe(menuItem, 'click', dropdownEntryPress);
			dropdownMenu.appendChild(menuItem);
		}
	}
}

// Create the menu
function createMenu() {
	var menu = createElement('div', { 'id' : 'menu' });
	jser.appendChild(menu);

	createDropdowns(menu);
	createButtons(menu);
}

function createLightbox() {
	// Create the lightbox and overlay divs
	var overlay = createElement('div', { 'id' : 'overlay' });
	observe(overlay, 'click', toggleLinkLightbox);
	jser.appendChild(overlay);

	var horizon = createElement('div', { 'id' : 'horizon' });
	jser.appendChild(horizon);

	var lightbox = createElement('div', { 'id' : 'lightbox' });
	lightbox.appendChild(createElement('label', { 'for' : 'link_url', 'textNode' : 'URL:' }));
	lightbox.appendChild(createElement('input', { 'id' : 'link_url', 'type' : 'text' }));
	lightbox.appendChild(createElement('br'));
	lightbox.appendChild(createElement('label', { 'for' : 'link_text', 'textNode' : 'Link text:' }));
	lightbox.appendChild(createElement('input', { 'id' : 'link_text', 'type' : 'text' }));
	lightbox.appendChild(createElement('br'));
	lightbox.appendChild(createElement('input', { 'id' : 'link_target', 'type' : 'checkbox' }));
	//lightbox.appendChild(createElement('textNode').update('Open link in a new window'));
	lightbox.appendChild(createElement('br'));
	var insert_button = createElement('input', { 'type' : 'button', 'value' : 'Insert' });
	observe(insert_button, 'click', insertLink);
	lightbox.appendChild(insert_button);
	var cancel_button = createElement('input', { 'type' : 'button', 'value' : 'Cancel' });
	observe(cancel_button, 'click', toggleLinkLightbox);
	lightbox.appendChild(cancel_button);
	horizon.appendChild(lightbox);
}

// Initialize the editor
function init() {
	// Include the JSER stylesheet
	document.getElementsByTagName('head')[0].appendChild(createElement('link', { 'href' : 'style.css', 'rel' : 'stylesheet', 'type' : 'text/css' }));

	// Operate on the element with id="jser"
	jser = $('jser');

	// Create the lightbox, menu, and editor div itself
	createLightbox();
	createMenu();
	createEditor();

	// Select defaults for dropdown menus
	update($('formatBlock').firstChild, 'Paragraph');
	update($('fontName').firstChild, 'Serif');
	cmd('fontName', 'serif');
	update($('fontSize').firstChild, '10pt');
	cmd('fontSize', '2');

	// Use inline CSS to style input
	cmd('styleWithCSS', true);
}

// The fun starts here
init();

//]]>
