
export const CELL_SIZE = 50


export class Grid{
    constructor(){
        const grid = document.createElement('div')
        grid.style.display = `grid`
        grid.style.gridTemplateColumns = `repeat(8,${CELL_SIZE}px)`
        let switcher = 1
        let cellGrid = new Array()
        for(let i = 0; i < 8 ; i++){
            let subArray = new Array()
            switcher = !switcher
            for(let j = 0; j < 8 ; j++){
                const cell = document.createElement('div')
                if (switcher){
                    cell.classList.add('c1')
                }
                else{
                    cell.classList.add('c2')
                }
                switcher = !switcher
                cell.style.border = `1px solid black`
                cell.style.width = `${CELL_SIZE}px`
                cell.style.height = `${CELL_SIZE}px`
                cell.style.cursor = 'pointer'
                cell.id = `${i}${j}`

                subArray.push(cell)
                grid.appendChild(cell)
            }
            cellGrid.push(subArray)
        }

        document.body.appendChild(grid)
        return cellGrid
    }
}