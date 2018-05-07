package de.tub.mcc.fogmock.nodemanager.graphserv;


import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.codehaus.jackson.JsonEncoding;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.map.ObjectMapper;
import org.glassfish.jersey.internal.guava.Iterators;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Label;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.Relationship;
import org.neo4j.graphdb.RelationshipType;
import org.neo4j.graphdb.ResourceIterator;
import org.neo4j.graphdb.Result;
import org.neo4j.graphdb.Transaction;
import org.neo4j.helpers.collection.Iterables;
import org.neo4j.helpers.collection.MapUtil;

import static org.neo4j.graphdb.Direction.INCOMING;
import static org.neo4j.graphdb.Direction.OUTGOING;

/**
 * This class serves all the REST functionality concerning graph manipulation.
 */
@Path("/")
public class GraphRes {
	
	//graphDb = 
	GraphDatabaseService graphDb;
	private final Label FOG = Label.label( "FOG" );
	private final Label DOC = Label.label( "DOC" );
	private static final RelationshipType DOC2FOG = RelationshipType.withName( "DOC2FOG" );
	private static final RelationshipType FOG2FOG = RelationshipType.withName( "FOG2FOG" );
	
	private ObjectMapper objectMapper = new ObjectMapper();
	
	
	public GraphRes( @Context GraphDatabaseService db ) {
		this.graphDb = db; //new GraphDatabaseFactory().newEmbeddedDatabase( databaseDirectory );
	}	
	
	
	
	@Path("/test")
	@GET
	public Response testRes() {
		return Response.ok().build();
	} 

	
	

	
	
	

	// http://localhost:8080/webapi/doc/0
	//@Produces(MediaType.TEXT_PLAIN)
	@Path("/doc/{docName}")
	@POST
	public Response createDoc(  @PathParam("docName") final String docName  ) {
		final Map<String, Object> params = MapUtil.map( "docName", docName );
		
		System.out.println("Query: create docNode with name: " + docName);
		
		long docNodeId;
        try ( Transaction tx = graphDb.beginTx();
            Result result = graphDb.execute( "CREATE (n:DOC {name: $docName}) RETURN id(n) as docId", params ) )
        {
            if ( result.hasNext() ) {
            	Map<String,Object> row = result.next();            	
            	docNodeId = (long)row.get("docId"); //fogNode.getId();
            } else {
            	return Response.notModified().build();
            } 
            tx.success();
        }
		
        return Response.ok().entity( "{\"id\":"+docNodeId+"}" ).type( MediaType.APPLICATION_JSON ).build();
	}
	

	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/doc/{docId}/node")
	@POST
	public Response createFogNode( @PathParam("docId") final Long docId, Map<String, Object> message ) {
		final Map<String, Object> params = MapUtil.map("docId", docId, "props", message);
		
		System.out.println("Query: create node within docId " + params.get("docId"));
		System.out.println(message);
		
        /*
         * execute manipulation 
         */
		long fogNodeId;
        try ( Transaction tx = graphDb.beginTx();
        	  Result result = graphDb.execute( "MATCH (d:DOC) WHERE ID(d)=$docId CREATE (d)-[r:DOC2FOG]->(n:FOG $props) RETURN id(n) as nodeId", params )
        ) {
            if ( result.hasNext() ) {
            	Map<String,Object> row = result.next();            	
            	fogNodeId = (long)row.get("nodeId"); //fogNode.getId();
            } else {
            	return Response.notModified().build();
            }
        	tx.success();
	    } catch (Exception e) {
	    	e.printStackTrace();
	    	return Response.status(500).build();
	    }
        

        /*
         * send response 
         */
        final long newNodeId = fogNodeId;
        StreamingOutput stream = new StreamingOutput() {
            @Override
            public void write(OutputStream os) throws IOException, WebApplicationException {
            	JsonGenerator jg = objectMapper.getJsonFactory().createJsonGenerator( os, JsonEncoding.UTF8 );
            	try ( Transaction tx = graphDb.beginTx() ) {
            		Node newNode = graphDb.getNodeById(newNodeId);
            		writeFogNodeObject(jg, newNode);
            	}
                jg.flush();
                jg.close();
            }
        };		
        
        return Response.ok().entity( stream ).type( MediaType.APPLICATION_JSON ).build();
                
	} 		

	
	
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/doc")
	@POST
	public Response createNetwork( SkeletonGraph message ) {
		
		System.out.println( message + " :::: "  ); // + message.fogNodes.length
		//TODO:
		
        return Response.ok().build();
                
	} 			
	
	


	@Path("/doc/{docId}/node/{nodeFromId}/edgeTo/{nodeToId}")
	@POST
	public Response createEdge( @PathParam("docId") final Long docId, @PathParam("nodeFromId") final Long nodeFromId, @PathParam("nodeToId") final Long nodeToId ) {
		final Map<String, Object> params = MapUtil.map("docId", docId, "nodeFromId", nodeFromId, "nodeToId", nodeToId);
		
        /*
         * execute manipulation 
         */
        try ( Transaction tx = graphDb.beginTx();
        	  Result result = graphDb.execute( "MATCH (n1:FOG)<-[:DOC2FOG]-(d:DOC)-[:DOC2FOG]->(n2:FOG) WHERE ID(d)=$docId AND ID(n1)=$nodeFromId AND ID(n2)=$nodeToId MERGE (n1)-[r:FOG2FOG]->(n2)", params )
        ) {
            if ( result.getQueryStatistics().getRelationshipsCreated() != 1 )  return Response.notModified().build();
        	tx.success();
	    } catch (Exception e) {
	    	e.printStackTrace();
	    	return Response.status(500).build();
	    }		
        return Response.ok().build();
	} 		
	
	

	@Path("/doc/{docId}/node/{nodeFromId}/edgeTo/{nodeToId}")
	@DELETE
	public Response deleteEdge( @PathParam("docId") final Long docId, @PathParam("nodeFromId") final Long nodeFromId, @PathParam("nodeToId") final Long nodeToId ) {
		final Map<String, Object> params = MapUtil.map("docId", docId, "nodeFromId", nodeFromId, "nodeToId", nodeToId);
		
        /*
         * execute manipulation 
         */
        try ( Transaction tx = graphDb.beginTx();
        	  Result result = graphDb.execute( "MATCH (d:DOC)-[:DOC2FOG]->(n1:FOG)-[r:FOG2FOG]->(n2:FOG) WHERE ID(d)=$docId AND ID(n1)=$nodeFromId AND ID(n2)=$nodeToId DELETE r", params )
        ) {
            if ( result.getQueryStatistics().getRelationshipsDeleted() == 0 )  return Response.notModified().build();
        	tx.success();
	    } catch (Exception e) {
	    	e.printStackTrace();
	    	return Response.status(500).build();
	    }		
        return Response.ok().build();
	}
		


	
	@Path("/doc/{docId}/nodebulk")
	@DELETE
	public Response deleteNodeBulk( @PathParam("docId") final Long docId, final Long[] message ) {
		final Map<String, Object> params = MapUtil.map("docId", docId, "delIds", message);
		System.out.println(Arrays.toString(message));
        /*
         * execute manipulation 
         */
        try ( Transaction tx = graphDb.beginTx();
        	  Result result = graphDb.execute( "UNWIND $delIds AS delId MATCH (d:DOC)-[d2f:DOC2FOG]->(n:FOG) WHERE ID(d)=$docId AND ID(n)=delId OPTIONAL MATCH (n)-[r:FOG2FOG]-(n2:FOG) DELETE d2f,r,n", params )
        ) {
            if ( result.getQueryStatistics().getRelationshipsDeleted() > 0 && result.getQueryStatistics().getNodesDeleted() > 0 ) {
            	tx.success();
            } else {
            	return Response.notModified().build();
            }
	    } catch (Exception e) {
	    	e.printStackTrace();
	    	return Response.status(500).build();
	    }		

        
        /*
         * send response 
         */        
        StreamingOutput stream = new StreamingOutput()
        {
            @Override
            public void write(OutputStream os) throws IOException, WebApplicationException {
                JsonGenerator jg = objectMapper.getJsonFactory().createJsonGenerator( os, JsonEncoding.UTF8 );
                //jg.writeStartObject();
                jg.writeStartArray();
                for (Long nodeId : message) {
                	jg.writeNumber(nodeId);                	
                }
                jg.writeEndArray();
                jg.flush();
                jg.close();
            }
        };        
        return Response.ok().entity( stream ).type( MediaType.APPLICATION_JSON ).build();
	}		
	
	
	
	
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/doc/{docId}/nodebulk")
	@POST
	public Response updateNodeBulk( @PathParam("docId") final Long docId, Map<String, Object>[] message ) { //SkeletonNode[]
		final Map<String, Object> params = MapUtil.map("docId", docId, "fogNodes", message);
		
	    /*
	     * execute manipulation 
	     */
	    try ( Transaction tx = graphDb.beginTx();
	    	  Result result = graphDb.execute( "UNWIND $fogNodes AS curNode MATCH (d:DOC)-[r:DOC2FOG]->(n:FOG) WHERE ID(d)=$docId AND ID(n)=curNode.id SET n=curNode.props", params )
	    ) {
	        if ( result.getQueryStatistics().getPropertiesSet() == 0 )  return Response.notModified().build();
	    	tx.success();
	    } catch (Exception e) {
	    	e.printStackTrace();
	    	return Response.status(500).build();
	    }
	    
	    return Response.ok().entity("{}").type( MediaType.APPLICATION_JSON ).build();
	            
	}








	@Path("/doclist")
	@GET
	public Response queryDocList() {
		
		
		System.out.println("Query: get all docs");
        StreamingOutput stream = new StreamingOutput()
        {
            @Override
            public void write(OutputStream os) throws IOException, WebApplicationException {
                JsonGenerator jg = objectMapper.getJsonFactory().createJsonGenerator( os, JsonEncoding.UTF8 );
                jg.writeStartObject();
                jg.writeFieldName( "docs" );
                jg.writeStartArray();
                
                try ( Transaction tx = graphDb.beginTx() ) {
                	ResourceIterator<Node> result = graphDb.findNodes(DOC);
                	while ( result.hasNext() ) {
                		jg.writeStartObject();
                    	Node doc = result.next();
                        jg.writeFieldName( "id" );
                        jg.writeNumber( doc.getId() );
                        jg.writeFieldName( "nodeCount" );
                        jg.writeNumber( doc.getDegree(DOC2FOG, OUTGOING) ); 
                        jg.writeFieldName( "props" );
                        String json = objectMapper.writeValueAsString(doc.getAllProperties());
                        jg.writeRawValue(json);
                        jg.writeEndObject();
                	}
                    tx.success();
                }
                
                jg.writeEndArray();
                jg.writeEndObject();
                jg.flush();
                jg.close();
            }
        };
        
        return Response.ok().entity( stream ).type( MediaType.APPLICATION_JSON ).build();	
    	
	} 	
	
	// http://localhost:8080/webapi/doc/0
	@Path("/doc/{docId}")
	@GET
	public Response queryDoc( @PathParam("docId") final Long docId ) {
		
		System.out.println("Query: get doc with id " + docId);
        StreamingOutput stream = new StreamingOutput()
        {
            @Override
            public void write(OutputStream os) throws IOException, WebApplicationException {
                JsonGenerator jg = objectMapper.getJsonFactory().createJsonGenerator( os, JsonEncoding.UTF8 );
                jg.writeStartObject();
                
                

                try ( Transaction tx = graphDb.beginTx() ) {
                	Node doc = graphDb.getNodeById(docId); // findNodes(DOC, "name", docName)
                	
                    jg.writeFieldName( "id" );
                    jg.writeNumber( doc.getId() );
                    jg.writeFieldName( "props" );
                    String json = objectMapper.writeValueAsString(doc.getAllProperties());
                    jg.writeRawValue(json); 
                    
                    jg.writeFieldName( "fogNodes" );
                    //jg.writeStartObject();
                    jg.writeStartArray();
                    for ( Relationship rel : doc.getRelationships( DOC2FOG, OUTGOING ) ) {
                    	//jg.writeFieldName( "n"+rel.getEndNode().getId() );
                    	writeFogNodeObject(jg, rel.getEndNode());
                    }
                    
                    //jg.writeEndObject();
                    jg.writeEndArray();
                    
                    tx.success();
                }
                
                jg.writeEndObject();
                jg.flush();
                jg.close();
            }
        };
        
        return Response.ok().entity( stream ).type( MediaType.APPLICATION_JSON ).build();	
    	
	} 	
	
	@Path("/doc/{docId}/node/{fogNodeId}")
	@GET
	public Response searchNode( @PathParam("docId") final Long docId, @PathParam("fogNodeId") final Long fogNodeId ) {
		final Map<String, Object> params = MapUtil.map( "docId", docId, "fogNodeId", fogNodeId );
		
		System.out.println("Query: get node with id " + fogNodeId);
        StreamingOutput stream = new StreamingOutput()
        {
            @Override
            public void write(OutputStream os) throws IOException, WebApplicationException {
                JsonGenerator jg = objectMapper.getJsonFactory().createJsonGenerator( os, JsonEncoding.UTF8 );

                try ( Transaction tx = graphDb.beginTx();
                    //ResourceIterator<Node> fogNodes = graphDb.findNodes( FOGNODE, "name", fogNodeName ) )
                	Result result = graphDb.execute( "MATCH (d:DOC)-[r:DOC2FOG]->(n:FOG) WHERE ID(d)=$docId AND ID(n)=$fogNodeId RETURN n", params ) )
                {
                    while ( result.hasNext() ) {
                    	Map<String,Object> row = result.next();
                        Node fogNode = (Node) row.get("n");
                        writeFogNodeObject(jg, fogNode);
                    }
                    tx.success();
                }

                jg.flush();
                jg.close();
            }
        };
        
        return Response.ok().entity( stream ).type( MediaType.APPLICATION_JSON ).build();	
    	
	}
	
	
	









	private void writeFogNodeObject(JsonGenerator jg, Node n) throws JsonGenerationException, IOException {
		jg.writeStartObject();
		
		jg.writeFieldName( "id" );
	    jg.writeNumber( n.getId() );
	    
	    jg.writeFieldName( "props" );
	    String json = objectMapper.writeValueAsString(n.getAllProperties());
	    jg.writeRawValue(json);
	    
	    jg.writeFieldName( "edges" );
	    jg.writeStartArray();
	    for (Relationship r : n.getRelationships(FOG2FOG, OUTGOING)) {
	    	jg.writeNumber( r.getEndNode().getId() );
	    }
	    jg.writeEndArray();
	    
	    
	    jg.writeEndObject();
	}
	

}
