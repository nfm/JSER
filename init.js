//<![CDATA[

// Observe buttons for mouse click
$('b').observe('click', toggleBold);
$('i').observe('click', toggleItalic);
$('u').observe('click', toggleUnderline);

// Observe document for keyboard activity
document.observe('keydown', processKeyDown);
document.observe('keypress', processKeyPress);

// Observe document and editor for 'focus' to determine visibility of cursor
document.observe('click', setCursorHidden);
document.observe('click', stopCursorTimer);
$('editor').observe('click', restartCursorTimer);
$('editor').observe('click', moveCursorToMouse);
$('editor').observe('click', Event.stop);

startCursorTimer();

//]]>
