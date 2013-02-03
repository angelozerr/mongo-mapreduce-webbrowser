package fr.opensagres.mapreduce.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.io.IOUtils;

@Path("/resources")
public class ResourcesService {

	@GET
	@Path("/save/{fileName}")
	public String save(@Context ServletContext context,
			@PathParam("fileName") String fileName,
			@QueryParam("content") String content) throws IOException {
		String filePath = context.getRealPath("mapreduces/custom/" + fileName);
		File file = new File(filePath);
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
		return "";
	}

	@GET
	@Path("/load/{fileName}")
	public Response load(@Context ServletContext context,
			@PathParam("fileName") String fileName) throws IOException {
		String filePath = context.getRealPath("mapreduces/custom/" + fileName);
		final File file = new File(filePath);
		return Response.ok(new StreamingOutput() {

			public void write(OutputStream output) throws IOException,
					WebApplicationException {
				IOUtils.copy(new FileInputStream(file), output);
			}
		}, new MediaType("application", "javascript")).build();
	}

	@GET
	@Path("/mapreduces")
	public Response getMapreduces(@Context ServletContext context)
			throws IOException {
		String filePath = context.getRealPath("mapreduces");
		final File file = new File(filePath);
		return Response.ok(new StreamingOutput() {

			public void write(OutputStream out) throws IOException,
					WebApplicationException {
				IOUtils.write("[", out);
				toJSON(file, out);
				IOUtils.write("]", out);
				IOUtils.closeQuietly(out);
			}
		}, MediaType.APPLICATION_JSON).build();
	}

	private void toJSON(File file, OutputStream out) throws IOException {
		IOUtils.write("{", out);

		IOUtils.write("\"title\":", out);
		IOUtils.write("\"", out);
		IOUtils.write(file.getName(), out);
		IOUtils.write("\"", out);
		
		if (file.isDirectory()) {
			IOUtils.write(", \"isFolder\":true", out);
			IOUtils.write(", \"expand\":true", out);
			IOUtils.write(", \"children\":[", out);
			
			File[] files = file.listFiles();
			for (int i = 0; i < files.length; i++) {
				if(i>0){
					IOUtils.write(",", out);
				}
				toJSON(files[i], out);
			}
			
			IOUtils.write("]", out);
		}
		
		IOUtils.write("}", out);
	}

}
