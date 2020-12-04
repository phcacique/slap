<!DOCTYPE html>
<?php 
    require_once("php/user/user.php");
    session_start();
    if(isset($_SESSION['user'])) header('Location: home.php');

?>
<html>
    <head>
        <title>SLAP</title>
        <meta charset="utf-8"/>
        <link rel="stylesheet" type="text/css" href="css/estilo.css"/>
        <link rel="stylesheet" type="text/css" href="css/estilo_index.css"/>
    </head>
    <body>
        <section id="login">
            <form action="controller.php" method="post">
                <p><input type="text" name="username" placeholder="nome de usuário" required autofocus/></p>
                <p><input type="password" name="password" placeholder="senha" required/></p>
                <input type="hidden" name="command" value="login"/>
                <p><input type="submit" id="submitlogin" value="LOGIN"/></p>
                <p class='register'><small><a href="register.php">Cadastre-se</a></small></p>
            </form>
            <?php 
                if(isset($_SESSION['erro'])){
                    echo "<p class='error'>".$_SESSION['erro']."</p>";
                    unset($_SESSION['erro']);
                }
            ?>
        </section>
        <footer>&copy; 2016 <a href="http://pedrocacique.com">phcacique</a></footer>
        
    </body>
</html>