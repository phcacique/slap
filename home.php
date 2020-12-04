<!DOCTYPE html>
<?php 
    
    require_once("php/user/user.php");
    require_once("php/user/userDAO.php");
    session_start();

    $selectedMenu = "dashboard";
    if(isset($_GET['menu'])) $selectedMenu = $_GET['menu'];
    $username = "USER";
    if(!isset($_SESSION['user'])) header('Location: index.php');
    else {
        $user = $_SESSION['user'][0];
        $username = $user->getAttribute("username");
    }
?>
    <html>

    <head>
        <title>SLAP</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="css/estilo.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <script type="text/javascript" src="js/croquis_cacique.js"></script>
    </head>

    <body>
        <section id="container">
            <?php include "asideMenu.php"?>
                <section id="main">
                    <?php 
                    include $selectedMenu.".php";
                ?>
                </section>
        </section>
    </body>

    </html>