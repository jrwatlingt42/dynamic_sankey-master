const convert = require('./convert-units/lib/index');
 var mytitle;
 var measures = 'energy';
 var primaryUnit;
 var color = "white";

 //used to make the indexs of the sankey arrays
 var numNode =1;
 var numLink =1;

 //parrel node arrays to pass to render function
 var nodeLabel = [];
 var nodeName = [];
 var nodeValue =[];
 var nodeUnits = [];
 var conNodeValue =[];
 var nodeColor = [];
 var tempNodeColor =[];

 //parrel link arrays to pass to render function
 var numSource = [];
 var dest = [];
 var linkVal= [];
 var linkUnits = [];
 var conLinkValue =[];
 var linkColor = [];

 //sankey options set to default
 var arrows = false;
 var hasColorGradient =false;
 var startColorGradient = '#1E00FF';
 var endColorGradient ='#FF0000';
 var sankeyIsRendered = false;
 
 // loads lists on startup
 diplaymainUnitList();

 //adds the first data entry UIs
 addLink();
 addNode();
 
 //dropdown list for the primary units
 function diplaymainUnitList()
 {
	var op = document.getElementById("unitOptions");
	var length = op.options.length;
	for (i = length-1; i >= 0; i--)
	{
		op.options[i] = null;
	}

	var select = document.getElementById("unitOptions"); 
	var options = convert().possibilities(measures);
	primaryUnit = options[0];
	for(var i = 0; i < options.length; i++) {
		var opt = options[i];
		var el = document.createElement("option");
		el.textContent = opt;
		el.value = opt;
		select.appendChild(el);
	}
 }

// takes in user input for the title of chart
 function newTitle()
{
	mytitle = document.getElementById("title").value;
}

// takes in measures from the user and changes all unit lists
function newMeasures()
{
	measures =document.getElementById("measures").value;
	diplaymainUnitList();

	for(let i = 1; i < numNode; i++)
	{
		if(nodeColor[i]!=null)
		{
			nodeUnitList(i);
			convertNodeUnits(i);
			newLabel(i);
		}
	}
	for(let i = 1; i < numLink; i++)
	{
		if(linkColor[i]!=null)
		{
			linkUnitList(i);
			convertLinkUnits(i);
		}
	}
}

//takes in user input for primary units and then reconverts all conversions
function newPrimaryUnit()
{
	primaryUnit = document.getElementById("unitOptions").value;

	for(let i = 1; i < conNodeValue.length; i++)
	{
		if(conNodeValue[i]!=null)
			convertNodeUnits(i);
	}
	for(let i = 1; i < conLinkValue.length; i++)
	{
		if(conLinkValue[i]!=null)
			convertLinkUnits(i);
	}
}

//takes in user option for arrows or nodes
function hasArrows(hasArrows)
{
	arrows = hasArrows;
}

//sets the background color to user input
function chartColor()
{
	color = document.getElementById("colorPicker").value;
}

// sets the starting color of the Color Gradient to user input
function startColor()
{
	startColorGradient = document.getElementById("startColor").value;
}

// sets the ending color of the Color Gradient to user input
function endColor()
{
	endColorGradient = document.getElementById("endColor").value;
}

//makes the label for the nodes
function newLabel(numN)
{
	nodeLabel[numN]=nodeName[numN]+" "+
	nodeValue[numN]+" "+nodeUnits[numN];
}

// sets the node name to user input and remakes node label
function newNodeName(numN)
{
	var name = document.getElementById("nodeName"+String(numN)).value;
	if(nodeName.includes(name))
	{
		alert("Please make Node "+numN+"'s name different from others.");
	}
	nodeName[numN] = name;
	newLabel(numN);

	for(let i = 1; i < numLink; i++)
	{
		if(linkColor[i] != null)
		{
			sourceList(i);
			destList(i);
		}
	}
}

// takes in user input of the node value, remakes node label and coverts the value
function newNodeValue(numN)
{
	nodeValue[numN]=document.getElementById("nodeValue"+String(numN)).value;

	if(isNaN(nodeValue[numN]))
	{
		alert("Node "+numN+"'s value needs to be a number.");
		return;
	}
	newLabel(numN);
	convertNodeUnits(numN);
}

// takes in user input of the node unit, remakes node label and coverts the node value
function newNodeUnit(numN)
{
	nodeUnits[numN]=document.getElementById("nodeUnits"+String(numN)).value;
	newLabel(numN);
	convertNodeUnits(numN);
}

// takes in user input of the link unit and coverts the link value
function newLinkUnit(numL)
{
	linkUnits[numL]=document.getElementById("linkUnits"+String(numL)).value;
	convertLinkUnits(numL);
}

// coverts the node value to the primary units
function convertNodeUnits(numN)
{
	var temp = parseFloat(convert(nodeValue[numN]).from(nodeUnits[numN]).to(primaryUnit));
	conNodeValue[numN] = temp.toFixed(2);
	document.getElementById('convertedNodeUnits'+String(numN)).value = conNodeValue[numN] +" "+ primaryUnit;
}

// coverts the link value to the primary units
function convertLinkUnits(numL)
{
	var temp = parseFloat(convert(linkVal[numL]).from(linkUnits[numL]).to(primaryUnit));
	conLinkValue[numL] = temp.toFixed(2);
	document.getElementById('convertedLinkUnits'+String(numL)).value = conLinkValue[numL] +" "+ primaryUnit;
}

//sets the node color to user input
function newNodeColor(numN)
{
	nodeColor[numN]=document.getElementById("nodeColor"+String(numN)).value;
}

// changes the node colors if the color gradent option is selected
function ChangeGradientNodeColor()
{
	if(hasColorGradient)
	{
		for(let i = 1; i < nodeColor.length; i++)
		{
			if(numSource.includes(String(i)))
			{
				tempNodeColor[i] =startColorGradient;
			}
			else
			{
				tempNodeColor[i] =endColorGradient;
			}
		}
	}
	else
	{
		for(let i = 1; i < nodeColor.length; i++)
		{
			tempNodeColor[i] = nodeColor[i];
		}
	}
}

//sets the link color to user input
function newLinkColor(numL)
{
	linkColor[numL]=document.getElementById("linkColor"+String(numL)).value;
}

//takes in the source node from user input(can be the node number or its name)
function newSource(numL)
{
	numSource[numL]=String(nodeName.indexOf(document.getElementById("source"+String(numL)).value));
}

//takes in the destination node from user input(can be the node number or its name)
function newDest(numL)
{
	dest[numL]=String(nodeName.indexOf(document.getElementById("dest"+String(numL)).value));
}

// takes in user input of the link value and coverts the value
function newLinkVal(numL)
{
	linkVal[numL]=document.getElementById("linkVal"+String(numL)).value;

	if(isNaN(linkVal[numL]))
	{
		alert("Link "+numL+"'s value needs to be a number.");
		return;
	}
	convertLinkUnits(numL);
}

//deletes the node UI from the page and clears the elements of the parallel link arrays
function deleteLink(numL)
{
	document.getElementById("Link"+numL).parentNode.removeChild(document.getElementById("Link"+numL));
	numSource[numL]=null;
	dest[numL]=null;
	linkVal[numL]=null;
	linkColor[numL]=null;
	conLinkValue[numL]=null;
}

//deletes the link UI from the page and clears the elements of the parallel link arrays
function deleteINode(numN)
{
	document.getElementById("Node"+numN).parentNode.removeChild(document.getElementById("Node"+numN));
	nodeLabel [numN] = null;
	nodeName[numN] = null;
	nodeValue[numN] = null;
	nodeUnits[numN] = null;
	nodeColor[numN]=null;
	conNodeValue[numN]=null;

	for(let i = 1; i < numLink; i++)
	{
		if(linkColor[i] != null)
		{
			sourceList(i);
			destList(i);
		}
	}
}

//adds the node UI to the page and sets color and unit default values
function addNode()
{
    var makeInputs = document.getElementById("makeInputs");

	var xButton = "";
	if(numNode==1)
		xButton = "disabled";
		
	var newNode = document.createElement("col-md-4");
	newNode.setAttribute("id", "Node"+numNode);
    newNode.innerHTML = 
			"<div style='width: 250px;  display: inline-block;'>"+
				"<table class='table table-bordered' style='margin: 0px;'>"+
					"<tbody>"+
						"<tr id='inputs'>"+
							"<td style='width:120px' class='text-center'>"+
								"<DIV align='right'> <button class='btn btn-secondary' onclick='deleteINode("+numNode+")' style='background-color: #8f3236' "+xButton+"><span class='glyphicon glyphicon-remove'></span></button></DIV>" +
								"<h3 style='margin-top: 5px'>Node "+numNode+"</h3>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon'>Name</span>"+
									"<input type='text' class='form-control' aria-describedby='basic-addon1' onchange='newNodeName("+numNode+")' style='width: 200px' id='nodeName"+String(numNode)+"'>"+
								"</div>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon' id='basic-addon1'>Value</span>"+
									"<input type='text' class='form-control' aria-describedby='basic-addon1' onchange='newNodeValue("+numNode+")' style='width: 200px' id='nodeValue"+String(numNode)+"'>"+
								"</div>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon' id='basic-addon1'>Units</span>"+
									"<select type='text' class='form-control' aria-describedby='basic-addon1' onchange='newNodeUnit("+numNode+")' style='width: 200px' id='nodeUnits"+String(numNode)+"'></select>"+
								"</div>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon' id='basic-addon1'>Converted Units</span>"+
									"<input type='text' class='form-control' aria-describedby='basic-addon1' style='width: 200px' id='convertedNodeUnits"+String(numNode)+ "' readonly='true'>"+
								"</div>"+
									"<input type='color' class='inp' id='nodeColor"+numNode+"' onchange = 'newNodeColor("+numNode+")' value='#1E00FF' style='width: 200px'>"+
							"</td>"+
						"</tr>"+
					"</tbody>"+
				"</table>"+
			"</div>";
	
	
	
	
	makeInputs.appendChild(newNode);
	nodeColor[numNode] = '#1E00FF';
	nodeUnitList(numNode);
    numNode++;
}

//diplays unit list for each node
function nodeUnitList(numN)
{
	var op = document.getElementById("nodeUnits"+String(numN));
	var length = op.options.length;
	for (i = length-1; i >= 0; i--)
	{
		op.options[i] = null;
	}

	var unitSelect = document.getElementById("nodeUnits"+String(numN)); 
	var unitOptions = convert().possibilities(measures);
	nodeUnits[numN]=unitOptions[0];
	for(var i = 0; i < unitOptions.length; i++)
	{
		var opt = unitOptions[i];
		var el = document.createElement("option");
		el.textContent = opt;
		el.value = opt;
		unitSelect.appendChild(el);
	}
}

//adds the link UI to the page and sets color and unit default values
function addLink()
{
    var makeLinks = document.getElementById("makeLinks");

	var xButton = "";
	if(numNode==1)
		xButton = "disabled";

	var newLink = document.createElement("col-md-4");
	newLink.setAttribute("id", "Link"+numLink);
    newLink.innerHTML =
			"<div style='width: 285px;  display: inline-block;'>"+
				"<table class='table table-bordered' style='margin: 0px;'>"+
					"<tbody>"+
						"<tr id='inputs'>"+
							"<td style='width:120px' class='text-center'>"+
								"<DIV align='right'> <button class='btn btn-secondary' onclick='deleteLink("+numLink+")' style='background-color: #8f3236' "+xButton+"><span class='glyphicon glyphicon-remove'></span></button></DIV>" +
								"<h3 style='margin-top: 5px'>Link "+numLink+"</h3>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon'>Source</span>"+
									"<select type='text' class='form-control' aria-describedby='basic-addon1' onchange='newSource("+numLink+")' style='width: 238px' id='source"+String(numLink)+"'> </select>"+
								"</div>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon'>Destination</span>"+
									"<select type='text' class='form-control' aria-describedby='basic-addon1' onchange='newDest("+numLink+")' style='width: 238px' id='dest"+String(numLink)+"'> </select>"+
								"</div>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon'>Value</span>"+
									"<input type='text' class='form-control' aria-describedby='basic-addon1' onchange='newLinkVal("+numLink+")' style='width: 238px'id='linkVal"+String(numLink)+"'>"+
								"</div>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon' id='basic-addon1'>Units</span>"+
									"<select type='text' class='form-control' aria-describedby='basic-addon1' onchange='newLinkUnit("+numLink+")' style='width: 238px' id='linkUnits"+String(numLink)+"'></select>"+
								"</div>"+
								"<div class='input-group'>"+
									"<span class='input-group-addon' id='basic-addon1'>Converted Units</span>"+
									"<input type='text' class='form-control' aria-describedby='basic-addon1' style='width: 238px' id='convertedLinkUnits"+String(numLink)+ "' readonly='true'>"+
								"</div>"+
								"<input type='color' class='inp' id='linkColor"+numLink+"' onchange = 'newLinkColor("+numLink+")' value='#EFECEC' style='width: 238px'>"+
							"</td>"+
						"</tr>"+
					"</tbody>"+
				"</table>"+
			"</div>"+
		"</div>";
	
	makeLinks.appendChild(newLink);
	linkColor[numLink] = '#EFECEC';
	linkUnitList(numLink);
	sourceList(numLink);
	destList(numLink);
    numLink++;
}

//diplays unit list for each link
function sourceList(numL)
{
	var op = document.getElementById("source"+String(numL));
	var length = op.options.length;
	for (i = length-1; i >= 0; i--)
	{
		op.options[i] = null;
	}

	var sourceSelect = document.getElementById("source"+String(numL)); 
	var sourceOptions = nodeName;
	for(var i = 1; i < sourceOptions.length; i++)
	{
		if(nodeColor[i]!=null && nodeName[i]!=null)
		{
			var opt = sourceOptions[i];
			var el = document.createElement("option");
			el.textContent = opt;
			el.value = opt;
			sourceSelect.appendChild(el);
		}
	}
	sourceSelect.value = nodeName[numSource[numL]];
	sourceSelect.onchange();
}

//diplays unit list for each link
function destList(numL)
{
	var op = document.getElementById("dest"+String(numL));
	var length = op.options.length;
	for (i = length-1; i >= 0; i--)
	{
		op.options[i] = null;
	}

	var destSelect = document.getElementById("dest"+String(numL)); 
	var destOptions = nodeName;
	for(var i = 1; i < destOptions.length; i++)
	{
		if(nodeColor[i]!=null && nodeName[i]!=null)
		{
			var opt = destOptions[i];
			var el = document.createElement("option");
			el.textContent = opt;
			el.value = opt;
			destSelect.appendChild(el);
		}
	}
	destSelect.value = nodeName[dest[numL]];
	destSelect.onchange();
}

//diplays unit list for each link
function linkUnitList(numL)
{
	var op = document.getElementById("linkUnits"+String(numL));
	var length = op.options.length;
	for (i = length-1; i >= 0; i--)
	{
		op.options[i] = null;
	}

	var linkSelect = document.getElementById("linkUnits"+String(numL)); 
	var linkUnitOptions = convert().possibilities(measures);
	linkUnits[numL]=linkUnitOptions[0];
	for(var i = 0; i < linkUnitOptions.length; i++)
	{
		var opt = linkUnitOptions[i];
		var el = document.createElement("option");
		el.textContent = opt;
		el.value = opt;
		linkSelect.appendChild(el);
	}
}

//makes the UI for the gradent color options to the page and set hasColorGradient to true
function addColorGradient()
{
	if(!hasColorGradient)
	{
		var ColorOption = document.getElementById("colorGradient");

		var newGradient = document.createElement("text");
		newGradient.setAttribute("id", "selectColors");
		newGradient.innerHTML = "<br><h5>Start Color</h5>"+
		"<input type='color' class='inp' id='startColor' onchange = 'startColor()' value='#1E00FF' style='width: 238px'>"+
		"<h5>End Color</h5>"+
		"<input type='color' class='inp' id='endColor' onchange = 'endColor()' value='#FF0000' style='width: 238px'></input>";

		ColorOption.appendChild(newGradient);
		hasColorGradient = true;
	}

}

//removes the UI for the gradent color options from the page and set hasColorGradient to false
function removeColorGradient()
{
	if(hasColorGradient)
	{
		document.getElementById("selectColors").parentNode.removeChild(document.getElementById("selectColors"));
		hasColorGradient = false;
		startColorGradient = '#1E00FF';
 		endColorGradient ='#FF0000';
	}
}

//changes the end nodes from rectangles to triangles
function buildSvgArrows() 
{
    const rects = document.querySelectorAll('.node-rect');
    const arrowOpacity = '0.9';
    const arrowShape = 'polygon(100% 50%, 0 0, 0 100%)'
	var endNodeColor;
	
	var k =1;
	for (let i = 0; i < rects.length; i++) 
	{
	  while(nodeColor[i+k] == null)
	  {
		k++;
	  }

	  if (!numSource.includes(String(i+k))) 
	  {
		if(hasColorGradient)
		{
			endNodeColor = endColorGradient;
		}
		else
		{
			endNodeColor = nodeColor[i+k];
		}
        const height = rects[i].getAttribute('height');
		
        rects[i].setAttribute('style', `width: ${height*.25}px; height: ${height}px; clip-path:  ${arrowShape}; 
         stroke-width: 0.5; stroke: rgb(255, 255, 255); stroke-opacity: 0.5; fill: ${endNodeColor}; fill-opacity: ${arrowOpacity};`);
      }
	}
}

//adds color gradent to the end links
function addGradientElement()
{
    const mainSVG = document.querySelector('.main-svg')
    const svgDefs = document.querySelector('defs')

    svgDefs.innerHTML = `
    <linearGradient id="psatLinkGradient">
      <stop offset="10%" stop-color=${startColorGradient} />
      <stop offset="100%" stop-color=${endColorGradient} />
    </linearGradient>
    `;
    // Insert our gradient Def
	mainSVG.appendChild(svgDefs);
	
	var k = 1;
	const links = document.querySelectorAll('.sankey-link');	
	for (let i = 0; i < links.length; i++) 
	{
		while(dest[i+k]==null)
		{
			k++;
		}
		if(!numSource.includes(String(dest[i+k])))
		{
			links[i].setAttribute('style', `fill: ${"url(#psatLinkGradient)"};`);
		}
		else
		{
			links[i].setAttribute('style', `fill: ${startColorGradient};`);
		}
	}
  }

  function visableNodeLabels() 
{
	const nodeSpot = document.getElementsByClassName('node-label');
	for (let i = 0; i < nodeSpot.length; i++) 
	{
		nodeSpot[i].setAttribute('style', "cursor: default; fill: rgb(68, 68, 68);"+
		 "text-shadow: rgb(255, 255, 255) -2px 2px 2px,rgb(255, 255, 255) 2px 2px 2px,"+
		 "rgb(255, 255, 255) 2px -2px 2px, rgb(255, 255, 255) -2px -2px 2px; font-family:"+
		"'Open Sans', verdana, arial, sans-serif; font-size: 15px; fill-opacity: 1;");
	}
}

  //downloads the sankey
function downloadSankey() 
{
	if(sankeyIsRendered)
		saveSvgAsPng(document.querySelector("svg"), "Sankey.png");
	else
		alert("Sankey has not been rendered yet!");
}

// adds all the units coming to and from each node and compares it the the nodes value
//alerts the user if the values are not equal
function numericCheck()
{
	let checkSourceValue = [];
	let checkDestValue = [];
	let alertMessage = "Warning!\n\n";
	let numericC = false;

	for (let i = 1; i < nodeValue.length; i++)
	{
		checkSourceValue[i]= parseFloat(0);
		checkDestValue[i]= parseFloat(0);
	}

	for (let i = 1; i < linkVal.length; i++)
	{
		checkSourceValue[numSource[i]]= checkSourceValue[numSource[i]]+parseFloat(conLinkValue[i]);
		checkDestValue[dest[i]]= checkDestValue[dest[i]]+parseFloat(conLinkValue[i]);
	}

	for (let i = 1; i < conNodeValue.length; i++)
	{
		if(!(conNodeValue[i]==checkSourceValue[i])&&numSource.includes(String(i)))
		{
			alertMessage=alertMessage.concat(nodeName[i]+" has a value of "+conNodeValue[i]+primaryUnit+", but has "+ checkSourceValue[i]+primaryUnit+" flowing from it.\n");
			numericC = true;
		}
		if(!(conNodeValue[i]==checkDestValue[i])&&dest.includes(String(i)))
		{
			alertMessage=alertMessage.concat(nodeName[i]+" has a value of "+conNodeValue[i]+primaryUnit+", but has " + checkDestValue[i]+primaryUnit+" flowing to it.\n");
			numericC = true;
		}
	}

	if(numericC)
	{
		if (confirm(alertMessage))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	return true;
}

//takes all global varables and uses them to render the sankey
function renderSankey()
{
	if(!numericCheck())
		return;

	ChangeGradientNodeColor();

    var data = [{
    type: "sankey",
        arrangement: "freeform",
		valuesuffix: primaryUnit,
        node:{
			label: nodeLabel,
			color: tempNodeColor,
            pad:45}, 
        link: {
            source: numSource,
            target: dest,
			value: conLinkValue,
			color: linkColor}
        }]
		
    var layout = {
		"title": mytitle,
		paper_bgcolor: color
	}
	
	Plotly.newPlot('myDiv', data, layout)

	if(arrows)
		buildSvgArrows();

	if(hasColorGradient)
	{		
		addGradientElement();

		var myPlot = document.getElementById('myDiv');
		myPlot.on('plotly_afterplot', function(){
			visableNodeLabels();
			addGradientElement();
		});
	}
	else
	{
		var myPlot = document.getElementById('myDiv');
		myPlot.on('plotly_afterplot', function(){
			visableNodeLabels();
		});
	}
	visableNodeLabels();
	
	sankeyIsRendered = true;
}

function example()
{
	document.getElementById("title").value = "Process Energy (TBtu), 2014 from https://www.energy.gov";
	document.getElementById("title").onchange();
	hasArrows(false);
	removeColorGradient();
	document.getElementById("measures").value = "energy";
	document.getElementById("measures").onchange();
	document.getElementById("unitOptions").value = "Btu";
	document.getElementById("unitOptions").onchange();

	for(i= numNode; i < 11; i++)
	{
		addNode();
	}
	for(i= numLink; i < 26; i++)
	{
		addLink();
	}


	document.getElementById("nodeName1").value = "Steam";
	document.getElementById("nodeValue1").value = "3080";
	document.getElementById("nodeUnits1").value = "Btu";
	document.getElementById("nodeColor1").value = "#8cc3ed";

	document.getElementById("nodeName2").value = "Electricity";
	document.getElementById("nodeValue2").value = "2438";
	document.getElementById("nodeUnits2").value = "Btu";
	document.getElementById("nodeColor2").value = "#f57067";

	document.getElementById("nodeName3").value = "Fuel";
	document.getElementById("nodeValue3").value = "5303";
	document.getElementById("nodeUnits3").value = "Btu";
	document.getElementById("nodeColor3").value = "#f2f551";

	document.getElementById("nodeName4").value = "Process Heating";
	document.getElementById("nodeValue4").value = "7517";
	document.getElementById("nodeUnits4").value = "Btu";
	document.getElementById("nodeColor4").value = "#fffffc";

	document.getElementById("nodeName5").value = "Process Cooling & Refrigeration";
	document.getElementById("nodeValue5").value = "346";
	document.getElementById("nodeUnits5").value = "Btu";
	document.getElementById("nodeColor5").value = "#fffffc";

	document.getElementById("nodeName6").value = "Machine Drive";
	document.getElementById("nodeValue6").value = "2122";
	document.getElementById("nodeUnits6").value = "Btu";
	document.getElementById("nodeColor6").value = "#fffffc";

	document.getElementById("nodeName7").value = "Electro-Chemical";
	document.getElementById("nodeValue7").value = "234";
	document.getElementById("nodeUnits7").value = "Btu";
	document.getElementById("nodeColor7").value = "#fffffc";

	document.getElementById("nodeName8").value = "Other Process Uses";
	document.getElementById("nodeValue8").value = "602";
	document.getElementById("nodeUnits8").value = "Btu";
	document.getElementById("nodeColor8").value = "#fffffc";

	document.getElementById("nodeName9").value = "Applied Energy";
	document.getElementById("nodeValue9").value = "6371";
	document.getElementById("nodeUnits9").value = "Btu";
	document.getElementById("nodeColor9").value = "#a6f288";

	document.getElementById("nodeName10").value = "Process End Use Losses";
	document.getElementById("nodeValue10").value = "4450";
	document.getElementById("nodeUnits10").value = "Btu";
	document.getElementById("nodeColor10").value = "#9b85f2";
	
	for(i =1; i<11; i++)
	{
		document.getElementById("nodeName"+i).onchange();
		document.getElementById("nodeValue"+i).onchange();
		document.getElementById("nodeUnits"+i).onchange();
		document.getElementById("nodeColor"+i).onchange();
	}

	document.getElementById("source1").value = "Steam";
	document.getElementById("dest1").value = "Process Heating";
	document.getElementById("linkVal1").value = "2353";
	document.getElementById("linkUnits1").value = "Btu";
	document.getElementById("linkColor1").value = "#8cc3ed";

	document.getElementById("source2").value = "Steam";
	document.getElementById("dest2").value = "Process Cooling & Refrigeration";
	document.getElementById("linkVal2").value = "96";
	document.getElementById("linkUnits2").value = "Btu";
	document.getElementById("linkColor2").value = "#8cc3ed";

	document.getElementById("source3").value = "Steam";
	document.getElementById("dest3").value = "Machine Drive";
	document.getElementById("linkVal3").value = "360";
	document.getElementById("linkUnits3").value = "Btu";
	document.getElementById("linkColor3").value = "#8cc3ed";

	document.getElementById("source4").value = "Steam";
	document.getElementById("dest4").value = "Electro-Chemical";
	document.getElementById("linkVal4").value = "0";
	document.getElementById("linkUnits4").value = "Btu";
	document.getElementById("linkColor4").value = "#8cc3ed";

	document.getElementById("source5").value = "Steam";
	document.getElementById("dest5").value = "Other Process Uses";
	document.getElementById("linkVal5").value = "271";
	document.getElementById("linkUnits5").value = "Btu";
	document.getElementById("linkColor5").value = "#8cc3ed";

	document.getElementById("source6").value = "Electricity";
	document.getElementById("dest6").value = "Process Heating";
	document.getElementById("linkVal6").value = "368";
	document.getElementById("linkUnits6").value = "Btu";
	document.getElementById("linkColor6").value = "#f57067";

	document.getElementById("source7").value = "Electricity";
	document.getElementById("dest7").value = "Process Cooling & Refrigeration";
	document.getElementById("linkVal7").value = "219";
	document.getElementById("linkUnits7").value = "Btu";
	document.getElementById("linkColor7").value = "#f57067";

	document.getElementById("source8").value = "Electricity";
	document.getElementById("dest8").value = "Machine Drive";
	document.getElementById("linkVal8").value = "1548";
	document.getElementById("linkUnits8").value = "Btu";
	document.getElementById("linkColor8").value = "#f57067";

	document.getElementById("source9").value = "Electricity";
	document.getElementById("dest9").value = "Electro-Chemical";
	document.getElementById("linkVal9").value = "234";
	document.getElementById("linkUnits9").value = "Btu";
	document.getElementById("linkColor9").value = "#f57067";

	document.getElementById("source10").value = "Electricity";
	document.getElementById("dest10").value = "Other Process Uses";
	document.getElementById("linkVal10").value = "69";
	document.getElementById("linkUnits10").value = "Btu";
	document.getElementById("linkColor10").value = "#f57067";

	document.getElementById("source11").value = "Fuel";
	document.getElementById("dest11").value = "Process Heating";
	document.getElementById("linkVal11").value = "4796";
	document.getElementById("linkUnits11").value = "Btu";
	document.getElementById("linkColor11").value = "#f2f551";

	document.getElementById("source12").value = "Fuel";
	document.getElementById("dest12").value = "Process Cooling & Refrigeration";
	document.getElementById("linkVal12").value = "31";
	document.getElementById("linkUnits12").value = "Btu";
	document.getElementById("linkColor12").value = "#f2f551";

	document.getElementById("source13").value = "Fuel";
	document.getElementById("dest13").value = "Machine Drive";
	document.getElementById("linkVal13").value = "214";
	document.getElementById("linkUnits13").value = "Btu";
	document.getElementById("linkColor13").value = "#f2f551";

	document.getElementById("source14").value = "Fuel";
	document.getElementById("dest14").value = "Electro-Chemical";
	document.getElementById("linkVal14").value = "0";
	document.getElementById("linkUnits14").value = "Btu";
	document.getElementById("linkColor14").value = "#f2f551";

	document.getElementById("source15").value = "Fuel";
	document.getElementById("dest15").value = "Other Process Uses";
	document.getElementById("linkVal15").value = "262";
	document.getElementById("linkUnits15").value = "Btu";
	document.getElementById("linkColor15").value = "#f2f551";

	document.getElementById("source16").value = "Process Heating";
	document.getElementById("dest16").value = "Applied Energy";
	document.getElementById("linkVal16").value = "4961";
	document.getElementById("linkUnits16").value = "Btu";
	document.getElementById("linkColor16").value = "#a6f288";

	document.getElementById("source17").value = "Process Heating";
	document.getElementById("dest17").value = "Process End Use Losses";
	document.getElementById("linkVal17").value = "2556";
	document.getElementById("linkUnits17").value = "Btu";
	document.getElementById("linkColor17").value = "#9b85f2";

	document.getElementById("source18").value = "Process Cooling & Refrigeration";
	document.getElementById("dest18").value = "Applied Energy";
	document.getElementById("linkVal18").value = "228";
	document.getElementById("linkUnits18").value = "Btu";
	document.getElementById("linkColor18").value = "#a6f288";

	document.getElementById("source19").value = "Process Cooling & Refrigeration";
	document.getElementById("dest19").value = "Process End Use Losses";
	document.getElementById("linkVal19").value = "118";
	document.getElementById("linkUnits19").value = "Btu";
	document.getElementById("linkColor19").value = "#9b85f2";

	document.getElementById("source20").value = "Machine Drive";
	document.getElementById("dest20").value = "Applied Energy";
	document.getElementById("linkVal20").value = "753";
	document.getElementById("linkUnits20").value = "Btu";
	document.getElementById("linkColor20").value = "#a6f288";

	document.getElementById("source21").value = "Machine Drive";
	document.getElementById("dest21").value = "Process End Use Losses";
	document.getElementById("linkVal21").value = "1369";
	document.getElementById("linkUnits21").value = "Btu";
	document.getElementById("linkColor21").value = "#9b85f2";

	document.getElementById("source22").value = "Electro-Chemical";
	document.getElementById("dest22").value = "Applied Energy";
	document.getElementById("linkVal22").value = "122";
	document.getElementById("linkUnits22").value = "Btu";
	document.getElementById("linkColor22").value = "#a6f288";

	document.getElementById("source23").value = "Electro-Chemical";
	document.getElementById("dest23").value = "Process End Use Losses";
	document.getElementById("linkVal23").value = "112";
	document.getElementById("linkUnits23").value = "Btu";
	document.getElementById("linkColor23").value = "#9b85f2";

	document.getElementById("source24").value = "Other Process Uses";
	document.getElementById("dest24").value = "Applied Energy";
	document.getElementById("linkVal24").value = "307";
	document.getElementById("linkUnits24").value = "Btu";
	document.getElementById("linkColor24").value = "#a6f288";

	document.getElementById("source25").value = "Other Process Uses";
	document.getElementById("dest25").value = "Process End Use Losses";
	document.getElementById("linkVal25").value = "295";
	document.getElementById("linkUnits25").value = "Btu";
	document.getElementById("linkColor25").value = "#9b85f2";

	for(i= 1; i < 26; i++)
	{
		document.getElementById("source"+i).onchange();
		document.getElementById("dest"+i).onchange();
		document.getElementById("linkVal"+i).onchange();
		document.getElementById("linkUnits"+i).onchange();
		document.getElementById("linkColor"+i).onchange();
	}

	renderSankey();
}