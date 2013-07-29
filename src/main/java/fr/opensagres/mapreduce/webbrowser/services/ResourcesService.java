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