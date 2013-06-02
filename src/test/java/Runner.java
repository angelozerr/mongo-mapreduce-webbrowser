import java.net.URL;
import java.security.ProtectionDomain;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

public class Runner {

	private static final int DUMMY_PORT = 12345;
	private static final String ROOT_CONTEXT_PATH = "/";

	public static void main(String[] args) throws Exception {
		int port =getPort(args);
		String contextpath=getContextpath(args);
		Server server = new Server(port);
		ProtectionDomain domain = Runner.class.getProtectionDomain();
		URL location = domain.getCodeSource().getLocation();
		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath(contextpath);
		
		webapp.setWar(location.toExternalForm());
		server.setHandler(webapp);
		server.start();
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
