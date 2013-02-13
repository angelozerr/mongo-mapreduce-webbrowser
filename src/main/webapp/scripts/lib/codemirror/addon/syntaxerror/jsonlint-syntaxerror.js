// Define match-highlighter commands. Depends on searchcursor.js
// Use by attaching the following function call to the cursorActivity event:
//myCodeMirror.matchHighlight(minChars);
// And including a special span.CodeMirror-matchhighlight css class (also optionally a separate one for .CodeMirror-focused -- see demo matchhighlighter.html)

(function() {

	var DEFAULT_GUTTER_ID = "syntaxerrors";
	
	// see
	// http://sixrevisions.com/tutorials/javascript_tutorial/create_lightweight_javascript_tooltip/
	var tooltip = function() {
		var id = 'tt';
		var top = 3;
		var left = 3;
		var maxw = 300;
		var speed = 10;
		var timer = 20;
		var endalpha = 95;
		var alpha = 0;
		var tt, t, c, b, h;
		var ie = document.all ? true : false;
		return {
			show : function(v, w) {
				if (tt == null) {
					tt = document.createElement('div');
					tt.setAttribute('id', id);
					t = document.createElement('div');
					t.setAttribute('id', id + 'top');
					c = document.createElement('div');
					c.setAttribute('id', id + 'cont');
					b = document.createElement('div');
					b.setAttribute('id', id + 'bot');
					tt.appendChild(t);
					tt.appendChild(c);
					tt.appendChild(b);
					document.body.appendChild(tt);
					tt.style.opacity = 0;
					tt.style.filter = 'alpha(opacity=0)';
					document.onmousemove = this.pos;
				}
				tt.style.display = 'block';
				c.innerHTML = v;
				tt.style.width = w ? w + 'px' : 'auto';
				if (!w && ie) {
					t.style.display = 'none';
					b.style.display = 'none';
					tt.style.width = tt.offsetWidth;
					t.style.display = 'block';
					b.style.display = 'block';
				}
				if (tt.offsetWidth > maxw) {
					tt.style.width = maxw + 'px'
				}
				h = parseInt(tt.offsetHeight) + top;
				clearInterval(tt.timer);
				tt.timer = setInterval(function() {
					tooltip.fade(1)
				}, timer);
			},
			pos : function(e) {
				var u = ie ? event.clientY + document.documentElement.scrollTop
						: e.pageY;
				var l = ie ? event.clientX
						+ document.documentElement.scrollLeft : e.pageX;
				tt.style.top = (u - h) + 'px';
				tt.style.left = (l + left) + 'px';
			},
			fade : function(d) {
				var a = alpha;
				if ((a != endalpha && d == 1) || (a != 0 && d == -1)) {
					var i = speed;
					if (endalpha - a < speed && d == 1) {
						i = endalpha - a;
					} else if (alpha < speed && d == -1) {
						i = a;
					}
					alpha = a + (i * d);
					tt.style.opacity = alpha * .01;
					tt.style.filter = 'alpha(opacity=' + alpha + ')';
				} else {
					clearInterval(tt.timer);
					if (d == -1) {
						tt.style.display = 'none'
					}
				}
			},
			hide : function() {
				clearInterval(tt.timer);
				tt.timer = setInterval(function() {
					tooltip.fade(-1)
				}, timer);
			}
		};
	}();

	function SyntaxErrorHighlightState() {
		this.marked = [];
	}
	function getSyntaxErrorHighlightState(cm) {
		return cm._syntaxErrorHighlightState
				|| (cm._syntaxErrorHighlightState = new SyntaxErrorHighlightState());
	}

	function clearMarks(cm, gutterID) {
		cm.clearGutter(gutterID);
		var state = getSyntaxErrorHighlightState(cm);
		for ( var i = 0; i < state.marked.length; ++i)
			state.marked[i].clear();
		state.marked = [];
	}

	function makeMarker(str) {
		var message = '<pre>' + str + '</pre>'
		var marker = document.createElement("div");
		marker.onmouseover = function() {
			tooltip.show(message, 200);
		};
		marker.onmouseout = function() {
			tooltip.hide();
		};
		marker.innerHTML=' ';
		marker.className = "annotationHTML error";
		return marker;
	}

	function markDocument(cm, className, gutterID) {
		gutterID = (typeof gutterID !== 'undefined' ? gutterID : DEFAULT_GUTTER_ID);
		clearMarks(cm, gutterID);
		try {
			jsonlint.parseError = function(str, hash) {
				var loc = hash.loc;
				var lineStart = loc.first_line - 1;
				var lineEnd = hash.line;// loc.last_line - 1;
				var start = loc.first_column
				var end = loc.last_column;

				var mark = cm.markText({
					line : lineStart,
					ch : start
				}, {
					line : lineEnd,
					ch : end
				}, {
					className : "annotationRange error",
					readOnly : false
				});
				
				var state = getSyntaxErrorHighlightState(cm);
				state.marked.push(mark);

				var marker = makeMarker(str);
				
				var info = cm.lineInfo(lineStart);
				cm.setGutterMarker(lineStart, gutterID,
						info.gutterMarkers ? null : marker);

			};
			jsonlint.parse(cm.getValue());
		} catch (parseException) {
			//alert(parseException);
		}
	}

	CodeMirror.defineExtension("jsonlintSyntaxError", function(className, gutterID) {
		markDocument(this, className, gutterID);
	});
})();
