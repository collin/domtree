/**
 * designMode jQuery plugin v0.1, by Emil Konow.
 * This plugin allows you to handle functionality related to designMode in a cross-browser way.
 */

/**
 * Cross-browser function to access a DOM:Document element
 * Example: $('#foo').contentDocument();
 *
 * @uses jQuery
 *
 * @return object DOM:Document - the document of the frame, iframe or window
 */
jQuery.fn.contentDocument = function() {
	var frame = this[0];
	if (frame.contentDocument) {
		return frame.contentDocument;
	} else if (frame.contentWindow && frame.contentWindow.document) {
		return frame.contentWindow.document;
	} else if (frame.document) {
		return frame.document;
	} else {
		return null;
	}
}

/**
 * Cross-browser function to set the designMode property
 * Example: $('#foo').designMode('on');
 *
 * @uses jQuery, jQuery.fn.contentDocument
 *
 * @param string mode - Which mode to use, should either 'on' or 'off'
 *
 * @return jQuery element - The jQuery element itself, to allow chaining
 */
jQuery.fn.designMode = function(mode) {
	// Default mode is 'on'
	var mode = mode || 'on';
	this.each(function() {
		var frame = $(this);
		var doc = frame.contentDocument();
		if (doc) {
			doc.designMode = mode;
			// Some browsers are kinda slow, so you'll have to wait for the window to load
			frame.load(function() {
				$(this).contentDocument().designMode = mode;
			});
		}
	});
	return this;
}

/**
 * Cross-browser function to execute designMode commands
 * Example: $('#foo').execCommand('formatblock', '<p>');
 *
 * @uses jQuery, jQuery.fn.contentDocument
 *
 * @param string cmd - The command to execute. Please see http://www.mozilla.org/editor/midas-spec.html
 * @param string param - Optional parameter, required by some commands
 *
 * @return jQuery element - The jQuery element itself, to allow chaining
 */
jQuery.fn.execCommand = function(cmd, param) {
	this.each(function() {
		var doc = $(this).contentDocument();
		if (doc) {
			// Use try-catch in case of invalid or unsupported commands
    		try {
				// Non-IE-browsers requires all three arguments
				doc.execCommand(cmd, false, param);
			} catch (e) {
			}
		}
	});
	return this;
}