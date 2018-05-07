# nodemanager-rest


## Backend-Komponente: REST-Service inkl. Tests
*Stand:* Kann Graphdokumente/Knoten/Kanten anlegen/löschen, auflisten, serialisieren, de-serialisieren (JSON), in Neo4j speichern. 

Der REST-Service ist schön leichtgewichtig (nur Jersey/JAX-RS) und läuft derzeit innerhalb des Neo4j Server-Prozesses, um ein leichteres Testen und Ausführen zu ermöglichen. Er kann mit ein paar Änderungen aber auch leicht eigenständig laufen. 
Beispielsweise kann man den Graphen in Neo4j sehen und manipulieren während der REST-Service läuft. Das ist für das Debugging sehr praktisch.
Das Maven-Projekt lässt sich direkt aus Eclipse/IDEA inkl. Neo4j heraus starten, ohne dass irgendetwas installiert werden muss. 

### Installation für die Weiterentwicklung:
1. Dieses Projekt als Maven-Projekt importieren.
2. Die Klasse Tests.java öffnen und ausführen.  

Damit läuft nun der REST-Service. Es öffnet sich ein kleines Fenster. Wenn man es schließt, dann beendet sich der Service.


### Spezifikation der REST-Schnittstelle:
TODO (siehe Klasse GraphRes.java)


## Frontend-Komponente: GUI
Bei der GUI handelt es sich um statische HTML/CSS/JS Dateien im Verzeichnis **src\main\webapp**.

### Installation für die Weiterentwicklung:
1. Einen beliebigen Webserver installieren (für statische Inhalte genügt völlig)
2. Das Verzeichnis **src\main\webapp** auf Port 8080 servieren
3. Wenn auch der REST-Service gestartet ist, dann diese Adresse aufrufen: http://localhost:8080/index.html

Die Features der GUI sind:

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
- Erleichtertes Debugging durch die gegebene Echtzeit-Graph-Visualisierung und Abfragemöglichkeit
- Bietet komplexe Operationen auf Graphen mit einer einzigen Zeile Code via einer SQL-ähnlichen Abfragesprache (Cypher) 
- Bietet aber auch direkten Zugriff ohne Cypher, sodass man Knoten Laden und die Kanten dann nach belieben kann. 
- Property-Maps ermöglichen die flexible Speicherung von Eigenschaften. So müssen keine starren Modellklassen geplant, gepflegt und konsistent gehalten werden. 
- Mit Hilfe von OGM besteht die Möglichkeit, Graphen in vorgefertigte Klassen de-serialiseren lassen. 
- Neo4j ist sehr leichtgewichtig und flexibel (muss nichtmal installiert werden)
- Neo4j bietet eine sehr schöne Browseroberfläche, wo man seine Daten sehen und manipulieren kann. 
