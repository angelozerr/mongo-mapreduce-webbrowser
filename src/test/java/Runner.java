import java.net.URL;
import java.security.ProtectionDomain;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

public class Runner {

	public static void main(String[] args) throws Exception {
		Server server = new Server(12345);
		ProtectionDomain domain = Runner.class.getProtectionDomain();
		URL location = domain.getCodeSource().getLocation();
		WebAppContext webapp = new WebAppContext();
		webapp.setContextPath("/");
		
		webapp.setWar(location.toExternalForm());
		server.setHandler(webapp);
		server.start();
		server.join();

	}

}
