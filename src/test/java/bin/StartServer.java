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
package bin;

import java.awt.Desktop;
import java.net.URI;
import java.net.URL;
import java.security.ProtectionDomain;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

/**
 * Starts an HTTP Jetty server and deploys the Mongo MapReduce WebBrowser
 * webapp.
 * 
 * 
 */
public class StartServer {

	private static final int DUMMY_PORT = 12345;
	private static final String ROOT_CONTEXT_PATH = "/";
	private static final String DATA_DIR = "data";

	public static void main(String[] args) throws Exception {
		String dataDir = getDataDir(args);
		if (isNotEmpty(dataDir)) {
			System.setProperty("mongo.mapreduce.webbrowser.resources.dir",
					dataDir);
		}

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
		webapp.setWar(location.toExternalForm());
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
