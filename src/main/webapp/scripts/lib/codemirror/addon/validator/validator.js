CodeMirror.validate = function(cm, collectAnnotations, options) {
	if (!options)
		options = {};

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

	function makeMarker(description, severity) {
		var message = '<pre>' + description + '</pre>'
		var marker = document.createElement("div");
		marker.onmouseover = function() {
			tooltip.show(message, 200);
		};
		marker.onmouseout = function() {
			tooltip.hide();
		};
		marker.innerHTML = ' ';
		var markerClass = 'annotationHTML ' + severity;
		marker.className = markerClass;
		return marker;
	}

	function markDocument() {
		gutterID = (typeof gutterID !== 'undefined' ? gutterID
				: DEFAULT_GUTTER_ID);
		clearMarks(cm, gutterID);

		var annotations = [];
		var contents = (options.getContents ? options.getContents() : cm.getValue());
		collectAnnotations(contents, annotations);

		for ( var i = 0; i < annotations.length; i++) {
			var annotation = annotations[i];
			if (options.formatAnnotation) {
				annotation = options.formatAnnotation(annotation);
			}
			
			var severity = annotation.severity;
			var lineStart = annotation.lineStart;
			var charStart = annotation.charStart;
			var lineEnd = annotation.lineEnd;
			var charEnd = annotation.charEnd;
			var description = annotation.description;

			var markClass = 'annotationRange ' + severity;
			var mark = cm.markText({
				line : lineStart,
				ch : charStart
			}, {
				line : lineEnd,
				ch : charEnd
			}, {
				className : markClass,
				readOnly : false
			});

			var state = getSyntaxErrorHighlightState(cm);
			state.marked.push(mark);

			var marker = makeMarker(description, severity);

			var info = cm.lineInfo(lineStart);
			cm.setGutterMarker(lineStart, gutterID, info.gutterMarkers ? null
					: marker);
		}
	}

	return markDocument();
};
