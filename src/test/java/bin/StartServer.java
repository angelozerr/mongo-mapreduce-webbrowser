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
package bin;

import java.awt.Desktop;
import java.net.URI;
import java.net.URL;
import java.security.ProtectionDomain;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

import fr.opensagres.mapreduce.webbrowser.Configuration;

/**
 * Starts an HTTP Jetty server and deploys the Mongo MapReduce WebBrowser
 * webapp.
 * 
 * 
 */
public class StartServer {

	private static final int DUMMY_PORT = 12345;
	private static final String ROOT_CONTEXT_PATH = "/";

	public static void main(String[] args) throws Exception {

		int port = getPort(args);
		String contextpath = getContextpath(args);

		String url = getURL(port, contextpath);
		System.out.println("Start Mongo MapReduce WebBrowser at " + url);

		// Start Jetty server with webapp
		Server server = new Server(port);
		ProtectionDomain domain = StartServer.class.getProtectionDomain();
		URL location = domain.getCodeSource().getLocation();
		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath(contextpath);
		webapp.setExtractWAR(true);
		webapp.setWar(location.toExternalForm());
		String dataDir = getDataDir(args);
		if (isNotEmpty(dataDir)) {
			webapp.setInitParameter(Configuration.DATA_DIR_KEY, dataDir);
		}
		server.setHandler(webapp);
		server.start();

		// open webbrowser
		if (Desktop.isDesktopSupported()) {
			Desktop.getDesktop().browse(new URI(url));
		}

		server.join();

		System.out.println("Stop Mongo MapReduce WebBrowser.");
	}

	public static String getURL(int port, String contextpath) {
		StringBuilder url = new StringBuilder("http://localhost:");
		url.append(port);
		url.append(contextpath);
		return url.toString();
	}

	public static String getContextpath(String[] args) {
		for (int i = 0; i < args.length; i++) {
			if ("-contextpath".equals(args[i])) {
				return ROOT_CONTEXT_PATH + args[i + 1];
			}
		}

		return ROOT_CONTEXT_PATH;
	}

	public static String getDataDir(String[] args) {
		for (int i = 0; i < args.length; i++) {
			if ("-dataDir".equals(args[i])) {
				return args[i + 1];
			}
		}
		return null;
	}

	public static int getPort(String[] args) {
		for (int i = 0; i < args.length; i++) {
			if ("-port".equals(args[i])) {
				try {
					return Integer.parseInt(args[i + 1]);
				} catch (NumberFormatException e) {
					System.err.println(args[i + 1] + " is not an integer");
				}
				break;
			}
		}
		return DUMMY_PORT;
	}

	public static boolean isNotEmpty(String s) {
		return s != null && s.length() > 0;
	}
}
