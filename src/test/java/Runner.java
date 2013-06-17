import java.awt.Desktop;
import java.io.File;
import java.net.URI;
import java.net.URL;
import java.security.ProtectionDomain;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

public class Runner {

	private static final int DUMMY_PORT = 12345;
	private static final String ROOT_CONTEXT_PATH = "/";
	private static final String DATA_DIR = "data";
	public static void main(String[] args) throws Exception {
		int port =getPort(args);
		String contextpath=getContextpath(args);
		Server server = new Server(port);
		ProtectionDomain domain = Runner.class.getProtectionDomain();
		URL location = domain.getCodeSource().getLocation();
		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath(contextpath);
		webapp.setTempDirectory(new File(getData(args)));
		webapp.setWar(location.toExternalForm());
		server.setHandler(webapp);
		server.start();
		
		Desktop.getDesktop().browse(new URI("http://localhost:"+port+contextpath));
		
		server.join();
		
	}

	private static String getContextpath(String[] args) {
		String  contextpath=ROOT_CONTEXT_PATH;
		for (int i = 0; i < args.length; i++) {
			if("-contextpath".equals(args[i])){
				contextpath=ROOT_CONTEXT_PATH+args[i+1];
				break;
			}
		}
		
		return contextpath;
	}

	private static String getData(String[] args) {
		String  contextpath=DATA_DIR;
		for (int i = 0; i < args.length; i++) {
			if("-data".equals(args[i])){
				contextpath=args[i+1];
				break;
			}
		}
		
		return contextpath;
	}
	private static int getPort(String[] args) {
		int port = DUMMY_PORT;
		for (int i = 0; i < args.length; i++) {
			if("-port".equals(args[i])){
				try {
					port=Integer.parseInt(args[i+1]);
				} catch (NumberFormatException e) {
					System.err.println(args[i+1] +" is not an integer");
				}
				break;
			}
		}
		return port;
	}

	
}
