/**
 * Copyright (C) 2011-2013 Angelo Zerr <angelo.zerr@gmail.com>
 *
 * All rights reserved.
 *
 * Permission is hereby granted, free  of charge, to any person obtaining
 * a  copy  of this  software  and  associated  documentation files  (the
 * "Software"), to  deal in  the Software without  restriction, including
 * without limitation  the rights to  use, copy, modify,  merge, publish,
 * distribute,  sublicense, and/or sell  copies of  the Software,  and to
 * permit persons to whom the Software  is furnished to do so, subject to
 * the following conditions:
 *
 * The  above  copyright  notice  and  this permission  notice  shall  be
 * included in all copies or substantial portions of the Software.
 *
 * THE  SOFTWARE IS  PROVIDED  "AS  IS", WITHOUT  WARRANTY  OF ANY  KIND,
 * EXPRESS OR  IMPLIED, INCLUDING  BUT NOT LIMITED  TO THE  WARRANTIES OF
 * MERCHANTABILITY,    FITNESS    FOR    A   PARTICULAR    PURPOSE    AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE,  ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
package fr.opensagres.mapreduce.webbrowser.utils;

import java.io.IOException;
import java.io.Writer;

/**
 * Classe utilitaires JSON.
 * 
 * @author Angelo ZERR.
 * 
 */
public abstract class JsonUtils {

	private static final char BEGIN_BRACKET = '{';

	private static final char END_BRACKET = '}';

	private static final char BEGIN_ARRAY = '[';

	private static final char END_ARRAY = ']';

	private static final char NAME_VALUE_SEPARATOR = ':';

	private static final char FIELDS_SEPARATOR = ',';

	/**
	 * com.google.gson.stream.JsonWriter#string}
	 * 
	 * @param value
	 * @param htmlSafe
	 *            : Configure this writer to emit JSON that's safe for direct
	 *            inclusion in HTML and XML documents. This escapes the HTML
	 *            characters {@code <}, {@code >}, {@code &} and {@code =}
	 *            before writing them to the stream.
	 * @return
	 */
	public static final String escapeString(String value, boolean htmlSafe) {
		StringBuilder out = new StringBuilder();
		for (int i = 0, length = value.length(); i < length; i++) {
			char c = value.charAt(i);

			/*
			 * From RFC 4627, "All Unicode characters may be placed within the
			 * quotation marks except for the characters that must be escaped:
			 * quotation mark, reverse solidus, and the control characters
			 * (U+0000 through U+001F)."
			 * 
			 * We also escape '\u2028' and '\u2029', which JavaScript interprets
			 * as newline characters. This prevents eval() from failing with a
			 * syntax error.
			 * http://code.google.com/p/google-gson/issues/detail?id=341
			 */
			switch (c) {
			case '"':
			case '\\':
				out.append('\\');
				out.append(c);
				break;

			case '\t':
				out.append("\\t");
				break;

			case '\b':
				out.append("\\b");
				break;

			case '\n':
				out.append("\\n");
				break;

			case '\r':
				out.append("\\r");
				break;

			case '\f':
				out.append("\\f");
				break;

			case '<':
			case '>':
			case '&':
			case '=':
			case '\'':
				if (htmlSafe) {
					out.append(String.format("\\u%04x", (int) c));
				} else {
					out.append(c);
				}
				break;

			case '\u2028':
			case '\u2029':
				out.append(String.format("\\u%04x", (int) c));
				break;

			default:
				if (c <= 0x1F) {
					out.append(String.format("\\u%04x", (int) c));
				} else {
					out.append(c);
				}
				break;
			}
		}

		return out.toString();
	}

	public static final String escapeString(String value) {
		return escapeString(value, false);
	}

	// -------------------------------- Methodes pour générer des objets JSON.

	/**
	 * Demarre un objet JSON avec le token '{'.
	 * 
	 * @param writer
	 * @throws IOException
	 */
	public static void beginJsonObject(Writer writer) throws IOException {
		writer.write(BEGIN_BRACKET);
	}

	/**
	 * Termine un objet JSON avec le token '}'.
	 * 
	 * @param writer
	 * @throws IOException
	 */
	public static void endJsonObject(Writer writer) throws IOException {
		writer.write(END_BRACKET);
	}

	/**
	 * Demarre un tableau JSON avec le token '['.
	 * 
	 * @param writer
	 * @throws IOException
	 */
	public static void beginJsonArray(Writer writer) throws IOException {
		writer.write(BEGIN_ARRAY);
	}

	/**
	 * Termine un tableau JSON avec le token ']'.
	 * 
	 * @param writer
	 * @throws IOException
	 */
	public static void endJsonArray(Writer writer) throws IOException {
		writer.write(END_ARRAY);
	}

	/**
	 * Ajout un champs simple JSON de nom et valeur de type boolean.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	public static void addJsonField(String name, boolean value,
			boolean firstField, Writer writer) throws IOException {
		addJsonField(name, value, firstField, false, writer);
	}

	/**
	 * Ajout un champs simple JSON de nom et valeur de type boolean en indiquant
	 * si le nom du champs doit etre quotté on non.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param nameQuoted
	 *            true si le nom du champs doit être quotté et false sinon.
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	public static void addJsonField(String name, boolean value,
			boolean firstField, boolean nameQuoted, Writer writer)
			throws IOException {
		String s = Boolean.toString(value);
		addJsonField(name, s, firstField, nameQuoted, false, writer);
	}

	/**
	 * Ajout un champs simple JSON de nom et valeur de type entier.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	public static void addJsonField(String name, int value, boolean firstField,
			Writer writer) throws IOException {
		addJsonField(name, value, firstField, false, writer);
	}

	/**
	 * Ajout un champs simple JSON de nom et valeur de type entier en indiquant
	 * si le nom du champs doit etre quotté on non.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param nameQuoted
	 *            true si le nom du champs doit être quotté et false sinon.
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	public static void addJsonField(String name, int value, boolean firstField,
			boolean nameQuoted, Writer writer) throws IOException {
		String s = Integer.toString(value);
		addJsonField(name, s, firstField, nameQuoted, false, writer);
	}

	/**
	 * Ajout un champs simple JSON de nom et valeur de type long.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	public static void addJsonField(String name, long value,
			boolean firstField, Writer writer) throws IOException {
		addJsonField(name, value, firstField, false, writer);
	}

	/**
	 * Ajout un champs simple JSON de nom et valeur de type long en indiquant si
	 * le nom du champs doit etre quotté on non.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param nameQuoted
	 *            true si le nom du champs doit être quotté et false sinon.
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	public static void addJsonField(String name, long value,
			boolean firstField, boolean nameQuoted, Writer writer)
			throws IOException {
		String s = Long.toString(value);
		addJsonField(name, s, firstField, nameQuoted, false, writer);
	}

	/**
	 * Ajout un champs simple JSON de nom et valeur de type date .
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	// public static void addJsonField(String name, Date value, boolean
	// firstField, Writer writer) throws IOException {
	// addJsonField(name, value, firstField, false, writer);
	// }

	/**
	 * Ajout un champs simple JSON de nom et valeur de type date en indiquant si
	 * le nom du champs doit etre quotté on non.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param nameQuoted
	 *            true si le nom du champs doit être quotté et false sinon.
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	// public static void addJsonField(String name, Date value, boolean
	// firstField, boolean nameQuoted, Writer writer) throws IOException {
	// String s = (value != null ? ExtendedFunctions.formatDatetime(value,
	// StringUtils.DATE_TIME_PATTERN) : "");
	// addJsonField(name, s, firstField, nameQuoted, writer);
	// }

	/**
	 * Ajout un champs simple JSON de nom et valeur de type String.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	public static void addJsonField(String name, String value,
			boolean firstField, Writer writer) throws IOException {
		addJsonField(name, value, firstField, false, writer);
	}

	/**
	 * Ajout un champs simple JSON de nom et valeur de type String en indiquant
	 * si le nom du champs doit etre quotté on non.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param nameQuoted
	 *            true si le nom du champs doit être quotté et false sinon.
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	public static void addJsonField(String name, String value,
			boolean firstField, boolean nameQuoted, Writer writer)
			throws IOException {
		addJsonField(name, value, firstField, nameQuoted, true, writer);
	}

	/**
	 * Ajoute un champs simple JSON de nom et valeur en indiquant si le nom et
	 * valeur du champs doit etre quotté on non.
	 * 
	 * @param name
	 *            nom du champs.
	 * @param value
	 *            valeur du champs.
	 * @param firstField
	 *            vaut true si le champs est le premier champs et false sinon
	 *            (pour générer une virgule ou non).
	 * @param nameQuoted
	 *            true si le nom du champs doit être quotté et false sinon.
	 * @param valueQuoted
	 *            true si la valeur du champs doit être quotté et false sinon.
	 * @param writer
	 *            dans lequel on doit ecrire le champs simple JSON.
	 * @throws IOException
	 */
	private static void addJsonField(String name, String value,
			boolean firstField, boolean nameQuoted, boolean valueQuoted,
			Writer writer) throws IOException {
		if (!firstField) {
			addFieldsSeparator(writer);
		}

		// name
		addString(name, nameQuoted, writer);

		// value
		addNameValueSeparator(writer);
		addString(value, valueQuoted, writer);
	}

	public static void addFieldsSeparator(Writer writer) throws IOException {
		writer.write(FIELDS_SEPARATOR);
	}

	public static void addNameValueSeparator(Writer writer) throws IOException {
		writer.write(NAME_VALUE_SEPARATOR);
	}

	/**
	 * Ajoute une chaine de caractères quottée ou non
	 * 
	 * @param s
	 * @param quoted
	 * @param writer
	 * @throws IOException
	 */
	public static void addString(String s, boolean quoted, Writer writer)
			throws IOException {
		if (quoted) {
			writer.write("\"");
			writer.write(s == null ? "" : escapeString(s));
			writer.write("\"");
		} else {
			writer.write(s == null ? "" : s);
		}
	}
}
