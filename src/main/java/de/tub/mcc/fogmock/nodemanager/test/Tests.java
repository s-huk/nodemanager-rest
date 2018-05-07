package de.tub.mcc.fogmock.nodemanager.test;

import static org.neo4j.server.ServerTestUtils.getSharedTestTemporaryFolder;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.neo4j.graphdb.Result;
import org.neo4j.graphdb.Transaction;
import org.neo4j.harness.ServerControls;
import org.neo4j.harness.TestServerBuilder;
import org.neo4j.harness.TestServerBuilders;
import org.neo4j.harness.junit.Neo4jRule;
import org.neo4j.helpers.collection.MapUtil;
import org.neo4j.kernel.configuration.Settings;
import org.neo4j.kernel.configuration.ssl.LegacySslPolicyConfig;
import org.neo4j.server.ServerTestUtils;
import org.neo4j.server.configuration.ServerSettings;
import org.neo4j.server.rest.JaxRsResponse;
import org.neo4j.server.rest.RestRequest;
import org.neo4j.test.server.HTTP;

import de.tub.mcc.fogmock.nodemanager.graphserv.GraphRes;
import de.tub.mcc.fogmock.nodemanager.graphserv.SkeletonNode;

import javax.swing.JOptionPane;
import javax.ws.rs.core.MediaType;


public class Tests {
	
	private RestRequest REST_REQUEST;
	private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
	
    @Rule
    public Neo4jRule server = new Neo4jRule()
    	.withConfig( "dbms.connector.http.listen_address", "127.0.0.1:7474" )
    	.withExtension("/webapi","de.tub.mcc.fogmock.nodemanager.graphserv"); //.withFixture(SETUP);	
	
    
    @Before
    public void setUp() throws Exception {
        System.err.println(server.httpURI());
        REST_REQUEST = new RestRequest(server.httpURI());
    }	
	
	@Test
	public void firstTest() throws IOException {
		System.out.println("Starting tests...");
		JaxRsResponse response = REST_REQUEST.get("webapi/test");		
		//System.out.println( response.getStatus() );
		URI webUri = server.httpURI().resolve("webapi/test");
		//System.out.println("Testing URI: " + webUri.toString());
		
		
		
		System.out.println("Creating sample document...");
		response = REST_REQUEST.post("webapi/doc/testdoc1", "");
		long docId = OBJECT_MAPPER.readValue(response.getEntity(), SkeletonNode.class).id;
		System.out.println("Received document id " + docId);
		
		
		
		System.out.println("Creating 4 sample nodes...");
		response = REST_REQUEST.post("webapi/doc/"+docId+"/node", "{\"name\":\"testnode1\", \"posX\":0, \"posY\":0}", MediaType.APPLICATION_JSON_TYPE );
		long node1Id = OBJECT_MAPPER.readValue(response.getEntity(), SkeletonNode.class).id;
		System.out.println("Received node1 with id " + node1Id);
		
		response = REST_REQUEST.post("webapi/doc/"+docId+"/node", "{\"name\":\"testnode1\", \"posX\":400, \"posY\":0}", MediaType.APPLICATION_JSON_TYPE );
		long node2Id = OBJECT_MAPPER.readValue(response.getEntity(), SkeletonNode.class).id;
		System.out.println("Received node2 with id " + node2Id);
		
		response = REST_REQUEST.post("webapi/doc/"+docId+"/node", "{\"name\":\"testnode1\", \"posX\":0, \"posY\":400}", MediaType.APPLICATION_JSON_TYPE );
		long node3Id = OBJECT_MAPPER.readValue(response.getEntity(), SkeletonNode.class).id;
		System.out.println("Received node3 with id " + node3Id);		
		
		response = REST_REQUEST.post("webapi/doc/"+docId+"/node", "{\"name\":\"testnode1\", \"posX\":400, \"posY\":400}", MediaType.APPLICATION_JSON_TYPE );
		long node4Id = OBJECT_MAPPER.readValue(response.getEntity(), SkeletonNode.class).id;
		System.out.println("Received node4 with id " + node4Id);
		
		
		
		System.out.println("Create 3 connections between the nodes...");
		response = REST_REQUEST.post("webapi/doc/"+docId+"/node/"+node1Id+"/edgeTo/"+node2Id, "");
		System.out.println(response.getStatus());		
		response = REST_REQUEST.post("webapi/doc/"+docId+"/node/"+node2Id+"/edgeTo/"+node3Id, "");
		System.out.println(response.getStatus());
		response = REST_REQUEST.post("webapi/doc/"+docId+"/node/"+node4Id+"/edgeTo/"+node2Id, "");
		System.out.println(response.getStatus());

		
		
		
		JOptionPane.showMessageDialog(null, "Leave this message open in order to prevent the termination of the server process.", "Tests Finished", JOptionPane.INFORMATION_MESSAGE);
		System.out.println("Tests finished.");
		
	}
	
//    private static TestServerBuilder getServerBuilder( ) throws IOException
//    {
//        TestServerBuilder serverBuilder = TestServerBuilders.newInProcessBuilder();
//        String path = ServerTestUtils.getRelativePath(
//                getSharedTestTemporaryFolder(), LegacySslPolicyConfig.certificates_directory );
//        serverBuilder.withConfig( LegacySslPolicyConfig.certificates_directory.name(), path )
//                     .withConfig( ServerSettings.script_enabled.name(), Settings.TRUE );
//        return serverBuilder;
//    }	
}
