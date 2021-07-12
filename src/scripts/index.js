const gridSize = 15;
const grid = document.querySelector('.grid');

function createGrid() {
    for (let i=0; i < gridSize*gridSize; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        square.classList.add('square');
    }
}

createGrid();