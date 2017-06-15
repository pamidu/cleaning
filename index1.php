<?php
if(isset($_POST['nl-submit'])) {	 
	function died($error) {
		echo $error."<br /><br />";
		echo "Please go back and try again.<br /><br />";
		die();
	}
	
	// validation expected data exists
	if(!isset($_POST['nl-submit'])) {
		died('We are sorry, but there appears to be a problem with the form you submitted.');       
	}
	
	$email_to 			= "info@duoworld.com";
	$email_subject 	= "Newsletter subscription";
	$email_from 		= $_POST['nl-email'];
	 
	$error_message = "";
	$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
  if(!preg_match($email_exp,$email_from)) {
    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
  }

	$email_message = "A user with below email address has signed up for the Newsletter .<br><br>\n\n";
	$email_message .= "Email: ". $email_from."\n";
     
	// create email headers
	$headers  = "From: DuoWorld <no-reply@duoworld.com>"."\r\n";
	$headers .= 'Reply-To: '.$email_from."\r\n";
	$headers .= "Bcc: shamil@benworldwide.com"."\r\n";
	$headers .= 'X-Mailer: PHP/' . phpversion();
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	mail($email_to, $email_subject, $email_message, $headers);  

}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Duo World</title>
		<meta name="description" content="">
		<meta name="keywords" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="css/styles_landing.css" type="text/css" />
	</head>
	
	<body>
		<section class="content clearfix">
			<div class="col-6 right">
				<div class="block">
					<div id="logo-wrapper">
						<img src="images/duoworld-logo.png" alt="logo" width="" height="" id="logo" />
					</div>
					<h1>Putting apps in the hands of every Business</h1>
					<ul class="app-details">
						<li>World of apps pre built for you</li>
						<li>All apps are based on a collaborative platform</li>
						<li>Get your developer to customize your app</li>
						<li>Building apps that automate complex business processes</li>
					</ul>
					<div id="btn-wrapper">
						<!-- <a class="btn ghost" href="login.php">Login</a> -->
						<!-- <a class="btn login" href="signup/">Signup</a> -->
						<a class="btn ghost" href="/platformentry/#/signin">Login</a>
						<a class="btn login" href="/platformentry/#/signup">Signup</a>
					</div>
				</div>
			</div>
			<div class="col-6 right">
				<div class="block">
					<img src="images/mac-image.png" alt="Duoworld" width="" height="" id="mac-image" />
				</div>
			</div>
		</section>
		
		<footer>
			<div class="row-top">
				<div class="col-12 clearfix">
					<div class="nl-wrapper">
						<h3>Be the first to know</h3>
						<form method="post" action="" name="newsletter">
							<input type="email" name="nl-email" class="nl-fld-email" placeholder="Your email address" />
							<input type="submit" name="nl-submit" value="Sign up" class="btn nl-fld-submit" />
						</form>
					</div>
					<div class="contact-info">
						<h3>Contact information</h3>
						170 S Green Valley Parkway, Suite 300,<br>
						Henderson, Nevada 89012<br>
						Phone: +1 870-505-6540<br>
						Email: <a href="mailto:info@duoworld.com">info@duoworld.com</a>
					</div>
					<div class="social-icons">
						<a href="#" target="_blank"><i class="fa fa-facebook"></i></a>
						<a href="#" target="_blank"><i class="fa fa-linkedin"></i></a>
						<a href="#" target="_blank"><i class="fa fa-twitter"></i></a>
						<a href="#" target="_blank"><i class="fa fa-google-plus"></i></a>
						<a href="#" target="_blank"><i class="fa fa-instagram"></i></i></a>
					</div>
				</div>
			</div>
			<div class="row-bottom">
				&copy; 2015 Duo World. All Rights Reserved. | 
				<a href="//benworldwide.com" target="_blank">Benworldwide</a> | 
				<a href="//benworldwide.com/contact/site-survey/" target="_blank">Feedback</a>
			</div>
		</footer>
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-41800482-37', 'auto');
			ga('send', 'pageview');

		</script>
	</body>
</html>
