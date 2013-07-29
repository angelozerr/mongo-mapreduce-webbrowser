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
package fr.opensagres.mapreduce.webbrowser.internal.services;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.util.Arrays;

import fr.opensagres.mapreduce.webbrowser.utils.JsonUtils;

/**
 * JSON and Javascript serializer.
 * 
 */
public class Serializer {

	private static final String TITLE_FIELD = "title";
	private static final String KEY_FIELD = "key";
	private static final String IS_FOLDER_FIELD = "isFolder";
	private static final String EXPAND_FIELD = "expand";
	private static final String CHILDREN_FIELD = ", \"children\":";

	public static void toJSON(File file, Writer writer) throws IOException {
		JsonUtils.beginJsonObject(writer);

		// title
		JsonUtils.addJsonField(TITLE_FIELD, file.getName(), true, true, writer);
		// key
		JsonUtils.addJsonField(KEY_FIELD, file.getName(), false, true, writer);

		if (file.isDirectory()) {
			// isFolder
			JsonUtils.addJsonField(IS_FOLDER_FIELD, true, false, true, writer);
			// expand
			JsonUtils.addJsonField(EXPAND_FIELD, true, false, true, writer);
			// children
			writer.write(CHILDREN_FIELD);
			JsonUtils.beginJsonArray(writer);

			// Loop for files
			File[] files = file.listFiles();
			// Sort the files by name. 
			Arrays.sort(files);
			for (int i = 0; i < files.length; i++) {
				if (i > 0) {
					writer.write(",");
				}
				toJSON(files[i], writer);
			}
			JsonUtils.endJsonArray(writer);
		}

		JsonUtils.endJsonObject(writer);
	}

	public static void toJavascript(String fileName, File file, Writer writer)
			throws FileNotFoundException, IOException {
		String namespace = fileName;
		namespace = namespace.replaceAll("/", "_").replaceAll(" ", "_")
				.replaceAll("\\\\", "_").replaceAll("[.]", "_");

		// Variable : var
		// mapreduces_default_mapreduce_mr_merge_js={};
		writer.write("var ");
		writer.write(namespace);
		writer.write("={};");

		writer.write("\n");

		// Get the object of DataInputStream
		DataInputStream in = null;
		try {
			in = new DataInputStream(new FileInputStream(file));

			BufferedReader br = new BufferedReader(new InputStreamReader(in));
			String strLine;
			// Read File Line By Line
			while ((strLine = br.readLine()) != null) {
				if (strLine.startsWith("${namespace}")) {
					writer.write(namespace);
					writer.write(strLine.substring("${namespace}".length(),
							strLine.length()));
				} else {
					writer.write(strLine);
				}
				writer.write("\n");
			}
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {

				}
			}
		}

		writer.write("\n");

		// namespaceName:
		// mapreduces_default_mapreduce_mr_merge_js.namespaceName =
		// 'mapreduces_default_mapreduce_mr_merge_js';
		writer.write("\n");
		writer.write(namespace);
		writer.write(".namespaceName='");
		writer.write(namespace);
		writer.write("';");

		// Name: mapreduces_default_mapreduce_mr_merge_js.name =
		// 'mapreduce_mr_merge.js';
		writer.write("\n");
		writer.write(namespace);
		writer.write(".name='");
		writer.write(file.getName());
		writer.write("';");

		// File: mapreduces_default_mapreduce_mr_merge_js.file =
		// 'mapreduces/default/mapreduce_mr_merge.js';
		writer.write("\n");
		writer.write(namespace);
		writer.write(".file='");
		writer.write(fileName);
		writer.write("';");

		// addExector:
		// MultiPageEditor.addExecutor(mapreduces_default_mapreduce_mr_merge_js);
		writer.write("\n");
		writer.write("MultiPageEditor.addExecutor(");
		writer.write(namespace);
		writer.write(");");
	}
}
