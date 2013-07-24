/*******************************************************************************
 * Copyright (c) 2013 Angelo ZERR and Pascal Leclercq.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors:      
 *     Angelo Zerr <angelo.zerr@gmail.com> - initial API and implementation
 *     Pascal Leclercq <pascal.leclercq@gmail.com> - initial API and implementation     
 *******************************************************************************/
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
