//<![CDATA[

// Observe the link button for the lightbox effect
$('link').observe('click', toggleLinkLightbox);

// Observe buttons for mouse click
$$('.button').each( function(button) {
	button.observe('click', buttonPress);
});

// Observe the lightbox to close it when clicked
//$('lightbox').observe('click', toggleLinkLightbox);
$('overlay').observe('click', toggleLinkLightbox);

// Observe document for keyboard activity
$('editor').observe('keydown', processKeyDown);
$('editor').observe('keypress', processKeyPress);
$('editor').observe('keyup', processKeyUp);

// Observe for 'blur' of editor to make cursor hidden
document.observe('click', setCursorHidden);
document.observe('click', stopCursorInterval);

// Observe for 'focus' of #editor to make cursor visible
$('editor').observe('mousedown', restartCursorInterval);
$('editor').observe('mousedown', moveCursorToMouse);

// Create a cursor in #editor
cursor = document.createElement('span');
cursor.appendChild(document.createTextNode('\u2502'));
cursor.id = "cursor";
cursor.style.visibility = "visible";
$('editor').appendChild(cursor);
startCursorInterval();

//]]>
