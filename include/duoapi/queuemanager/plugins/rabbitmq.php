<?php

    require_once __DIR__ . '/vendor/autoload.php';
    use PhpAmqpLib\Connection\AMQPStreamConnection;
    use PhpAmqpLib\Message\AMQPMessage;

    define ("RABBITMQ_EXCHANGE_NAME", "rating_engine");

    class RabbitMQueue {

        private $settings;
        private static $connection; 
        private static $channel;

        public function Enqueue($name, $parameters, $extraData = null){
            $channel = RabbitMQueue::$channel;

            $msg = new AMQPMessage(json_encode($parameters));

            $exchange = $channel->exchange_declare(RABBITMQ_EXCHANGE_NAME, 'fanout', false, false, false);
            $queue = $channel->queue_declare($name, false, false, false, false);
            $channel->queue_bind($name, RABBITMQ_EXCHANGE_NAME,$name);

            $channel->basic_publish($msg, RABBITMQ_EXCHANGE_NAME, $name);
            return true;
        }

        private function createConnection($settings){
            if(!isset(RabbitMQueue::$connection)){
                RabbitMQueue::$connection = new AMQPStreamConnection($settings->host, 5672, $settings->username, $settings->password);    
                RabbitMQueue::$channel = RabbitMQueue::$connection->channel();
            }
        }

        private function closeConnections(){
            RabbitMQueue::$channel->close();
            RabbitMQueue::$connection->close();
        }

        function __construct($settings) {
            $this->settings = $settings;
            $this->createConnection($settings);
        }
    }

?>