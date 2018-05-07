
//console.log("Test");
//document.write("test");
//window.zoom = 0.7; //0.7
window.zoom = 1; //0.7
var baseURL = "http://localhost:7474/";
var baseWebURL = "http://localhost:8080/";

var supressBrowserContextMenu = true;
NODE_ID_PREFIX = "FOG";
GLOBAL_LINECOLOR = "#888";
GLOBAL_LINEWIDTH = "4";
GLOBAL_PERIMETER_SHAPE = "Rectangle"; /*Rectangle Ellipse Circle*/
// ["Center"]

//For example, [0, 0.5, -1, 0] defines a Left anchor with a connector curve that emanates leftward from the anchor. Similarly, [0.5, 0, 0, -1] defines a Top anchor with a connector curve emanating upwards.
var GLOBAL_RECT_ANCHOR = [
    [  0.5, 0,    0, -1, 0, 0, "top" ],
    [  1,   0.5,  1,  0, 0, 0, "right" ],
    [  0.5, 1,    0,  1, 0, 0, "bottom" ],
    [  0,   0.5, -1,  0, 0, 0, "left" ],
    [  1,   0,    1, -1, 0, 0, "ne" ],
    [  1,   1,    1,  1, 0, 0, "se" ],
    [  0,   0,   -1, -1, 0, 0, "nw" ],
    [  0,   1,   -1,  1, 0, 0, "sw" ]
];

var _td = 0.15;
var GLOBAL_CLOUD_ANCHOR = [
    [   0.55,  -0.1,   0, -1, 0, 0, "n" ],
    [   1.08,  0.7,   1,  0, 0, 0, "e" ],
    [   0.55,   1.1,   0,  1, 0, 0, "s1" ],
    [  -0.08,  0.7,  -1,  0, 0, 0, "w" ],
    [   1-_td, _td,     1, -1, 0, 0, "ne" ],
    [   1,     1,     1,  1, 0, 0, "se" ],
    [   _td,   _td,  -1, -1, 0, 0, "nw" ],
    [   0,     1,    -1,  1, 0, 0, "sw" ]
];





var queryString = queryStringFunction();
var param_docId = queryString.docId;


function isNumeric(n) {  return !isNaN(parseFloat(n)) && isFinite(n);  }
function isInt(n) {   return n % 1 === 0; }
// Helper function to create an element with attributes
function tag(name, attrs) {
  var el = document.createElement(name.toString());

  !!attrs && Object.keys(attrs).forEach(function(key) {
    el.setAttribute(key, attrs[key]);
  });

  return el;
}


if (!isInt(param_docId)) {
    var docName = prompt("Document not provided. Chose a name if you want to create a new document:", "New Document");
    if (docName) {
        $.ajax({
            url: baseURL+"webapi/doc/"+docName,
            type: 'POST',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function(box) {
                //param_docId = box.id;
                //var posi = window.location.href.indexOf("index.html");
                //var newURL = window.location.href.substring(0, posi);
                //window.location.href = newURL+"index.html";
                window.location.href = baseWebURL+"index.html?docId="+box.id;
                //loadGraph();

/*               
                if (old_processId == param_processId) {
                    //reload the page
                    location.reload(true);
                } else {
                    param_processId = old_processId;    
                }
*/                

            },
            error: function(data) {
                alert( "Error during document creation. Please re-load the page. \n\n"+httpErrorCapture(data) );
            }
        });            
    } else {
        alert( "No document. Please re-load the page.");    
    }
    
    throw ("No document. Please re-load the page.");
}

/*
var modalWin = tag('div', {"id": "modalWin"});
var modalFrame = tag('div', {"id": "modalFrame"});
var modalCloseX = tag('span', {"id": "modalCloseX"});
var modalContent = tag('div', {"id": "modalContent"});
//modalFrame.appendChild(modalCloseX);
//modalFrame.appendChild(modalContent);
//modalWin.appendChild(modalFrame);
modalWin.appendChild(modalCloseX);
modalWin.appendChild(modalContent);
modalContent.style = "width:700px; height:600px; border: 1px solid #888; background-color:yellow; margin:auto";
modalContent.innerHTML = "<object type='text/html' data='fogSettings.html' style='width:100%; height:100%'></object>";
//modalContent.innerHTML = "Test...";
*/
window.onclick = function(event) {
    if (event.target == modalWin) {
        modalWin.style.display = "none";
    }
}








function addGraphNodeToGUI(curNode) {
    var fogId = curNode.id;
    var fogName = curNode.props.name;
    var fogPosX = (curNode.props.posX!=0 && curNode.props.posX!=null) ? curNode.props.posX : 0;//posX_dummy++*20;
    var fogPosY = (curNode.props.posY!=0 && curNode.props.posY!=null) ? curNode.props.posY : 0;//posY_dummy++*20;

    var shapeX = document.createElement('div'); //          FlowPanel shapeX = new FlowPanel();
    
    shapeX.id = NODE_ID_PREFIX + fogId; //shapeX.setId(NODE_ID_PREFIX + cnl.nodeID);
    var strNodeNUM = fogId + "";
    shapeX.def = curNode;
    
    window.canvas.appendChild(shapeX);

    refreshDef(shapeX);


    //alert(NODE_ID_PREFIX);
    //console.log("creating node with HTML-ID " + NODE_ID_PREFIX + i);
    registerNode(NODE_ID_PREFIX, strNodeNUM, fogPosX, fogPosY);
    registerNodeEditable(NODE_ID_PREFIX, strNodeNUM, fogName); 

}

function refreshDef(shapeX) { 
    var curNode = shapeX.def;
    var fogId = curNode.id;
    var props = curNode.props;
    var fogName = props.name;
    var fogPosX = (props.posX!=0 && props.posX!=null) ? props.posX : 0;//posX_dummy++*20;
    var fogPosY = (props.posY!=0 && props.posY!=null) ? props.posY : 0;//posY_dummy++*20;
    
    var theHtml = "";
    theHtml += "<div id='ep"+fogId+"' class='ep deletable'>";
    theHtml += "<p class='deletable' id='p"+fogId+"'>"+fogName+"</p>";
    theHtml += "</div> ";
    theHtml += "<svg xmlns='http://www.w3.org/2000/svg' id='svgCloud' version='1.1' viewBox='0 0 274.58338 169.95401'> <g transform='translate(-125.77974,-122.06466)' id='layer1'> <path id='path3293' class='jspDragHandle' d='m 284.00314,122.06466 a 57.911863,57.911863 0 0 0 -47.4077,24.703 43.709289,43.709289 0 0 0 -15.5907,-2.928 43.709289,43.709289 0 0 0 -43.70901,43.709 43.709289,43.709289 0 0 0 0.25,4.256 50.164606,50.164606 0 0 0 -46.76599,50.045 50.164606,50.164606 0 0 0 49.65719,50.139 l -0.022,0.03 h 0.5192 156.51701 a 57.911863,57.911863 0 0 0 57.91198,-57.912 57.911863,57.911863 0 0 0 -53.59559,-57.695 57.911863,57.911863 0 0 0 -57.7851,-54.342 z' /> </g> </svg>";    
    //theHtml += "<svg xmlns='http://www.w3.org/2000/svg' id='svgCloud' version='1.1' viewBox='0 0 264.58338 169.95401'> <g transform='translate(-130.77974,-122.06466)' id='layer1'> <path id='path3293' class='jspDragHandle' d='m 284.00314,122.06466 a 57.911863,57.911863 0 0 0 -47.4077,24.703 43.709289,43.709289 0 0 0 -15.5907,-2.928 43.709289,43.709289 0 0 0 -43.70901,43.709 43.709289,43.709289 0 0 0 0.25,4.256 50.164606,50.164606 0 0 0 -46.76599,50.045 50.164606,50.164606 0 0 0 49.65719,50.139 l -0.022,0.03 h 0.5192 156.51701 a 57.911863,57.911863 0 0 0 57.91198,-57.912 57.911863,57.911863 0 0 0 -53.59559,-57.695 57.911863,57.911863 0 0 0 -57.7851,-54.342 z' /> </g> </svg>";


    shapeX.innerHTML = theHtml;
    //jsPlumb.addToDragSelection(obj);
    if (shapeX.className == null || shapeX.className == "") {
        /*shapeX.className = "bvar jspDragHandle shape deletable"; */
        shapeX.className = "bvar shape deletable"; 
    }
    
    
    
    shapeX.style.left = fogPosX+"px"; //shapeX.getElement().setAttribute("STYLE", "left: " + cnl.pX + "px; top: " + cnl.pY + "px;");
    shapeX.style.top = fogPosY+"px";

    shapeX.title = fogName + " (id:" + fogId + ")";


    /*
    *       register listeners
    */


    var strNodeNUM = fogId + "";
    var winName = NODE_ID_PREFIX + strNodeNUM;

    function captionDblKlickHandler(e) {
        //window.document.getElementById(winName).addEventListener('dblclick', function(e) {
        //console.log("label mouse dblclick: " + winName);

        //var fogShape = window.document.getElementById(winName);
        var fogDefToSet = shapeX.def;


        $("#fogNameInput").val(fogDefToSet.props.name);
        $("#fogIdSettings").val(fogDefToSet.id);


        $("#descriptionSettings").val("bla bla bla");

        $("#positionXSettings").val(fogDefToSet.props.posX);
        $("#positionYSettings").val(fogDefToSet.props.posY);



        $("#btnSaveFogSettings").unbind("click");
        $("#btnSaveFogSettings").click(function () {
            
            if (modalWin.style.display != "block")   return; 
            modalWin.style.display = "none";

            var selectedUser = $("#assigneeSettings").find(":selected"); //selectedUser.val()
            var oldCaption = fogDefToSet.props.name;
            var newCaption = $("#fogNameInput").val();
            fogDefToSet.props.name = $("#fogNameInput").val();
            

            $.ajax({
                url: baseURL+"webapi/doc/"+param_docId+"/nodebulk",
                type: 'POST',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                data: JSON.stringify( [fogDefToSet] ),
                success: function(box) {
                    
                    fogDefToSet.props.name = newCaption;
                    //fogDefToSet.description = $("#descriptionSettings").val();
                    refreshDef(shapeX);
                },
                error: function(data) {
                    fogDefToSet.props.name = oldCaption;
                    alert( "Save fog settings failed.\n\n"+httpErrorCapture(data) );
                }
            });

        });
        

        modalWin.style.display = "block";

        $("#fogNameInput").select();

    }



    window.document.getElementById("p"+strNodeNUM).addEventListener('dblclick', captionDblKlickHandler);


}




function refreshDoc(docDef) {
    if (docDef != null) {
        var fogNodes = docDef.fogNodes;
        for (var i=0; i<fogNodes.length; i++) {
            var fogShape = document.getElementById(NODE_ID_PREFIX+fogNodes[i].id);
            fogShape.def = fogNodes[i];
            refreshDef(fogShape);
        }    
    }
}


function myAttachEvent(element, type, handler) {
	if (element.addEventListener) element.addEventListener(type, handler, false);
	else element.attachEvent("on"+type, handler);
}







var registerNodeEditable = function(nodeIdPrefix, strNodeNUM, caption) {
    
    var winName = nodeIdPrefix + strNodeNUM;
        
    
    window.jsPlumb.makeSource(winName, {
        //paintStyle:{ fillStyle:"red" },
        //deleteEndpointsOnDetach:true,
        filter:".ep > p",
//        anchor:[ "Perimeter", { shape:GLOBAL_PERIMETER_SHAPE, anchorCount:128 } ],
//        anchor:[ "Center" ],
        anchor: GLOBAL_CLOUD_ANCHOR,
        maxConnections:-1
    });

     
    //jsPlumb.makeTarget("targetDiv", endpointOptions);
    window.jsPlumb.makeTarget(winName, {
        //deleteEndpointsOnDetach:true,
        dropOptions:{ hoverClass:"dragHover" },
//       anchor:[ "Perimeter", { shape:GLOBAL_PERIMETER_SHAPE, anchorCount:128 } ]
        //anchor:[ "Center" ]
        anchor: GLOBAL_CLOUD_ANCHOR
    });
   
    //   jsPlumb_dragged    jsplumb-drag
    
    

    window.jsPlumb.draggable(winName, {
        grid: [20, 20],
        filter:":not(.jspDragHandle)",
        start: function(params){
            
            if (window.mX !== undefined) {
                window.dropCheck(params.e);
            }
            window.mX = params.e.clientX;
            window.mY = params.e.clientY;                       
            console.log(params.el.id + " dragStarted   mX:" + mX + "  mY:" + mY);
        },
        stop: function(params){
            console.log(params.el.id + " dragStopped");
            window.dropCheck(params.e);
        },                
        //consumeFilteredEvents:true
        consumeFilteredEvents:false
    });        




}
        


//window.arrowOverlayDefinition = [ "Arrow", {location:1, id:"arrow", length:16, foldback:1.0} ];


function repaintEdges(fogNodes) {
    jsPlumb.detachEveryConnection();
    window.LOCKED = true;
    for (i=0; i<fogNodes.length; i++) {
        var curNode = fogNodes[i];
        var fogId = curNode.id;
        var srcHtmlId = NODE_ID_PREFIX + fogId;

        var dests = curNode.edges; //ancestors==descendants!!!
        if (dests) {
            for (c=0; c<dests.length;c++) {
                var tgtHtmlId = NODE_ID_PREFIX + dests[c];
                //addConnectionToJSPlumb(srcHtmlId, tgtHtmlId);
                window.jsPlumb.connect({
                    source:srcHtmlId, 
                    target:tgtHtmlId,
                    paintStyle:{ 
                        //stroke:GLOBAL_LINECOLOR, 
                        strokeStyle:GLOBAL_LINECOLOR, 
                        gradient:{
                            stops:[[0,'red'], [1,'blue']]
                        },
                        lineWidth:GLOBAL_LINEWIDTH 
                    }, //the order matters in jsPlumb!!!
                    //overlays : [ window.arrowOverlayDefinition ],  //arrows
                    //anchor:[ "Perimeter", { shape:GLOBAL_PERIMETER_SHAPE, anchorCount:128 } ],
                    //anchor:[ "Center" ],
                    anchor: GLOBAL_CLOUD_ANCHOR,
                    connector:"Straight"
                });                
                //alert("add connection: src:"+srcHtmlId+"   tgt:"+tgtHtmlId);
            }
        }
    }   
    window.LOCKED = false;    
}







function loadGraph() {

    console.log("Loading doc with id " + param_docId);

	/*
	 *	Load Fog-Tree
	 *
	 */
    $.ajax(baseURL+"webapi/doc/"+param_docId,
    {
        "async": false,
        "method": "GET",
        "success": function(graph) {

            /*
             *  Clear the canvas
             *
             */
            var divWrapperM = document.getElementById('wrapperM');
            divWrapperM.removeChild(win);
            window.win = document.createElement("DIV");
            win.id = "win";

            //win.innerHTML = "<div id='canvas' style='transform-origin: 0% 0% 0px; transform: none;'></div>"
            //win.innerHTML = "<div id='canvas'></div>"
            window.canvas = document.createElement("DIV");
            canvas.id = "canvas";
            win.appendChild(canvas);
            //window.canvas = document.createElement("DIV", {"id":"canvas", "style":"transform-origin: 0% 0% 0px; transform: none;"});
            
            divWrapperM.appendChild(win);
            //window.jsPlumb.reset();
            jsPlumb.detachEveryConnection();
            //myJsPlumb = new createJsPlumbInstance();
            
            // determine the canvas section which contains all the nodes
            var shiftX = 0;
            var shiftY = 0;

            //Object.keys(graph.fogNodes).length
            if (graph.fogNodes.length > 0) {
                var minX = graph.fogNodes[0].props.posX;
                var maxX = graph.fogNodes[0].props.posX;
                var minY = graph.fogNodes[0].props.posY;
                var maxY = graph.fogNodes[0].props.posY;
                for (i=0; i<graph.fogNodes.length; i++) {
                    var curProps = graph.fogNodes[i].props;
                    if (curProps.posX < minX) minX = curProps.posX;
                    if (curProps.posY < minY) minY = curProps.posY;
                    if (curProps.posX > maxX) maxX = curProps.posX;
                    if (curProps.posY > maxY) maxY = curProps.posY;
                }

                minX = minX - 80; //left margin 
                minY = minY - 60; //top margin
                maxX = maxX + 250 + 80; //right margin
                maxY = maxY + 105 + 60; //bottom margin

                if (maxX > minX && maxY > minY) {
                    var dX = (maxX - minX) / window.win.offsetWidth;
                    var dY = (maxY - minY) / window.win.offsetHeight;
                    window.zoom = dX > dY ? 1/dX : 1/dY;
                    //shiftX = minX / (window.win.offsetWidth-blw-blw);
                    //shiftY = minY / (window.win.offsetHeight-btw-btw);                                    
                    shiftX = minX * window.zoom / window.win.offsetWidth;
                    shiftY = minY * window.zoom / window.win.offsetHeight;
                }
            }

            createJsPlumbInstance(shiftX, shiftY);


            /*
             *  Nodes
             */
            for (i=0; i<graph.fogNodes.length; i++) {
                var curNode = graph.fogNodes[i];
                addGraphNodeToGUI(curNode);
            } 

            /*
             *  Edges
             */
            repaintEdges(graph.fogNodes);


            window.jsPlumb.setZoom(window.zoom);

            
            
            refreshCursor();
        },
        "error": function(data) {
            alert( "Failed to load graph. \n\n"+httpErrorCapture(data) );
        }
    });



}









document.addEventListener("DOMContentLoaded", function() {
    
});





  


/*
document.attachEvent("onreadystatechange", function(){
	if (document.readyState === "complete"){	
		document.detachEvent( "onreadystatechange", arguments.callee );
		initialization();
	}
});
*/







function btnToggle(btnPressed) {

    var buttonsActive = window.document.getElementsByClassName('btnActive');
    for (var i=0; i<buttonsActive.length; i++) {
    	buttonsActive[i].className = "toolbar-button";
    }

    btnPressed.className = "toolbar-button btnActive";

    refreshCursor();
}

function refreshCursor() {
    var folder = "css/images/";
    if ( btnIsActive(btnAddFog) ) {
        window.win.style.cursor = "url("+folder+"cloudplus.png), pointer";
        canvas.style.cursor = "url("+folder+"cloudplus.png), pointer";
    } else if ( btnIsActive(btnErase) ) {
        window.win.style.cursor = "url("+folder+"erase.png), pointer";
        canvas.style.cursor = "url("+folder+"erase.png), pointer";
    } else if ( btnIsActive(btnSelect) ) {
        window.win.style.cursor = "default";   //cursor: url(cursor.gif), pointer;  //window.win.style.cursor = "default";        
        canvas.style.cursor = "default";
    }    
}

function btnIsActive(button) {
	return button.className.indexOf("btnActive") > -1;
}








function btnEnable(btn) {
    btn.className = btn.className.replace("btnDisabled", "btnEnabled");
}
function btnDisable(btn) {
    btn.className = btn.className.replace("btnEnabled", "btnDisabled");   
}
function isBtnEnabled(btn) {
    return btn.className.indexOf("btnEnabled") > -1;
}



function initialization() {
 


    //myJsPlumb = new createJsPlumbInstance();
    createJsPlumbInstance();

    //document.body.appendChild(modalWin);
    var modalWin = document.getElementById("modalWin");
    var modalCloseX = document.getElementById("modalCloseX");
    modalCloseX.onclick = function() { modalWin.style.display = "none"; }



    var btnSelect = document.getElementById("btnSelect");
    var btnErase = document.getElementById("btnErase");
    var btnAddFog = document.getElementById("btnAddFog");

    
    btnToggle(btnSelect);

    myAttachEvent(btnSelect, "click", function(e){ 
        btnToggle(btnSelect);
    });
    myAttachEvent(btnErase, "click", function(e){ 
        btnToggle(btnErase);
    });
    myAttachEvent(btnAddFog, "click", function(e){ 
        btnToggle(btnAddFog);
    });

	





    /////////////////////////////////
    //   LOAD GRAPH
    /////////////////////////////////
    /*
     *
     *	Actions after jsPlumb is ready
     *
     */
	jsPlumb.ready(function()  {
        if (isInt(param_docId)) {
            loadGraph();
        }
	});










} //END Initialization

















































































/*
 *
 *  Editor javascript functions 
 *
 */


var vVisited = [];
var vFinished = [];
function dfs(src, tgt) {
    vVisited = [];
    vFinished = [];
    
    vVisited[src] = true;
    //console.log("dfs node discovered (start): " + src);
    
    return dfshelper(tgt);
};
function dfshelper(v) {
    //console.log("dfs node discovered: " + v);
    if (vFinished[v]) return false;
    if (vVisited[v]) return true;
    vVisited[v] = true;
    var selection = window.jsPlumb.getConnections({source:v}, true);
    
    //for every descendant w of v: dfshelper(w)
    for (var i=0; i<selection.length; i++) {
        var con = selection[i];
        
        var result = dfshelper(con.targetId);
        //  if dfs(w)=true, then return(true)
        if (result == true) 
            return true;
    }
    
    vFinished[v] = true;
    return false;
};


var getDests = function(src) {
    var conns = jsPlumb.getConnections({source: src.id}, true);           
    for(i=0; i<conns.length; i++) {
        var tgt = conns[i].targetId;
        //console.log("destinations: " + tgt);
    }           
};        


var getAncestorCount = function(node) {         
    return jsPlumb.getConnections({target: node.id}, true).length;
};  
      

var getAncestors = function(node) {         
    var conns = jsPlumb.getConnections({target: node.id}, true);
    var result = new Array(conns.length);
    
    for(i=0; i<conns.length; i++) {
        result[i] = conns[i].source;
    };
    
    return result;
               
};        



var getChildren = function(node) {         
    var conns = jsPlumb.getConnections({source: node.id}, true);
    var result = new Array(conns.length);
    
    for(i=0; i<conns.length; i++) {
        result[i] = conns[i].target;
    };
    
    return result;
               
};    



        
        
/*
 * Behavior of FormCanvas super-class for adding new nodes to the canvas.
 * Necessary to create instances of jsPlumb in newly inserted nodes
 * 
 * @param strNodeNUM The node id of the newly inserted node
 * @param outcomes The outcomes of the newly inserted node
 * @param caption The caption of the newly inserted node     
 */        
var registerNode = function(nodeIdPrefix, strNodeNUM, posX, posY) {

    var winName = nodeIdPrefix + strNodeNUM;
    var winObj = document.getElementById(winName);
    //console.log("register node " + strNodeNUM);
     
    jsPlumb.setContainer("canvas");
    
    
    var label = document.getElementById("lbl"+strNodeNUM);

            
    //winObj.offsetLeft = posX;
    //winObj.offsetTop = posY;
    winObj.style.left = posX;
    winObj.style.top = posY;

//    alert("registerNode " + winName + "   obj.id:" + winObj.id + "   obj.style.left:" + winObj.style.left + "   obj.offsetLeft:" + winObj.offsetLeft  + "   obj.offsetTop:" + winObj.offsetTop);





    document.getElementById(winName).onmousedown = function (e) {
        //console.log("node mouse down: " + winName);
        
        e = e || window.event;

        //execute pseudo mousemove in order to prevent jsPlumb from creating dead anchors   
//               var evt = document.createEvent("MouseEvents");
//                evt.initMouseEvent('mousemove',true,true,document.defaultView,0,e.screenX,e.screenY,e.clientX,e.clientY,false,false,false,false,0,null);
//                document.getElementById(winName).dispatchEvent(evt);            
                
        
        var rightmouse = false;
        if (e.which) rightmouse = (e.which == 3);
        else if (e.button) rightmouse = (e.button == 2);
        

        //if the given element winName has not the class jsplumb-drag-selected... 
        if ( (' ' + document.getElementById(winName).className + ' ').indexOf(' jsplumb-drag-selected ') == -1 ) {
            if (!e.ctrlKey)
                jsPlumb.clearDragSelection();
              
              
            addToSelection( jsPlumb.getSelector("#"+winName) );


        } else { //the node has already been selected 
            if (e.ctrlKey) {
                jsPlumb.removeFromDragSelection(jsPlumb.getSelector("#"+winName));
            }
        }
        
        
        if (rightmouse) {
            //alert("right down");
            
                    //execute pseudo mouse-up in order to prevent jsPlumb from executing a drag on right mouse button
//                    var evt = document.createEvent("MouseEvents");
//                    evt.initEvent("mouseup", true, true);
//                    document.getElementById(winName).dispatchEvent(evt);
        }            

        
        //lastMouseDownTarget = document.getElementById('win'); 
        lastMouseDownTarget = e.target;    
        //console.log("lastMouseDownTarget: " + lastMouseDownTarget.id);          
    };
    
    

    function addToSelection(obj) {
        jsPlumb.addToDragSelection(obj);
    };
	
	
};
        
        
/*
 * used to check if an element has been moved after dropping
 */
var dropCheck = function(event) {
	if (  ( Math.abs(window.mX-event.clientX) > 3 || Math.abs(window.mY-event.clientY) > 3 )  ) {
        var reposElems = window.document.getElementsByClassName('jsplumb-drag-selected');
        var updateDefs = [];
        // The current behavior is to sync positions with the db if the x-y-coordinates are distinct.
        for (var i=0; i<reposElems.length; i++) {
        	console.log(reposElems.length + "send reposition " + reposElems[i].id + ": x:" +  reposElems[i].offsetLeft + " y:" + reposElems[i].offsetTop);
        	//window.dbSetPosition(reposElems[i].id, reposElems[i].offsetLeft, reposElems[i].offsetTop);
        	reposElems[i].def.props.posX = reposElems[i].offsetLeft;
        	reposElems[i].def.props.posY = reposElems[i].offsetTop;
            updateDefs[i] = {"id": reposElems[i].def.id, "props": reposElems[i].def.props};

        }

        console.log ( JSON.stringify( updateDefs ) );
        
        $.ajax(baseURL+"webapi/doc/"+param_docId+"/nodebulk", 
        {
            "dataType": "json",
            "data": JSON.stringify( updateDefs ),
            "contentType": "application/json; charset=UTF-8",
            "async": false,
            "method": "POST",
            "success": function(box) {
            },
            "error": function(data) {
                alert( "Position update failed. \n\n"+httpErrorCapture(data) );
            }
        });
    }
    window.mX = undefined;
    window.mY = undefined;
}



        
        













var repetitiveInstatiation = false;


        





function createJsPlumbInstance(leftScroll, topScroll) {
    window.scrollx = 0;
    window.scrolly = 0;

    if (leftScroll) {
        window.scrollx = leftScroll;
    }
    if (topScroll) {
        window.scrolly = topScroll;
    }
//var createJsPlumbInstance = new function() {


    //alert(showBrowserVersion.valueOf());

    window.win = window.document.getElementById('win');
    window.canvas = window.document.getElementById('canvas');



    //window.jsPlumb.setContainer("canvas");
    window.jsPlumb.importDefaults({
        //deleteEndpointsOnDetach:true,
        Connector:"Straight",
        //PaintStyle:{ lineWidth:GLOBAL_LINEWIDTH, stroke:GLOBAL_LINECOLOR, strokeStyle:GLOBAL_LINECOLOR}, //, "dashstyle":"2 4" },
        PaintStyle:{ 
            //stroke:GLOBAL_LINECOLOR, 
            strokeStyle:GLOBAL_LINECOLOR, 
            gradient:{
                stops:[[0,'green'], [1,'blue']]
            },
            lineWidth:GLOBAL_LINEWIDTH 
        },               
        Endpoint: "Blank", //Endpoint:[ "Dot", { radius:1 } ],
        Container:"canvas",
        ConnectionsDetachable:false
    });
    //window.jsPlumb.setContainer("canvas");        






            
//////////////////////////////////////////////////////////////////////////////////////

    window.mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };




    
    
    window.lastMouseDownTarget = null;
    
    //window.selectmode = true;
    //window.erasemode = false;
    //window.addmode = false;
    
    window.leftmouse = false;
    window.rightmouse = false;
    window.referenceX = 0;
    window.referenceY = 0;
    window.contextMenu = false;
    
    window.dx = 0;
    window.dy = 0;
//    window.scrollx = 0;
//    window.scrolly = 0;
    window.u1x = 0;
    window.u1y = 0;
    //window.zoom = 1.01;
    
    
    window.zoomConstant = 1.125; //the 3rd root of 2
    
    
    window.element = null;

    
    window.blw = 0; //parseInt(document.defaultView.getComputedStyle(win,null).getPropertyValue('border-left-width'), 10);
    window.btw = 0; //parseInt(document.defaultView.getComputedStyle(win,null).getPropertyValue('border-top-width'), 10);
    
    //execute the zooming in order to calibrate the view and the varaibles
    
/*    
    this.resetZoom = function() {
    	referenceX = 0;
    	referenceY = 0;
	    dx = 0;
	    dy = 0;
	    scrollx = 0;
	    scrolly = 0;
	    u1x = 0;
	    u1y = 0;
	    zoom = 1.01;

		element = null;
	    blw = 0; //parseInt(document.defaultView.getComputedStyle(win,null).getPropertyValue('border-left-width'), 10);
    	btw = 0; 

	    window.canvas.style.webkitTransform = "none";
        window.canvas.style.MozTransform = "none";
        window.canvas.style.msTransform = "none";
        window.canvas.style.OTransform = "none";
        window.canvas.style.transform = "none";
	    //setTransform();

	    window.jsPlumb.setZoom(zoom);
    }
*/

    function setTransform(){
        var percentBaseX = 100*(window.win.offsetWidth-blw-blw)/(window.canvas.offsetWidth);
        var percentBaseY = 100*(window.win.offsetHeight-blw-blw)/(window.canvas.offsetHeight);
        var uString = percentBaseX*(u1x) + "% " + percentBaseY*(u1y) + "%";
        //var uString = u2x*(win.offsetWidth-blw-blw)*zoom + "px " + u2y*(win.offsetHeight-btw-btw)*zoom + "px";
        //var uString = "100px 100px";
        ////console.log("uString: " + (u1x * 100) + "% " + (u1y * 100) + "%");
        
        var strTransform = 'translate('+(-scrollx*percentBaseX)+'%,'+(-scrolly*percentBaseY)+'%) scale('+zoom+')';
        //var strTransform = 'translate(0px,0px) scale('+zoom+')';
        

        window.canvas.style.webkitTransformOrigin = uString;
        window.canvas.style.MozTransformOrigin = uString;
        window.canvas.style.msTransformOrigin = uString;
        window.canvas.style.OTransformOrigin = uString;
        window.canvas.style.transformOrigin = uString;     
                  
        window.canvas.style.webkitTransform = strTransform;
        window.canvas.style.MozTransform = strTransform;
        window.canvas.style.msTransform = strTransform;
        window.canvas.style.OTransform = strTransform;
        window.canvas.style.transform = strTransform;
        


        
        window.jsPlumb.setZoom(window.zoom);
    };
        


    
    setTransform();





    function isIntersecting(r1, r2) {
        return !(r2.offsetLeft > r1.offsetLeft + r1.offsetWidth || 
                 r2.offsetLeft + r2.offsetWidth < r1.offsetLeft || 
                 r2.offsetTop > r1.offsetTop + r1.offsetHeight ||
                 r2.offsetTop + r2.offsetHeight < r1.offsetTop);
    };        
    
    
    function FindPosition(oElement) {
        if(typeof( oElement.offsetParent ) != "undefined") {
            for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            return [ posX, posY ];
        } else {
            return [ oElement.x, oElement.y ];
        }
    };
    
    function getWinPos(e) {
        var posX = 0;
        var posY = 0;
        var myPos = FindPosition(window.win);
         
        if (!e) var e = window.window.event;
        if (e.pageX || e.pageY) {
            posX = e.pageX;
            posY = e.pageY;
        } else if (e.clientX || e.clientY) {
            posX = e.clientX + window.document.body.scrollLeft + window.document.documentElement.scrollLeft;
            posY = e.clientY + window.document.body.scrollTop + window.document.documentElement.scrollTop;
        }
        posX = posX - myPos[0] - blw;
        posY = posY - myPos[1] - btw;

//                //console.log("x: " +  posX + "    y: " +  posY + "     cX: " + winPos[0] + "  cy: " + winPos[1]);

        return [ posX, posY ];
       
    };








    function getRelWinPos(e) {
        var winPos = getWinPos(e);
        var rX = winPos[0]/(window.win.offsetWidth-blw-blw);
        var rY = winPos[1]/(window.win.offsetHeight-btw-btw);
        
        ////console.log("rX: " +  rX + "    rY: " +  rY);
        
        return [ rX, rY ];
    }
    
    
    function relPosToCanvas(rPos) {
        var px = (  dx + (rPos[0]+scrollx) / (zoom)  )*(window.win.offsetWidth -blw-blw);
        var py = (  dy + (rPos[1]+scrolly) / (zoom)  )*(window.win.offsetHeight-btw-btw);
        return [px,py];
    };        







    function winMoveHandler(e) {
        var ev = e || window.window.event; //Moz || IE
        //var winPos = getWinPos(e); //0=x  1=y
        var rPos = getRelWinPos(e);
        var cPos = relPosToCanvas(rPos);
        

        
        if (element !== null) {
            element.style.width = ( window.Math.abs(cPos[0] - mouse.startX) ) + 'px';
            element.style.height = ( window.Math.abs(cPos[1] - mouse.startY) ) + 'px';
            element.style.left = ( (cPos[0] - mouse.startX < 0) ? cPos[0] : mouse.startX )  + 'px';
            element.style.top =  ( (cPos[1] - mouse.startY < 0) ? cPos[1] : mouse.startY )  + 'px';                
            ////console.log("win-offsetWidth: " + win.offsetWidth);
            
            if (!e.ctrlKey)
                window.jsPlumb.clearDragSelection();
            var candidates = window.document.getElementsByClassName('bvar');
            for (var i=0; i<candidates.length; i++) {
//                        alert("candidate: " + candidates[i].id);
                if (isIntersecting(element, candidates[i])) {
                    ////console.log("intersection with " + candidates[i].id);
                    window.jsPlumb.addToDragSelection(window.jsPlumb.getSelector("#"+candidates[i].id));
                }
            }
        }
        
        
        
        if (window.rightmouse) {
        	//alert(rPos);

            //add delta
            scrollx = scrollx + (referenceX - rPos[0]);
            scrolly = scrolly + (referenceY - rPos[1]);
            contextMenu = false;
            setTransform();

        } 

        referenceY = rPos[1];
        referenceX = rPos[0];        
        
        
    }









    function winMouseDownHandler(e) {
        var winPos = getWinPos(e);
        var rPos = getRelWinPos(e);
        var cPos = relPosToCanvas(rPos);
        
        if (!e) var e = window.event;

        if (e.which) window.rightmouse = (e.which == 3);
        else if (e.button) window.rightmouse = (e.button == 2);

        if (e.which) window.leftmouse = (e.which == 1);
        else if (e.button) window.leftmouse = (e.button == 1 || e.button == 0);            
        
        
        if (window.leftmouse && !e.ctrlKey) 
            window.jsPlumb.clearDragSelection();
        
        //if (window.addmode && window.leftmouse) {
        if (btnIsActive(btnAddFog) && window.leftmouse) {
 
            //window.dbCreateNewNode(Math.round(cPos[0]), Math.round(cPos[1]));
			//var theData = '{ "positionX": ' + Math.round(cPos[0]) + ', "positionY": ' + Math.round(cPos[1]) + ', "fogName": "New" }';
			var newNode = { "posX": Math.floor((cPos[0])/20)*20-60, 
							"posY": Math.floor((cPos[1])/20)*20-40, 
							"name": "New"
						};

			$.ajax(baseURL+"webapi/doc/"+param_docId+"/node",
	        {
	        	"dataType": "json",
	        	"contentType": "application/json; charset=UTF-8",
	            "async": false,
	            "method": "POST",
	            "data": JSON.stringify(newNode),
	            "success": function(box) {
                    addGraphNodeToGUI(box);        
	            },
                "error": function(data) {
                    alert( "Failed to add new fog. \n\n"+httpErrorCapture(data) );
                }
	        });
                //(  dx + ( (rPos[0]+scrollx) / (zoom) )  )*(win.offsetWidth-blw-blw),
                //(  dy + ( (rPos[1]+scrolly) / (zoom) )  )*(win.offsetHeight-btw-btw)
            
        }
        
        if (window.rightmouse) {
/*        	
            //alert("right mouse");
            alert("right mouse at position: " + rPos);
            referenceX = rPos[0];
            referenceY = rPos[1];
            
            contextMenu = true; //false, if the mouse moves
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            }
  */          
        } else {
        

            ////console.log("left: " + canvas.offsetLeft );
            
            if (element !== null) {
                element.parentElement.removeChild(element);
                element = null;

                //window.win.style.cursor = "default";
                //console.log("finsihed.");
            } else {
                //if (window.selectmode) {
                if (btnIsActive(btnSelect)) {
                	
                    //console.log("start rectangle");
//                            winPos = getWinPos(e);
                    mouse.startX = cPos[0];
                    mouse.startY = cPos[1];
                    element = document.createElement('div');
                    element.className = 'rectangle'
                    //element.style.left = mouse.x + 'px';
                    //element.style.top = mouse.y + 'px';
                    element.style.left = cPos[0] + "px"; //( ( ( winPos[0] ) / (zoom) ) - blw - 0) + 'px';
                    element.style.top = cPos[1] + "px"; //( ( ( winPos[1] ) / (zoom) ) - btw - 0) + 'px';                    
                    window.canvas.appendChild(element)
                    //window.win.style.cursor = "crosshair";
                    
                }
            }
        }
    }

















    var winMouseUpHandler = function(e) {
        //var rPos = getRelWinPos(e);
        if (!e) var e = window.event;
        
        var rightrelease;
        if (e.which) rightrelease = (e.which == 3);
        else if (e.button) rightrelease = (e.button == 2);
        window.rightmouse = window.rightmouse & !(rightrelease);
        window.rightmouse = false;
        
        var leftrelease;
        if (e.which) leftrelease = (e.which == 1);
        else if (e.button) leftrelease = (e.button == 1 || e.button == 0);
        window.leftmouse = window.leftmouse & !(leftrelease);
        
        if (rightrelease) {
            if (contextMenu == true) {
                contextMenu = false;
                //this was meant to be an context menu click!!!
                //alert("context menu");
            }
            if (event.preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            }

        }            
//                if (rightclick) {
//                    alert("Right Release");
//                } 
                    
        if (element !== null) {
            element.parentElement.removeChild(element);
            element = null;
            //canvas.style.cursor = "default";
            //console.log("finsihed.");
        }
    }


















    /////////////////////////////////////////////////////////////////////////////////        


    
    // Event handler for mouse wheel event.
    function winMouseWheelHandler(event){
		
        var delta = 0;
        if (!event) //For IE
                event = window.event;
        if (event.wheelDelta) { // IE/Opera.
                delta = event.wheelDelta/120;
        } else if (event.detail) { // Mozilla case.
                // In Mozilla, sign of delta is different than in IE.
                // Also, delta is multiple of 3.
                delta = -event.detail/3;
        }


        // delta>0, if wheel scrolled up
        if (delta==0)
            return;
        
        ////////////////////////////////////////////
        // do the zooming...
        ////////////////////////////////////////////
        var rPos = getRelWinPos(event);
        var winPos = getWinPos(event);
        
        //console.log("wheel... zoom-before: " + zoom); 
        ////console.log("left: " + canvas.offsetLeft );
        
        
        //variables for the gemetric mean 
        var u2x;
        var u2y;
        

        ////console.log("dx-before: " + dx*(win.offsetWidth-blw-blw) + "    dy-before: " + dy*(win.offsetHeight-btw-btw));


        if (delta > 0) { // zoom in  zf=zoomConstant
            var zf = zoomConstant; 
        } else { // zoom out  zf=1/zoomConstant
            var zf = 1/zoomConstant;
        }




        //relative mouse position on canvas
        //var ufx = dx + ( (rPos[0]) / zoom);  
        //var ufy = dy + ( (rPos[1]) / zoom); 
        var ufx = (rPos[0]+scrollx);  
        var ufy = (rPos[1]+scrolly);
        

        /*
         *   Calculate joint origin for the current zoom and the given old zoom
         */
        u2x = (u1x*zf*(zoom - 1) + ufx*(zf - 1)) / (zf*zoom - 1);
        u2y = (u1y*zf*(zoom - 1) + ufy*(zf - 1)) / (zf*zoom - 1);
        
        
        zoom = zoom * zf;
                


        
        
        //set the distance for the next time (in percent)
        dx = u2x*(zoom-1) / (zoom);   //dx + rPos[0]/(zoom*5);
        dy = u2y*(zoom-1) / (zoom);      //dy + rPos[1]/(zoom*5);            
        
//      console.log("dx-after%: " + dx + "    dy-after%: " + dy);

  

        
        //update the global origin-value for the next time
        u1x = u2x;
        u1y = u2y;

     

        
        setTransform();



        ////////////////////////////////////////////          
        
        // Prevent default actions caused by mouse wheel.
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        }

        event.returnValue = false;
        
        
        //console.log("CanvasOffsetLeft: " + window.canvas.offsetLeft);
    };        
    
    






    






/*
*
*	extended initialization for editing purposes
*
*
*/
     
    var documentKeyDownHandler = function(e) {
        if (modalWin.style.display && modalWin.style.display.toUpperCase() == "BLOCK")   return; 
        e = e || window.event;
        
        if (e.keyCode == 46) {
            //if the last clicked element is a shape  or is the win
            console.log("deleting... lastMouseDownTarget className: " + window.lastMouseDownTarget.className + "   " + window.lastMouseDownTarget.id  );
            if ( (' ' + window.lastMouseDownTarget.className + ' ').indexOf(' deletable ') != -1  ||  window.lastMouseDownTarget.id == "win" ||  window.lastMouseDownTarget.id == "path3293") {

                removals = window.document.getElementsByClassName('jsplumb-drag-selected');
                remLen = removals.length;

                //console.log("about to delete");

                var removeIds = [];
                for (var i=0; i<remLen; i++) {
                    removeIds[i] = removals[i].def.id;
                }

                $.ajax(baseURL+"webapi/doc/"+param_docId+"/nodebulk",
                {
                    dataType: "json",
                    data: JSON.stringify( removeIds ),
                    "contentType": "application/json; charset=UTF-8",
                    "async": false,
                    "method": "DELETE",
                    "success": function(arrRemovedIds) {

                        for (var i=remLen-1; i>=0; i--) {
                            //this removes the node including all connections from or to it
                            //after this: "connection detached" will be fired.
                            window.jsPlumb.removeAllEndpoints(removals[i].id);
                            window.canvas.removeChild(removals[i]);
                        }
                        
                    },
                    "error": function(data) {
                        alert( "Failed to delete fog. \n\n"+httpErrorCapture(data) );
                    }
                });
            }

                
        }
    }
    














    /*
    window.addEventListener("mouseup", function(e){ 
        alert("test"); 
        if (element !== null) {
            element.parentElement.removeChild(element);
            element = null;
            //canvas.style.cursor = "default";
            //console.log("finsihed.");
        }            
        window.leftmouse = false; window.rightmouse = false; });
    */
    

    window.win.addEventListener('mousemove', winMoveHandler, false); 
    //if (window.win.addEventListener) {
    window.win.addEventListener('mousedown', winMouseDownHandler, false);
    //} else {
    //	window.win.attachEvent("onmousedown", winMouseDownHandler);
    //}
    
    window.addEventListener("mouseup", winMouseUpHandler, false);
    //window.win.addEventListener('mouseup', winMouseUpHandler, false);          
    if (window.win.addEventListener) {
        // DOMMouseScroll is for mozilla.
        window.win.addEventListener ("mousewheel", winMouseWheelHandler, false);
        window.win.addEventListener('DOMMouseScroll', winMouseWheelHandler, false);
    } else {
        // IE/Opera
        window.win.onmousewheel = window.document.onmousewheel = winMouseWheelHandler;
    }
    


    

    window.win.oncontextmenu = function() { return !supressBrowserContextMenu };


    







	if (!repetitiveInstatiation) {

        window.document.addEventListener('mousedown', function(event) {
            window.lastMouseDownTarget = event.target;
        }, false);
        window.document.addEventListener('keydown', documentKeyDownHandler, false);
    

 
	    window.jsPlumb.bind("beforeDrop", function(info) {
	        //console.log("connection is about to be established from " + info.sourceId + " on " + info.targetId);
	        
	        if (info.sourceId != info.targetId) { //no loop
	            //console.log(info.sourceId + " != " + info.targetId);

/*	            
	            //cycle check
	            var cycle = window.dfs(info.sourceId, info.targetId);
	            
	            if (cycle) {
	                window.alert("The connection cannot be established because it would cause a cycle.");
	                //window.jsPlumb.detach(con);
	                return false;
	            }
*/

                //check, if such a connection already exists 
                var selection = window.jsPlumb.getConnections({source:info.sourceId, target:info.targetId}, true);
                if (selection.length > 0){
                    return false;
                    //window.jsPlumb.detach(con);
                    //window.jsPlumb.detach(selection[i]);
                };
                var selection = window.jsPlumb.getConnections({source:info.targetId, target:info.sourceId}, true);
                if (selection.length > 0){
                    return false;
                };

                var statusOK = false;
                $.ajax(baseURL+"webapi/doc/"+param_docId+"/node/" + info.source.def.id + "/edgeTo/" + info.target.def.id,
                {
                    "async": false,
                    "method": "POST",
                    "success": function(box) {
                        statusOK = true;
                    },
                    "error": function(data) {
                        window.leftmouse = false;
                        alert( "Failed to create edge. \n\n"+httpErrorCapture(data) );
                    }
                });
                if (!statusOK) return false;
                //if (!statusOK) return false;                
	        } else { //loop
	            //console.log("loop: " + info.sourceId + " == " + info.targetId);
	//                var tep = info.sourceEndpoint;
	//                window.jsPlumb.deleteEndpoint(sep);
	//                var tep = con.endpoints[1];                     
	            return false;
	        }
	        


	        
	        //the connection will definately be added                            

	        //alert(info.connection.endpoints[1].endpoint.x); 
	        return true;               
	            
	    });



	    
	//        window.jsPlumb.bind("connectionDetached", function(con) {
	//            console.log("connectionDetached");
	//        });     


	    //this event gets fired iff connections are being removed by the user
	    window.jsPlumb.bind("beforeDetach", function(con) {
	        //console.log("beforeDetach");
            var statusOK = false;
	        //window.dbDelConnection(con.source.id, con.target.id);
			$.ajax(baseURL+"webapi/doc/"+param_docId+"/node/" + con.source.def.id + "/edgeTo/" + con.target.def.id,
	        {
	        	//"dataType": "json",
	        	//"contentType": "application/json; charset=UTF-8",
	            "async": false,
	            "method": "DELETE",
                "success": function(box) {
                    statusOK = true; 
                },
                "error": function(data) {
                    window.leftmouse = false;
                    alert( "Failed to detach edge. \n\n"+httpErrorCapture(data) );
                }
	        });

            if (!statusOK) return false;
            
	    });              



	    window.jsPlumb.bind("connection", function(info) {
	        

	        info.connection.bind("mouseenter", function(conn) {
	            //alert("you clicked on ", conn);
	            //if (window.erasemode && window.leftmouse) {
				if (btnIsActive(btnErase) && window.leftmouse) {            	
	                window.jsPlumb.detach(conn);
	            }
            
	        });
	        
	        console.log("JSPLUMB-CONNECTION-EVENT: LOCKED=" + window.LOCKED + "  " + info.source.id + "-->" + info.target.id);

	        if (!window.LOCKED) {
	        	console.log("JSPLUMB-CONNECTION-EVENT: Send connection to server...");
	            //add arrow to the connection
	            info.connection.addOverlay(window.arrowOverlayDefinition);
	            
	            //window.dbAddConnection(info.source.id, info.target.id);

	        } 
	        
	    });
	}


	repetitiveInstatiation = true; 

    //window.zoom = 0.7;
    //setTransform();

}; 



        
        
        
        
        
        
        
        
        
        







































/////////////////////////////////////////////////////////////////////////////////////
//      START UTILS



function httpErrorCapture(data) {
    var jsonData = JSON.stringify(data);
    if (data == undefined) return ""; 
    if (data.status == 401) { return "Authorization failed\n\n"+jsonData;
    } else if (data.status == 403) { return "Access forbidden\n\n"+jsonData;
    } else if (data.status == 404) { return "Not found\n\n"+jsonData;
    } else {
        return JSON.stringify(jsonData);
    }    
}


function queryStringFunction() {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}




//      END UTILS
/////////////////////////////////////////////////////////////////////////////////////