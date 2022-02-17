<?php
	$servername = "localhost";
	$username = "root";
	$password = "";
	$database = "floodsense";

	try {
			$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
			// set the PDO error mode to exception
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			//echo "Connected to database successfully"; 
		}
	catch(PDOException $e)
		{
			echo "Connection failed: " . $e->getMessage();
		}
?>