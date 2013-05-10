package fr.opensagres.mapreduce.webbrowser;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.webapp.WebAppContext;


public class StartServer {

	public static void main( String[] args )
	        throws Exception
	    {
	        Server server = new Server( 8081 );

	        WebAppContext webappcontext = new WebAppContext( "src/main/webapp", "/mapreduce" );

	        ContextHandlerCollection servlet_contexts = new ContextHandlerCollection();
	        webappcontext.setClassLoader( Thread.currentThread().getContextClassLoader() );
	        HandlerCollection handlers = new HandlerCollection();
	        handlers.setHandlers( new Handler[] { servlet_contexts, webappcontext, new DefaultHandler() } );
	        server.setHandler( handlers );

	        server.start();
	        server.join();

	    }
}
