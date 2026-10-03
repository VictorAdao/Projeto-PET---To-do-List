/*
Victor Hugo Adão de Oliveira - 17969072 
BCC - ICMC - USP
Projeto To Do List PET
*/

import React, { useState } from 'react'; //Importa a biblioteca principal do React, necessária para criar componentes e processar o JSX
import './App.css'; //importa o arquivo com o style em CSS 

interface ItemTarefa { //Cria a "Struct" item, basicamente a estrutura da tarefa
  id: string; // id da tarefa
  texto: string; // o que a tarefa guarda 
  estaConcluida: boolean; //se esta feito ou não 
}

type OpcaoFiltro = 'todas' | 'concluidas' | 'pendentes'; // tipo um ENUM pra retringir os tipos possiveis do filtro

export default function App() {//Exporta a função APP para poder ser importada na main
  //state --> guardar dados que mudam ao longo do tempo 
  //const[variavel, função de leitura] = useState<tipo do dado>(valor inicial);
  const [listaTarefas, setListaTarefas] = useState<ItemTarefa[]>([]);//state controla lista de tarefas com um array

  const [textoNovaTarefa, setTextoNovaTarefa] = useState<string>('');//controla o texto novo que vai pra tarefa
  const [filtroAtivo, setFiltroAtivo] = useState<OpcaoFiltro>('todas');//controla o tipo filtro que se limita aos 3 que tão ali encima
  const [idTarefaEmEdicao, setIdTarefaEmEdicao] = useState<string | null>(null);//controla o id da tarefa que escolho editar
  const [textoEdicao, setTextoEdicao] = useState<string>('');//controla texto da tarefa que vou editar

  const adicionarTarefa = (evento: React.FormEvent) => { //função de adicionar tarefa controla um evento tipo formulario que no caso adiciona uma tarefa na lista
    evento.preventDefault(); //impede o recarregamento da pagina --> tem haver com o react impedir a perda do state e mais uns negocios 
    const textoLimpo = textoNovaTarefa.trim(); //cria texto limpo que armazena o valor do input que esta no JSX, usa a função trim pra tirar espaços em branco das bordas
    if (!textoLimpo) return; // se o texto estiver vazio depois do trim não cria nada 

    const novaTarefa: ItemTarefa = {//cria um item tarefa 
      id: Date.now().toString(), //sugestão gemini, usa uma função de time pra pegar os milissegundos decoridos desde 1970 e transforma em texto ou seja um id unico
      texto: textoLimpo, //associa o texto colocado no campo a novatarefa->texto
      estaConcluida: false //inicialmente começa como falso ate pq qual o sentido de criar uma tarefa ja concluida né
    };

    setListaTarefas((tarefasAnteriores) => [...tarefasAnteriores, novaTarefa]);//Adiciona a nova tarefa ao array de tarefas --> O ... (chamado de spread operator) pega todos os itens que já existiam dentro do array tarefasAnteriores e "espalha" individualmente dentro desse novo array.
    setTextoNovaTarefa('');//limpa o campo
  };

  const alternarTarefa = (id: string) => {//altera o status da tarefa --> atraves do id da tarefa 
    setListaTarefas((tarefasAnteriores) => //Utiliza a atualização via callback do useState para garantir que estamos manipulando o valor mais atual da lista de tarefas.
      tarefasAnteriores.map((tarefa) =>//.map() percorre cada item do array original e gera um novo array -->atualiza os elementos sem mudar o array
        tarefa.id === id ? { ...tarefa, estaConcluida: !tarefa.estaConcluida } : tarefa //usa um ternario e caso -->sobrescreve apenas a propriedade estaConcluida, invertendo o seu valor booleano (se era false vira true, se era true vira false).
      )
    );
  };
  const excluirTarefa = (id: string) => { //função que exclui a tarefa atraves do ID 
    setListaTarefas((tarefasAnteriores) => //useState pra acessar a versão mais atual da lista e alterar via callback
      tarefasAnteriores.filter((tarefa) => tarefa.id !== id) //.filter() percorre o array e cria um novo array contendo os elementos que são diferentes do id passado pra ser excluido 
    );
  };

  const iniciarEdicao = (tarefa: ItemTarefa) => {//função pra edição que passa a tarefa a ser wditada
    setIdTarefaEmEdicao(tarefa.id); //para saber qual tarefa da lista deve trocar a visualização normal por um campo de texto/input de edição
    setTextoEdicao(tarefa.texto); //Preenche o estado do formulário de edição com o texto atual da tarefa.
  };

  const salvarEdicao = (id: string) => {//função pra salvarv a edição atraves do id
    const textoLimpo = textoEdicao.trim(); //cria texto limpo que armazena o valor do input que esta no JSX, usa a função trim pra tirar espaços em branco das bordas
    if (textoLimpo) { //se texto limpo verdade
      setListaTarefas((tarefasAnteriores) => //use o state pra alterar a função
        tarefasAnteriores.map((tarefa) => //.map() percorre cada item do array original e gera um novo array
          tarefa.id === id ? { ...tarefa, texto: textoLimpo } : tarefa//ternario pra mudar o item com o id igual ao id passado se for igua mude pelo texto do texto do campo
        )
      );
    }
    setIdTarefaEmEdicao(null); //muda o idde tarefa em edição para NULL
  };

  const listaTarefasFiltrada = listaTarefas.filter((tarefa) => { //função pra filtrar a lista 
    if (filtroAtivo === 'concluidas') return tarefa.estaConcluida; //se o filto estiver em  concluidas retorne todas as funções co  o estado de concluida == true 
    if (filtroAtivo === 'pendentes') return !tarefa.estaConcluida;//se o filto estiver em  pendentes retorne todas as funções co  o estado de concluida == false 
    return true;//caso nenhum dos dois esteja ativo se retorne true(tudo)
  });

  //retorno do componente React contendo a estrutura JSX da interface
  return (
    //o react devolve apenas um item por vez ou seja ele vai retornar essa divzona 
    <div className="container-aplicacao">
      <div className="conteudo-principal">
        <h1 className="titulo-aplicacao">Tasks</h1>
        {/* Formulário para adicionar nova tarefa -> chama adicionarTarefa no envio (submit) 
        No imput tem o tipo oq vai ficar no campo quando estiver vazio a sombrinha de fundo
        o valor cria uma nova tarefa e o nome da classe css e o botão pra enviar*/}
        <form onSubmit={adicionarTarefa} className="formulario-tarefa">
          <input
            type="text"
            placeholder="Qual sua proxima tarefa?"
            value={textoNovaTarefa}
            onChange={(e) => setTextoNovaTarefa(e.target.value)}
            className="campo-entrada"
          />
          <button type="submit" className="botao-adicionar">
            +
          </button>
        </form>
        {/* Barra superior de controles contendo os botões de filtro e o contador */}
        <div className="barra-filtros">
          <div className="grupo-filtros">
            <button
              type="button"//é um botão
              onClick={() => setFiltroAtivo('todas')}//chama a função pra setar o filtro como todos quando clicado 
              className={`botao-filtro ${filtroAtivo === 'todas' ? 'ativo' : ''}`}//chama a class certa usando um ternario
            >
              Total
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setFiltroAtivo('concluidas')}//idem do de cima pra concluidos 
              className={`botao-filtro ${filtroAtivo === 'concluidas' ? 'ativo' : ''}`}
            >
              Concluidas
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setFiltroAtivo('pendentes')}//idem do primeiro pra pendentes 
              className={`botao-filtro ${filtroAtivo === 'pendentes' ? 'ativo' : ''}`}
            >
              Pendentes
            </button>
          </div>
          <span className="contador-tarefas">
            {listaTarefasFiltrada.length} tasks {/*exibe a quantidade total de tarefas filtradas.*/}
          </span>
        </div>

        {/* Container que renderiza dinamicamente a lista de tarefas */}
        <div className="lista-tarefas">
          {/* Percorre cada item da lista já filtrada e transforma num elemento JSX na tela */}
          {listaTarefasFiltrada.map((tarefa) => (
            /*Card individual da tarefa. A prop 'key' é obrigatória no React para identificar cada item de uma lista de forma única*/
            <div key={tarefa.id} className="cartao-tarefa">
              {/* Lado esquerdo da tarefa: contém a checkbox e o texto (ou campo de edição) */}
              <div className="conteudo-tarefa">
                <div
                  onClick={() => alternarTarefa(tarefa.id)}//altera o status da tarefa ao ser clicado
                  className={`caixa-selecao ${tarefa.estaConcluida ? 'marcada' : ''}`}//muda a classe do quadrado
                >
                  {/*desenha o ícone do "Check" apenas se a tarefa estiver concluída */}
                  {tarefa.estaConcluida && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>

                {/* Ternário para escolher se ta editando ou não */}
                {idTarefaEmEdicao === tarefa.id ? (
                  <input
                  //modo de edição 
                    type="text"
                    value={textoEdicao}//valor controlado pelo estado textoEdicao
                    onChange={(e) => setTextoEdicao(e.target.value)}// Atualiza o textoEdicao conforme o usuário digita
                    onBlur={() => salvarEdicao(tarefa.id)}// salva a edição automaticamente quando o usuário clica fora do campo
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') salvarEdicao(tarefa.id); // Salva ao pressionar a tecla Enter
                    }}
                    autoFocus //cursor vai altomaticamente pra ele no campo assim que aparece 
                    className="entrada-edicao"
                  />
                ) : (/* mostra o texto da tarefa normal */
                  <span
                    className={`texto-tarefa ${tarefa.estaConcluida ? 'concluido' : ''}`}//Quando a tarefa ta concluida risca ela 
                  >
                    {tarefa.texto}
                  </span>
                )}
              </div>
              {/* Lado direito do card agrupa os botões de ação da tarefa (Editar e Excluir) */}
              <div className="acoes-tarefa">
                {/* Botão de Editar -> chama iniciarEdicao passando o objeto da tarefa ao clicar */}
                <button
                  type="button"
                  onClick={() => iniciarEdicao(tarefa)}
                  className="botao-icone"
                  title="Editar tarefa"
                > {/*Icone */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>

                {/* Botão de Excluir -> chama excluirTarefa passando apenas o ID ao clicar */}
                <button
                  type="button"
                  onClick={() => excluirTarefa(tarefa.id)}
                  className="botao-icone"
                  title="Excluir tarefa"
                > {/*icone*/}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}