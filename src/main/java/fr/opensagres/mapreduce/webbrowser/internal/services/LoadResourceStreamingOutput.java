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
