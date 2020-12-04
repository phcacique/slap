<?php
    require_once __DIR__ . "/../connection/ConnectionManager.php";

    //---------- RESTFUL ----------
    function getPublicUserByUsername($username){
        $response = array();
        
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_appuser,fullname,email,avatar FROM appuser where username = ?";
        $stmt = $link->prepare($sql);
        $stmt->bind_param("s", $username);
        
        $stmt->execute();
        $stmt->bind_result($id,$fullname, $email,$avatar);

        while ($stmt->fetch()) {
            $img = $_SERVER['HTTP_HOST']."/slap/img/$avatar";
            $response = array("id_user"=>$id,"username"=>$username, "fullname"=>$fullname, "email"=>$email,"avatar"=>$img);
        }
        
        $stmt->close();
        return $response;
    }

    function countStoryboardsByUser($username){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT count(*) FROM storyboard INNER JOIN appuser ON id_appuser=id_user where username = ?";  
        $stmt = $link->prepare($sql);
        $stmt->bind_param("s", $username);
        
        $stmt->execute();
        $stmt->bind_result($num);

        while ($stmt->fetch()) {
            $response = $num;
        }
        $stmt->close();
        return $response;
    }

    function getStoryboardsByUser($username){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_storyboard,title,storyboard.avatar,lastupdate,fps,frame_format,description FROM storyboard INNER JOIN appuser ON id_appuser=id_user where username = ?";  
        $stmt = $link->prepare($sql);
        $stmt->bind_param("s", $username);
        
        $stmt->execute();
        $stmt->bind_result($id,$title,$avatar,$lastupdate,$fps,$ff,$desc);

        /* fetch values */
        while ($stmt->fetch()) {
            $cover = $_SERVER['HTTP_HOST']."/slap/".$avatar;
            array_push($response, array("id_storyboard"=>$id, "title"=>$title, "cover"=>$cover, "description"=>$desc, "last_update"=>$lastupdate, "FPS"=>$fps, "frame_format"=>$ff) );
        }
        
        return $response;
    }

    function getStoryboardById($id){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT username,title,storyboard.avatar,lastupdate,fps,frame_format,description FROM storyboard INNER JOIN appuser ON id_user=id_appuser where id_storyboard = ?";  
        $stmt = $link->prepare($sql);
        $stmt->bind_param("s", $id);
        
        $stmt->execute();
        $stmt->bind_result($username,$title,$avatar,$lastupdate,$fps,$ff,$desc);

        /* fetch values */
        while ($stmt->fetch()) {
            $cover = $_SERVER['HTTP_HOST']."/slap/$avatar";
            $response = array("id_storyboard"=>$id, "title"=>$title, "cover"=>$cover, "description"=>$desc, "last_update"=>$lastupdate, "FPS"=>$fps, "frame_format"=>$ff) ;
        }
        
        return $response;
    }

    function getFramesByStoryboard($id_storyboard){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT username, id_frame, num, duration, image,storyboard.id_storyboard FROM frame INNER JOIN storyboard ON frame.id_storyboard=storyboard.id_storyboard JOIN appuser ON id_user=id_appuser WHERE storyboard.id_storyboard=?";  
        $stmt = $link->prepare($sql);
        $stmt->bind_param("i", $id_storyboard);
        
        $stmt->execute();
        $stmt->bind_result($username,$id,$num,$duration,$image,$id_st);

        /* fetch values */
        while ($stmt->fetch()) {
            $img = $_SERVER['HTTP_HOST']."/slap/users/$username/storyboards/$username".$id_st."/$image";
            array_push($response, array("id_frame"=>$id, "frame_number"=>$num, "duration"=>$duration, "cover"=>$img) );
        }
        
        return $response;
    }

    function getLayersByFrame($id_frame){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT username,storyboard.id_storyboard,id_layer,name_layer,frame_index,visibility,gesture,framelayer.image FROM framelayer INNER JOIN frame ON framelayer.id_frame=frame.id_frame JOIN storyboard ON storyboard.id_storyboard=frame.id_storyboard JOIN appuser ON id_user = id_appuser WHERE frame.id_frame = ?";  
        
        
        $stmt = $link->prepare($sql);
        $stmt->bind_param("i", $id_frame);
        
        $stmt->execute();        
        $stmt->bind_result($username,$id_storyboard,$id_layer,$name,$index,$visibility,$gesture,$image );

        /* fetch values */
        while ($stmt->fetch()) {
            $img = $_SERVER['HTTP_HOST']."/slap/users/$username/storyboards/$username".$id_storyboard."/$image";
            array_push($response, array("id_layer"=>$id_layer, "name"=>$name, "index"=>$index, "visibility"=>$visibility,"isGesture"=>$gesture,"image"=>$img) );
        }
        
        return $response;
    }

    function getGesturesByLayer($id_layer){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT GestureType.name, id_gesture FROM Gesture INNER JOIN GestureType ON id_gestureType = fk_gestureType WHERE fk_framelayer = ?";  
        $stmt = $link->prepare($sql);
        $stmt->bind_param("i", $id_layer);
        
        $stmt->execute();
        $stmt->bind_result($name,$id );

        /* fetch values */
        while ($stmt->fetch()) {
            array_push($response, array("id_gesture"=>$id, "name"=>$name, ) );
        }
        
        return $response;
    }

    function getParamsByGesture($id_gesture){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_gestureParam, gp_value, gp_order FROM GestureParam WHERE fk_gesture = ?";  
        $stmt = $link->prepare($sql);
        $stmt->bind_param("i", $id_gesture);
        
        $stmt->execute();
        $stmt->bind_result($id,$value,$order);

        /* fetch values */
        while ($stmt->fetch()) {
            array_push($response, array("id_param"=>$id, "value"=>$value, "order"=>$order ) );
        }
        
        return $response;
    }
?>