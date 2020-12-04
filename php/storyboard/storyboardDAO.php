<?php
    ob_start();
    require_once __DIR__ . "/../connection/ConnectionManager.php";
    require_once __DIR__ . "/../user/user.php";
    require_once __DIR__ . "/../frame/frame.php";
    require_once __DIR__ . "/../frame/frameDAO.php";
    require_once "storyboard.php";
    ob_end_clean();

    function insertStoryboard($title, $description, $avatar, $user){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("INSERT INTO storyboard (title, description, avatar, id_user, lastupdate, fps, frame_format) VALUES (?,?,?,?,now(),24,1)");
        $i = $user->getAttribute('id_appuser');
        $stmt->bind_param("sssi", $title, $description, $avatar, $i);

        $stmt->execute();
        
        $id = $link->insert_id;
        
        $stmt->close();
        
        return $id;
    }

    function readAllStoryboards(){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, id_storyboard, title, description, storyboard.avatar as savatar, lastupdate, fps, frame_format FROM storyboard INNER JOIN appuser ON id_appuser=id_user ORDER BY lastupdate DESC";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $storyboard = new Storyboard($row['id_storyboard'], $row['title'], $row['description'], $row['savatar'], $user,$row['lastupdate'],$row['fps'],$row['frame_format']);
                
                $frames = readFramesByStoryboard($row['id_storyboard']);
                $storyboard->setAttribute('frames',$frames);
                
                array_push($response,$storyboard);
            }
        }
        return $response;
    }

    function countAllStoryboards(){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT COUNT(*) AS total FROM storyboard where id_user!=1";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row["total"];
            }
        }
        return $response;
    }

    function readStoryboardsByUser($user){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, id_storyboard, title, description, storyboard.avatar as savatar, lastupdate, fps, frame_format FROM storyboard INNER JOIN appuser ON id_appuser=id_user WHERE id_user = '".$user->getAttribute('id_appuser')."' ORDER BY lastupdate DESC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $storyboard = new Storyboard($row['id_storyboard'], $row['title'], $row['description'], $row['savatar'], $user,$row['lastupdate'],$row['fps'],$row['frame_format']);
                
                $frames = readFramesByStoryboard($row['id_storyboard']);
                $storyboard->setAttribute('frames',$frames);
                
                array_push($response,$storyboard);
            }
        } 
        return $response;
    }

    function readStoryboardById($id){
        $response = null;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, id_storyboard, title, description, storyboard.avatar as savatar, lastupdate, fps, frame_format FROM storyboard INNER JOIN appuser ON id_appuser=id_user WHERE id_storyboard = $id ORDER BY lastupdate DESC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $storyboard = new Storyboard($row['id_storyboard'], $row['title'], $row['description'], $row['savatar'], $user,$row['lastupdate'],$row['fps'],$row['frame_format']);
                
                $frames = readFramesByStoryboard($row['id_storyboard']);
                $storyboard->setAttribute('frames',$frames);
                
                $response = $storyboard;
            }
        } 
        return $response;
    }

    function deleteStoryboard($id_storyboard){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM storyboard WHERE id_storyboard = ?");
$stmt->bind_param("i", $id_storyboard);

        $stmt->execute();
        
        $stmt->close();
    }

    function updateStoryboard($storyboard){
        $user = $storyboard->getAttribute('user');
        
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $title = $storyboard->getAttribute('title');
        $description = $storyboard->getAttribute('description');
        $avatar = $storyboard->getAttribute('avatar');
        $id_user = $user->getAttribute('id_appuser');
        $fps = $storyboard->getAttribute('fps');
        $frame_format = $storyboard->getAttribute('frame_format');
        $id_storyboard = $storyboard->getAttribute('id_storyboard');
        
        $stmt = $link->prepare("UPDATE storyboard SET title=?, description=?, avatar=?, id_user=?,fps=?, lastupdate=now(), frame_format=? WHERE id_storyboard=?");
        $stmt->bind_param("sssiiii", $title, $description, $avatar, $id_user,$fps, $frame_format,$id_storyboard);

        $stmt->execute();
        
        $stmt->close();
    }

    
?>