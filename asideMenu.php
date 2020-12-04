<aside id="asideMenu">
    <img id="avatar" alt="avatar" src="img/<?php echo $user->getAttribute("avatar")?>" />
    <p class="username">
        <?php 
            echo $username;
            ?>
    </p>
    <hr>
    <nav>
        <ul>
            <a href="home.php?menu=profile"><li <?php if($selectedMenu=="profile") echo "class='selected'";?>>Perfil</li></a>
            <a href="home.php?menu=dashboard"><li <?php if($selectedMenu=="dashboard") echo "class='selected'";?>>Estatísticas</li></a>
            <a href="home.php?menu=storyboards"><li <?php if($selectedMenu=="storyboards" || $selectedMenu=="edit_storyboard") echo "class='selected'";?>>Storyboards</li></a>
            
<!--
            <a href="home.php?menu=team"><li <?php if($selectedMenu=="team") echo "class='selected'";?>>Equipe</li></a>
            <a href="home.php?menu=settings"><li <?php if($selectedMenu=="settings") echo "class='selected'";?>>Configurações</li></a>
-->
            
            <a href="home.php?menu=bugs"><li <?php if($selectedMenu=="bugs") echo "class='selected'";?>>Reporte um BUG</li></a>
            <a href="home.php?menu=sendform"><li <?php if($selectedMenu=="sendform" || $selectedMenu=="questionario") echo "class='selected'";?>>Finalizar Pesquisa</li></a>
            
            <?php
                if($user->getAttribute("usertype")==0){
                    echo "<a href='home.php?menu=codes'><li ".( ($selectedMenu=="codes")?"class='selected'":""  ).">Códigos de Acesso</li></a>";
                }
            ?>
            
        </ul>
        <a href="controller.php?command=logout">
            <button id="butLogout">SAIR</button>
        </a>
    </nav>

</aside>