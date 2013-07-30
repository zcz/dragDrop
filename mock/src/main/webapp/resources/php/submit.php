<?php 
	require_once 'KLogger.php';
	$log = new KLogger ( "log.txt" , KLogger::DEBUG );
	$log->LogInfo("called, message:" . " fin");
	
	//$x = json_decode($_POST, true);
	$log->LogInfo("POST: " . print_r($_POST, true));
	$log->LogInfo("GET : " . print_r($_GET, true));
	//echo '{ "message": "' . $_POST['message'] . '" }';  	
?>
