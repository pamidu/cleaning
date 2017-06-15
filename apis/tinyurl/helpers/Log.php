<?php
include_once 'config.php';
require_once (LIB . 'Analog.php');
class Log {
	public static function write($type, $message) {
		// Messege types
		// URGENT = 0; // It's an emergency
		// ALERT = 1; // Immediate action required
		// CRITICAL = 2; // Critical conditions
		// ERROR = 3; // An error occurred
		// WARNING = 4; // Something unexpected happening
		// NOTICE = 5; // Something worth noting
		// INFO = 6; // Information, not an error
		// DEBUG = 7; // Debugging messages
		$log_file_name = SERVICENAME. ' Log.txt';
		Analog::handler ( Analog\Handler\File::init ( $log_file_name ) );
		
		switch (strtoupper ( $type )) {
			case ("URGENT") :
				Analog::log ( $message, Analog::URGENT );
				break;
			case ("ALERT") :
				Analog::log ( $message, Analog::ALERT );
				break;
			case ("CRITICAL") :
				Analog::log ( $message, Analog::CRITICAL );
				break;
			case ("ERROR") :
				Analog::log ( $message, Analog::ERROR );
				break;
			case ("WARNING") :
				Analog::log ( $message, Analog::WARNING );
				break;
			case ("NOTICE") :
				Analog::log ( $message, Analog::NOTICE );
				break;
			case ("INFO") :
				Analog::log ( $message, Analog::INFO );
				break;
			case ("DEBUG") :
				Analog::log ( $message, Analog::DEBUG );
				break;
			
			default :
				Analog::log ( $message, Analog::DEBUG );
				break;
		}
	}
}

?>
	