<?php
    require_once("php/user/user.php");
    require_once("php/user/userDAO.php");
    $user = $_SESSION['user'][0];
    $avatarRadio = $user->getAttribute('avatar');
?>

    <h1>Perfil</h1>
    <section id="profile_main">
        <form action="controller.php" method="post">
            <div id="avatars">
                <input type="radio" name="r_avatar" value="avatar1.png" id="ra1" checked/>
                <label for="ra1"><img alt="ra1" src="img/avatar1.png" /></label>

                <input type="radio" name="r_avatar" value="avatar2.png" id="ra2" />
                <label for="ra2"><img alt="ra2" src="img/avatar2.png" /></label>

                <input type="radio" name="r_avatar" value="avatar3.png" id="ra3" />
                <label for="ra3"><img alt="ra2" src="img/avatar3.png" /></label>

                <input type="radio" name="r_avatar" value="avatar4.png" id="ra4" />
                <label for="ra4"><img alt="ra4" src="img/avatar4.png" /></label>

                <input type="radio" name="r_avatar" value="avatar5.png" id="ra5" />
                <label for="ra5"><img alt="ra5" src="img/avatar5.png" /></label>

                <input type="radio" name="r_avatar" value="avatar6.png" id="ra6" />
                <label for="ra6"><img alt="ra6" src="img/avatar6.png" /></label>

            </div>
            <p>
                <input type="text" name="username" placeholder="nome de usuário" required pattern=".{5,20}" title="5 to 20 characters" disabled value="<?php echo $user->getAttribute('username')?>" />
            </p>
            <p>
                <input type="password" name="password" placeholder="senha" required pattern=".{7,}" title="minimum 7 characters" autofocus />
            </p>
            <p>
                <input type="password" name="password2" placeholder="confirme a senha" pattern=".{7,}" title="minimum 7 characters" required/>
            </p>
            <p>
                <input type="text" name="fullname" placeholder="nome completo" required value="<?php echo $user->getAttribute('fullname')?>" />
            </p>
            <p>
                <input type="email" name="email" placeholder="email" required disabled value="<?php echo $user->getAttribute('email')?>" />
            </p>
            <input type="hidden" name="command" value="updateUser" />
            <p>
                <input type="submit" value="Atualizar" />
            </p>
            <?php 
                if(isset($_SESSION['erro'])){
                    echo "<p class='error'>".$_SESSION['erro']."</p>";
                    unset($_SESSION['erro']);
                }
            ?>
        </form>


        <script>
            var avatar = "<?php echo $avatarRadio?>";
            document.getElementById("ra" + avatar.split(".")[0].split("avatar")[1]).setAttribute("checked", true);
        </script>

    </section>