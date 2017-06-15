<?php

	require_once ("./config.php");

	class User{
		
		public $username;
		public $email;
		public $firstname;
		public $lastname;
		public $userid;
	}
	
	class MediaService {

		
		private function test(){
			echo "Hello from media service";
		}

		private function uploadMedia($namespace,$class,$id){

		 	$filepath = STORAGE_PATH . "/" . $namespace . "/" . $class;
			if (file_exists($filepath)==false) {
				echo json_encode(STORAGE_PATH);
				mkdir(STORAGE_PATH. "/" . $namespace);
				mkdir(STORAGE_PATH. "/" . $namespace. "/" . $class);
			}
		
			
			 echo json_encode(file_put_contents($filepath."/"."$id.jpg", Flight::request()->getBody()));

			
			
		}
	
		private function getMedia($namespace,$class,$id){
			$storeFolder = STORAGE_PATH. "/" . $namespace . "/" . $class."/";
			if (file_exists($storeFolder)) {
				header('Content-Type: image/jpg');
				$imagedata=file_get_contents($storeFolder . $id . ".jpg");
				echo $imagedata;
				
			}
			else{
				echo json_encode("Folder not found");
			}

		}

		private function getThumbnail($size, $namespace,$class,$id){
			$originalfile=STORAGE_PATH. "/" . $namespace . "/" . $class;
			$storeFolder = THUMB_PATH. "/" . $namespace . "/" . $class;
			if (file_exists($originalfile."/".$id.".jpg")==false) {
				echo json_encode("File Not Found");
			}
			else{

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

		function __construct(){
			Flight::route("POST /media/@namespace/@class/@id", function($namespace,$class,$id){$this->uploadMedia($namespace,$class,$id);});
			Flight::route("GET /media/@namespace/@class/@id", function($namespace,$class,$id){$this->getMedia($namespace,$class,$id);});
			Flight::route("GET /media/test",function(){$this->test();});
			
			Flight::route("GET /thumbnails/@size/@namespace/@class/@id", function($size,$namespace,$class,$id){$this->getThumbnail($size,$namespace,$class,$id);});

			
       
		}
	}

?>