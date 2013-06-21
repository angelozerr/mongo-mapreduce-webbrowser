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
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;

/**
 * {@link StreamingOutput} implementation to write JSON array (used to populate
 * the JS dynatree treeview) from data dir {@link File}.
 * 
 */
public class ResourcesStreamingOutput implements StreamingOutput {

	private final File dataDir;

	public ResourcesStreamingOutput(File dataDir) {
		this.dataDir = dataDir;
	}

	public void write(OutputStream out) throws IOException,
			WebApplicationException {
		PrintWriter writer = new PrintWriter(out);
		Serializer.toJSON(dataDir, writer);
		writer.flush();
		writer.close();
	}

}
