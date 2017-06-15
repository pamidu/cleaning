<?php
class CommonTools {

public static function getCurrentDate()
	{
		return date ( "Y-m-d H:i:s" ); 
		//new Date(date.getYear(),date.getMonth(),date.getUTCDate());
	}
public static function getFirstDateofCurrentMonth()
{
	return date("Y-1-d H:i:s");
	//new Date(date.getYear(),date.getMonth(),date.getUTCDate());
}

}

?>
	