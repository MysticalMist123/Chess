import {K,k,isUnsafe,turn,board} from './game.js'
let chessPieces = {
    '02' : 'Pieces\\black-rook.svg',
    '03' : 'Pieces\\black-knight.svg',
    '04' : 'Pieces\\black-bishop.svg',
    '05' : 'Pieces\\black-king.svg',
    '06' : 'Pieces\\black-queen.svg',
    '07' : 'Pieces\\black-pawn.svg',

    '12' : 'Pieces\\white-rook.svg',
    '13' : 'Pieces\\white-knight.svg',
    '14' : 'Pieces\\white-bishop.svg',
    '15' : 'Pieces\\white-king.svg',
    '16' : 'Pieces\\white-queen.svg',
    '17' : 'Pieces\\white-pawn.svg',
}

function checkValid(pos,current,board,legalMoves,attackMoves) //checking if the move is valid or not and categorising it
{
    if(inBounds(current))
    {   
        if(board[current.x][current.y] == undefined)
        {
            legalMoves.push(current)
            //console.log("@",current)
            return 1
        }
        else
        {
            if(board[current.x][current.y].color == turn)
            {
                // console.log("#",current)
                return 0
            }
            else
            {
                attackMoves.push(current)
                // console.log("%",current)
                return 0
            }    
        }
    }
    return 0
}

export function inBounds(pos)
{
    if(pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8)
        return true
    return false
}



export class Rook{
    constructor(color){
        this.color = color
        this.src = chessPieces[`${color}2`]
        this.moveCount = 0
    }
    possibleMoves(pos,board)
    {
        let legalMoves = []
        let attackMoves = []

        //going up
        let tempr = pos.x - 1
        let tempc = pos.y
        while(tempr>=0)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
                tempr--
            else
                break
        }
        
        //going down
        tempr = pos.x + 1
        tempc = pos.y
        while(tempr<8)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
                tempr++
            else
                break
        }

        //going left
        tempr = pos.x
        tempc = pos.y - 1
        while(tempc>=0)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
                tempc--
            else
                break
        }

        //going right
        tempr = pos.x
        tempc = pos.y + 1
        while(tempc<8)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
                tempc++
            else
                break
        }

        return [legalMoves,attackMoves]
    }
}

export class Knight{
    constructor(color){
        this.color = color
        this.src = chessPieces[`${color}3`]
    }

    possibleMoves(pos,board)
    {
        let legalMoves = []
        let attackMoves = []

        let pms = [{x:pos.x-2,y:pos.y-1},{x:pos.x-2,y:pos.y+1},
                   {x:pos.x+2,y:pos.y-1},{x:pos.x+2,y:pos.y+1},
                   {x:pos.x-1,y:pos.y-2},{x:pos.x+1,y:pos.y-2},
                   {x:pos.x-1,y:pos.y+2},{x:pos.x+1,y:pos.y+2}]

        for(let move of pms)
        {
            checkValid(pos,move,board,legalMoves,attackMoves)
        }

        return [legalMoves,attackMoves]
    }
}

export class Bishop{
    constructor(color){
        this.color = color
        this.src = chessPieces[`${color}4`]
    }

    possibleMoves(pos,board)
    {
        let legalMoves = []
        let attackMoves = []

        //going top-left
        let tempr = pos.x-1
        let tempc = pos.y-1
        while(tempr>=0 && tempc>=0)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
            {
                tempr--
                tempc--
            }
            else break
        }

        //going top-right
        tempr = pos.x-1
        tempc = pos.y+1
        while(tempr>=0 && tempc<8)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
            {
                tempr--
                tempc++
            }
            else break
        }

        //going bottom-left
        tempr = pos.x+1
        tempc = pos.y-1
        while(tempr<8 && tempc>=0)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
            {
                tempr++
                tempc--
            }
            else break
        }

        //going bottom-right
        tempr = pos.x+1
        tempc = pos.y+1
        while(tempr<8 && tempc<8)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
            {
                tempr++
                tempc++
            }
            else break
        }

        return[legalMoves,attackMoves]
    }
}

export class King{
    constructor(color){
        this.color = color
        this.src = chessPieces[`${color}5`]
        this.moveCount = 0
        if(this.color == 1)
        {
            this.x = 7
            this.y = 4
        }
        else
        {
            this.x = 0
            this.y = 4
        }
    }

    possibleMoves(pos,board)
    {
        let legalMoves = []
        let attackMoves = []

        let pms = [{x:pos.x-1,y:pos.y},{x:pos.x-1,y:pos.y-1},{x:pos.x-1,y:pos.y+1},
                   {x:pos.x,y:pos.y-1},{x:pos.x,y:pos.y+1},
                   {x:pos.x+1,y:pos.y-1},{x:pos.x+1,y:pos.y},{x:pos.x+1,y:pos.y+1}]
        
        for(let move of pms)
        {
            if(inBounds(move))
            {
                if(turn==1){
                    if(!(Math.abs(k.x-move.x) <=1 && Math.abs(k.y-move.y) <=1) && !isUnsafe(move,this.color,board))
                        checkValid(pos,move,board,legalMoves,attackMoves)
                }
                else{
                    if(!(Math.abs(K.x-move.x) <=1 && Math.abs(K.y-move.y) <=1) && !isUnsafe(move,this.color,board)){
                        //console.log(move)
                        checkValid(pos,move,board,legalMoves,attackMoves)
                        //console.log(legalMoves)
                    }
                }
            }
        }
        //legalMoves.push({x:0,y:3})
        //console.log(legalMoves)

        //check for castling and add movees accordingly

        //right castle
        if(this.moveCount == 0)
        {
            if(board[pos.x][pos.y+1] == undefined && board[pos.x][pos.y+2] == undefined && !isUnsafe({x:pos.x,y:pos.y+2},this.color,board))
            {
                if(board[pos.x][pos.y+3].src == chessPieces[`${this.color}2`])
                {
                    if(board[pos.x][pos.y+3].moveCount == 0)
                    {
                        legalMoves.push({x:pos.x,y:pos.y+1})
                        legalMoves.push({x:pos.x,y:pos.y+2})
                    }
                }
            }
        }

        //left castle
        if(this.moveCount == 0)
        {
            if(board[pos.x][pos.y-1] == undefined && board[pos.x][pos.y-2] == undefined && board[pos.x][pos.y-3] == undefined && !isUnsafe({x:pos.x,y:pos.y-2},this.color,board))
            {
                if(board[pos.x][pos.y-4].src == chessPieces[`${this.color}2`])
                {
                    if(board[pos.x][pos.y-4].moveCount == 0)
                    {
                        legalMoves.push({x:pos.x,y:pos.y-1})
                        legalMoves.push({x:pos.x,y:pos.y-2})
                    }
                }
            }
        }
        return [legalMoves,attackMoves]
    }
}

export class Queen{
    constructor(color){
        this.color = color
        this.src = chessPieces[`${color}6`]
    }

    possibleMoves(pos,board)
    {
        let legalMoves = []
        let attackMoves = []

        //going top-left
        let tempr = pos.x-1
        let tempc = pos.y-1
        while(tempr>=0 && tempc>=0)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
            {
                tempr--
                tempc--
            }
            else break
        }

        //going top-right
        tempr = pos.x-1
        tempc = pos.y+1
        while(tempr>=0 && tempc<8)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
            {
                tempr--
                tempc++
            }
            else break
        }

        //going bottom-left
        tempr = pos.x+1
        tempc = pos.y-1
        while(tempr<8 && tempc>=0)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
            {
                tempr++
                tempc--
            }
            else break
        }

        //going bottom-right
        tempr = pos.x+1
        tempc = pos.y+1
        while(tempr<8 && tempc<8)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
            {
                tempr++
                tempc++
            }
            else break
        }

        //going up
        tempr = pos.x - 1
        tempc = pos.y
        while(tempr>=0)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
                tempr--
            else
                break
        }
        
        //going down
        tempr = pos.x + 1
        tempc = pos.y
        while(tempr<8)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
                tempr++
            else
                break
        }

        //going left
        tempr = pos.x
        tempc = pos.y - 1
        while(tempc>=0)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
                tempc--
            else
                break
        }

        //going right
        tempr = pos.x
        tempc = pos.y + 1
        while(tempc<8)
        {
            if(checkValid(pos,{x:tempr,y:tempc},board,legalMoves,attackMoves))
                tempc++
            else
                break
        }

        return[legalMoves,attackMoves]
    }
}

export class Pawn{
    constructor(color){
        this.color = color
        this.src = chessPieces[`${color}7`]
        this.moveCount = 0
    }

    possibleMoves(pos,board)
    {
        let legalMoves = []
        let attackMoves = []
    
        if(this.moveCount == 0)
        {
            if(this.color == 1) //white
            {
                if(board[pos.x-1][pos.y] == undefined)
                    checkValid(pos,{x:pos.x-1,y:pos.y},board,legalMoves,attackMoves)
                if(board[pos.x-1][pos.y] == undefined && board[pos.x-2][pos.y] == undefined)
                    {
                        checkValid(pos,{x:pos.x-1,y:pos.y},board,legalMoves,attackMoves)
                        checkValid(pos,{x:pos.x-2,y:pos.y},board,legalMoves,attackMoves)
                    }
            }
            else //black
            {
                if(board[pos.x+1][pos.y] == undefined)
                    checkValid(pos,{x:pos.x+1,y:pos.y},board,legalMoves,attackMoves)
                if(board[pos.x+1][pos.y] == undefined && board[pos.x+2][pos.y] == undefined)
                    {
                        checkValid(pos,{x:pos.x+1,y:pos.y},board,legalMoves,attackMoves)
                        checkValid(pos,{x:pos.x+2,y:pos.y},board,legalMoves,attackMoves)
                    }
            }
        }
        else
        {
            if(this.color == 1) //white
            {
                if(board[pos.x-1][pos.y] == undefined)
                        checkValid(pos,{x:pos.x-1,y:pos.y},board,legalMoves,attackMoves)
            }
            else //black
            {
                if(board[pos.x+1][pos.y] == undefined)
                        checkValid(pos,{x:pos.x+1,y:pos.y},board,legalMoves,attackMoves)
            }
        }

        //attackmoves
        if(this.color == 1) //white
        {
            if(board[pos.x-1][pos.y-1]!=undefined) checkValid(pos,{x:pos.x-1,y:pos.y-1},board,legalMoves,attackMoves)
            if(board[pos.x-1][pos.y+1]!=undefined) checkValid(pos,{x:pos.x-1,y:pos.y+1},board,legalMoves,attackMoves)
        }

        else //black
        {
            if(board[pos.x+1][pos.y-1]!=undefined) checkValid(pos,{x:pos.x+1,y:pos.y-1},board,legalMoves,attackMoves)
            if(board[pos.x+1][pos.y+1]!=undefined) checkValid(pos,{x:pos.x+1,y:pos.y+1},board,legalMoves,attackMoves)
        }

        return [legalMoves,attackMoves]
    }
}