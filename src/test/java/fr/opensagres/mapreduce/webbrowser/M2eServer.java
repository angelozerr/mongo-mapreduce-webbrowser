package fr.opensagres.mapreduce.webbrowser;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;


public class M2eServer {

	public static void main( String[] args )
	        throws Exception
	    {
	        Server server = new Server( 12345 );
	        WebAppContext webAppContext = new WebAppContext( "src/main/webapp", "/" );
	        server.setHandler(webAppContext);
	        server.start();
	        server.join();

	    }
}
