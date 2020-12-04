<?php
    ob_start();
    require_once __DIR__ . "/../connection/ConnectionManager.php";
    require_once "user.php";
    ob_end_clean();

    function insertUser($username, $password, $fullname, $email, $usertype, $avatar){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("INSERT INTO appuser (username, password, fullname, email, usertype, avatar) VALUES (?,?,?,?,?,?)");
        $stmt->bind_param("ssssis", $username, $password, $fullname, $email, $usertype, $avatar);

        $stmt->execute();
        
        $stmt->close();
    }

    function insertUserCode($id_user, $id_code){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("INSERT INTO usercode (id_userapp, id_redeem_code) VALUES (?,?)");
        $stmt->bind_param("ii", $id_user, $id_code);

        $stmt->execute();
        $stmt->close();
        
        
        $stmt = $link->prepare("UPDATE redeem_code SET total_users=(total_users-1) WHERE id_redeem_code = ?");
        $stmt->bind_param("i", $id_code);

        $stmt->execute();
        
        $stmt->close();
    }

    function countAllUsers(){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT COUNT(*) AS total FROM appuser where id_appuser != 1";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row["total"];
            }
        }
        return $response;
    }

    function readAllUsers(){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM appuser ORDER BY fullname";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                array_push($response,$user);
            }
        }
        return $response;
    }

    function readUserByUsername($username){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM appuser where username = '$username' ORDER BY fullname";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                array_push($response,$user);
            }
        } 
        return $response;
    }

    function readUserByEmail($email){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM appuser where email = '$email' ORDER BY fullname";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                array_push($response,$user);
            }
        } 
        return $response;
    }

    function verifyUser($username, $email){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM appuser WHERE username = '$username' OR email = '$email'";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                array_push($response,$user);
            }
        } 
        return $response;
    }

    function verifyRedeem($code){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM redeem_code WHERE code = '$code'";  
        $result = $link->query($sql);

        while($row = $result->fetch_assoc()) {
                $response = $row["total_users"];
            } 
        return $response;
    }

    function readRedeem($code){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM redeem_code WHERE code = '$code'";  
        $result = $link->query($sql);

        while($row = $result->fetch_assoc()) {
                $response = $row["id_redeem_code"];
            } 
        return $response;
    }

    function deleteUser($id_user){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM appuser WHERE id_appuser = ?");
$stmt->bind_param("i", $id_user);

        $stmt->execute();
        
        $stmt->close();
    }

    function updateUser($id_appuser, $username, $password, $fullname, $email, $usertype, $avatar){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("UPDATE appuser SET username=?, password=?, fullname=?, email=?, usertype=?, avatar=? WHERE id_appuser=?");
        $stmt->bind_param("ssssisi", $username, $password, $fullname, $email, $usertype, $avatar, $id_appuser);
        
        echo "$username, $password, $fullname, $email, $usertype, $avatar, $id_appuser";

        $stmt->execute();
        
        $stmt->close();
    }

    function login($username, $password){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();

        $sql = "SELECT * FROM appuser WHERE username = '$username' AND password = '$password'";  
        $result = $link->query($sql);

        if ($result && $result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                array_push($response,$user);
            }
        } 
        return $response;
    }
    
?>