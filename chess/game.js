import {Grid, CELL_SIZE} from './board.js'
import {Bishop, King, Knight, Pawn, Queen, Rook, inBounds} from './pieces.js'

var audio = new Audio('chess_move.mp3');

let chessGrid = new Grid()

let R1 = new Rook(1)
let R2 = new Rook(1)
let N1 = new Knight(1)
let N2 = new Knight(1)
let B1 = new Bishop(1)
let B2 = new Bishop(1)
export let K = new King(1)
let Q = new Queen(1)
let P1 = new Pawn(1)
let P2 = new Pawn(1)
let P3 = new Pawn(1)
let P4 = new Pawn(1)
let P5 = new Pawn(1)
let P6 = new Pawn(1)
let P7 = new Pawn(1)
let P8 = new Pawn(1)

let r1 = new Rook(0)
let r2 = new Rook(0)
let n1 = new Knight(0)
let n2 = new Knight(0)
let b1 = new Bishop(0)
let b2 = new Bishop(0)
export let k = new King(0)
let q = new Queen(0)
let p1 = new Pawn(0)
let p2 = new Pawn(0)
let p3 = new Pawn(0)
let p4 = new Pawn(0)
let p5 = new Pawn(0)
let p6 = new Pawn(0)
let p7 = new Pawn(0)
let p8 = new Pawn(0)
export let board = [[ r1, n1, b1, q, k, b2, n2, r2],
                    [p1 ,p2 ,p3 ,p4 ,p5 ,p6 ,p7 ,p8 ],
                    [undefined ,undefined ,undefined ,undefined ,undefined ,undefined ,undefined ,undefined ],
                    [undefined ,undefined ,undefined ,undefined ,undefined ,undefined ,undefined ,undefined ],
                    [undefined ,undefined ,undefined ,undefined ,undefined ,undefined ,undefined ,undefined ],
                    [undefined ,undefined ,undefined ,undefined ,undefined ,undefined ,undefined ,undefined ],
                    [P1 ,P2 ,P3 ,P4 ,P5 ,P6 ,P7 ,P8 ],
                    [R1, N1, B1, Q, K, B2, N2, R2 ]]

export let turn = 1
let isSelected = false
let pms
let pre_pos

load()

//------------------------event listener---------------------------
for(let i=0;i<8;i++)
{
    for(let j=0;j<8;j++)
    {
        chessGrid[i][j].addEventListener('click',()=>{start({x:i,y:j})})
    }
}
//-----------------------------------------------------------------

function load()
{
    for(let i=0;i<8;i++)
    {
        for(let j=0;j<8;j++)
        {
            if(board[i][j]!=undefined)
                chessGrid[i][j].innerHTML = `<img src="${board[i][j].src}" width = ${CELL_SIZE}px height = ${CELL_SIZE}px>`
            else
                chessGrid[i][j].innerHTML = ''
        }
    }
}

function start(pos)
{
    if(isSelected == false && board[pos.x][pos.y].color == turn) //piece selected 
    {
        pms = board[pos.x][pos.y].possibleMoves(pos,board)
        // if(board[pos.x][pos.y] == k)
        //     console.log(pms)
        removeDangerMoves(pms,pos)//very very sus 
        pre_pos = pos
        isSelected = true
        display(pos,pms)
        //console.log("1st part")
    }

    else if(checkExists(pos,pms))//move made for that piece (restrictions: 1.move should be in pms, 2.)
    {
        move(pre_pos,pos)   //the pos here is different from the pos in the if statement
        destroy()            //reset pms to undefined along with removing the class
        isSelected = false
        pms = undefined
        pre_pos = undefined
        turn = (turn + 1)%2
        checkWinCondition()
        //console.log("made a move by",pos,"and the turn now is ",turn, "and isSelected is: ",isSelected)
    }
    else
    {
        destroy()
        pms = undefined
        pre_pos = undefined
        isSelected = false
        //start(pos)  
    }
}

function display(pos,pms)
{
    if(pms[0].length || pms[1].length) chessGrid[pos.x][pos.y].classList.add("movable")
    for(let position of pms[0])
    {
        chessGrid[position.x][position.y].classList.add("movable")
    }

    for(let position of pms[1])
    {
        chessGrid[position.x][position.y].classList.add("attackable")
    }
}

function move(pre_pos,pos)
{
    if(board[pre_pos.x][pre_pos.y].src == 'Pieces\\black-pawn.svg' || board[pre_pos.x][pre_pos.y].src == 'Pieces\\white-pawn.svg')
    {
        if(pos.x == 0) board[pre_pos.x][pre_pos.y] = Q
        if(pos.x == 7) board[pre_pos.x][pre_pos.y] = q
        ++board[pre_pos.x][pre_pos.y].moveCount
    }

    if(board[pre_pos.x][pre_pos.y].src == 'Pieces\\black-rook.svg' || board[pre_pos.x][pre_pos.y].src == 'Pieces\\white-rook.svg')
        ++board[pre_pos.x][pre_pos.y].moveCount

    if(board[pre_pos.x][pre_pos.y].src == 'Pieces\\black-king.svg' || board[pre_pos.x][pre_pos.y].src == 'Pieces\\white-king.svg')
    {
        if(board[pre_pos.x][pre_pos.y].moveCount == 0 && (pre_pos.y - pos.y == 2 || pre_pos.y - pos.y == -2))
        {
            if(board[pos.x][pos.y+1] == r1 || board[pos.x][pos.y+1] == r2 || board[pos.x][pos.y+1] == R1 || board[pos.x][pos.y+1] == R2)
            {
                let temp = board[pos.x][pos.y+1]
                board[pos.x][pos.y+1] = board[pos.x][pos.y-1]
                board[pos.x][pos.y-1] = temp
            }
            else
            {
                let temp = board[pos.x][pos.y-2]
                board[pos.x][pos.y-2] = board[pos.x][pos.y+1]
                board[pos.x][pos.y+1] = temp
            }
        }
        board[pre_pos.x][pre_pos.y].x = pos.x
        board[pre_pos.x][pre_pos.y].y = pos.y
        ++board[pre_pos.x][pre_pos.y].moveCount
    }

    board[pos.x][pos.y] = board[pre_pos.x][pre_pos.y]
    board[pre_pos.x][pre_pos.y] = undefined
    audio.play()
    load()
}

function destroy()
{
    for(let row of chessGrid)
    {
        for(let cell of row)
        {
            if(cell.classList.contains("movable"))
            {
                cell.classList.remove("movable")
            }

            if(cell.classList.contains("attackable"))
            {
                cell.classList.remove("attackable")
            }
        }
    }
}

function checkExists(pos,pms)
{
    for(let cell of pms[0])
    {
        if(cell.x == pos.x && cell.y == pos.y) return true
    }

    for(let cell of pms[1])
    {
        if(cell.x == pos.x && cell.y == pos.y) return true
    }
    return false
}

function checkWinCondition()
{
    let black
    let white
    if((white = isUnsafe({x:K.x,y:K.y},K.color,board)) || (black = isUnsafe({x:k.x,y:k.y},k.color,board)))
    {
        let pms
        if(white) pms = K.possibleMoves({x:K.x,y:K.y},board)
        else pms = k.possibleMoves({x:k.x,y:k.y},board)
        //console.log(pms,turn)

        let flag = 0
        if(pms[0].length == 0 && pms[1].length == 0)
        {
            for(let i=0;i<8;i++)
            {
                for(let j=0;j<8;j++)
                {
                    if(board[i][j]!=undefined)
                    {
                        if(board[i][j].color == turn && (board[i][j]!=K && board[i][j]!=k))
                        {
                            let p = board[i][j].possibleMoves({x:i,y:j},board)
                            removeDangerMoves(p,{x:i,y:j})
                            let no_of_moves = p[0].length + p[1].length
                            if(no_of_moves) flag = 1
                        }
                    }
                }
            }
        }
        else
            flag=1

        if(flag == 0) console.log(`checkmate!!! You LOST!!!!!!!! ${turn}`)
        else console.log(`check!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${turn}`)
    }
}

export function isUnsafe(pos,color,board)
{
    if(color == 1) //white king
    {
        //knight threatens
        let cells = N1.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\black-knight.svg')
                return 1
        }

        //bishop threatens
        cells = B1.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\black-bishop.svg')
                return 1
        }

        //queen threatens
        cells = Q.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\black-queen.svg')
                return 1
        }

        //rook threatens
        cells = R1.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\black-rook.svg')
                return 1
        }

        //pawn threatens
        cells = P1.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\black-pawn.svg')
                return 1
        }
    }
    else //black king
    {
        //knight threatens
        let cells = n1.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\white-knight.svg'){
                console.log("knight threatens")
                return 1
            }
        }

        //bishop threatens
        cells = b1.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\white-bishop.svg'){
                //console.log(`bishop threatens ${pos.x},${pos.y}`)
                return 1
            }
        }

        //queen threatens
        cells = q.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\white-queen.svg'){
                console.log("queen threatens")
                return 1
            }
        }

        //rook threatens
        cells = r1.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\white-rook.svg'){
                console.log("rook threatens")
                return 1
            }
        }

        //pawn threatens
        cells = p1.possibleMoves(pos,board)
        for(let cell of cells[1])
        {
            if(board[cell.x][cell.y].src == 'Pieces\\white-pawn.svg'){
                console.log("pawn threatens")
                return 1
            }
        }
    }
    return 0
}

//-----------------removal from pms------------------

function removeDangerMoves(pms,pos) 
{
    let pms2 = JSON.parse(JSON.stringify(pms)) //deep copy
    for(let move of pms2[0]) 
    {
        if(isKingInDanger(pos,move,turn))
        {
            console.log(pos,move,turn)
            pms[0] = removeMove(move,pms[0])
        }
    }
    for(let move of pms2[1])
    {
        if(isKingInDanger(pos,move,turn))
        {
            pms[1] = removeMove(move,pms[1])
        }
    }
}

function isKingInDanger(pos,new_pos,color)
{
    let response = 0
    let king
    if(color==1) king = K
    else king = k

    let duplicate = JSON.parse(JSON.stringify(board)) //deep copy
    //console.log(duplicate)

    duplicate[new_pos.x][new_pos.y] = duplicate[pos.x][pos.y]
    duplicate[pos.x][pos.y] = null
    //console.log(king.x,king.y)
    //if pos is king, then use new_pos else use king.x and king.y
    if(board[pos.x][pos.y] == king){
        if(isUnsafe(new_pos,king.color,duplicate)) response = 1 //found the problem!!!!!!!!!
    }
    else{
        if(isUnsafe({x:king.x,y:king.y},king.color,duplicate)) response = 1
    }

    return response
}

function removeMove(value,arr)
{
    let temp = []
    while(!(arr[0].x==value.x && arr[0].y==value.y))
    {
        temp.push(arr.shift())
    }
    arr.shift()
    while(temp.length)
    {
        arr.unshift(temp.pop())
    }
    return arr
}
  
//-----------------removal from pms-------------------


//NOTE: gotta make another function in pieces.js similar to possibleMoves(), but for check case
//This function should call possibleMoves and remove those moves which don't help in breaking the check

//later make sure, any move made by a color doesnt create a check for their own color king