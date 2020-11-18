const scorePlayer = document.getElementById("score");//const usadas depois para setar os atributos
/*const timerPlayer = document.getElementById("tempo");*/
const linesPlayer = document.getElementById("linhaseliminadas");
const dificultPlayer = document.getElementById("dificuldade");
var cvs = document.getElementById("rt");
var context_tetris = cvs.getContext("2d");//declarando o efeito de jogo

var N_ROW = 0;//tabuleiro dimensão
var N_COL = 0;
var tabuleiro = [];
const tamPecas = 20; //size peça in px
//Variaveis do game.
let speed_peca= 100;
let dropStart = Date.now();//Frame atual do usuário inicial.
let score = 0;
let count_line = 0;

const backgroundTab = "#2c3e50"; //fundo color tab
const borderTab = "#ff5e57"; //bordar pra conseguir visualizar as peças e o size

var minutes = 0;
var seconds = 0;
var timerMilesimos = 1000; //1 segundo tem 1000 milésimos
var timerPlayer = 0;


var qtdLinhas = 0; //Cria variável que conta a quantidade de linhas eliminadas

//Classe Piece
class Pecas{
    constructor(peca,color){ 
        this.peca = peca;
        this.color = color;
        this.peca_index = 0; //Peça I, se for index 1: Peca J.
        this.activePeca = this.peca[this.peca_index]; //PECA ATUAL, QUE FOI GERADA ALEATORIAMENTE.
        this.x_board = 3; //x da matriz
        this.y_board = -2; //y da matriz 
        
    }
}
     
 //Peças rotacionadas (90, 180,270 graus)
const I = [ [[0, 0, 0, 0],[1, 1, 1, 1],[0, 0, 0, 0],[0, 0, 0, 0],], [ [0, 0, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0],], [ [0, 0, 0, 0],[0, 0, 0, 0],[1, 1, 1, 1],[0, 0, 0, 0],], [ [0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],]];
const J = [ [[1, 0, 0],[1, 1, 1],[0, 0, 0]], [ [0, 1, 1],[0, 1, 0],[0, 1, 0] ],[ [0, 0, 0],[1, 1, 1],[0, 0, 1] ],[ [0, 1, 0],[0, 1, 0],[1, 1, 0] ]];
const L = [ [[0, 0, 1],[1, 1, 1],[0, 0, 0]], [ [0, 1, 0],[0, 1, 0],[0, 1, 1] ], [ [0, 0, 0],[1, 1, 1],[1, 0, 0] ], [ [1, 1, 0],[0, 1, 0],[0, 1, 0] ]];
const O = [ [[0, 0, 0, 0],[0, 1, 1, 0],[0, 1, 1, 0],[0, 0, 0, 0],] ];
const T = [ [[0, 1, 0],[1, 1, 1],[0, 0, 0]],[[0, 1, 0],[0, 1, 1],[0, 1, 0]],[[0, 0, 0],[1, 1, 1],[0, 1, 0]],[[0, 1, 0],[1, 1, 0],[0, 1, 0]]];
const U = [ [[1, 0, 1],[1, 1, 1],[0, 0, 0]], [ [0, 1, 1],[0, 1, 0],[0, 1, 1]], [ [0, 0, 0],[1, 1, 1],[1, 0, 1]], [ [1, 1, 0],[0, 1, 0],[1, 1, 0]]];

//Função para selecionar o tamanho do tabuleiro *fazer validação

function choice(){
    var tabTAM = prompt("𝗘𝗦𝗖𝗢𝗟𝗛𝗔 𝗢 𝗧𝗔𝗕𝗨𝗟𝗘𝗜𝗥𝗢 𝗤𝗨𝗘 𝗗𝗘𝗦𝗘𝗝𝗔 𝗝𝗢𝗚𝗔𝗥\n𝟭 - Tabuleiro Clássico \n𝟮 - Tabuleiro Personalizado");
    if(tabTAM == 1){ //retorna as dimensões de cada tipo de tabuleiro
        N_COL = 10;
        N_ROW = 20;
        /*cvs.width = 280;//tamanho do canva p/ este tabuleiro
        cvs.width = 580;*/
    }else{
        N_COL = 22;
        N_ROW = 44;
        /*cvs.width = 500;//tamanho do canva p/ este tabuleiro
        cvs.width = 1000;*/
    }

    for (let linha = 0; linha < N_ROW; linha++) {
        tabuleiro[linha] = [];
        for(let coluna = 0; coluna < N_COL; coluna++) {
            tabuleiro[linha][coluna] = backgroundTab;
        }
    }
    
    layoutTetris();
    startTimer(); //inicia o cronomêtro
}



function layoutTetris() { //Desenhar tabuleiro
    for (var linha = 0; linha < N_ROW; linha++) {
        for(var coluna = 0; coluna < N_COL; coluna++) {
            const cor_atual = tabuleiro[linha][coluna];
            Desenhar_quadradinho(coluna,linha,cor_atual);
        }
    }

}
function Desenhar_quadradinho(row,col,color){
    context_tetris.fillStyle = color; //Cor atual do quadradinho.
    context_tetris.fillRect(row * tamPecas , col * tamPecas , tamPecas, tamPecas);
    context_tetris.strokeStyle = borderTab;//Cor das linhas que dividem a coluna e as linhas.
    context_tetris.strokeRect(row * tamPecas , col * tamPecas , tamPecas , tamPecas );
}

// Constante de pecas.
const tetrominoes = [[I,"#55E6C1"],[J,"#1B9CFC"], [L,"#ffcccc"],[O,"#32ff7e"],[T,"#c23616"],[U,"#ffffff"]];

//Objeto do jogo.
let tetrominoes_obj = pecas_aleatorias();

// generate random PECASs
function pecas_aleatorias(){
    const peca_aleatoria  = Math.floor(Math.random() * tetrominoes.length) // Peça aleatoria de 0 a  6. O length se refere a qtd_pecas na const
    return new Pecas(tetrominoes[peca_aleatoria][0],tetrominoes[peca_aleatoria][1]); //Criar a peca aleatoria. Posicao 0: Tipo de peca; Posicao 1: Cor da peça.
}

function Movimentation() {
    const now = Date.now();
    const delta = now - dropStart; //Hora do frame atual do usuario - a hora que a peça comecou a cair.
    if (delta >= speed_peca) {  //Se passou os 500ms.(Para ajustar a velo do jogo.)
        moveDown();
        dropStart = Date.now();//Atualizar o frame atual do usuário.
    }
    requestAnimationFrame(Movimentation);
}

Movimentation();

//Desenho de cada peça!!
function fill_piece(color) { //Pintar a peça com uma cor.
    for(var linha = 0; linha < tetrominoes_obj.activePeca.length; linha++){
        for(var coluna = 0; coluna < tetrominoes_obj.activePeca.length; coluna++){   
            if(tetrominoes_obj.activePeca[linha][coluna] == 1){
                Desenhar_quadradinho((tetrominoes_obj.x_board + coluna),(tetrominoes_obj.y_board + linha), color);
            }
        }
    }
}

//Desenhar a peça.
function drawPieces() { 
    fill_piece(tetrominoes_obj.color);
}

//Apagar as peças
function deletePiece() { 
    fill_piece(backgroundTab);
}   

//Movimentação da peça para baixo
function moveDown() { 
    if(!CheckCollision(0,1,tetrominoes_obj.activePeca)){
        //Se não estiver colidindo com nada, ela pode continuar descendo!!
        deletePiece(); //Apagar a peça.
        tetrominoes_obj.y_board ++;
        drawPieces();
        return;
    }
    else{
        tetrominoes_obj = pecas_aleatorias();
    } 
}

//Mover para direita
function moveRight(){
    if (!CheckCollision(1, 0, tetrominoes_obj.activePeca)) {
    deletePiece(); //Apagar a peça.
    tetrominoes_obj.x_board ++;
    drawPieces();
    }
}

//Mover para Esquerda
function moveLeft(){
    if (!CheckCollision(-1, 0, tetrominoes_obj.activePeca)) {
        deletePiece(); //Apagar a peça.
        tetrominoes_obj.x_board --;
        drawPieces();
    }
}

//Rotação da peça:
Pecas.prototype.rodar = function(){
    let peca_padrao = tetrominoes_obj.peca[(tetrominoes_obj.peca_index + 1) % tetrominoes_obj.peca.length];
    let mov = 0;
    if (CheckCollision(0, 0, peca_padrao)) {
        mov = 1;
        if (tetrominoes_obj.x_board > N_COL / 2) {
            mov = -1;
        }
    }
    if (!CheckCollision(mov, 0, peca_padrao)) {
        deletePiece(); //Apagar a peça.
        tetrominoes_obj.x_board += mov;
        tetrominoes_obj.peca_index = (tetrominoes_obj.peca_index + 1) % tetrominoes_obj.peca.length;
        tetrominoes_obj.activePeca = tetrominoes_obj.peca[tetrominoes_obj.peca_index];
        drawPieces();
    }
}
    
document.onkeydown = function (e) {
    switch (e.key) {
        case 'ArrowUp':
            tetrominoes_obj.rodar();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            dropStart = Date.now();
            break;
        case 'ArrowRight':
            moveRight();
            dropStart = Date.now();
        }
};

//Funcao para checar a colisao das peças
function CheckCollision(row, col, futurePiece) { 
    for (var linha = 0; linha < futurePiece.length; linha++) {
        for (var coluna = 0; coluna < futurePiece.length; coluna++) {
            if(futurePiece[linha][coluna] != 0 ) { //Se existir alguma peça nessa coluna e linha! 
                var newRow = tetrominoes_obj.x_board + coluna + row;
                var newCol = tetrominoes_obj.y_board + linha + col;

                // Checar os limites do tabuleiro. Se a peça está colidindo com o X=0 (board esquerdo);
                // Se peça chegou no limite do tabuleiro (final de linhas)
                // Se a peça não ultrapassou o limite do board direito
                if (newRow < 0 || newRow >= N_COL || newCol >= N_ROW) {
                    //Colisão para as bordas
                    return true;
                    //Se trombar com alguma peça, retorne true!!
                }   
                if (newCol < 0) {
                    //Colisão para as bordas
                    continue;
                }
                if (tabuleiro[newCol][newRow] != backgroundTab) {
                    //Colidir com algum quadrado que já esteja pintado.
                    return true;
                    }
            }
            else{
                continue;
            }
                    
        }
    }
    return false;
}

/* TEMPORIZADOR JOGO */
function startTimer(){
    timerPlayer = setInterval(() => { timer(); }, timerMilesimos);
}
function stopTimer(){
    clearInterval(timerPlayer);
}
function timer(){
    seconds++; //Incrementa +1 na variável seconds

    if (seconds == 59) { //Verifica se deu 59 segundos
        seconds = 0; //Volta os segundos para 0
        minutes++; //Adiciona +1 na variável minutes

        if (minutes == 59) { //Verifica se deu 59 minutos
            minutes = 0;//Volta os minutos para 0
        
        }
    }
    
//Cria uma variável com o valor tratado MM:SS
var format = (minutes< 10 ? '0' + minutes: minutes) + ':' + (seconds< 10 ? '0' + seconds: seconds);
    
//Insere o valor tratado no elemento counter
document.getElementById('tempo').innerText = format;

//Retorna o valor tratado
return format;


/* SCORE E REMOVER LINHAS */
function atualizarLinhaScore(N_ROW){ //atualizar caso tenha uma linha completa (deletar a mesma) e somar no score
    var linhasExcluidas = 0;
    for (let y = N_ROW; y > 1; y--){
        for (let coluna = 0; coluna < N_COL; coluna++){
            removerLinha(y, coluna) //diminuir linha atual (remover linha)
            contLinhas();
            linhasExcluidas++;
        }
    }
    for (let coluna = 0; coluna < N_COL; coluna++){
        tabuleiro[0][coluna] = backgroundTab; //'pintando' a primeira linha
    }
    if (linhasExcluidas > 0) { //se tiver linha completa, atualizar score
        score += (linhasExcluidas*10)*linhasExcluidas; //numero de linhas excluidas * 10 pontos * (bonus)
        var contadorScore = score.toString();
        document.getElementById('score').innerHTML = contadorScore;
    } 
}
function removerLinha(linhaaRemover, colunaaRemover) {
    tabuleiro[linhaaRemover][coluna] = tabuleiro[linhaaRemover - 1][coluna];
}
function contLinhas() {
    qtdLinhas++;
    var contadorLinhas = qtdLinhas.toString();
    document.getElementById('linhaseliminadas').innerHTML = contadorLinhas;
}

}



