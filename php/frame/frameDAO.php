<?php
    ob_start();
    require_once __DIR__ . "/../connection/ConnectionManager.php";
    require_once __DIR__ . "/../storyboard/storyboard.php";
    require_once __DIR__ . "/../user/user.php";
    require_once __DIR__ . "/../layer/layer.php";
    require_once __DIR__ . "/../layer/layerDAO.php";
    require_once "frame.php";
    ob_end_clean();

    function insertFrame($id_storyboard, $num, $duration, $image, $activeTime, $gestureTime){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $type = -1;
        $response = array();
        
        $sql = "SELECT id_frame,image FROM frame WHERE num = $num AND id_storyboard = $id_storyboard";  
        $result = $link->query($sql);

        if ($result && $result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                array_push($response,array($row['id_frame'],$row['image']));
            }
        } 
        
        if(sizeof($response)!=0){
            $user = $_SESSION['user'][0];
            $name = $user->getAttribute('username');
            for($i=0; $i<sizeof($response); $i++){
                $type = $response[$i][0];
                $stmt = $link->prepare("UPDATE frame SET image=?, duration=?, activeTime=?, gestureTime=? WHERE id_frame=?");
                $stmt->bind_param("siiii", $image, $duration, $activeTime, $gestureTime, $response[$i][0]);

                $stmt->execute();

                $stmt->close();    
                $img = $response[$i][1];
              
                $dir = "users/$name/storyboards/$name".$id_storyboard."/$img"; 
                  
                if (file_exists($dir)) {
                    unlink($dir);
                }
                
            }
        } else {
            echo "INSERT $num";
            $stmt = $link->prepare("INSERT INTO frame (id_storyboard, num, duration, image, activeTime, gestureTime) VALUES (?,?,?,?,?,?)");
            $stmt->bind_param("iiisii", $id_storyboard, $num, $duration, $image,$activeTime,$gestureTime);

            $stmt->execute();

            $stmt->close();    
        }
        
        return $type;
    }

    function countAllFrames(){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT COUNT(*) AS total FROM frame inner join storyboard on frame.id_storyboard = storyboard.id_storyboard where id_user != 1";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row["total"];
            }
        }
        return $response;
    }

    function countAllActiveTime(){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT activeTime FROM frame";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response += $row["activeTime"];
            }
        }
        return $response;
    }

    function countAllGestureTime(){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT gestureTime FROM frame";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response += $row["gestureTime"];
            }
        }
        return $response;
    }
    
    function countGestureTimeByType($type){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT gesturetime FROM gesture inner join framelayer on fk_framelayer = id_layer join frame on framelayer.id_frame = frame.id_frame join storyboard on storyboard.id_storyboard = frame.id_storyboard join gestureType on fk_gesturetype=id_gesturetype where storyboard.id_user != 1 AND gesturetype.name = '$type';";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response += $row["gesturetime"];
            }
        }
        return $response;
    }

    function readFramesByStoryboard($id_storyboard){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, storyboard.id_storyboard, title, description, storyboard.avatar as savatar, lastupdate, fps, frame_format, num, id_frame, duration, image, activeTime, gestureTime FROM frame INNER JOIN storyboard ON storyboard.id_storyboard=frame.id_storyboard  JOIN appuser ON id_appuser=id_user WHERE frame.id_storyboard = $id_storyboard ORDER BY num ASC";  
        $result = $link->query($sql);

        if ($result && $result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $storyboard = new Storyboard($row['id_storyboard'], $row['title'], $row['description'], $row['savatar'], $user,$row['lastupdate'],$row['fps'],$row['frame_format']);
                $frame = new Frame($row['id_frame'], $storyboard, $row['num'], $row['duration'], $row['image']);
                $frame->setAttribute('gestureTime',$row['gestureTime']);
                $frame->setAttribute('activeTime',$row['activeTime']);
                array_push($response,$frame);
            }
        } 
        return $response;
    }

    function countFramesByUser($id_user){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT count(id_frame) as count FROM frame INNER JOIN storyboard ON frame.id_storyboard = storyboard.id_storyboard WHERE id_user = $id_user";  
        $result = $link->query($sql);

        if ($result && $result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row['count'];
            }
        } 
        return $response;
    }

    function readFrameById($id_frame){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, storyboard.id_storyboard, title, description, storyboard.avatar as savatar, lastupdate, fps, frame_format, num, id_frame, duration, image, gestureTime, activeTime FROM frame INNER JOIN storyboard ON storyboard.id_storyboard=frame.id_storyboard  JOIN appuser ON id_appuser=id_user WHERE frame.id_frame = $id_frame ORDER BY num ASC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $storyboard = new Storyboard($row['id_storyboard'], $row['title'], $row['description'], $row['savatar'], $user,$row['lastupdate'],$row['fps'],$row['frame_format']);
                $frame = new Frame($row['id_frame'], $storyboard, $row['num'], $row['duration'], $row['image']);
                $frame->setAttribute('gestureTime',$row['gestureTime']);
                $frame->setAttribute('activeTime',$row['activeTime']);
                array_push($response,$frame);
            }
        } 
        return $response;
    }

    function readFrameByImage($image){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser, username, password, usertype, email, fullname, appuser.avatar, storyboard.id_storyboard, title, description, storyboard.avatar as savatar, lastupdate, fps, frame_format, num, id_frame, duration, image, activeTime, gestureTime FROM frame INNER JOIN storyboard ON storyboard.id_storyboard=frame.id_storyboard  JOIN appuser ON id_appuser=id_user WHERE frame.image = '$image' ORDER BY num ASC";  
        $result = $link->query($sql);

        if ($result && $result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $storyboard = new Storyboard($row['id_storyboard'], $row['title'], $row['description'], $row['savatar'], $user,$row['lastupdate'],$row['fps'],$row['frame_format']);
                $frame = new Frame($row['id_frame'], $storyboard, $row['num'], $row['duration'], $row['image']);
                $frame->setAttribute('gestureTime',$row['gestureTime']);
                $frame->setAttribute('activeTime',$row['activeTime']);
                array_push($response,$frame);
            }
        } 
        return $response;
    }

    function deleteFrame($id_frame){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM frame WHERE id_frame = ?");
$stmt->bind_param("i", $id_frame);

        $stmt->execute();
        
        $stmt->close();
    }

    function updateFrame($frame){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("UPDATE frame SET num=?, duration=?, id_storyboard=?, image=?, activeTime=?, gestureTime=? WHERE id_frame=?");
        $stmt->bind_param("iiisiii", $frame->getAttribute('num'), $frame->getAttribute('duration'), $frame->getAttribute('storyboard'), $frame->getAttribute('image'),$frame->getAttribute('activeTime'),$frame->getAttribute('gestureTime'), $frame->getAttribute('id_frame'));

        $stmt->execute();
        
        $stmt->close();
    }

    function updateFrameImage($id_storyboard, $num, $image){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_frame,image FROM frame WHERE num = $num AND id_storyboard = $id_storyboard";
        echo "SELECT id_frame,image FROM frame WHERE num = $num AND id_storyboard = $id_storyboard";
        $result = $link->query($sql);

        if ($result && $result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                array_push($response,array($row['id_frame'],$row['image']));
            }
        } 
        
        if(sizeof($response)!=0){
            $user = $_SESSION['user'][0];
            $name = $user->getAttribute('username');
            for($i=0; $i<sizeof($response); $i++){
                $stmt = $link->prepare("UPDATE frame SET image=? WHERE id_frame=?");
                $stmt->bind_param("si", $image, $response[$i][0]);

                $stmt->execute();

                $stmt->close();    
                $img = $response[$i][1];
                $dir = "users/$name/storyboards/$name".$id_storyboard."/$img";
                
            }
        }
        return $response;
    }
    
?>