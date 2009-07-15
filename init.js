//<![CDATA[

// Observe buttons for mouse click
$('b').observe('click', toggleBold);
$('i').observe('click', toggleItalic);
$('u').observe('click', toggleUnderline);

// Observe document for keyboard activity
document.observe('keydown', processKeyDown);
document.observe('keypress', processKeyPress);

// Observe for 'blur' of editor to make cursor hidden
document.observe('click', setCursorHidden);
document.observe('click', stopCursorTimer);

// Observe for 'focus' of #editor to make cursor visible
$('editor').observe('click', restartCursorTimer);
$('editor').observe('click', moveCursorToMouse);
$('editor').observe('click', Event.stop);

startCursorTimer();

//]]>
