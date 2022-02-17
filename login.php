<?php
    session_start();
    if(isset($_SESSION["admin"])){   
        if($_SESSION["admin"] == "true"){
            header("Location: admin.php");
        }else{
            header("Location: login.php");
        }
    }
?>
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
		<title>Admin Login</title>
		
		
		<script src="https://js.api.here.com/v3/3.0/mapsjs-core.js" type="text/javascript" charset="utf-8">
		</script>
		<script src="https://js.api.here.com/v3/3.0/mapsjs-service.js" type="text/javascript" charset="utf-8">
		</script>
		<script src="https://js.api.here.com/v3/3.0/mapsjs-mapevents.js" type="text/javascript" charset="utf-8"> 
		</script>
	</head>
  
	<body>
		<div class="modal" id="myModal">
			<div class="modal-dialog">
				<div class="modal-content">

				<!-- Modal Header -->
				<div class="modal-header">
					<h4 class="modal-title" style="color:#eaffff"></h4>
					<a type="button" class="close" href="./">&times;</a>
				</div>

				<!-- Modal body -->
				<div class="modal-body">
    				    <div class="form-group">
                            <input type="text" class="form-control" id="username" placeholder="Username">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="password" placeholder="Password">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-primary btn-block" onclick="validate()">Login</button>
                        </div>
				</div>
				</div>
			</div>
		</div>
		<script>
			function id(i){
				return document.getElementById(i)
			}
		    id("myModal").style = "display:block";
		    document.getElementsByClassName("modal-title")[0].innerHTML = "Admin Login"
			function validate(){
				username = id("username").value
				password = id("password").value
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						alertCall(this.responseText)
					}
				}
				xhttp.open("POST", "./php/updateFlood.php", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send("action=validate&username="+username+"&password="+password);
			}

			function alertCall(stat){
				if(stat != ""){
					alert(stat);
				}else{
					location.href = "./login.php"
				}
			}
		</script>
		
	</body>
</html>