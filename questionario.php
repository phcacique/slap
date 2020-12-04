<?php
    if(!isset($_SESSION['termo_checked']))
        header('location: home.php?menu=sendform');
?>

    <style type="text/css">
        #container2 {
            overflow: auto;
            height: 100%;
        }
        
        ol li {
            margin-bottom: 10px;
        }
        
        ul {
            padding: 0;
            margin-top: 10px;
        }
        
        ul li {
            list-style-type: none;
            display: flex;
            padding: 5px;
        }
        
        input[type="text"],
        textarea {
            width: calc(100% - 20px);
            padding: 5px;
            border: none;
            border: 1px solid #c0c0c0;
        }
        
        textarea {
            resize: none;
            height: 50px;
        }
        
        input[type=radio] {
            display: none;
        }
        
        input[type=radio] + label {
            width: 20px;
            height: 20px;
            border-radius: 100%;
            display: block;
            background-color: #d0d0d0;
            margin-right: 10px;
        }
        
        input[type=radio] + label span {
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            /*            background-color: #a0a0a0;*/
            transition: 0.5s all;
            position: relative;
            top: 5px;
            left: 5px;
        }
        
        input[type=radio]:checked + label span {
            background-color: #429994;
        }
    </style>
    <section id="container2">
        <h1>Pesquisa de opinião</h1>
        <p>Após a realização das tarefas solicitadas, responda o questionário abaixo.</p>
        <p>É importante que as perguntas sejam respondidas com sinceridade e precisão. Lembre-se: não há respostas corretas.</p>

        <form action="insertQuestions.php" method="post">
            <h2>Sobre você</h2>
            <ol>
                <li>Estúdio em que trabalha atualmente.
                    <p>
                        <input type="text" name="q1" />
                    </p>
                </li>
                <li>Há quanto tempo trabalha com animação?
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q2" id="q2a" value="a" />
                                <label for="q2a"><span></span></label>
                            </div>Não trabalho com animação</li>
                        <li>
                            <div>
                                <input type="radio" name="q2" id="q2b" value="b" />
                                <label for="q2b"><span></span></label>
                            </div>Menos de um ano</li>
                        <li>
                            <div>
                                <input type="radio" name="q2" id="q2c" value="c" />
                                <label for="q2c"><span></span></label>
                            </div>De 1 a 5 anos</li>
                        <li>
                            <div>
                                <input type="radio" name="q2" id="q2d" value="d" />
                                <label for="q2d"><span></span></label>
                            </div>De 5 a 10 anos</li>
                        <li>
                            <div>
                                <input type="radio" name="q2" id="q2e" value="e" />
                                <label for="q2e"><span></span></label>
                            </div>Mais de 10 anos</li>
                    </ul>
                </li>
                <li>Há quanto tempo trabalha específicamente com <i>Storyboards</i>?
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q3" id="q3a" value="a" />
                                <label for="q3a"><span></span></label>
                            </div>Não trabalho com animação</li>
                        <li>
                            <div>
                                <input type="radio" name="q3" id="q3b" value="b" />
                                <label for="q3b"><span></span></label>
                            </div>Menos de um ano</li>
                        <li>
                            <div>
                                <input type="radio" name="q3" id="q3c" value="c" />
                                <label for="q3c"><span></span></label>
                            </div>De 1 a 5 anos</li>
                        <li>
                            <div>
                                <input type="radio" name="q3" id="q3d" value="d" />
                                <label for="q3d"><span></span></label>
                            </div>De 5 a 10 anos</li>
                        <li>
                            <div>
                                <input type="radio" name="q3" id="q3e" value="e" />
                                <label for="q3e"><span></span></label>
                            </div>Mais de 10 anos</li>
                    </ul>
                </li>
                <li>Quais os principais estúdios onde você trabalhou?
                    <p>
                        <input type="text" name="q4" />
                    </p>
                </li>
                <li>Você está envolvido em outra área da produção de animação atualmente?
                    <p>
                        <input type="text" name="q5" />
                    </p>
                </li>
            </ol>

            <h2>Sobre o processo de criação do Stroyboard</h2>

            <ol start="6">
                <li>Na sua opinião, qual a importância do <i>storyboard</i>?
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q6" id="q6a" value="a" />
                                <label for="q6a"><span></span></label>
                            </div>Desnecessário</li>
                        <li>
                            <div>
                                <input type="radio" name="q6" id="q6b" value="b" />
                                <label for="q6b"><span></span></label>
                            </div>Pouco Importante</li>
                        <li>
                            <div>
                                <input type="radio" name="q6" id="q6c" value="c" />
                                <label for="q6c"><span></span></label>
                            </div>Importante</li>
                        <li>
                            <div>
                                <input type="radio" name="q6" id="q6d" value="d" />
                                <label for="q6d"><span></span></label>
                            </div>Muito Importante</li>
                        <li>
                            <div>
                                <input type="radio" name="q6" id="q6e" value="e" />
                                <label for="q6e"><span></span></label>
                            </div>Essencial</li>
                    </ul>
                </li>
                <li>Um <i>animatic</i> é mais importante que um <i>storyboard</i>.
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q7" id="q7a" value="a" />
                                <label for="q7a"><span></span></label>
                            </div>Discordo plenamente</li>
                        <li>
                            <div>
                                <input type="radio" name="q7" id="q7b" value="b" />
                                <label for="q7b"><span></span></label>
                            </div>Tendo a discordar</li>
                        <li>
                            <div>
                                <input type="radio" name="q7" id="q7c" value="c" />
                                <label for="q7c"><span></span></label>
                            </div>Não concordo nem discordo</li>
                        <li>
                            <div>
                                <input type="radio" name="q7" id="q7d" value="d" />
                                <label for="q7d"><span></span></label>
                            </div>Tendo a concordar</li>
                        <li>
                            <div>
                                <input type="radio" name="q7" id="q7e" value="e" />
                                <label for="q7e"><span></span></label>
                            </div>Concordo plenamente</li>
                    </ul>
                </li>
                <li>Quais as ferramentas utilizadas por você para criação?
                    <p>
                        <input type="text" name="q8" />
                    </p>
                </li>
                <li>A ferramenta usada para criação tem grande influência no resultado final.
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q9" id="q9a" value="a" />
                                <label for="q9a"><span></span></label>
                            </div>Discordo plenamente</li>
                        <li>
                            <div>
                                <input type="radio" name="q9" id="q9b" value="b" />
                                <label for="q9b"><span></span></label>
                            </div>Tendo a discordar</li>
                        <li>
                            <div>
                                <input type="radio" name="q9" id="q9c" value="c" />
                                <label for="q9c"><span></span></label>
                            </div>Não concordo nem discordo</li>
                        <li>
                            <div>
                                <input type="radio" name="q9" id="q9d" value="d" />
                                <label for="q9d"><span></span></label>
                            </div>Tendo a concordar</li>
                        <li>
                            <div>
                                <input type="radio" name="q9" id="q9e" value="e" />
                                <label for="q9e"><span></span></label>
                            </div>Concordo plenamente</li>
                    </ul>
                </li>
                <li>O processo de criação é melhor desenvolvido em grupo.
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q10" id="q10a" value="a" />
                                <label for="q10a"><span></span></label>
                            </div>Discordo plenamente</li>
                        <li>
                            <div>
                                <input type="radio" name="q10" id="q10b" value="b" />
                                <label for="q10b"><span></span></label>
                            </div>Tendo a discordar</li>
                        <li>
                            <div>
                                <input type="radio" name="q10" id="q10c" value="c" />
                                <label for="q10c"><span></span></label>
                            </div>Não concordo nem discordo</li>
                        <li>
                            <div>
                                <input type="radio" name="q10" id="q10d" value="d" />
                                <label for="q10d"><span></span></label>
                            </div>Tendo a concordar</li>
                        <li>
                            <div>
                                <input type="radio" name="q10" id="q10e" value="e" />
                                <label for="q10e"><span></span></label>
                            </div>Concordo plenamente</li>
                    </ul>
                </li>
                <li>Nos estúdios que trabalhou/trabalha, há diferença entre os modelos adotados?
                    <p>
                        <input type="text" name="q11" />
                    </p>
                </li>
                <li>Quais outros documentos são gerados na pré-produção do filme?
                    <p>
                        <input type="text" name="q12" />
                    </p>
                </li>
            </ol>

            <h2>Sobre o processo de criação do Storyboard</h2>

            <ol start="13">
                <li>Existe um tamanho adequado, em número de quadros, para o documento?
                    <p>
                        <input type="text" name="q13" />
                    </p>
                </li>
                <li>O uso de cores beneficia o entendimento do storyboard?
                    <p>
                        <input type="text" name="q14" />
                    </p>
                </li>
                <li>Desenhos mais detalhados são sinônimos de melhor compreensão da cena?
                    <p>
                        <input type="text" name="q15" />
                    </p>
                </li>
                <li>Existe um padrão adequado para o desenvolvimento? Se sim, qual?
                    <p>
                        <input type="text" name="q16" />
                    </p>
                </li>
                <li>Os símbolos utilizados, são usados frequentemente para representar:
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q17" id="q17a" value="a" />
                                <label for="q17a"><span></span></label>
                            </div>troca de cenário</li>
                        <li>
                            <div>
                                <input type="radio" name="q17" id="q17b" value="b" />
                                <label for="q17b"><span></span></label>
                            </div>movimento do personagem</li>
                        <li>
                            <div>
                                <input type="radio" name="q17" id="q17c" value="c" />
                                <label for="q17c"><span></span></label>
                            </div>ângulo e posicionamento de câmera</li>
                        <li>
                            <div>
                                <input type="radio" name="q17" id="q17d" value="d" />
                                <label for="q17d"><span></span></label>
                            </div>mudanças de planos de filmagem</li>
                        <li>
                            <div>
                                <input type="radio" name="q17" id="q17e" value="e" />
                                <label for="q17e"><span></span></label>
                            </div>outros. Quais?
                        </li>
                        <li>
                            <input type="text" name="q17f" />
                        </li>
                    </ul>
                </li>
                <li>Quais os símbolos mais utilizados em seus trabalhos?
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q18" id="q18a" value="a" />
                                <label for="q18a"><span></span></label>
                            </div>setas</li>
                        <li>
                            <div>
                                <input type="radio" name="q18" id="q18b" value="b" />
                                <label for="q18b"><span></span></label>
                            </div>círculos</li>
                        <li>
                            <div>
                                <input type="radio" name="q18" id="q18c" value="c" />
                                <label for="q18c"><span></span></label>
                            </div>retângulos</li>
                        <li>
                            <div>
                                <input type="radio" name="q18" id="q18d" value="d" />
                                <label for="q18d"><span></span></label>
                            </div>outros. Quais?</li>
                        <li>
                            <input type="text" name="q18e" />
                        </li>
                    </ul>
                </li>
                <li>Os símbolos são necessários para a compreensão do documento ou podem ser suprimidos sem prejuízo?
                    <p>
                        <input type="text" name="q19" />
                    </p>
                </li>
            </ol>

            <h2>Sobre as ferramentas existentes no mercado</h2>

            <ol start="20">
                <li>Se você pudesse juntar mais de uma ferramenta existente no mercado, quais seriam as características ideias de cada uma delas presentes no novo software?
                    <p>
                        <input type="text" name="q20" />
                    </p>
                </li>
                <li>O que seria mais interessante: um software de desenho digital (como mesas digitalizadoras, ou tablets, por exemplo) ou um software que interprete e digitalize os desenhos feitos no papel?
                    <p>
                        <input type="text" name="q21" />
                    </p>
                </li>
                <li>Seria interessante criar automaticamente um animatic com base no storyboard criado?
                    <p>
                        <input type="text" name="q22" />
                    </p>
                </li>
            </ol>

            <h2>Sobre a linguagem SLAP</h2>

            <ol start="23">
                <li>Os símbolos adotados são intuitivos.
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q23" id="q23a" value="a" />
                                <label for="q23a"><span></span></label>
                            </div>Discordo plenamente</li>
                        <li>
                            <div>
                                <input type="radio" name="q23" id="q23b" value="b" />
                                <label for="q23b"><span></span></label>
                            </div>Tendo a discordar</li>
                        <li>
                            <div>
                                <input type="radio" name="q23" id="q23c" value="c" />
                                <label for="q23c"><span></span></label>
                            </div>Não concordo nem discordo</li>
                        <li>
                            <div>
                                <input type="radio" name="q23" id="q23d" value="d" />
                                <label for="q23d"><span></span></label>
                            </div>Tendo a concordar</li>
                        <li>
                            <div>
                                <input type="radio" name="q23" id="q23e" value="e" />
                                <label for="q23e"><span></span></label>
                            </div>Concordo plenamente</li>
                    </ul>
                </li>
                <li>O posicionamento dos símbolos no palco, interferiu no processo de criação do mesmo?
                    <p>
                        <input type="text" name="q24" />
                    </p>
                </li>
                <li>O conjunto dos símbolos refletiu o movimento gerado na animação?
                    <p>
                        <input type="text" name="q25" />
                    </p>
                </li>
                <li>Qual o grau de relevância da linguagem SLAP no processo de geração de um storyboard?
                    <p>
                        <input type="text" name="q26" />
                    </p>
                </li>
                <li>Qual o grau de relevância da linguagem SLAP no processo de geração de um animatic?
                    <p>
                        <input type="text" name="q27" />
                    </p>
                </li>
                <li>Você conseguiu realizar o que foi pedido com facilidade?
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q28" id="q28a" value="sim" />
                                <label for="q28a"><span></span></label>
                            </div>Sim</li>
                        <li>
                            <div>
                                <input type="radio" name="q28" id="q28b" value="não" />
                                <label for="q28b"><span></span></label>
                            </div>Não</li>
                    </ul>
                </li>
                <li>A animação foi gerada conforme o que foi planejado por você?
                    <ul>
                        <li>
                            <div>
                                <input type="radio" name="q29" id="q29a" value="sim" />
                                <label for="q29a"><span></span></label>
                            </div>Sim</li>
                        <li>
                            <div>
                                <input type="radio" name="q29" id="q29b" value="não" />
                                <label for="q29b"><span></span></label>
                            </div>Não</li>
                    </ul>
                </li>
                <li>Sugestões
                    <p>
                        <textarea name="q30"></textarea>
                    </p>
                </li>
            </ol>
            <p>
                <input type="submit" value="ENVIAR"/>
            </p>
        </form>
    </section>