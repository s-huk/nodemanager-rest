SET sp=%~dp0
docker run --name=neo -d --rm --publish=7474:7474 --publish=7687:7687 --publish=8080:8080 --volume=%sp%/data:/data --volume=%sp%/logs:/logs --volume=%sp%\plugins:/var/lib/neo4j/plugins --env NEO4J_AUTH=none --env NEO4J_dbms_unmanaged__extension__classes=de.tub.mcc.fogmock.nodemanager.graphserv=/webapi neo4j:3.3.5


