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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;

import fr.opensagres.mapreduce.webbrowser.utils.IOUtils;

/**
 * {@link StreamingOutput} implementation to load a file and returns the content
 * of the file (if it's not a js) and the javascript file (if it's js).
 * 
 */
public class LoadResourceStreamingOutput implements StreamingOutput {

	private final String fileName;
	private final File file;

	public LoadResourceStreamingOutput(String fileName, File file) {
		this.fileName = fileName;
		this.file = file;
	}

	public void write(OutputStream output) throws IOException,
			WebApplicationException {

		boolean jsFile = fileName.endsWith(".js");
		if (!jsFile) {
			IOUtils.copy(new FileInputStream(file), output);
		} else {
			PrintWriter writer = new PrintWriter(output);
			Serializer.toJavascript(fileName, file, writer);
			writer.flush();
			writer.close();
		}
	}

}
