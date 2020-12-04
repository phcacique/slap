<style type="text/css">
    article {
        background-color: #fff;
        border: 1px solid #c0c0c0;
        padding: 20px;
        text-align: justify;
    }
    
    #cont {
        display: flex;
        flex-flow: column nowrap;
        overflow: auto;
        height: 100%;
        margin: 0 auto;
        font-weight: 100;
    }
    
    #check {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    #check div {
        margin: 10px;
    }
</style>
<div id="cont">
    <h1>Termo de Consentimento Livre e Esclarecido</h1>
    <article>
        <p><b>Título da Pesquisa:</b> SLAP – Storyboard Language for Animation Programming</p>
        <p><b>Pesquisador  Principal:</b> Prof. Me. Pedro Henrique Cacique Braga</p>
        <p><b>Orientador:</b> Prof. Dr. Ismar Frango Silveira</p>

        <p><b>Natureza da pesquisa:</b> o sra (sr.) está sendo convidada (o) a participar desta pesquisa que tem como finalidade validar a escolha dos símbolos da gramática proposta; verificar a necessidade e a aceitação da linguagem SLAP, bem como a sua ferramenta de edição; verificar a possível otimização do processo de pré-produção de animações; verificar a curva de aprendizado da linguagem proposta e as tendências de interação com a ferramenta de edição; comparar o tempo gasto na produção de um storyboard com e sem a linguagem SLAP.</p>
        <p><b>Participantes da pesquisa:</b> A pesquisa será realizada em grupos de 2 a 3 participantes, divididos em três categorias: estudantes de cursos relacionados à produção de animações, estudantes de computação e profissionais da pré-produção fílmica.</p>
        <p><b>Envolvimento na pesquisa:</b> ao participar deste estudo a sra (sr) permitirá que o (a) pesquisador utilize o material produzido manualmente e com a fermenta digital, bem como todo o áudio gravado e sua transcrição durante a entrevista em grupo. Todo material será vinculado apenas aos artigos e à tese gerados e não serão divulgados os seus dados pessoais.</p>
        <p>A sra (sr.) tem liberdade de se recusar a participar e ainda se recusar a continuar participando em qualquer fase da pesquisa, sem qualquer prejuízo para a sra (sr.). Sempre que quiser poderá pedir mais informações sobre a pesquisa através do email do pesquisador do projeto e, se necessário através do telefone do Programa de Pós-Graduação em Engenharia Elétrica e Computação da Universidade Presbiteriana Mackenzie. </p>
        <p><b>Sobre as entrevistas:</b> As entrevistas serão realizadas em grupos de 2 ou 3 participantes, com gravação de áudio e, posteriormente, será realizada a sua transcrição para anexos do trabalho principal de doutoramento do pesquisador. Após a entrevista, será solicitado que a sra (sr.) desenvolva um storyboard manualmente com base em um roteiro pré-determinado e, em seguida, que crie um outro documento usando a ferramenta de edição proposta, seguindo o mesmo roteiro. Ao final, será solicitado o preenchimento de um formulário com perguntas sobre a experiência. </p>
        <p><b>Riscos e desconforto:</b> a participação nesta pesquisa não traz complicações legais. Nenhum dos procedimentos usados oferece riscos à sua dignidade e é garantido o anonimato na divulgação dos dados obtidos.</p>
        <p><b>Confidencialidade:</b> todas as informações coletadas neste estudo são estritamente confidenciais. Somente o (a) pesquisador (a) e o (a) orientador (a) terão conhecimento dos dados. O material produzido poderá ser divulgado em artigos acadêmicos e na tese de doutorado do pesquisador, de forma garantir o anonimato do entrevistado.</p>
        <p><b>Benefícios:</b> ao participar desta pesquisa a sra (sr.) não terá nenhum benefício direto. Entretanto, esperamos que este estudo traga informações importantes sobre a pré-produção de animações em curta e longa metragem, de forma que o conhecimento que será construído a partir desta pesquisa possa contribuir para sua carreira profissional e/ou acadêmica. O pesquisador se compromete a divulgar os resultados obtidos. </p>
        <p><b>Pagamento:</b> a sra (sr.) não terá nenhum tipo de despesa para participar desta pesquisa, bem como nada será pago por sua participação.</p>


    </article>

    <form>
        <div id="check">
            <div>
                <input type="checkbox" name="consentimento" id="consentimento" />
                <label for="consentimento"><span id="cb"></span></label>
            </div>
            <div>
                Tendo em vista os itens acima apresentados, eu, de forma livre e esclarecida, manifesto meu consentimento em participar da pesquisa. Declaro que recebi cópia deste termo de consentimento, e autorizo a realização da pesquisa e a divulgação dos dados obtidos neste estudo.
            </div>
        </div>
        <p>
            <button onclick="event.preventDefault(); sendform();">ENVIAR</button>
        </p>
    </form>

</div>
<div id='alertWaiting' class='alertRemove' style='visibility:hidden'>
</div>

<script type="text/javascript">
    function sendform() {
        if (document.getElementById("consentimento").checked == false)
            showAlert("Aceite os termos de consentimento para continuar.");
        else {
            <?php
            $_SESSION['termo_checked'] = true;
            ?>
            window.location = "home.php?menu=questionario";
        }
    }

    function showAlert(message) {
        if (message == null) message = MSG1;
        document.getElementById('alertWaiting').style.visibility = 'visible';
        var msg = "<div><p>" + message + "</p>";

        msg += "<div><button class = 'cancelButton' onclick = 'hideAlert()'> Fechar </button>  </div>";

        msg += "</div>";
        document.getElementById('alertWaiting').innerHTML = msg;
    }

    function hideAlert() {
        document.getElementById('alertWaiting').style.visibility = 'hidden';
    }
</script>