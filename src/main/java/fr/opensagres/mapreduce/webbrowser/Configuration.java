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

import java.io.File;

/**
 * 
 * Configuration used to holds the data dir which hosts the js mapreduce
 * resources.
 * 
 */
public class Configuration {

	public static final String DATA_DIR_KEY = "mapreduce.webbrowser.data.dir";
	
	private static File dataDir;

	/**
	 * Set the data dir which hosts the js mapreduce resources.
	 * 
	 * @param dataDir
	 *            the data dir which hosts the js mapreduce resources.
	 */
	public static void setDataDir(File dataDir) {
		Configuration.dataDir = dataDir;
	}

	/**
	 * Returns the data dir which hosts the js mapreduce resources.
	 * 
	 * @return the data dir which hosts the js mapreduce resources.
	 */
	public static File getDataDir() {
		return dataDir;
	}
}
