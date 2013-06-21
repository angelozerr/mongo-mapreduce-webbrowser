package fr.opensagres.mapreduce.webbrowser.internal.services;

import java.io.File;
import java.io.StringWriter;

import org.junit.Assert;
import org.junit.Test;

public class JSONSerializerTestCase {

	@Test
	public void dataDirToJSON() throws Exception {
		StringWriter writer = new StringWriter();
		File file = new File("shells");
		Serializer.toJSON(file, writer);
		Assert.assertEquals(
				"{\"title\":\"shells\",\"key\":\"shells\",\"isFolder\":true,\"expand\":true, "
						+ "\"children\":["
						+ "{\"title\":\"startServer.bat\",\"key\":\"startServer.bat\"},"
						+ "{\"title\":\"startServer.sh\",\"key\":\"startServer.sh\"}]}",
				writer.toString());
	}
}
