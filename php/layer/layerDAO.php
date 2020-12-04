<?php
    ob_start();
    require_once __DIR__ . "/../connection/ConnectionManager.php";
    require_once "layer.php";
    ob_end_clean();

    function insertLayer($id_frame, $name_layer, $index, $visibility, $gesture, $image){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $response = array();
        
        //echo '<script>alert(ID: '.$id_frame.' <br>Name:'.$name_layer.' <br>Index: '.$index.' <br>Visibility: '.$visibility.' <br>Gesture: '.$gesture.' <br>Image:'.$image.');</script>';
        
        $stmt = $link->prepare("INSERT INTO framelayer (id_frame, name_layer, frame_index, visibility, gesture, image) VALUES (?,?,?,?,?,?)");
        $stmt->bind_param("isiiis", $id_frame, $name_layer, $index, $visibility, $gesture, $image);

        $stmt->execute();

        $stmt->close();    
        
        return mysqli_insert_id($link);
    }

    function readLayersByFrame($id_frame){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM framelayer WHERE framelayer.id_frame = $id_frame ORDER BY frame_index ASC";  
        $result = $link->query($sql);

        if ($result && $result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $layer = new Layer($row['id_layer'],$row['id_frame'],$row['name_layer'],$row['frame_index'],$row['visibility'],$row['gesture'],$row['image']);
                array_push($response,$layer);
            }
        } 
        return $response;
    }

    function readLayerById($id_layer){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM framelayer WHERE framelayer.id_layer = $id_layer ORDER BY index ASC";  
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $layer = new Layer($row['id_layer'],$row['id_frame'],$row['name_layer'],$row['frame_index'],$row['visibility'],$row['gesture'],$row['image']);
                array_push($response,$layer);
            }
        } 
        return $response;
    }

    function deleteLayer($id_layer){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM framelayer WHERE id_layer = ?");
$stmt->bind_param("i", $id_layer);

        $stmt->execute();
        
        $stmt->close();
    }

    function deleteLayerByFrame($id_frame){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM framelayer WHERE id_frame = ?");
$stmt->bind_param("i", $id_frame);

        $stmt->execute();
        
        $stmt->close();
    }

    function updateLayer($layer){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("UPDATE framelayer SET id_frame=?, name_layer=?, frame_index=?, visibility=?, gesture=?, image=? WHERE id_frame=?");
        $stmt->bind_param("isiiis", $frame->getAttribute('id_frame'), $frame->getAttribute('name_layer'), $frame->getAttribute('index'), $frame->getAttribute('visibility'), $frame->getAttribute('gesture'), $frame->getAttribute('image'), $frame->getAttribute('id_frame'));

        $stmt->execute();
        
        $stmt->close();
    }
    
?>