<!DOCTYPE html>
<html style="background:#fff;">

<head>
    <title>Animation</title>
    <meta charset="utf-8" />
    <link rel="stylesheet" type="text/css" href="css/estilo.css" />
    <link rel="stylesheet" type="text/css" href="css/estilo_index.css" />
</head>

<body style="overflow:auto">

    <?php
    require_once "php/storyboard/storyboard.php";
    require_once "php/storyboard/storyboardDAO.php";
    require_once "php/user/user.php";
    require_once "php/user/userDAO.php";
    require_once "php/frame/frame.php";
    require_once "php/frame/frameDAO.php";

    if(!isset($_GET['id_storyboard'])){
        header('Location: index.php');
    } else {
        $storyboard = readStoryboardById($_GET['id_storyboard']);
        $user = $storyboard->getAttribute('user');
        $frames = $storyboard->getAttribute('frames');
        $username = $user->getAttribute('username');
        $coverimg = $storyboard->getAttribute('avatar');
        if($coverimg=='' || $coverimg=='img/america.png') $cover = "img/america.png";
        else $cover = $coverimg;
        
    }

?>

        <section id="mainPrint">
            <div id="banner">
                <img id='cover' src='<?php echo $cover?>' />
                <h1><?php echo $storyboard->getAttribute('title')?></h1>
            </div>
            <p><b>Description:</b>
                <?php echo $storyboard->getAttribute('description')?>
            </p>

            <div id="div_author">
                <b>Author: </b>
                <?php 
                    $name = $storyboard->getAttribute('user')->getAttribute('username');
                    $img = "img/".$storyboard->getAttribute('user')->getAttribute('avatar');
                ?>
                    <img id='avatar' src='<?php echo $img?>' />
                    <span><?php echo $name?></span>
            </div>
            <p><b>FPS:</b>
                <?php echo $storyboard->getAttribute('fps')?>
            </p>
            <p><b>Frame Format:</b>
                <?php echo ($storyboard->getAttribute('frame_format')==1)?"4:3":"16:9"?>
            </p>
            <p><b>Last Update:</b>
                <?php echo $storyboard->getAttribute('lastupdate')?>
            </p>
            <div id="frames">
                <?php
                    for($i=0; $i<sizeof($frames); $i++){
                        $imgname = "users/$username/storyboards/$username".$_GET['id_storyboard']."/".$frames[$i]->getAttribute('image');
                        echo "<div class='frameprint'>";
                        echo "<div class='numF'>".($i+1)."</div>";
                        echo "<img src='$imgname'/>";
                        echo "</div>";
                    }
                
                ?>
            </div>
        </section>
        <script>
            window.print();
        </script>
</body>

</html>