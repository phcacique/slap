<?php
    require_once "php/connection/ConnectionManager.php";
    require_once "php/user/User.php";
    session_start();
    if(isset($_SESSION['user'])){
        $user = $_SESSION['user'][0]; 
        $fk = $user->getAttribute("id_appuser");
        for($i=1; $i<31; $i++){
            $resp = "";
            if(isset($_POST['q'.$i])){ $resp = $_POST['q'.$i]; }
            if(isset($_POST['q'.$i.'f'])){ $resp = $_POST['q'.$i.'f']; }
            echo "<p>-- $i: $resp</p>";
            insertQuestion($fk, $i, $resp);
        }
        header('Location: home.php');
    } else{
        echo "Por favor, faça login primeiro!";
    }
    
    function insertQuestion($fk, $num, $resp){
        $conn = ConnectionManager::getInstance();
        $link = $conn->getConnection();
        
        $stmt = $link->prepare("INSERT INTO question (q_number, q_answer, fk_user, date_time) VALUES (?,?,?,now())");
        $stmt->bind_param("isi", $num, $resp, $fk);

        $stmt->execute();
        
        $stmt->close();
    }
?>