(function() {

	CodeMirror.jsonValidator = function(contents, annotations) {
		try {
			jsonlint.parseError = function(str, hash) {
				
				var severity = 'error';
				var loc = hash.loc;
				var lineStart = loc.first_line - 1;
				var lineEnd = hash.line;// loc.last_line - 1;
				var charStart = loc.first_column
				var charEnd = loc.last_column;

				annotations.push({
					"severity" : severity,
					"lineStart" : lineStart,
					"charStart" : charStart,
					"lineEnd" : lineEnd,
					"charEnd" : charEnd,
					"description" : str
				});

			};
			jsonlint.parse(contents);
		} catch (parseException) {
			// alert(parseException);
		}
	};

})();