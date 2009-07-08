//<![CDATA[

$('b').observe('click', toggleBold);
$('i').observe('click', toggleItalic);
$('u').observe('click', toggleUnderline);
document.observe('keydown', processKeyDown);
document.observe('keypress', processKeyPress);

startCursorTimer();

//]]>
