<?php
require '../js/lib/Stripe.php';
 
if ($_POST) {
  Stripe::setApiKey('sk_test_2SmmKxgoi1IwbwQI7BAewT9K');
  $error = '';
  $success = '';

  try {
	
    if (!isset($_POST['stripeToken']))
      throw new Exception("The Stripe Token was not generated correctly");
      
    //echo $_POST['stripeToken'];
	   $token  = $_POST['stripeToken'];
	    $appPrice  = $_POST['appPrice'];
		
		$paymentvalue = (float)$appPrice * 100;
		//$appId = $_POST['appId'];

  $customer = Stripe_Customer::create(array(
      'email' => "test@test.com",
      'card'  => $token
  ));

  $charge = Stripe_Charge::create(array(
      'customer' => $customer->id,
      'amount'   => $paymentvalue,
      'currency' => 'usd'
  ));
      
      echo json_encode($charge);
  /*
  if($charge->status=="succeeded")
  {
		$curl = curl_init();

		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => 'js/install.php?appCode='.$appId
		));

		$resp = curl_exec($curl);
		curl_close($curl);
		
		$host = $_SERVER['HTTP_HOST'];
		header("Location: http://". $host ."/devstudio/workspace/App_Marketplace/#/market_apps");
  
  }
  */

  }
  catch (Exception $e) {
	$error = '<div class="alert alert-danger">
			  <strong>Error!</strong> '.$e->getMessage().'
			  </div>';
  }
  
  	//$host = $_SERVER['HTTP_HOST'];
	//header("Location: http://". $host ."/devstudio/workspace/App_Marketplace/#/market_apps");
  /*
  echo '<h1>Welcome to Duosoftware Payment Gateway!</h1>';
  echo '<h2>Your Payment is processed!</h2>';
  echo '<h3>Successfully charged $50!</h3>';
  */
  
  
  
  
  
}
?>