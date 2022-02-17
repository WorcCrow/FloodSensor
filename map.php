<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
		
		<link rel="stylesheet" href="style/style.css">
		<link rel="shortcut icon" type="image/png" href="./floodsense.png"/>
		<title>Flood View</title>
		
		<script src="https://js.api.here.com/v3/3.0/mapsjs-core.js" type="text/javascript" charset="utf-8"></script>
		<script src="https://js.api.here.com/v3/3.0/mapsjs-service.js" type="text/javascript" charset="utf-8"></script>
		<script src="https://js.api.here.com/v3/3.0/mapsjs-mapevents.js" type="text/javascript" charset="utf-8"></script>
	</head>
  
	<body onload="loadSensorMap()">
		<nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
			<a class="navbar-brand" href="#">Flood Spot</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="collapsibleNavbar">
				<ul class="navbar-nav">
					<li class="nav-item">
						<a class="nav-link" href="./map.php">UserView</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="./admin.php">Admin</a>
					</li>			
				</ul>
			</div>  
		</nav>
		
		<div id="mapContainer"></div>
		
		<button type="button" class="btn" data-toggle="modal" data-target="#myModal" title="Search" onclick="searchModal()">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
		</button>
		<button type="button" class="btn" onclick="getLocation()" title="Jump to Location">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
		</button>
		<button type="button" class="btn" data-toggle="modal" data-target="#myModal" title="Active Sensor List" onclick="sensorModal()">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
		</button>

		<!-- The Modal -->
		<div class="modal" id="myModal">
			<div class="modal-dialog">
				<div class="modal-content">

				<!-- Modal Header -->
				<div class="modal-header">
					<h4 class="modal-title" style="color:#eaffff"></h4>
					<button type="button" class="close" data-dismiss="modal">&times;</button>
				</div>

				<!-- Modal body -->
				<div class="modal-body">
				</div>

				<!-- Modal footer -->
				<div class="modal-footer">
					<button type="button" id="modalClose" class="btn btn-danger" data-dismiss="modal">Close</button>
				</div>

				</div>
			</div>
		</div>
		<script src="./js/map.js"></script>
	</body>
</html>



























