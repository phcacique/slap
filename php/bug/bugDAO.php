<?php
    ob_start();
    require_once __DIR__ . "/../user/user.php";
    require_once "bug.php";
    ob_end_clean();

    function insertBug($subject, $detailedText, $id_user){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("INSERT INTO bug (subject, detailedtext, id_user, bugdate) VALUES (?,?,?, now())");
        $stmt->bind_param("ssi", $subject, $detailedText, $id_user);

        $stmt->execute();

        $stmt->close();    
    }

    function countAllBugs(){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT COUNT(*) AS total FROM bug";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row["total"];
            }
        }
        return $response;
    }

    function readBugById($id_frame){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, id_bug, subject, detailedtext, bugdate FROM bug INNER JOIN appuser ON id_appuser=id_user WHERE id_bug = $id_bug ORDER BY bugdate DESC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $bug = new Bug($row["id_bug"], $row["subject"], $row["detailedText"], $row["bugdate"], $user);
                array_push($response,$bug);
            }
        } 
        return $response;
    }

    function readBugByUser($user){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $id_user = $user->getAttribute('id_appuser');
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, id_bug, subject, detailedtext, bugdate FROM bug INNER JOIN appuser ON id_appuser=id_user WHERE user = $id_user ORDER BY bugdate DESC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $bug = new Bug($row["id_bug"], $row["subject"], $row["detailedText"], $row["bugdate"], $user);
                array_push($response,$bug);
            }
        } 
        return $response;
    }

    function readAllBugs(){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, id_bug, subject, detailedtext, bugdate FROM bug INNER JOIN appuser ON id_appuser=id_user ORDER BY bugdate DESC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $bug = new Bug($row["id_bug"], $row["subject"], $row["detailedtext"], $row["bugdate"], $user);
                array_push($response,$bug);
            }
        } 
        return $response;
    }

    function deleteBug($id_bug){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM bug WHERE id_bug = ?");
$stmt->bind_param("i", $id_bug);

        $stmt->execute();
        
        $stmt->close();
    }

    function updateBug($bug){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("UPDATE bug SET subject=?, detailedtext=?, bugdate=?, id_user=? WHERE id_bug=?");
        $stmt->bind_param("sssii", $bug->getAttribute('subject'), $bug->getAttribute('detailedText'), $bug->getAttribute('bugdate'), $bug->getAttribute('user')->getAttribute('id_appuser'), $bug->getAttribute('id_bug') );

        $stmt->execute();
        
        $stmt->close();
    }
    
?>