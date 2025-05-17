const cellStatus = {
    HIDDEN : "hidden",
    MINE : "mine",
    SAFE : "safe",
}

export function createBoard(boardSize, mineCount){
    const board = [];
    const minePositions = getMinePositions(boardSize, mineCount);
    for(let x = 0; x < boardSize; x++){
        const row = [];
        for(let y = 0; y < boardSize; y++){
            const element = document.createElement("div");
            element.dataset.status = cellStatus.HIDDEN;
            const cell = {
                element,
                x, 
                y,
                mine: minePositions.some(positionMatch.bind(null, {x, y})),
                get status(){
                    return this.element.dataset.status;
                },
                set status(value){
                    this.element.dataset.status = value;
                },
            }
            row.push(cell);
        }
        board.push(row);
    }
    return board;
}

function getMinePositions(boardSize, mineCount){
    const positions = [];
    while(positions.length < mineCount){
        const position = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
        }
        if(!positions.some(positionMatch.bind(null, position))){
            positions.push(position);
        }
    }
    return positions;
}

function positionMatch(a, b){
    return a.x === b.x && a.y === b.y;
}