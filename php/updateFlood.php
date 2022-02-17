<?php
    session_start();
    
	require("DBConnect.php");
	
	date_default_timezone_set('Asia/Manila');
	$ft52sdfasd54g = time();
	$sysTime = date("h:i:s A",$ft52sdfasd54g);
	$sysDay = date("d",$ft52sdfasd54g);
	$sysDayS = date("l",$ft52sdfasd54g);
	$sysMonth = date("F",$ft52sdfasd54g);
	$sysYear = date("Y",$ft52sdfasd54g);
	$sysDate = $sysMonth . " " . $sysDay . ", " . $sysYear; 
	
	function addUpdateSensor(){
		GLOBAL $conn;
		$name = $_POST['name'];
		$sid = $_POST['sid'];
		$latitude = $_POST['latitude'];
		$longitude = $_POST['longitude'];
		$zoomlvl = $_POST['zoomlvl'];
		$radius = $_POST['radius'];
		$result = $conn->query("SELECT COUNT(*) FROM sensor WHERE sid = '$sid'");
		foreach($result as $res){
			$count = $res[0];
		}
		if($count != 1){
		    $conn->query("INSERT INTO sensor(name,sid,latitude,longitude,zoomlvl,radius,state) VALUES ('$name','$sid','$latitude','$longitude','$zoomlvl','$radius','0')");	
		}else{
			$conn->query("UPDATE sensor SET name='$name', latitude='$latitude', longitude='$longitude', zoomlvl='$zoomlvl', radius='$radius'  WHERE sid = '$sid'");
		}
	}
	
	function removeSensor(){
		GLOBAL $conn;
		$id = $_POST['id'];
		if(isset($_SESSION["admin"])){   
			if($_SESSION["admin"] != "true"){
			   header("Location: login.php");
			}else{
				$conn->query("DELETE FROM sensor WHERE id='$id'");	
			}
		}
	}
	
	function getSensors(){
		GLOBAL $conn;
		$myLat = $_POST['myLat'];
		$myLng = $_POST['myLng'];
		$result = $conn->query("SELECT * FROM sensor");
		$arr = array();
		
		foreach($result as $res){
			$obj = new stdClass();
			$obj->id = $res['id'];
			$obj->sid = $res['sid'];
			$obj->name = $res['name'];
			$obj->latitude = $res['latitude'];
			$obj->longitude = $res['longitude'];
			$obj->zoomlvl = $res['zoomlvl'];
			$obj->radius = $res['radius'];
			$obj->state = $res['state'];
			$obj->updatedTime = $res['updatedTime'];
			$obj->updatedDate = $res['updatedDate'];
			$obj->distance = abs(strval((floatval($res['latitude'])*(floatval($res['latitude'])*floatval($res['longitude']))) - ($myLat*($myLat*$myLng))));
			//$obj->distance = strval(sqrt(pow(2,(floatval($res['latitude']) - floatval($myLat))) + pow(2,(floatval($res['longitude']) - floatval($myLng)))));
			$objenc = json_encode($obj);
			array_push($arr,$objenc);
		}
		$obj = new stdClass();
		$obj->sensors = $arr;
		$objenc = json_encode($obj);
		echo $objenc;
	}
	
	function sensorUpdate(){
		GLOBAL $conn,$sysTime,$sysDate;
		$sid = $_GET['sid'];
		$state = $_GET['level'];
		$result = $conn->query("SELECT COUNT(*) FROM sensor WHERE sid = '$sid'");
		foreach($result as $res){
			$count = $res[0];
		}
		if($count == 1){
		    $conn->query("UPDATE sensor SET state='$state', updatedTime='$sysTime', updatedDate='$sysDate' WHERE sid = '$sid'");
		}else{
			$conn->query("INSERT INTO sensor(sid,state,updatedTime,updatedDate) VALUES ('$sid','$state','$sysTime','$sysDate')");	
		}
	}
	
	function validate(){
		GLOBAL $conn;
		$username = $_POST['username'];
		$password = $_POST['password'];
		$result = $conn->query("SELECT COUNT(*) FROM account WHERE username = '$username' AND password = '$password'");
		foreach($result as $res){
			$count = $res[0];
		}
		if($count == 1){
		    $_SESSION["admin"] = "true";
		}else{
			echo "Username or Password is Invalid";
		}
	}
	
	function changePass(){
		GLOBAL $conn;
		$currpass = $_POST['currpass'];
		$newpass = $_POST['newpass'];
		$confirmpass = $_POST['confirmpass'];
		$result = $conn->query("SELECT password FROM account WHERE username = 'admin'");
		foreach($result as $res){
			$dbpass = $res[0];
		}
		if($newpass == $confirmpass){
			if($dbpass == $currpass){
				echo "Password Changed Succesfully";
				$conn->query("UPDATE account SET password='$newpass' WHERE username = 'admin'");	
			}else{
				echo "Incorrect current password";
			}
		}else{
			echo "Password does not match";
		}
	}
	
	if(isset($_POST['action'])){
		switch($_POST['action']){
			case "updateSensor":
			addUpdateSensor();
			break;
			
			case "getSensors":
			getSensors();
			break;
			
			case "removeSensor":
			removeSensor();
			break;
			
			case "updateFloodLVL":
			updateLevel();
			break;
			
			case "validate":
			validate();
			break;
			
			case "changePass":
			changePass();
			break;
			
		}
	}else if(isset($_GET['action'])){
		switch($_GET['action']){
			case "sensorUpdate":
			sensorUpdate();
			break;
		}
	}
?>