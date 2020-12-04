<?php
    ob_start();
    require_once __DIR__ . "/../connection/ConnectionManager.php";
    require_once "gesture.php";
    require_once "gestureParam.php";
    require_once "gestureType.php";
    ob_end_clean();

    function insertGesture($gesture){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();

        $fk_framelayer = $gesture->getAttribute('fk_frameLayer');
        $fk_gestureType = $gesture->getAttribute('gestureType')->getAttribute('id_gestureType');
        
        echo "<p>fk_framelayer: $fk_framelayer, gesturetype: $fk_gestureType</p>";
        
        $stmt = $link->prepare("INSERT INTO Gesture (fk_framelayer, fk_gestureType) VALUES (?,?)");
        $stmt->bind_param("ii", $fk_framelayer, $fk_gestureType);

        $stmt->execute();

        $stmt->close();
        
        $id_gesture = mysqli_insert_id($link);
        
        if($id_gesture > 0)
        {
            $params = $gesture->getAttribute('params');
            for($i=0; $i<sizeof($params); $i++){
                $param = $params[$i];

                $value = $param->getAttribute('value');
                $order = $param->getAttribute('order');

                echo "<p>value: $value, order: $order, id: $id_gesture</p>";

                $stmt = $link->prepare("INSERT INTO GestureParam (fk_gesture, gp_value, gp_order) VALUES (?,?,?)");
                $stmt->bind_param("isi", $id_gesture, $value, $order );

                $stmt->execute();

                $stmt->close();
            }
        }
    }

    function readGestureByFramelayer($id_framelayer){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM gesture INNER JOIN GestureType on id_gesturetype = fk_gesturetype WHERE fk_framelayer = $id_framelayer";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $gestureType = new GestureType($row['id_gestureType'], $row['name']);
                $gesture = new Gesture($row['id_gesture'], $row['fk_framelayer'], $gestureType);
                array_push($response,$frame);
            }
        } 
        
        for($i=0; $i<sizeof($response); $i++){
            $id = $response[$i]->getAttribute('id_gesture');
            
            $sql = "SELECT * FROM GestureParam WHERE fk_gesture=$id";  
            $result = $link->query($sql);
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $gestureParam = new GestureParam($row['id_gestureParam'], $id, $row['gp_value'], $row['gp_order']);
                    $response[$i]->addParam($gestureParam);
                }
            }
        }
        return $response;
    }    

    function deleteGesture($id_gesture){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM Gesture WHERE id_gesture = ?");
$stmt->bind_param("i", $id_gesture);

        $stmt->execute();
        
        $stmt->close();
    }

    function updateGesture($gesture){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $fk_framelayer = $gesture->getAttribute('fk_frameLayer');
        $fk_gestureType = $gesture->getAttribute('gestureType')->getAttribute('id_gestureType');
        
        $stmt = $link->prepare("UPDATE Gesture SET fk_framelayer, fk_gestureType WHERE id_gesture=?");
        $stmt->bind_param("iii", $fk_framelayer, $fk_gestureType );

        $stmt->execute();
        
        $stmt->close();
        
        $params = $gesture->getAttribute('params');
        for($i=0; $i<sizeof($params); $i++){
            
            $param = $params[$i];
            
            $id_gesture = $gesture->getAttribute('id_gesture');
            $id_param = $param->getAttribute('id_gestureParam');
            $value = $param->getAttribute('value');
            $order = $param->getAttribute('order');
            
            $stmt = $link->prepare("UPDATE GestureParam set fk_gesture=?, value=?, order=?) WHERE id_gestureParam=?");
            $stmt->bind_param("isii", $id_gesture, $value, $order, $id_param );

            $stmt->execute();

            $stmt->close();
        }
    }

    function getGestureTypeId($name){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT id_gestureType FROM GestureType WHERE name = '$name'";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                return $row['id_gestureType'];
            }
        } else return -1;
    }

    function countAllGestures(){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT count(*) as total FROM Gesture inner join framelayer on fk_framelayer = id_layer join frame on framelayer.id_frame = frame.id_frame join storyboard on storyboard.id_storyboard = frame.id_storyboard where storyboard.id_user != 1";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row["total"];
            }
        }
        return $response;
    }

    function countGestureType($type){
        $response = 0;

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT count(*) as total FROM Gesture inner join framelayer on fk_framelayer = id_layer join frame on framelayer.id_frame = frame.id_frame join storyboard on storyboard.id_storyboard = frame.id_storyboard join GestureType on fk_gesturetype=id_gesturetype where storyboard.id_user != 1 AND gesturetype.name = '$type';";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row["total"];
            }
        }
        return $response;
    }
    
?>