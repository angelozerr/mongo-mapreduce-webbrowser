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

import javax.servlet.ServletContext;

public class Helper {


	public static String getDataDir(ServletContext context) {
		String dataDir = System
				.getProperty("mongo.mapreduce.webbrowser.resources.dir");
		if (isNotEmpty(dataDir)) {
			return dataDir;
		}		
		if (context == null) {
			return null;
		}
		return context.getRealPath("resources");
	}

	public static boolean isNotEmpty(String s) {
		return s != null && s.length() > 0;
	}
}
