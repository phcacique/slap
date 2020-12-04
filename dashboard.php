<?php
    require_once("php/user/user.php");
    require_once("php/frame/frame.php");
    require_once("php/frame/frameDAO.php");
    require_once("php/gesture/gesture.php");
    require_once("php/gesture/gestureDAO.php");
    require_once("php/post/post.php");
    require_once("php/post/postDAO.php");
    require_once("php/storyboard/storyboard.php");
    require_once("php/storyboard/storyboardDAO.php");
    require_once("php/bug/bugDAO.php");
    require_once("php/bug/bug.php");
    require_once("php/code/code.php");
    require_once("php/code/codeDAO.php");

    $user = $_SESSION['user'][0];
    $storyboards = readStoryboardsByUser($user);
    $posts = readPostByUser($user);
    $numFrames = countFramesByUser($user->getAttribute('id_appuser'));

    
?>

    <h1>Estatísticas</h1>
    <section class="dashboard_main">
        <article>
            <p class='num'><?php echo sizeof($storyboards)?></p>
            <p><i><?php echo ((sizeof($storyboards)==1)?'Storyboard':'Storyboards' )?></i></p>
        </article>
        
        <article>
            <p class='num'><?php echo sizeof($posts)?></p>
            <p><?php echo ((sizeof($posts)==1)?'Mensagem':'Mensagens' )?> em sua <br><i>timeline</i></p>
        </article>
        
        <article>
            <p class='num'><?php echo $numFrames?></p>
            <p><?php echo (($numFrames==1)?'Quadro':'Quadros' )?> </p>
        </article>
    </section>
<div style="overflow:auto; height: 70%;">

<?php
    if($user->getAttribute('usertype')==0){
        $totalST = countAllStoryboards();
        $totalF = countAllFrames();
        $totalU = countAllUsers();
        $totalP = countAllPosts();
        $totalGT = countAllGestureTime();
        $totalAT = countAllActiveTime();
        $totalB = countAllBugs();
        $totalC = countAllCodes();
        $totalFC = countFreeCodes();
        $totalG = countAllGestures();
        $totalCam = countGestureType('Cam');
        $totalRot = countGestureType('Rotation');
        $totalTra = countGestureType('Translation');
        $timeCam = countGestureTimeByType('Cam');
        $timeRot = countGestureTimeByType('Rotation');
        $timeTra = countGestureTimeByType('Translation');
        
        $msAT = $totalAT%1000;
        $sAT = round($totalAT/1000);    
        $mAT = round($sAT/60);
        $sAT = $sAT%60;
        $hAT = round($mAT/60);
        $mAT = $mAT%60;
        
        $msGT = $totalGT%1000;
        $sGT = round($totalGT/1000);
        $mGT = round($sGT/60);
        $sGT = $sGT%60;
        $hGT = round($mGT/60);
        $mGT = $mGT%60;
        
        $msCam = $timeCam%1000;
        $sCam = round($timeCam/1000);
        $mCam = round($sCam/60);
        $sCam = $sCam%60;
        $hCam = round($mCam/60);
        $mCam = $mCam%60;
        
        $msRot = $timeRot%1000;
        $sRot = round($timeRot/1000);
        $mRot = round($sRot/60);
        $sRot = $sRot%60;
        $hRot = round($mRot/60);
        $mRot = $mRot%60;
        
        $msTra = $timeTra%1000;
        $sTra = round($timeTra/1000);
        $mTra = round($sTra/60);
        $sTra = $sTra%60;
        $hTra = round($mTra/60);
        $mTra = $mTra%60;
        
        
        
        
        
        echo "<h1>Estatísticas Gerais</h1>
                <section class='dashboard_main'>
                    <article>
                        <p class='num'>$totalST</p>
                        <p><i>".( ($totalST>1)?"Storyboards":"Storyboard" )."</i></p>
                    </article>";
        echo "<article>
                    <p class='num'>$totalF</p>
                    <p>".( ($totalF>1)?"Quadros":"Quadro" )."</p>
                </article>";
        echo "<article>
                    <p class='num'>$totalU</p>
                    <p>".( ($totalU>1)?"Usuários":"Usuário" )."</p>
                </article>";
        
        echo "<article class='a2'>
                    <p class='num2'>$hAT:$mAT:$sAT:$msAT</p>
                    <p>Tempo para desenho</p>
                </article>";
        echo "<article class='a2'>
                    <p class='num2'>$hGT:$mGT:$sGT:$msGT</p>
                    <p>Tempo para comandos</p>
                </article>";
        echo "<article>
                    <p class='num'>$totalG</p>
                    <p>Comandos<br>desenhados</p>
                </article>";
        echo "<article>
                    <p class='num'>$totalCam</p>
                    <p>Comandos de<br>Câmera</p>
                </article>";
        echo "<article>
                    <p class='num'>$totalTra</p>
                    <p>Comandos de<br>Translação</p>
                </article>";
        echo "<article>
                    <p class='num'>$totalRot</p>
                    <p>Comandos de<br>Rotação</p>
                </article>";
        
        echo "<article class='a2'>
                    <p class='num2'>$hCam:$mCam:$sCam:$msCam</p>
                    <p>Tempo para Câmera</p>
                </article>";
        echo "<article class='a2'>
                    <p class='num2'>$hRot:$mRot:$sRot:$msRot</p>
                    <p>Tempo para Rotação</p>
                </article>";
        echo "<article class='a2'>
                    <p class='num2'>$hTra:$mTra:$sTra:$msTra</p>
                    <p>Tempo para Translação</p>
                </article>";
        
        
        
        echo "<article>
                    <p class='num'>".($totalCam*2)."</p>
                    <p>Símbolos de<br>Enquadramento</p>
                </article>";
        echo "<article>
                    <p class='num'>".($totalTra*2)."</p>
                    <p>Símbolos de<br>Ponto</p>
                </article>";
        
        
        
//        echo "<article>
//                    <p class='num'>$totalB</p>
//                    <p>".( ($totalB>1)?"Bugs reportados":"Bug reportado" )."</p>
//                </article>";
//        echo "<article>
//                    <p class='num'>$totalC</p>
//                    <p>".( ($totalC>1)?"Códigos ":"Código " )."de acesso</p>
//                </article>";
//        echo "<article>
//                    <p class='num'>$totalFC</p>
//                    <p>".( ($totalFC>1)?"Códigos disponíveis":"Código disponível" )."</p>
//                </article>";
//        echo "<article>
//                    <p class='num'>$totalP</p>
//                    <p>".( ($totalP>1)?"Mensagens":"Mensagem" )."</p>
//                </article>";
        echo "</section>";
    }
    ?>
</div>