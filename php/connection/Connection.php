<?php
class Connection
{
    private $connection;
    
    function __construct()
    {
        $this->connect();
    }
    
    function __destruct()
    {
        $this->close();
    }   
    
    function connect()
    {
        require_once __DIR__ ."/db_config.php";
        $connection = mysqli_connect(SERVER,USER,PASSWORD,DATABASE) or die("Error " . mysqli_error($connection));
        $this->connection = $connection;
        mysqli_set_charset($connection,"utf8");
        return $connection;
    }
    
    function close()
    {
        mysqli_close($this->connection);
    }
    
    public function getConnection()
    {
        return $this->connection;   
    }
}
?>