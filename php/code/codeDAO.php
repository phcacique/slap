<?php
    ob_start();
    require_once __DIR__ . "/../user/user.php";
    require_once "code.php";
    ob_end_clean();

    function insertCode($code, $total_users){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("INSERT INTO redeem_code (code, total_users) VALUES (?,?)");
        $stmt->bind_param("si", $code, $total_users);

        $stmt->execute();

        $stmt->close();    
    }

    function countAllCodes(){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT COUNT(*) AS total FROM redeem_code";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row["total"];
            }
        }
        return $response;
    }

    function countFreeCodes(){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT total_users FROM redeem_code";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response += $row["total_users"];
            }
        }
        return $response;
    }

    function readCodeById($id_redeem_code){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM redeem_code WHERE id_redeem_code = $id_redeem_code ORDER BY id_redeem_code ASC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $code = new Code($row['id_redeem_code'], $row['code'], $row['total_users']);
                array_push($response,$code);
            }
        } 
        return $response;
    }

    function readCodeByCode($code){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM redeem_code WHERE code = $code ORDER BY id_redeem_code ASC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $code = new Code($row['id_redeem_code'], $row['code'], $row['total_users']);
                array_push($response,$code);
            }
        } 
        return $response;
    }
                                                              
    function readAllCodes(){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM redeem_code ORDER BY id_redeem_code ASC";  
        $result = $link->query($sql);

        if ($result && $result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $code = new Code($row['id_redeem_code'], $row['code'], $row['total_users']);
                array_push($response,$code);
            }
        } 
        return $response;
    }

    function deleteCode($id_redeem_code){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM redeem_code WHERE id_redeem_code = ?");
$stmt->bind_param("i", $id_redeem_code);

        $stmt->execute();
        
        $stmt->close();
    }

    function updateCode($code){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("UPDATE redeem_code SET code=?, total_users=? WHERE id_redeem_code=?");
        $stmt->bind_param("sii", $code->getAttribute('code'), $code->getAttribute('total_users'), $code->getAttribute('id_redeem_code') );

        $stmt->execute();
        
        $stmt->close();
    }
    
?>