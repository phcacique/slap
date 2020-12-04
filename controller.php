<?php
    error_reporting(-1);
    ini_set('display_startup_errors',true);
    ini_set('display_errors','stdout');
    ob_start();
    require_once("functions.php");
    require_once("php/user/user.php");
    require_once("php/user/userDAO.php");
    require_once("php/post/post.php");
    require_once("php/post/postDAO.php");
    require_once("php/storyboard/storyboard.php");
    require_once("php/storyboard/storyboardDAO.php");
    require_once("php/layer/layer.php");
    require_once("php/layer/layerDAO.php");
    require_once("php/bug/bugDAO.php");
    require_once("php/bug/bug.php");
    require_once("php/code/code.php");
    require_once("php/code/codeDAO.php");
    require_once("php/gesture/gesture.php");
    require_once("php/gesture/gestureParam.php");
    require_once("php/gesture/gestureType.php");
    require_once("php/gesture/gestureDAO.php");
    ob_end_clean();

    ob_start();
    session_start();
    $command = "";
    $returnPage = "index.php";
    if(isset($_POST['command'])) $command = $_POST['command'];
    if(isset($_GET['command'])) $command = $_GET['command'];

    $redirect = true;

    switch($command){
        case "login":
            if( isset($_POST['username']) && isset($_POST['password']) ){
                $response = login($_POST['username'], md5($_POST['password']));
                if(sizeof($response)==0) {
                    $returnPage = "index.php";
                    $_SESSION['erro'] = "Login inválido!";
                }
                else {
                    $_SESSION['user'] = $response;
                    $returnPage = "home.php";
                }
            }
            break;
        case "register":
            $username = $_POST['username'];
            $password = $_POST['password'];
            $password2 = $_POST['password2'];
            $fullname = $_POST['fullname'];
            $email = $_POST['email'];
            $rcode = $_POST['rcode'];
            $avatar = $_POST['r_avatar'];
            
            if(sizeof(readUserByUsername($username))>0){
                $_SESSION['erro'] = "Nome de usuário já está em uso!";
                $returnPage = "register.php";
            } elseif(sizeof(readUserByEmail($email))>0){
                $_SESSION['erro'] = "Email já está em uso!";
                $returnPage = "register.php";
            } else if($password != $password2){
                $_SESSION['erro'] = "Senha não confere!";
                $returnPage = "register.php";
            } else if(verifyRedeem($rcode) == 0){
                $_SESSION['erro'] = "Verifique o código de acesso!";
                $returnPage = "register.php";
            } else {
                insertUser($username, md5($password), $fullname, $email, 1, $avatar);
                $user = readUserByUsername($username);
                insertUserCode($user[0]->getAttribute('id_appuser'), readRedeem($rcode));
                $returnPage = "index.php";
            }
            break;
        case "updateUser":
            $username = $_SESSION['user'][0]->getAttribute('username');
            $password = $_POST['password'];
            $password2 = $_POST['password2'];
            $fullname = $_POST['fullname'];
            $email = $_SESSION['user'][0]->getAttribute('email');
            $avatar = $_POST['r_avatar'];
            if($password != $password2){
                $_SESSION['erro'] = "Senhas não conferem!";
                $returnPage = "home.php?menu=profile";
            } else {
                updateUser($_SESSION['user'][0]->getAttribute('id_appuser'), $username, md5($password), $fullname, $email, $_SESSION['user'][0]->getAttribute('usertype'), $avatar);
                
                $_SESSION['user'][0]->setAttribute('fullname',$fullname);
                $_SESSION['user'][0]->setAttribute('avatar',$avatar);
                $_SESSION['user'][0]->setAttribute('password',md5($password));
                
                $_SESSION['erro'] = "Usuário atualizado!";
                $returnPage = "home.php?menu=profile";
            }
            break;
        case "logout":
            session_destroy();
            $returnPage = "index.php";
            break;
        case "post":
            $text = $_POST['text'];
            $date = date('Y-m-d H:i:s',time());
            $user = $_SESSION['user'][0];
            insertPost($user, $text, $date);
            $returnPage = "home.php?menu=storyboards";
            break;
        case "removePost":
            deletePost($_GET['id']);
            $returnPage = "home.php?menu=storyboards";
            break;
        case "createStoryboard":
            $title = $_POST['title'];
            $description = $_POST['description'];
            $user = $_SESSION['user'][0];
            $id = insertStoryboard($title, $description, '', $user);
            $returnPage = "home.php?menu=storyboards";
            $dir = "users/".$user->getAttribute('username')."/storyboards/".$user->getAttribute('username').$id;
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            break;
        case "removeStoryboard":
            $id = $_GET['id'];
            deleteStoryboard($id);
            $user = $_SESSION['user'][0];
            $dir = "users/".$user->getAttribute('username')."/storyboards/".$user->getAttribute('username').$id;
            removeDir($dir);
            
            $returnPage = "home.php?menu=storyboards";
            break;
        case "editStoryboard":
            $user = $_SESSION['user'][0];
            $id_storyboard = $_POST['id_storyboard'];
            $title = $_POST['title'];
            $description = $_POST['description'];
            $fps = $_POST['fps'];
            $frame_format = $_POST['frame_format'];
            
            $storyboard = new Storyboard($id_storyboard, $title, $description, '', $user, 0, $fps, $frame_format);
            //echo $storyboard->storyboardToString();
            updateStoryboard($storyboard);
            $returnPage = "home.php?menu=edit_storyboard&id=".$id_storyboard;
            break;
        case "saveImageStoryboard":
            $user = $_SESSION['user'][0];
            $name = $user->getAttribute('username');
            $id_storyboard = $_POST['id_storyboard'];
            $img = $_POST['file'];
            $numFrame = $_POST['numFrame'];
            $duration = $_POST['duration'];
            $activeTime = $_POST['activeTime'];
            $gestureTime = $_POST['gestureTime'];
            
            $upload_dir = "users/$name/storyboards/$name".$id_storyboard."/"; 
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $date = new DateTime();
            $image = date_format($date, 'U');
            $file = $upload_dir."$image.png";
            $success = file_put_contents($file, $data);
            
            $id = insertFrame($id_storyboard, $numFrame, $duration, "$image.png", $activeTime, $gestureTime);
            
            updateStoryboard(readStoryboardById($id_storyboard));
            
            //Remove os frames depois de uma atualização
            if($id!=-1){
                $layers0 = readLayersByFrame($id);
                for($i=0; $i<sizeof($layers0); $i++){ 
                    $img = $layers0[$i]->getAttribute('image');
                    if (file_exists($upload_dir.$img)) {
                        unlink($upload_dir.$img);
                    }
                }
                deleteLayerByFrame($id);    
            }
            
            
            $frames = readFramesByStoryboard($id_storyboard);
            $id_frame = $frames[$numFrame-1]->getAttribute('id_frame');
            
            $numLayers = $_POST['numLayers'];
            
            $images = array();
            for($i=0; $i<$numLayers; $i++){                
                $id = insertLayerData($id_frame, $_POST['layerName_'.$i], $i, $_POST['layerVisibility_'.$i], $_POST['layerGesture_'.$i], $_POST['layerFile_'.$i], $upload_dir);
                
                if(isset($_POST['layer_'.$i.'_numgestures'])){
                    $numGes = $_POST['layer_'.$i.'_numgestures'];
                    for($j=0; $j<$numGes; $j++){
                        $ges = $_POST['layer_'.$i.'_gesture_'.$j];
                        $ges = explode("Gesture{",$ges);
                        $ges = $ges[1];
                        $ges = substr($ges,0,strlen($ges)-1);
                        $ar = explode(";",$ges);
                        print_r($ar);
                        $type = 0;
                        
                        //Type
                        $b = explode(":", $ar[1]);
                        echo "<p>".$b[0]."</p>";
                        if($b[0] == ' type') 
                            $type = getGestureTypeId($b[1]);
                        
                        $gesture = new Gesture(-1, $id, new GestureType($type, ""));
                        
                        //Params
                        $b = explode(":", $ar[2]);
                        echo "<p>".$b[0]."</p>";
                        if($b[0] == ' params'){
                            $c = explode(" / ",substr($b[1],1,strlen($b[1])-2));
                            for($k=0; $k<sizeof($c); $k++){
                                $p = new GestureParam(-1, -1, $c[$k], $k);
                                $gesture->addParam($p);
//                                $d = explode(",",$c[$k]);
//                                $letter = explode("(",$d[0])[0];
//                                $d0 = explode("(",$d[0])[1];
//                                $d1 = explode(")", $d[1])[0];
//                                echo "<p>Point: $letter -> x: $d0, y: $d1</p>";
                            }   
                        }
                        insertGesture($gesture);
                    }    
                }
                
                
                
            }

            $frames = readFramesByStoryboard($id_storyboard);
            $st = readStoryboardById($id_storyboard);
            if($frames!=null && sizeof($frames)>0 ){
                $user = $_SESSION['user'][0];
                $name = $user->getAttribute('username');
                $st->setAttribute('avatar', "users/$name/storyboards/$name".$id_storyboard."/".$frames[0]->getAttribute('image'));
                updateStoryboard($st);
            }
            
            
            $returnPage = "home.php?menu=edit_storyboard&id=".$id_storyboard;
            
            break;
        case "removeFrame":
            $user = $_SESSION['user'][0];
            $name = $user->getAttribute('username');
            $id_storyboard = $_GET['id_storyboard'];
            $img = $_GET['image'];
            
            if($img!=""){
                $frame = readFrameByImage($img);
                $layers = readLayersByFrame($frame[0]->getAttribute('id_frame'));
                

                $upload_dir = "users/$name/storyboards/$name".$id_storyboard."/$img";
                if (file_exists($upload_dir)) {
                    unlink($upload_dir);
                }
                
                echo $frame[0]->getAttribute('id_frame');
                echo sizeof($layers);
                
                for($i=0; $i< sizeof($layers); $i++){
                    $img = $layers[$i]->getAttribute('image');
                    $upload_dir = "users/$name/storyboards/$name".$id_storyboard."/$img";
                    if (file_exists($upload_dir)) {
                        unlink($upload_dir);
                    }   
                }

                deleteFrame($frame[0]->getAttribute('id_frame'));
                updateStoryboard(readStoryboardById($id_storyboard));    
            }
            
            
            $frames = readFramesByStoryboard($id_storyboard);
            $st = readStoryboardById($id_storyboard);
            $user = $_SESSION['user'][0];
            $name = $user->getAttribute('username');
            if($frames!=null && sizeof($frames)>0 ){
                
                $st->setAttribute('avatar', "users/$name/storyboards/$name".$id_storyboard."/".$frames[0]->getAttribute('image'));
                updateStoryboard($st);
            } else {
                $st->setAttribute('avatar', "img/america.png");
                updateStoryboard($st);
            }
            
            $returnPage = "home.php?menu=edit_storyboard&id=".$id_storyboard;
            break;
            
        case "searchStoryboardAnotherUser":
            $user = $_POST['user'];
            $returnPage = "home.php?menu=storyboards&user=".$user;
            break;
        case "updateStoryboardFrames":
            $data = explode("]", $_GET['data']);
            for($i=0; $i<sizeof($data)-1; $i++){
                $image = explode(",", $data[$i]);
                $image = $image[1];
                $a = explode(",", $data[$i]);
                $num = explode("[",$a[0]);
                $num = $num[1];
                updateFrameImage($_GET['id_storyboard'], $num, $image);
            } 
            
            $frames = readFramesByStoryboard($_GET['id_storyboard']);
            $st = readStoryboardById($_GET['id_storyboard']);
            if($frames!=null && sizeof($frames)>0 ){
                $user = $_SESSION['user'][0];
                $name = $user->getAttribute('username');
                $st->setAttribute('avatar', "users/$name/storyboards/$name".$_GET['id_storyboard']."/".$frames[0]->getAttribute('image'));
                updateStoryboard($st);
            }
            
            $returnPage = "home.php?menu=edit_storyboard&id=".$_GET['id_storyboard'];
            break;
        case "reportBug":
            $subject = $_POST['subject'];
            $msg = $_POST['msg'];
            insertBug($subject, $msg, $_SESSION['user'][0]->getAttribute('id_appuser'));
            $returnPage = "home.php?menu=bugs";
            $_SESSION['erro'] = "Bug reportado. Obrigado!";
            break;
        case "insertCode":
            $code = $_POST['code'];
            $quant = $_POST['quant'];
            insertCode($code, $quant);
            $returnPage = "home.php?menu=codes";
            break;
        case "removeCode":
            $id = $_GET['id'];
            deleteCode($id);
            $returnPage = "home.php?menu=codes";
            break;
        case "editCode":
            $id = $_GET['id'];
            $returnPage = "home.php?menu=codes&id=$id";
            break;
        case "updateCode":
            $id = $_POST['id'];
            $code = readCodeById($id);
            $code = $code[0];
            $c = $_POST['code'];
            $q = $_POST['quant'];
            $code->setAttribute('code',$c);
            $code->setAttribute('total_users',$q);
            updateCode( $code );
            $returnPage = "home.php?menu=codes";
            break;
        case "playStoryboard":
            $redirect = false;
            
            
            break;
    }

    if($redirect){
        ob_end_clean();
        header("Location: $returnPage");
        
    }
    
    function insertLayerData($numFrame, $layerName, $i, $layerVisibility, $layerGesture, $img2, $upload_dir){
        $img2 = str_replace('data:image/png;base64,', '', $img2);
        $img2 = str_replace(' ', '+', $img2);
        $data = base64_decode($img2);
        $date = new DateTime();
        $image2 = date_format($date, 'U').$i;
        $file = $upload_dir."$image2.png";
        $success = file_put_contents($file, $data);

        $id = insertLayer($numFrame, $layerName, $i, $layerVisibility, $layerGesture, $image2.'.png');
        return $id;
    }
?>
