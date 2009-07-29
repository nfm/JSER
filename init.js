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
var editor = new Element('div', { 'id' : 'editor', 'contentEditable' : 'true' });
jser.appendChild(editor);

// Focus on the editor and add a new paragraph at the insertion point
editor.focus();
document.execCommand('insertParagraph', false, null);

//]]>
