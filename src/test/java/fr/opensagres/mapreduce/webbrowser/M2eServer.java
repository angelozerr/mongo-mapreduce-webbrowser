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
package fr.opensagres.mapreduce.webbrowser;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

public class M2eServer {

	public static void main(String[] args) throws Exception {
		Server server = new Server(12345);
		WebAppContext webAppContext = new WebAppContext("src/main/webapp", "/");
		server.setHandler(webAppContext);
		server.start();
		server.join();

	}
}
