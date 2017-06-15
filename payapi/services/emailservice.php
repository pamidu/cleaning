<?php

class EmailStruct {
	public $type;
	public $to;
	public $subject;
	public $from;
	public $Namespace;
	public $TemplateID;
	public $DefaultParams;
	public $CustomParams;

	function __construct() {
		$this->DefaultParams = array();
		$this->CustomParams = array();
	}
}

class EmailClient {
	private $_template;
	private $_errors;
	private $_recipients;
	private $_sender;
	public $Subject;
	public $Body;
	public $Footer;

	public function SetSender($sender, $name = "") {
		if(!$sender){
			$this->_errors[] = "Sender's email address should be provided."; return $this;
		}

		if (!filter_var($sender, FILTER_VALIDATE_EMAIL)) {
			$this->_errors[] = "Invalid sender's email address($sender) format."; return $this;
		}

		$this->_sender = $sender;
		return $this;
	}

	public function SetSenderAs($sender, $customname = "") {
		switch (strtolower($sender)) {
			case 'epayments':
				$this->_sender = ((!$customname) ? "Epayments.lk" : $customname) . " <noreply@epayments.lk>;"; 
				break;
			case 'duoworld':
				$this->_sender = ((!$customname) ? "duoworld.com" : $customname) . " <mail-noreply@duoworld.com>;"; 
				break;
			default:
				$this->_errors[] = "Invalid sender";
				break;
		}
		return $this;
	}

	public function SetRecipient($recipient, $name = "") {
		if(!$recipient){
			$this->_errors[] = "Recipient's email address should be provided."; return $this;
		}

		if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
			$this->_errors[] = "Invalid recipient's email address($recipient) format."; return $this;
		}	

		$this->_recipients[$recipient] = $name; 
		return $this;
	}

	public function SetTemplate($template) {
		if(!$template) 
			$this->_errors[] = "Valid email template name should be provided.";
		$this->_template = $template;
	}

	public function Send() {
		if($this->_errors) 
			return false;

		if(!$this->_sender) {
			$this->_errors[] = "Sender's email address required."; return false;
		}

		$dataStr = json_encode($this->format()); 
        $ch = curl_init(SVC_CEB_URL. "/command/notification");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POST, 1 );
        curl_setopt($ch, CURLOPT_POSTFIELDS, $dataStr);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $headers = array(
        	'Content-Type: application/json',
        	'Content-Length: ' . strlen($dataStr)
        );
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 
        $result = curl_exec($ch);

        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        // var_dump($httpcode);
        if($httpcode === 200) {
        	$decodedResult = json_decode($result);
        	if($decodedResult->result === "ok")
        		return true;
        	else {
        		$this->_errors[] = "Error getting while sending email."; return false;
        	}
        }       

        // if($httpcode === "200") {
        // 	$decodedResult = json_decode($result);
        // 	if($decodedResult->success)
        // 		return true;
        // 	else {
        // 		$this->_errors[] = $decodedResult->message; return false;
        // 	}
        // }
        //{"success":true,"message":"Email successfully sent"}
        // var_dump($result);
     	// if($result)
     	// 	return true;
     	// else {
     	// 	$this->_errors[] = curl_error($ch); return false;
     	// }
	}

	private function format() {
		$es = new EmailStruct();
		$es->type = "email";
		$es->from = $this->_sender;
		$es->TemplateID = $this->_template;
		$es->Namespace = "com.SLT.space.cargills.com";
		$es->subject = $this->Subject;

		end($this->_recipients);
		$lastkey = key($this->_recipients);
		$cname = "";
		foreach ($this->_recipients as $key => $value) {
			$es->to = $es->to . $key;
			$cname = $cname . $value;
			if($lastkey != $key) {
				$es->to .= ",";
				$cname .= ",";
			}
		}

		$es->DefaultParams["@@CNAME@@"] = $cname;
		$es->DefaultParams["@@TITLE@@"] = "";
		$es->DefaultParams["@@MESSAGE@@"] = $this->Body;
		$es->DefaultParams["@@APPLICATION@@"] = "";
		$es->DefaultParams["@@FOOTER@@"] = $this->Footer;
		$es->DefaultParams["@@LOGO@@"] = "";

		$es->CustomParams["@@CNAME@@"] = $cname;
		$es->CustomParams["@@TITLE@@"] = "";
		$es->CustomParams["@@MESSAGE@@"] = $this->Body;
		$es->CustomParams["@@APPLICATION@@"] = "";
		$es->CustomParams["@@FOOTER@@"] = $this->Footer;
		$es->CustomParams["@@LOGO@@"] = "";

		return $es;
	}

	public function getErrorInfo() {
		return $this->_errors;
	}

	public static function AttachEmailTemplate($template) {
		$mail = new EmailClient();
		$mail->SetTemplate($template);
		return $mail;
	}

	function __construct() {
		$this->_errors = array();
		$this->_recipients = array();
	}
}

$mail = EmailClient::AttachEmailTemplate("T_Email_GENERAL");
$mail->SetRecipient("binara@duosoftware.com", "Binara");
// $mail->SetRecipient("binara@duosoftware.com", "Binara")->SetRecipient("buddhika@duosoftware.com", "Buddhika");
// $mail->SetSender("binara@duosoftware.com", "Binara");
$mail->SetSenderAs("Epayments");

$mail->Subject = "Epayments Email Tesing";
$mail->Body = "This is the email client";
$mail->Footer = "Copyright 2015";
if($mail->Send()) {
	 echo "Your mail sent successfully.";
}else {
	var_dump($mail->getErrorInfo());
}




?>
