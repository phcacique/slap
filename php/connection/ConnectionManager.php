<?php
ob_start();
require_once "Connection.php";
ob_end_clean();
    
class ConnectionManager
{
    static $connection = null;
    public static function getInstance()
    {
        if(ConnectionManager::$connection == null)
            ConnectionManager::$connection = new Connection();
        return ConnectionManager::$connection;
    }
    
    private function __construct()
    {
        
    }
    
    private function __clone()
    {
        
    }
}

?>