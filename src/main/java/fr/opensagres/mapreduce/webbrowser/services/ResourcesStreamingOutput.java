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
package fr.opensagres.mapreduce.webbrowser.services;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Writer;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;

import fr.opensagres.mapreduce.webbrowser.utils.JsonUtils;

/**
 * {@link StreamingOutput} implementation to write JSON array (used to populate
 * the JS dynatree treeview) from data dir {@link File}.
 * 
 */
public class ResourcesStreamingOutput implements StreamingOutput {

	private static final String TITLE_FIELD = "title";
	private static final String KEY_FIELD = "key";
	private static final String IS_FOLDER_FIELD = "isFolder";
	private static final String EXPAND_FIELD = "expand";
	private static final String CHILDREN_FIELD = ", \"children\":";

	private final File dataDir;

	public ResourcesStreamingOutput(File dataDir) {
		this.dataDir = dataDir;
	}

	public void write(OutputStream out) throws IOException,
			WebApplicationException {
		PrintWriter writer = new PrintWriter(out);
		JsonUtils.beginJsonArray(writer);
		toJSON(dataDir, writer);
		JsonUtils.endJsonArray(writer);
		writer.flush();
	}

	private void toJSON(File file, Writer writer) throws IOException {
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
}
