<?php
    require_once "php/bug/bug.php";
    require_once "php/bug/bugDAO.php";
?>

    <h1>Reporte um BUG</h1>
    <p>Nos ajude a criar uma ferramenta melhor!</p>
    <section id="profile_main">
        <form action="controller.php" method="post">
            <input type="hidden" name="command" value="reportBug" />
            <p>
                <input type="text" name="subject" id="subject" placeholder="assunto" />
            </p>
            <p>
                <textarea id="msg" name="msg" placeholder="Por favor detalhe o que aconteceu e como aconteceu. O que você estava fazendo quando o bug ocorreu?"></textarea>
            </p>
            <p>
                <input type="submit" value="REPORTAR" />
            </p>
        </form>
        <?php 
        if(isset($_SESSION['erro'])){
            echo "<p class='error'>".$_SESSION['erro']."</p>";
            unset($_SESSION['erro']);
        }
    ?>

            
                <?php
                    if($user->getAttribute('usertype')==0){
                        echo "<section class='reportedBugs'><h1>BUGs reportados</h1>";    
                        $bugs = readAllBugs();
                        foreach ($bugs as $bug){
                            echo "<article class='bug'>
                                <h2>".$bug->getAttribute('subject')."</h2>
                                <p class='dtext'>".$bug->getAttribute('detailedText')."</p>
                                <p class='buguser'>Reportado por <i>".$bug->getAttribute('user')->getAttribute('username')." em ".$bug->getAttribute('bugdate')."</i></p>
                            </article>";
                        }
                        echo "</section>";
                    }
                ?>
            

    </section>