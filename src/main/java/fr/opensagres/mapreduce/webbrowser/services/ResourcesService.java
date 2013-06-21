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
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import fr.opensagres.mapreduce.webbrowser.Configuration;
import fr.opensagres.mapreduce.webbrowser.internal.services.LoadResourceStreamingOutput;
import fr.opensagres.mapreduce.webbrowser.internal.services.ResourcesStreamingOutput;
import fr.opensagres.mapreduce.webbrowser.utils.IOUtils;

@Path("/resources")
public class ResourcesService {

	private static final MediaType APPLICATION_JAVASCRIPT = new MediaType(
			"application", "javascript");

	/**
	 * Save resource.
	 * 
	 * @param context
	 * @param fileName
	 * @param content
	 * @return
	 * @throws IOException
	 */
	@GET
	@Path("/save/{fileName}")
	public void save(@PathParam("fileName") String fileName,
			@QueryParam("content") String content) throws IOException {
		File dataDir = Configuration.getDataDir();
		File file = new File(dataDir, "../" + fileName);
		file.getParentFile().mkdirs();
		OutputStream out = null;
		try {
			out = new FileOutputStream(file);
			IOUtils.write(content, out);
		} finally {
			if (out != null) {
				IOUtils.closeQuietly(out);
			}
		}
	}

	/**
	 * Load resource.
	 * 
	 * @param context
	 * @param fileName
	 * @param content
	 * @return
	 * @throws IOException
	 */
	@GET
	@Path("/load/{fileName}")
	public Response load(@PathParam("fileName") final String fileName)
			throws IOException {

		// Check if file to load exists
		File dataDir = Configuration.getDataDir();
		File file = new File(dataDir, "../" + fileName);
		if (!file.exists()) {
			throw new NotFoundException(new FileNotFoundException(
					file.getPath()));
		}

		CacheControl cacheControl = new CacheControl();
		cacheControl.setNoCache(true);

		boolean jsFile = fileName.endsWith(".js");
		MediaType mediaType = jsFile ? APPLICATION_JAVASCRIPT
				: MediaType.TEXT_PLAIN_TYPE;
		return Response
				.ok(new LoadResourceStreamingOutput(fileName, file), mediaType)
				.cacheControl(cacheControl).build();
	}

	/**
	 * Returns list of resources as JSON array.
	 * 
	 * @return
	 * @throws IOException
	 */
	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getResources() throws IOException {
		File dataDir = Configuration.getDataDir();
		return Response.ok(new ResourcesStreamingOutput(dataDir),
				MediaType.APPLICATION_JSON).build();
	}
}