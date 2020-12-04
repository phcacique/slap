<html>

<head>
    <script type="text/javascript" src="js/edit_frame.js"></script>
    <script type="text/javascript" src="js/slap.js"></script>
    <script src="js/jscolor.js"></script>
    <link rel="stylesheet" type="text/css" href="css/edit_frame.css" />
</head>

<body>
    <script>
        var selectedFrame = <?php echo $_GET['f']?>;
        var temp_img = null;
        var id_frame = -1;
        var layerArray = [];
        var imgBase = "";
    </script>
    <?php
    require_once("php/storyboard/storyboard.php");
    require_once("php/storyboard/storyboardDAO.php");
    require_once("php/user/user.php");
    require_once("php/user/userDAO.php");
    require_once("php/frame/frame.php");
    require_once("php/frame/frameDAO.php");
    require_once("php/layer/layer.php");
    require_once("php/layer/layerDAO.php");
    if(!isset($_GET['st']) || !isset($_GET['f'])){
        echo "ERRO";
    } else {
        
        $storyboard = readStoryboardById($_GET['st']);
        $username = $storyboard->getAttribute('user')->getAttribute('username');
        $imgBase = "users/$username/storyboards/".$username.$storyboard->getAttribute('id_storyboard')."/";
        $layers = array();
        if($_GET['f'] < sizeof($storyboard->getAttribute('frames'))){
            $frames = $storyboard->getAttribute('frames');
            $frames = $storyboard->getAttribute('frames');
            $img = $imgBase . $frames[$_GET['f']]->getAttribute('image');

            $frame = $storyboard->getAttribute('frames')[$_GET['f']];
            $layers = readLayersByFrame($frame->getAttribute('id_frame'));
            $frame->setAttribute('layers', $layers );    
        } else {
            $img = "";
            $frame = new Frame(-1, $storyboard, $_GET['f'], 0, "");
        }
        

        echo "<script>";
        for($i=0; $i<sizeof($layers); $i++){
            $name = $layers[$i]->getAttribute('name_layer');
            $visibility = $layers[$i]->getAttribute('visibility');
            $gesture = $layers[$i]->getAttribute('gesture');
            $image = $layers[$i]->getAttribute('image');
            echo "layerArray.push({name:'$name',visibility:$visibility,gesture:$gesture,image:'$image'});";
        }

        echo "temp_img = '".$img."' ;";    
        echo "imgBase = '".$imgBase."' ;";    
        echo "id_frame = '".$frame->getAttribute('id_frame')."' ;";    
        echo "activeTime = '".$frame->getAttribute('activeTime')."' ;";    
        echo "gestureTime = '".$frame->getAttribute('gestureTime')."' ;";    
        echo "</script>";
        
        
    }
?>

        <script>
            var frame_format = <?php echo $storyboard->getAttribute("frame_format");?>;
        </script>

        <!--        <img id="cursor" src="img/mycursor.png" />-->

        <div id='alertWaiting' class='alertRemove' style='visibility:hidden'>
        </div>


        <div id="mainEdit">
            <div id="maineditcontainer">
                <nav>
                    <button onclick="returnEditStoryboard(<?php echo $_GET['st']?>)"><img src='img/ic_arrow_back_white_24px.svg' /></button>

                    <form method="post" name='sendImageForm' id='sendImageForm' action='controller.php'>
                        <input type="hidden" name="file" id="file" />
                        <input type="hidden" name="numFrame" id="numFrame" />
                        <input type='hidden' name='command' value='saveImageStoryboard' />
                        <input type='hidden' name='id_storyboard' value='<?php echo $storyboard->getAttribute("id_storyboard")?>' />

                    </form>
                    <button onclick='saveImage()'><img src='img/ic_send_white_24px.svg' /></button>
                </nav>
                <div id="canvasArea"></div>
            </div>
            <div id="toolsdiv">
                <h3>Camadas <img src="img/ic_add_layer.svg" id="addLayer" /></h3>
                <section id="layers">
                </section>
                <h3>Ferramentas</h3>
                <section id="tools">
                    <img id="tool0" alt="tool0" src="img/tool0b.png" />
                    <img id="tool1" alt="tool1" src="img/tool1b.png" />
                    <img id="tool2" alt="tool2" src="img/tool2b.png" />
                    <img id="tool3" alt="tool3" src="img/tool3b.png" />
                </section>

                <section id="settings">
                    
                    
                    <p id="cholder">
                        <input type="checkbox" id="picker"/><label for="picker"><i class="material-icons">colorize</i></label>
                        <span id="fgbg"><button id="fgcolor" class="jscolor {valueElement:null,value:'000000',onFineChange:'changeColor(this)'}" onchange="changeColor(this.jscolor)" value="000000" onchange="changeColor(this.jscolor)"></button></span>

                    </p>
                    <p style="padding-top: 20px;">
                        <img src="img/ic_adjust_black_24px.svg" class="licon" />
                        <input type="number" id="bsize" min="5" onchange="changeSize()" />
                        <img src="img/ic_opacity_black_24px.svg" class="licon" />
                        <input type="number" id="balpha" min="0" max="1" value="1" step="0.01" onchange="changeAlpha()" />
                    </p>

                    <div id="brushBox">
                        <img id="brushImg" src="img/brush/brush1.png" />
                    </div>

                </section>

                <h3>Configurações</h3>
                <section id="framesettings">
                    <form>
                        <p>
                            Duração do quadro:
                            <br>
                            <input type="number" id="fdur" name="duration" value="<?php 
    
                                echo (isset($frame) && $frame->getAttribute('id_frame') > 0)?$frame->getAttribute('duration'):'5';
                                                                                  
                                                                                  ?>" />
                        </p>
                    </form>
                </section>
            </div>
        </div>

        <script>
            //            startDraw(frame_format);

            function returnEditStoryboard(id) {
                window.location = "home.php?menu=edit_storyboard&id=" + id;
            }
        </script>
</body>

</html>