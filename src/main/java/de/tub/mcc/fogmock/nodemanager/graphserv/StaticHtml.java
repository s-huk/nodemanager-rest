package de.tub.mcc.fogmock.nodemanager.graphserv;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;


import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.kernel.internal.GraphDatabaseAPI;
//import org.neo4j.server.web.WebServer;


//@Path("/web")
public class StaticHtml {

//	public StaticHtml( @Context WebServer ws) { //, @Context WebServer ws 
//		//System.out.println(ws.toString());
//		//ws.addStaticContent("web", "/web");
//		//ws.setAddress(address);
//	}		

	
	
	
//    @Path("/")
    @Produces("text/html")
    @GET
    public Response index() throws IOException {
    	System.out.println("ENTRY");
        return file("index.html");
    }

    static Map<String,URL> resources = new ConcurrentHashMap<>();

    @GET
    @Path("{file:(?i).+\\.(png|jpg|jpeg|svg|gif|html?|js|css|txt)}")
    public Response file(@PathParam("file") String file) throws IOException {
        InputStream fileStream = findFileStream(file);
        if (fileStream == null) return Response.status(Response.Status.NOT_FOUND).build();
        else return Response.ok(fileStream, mediaType(file)).build();
    }

    private InputStream findFileStream(String file) throws IOException {
        URL fileUrl = resources.computeIfAbsent(file, new Function<String, URL>() {
            public URL apply(String s) {
                return findFileUrl(s);
            }
        });
        return fileUrl == null ? null : fileUrl.openStream();
    }

    private URL findFileUrl(@PathParam("file") String file) {
        return ClassLoader.getSystemResource("" + file);
    }

    public String mediaType(String file) {
        int dot = file.lastIndexOf(".");
        if (dot == -1) return MediaType.TEXT_PLAIN;
        String ext = file.substring(dot + 1).toLowerCase();
        switch (ext) {
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "json":
                return MediaType.APPLICATION_JSON;
            case "js":
                return "text/javascript";
            case "css":
                return "text/css";
            case "svg":
                return MediaType.APPLICATION_SVG_XML;
            case "html":
                return MediaType.TEXT_HTML;
            case "txt":
                return MediaType.TEXT_PLAIN;
            case "jpg":
            case "jpeg":
                return "image/jpg";
            default:
                return MediaType.TEXT_PLAIN;
        }
    }	
	
}
