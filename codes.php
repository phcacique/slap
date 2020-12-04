<?php
    require_once "php/code/code.php";
    require_once "php/code/codeDAO.php";

    if($user->getAttribute('usertype')!=0){
        header("Location: index.php");
    }

    $c = "";
    $q = "";
    if(isset($_GET['id'])){
        $code = readCodeById($_GET['id'])[0];
        $c = $code->getAttribute('code');
        $q = $code->getAttribute('total_users');
    }
?>

<h1>Códigos de Acesso</h1>
<section id="profile_main">
    <form action="controller.php" method="post" id='redeemform'>
        <div>
            <p>
                <input type="text" name="code" placeholder="código" value="<?php echo $c?>"/>
            </p>
            <p>
                <input type="number" name="quant" placeholder="número de usuários" value="<?php echo $q?>" />
            </p>
        </div>
        <input type="hidden" name="command" value="<?php echo (!isset($_GET['id']))?"insertCode":"updateCode"  ?>"/>
        <?php if(isset($_GET['id'])) echo "<input type='hidden' name='id' value='".$_GET['id']."'/>"?>
        <p>
            <button><img alt='add' src='<?php echo (!isset($_GET['id']))?'img/ic_add_circle_white.svg':'img/ic_create_white.svg' ?>' /></button>
        </p>
    </form>

    <table style='width: 50%'>
        <thead>
            <tr>
                <th></th>
                <th>Código</th>
                <th>Número de usuários</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            
            <?php
                $codes = readAllCodes();
                foreach($codes as $code){
                    echo "<tr>
                            <td>".$code->getAttribute('id_redeem_code')."</td>
                            <td>".$code->getAttribute('code')."</td>
                            <td>".$code->getAttribute('total_users')."</td>
                            <th><img alt='edit' src='img/ic_create_black_24px.svg' class='tableButton' onclick='editCode(".$code->getAttribute('id_redeem_code').")'/></th>
                            <th><img alt='remove' src='img/ic_delete_black_24px.svg' class='tableButton' onclick='removeCode(".$code->getAttribute('id_redeem_code').")' /></th>
                        </tr>";
                }
            ?>
            
        </tbody>
    </table>


</section>

<script type="text/javascript">
    function removeCode(id){
        window.location = "controller.php?command=removeCode&id="+id;
    }
    
    function editCode(id){
        window.location = "controller.php?command=editCode&id="+id;
    }
</script>