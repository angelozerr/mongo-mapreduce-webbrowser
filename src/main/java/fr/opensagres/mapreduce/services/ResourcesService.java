package fr.opensagres.mapreduce.services;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.apache.commons.io.IOUtils;

@Path("/resources")
public class ResourcesService {

	private static final MediaType APPLICATION_JAVASCRIPT = new MediaType(
			"application", "javascript");

	@GET
	@Path("/save")
	public String save(@Context ServletContext context,
			@QueryParam("fileName") String fileName,
			@QueryParam("content") String content) throws IOException {
		String filePath = context.getRealPath(fileName);
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
	@Path("/load")
	public Response load(@Context ServletContext context,
			@QueryParam("fileName") final String fileName) throws IOException {
		CacheControl cacheControl = new CacheControl();
		cacheControl.setNoCache(true);

		String filePath = context.getRealPath(fileName);
		final File file = new File(filePath);
		if (!file.exists()) {
			throw new NotFoundException(new FileNotFoundException(filePath));
		}
		return Response.ok(new StreamingOutput() {

			public void write(OutputStream output) throws IOException,
					WebApplicationException {

				String namespace = fileName;
				namespace = namespace.replaceAll("/", "_")
						.replaceAll("\\\\", "_").replaceAll("[.]", "_");

				// Variable : var mapreduces_default_mapreduce_mr_merge_js={};
				IOUtils.write("var ", output);
				IOUtils.write(namespace, output);
				IOUtils.write("={};", output);

				IOUtils.write("\n", output);

				// Get the object of DataInputStream
				DataInputStream in = null;
				try {
					in = new DataInputStream(new FileInputStream(file));

					BufferedReader br = new BufferedReader(
							new InputStreamReader(in));
					String strLine;
					// Read File Line By Line
					while ((strLine = br.readLine()) != null) {
						if (strLine.startsWith("${namespace}")) {
							IOUtils.write(namespace, output);
							IOUtils.write(strLine.substring(
									"${namespace}".length(), strLine.length()),
									output);
						} else {
							IOUtils.write(strLine, output);
						}
						IOUtils.write("\n", output);
					}
				} finally {
					if (in != null) {
						IOUtils.closeQuietly(in);
					}
				}

				IOUtils.write("\n", output);

				// namespaceName: mapreduces_default_mapreduce_mr_merge_js.namespaceName =
				// 'mapreduces_default_mapreduce_mr_merge_js';
				IOUtils.write("\n", output);
				IOUtils.write(namespace, output);
				IOUtils.write(".namespaceName='", output);
				IOUtils.write(namespace, output);
				IOUtils.write("';", output);
				
				// Name: mapreduces_default_mapreduce_mr_merge_js.name =
				// 'mapreduce_mr_merge.js';
				IOUtils.write("\n", output);
				IOUtils.write(namespace, output);
				IOUtils.write(".name='", output);
				IOUtils.write(file.getName(), output);
				IOUtils.write("';", output);

				// File: mapreduces_default_mapreduce_mr_merge_js.file =
				// 'mapreduces/default/mapreduce_mr_merge.js';
				IOUtils.write("\n", output);
				IOUtils.write(namespace, output);
				IOUtils.write(".file='", output);
				IOUtils.write(fileName, output);
				IOUtils.write("';", output);

				// addExector:
				// MapReduceExecutorManager.addExecutor(mapreduces_default_mapreduce_mr_merge_js);
				IOUtils.write("\n", output);
				IOUtils.write("MapReduceExecutorManager.addExecutor(", output);
				IOUtils.write(namespace, output);
				IOUtils.write(");", output);

				IOUtils.closeQuietly(output);
				// IOUtils.copy(new FileInputStream(file), output);
			}
		}, APPLICATION_JAVASCRIPT).cacheControl(cacheControl).build();
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

		IOUtils.write(",\"key\":", out);
		IOUtils.write("\"", out);
		IOUtils.write(file.getName(), out);
		IOUtils.write("\"", out);

		if (file.isDirectory()) {
			IOUtils.write(", \"isFolder\":true", out);
			IOUtils.write(", \"expand\":true", out);
			IOUtils.write(", \"children\":[", out);

			File[] files = file.listFiles();
			for (int i = 0; i < files.length; i++) {
				if (i > 0) {
					IOUtils.write(",", out);
				}
				toJSON(files[i], out);
			}

			IOUtils.write("]", out);
		}

		IOUtils.write("}", out);
	}

}
