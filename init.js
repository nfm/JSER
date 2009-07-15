//<![CDATA[

// Observe buttons for mouse click
$('b').observe('click', toggleBold);
$('i').observe('click', toggleItalic);
$('u').observe('click', toggleUnderline);

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

startCursorInterval();

//]]>
