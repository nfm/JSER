//<![CDATA[

// Include the JSER stylesheet
document.getElementsByTagName('head')[0].appendChild(new Element('link', { 'href' : 'style.css', 'rel' : 'stylesheet', 'type' : 'text/css' }));

// Operate on the elements with class="jser"
var jser = $$('div.jser')[0];

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

// Create the menu
var menu = new Element('div', { 'id' : 'menu' });
jser.appendChild(menu);

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
	dropdownButton.appendChild(new Element('div', { class : 'dropdown-control' }));

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
		var menuItem = new Element('div', { id : dropdowns[index][2][entry], class : 'dropdown-menu-entry' }).update(dropdowns[index][2][entry]);
		menuItem.observe('click', dropdownEntryPress);
		dropdownMenu.appendChild(menuItem);
	}
}

// Select defaults for dropdown menus
$('style').firstChild.update('Paragraph');
$('fontFamily').firstChild.update('Serif');
$('fontSize').firstChild.update('10pt');

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

// Create the editor div
var editor = new Element('div', { 'id' : 'editor', 'contentEditable' : 'true' });
jser.appendChild(editor);

// Observe the editor for keyboard shortcuts
editor.observe('keypress', keyPress);

// Focus on the editor and add a new paragraph at the insertion point
editor.focus();
document.execCommand('insertParagraph', false, null);

//]]>
