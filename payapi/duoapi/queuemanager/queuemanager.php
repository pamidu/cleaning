<?php

    class QueueManager {

        private $queue;
        private $settings;

        public function Queue($name, $parameters, $extraData = null) {
            return $this->queue->Enqueue($name, $parameters, $extraData);
        }

        private function getSettings() {
            $settings = new stdClass();

            if (defined("SVC_QUEUE_TYPE")) $settings->type = SVC_QUEUE_TYPE;
            else $settings->type = "RabbitMQ";

            return $settings;
        }

        private function getQueue() {
            $queue;

            switch ($this->settings->type){
                case "RabbitMQ":
                    if (defined("SVC_QUEUE_HOST")) $this->settings->host = SVC_QUEUE_HOST;
                    else $this->settings->host = "localhost";

                    if (defined("SVC_QUEUE_USERNAME")) $this->settings->username = SVC_QUEUE_USERNAME;
                    else $this->settings->username = "guest";

                    if (defined("SVC_QUEUE_PASSWORD")) $this->settings->password = SVC_QUEUE_PASSWORD;
                    else $this->settings->password = "guest";

                    require_once(__DIR__ . "/plugins/rabbitmq.php");
                    $queue = new RabbitMQueue($this->settings);
                    break;
                default:
                    require_once(__DIR__ . "./plugins/rabbitmq.php");
                    $queue = new RabbitMQueue($this->settings);
                    break; 
            }

            return $queue;
        }

        function __construct() {
            $this->settings = $this->getSettings();
            $this->queue = $this->getQueue();    
        }
    }

?>
