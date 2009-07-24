//<![CDATA[

// Include the JSER stylesheet
document.getElementsByTagName('head')[0].appendChild(new Element('link', { 'href' : 'style.css', 'rel' : 'stylesheet', 'type' : 'text/css' }));

// Operate on the element with id="jser"
var jser = $('jser');

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

var buttons = [
['b', 'Bold (ctrl-b)', 'text_bold.png'],
['i', 'Italic (ctrl-i)', 'text_italic.png'],
['u', 'Underline (ctrl-u)', 'text_underline.png'],
['ul', 'Bullet List', 'text_list_bullets.png'],
['ol', 'Numbered List', 'text_list_numbers.png'],
['link', 'Insert hyperlink', 'page_link.png'],
['left', 'Left justify', 'text_align_left.png'],
['center', 'Center justify', 'text_align_center.png'],
['right', 'Right justify', 'text_align_right.png']
];

// Add each button to the menu
buttons.each(function (btn) {
	var button = new Element('div', { 'id' : btn[0], 'title' : btn[1], 'class' : 'button' });
	var image = new Element('img', { 'src' : 'images/' + btn[2], 'alt' : btn[0] });
	button.appendChild(image);
	menu.appendChild(button);

	// Observe each button for the click event
	button.observe('click', buttonPress);
});

// Create the editor div
var editor = new Element('div', { 'id' : 'editor' });
jser.appendChild(editor);

// Create the cursor in #editor
var cursor = new Element('span', { 'id' : 'cursor', 'style' : 'visibility = visible' });
cursor.appendChild(document.createTextNode('\u2502'));
editor.appendChild(cursor);
startCursorInterval();

// Observe #editor for keyboard activity
document.observe('keydown', processKeyDown);
document.observe('keypress', processKeyPress);
document.observe('keyup', processKeyUp);

// Observe for 'blur' of editor to make cursor hidden
document.observe('click', setCursorHidden);
document.observe('click', stopCursorInterval);

// Observe for 'focus' of #editor to make cursor visible
editor.observe('mousedown', restartCursorInterval);
editor.observe('mousedown', moveCursorToMouse);

//]]>
