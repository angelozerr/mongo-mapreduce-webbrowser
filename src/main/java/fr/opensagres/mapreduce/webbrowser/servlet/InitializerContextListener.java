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
package fr.opensagres.mapreduce.webbrowser.servlet;

import static fr.opensagres.mapreduce.webbrowser.Configuration.DATA_DIR_KEY;

import java.io.File;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import fr.opensagres.mapreduce.webbrowser.Configuration;
import fr.opensagres.mapreduce.webbrowser.utils.StringUtils;

/**
 * 
 * Context listener which initializes the dataDir of {@link Configuration} on
 * server startup.
 * 
 */
public class InitializerContextListener implements ServletContextListener {

	/**
	 * On server startup, initialize the data dir.
	 */
	public void contextInitialized(ServletContextEvent event) {
		// Find data dir
		File dataDir = getDataDir(event);
		// Create folder if needed
		if (!dataDir.exists()) {
			dataDir.mkdirs();
		}
		// Set the data dir in the configuration.
		Configuration.setDataDir(dataDir);
	}

	/**
	 * On server shutdown, set the data dir to null.
	 */
	public void contextDestroyed(ServletContextEvent event) {
		Configuration.setDataDir(null);
	}

	/**
	 * Returns the data dir which hosts the js mapreduce resources. This data
	 * dir can be configured with :
	 * 
	 * <ol>
	 * <li><b>JVM parameter</b>. Eg:
	 * <code>-Dmapreduce.webbrowser.data.dir=C:/data</code></li>
	 * <li><b>init-param</b> of the web.xml. Eg: <code>&lt;context-param&gt;
		&lt;param-name&gt;mapreduce.webbrowser.data.dir&lt;/param-name&gt;
		&lt;param-value&gt;C:/data&lt;/param-value&gt;
	&lt;/context-param&gt;</code></li>
	 * <li><b>JNDI</b>.</li>
	 * <li>otherwise returns the <b>"resources" dir of the webapp</b>.</li>
	 * </ol>
	 * 
	 * @param event
	 *            the servlet context event
	 * @return the data dir which hosts the js mapreduce resources.
	 */
	private File getDataDir(ServletContextEvent event) {
		// Search data dir from JVM parameter
		File dataDir = getDataDirFromJVMParam();
		if (dataDir != null) {
			return dataDir;
		}
		ServletContext context = event.getServletContext();
		// Search data dir from init-param configured in the web.xml
		dataDir = getDataDirFromInitParam(context);
		if (dataDir != null) {
			return dataDir;
		}
		// Search data dir from JNDI
		dataDir = getDataDirFromJNDI(context);
		if (dataDir != null) {
			return dataDir;
		}
		// By default returns the "resources" dir of the webapp
		return getDataDirFromWebApp(context);
	}

	/**
	 * Returns the data dir configured with JVM parameter otherwise null.
	 * 
	 * @return the data dir configured with JVM parameter otherwise null.
	 */
	private File getDataDirFromJVMParam() {
		String dataDir = System.getProperty(DATA_DIR_KEY);
		if (StringUtils.isNotEmpty(dataDir)) {
			return new File(dataDir);
		}
		return null;
	}

	/**
	 * Returns the data dir configured with "init-param" of the web.xml
	 * otherwise null.
	 * 
	 * @param context
	 *            the servlet context.
	 * @return the data dir configured with "init-param" of the web.xml
	 *         otherwise null.
	 */
	private File getDataDirFromInitParam(ServletContext context) {
		String dataDir = context.getInitParameter(DATA_DIR_KEY);
		if (StringUtils.isNotEmpty(dataDir)) {
			return new File(dataDir);
		}
		return null;
	}

	/**
	 * Returns the data dir configured with JNDI otherwise null.
	 * 
	 * @param context
	 *            the servlet context.
	 * @return the data dir configured with JNDI otherwise null.
	 */
	private File getDataDirFromJNDI(ServletContext context) {
		// TODO : use JNDI
		return null;
	}

	/**
	 * Returns the "resources" dir of the webapp.
	 * 
	 * @param context
	 *            the servlet context.
	 * @return the "resources" dir of the webapp.
	 */
	private File getDataDirFromWebApp(ServletContext context) {
		String dataDir = context.getRealPath("resources");
		return new File(dataDir);
	}
}
