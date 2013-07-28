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
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.security.ProtectionDomain;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.FileResource;
import org.eclipse.jetty.util.resource.Resource;
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
