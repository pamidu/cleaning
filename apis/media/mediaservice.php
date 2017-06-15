<?php
require_once ($_SERVER['DOCUMENT_ROOT'] . "/include/config.php");
require_once ($_SERVER['DOCUMENT_ROOT'] ."/include/duoapi/objectstoreproxy.php");
class User{
    public $username;
    public $email;
    public $firstname;
    public $lastname;
    public $userid;
}
class usermanual{
    public $appkey;
    public $namespace;
    public $class;
    public $id;
    public $name;
    public $description;
}
class MediaService {
    private function test(){
        echo "Hello from media service V 1.0.2 . usermanual upload endpoints added ";
    }
    private function uploadMedia($namespace,$class,$id){
        $this->forwardIfNecessary($namespace);
        $folderLocation = MEDIA_PATH . "/" . $namespace . "/media/" . $class;
        if (!file_exists($folderLocation)) {
            mkdir($folderLocation, 0777, true);
        }
        if (json_encode(file_put_contents($folderLocation."/$id", Flight::request()->getBody())))
            echo '{"success":true, "message":"Media successfully uploaded!!!"}';
        else{
            echo '{"success":false, "message":"Error uploading media"}';
            http_response_code(500);
        }
        header('Content-Type: application/json');
    }
    private function getMedia($namespace,$class,$id){
        $this->forwardIfNecessary($namespace);
        $mediaFile = MEDIA_PATH. "/" . $namespace . "/media/" . $class."/$id";
        if (file_exists($mediaFile)) {
            header('Content-Type: '. mime_content_type($mediaFile));
            echo file_get_contents($mediaFile);
        }
        else{
            header('Content-Type: application/json');
            http_response_code(404);
            echo '{"success":false, "message":"404 resource not found"}';
        }
    }
    private function getThumbnail($size, $namespace,$class,$id){
        $this->forwardIfNecessary($namespace);
        $originalfile=MEDIA_PATH. "/" . $namespace . "/media/" . $class;
        $storeFolder = THUMB_PATH. "/" . $namespace . "/media/" . $class;
        if (file_exists($originalfile."/".$id.".jpg")==false) {
            echo json_encode("File Not Found");
        }
        else {
            $file=glob($originalfile."/".$id."*");
            $filename = $file[0];
            $image = imagecreatefromjpeg($file[0]);
            echo json_encode($image);
            header('Content-Type: image/jpg');
            $newwidth =$size;
            $newheight = $size;
            $new_image = imagecreatetruecolor($newwidth, $newheight);
            imagecopyresampled($new_image, $image, 0, 0,0, 0, $newwidth, $newheight, $newwidth, $newheight);
            $image = $new_image;
            imagejpeg($new_image, $storeFolder."/"."$id.jpg",95);
            header('Content-Type: image/jpg');
            $imagedata=file_get_contents($storeFolder."/"."$id.jpg");
            echo $imagedata;
        }
    }
    private function getUserSpace(){
        $authObj = json_decode($_COOKIE["authData"]);
        $username = $authObj->Username;
        return str_replace(".", "", str_replace("@", "", $username)). "." . MAIN_DOMAIN;
    }
    private function detectRequestBody() {
        $rawInput = fopen('php://input', 'r');
        $tempStream = fopen('php://temp', 'r+');
        stream_copy_to_stream($rawInput, $tempStream);
        rewind($tempStream);
        return stream_get_contents($tempStream);
    }
    private function forwardIfNecessary($tenantId){
        if (defined("STORAGE_PROFILE"))
        if (strcmp(STORAGE_PROFILE, "PROXY") != 0)
            return;
        if (strcmp($_SERVER["HTTP_HOST"], $tenantId) === 0){ //same domain
            if (defined("SVC_MEDIA_URL")){ //forward to media server
                $this->forwardRequest(SVC_MEDIA_URL, $tenantId);
            } else { //save in the same server
                return;
            }
        }
        else $this->forwardRequest(SVC_MEDIA_URL, $tenantId);//$this->forwardRequest($tenantId, $tenantId); //forward cross domain requests
    }
    private function forwardRequest($forwardHost, $tenantId){
        $ch=curl_init();
        $cookies = array();
        foreach ($_COOKIE as $key => $value)
            if ($key != 'Array')
                $cookies[] = $key . '=' . $value;
        curl_setopt($ch, CURLOPT_COOKIE, implode(';', $cookies));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: $tenantId", "Content-Type: application/json"));
        curl_setopt($ch, CURLOPT_URL, "http://$forwardHost". $_SERVER["REQUEST_URI"]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        if($_SERVER["REQUEST_METHOD"]!="GET"){
            $postData = $this->detectRequestBody();
            curl_setopt($ch, CURLOPT_POST, count($postData));
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        }
        $data = curl_exec($ch);
        $content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        header("Content-type:$content_type");
        echo $data;
        exit();
    }
    function resize($newWidth, $newHeight, $namespace,$class,$id )
    {
        $status =0;
        //$this->forwardIfNecessary($namespace);
        $folderLocation = MEDIA_PATH . $namespace . "/media/" . $class;
        $originalFile=$_FILES["fileToUpload"]["tmp_name"];
        $targetFile=$folderLocation . basename($_FILES["fileToUpload"]["name"]);
        if (!file_exists($folderLocation)) {
            mkdir($folderLocation, 0777, true);
            $status=1;
        }
        $info = getimagesize($originalFile);
        $mime = $info['mime'];
        switch ($mime) {
            case 'image/jpeg':
                $image_create_func = 'imagecreatefromjpeg';
                $image_save_func = 'imagejpeg';
                $new_image_ext = 'jpg';
                break;
            case 'image/png':
                $image_create_func = 'imagecreatefrompng';
                $image_save_func = 'imagepng';
                $new_image_ext = 'png';
                break;
            case 'image/gif':
                $image_create_func = 'imagecreatefromgif';
                $image_save_func = 'imagegif';
                $new_image_ext = 'gif';
                break;
            default:
                throw new Exception('Unknown image type.');
        }
        $img = $image_create_func($originalFile);
        list($width, $height) = getimagesize($originalFile);
        if($newHeight==0){
            $newHeight = ($height / $width) * $newWidth;
        }
        if($newWidth==0){
            $newWidth = ($width / $height) * $newHeight;
        }
        $tmp = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($tmp, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        if (file_exists($targetFile)) {
            unlink($targetFile);
        }
        if($image_save_func($tmp, "$folderLocation/$id")){
            echo '{"success":true, "message":"image successfully resized and uploaded!!!"}';
        }
        else{
            echo '{"success":false, "message":"Error uploading media"}';
            http_response_code(500);
        }
    }
    function convert($namespace,$class,$id)   {
        $folderLocation = MEDIA_PATH . $namespace . "/media/" . $class;
        shell_exec('ffmpeg -i ' . $_FILES["fileToUpload"]["tmp_name"]. ' '.$folderLocation.'/' . $id);
        echo '{"success":true, "Media successfully converted and uploaded!!!"}';
    }
    
    function usernameToTenantID($username) {
        global $mainDomain;
        return str_replace(".", "", str_replace("@", "", $username)). "." . $mainDomain;
    }
    private function uploadUserManual($appkey,$namespace,$foldername,$documentname){
        $client = ObjectStoreClient::WithNamespace("usermanual.duoworld.com","usermanual","123");
        $data=$client->get()->byKey($namespace);
        if(empty($data)){
            $saveRespond=$this->uploadMedia($namespace,$foldername,$documentname);
            $um=new usermanual();
            $um->id=array();
            array_push($um->id, $documentname);
            $um->appkey=$appkey;
            $um->namespace=$namespace;
            $um->class=$foldername;
            $respond=$client->store()->byKeyField("namespace")->andStore($um);
        }else{
            if(in_array($documentname,$data->id)){
                echo '{"success":false, "message":"document name exist"}';
                exit();
            }
            $saveRespond=$this->uploadMedia($namespace,$foldername,$documentname);
            array_push($data->id, $documentname);
            $respond=$client->store()->byKeyField("namespace")->andStore($data);
        }       
            if(isset($respond)&&$respond->IsSuccess){
                echo '{"success":true, "message":"usermanual succesfully uploaded!!!"}';
            }else{
                echo '{"success":false, "message":"usermanual upload failed !!!"}';
            }
    }
    private function usermanualavailable($appkey,$id){
        $client = ObjectStoreClient::WithNamespace("usermanual.duoworld.com","usermanual","123");
        $data=$client->get()->byKey($appKey);
        if(isset($data)){
            if(in_array($id,$data)){
                return true;
                exit();
            }
        }
        return false;
    }
    private function listavailableusermanuak($appkey){
        $client = ObjectStoreClient::WithNamespace("usermanual.duoworld.com","usermanual","123");
        $data=$client->get()->andSearch("appkey:" . $appkey);
        if(isset($data)){
            $doclist=$data[0];
            echo json_encode($doclist["id"]);
            exit();
        }
        return false;

    }
    private function getusermanual($appkey,$id){
        $client = ObjectStoreClient::WithNamespace("usermanual.duoworld.com","usermanual","123");
        $data=$client->get()->andSearch("appkey:" .$appkey);
        if(isset($data)){
            $ids=$data[0];
            if(in_array($id,$ids["id"])){
                $this->getMedia($ids["namespace"],$ids["class"],$id);
                exit();
            }
        }
        echo '{"success":false, "document not found  !!!"}';
    }
    function __construct(){
        Flight::route("GET /",function(){$this->test();});
        Flight::route("POST /tenant/@class/@id", function($class,$id){$this->uploadMedia($_SERVER["HTTP_HOST"],$class,$id);});
        Flight::route("GET /tenant/@class/@id", function($class,$id){$this->getMedia($_SERVER["HTTP_HOST"],$class,$id);});
        Flight::route("POST /tenant/resize/@width/@height/@class/@id", function($width,$height,$class,$id){$this->resize($width,$height,$_SERVER["HTTP_HOST"],$class,$id);});
        Flight::route("POST /tenant/convertAudio/@class/@id", function($class,$id){$this->convert($_SERVER["HTTP_HOST"],$class,$id);});
        Flight::route("GET /profilepic/get/@username", function($username) {$this->getMedia($this->usernameToTenantID($username), "profilepictures", "profile.jpg");});
        Flight::route("POST /user/@class/@id", function($class,$id){$this->uploadMedia($this->getUserSpace(),$class,$id);});
        Flight::route("GET /user/@class/@id", function($class,$id){$this->getMedia($this->getUserSpace(),$class,$id);});
        Flight::route("GET /tenant/thumbnails/@size/@class/@id", function($size,$namespace,$class,$id){$this->getThumbnail($size,$_SERVER["HTTP_HOST"],$class,$id);});
        Flight::route("GET /user/thumbnails/@size/@class/@id", function($size,$namespace,$class,$id){$this->getThumbnail($size,$this->getUserSpace(),$class,$id);});    
        Flight::route("POST /usermanual/@appkey/@foldername/@documentname", function($appkey,$foldername,$documentname){$this->uploadUserManual($appkey,$this->getUserSpace(),$foldername,$documentname);});
        Flight::route("GET /listavailableusermanual/@appkey",function($appkey){$this->listavailableusermanuak($appkey);});
        Flight::route("GET /getusermanual/@appKey/@id", function($appkey,$id){$this->getusermanual($appkey,$id);});
        
        
        header('Content-Type: application/json');
	    header('Access-Control-Allow-Headers: Content-Type');
	    header('Access-Control-Allow-Origin: *');
	    header('Access-Control-Allow-Methods: GET, POST');
        
        
    }
}
?>
