<?php
    ob_start();
    require_once __DIR__ . "/../connection/ConnectionManager.php";
    require_once __DIR__ . "/../user/user.php";
    require_once "post.php";
    ob_end_clean();

    function insertPost($user, $text, $postdate){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("INSERT INTO post (id_user, text, postdate) VALUES (?,?,now())");
        $stmt->bind_param("is", $user->getAttribute("id_appuser"), $text);

        $stmt->execute();
        
        $stmt->close();
    }

    function readAllPosts(){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM post INNER JOIN appuser ON id_appuser=id_user ORDER BY postdate DESC";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $post = new Post($row['id_post'], $user, $row['text'], $row['postdate']);
                array_push($response,$post);
            }
        }
        return $response;
    }

    function countAllPosts(){
        $response = array();

        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT COUNT(*) AS total FROM post";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $response = $row["total"];
            }
        }
        return $response;
    }

    function readPostByUser($user){
        $response = array();

        $id = $user->getAttribute('id_appuser');
            
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $sql = "SELECT * FROM post INNER JOIN appuser ON id_appuser=id_user WHERE id_user=$id ORDER BY postdate DESC";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            
            while($row = $result->fetch_assoc()) {
                $user = new User($row["id_appuser"], $row["username"], $row["password"], $row["usertype"], $row["email"], $row["fullname"], $row["avatar"]);
                $post = new Post($row['id_post'], $user, $row['text'], $row['postdate']);
                array_push($response,$post);
            }
        }
        return $response;
    }

    function deletePost($id_post){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("DELETE FROM post WHERE id_post = ?");
$stmt->bind_param("i", $id_post);

        $stmt->execute();
        
        $stmt->close();
    }

    function updatePost($post){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("UPDATE post SET id_user=?, text=?, postdate=? WHERE id_post=?");
        $stmt->bind_param("issi", $post->getAttribute("id_user"), $post->getAttribute("text"), $post->getAttribute("postdate"), $post->getAttribute("id_post"));

        $stmt->execute();
        
        $stmt->close();
    }

    
?>