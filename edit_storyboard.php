<script type="text/javascript" src="js/croquis_cacique.js"></script>
<script type="text/javascript" src="js/edit_frame.js"></script>

<script>
    var frame_format = 1;
    var id_storyboard;
    var username;
    var selectedFrame;
    var menu = true;
    var FPS = 1000 / 30;
    var posX = 0,
        posY = 0;
    var pivotX, pivotY;
    var pX = [];
    var pY = [];
    var buttons = [];
    var text = "";
    var isClicking = false;
    var color = "#000";
    var selectedColor = 23;
    var colors = ["#0da58e", "#8cc152", "#cdda49", "#fdc02f", "#fd9727", "#fc5830", "#e2202c", "#e62565", "#9b2fae", "#673fb4", "#4054b2", "#587bf8",
                 "#fff", "#ececec", "#d9d9d9", "#c6c6c6", "#b3b3b3", "#a0a0a0", "#8d8d8d", "#7a7a7a", "#676767", "#545454", "#414141", "#000"];

    var selectedBut = 1;

    var lineWidth = 1;

    window.onload = function () {
        resize();
        document.getElementById('hideMenu').addEventListener('click', showMenu, false);

        //document.getElementById("butdraw").addEventListener("click", openDrawCanvas, true);
    }


    function showMenu(event) {
        if (menu === true) {
            menu = false;
            document.getElementById('storyboardOptions').style.left = "-52px";
            document.getElementById('hideimg').src = "img/ic_keyboard_arrow_right_gray_24px.svg";
            document.getElementById('add_frame').style.left = "200px";
            document.getElementById('storyboardMain').style.left = "190px";
            document.getElementById('deleteStoryboard').style.left = "170px";
        } else {
            menu = true;
            document.getElementById('storyboardOptions').style.left = "170px";
            document.getElementById('hideimg').src = "img/ic_keyboard_arrow_left_gray_24px.svg";
            document.getElementById('add_frame').style.left = "420px";
            document.getElementById('storyboardMain').style.left = "410px";
            document.getElementById('deleteStoryboard').style.left = "390px";
        }
        resize();
    }

    function resize() {
        var main = document.getElementById("storyboardMain");
        var size;
        if (menu === true) size = 100 - ((document.getElementById("asideMenu").offsetWidth + document.getElementById("storyboardOptions").offsetWidth) / window.innerWidth) * 100 - 1;
        else size = 100 - (document.getElementById("asideMenu").offsetWidth / window.innerWidth) * 100 - 1;
        main.style.width = size + "%";
        document.getElementById('deleteStoryboard').style.width = (size + 1) + "%";
        document.getElementById('deleteStoryboard').style.visibility = "hidden";
        document.getElementById('hideMenu').style.height = document.getElementById('storyboardOptions').offsetHeight + "px";
        document.getElementById('storyboardOptions').offsetHeight / 2 + "px";

        var editSection = document.getElementById('editSection');

        var main_edit = document.getElementById('main_edit');
        main_edit.style.width = (window.innerWidth - document.getElementById("asideMenu").offsetWidth) / window.innerWidth * 100 + "%";

        //        context = canvas.getContext('2d');
        //        canvas.height = editSection.offsetWidth / 3;
        //        if (frame_format == 1) canvas.width = canvas.height * 4 / 3;
        //        else canvas.width = canvas.height * 16 / 9;
        //        width = canvas.offsetWidth;
        //        height = canvas.offsetHeight;    
        //        
        //        document.getElementById('editOptions').style.height = canvas.height + "px";



    }

    function returnEditStoryboard() {
        var editSection = document.getElementById('editSection');
        editSection.style.visibility = "hidden";
        editSection.children[1].children[0].style.visibility = "hidden";
        editSection.children[0].children[1].style.visibility = "hidden";
        for (i = 0; i < 24; i++) {
            document.getElementById("color" + i).children[0].style.visibility = "hidden";
        }
    }

    function resizeFrames(ff) {
        frame_format = ff;
        var el = document.getElementById("add_frame");
        if (ff == 1) el.className = "ff_4_3";
        else el.className = "ff_16_9";

    }

    var cont = 0;
    var frames = [];

    function addFrame(img) {
        var main = document.getElementById("storyboardMain");
        var str = main.innerHTML;

        var estilo = "";
        if (img != '') estilo = "style='background-color:#fff; background-image:url(" + img + "); background-size: 100% 100%;'";

        str += "<div id='div" + cont + "' ondrop='drop(event)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event)' class='frame " + ((frame_format == 1) ? "ff_4_3" : "ff_16_9") + "' onmousedown='showTrash()' onmouseup='hideTrash()' " + estilo + "><div class='frame_num' id='num" + cont + "'>" + cont + "</div>" +
            "</div>";
        main.innerHTML = str;
        frames.push("num" + cont);
        cont++;
        reorder(0);
    }


    function hideTrash() {
        document.getElementById('deleteStoryboard').style.visibility = "hidden";
    }

    function showTrash() {
        resize();
        document.getElementById('deleteStoryboard').style.visibility = "visible";
    }


    var e1, e2, t1, t2, i1, i2;

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        e1 = ev.target;
        t1 = e1.parentElement;
        i1 = Array.prototype.indexOf.call(t1.children, e1);
        console.log(i1);
    }

    function drop(ev) {
        ev.preventDefault();
        e2 = ev.target;
        t2 = e2.parentElement;
        i2 = Array.prototype.indexOf.call(t2.children, e2);

        if (i1 > i2) t2.insertBefore(e1, t2.children[i2]);
        else t2.insertBefore(e1, t2.children[i2 + 1]);

        reorder(1);
        hideTrash();
    }

    function reorder(type) {
        var main = document.getElementById("storyboardMain");
        var updateArray = [];
        
        for (i = 0; i < main.children.length; i++) {
            var e = main.children[i].children[0];
            
            e.innerHTML = '' + (i + 1);
            e.id = "num" + i;

            main.children[i].id = "div" + i;
            main.children[i].removeEventListener("click", clickFrame);
            main.children[i].addEventListener("click", clickFrame, true);

            if (main.children[i].style.backgroundImage != null && main.children[i].style.backgroundImage != '') {
                var str = main.children[i].style.backgroundImage.split("url(\"")[1].split("\")")[0];
                var data = str.split("/");
                str = data[data.length - 1];
                updateArray.push([(i + 1), str]);
            }

        }
        if (type == 1 && updateArray.length > 0) {

            var parameters = "data=";
            for (i = 0; i < updateArray.length; i++) {
                parameters += "[" + updateArray[i][0] + "," + updateArray[i][1] + "]";
            }

            window.location = "controller.php?command=updateStoryboardFrames&id_storyboard=" + id_storyboard + "&" + parameters;

        }
        cont = main.children.length;
    }

    function clickFrame() {
        editFrame(event.target.id.split('div')[1]);
    }

    function openDrawCanvas() {
        var editSection = document.getElementById('editSection');
        editSection.style.visibility = "visible";

                editSection.children[1].children[0].style.visibility = "hidden";
                editSection.children[0].children[1].style.display = "none";
                editSection.children[0].children[2].style.display = "block";
    }

    function editFrame(frame) {
        selectedFrame = frame;
        window.location = "home.php?menu=edit_frame&st=" + id_storyboard + "&f=" + frame;



        //        var editSection = document.getElementById('editSection');
        //        editSection.style.visibility = "visible";
        //        editSection.children[1].children[0].style.visibility = "visible";
        //        editSection.children[0].children[1].style.display = "block";
        //        editSection.children[0].children[2].style.display = "none";
        //        document.getElementById("frame_num").innerHTML = parseInt(frame) + 1;

        //        if (!isFrameVoid(frame)) {
        //            var str = document.getElementById('div' + frame).style.backgroundImage.split("url(\"")[1].split("\")")[0];
        //            var canvas = document.getElementById('canvas');
        //            var ctx = canvas.getContext('2d');
        //            var img = new Image();
        //            img.src = str;
        //            img.onload = function () {
        //                ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        //                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * img.width / canvas.width, img.height * img.height / canvas.height);
        //            }
        //        }


    }

    function drop2(ev) {
        var main = document.getElementById("storyboardMain");
        frames.splice(frames.indexOf("num" + e1.id.split('div')[1]), 1);
        t1.removeChild(t1.childNodes[i1]);

        var img = e1.style.backgroundImage.split("/");
        var imgname = img[img.length - 1].split("\")")[0];

        window.location = "controller.php?command=removeFrame&image=" + imgname + "&id_storyboard=" + id_storyboard;
    }



    function isFrameVoid(frame) {
        var el = document.getElementById('div' + frame);
        if (el != null && el.style.backgroundImage == null || el.style.backgroundImage == '') return true;
        else return false;
    }

    function gotoPrint() {
        var url = "print_storyboard.php?id_storyboard=" + id_storyboard;
        var win = window.open(url, '_blank');
        win.focus();
    }

    function gotoPlay() {
        var url = "player/index.html?user="+username+"&id=" + id_storyboard;
        var win = window.open(url, '_blank');
        win.focus();
    }
</script>

<?php
    require_once("php/storyboard/storyboard.php");
    require_once("php/storyboard/storyboardDAO.php");
    require_once("php/user/user.php");
    require_once("php/user/userDAO.php");
    require_once("php/frame/frame.php");
    require_once("php/frame/frameDAO.php");

    if(isset($_GET['id'])) $id=$_GET['id'];
    else header('Location: home.php?menu=storyboards');

    $storyboard = readStoryboardById($id);
    echo "<script>id_storyboard = ".$storyboard->getAttribute('id_storyboard')."</script>";
    echo "<script>username = '".$_SESSION['user'][0]->getAttribute('username')."'</script>";
    $cover = $storyboard->getAttribute('avatar');
    if($cover=='') $cover = 'img/america.png';
    
?>

    <h1><?php echo $storyboard->getAttribute('title') ?></h1>
    <section id='storyboardOptions'>
        <div id="hideMenu"><img id="hideimg" src='img/ic_keyboard_arrow_left_gray_24px.svg' /></div>
        <img alt='cover' src='<?php echo $cover?>' class='cover' />
<!--
        <p>Cover:
            <br>
            <button id="butdraw" disabled>DRAW YOUR COVER</button>
            <input type='hidden' name='avatar' value='<?php echo $storyboard->getAttribute("avatar") ?>' />
        </p>
-->
        <form action='controller.php' method="post">

            <p>Título:
                <br>
                <input type='text' name='title' value='<?php echo $storyboard->getAttribute("title") ?>' />
            </p>
            <p>Descrição:
                <br>
                <textarea name='description'><?php echo $storyboard->getAttribute('description') ?></textarea>
            </p>
            <input type="hidden" name="command" value="editStoryboard" />
            <input type="hidden" name="fps" value="24" />
            <input type="hidden" name="id_storyboard" value="<?php echo $storyboard->getAttribute('id_storyboard') ?>" />
            <p>Formato:
                <br>
                <select name="frame_format">
                    <option value="1" <?php if($storyboard->getAttribute('frame_format')==1) echo "selected" ?>>4:3</option>
                    <option value="2" <?php if($storyboard->getAttribute('frame_format')==2) echo "selected" ?>>16:9</option>
                </select>
            </p>
            <p><small>Última atualização: <?php echo $storyboard->getAttribute('lastupdate') ?></small></p>
            <p>
                <input type='submit' value='ATUALIZAR' />
            </p>
        </form>
        <div id='optionsControl'>
            <button class='butSmall' onclick='gotoPrint()'><img src="img/ic_local_printshop_white_24px.svg" alt='print' /></button>
            <button class='butSmall' onclick='gotoPlay()'><img src="img/ic_ondemand_video_white_24px.svg" alt='print' /></button>
        </div>
    </section>
    <div id="add_frame" onclick="addFrame('')">

    </div>
    <?php echo "<script type='text/javascript'>resizeFrames(".$storyboard->getAttribute('frame_format').")</script>";?>
        <section id='storyboardMain'>

        </section>
        <?php
                $frames = $storyboard->getAttribute('frames');
                
                $frame_format = $storyboard->getAttribute('frame_format');

                for($i=0; $i<sizeof($frames); $i++){
                    
//                    $username = $_SESSION['user'][0]->getAttribute('username');
                    $username = $storyboard->getAttribute('user')->getAttribute('username');
                    $story = $username.$storyboard->getAttribute('id_storyboard');
                    $img = $frames[$i]->getAttribute('image');
                    echo "<script>
                            addFrame('users/$username/storyboards/$story/$img');
                          </script>";    
                }
            
            ?>
            <div id='deleteStoryboard' ondrop='drop2(event)' ondragover='allowDrop(event)'>
                <img alt='delete' src="img/ic_delete_black_24px.svg" />
            </div>

            <section id='editSection' style="visibility:hidden">
                <nav>
                    <button onclick='returnEditStoryboard()'><img src='img/ic_arrow_back_white_24px.svg' /></button>
                    <form method="post" name='sendImageForm' action='controller.php'>
                        <input type="hidden" name="file" id="file" />
                        <input type="hidden" name="numFrame" id="numFrame" />
                        <input type='hidden' name='command' value='saveImageStoryboard' />
                        <input type='hidden' name='id_storyboard' value='<?php echo $storyboard->getAttribute("id_storyboard")?>' />
                        <button onclick='saveImage()'><img src='img/ic_send_white_24px.svg' /></button>
                    </form>
                    <form method="post" name='sendCoverForm' action='controller.php'>
                        <input type="hidden" name="file" id="file" />
                        <input type='hidden' name='command' value='saveCoverStoryboard' />
                        <input type='hidden' name='id_storyboard' value='<?php echo $storyboard->getAttribute("id_storyboard")?>' />
                        <button onclick='saveCover()'><img src='img/ic_sd_storage_white_24px.svg' /></button>
                    </form>
                </nav>
                <div id="main_edit">
                    <div id="canvas-area"></div>
                </div>
            </section>