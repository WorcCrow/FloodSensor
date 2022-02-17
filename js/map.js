currLat = "0"
currLng = "0"
currZoom = "0"
currRad = "10"
function id(i){
	return document.getElementById(i)
}

function sendReq(path,param) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", path, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(param);
}

function getSensors(mode){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(mode == "loadSensor"){
				placeSensor(this.responseText)
			}else if(mode == "loadSimulation"){
				sensorTable(this.responseText)
			}
		}
	}
	xhttp.open("POST", "./php/updateFlood.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("action=getSensors&myLat=" + parseFloat(coordinate.lat) + "&myLng=" + parseFloat(coordinate.lng));
}

function loadSensorMap(){
	setInterval(function(){getSensors("loadSensor")},4000)
}

function placeSensor(sensors){
	device = JSON.parse(sensors)
	window.localStorage.sensors = sensors
	for(x=0;x<device.sensors.length;x++){
		//Placing Sensor
		data = JSON.parse(device.sensors[x])
		if(data.name != ""){
			if(eval("window." + data.name.replace(/ /g,"")) == undefined){
				eval(data.name.replace(/ /g,"") + " = new H.map.Circle({lat:"+data.latitude+",lng:"+data.longitude+"},"+data.radius+",{style:{strokeColor:'white',lineWidth:1,fillColor:'rgba(0,0,0,0.5)'}})")
				
				if(eval(data.name.replace(/ /g,"") + ".Me") == null){
					map.addObject(eval(data.name.replace(/ /g,"")));
				}
			}
			setLevel(data.name.replace(/ /g,""),data.state)
		}
	}
}


function loadSimulateFlood(){
	setTimeout(function(){getSensors("loadSimulation")},2000)
}

function sensorTable(sensors){
	device = JSON.parse(sensors)
	id("senseLoc").innerHTML = ""
	for(x=0;x<device.sensors.length;x++){
		stateLevel = ""
		if(JSON.parse(device.sensors[x]).name != ""){
			switch(JSON.parse(device.sensors[x]).state){
				case "0":
				stateLevel = "<option value=0 selected>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option>"
				break;
				
				case "1":
				stateLevel = "<option value=0>0</option><option value='1' selected>1</option><option value='2'>2</option><option value='3'>3</option>"
				break;
				
				case "2":
				stateLevel = "<option value=0>0</option><option value='1'>1</option><option value='2' selected>2</option><option value='3'>3</option>"
				break;
				
				case "3":
				stateLevel = "<option value=0>0</option><option value='1'>1</option><option value='2'>2</option><option value='3' selected>3</option>"
				break;
			}
			id("senseLoc").innerHTML = id("senseLoc").innerHTML + "<tr><td>" + JSON.parse(device.sensors[x]).name + "</td><td><select id='" + JSON.parse(device.sensors[x]).sid + "' onchange='simulateLevel(this.id,this.value)'>" + stateLevel + "</select></td></tr>"
		}	
	}
}

function simulateLevel(i,v){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "./php/updateFlood.php?action=sensorUpdate&sid=" + i + "&level=" + v, true);
	xhttp.send();
}


function setLevel(sense,lvl){
	switch(lvl){
		case "0":
		eval(sense + ".setStyle({strokeColor:'white',fillColor:'rgba(0,0,0,0.5)'})")
		break;
		
		case "1":
		eval(sense + ".setStyle({strokeColor:'white',fillColor:'rgba(255,255,0,0.5)'})")
		break;
		
		case "2":
		eval(sense + ".setStyle({strokeColor:'white',fillColor:'rgba(255,165,0,0.5)'})")
		break;
		
		case "3":
		eval(sense + ".setStyle({strokeColor:'white',fillColor:'rgba(255,0,0,0.5)'})")
		break;
	}
	
}

function putCoordinate(mlat,mlng,zoomlvl){
	marker.setCenter({lat:mlat,lng:mlng},true)
	currLat = mlat
	currLng = mlng
	currZoom = zoomlvl
}

function updateRadius(rad){
	marker.setRadius(rad * 10)
	currRad = rad
	id("radius").innerHTML = currRad
}

function changeLocation(lat,lng,zoom){
	try{map.removeObject(userMarker)}catch(e){}
	map.setCenter({lat:lat,lng:lng})
	map.setZoom(zoom)
	userMarker = new H.map.Marker({lat:lat, lng:lng});
    map.addObject(userMarker);
}

function gotoLocation(lat,lng,zoom){
	map.setCenter({lat:lat,lng:lng})
	map.setZoom(zoom)
}

function updateSensor(mode){
	if(mode == "Auto"){
		sidV = document.getElementsByName("sensorID")
		for(x=0;x<sidV.length;x++){
			if(sidV[x].checked == true){
				sid = sidV[x].value
			}
		}
	}else{
		sid = id("sensorID").value
	}
	path = "./php/updateFlood.php"
	action = "updateSensor"
	name = id("sensorName").value
	lat = currLat
	lng = currLng
	zoom = currZoom
	rad = currRad
	if(currLat != 0 && currLng != 0 && currZoom != 0){
		if(name == "" || sid == ""){ alert("Please fill all the entry."); return;}
		sensors = JSON.parse(localStorage.sensors).sensors
		for(x=0;x<sensors.length;x++){
			if(name == JSON.parse(JSON.parse(localStorage.sensors).sensors[x]).name){
				alert("Sensor name already used");
				return;
			}
		}
		sendReq(path,"action=" + action + "&name=" + name + "&sid=" + sid + "&latitude=" + lat + "&longitude=" + lng + "&zoomlvl=" + zoom + "&radius=" + rad * 10)
		alert("Sensor Name : " + name + "\nSensor ID : " + sid)
		id("modalClose").click()
	}else{
		alert("Select position on map first!")
	}
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
	coordinate = {'lat':position.coords.latitude,'lng':position.coords.longitude}
	changeLocation(position.coords.latitude,position.coords.longitude,15)
    },function(error){alert(error.message);}, {enableHighAccuracy: true,timeout : 5000});
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
setTimeout(function(){getLocation()},2000)

function searchReq(search) {
	path = "https://places.api.here.com/places/v1/autosuggest?Accept-Language=en-US%2Cen%3Bq%3D0.9&app_id=Dcy4qF63QMlEEGMJmA8l&app_code=JruboChN7-HXegZGUHiZng&at="+coordinate.lat+","+coordinate.lng+"&q="
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			searchResult(this.responseText)
		}
	}
	xhttp.open("GET", path + search, true);
	xhttp.send();
}

function searchResult(param){
	sr = JSON.parse(param)
	container = "<div style=color:#efffff>"
	for(x=0; x<sr.results.length; x++){
		if(sr.results[x].position != undefined){
			container = container + "<a class=srcht data-dismiss=modal onclick=changeLocation("+sr.results[x].position+",15)>"+ sr.results[x].title +"</a>\
			<div class=srchdesc>\
			<span>"+ sr.results[x].vicinity +"</span><br>\
			<span>"+ sr.results[x].distance +" M</span><br>\
			</div><hr>"
		}
	}
	container = container + "<div style=color:#efffff>"
	document.getElementById("searchResult").innerHTML = container
}	

function changePasswordModal(){
    document.getElementsByClassName("modal-title")[0].innerHTML = "Change Password"
	document.getElementsByClassName("modal-body")[0].innerHTML = "<input type=password class=form-control placeholder='Current Password' id=currentpass maxlength=30>\
        <input type=password class=form-control placeholder='New Password' id=newpass maxlength=30>\
        <input type=password class=form-control placeholder='Confirm Password' id=confirmpass maxlength=30>\
        <button type=button class='btn btn-primary btn-block' onclick=changePass()>Change</button></form>"
}

function changePass(){
	currPass = id("currentpass").value
	newPass = id("newpass").value
	confirmPass = id("confirmpass").value
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			alertCall(this.responseText)
		}
	}
	xhttp.open("POST", "./php/updateFlood.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("action=changePass&currpass="+currPass+"&newpass="+newPass+"&confirmpass="+confirmPass);
}

function alertCall(stat){
	if(stat != null){
		alert(stat);
	}
}


function searchModal(){
	document.getElementsByClassName("modal-title")[0].innerHTML = "Search"
	document.getElementsByClassName("modal-body")[0].innerHTML = "<input type=Search class=form-control placeholder='Search Places' onkeypress='searchReq(this.value)'><div id=searchResult align=center></div>"
}

function sensorModal(){
	sense = JSON.parse(window.localStorage.sensors)
	sortRes = []
	tempRes = []
	
	
	document.getElementsByClassName("modal-title")[0].innerHTML = "Active Sensor List"
	document.getElementsByClassName("modal-body")[0].innerHTML = "<div id=sensorLoc align=center></div>"
	
	for(x=0;x<sense.sensors.length;x++){
		tempRes.push(Math.abs(JSON.parse(sense.sensors[x]).distance))
	}
	tempRes.sort(function(a, b){return a-b});
	for(x=0;x<tempRes.length;x++){
		for(y=0;y<sense.sensors.length;y++){
			if(tempRes[x] == JSON.parse(sense.sensors[y]).distance){
				sortRes.push(JSON.parse(sense.sensors[y]))
				sense.sensors.splice(y,1)
			}
		}
	}
	container = ""
	for(x=0; x<sortRes.length; x++){
		if(sortRes[x].name != ""){
			container = container + "<div style=color:#efffff><a class=srcht data-dismiss=modal onclick=gotoLocation("+sortRes[x].latitude+","+sortRes[x].longitude+","+sortRes[x].zoomlvl+")><b>"+sortRes[x].name+"</b></a>\
				<div class=srchdesc>\
				<span><b>Level:</b> " + sortRes[x].state + "</span>\
				<span style=float:right><b>Last Update:</b> </span><br>\
				<b>Distance:</b> " + (sortRes[x].distance).toFixed(2) + " <span style=float:right>" + sortRes[x].updatedDate + " <br> " + sortRes[x].updatedTime + "</span><br>"
				if(document.title == "Admin Panel"){
					container = container + "<button onclick=removeSensor(\"" + btoa(sortRes[x].name) + "\",'" + sortRes[x].id +"') style=border-radius:5px;border:none;background-color:red;color:#edf6ff>REMOVE</button>"
				}
			
			container = container + "<br><br></div></div><hr>"
		}
	}
	document.getElementById("sensorLoc").innerHTML = container
}	

function removeSensor(n,i){
	conf = confirm("Do you want to remove " + atob(n) + " sensor?")
	if(conf == true){
		sendReq("./php/updateFlood.php","action=removeSensor&id="+i)
		sense = JSON.parse(window.localStorage.sensors)
		for(x=0;x<sense.sensors.length;x++){
			if(JSON.parse(sense.sensors[0]).id == i){
				sense.sensors.splice(x,1)
				window.localStorage.sensors = JSON.stringify(sense)
			}
		}
	}
	sensorModal()
	setTimeout(function(){sensorModal()},1500)
}

function addSensorModal(){
	sense = JSON.parse(window.localStorage.sensors)
	if(currLat != 0 && currLng != 0 && currZoom != 0){
	//if(document.getElementsByClassName("modal-title")[0].innerHTML != "Add Sensor"){
		document.getElementsByClassName("modal-title")[0].innerHTML = "Add Sensor"
		document.getElementsByClassName("modal-body")[0].innerHTML = "<input type=text id=sensorName class=form-control placeholder='Sensor Name' maxlength=30>\
			<input type=text id=sensorID class=form-control placeholder='Sensor ID' maxlength=30>\
			<input type=text id=lat class=form-control placeholder=Latitude value="+currLat+" disabled>\
			<input type=text id=lng class=form-control placeholder=Longitude value="+currLng+" disabled>\
			<input type=text id=zoom class=form-control placeholder='Zoom Level' value="+currZoom+" disabled>\
			<button id=addSensor type=button class='btn btn-primary btn-block' onclick=updateSensor('Manual')>Add Sensor</button>"
	//}
	}else{
		alert("Select position on map first!")
	}
}			

addRemover = setInterval(function(){
	if(document.getElementsByTagName("div")[document.getElementsByTagName("div").length-1].className != "modal-footer"){
		document.getElementsByTagName("div")[document.getElementsByTagName("div").length-1].style.display = "none"
		clearInterval(addRemover)
	}
},500)


function unregisteredModal(){
	sense = JSON.parse(window.localStorage.sensors)
	document.getElementsByClassName("modal-title")[0].innerHTML = "List of Unregistered Sensors"
	document.getElementsByClassName("modal-body")[0].innerHTML = "<div id=sensorLoc align=center></div>"
	
	container = ""
	for(x=0; x<sense.sensors.length; x++){
		if(JSON.parse(sense.sensors[x]).name == ""){
			container = container + "<div style=color:#efffff;width:80%>\
						<input style=float:left; class=srcht type=radio name=sensorID value=" + JSON.parse(sense.sensors[x]).sid + ">\
						"+ JSON.parse(sense.sensors[x]).sid +"<span style=float:right>Level "+ JSON.parse(sense.sensors[x]).state + "</span>\
						</div><hr>"
		}
	}
	container = container + "<div class=srchdesc>\
				<input type=text class=form-control id=sensorName placeholder='Assign Sensor Name'>\
				<button type=button class='btn btn btn-block' onclick=updateSensor('Auto')>Assign</button>\
				</div>"
	document.getElementById("sensorLoc").innerHTML = container
}
/////////////////////////////////////////////////////////////////////////////////////////

coordinate = {'lat':'14.4445','lng':'120.9939'}

var platform = new H.service.Platform({
	'app_id': 'Dcy4qF63QMlEEGMJmA8l',
	'app_code': 'JruboChN7-HXegZGUHiZng',
	'useHTTPS': true
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(document.getElementById('mapContainer'),defaultLayers.satellite.traffic,{zoom:15,center: {lat: coordinate.lat , lng: coordinate.lng}});

var mapEvents = new H.mapevents.MapEvents(map);
var behavior = new H.mapevents.Behavior(mapEvents);

function setUpClickListener(map) {
	map.addEventListener('tap', function (evt) {
		var coord = map.screenToGeo(evt.currentPointer.viewportX,evt.currentPointer.viewportY);
		putCoordinate(coord.lat,coord.lng,map.getZoom());
  });
}
function setUpClickListener(map) {
	map.addEventListener('tap', function (evt) {
		var coord = map.screenToGeo(evt.currentPointer.viewportX,evt.currentPointer.viewportY);
		putCoordinate(coord.lat,coord.lng,map.getZoom());
  });
}
setUpClickListener(map)

var marker = new H.map.Circle({lat:0, lng:0},100,{style:{strokeColor:'white',lineWidth:1,fillColor:'rgba(0, 0, 0, 0.7)'}});
map.addObject(marker);

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	