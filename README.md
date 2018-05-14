# nodemanager-rest


## Backend-Komponente: GUI-REST-Service
*Stand:* Kann Graphdokumente/Knoten/Kanten anlegen/löschen, auflisten, serialisieren, de-serialisieren (JSON), in Neo4j speichern. Der wesentliche Code befindet sich in der Klasse **GraphRes.java**.

Der GUI-REST-Service ist leichtgewichtig (nur Jersey/JAX-RS) und läuft derzeit innerhalb des Neo4j Server-Prozesses, um ein leichteres Testen und Ausführen zu ermöglichen. Er kann mit ein paar Änderungen aber auch leicht eigenständig (z.B. in Catalina oder Jetty) laufen. 
Man kann den Graphen in Neo4j sehen und manipulieren während der GUI-REST-Service läuft. Das ist für das Debugging sehr praktisch.

### Ausführen
#### Als Test-Service in der IDE:
1. Das Projekt als Maven-Projekt importieren.
2. JUnit Test über die Klasse Tests.java durchführen (Es öffnet sich ein kleines Fenster. Wenn man es schließt, dann beendet sich der Service.)

#### Als Test-Service mit Maven
Im Hauptverzeichnis des Projektes: `mvn clean test` (Es öffnet sich ein kleines Fenster. Wenn man es schließt, dann beendet sich der Service.)

#### Packaging mit Maven
Im Hauptverzeichnis des Projektes: `mvn clean package` 

Dabei entsteht im target-Ordner ein JAR-Package, was man dann in Neo4j als Plugin verwenden kann. Alternativ bestünde die Möglichkeit, dieses Projekt auch eigenständig auszuführen. Dann sieht man die Neo4j-Browseroberfläche beim Testen aber nicht. 

#### Ausführen als Service-Deployment in Docker (Windows)
Im Hauptverzeichnis des Projektes: `install-docker.bat`

Nun läuft der REST-Service in Docker. Beenden: `docker stop neo`

## Frontend-Komponente: JS-GUI
Bei der JS-GUI handelt es sich um statische HTML/CSS/JS Dateien im Verzeichnis **src\main\webapp\static**.

### Testen der JS-GUI:

Die GUI kann man auf drei verschiedene Arten laden (entweder oder): 

1. Einfach nur die Datei **src/main/webapp/static/index.html** mit dem Browser öffnen.
2. Einen beliebigen Webserver installieren und das Verzeichnis **src/main/webapp/static** auf Port 8080 als statischen Inhalt servieren.
3. Folgende URL aufrufen, um den eingebauten Service zu starten: http://localhost:7474/webapi/initJetty (Hierbei ist zu bedenken, dass dann der static-Ordner aus dem JAR-Package und nicht aus dem o.g. Verziechnis serviert wird. 

Dann diese Adresse aufrufen: http://localhost:8080/index.html (=>GUI fragt nach Bezeichnung für neues Dokument)

### Die Features der JS-GUI sind:

- **Hinzufügen von Nodes** durch das "+" in der Symbolleiste, dann Linksklick auf die Leinwand.
- **Nodes verbinden** via Drag und Drop aus der Mitte heraus.
- **Löschen von Kanten** durch Nutzung des Radiergummis in der Symbolleiste (mit gehaltener linker Maustaste die Verbindungen wegradieren)
- **Löschen ausgewählter Nodes** mit der ENTF-Taste
- **Scrollen/Verschieben** der Leinwand mit gehaltener rechter Maustaste im leeren Bereich
- **Mehrfachauswahl** (Auswahl-Rechteck) mit gehaltener linker Maustaste
- **Auswahlerweiterung** mit gehaltener STRG-Taste (wie in der EDV gewohnt auch mit Auswahl-Rechteck)
- **Zoom** funktioniert mit dem Mausrad, wobei sich der Zoom an der aktuellen Position des Mauszeigers orientiert
- **Umbenennen von Nodes** und setzen weitere Eigenschaften geschieht durch Doppelklick auf die Bezeichnung des Nodes

## Vorteile von Neo4j im Backend
- Neo4j bietet eine schöne Browseroberfläche: http://localhost:7474 (erleichtertes Debugging)
- Bietet komplexe Operationen auf Graphen mit einer einzigen Zeile Code via einer SQL-ähnlichen Abfragesprache (Cypher) 
- Bietet aber auch direkten Zugriff ohne Cypher, sodass man Knoten Laden und die Kanten dann nach belieben verfolgen kann. 
- Property-Maps ermöglichen die flexible Speicherung von Eigenschaften. So müssen keine starren Modellklassen geplant, gepflegt und konsistent gehalten werden. 
- Mit Hilfe von OGM bestünde die Möglichkeit, Graphen in vorgefertigte Klassen de-serialiseren zu lassen. 
- Neo4j ist sehr leichtgewichtig und flexibel (muss nichtmal installiert werden)

