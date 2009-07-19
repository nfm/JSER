//<![CDATA[

// Observe buttons for mouse click
$$('.button').each( function(button) {
	button.observe('click', buttonPress);
});

// Observe document for keyboard activity
document.observe('keydown', processKeyDown);
document.observe('keypress', processKeyPress);
document.observe('keyup', processKeyUp);

// Observe for 'blur' of editor to make cursor hidden
document.observe('click', setCursorHidden);
document.observe('click', stopCursorInterval);

// Observe for 'focus' of #editor to make cursor visible
$('editor').observe('click', restartCursorInterval);
$('editor').observe('click', moveCursorToMouse);
$('editor').observe('click', Event.stop);

// Create a cursor in #editor
cursor = document.createElement('span');
cursor.appendChild(document.createTextNode('\u2502'));
cursor.id = "cursor";
cursor.style.visibility = "visible";
$('editor').appendChild(cursor);
startCursorInterval();

//]]>
