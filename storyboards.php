<?php
    require_once("php/post/post.php");
    require_once("php/post/postDAO.php");
    require_once("php/storyboard/storyboard.php");
    require_once("php/storyboard/storyboardDAO.php");
?>
    <h1>Storyboards</h1>
    <div class="storyContainer">
        <div class="topo">
            <button><img src="img/ic_mail_outline_white_24px.svg" /></button>
        </div>
        <div class="storyMsgContainer">

            <div class="msgArea">
                <form id="msg" action="controller.php" method="post">
                    <textarea placeholder="Adicione um lembrete" name="text" id="text" rows="2"></textarea>
                    <input type="hidden" name="command" value="post" />
                    <input type="submit" style="display:none" />
                </form>
                <div class="tri_right"></div>
                <img alt="avatar" class="av" src="<?php echo 'img/'.$user->getAttribute('avatar') ?>" />
            </div>
            <script>
                document.getElementById("text").addEventListener("keyup", onKeyUp, false);

                function onKeyUp(event) {
                    if (event.keyCode == 13) document.getElementById("msg").submit();
                }
            </script>

            <?php
            $posts = readPostByUser($_SESSION['user'][0]);
            for($i=0; $i<sizeof($posts); $i++){
                $user = $posts[$i]->getAttribute('user');
                echo "<article class='mymsg'>
            <img alt='avatar' class='av' src='img/".$user->getAttribute('avatar')."' />
            <div>
                <p>".$posts[$i]->getAttribute('text')."</p>
                <small>".$posts[$i]->getAttribute('postdate')."</small>
            </div>
            <div class='remove'>
                <a href='controller.php?command=removePost&id=".$posts[$i]->getAttribute('id_post')."'><img alt='remove' src='img/ic_highlight_off_black_24px.svg'/></a>
            </div>
        </article>";
            }
        ?>



                <div class="clear"></div>
        </div>
        <div class="storyMainContainer">
            <article>
                <div>
                    <h2>+ Storyboard</h2>
                    <form action="controller.php" method="post">
                        <p>Título:
                            <br>
                            <input type="text" name="title" required minlength='5' />
                        </p>
                        <p>Descrição:
                            <br>
                            <textarea name="description" required></textarea>
                        </p>
                        <input type="hidden" name="command" value="createStoryboard" />
                        <p>
                            <input type="submit" value="CRIAR" />
                        </p>
                    </form>
                </div>
            </article>

            <?php 
            if($user->getAttribute('usertype')==0){
                echo "<article>
                <div>
                    <h2>Buscar <i>Storyboard</i></h2>
                    <form action='controller.php' method='post'>
                        <p>Usuário:
                            <br>
                            <select name='user'>";
                                
                                    $users = readAllUsers();
                                    for($i=0; $i<sizeof($users); $i++){
                                        echo "<option value='".$users[$i]->getAttribute('username')."' ". ( ( ( !isset($_GET['user']) && $users[$i]->getAttribute('id_appuser') == $user->getAttribute('id_appuser') )  || ( isset($_GET['user']) && $users[$i]->getAttribute('username') == $_GET['user']) )?"selected":""  ) ." >".$users[$i]->getAttribute('username')."</option>";
                                    }
                                
                            echo "</select>
                        </p>
                        
                        <input type='hidden' name='command' value='searchStoryboardAnotherUser' />
                        <p>
                            <input type='submit' value='BUSCAR' />
                        </p>
                    </form>
                </div>
            </article>"; 
            }
               
                ?>



                <?php
                if(isset($_GET['user'])) {
                    $u = readUserByUsername($_GET['user']);
                    $u = $u[0];
                    $storyboards = readStoryboardsByUser($u);
                }
                else $storyboards = readStoryboardsByUser($_SESSION['user'][0]);
                for($i=0; $i<sizeof($storyboards); $i++){
                    $user = $storyboards[$i]->getAttribute('user');
                    $description = $storyboards[$i]->getAttribute('description');
                    if(strlen($description)> 140) $description = substr($description, 0, 140)." ...";
                    
                    $img = 'img/america.png';
                    if( $storyboards[$i]->getAttribute('avatar') != null ) $img = $storyboards[$i]->getAttribute('avatar');
                    echo "<article>
                            <a href='home.php?menu=edit_storyboard&id=".$storyboards[$i]->getAttribute('id_storyboard')."'><section>
                            <img class='cover' src='$img' alt='cover' />
                            <div>
                                <h2>".$storyboards[$i]->getAttribute('title')."</h2>
                                <p>".$description."</p>
                                <small>Última atualização: ".$storyboards[$i]->getAttribute('lastupdate')."</small>
                            </div>
                            </section></a>
                            <img onclick='verifyRemove(".$storyboards[$i]->getAttribute('id_storyboard').")' class='remove' alt='remove' src='img/ic_highlight_off_black_24px.svg'/>
                        </article>";
                }
            ?>

        </div>
    </div>

    <div id='alertRemove' class='alertRemove' style='visibility:hidden'>
        <div>
            <p>Você tem certeza que deseja remover este Storyboard?</p>
            <p>Esta ação não poderá ser desfeita!</p>
            <div>
                <button class="cancelButton" onclick="cancelAlert()">NÃO</button>
                <button onclick='removeStoryboard()'>SIM</button>
            </div>
        </div>
    </div>

    <script type="application/javascript">
        var id;

        function verifyRemove(temp) {
            id = temp;
            document.getElementById('alertRemove').style.visibility = 'visible';
        }

        function cancelAlert() {
            document.getElementById('alertRemove').style.visibility = 'hidden';
        }

        function removeStoryboard() {
            window.location = 'controller.php?command=removeStoryboard&id=' + id;
        }
    </script>