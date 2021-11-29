document.addEventListener('DOMContentLoaded', () =>{
    const userGrid = document.querySelector('.user-grid');
    const aiGrid = document.querySelector('.ai-grid');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const cruiser = document.querySelector('.cruiser-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');
    
    const startButton = document.querySelector('#start')
    const rotateButton = document.querySelector('#rotate')
    const turnDisplay = document.querySelector('#whose-turn')
    const info = document.querySelector('#info')

    let isHorizontal = true;

    let isGameOver = false;
    let currentPlayer = 'user';

    const width = 10;
    const userSquares = [];
    const aiSquares = [];

    function createBoard(grid, squares, width){
        for (let i = 0; i < width * width; i++){
            const square = document.createElement('div');
            // square.classList.add('node');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square)
        }
    }

    createBoard(userGrid, userSquares, width);
    createBoard(aiGrid, aiSquares, width);

    const shipArray = [
        {
            name: 'destroyer',
            directions: [
                [0,1],
                [0,width]
            ]
        },
        {
            name: 'submarine',
            directions: [
                [0,1,2],
                [0,width, 2*width]
            ]
        },
        {
            name: 'cruiser',
            directions: [
                [0,1,2],
                [0,width, 2*width]
            ]
        },
        {
            name: 'battleship',
            directions: [
                [0,1,2,3],
                [0,width, 2*width,3*width]
            ]
        },
        {
            name: 'carrier',
            directions: [
                [0,1,2,3,4],
                [0,width, 2*width,3*width,4*width]
            ]
        }
    ]

    function generateShip(ship){
        let randomDirection = Math.floor(Math.random() * ship.directions.length);
        let current = ship.directions[randomDirection];

        if (randomDirection === 0){ 
            direction = 1;
        }

        if (randomDirection === 1){
            direction = 10;
        }

        let randomStart = Math.abs(Math.floor(Math.random() * aiSquares.length - (ship.directions[0].length * direction)));
    
        const isTaken = current.some(index => aiSquares[randomStart + index].classList.contains('taken'));
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1);
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0);
    
        if (!isTaken && !isAtRightEdge && !isAtLeftEdge){
            current.forEach(index => aiSquares[randomStart + index].classList.add('taken', ship.name));
        }else{
            generateShip(ship)
        }
    }

    generateShip(shipArray[0]);
    generateShip(shipArray[1]);
    generateShip(shipArray[2]);
    generateShip(shipArray[3]);
    generateShip(shipArray[4]);

    //rotateships

    function rotate(){
        if (isHorizontal){
            destroyer.classList.toggle('destroyer-container-vertical');
            submarine.classList.toggle('submarine-container-vertical');
            cruiser.classList.toggle('cruiser-container-vertical');
            battleship.classList.toggle('battleship-container-vertical');
            carrier.classList.toggle('carrier-container-vertical');
            isHorizontal = false;
            return;
        }

        if(!isHorizontal){
            destroyer.classList.toggle('destroyer-container-vertical');
            submarine.classList.toggle('submarine-container-vertical');
            cruiser.classList.toggle('cruiser-container-vertical');
            battleship.classList.toggle('battleship-container-vertical');
            carrier.classList.toggle('carrier-container-vertical');
            isHorizontal = true;
            return;
        }
        
    }

    rotateButton.addEventListener('click',rotate);

    //move around userShips

    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))
    userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;

    

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id;
        console.log(selectedShipNameWithIndex)
    
    }))

    function dragStart(){
        draggedShip = this;
        draggedShipLength = this.children.length;
    }
    function dragOver(e){
        e.preventDefault();
    }
    function dragEnter(e){
        e.preventDefault();
    }
    function dragLeave(e){
        e.preventDefault();
    }
    function dragDrop(){

        let shipNameWithLastId = draggedShip.lastElementChild.id;
        console.log(shipNameWithLastId)
        let shipClass =  shipNameWithLastId.slice(0,-2);
        console.log(shipClass)
        let lastShipIndex = parseInt(shipNameWithLastId.slice(-1));
        let shipLastId;

        if (isHorizontal){
            shipLastId = lastShipIndex + parseInt(this.dataset.id);
        // console.log(lastShipId)
            selectedShipIndex = parseInt(selectedShipNameWithIndex.slice(-1));
            shipLastId = shipLastId - selectedShipIndex;
            // console.log(shipLastId);
        }else{
            shipLastId = lastShipIndex*width + parseInt(this.dataset.id);
        // console.log(lastShipId)
            selectedShipIndex = parseInt(selectedShipNameWithIndex.slice(-1))*width;
            shipLastId = shipLastId - selectedShipIndex;
            // console.log(shipLastId);
        }
        console.log(shipLastId);
        

        // console.log(newNotAllowedVertical)

        console.log("length" + draggedShipLength)
        if (isHorizontal && isHorizontalAllowed(shipLastId, lastShipIndex)){
            for (let i = 0; i < draggedShipLength; i++){
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
            }
        }else if (!isHorizontal && isVerticalAllowed(shipLastId, lastShipIndex)){
            
            for (let i = 0; i < draggedShipLength; i++){
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipClass);
            }
        }else{
            return;
        }

        displayGrid.removeChild(draggedShip);
    }
    function dragEnd(){
        
    }

    function isHorizontalAllowed(shipLastId, lastShipIndex){
        let invalidColumnRange = lastShipIndex - 1;
        if (shipLastId % 10 <= invalidColumnRange){
            return false;
        }else{
            return true;
        }
    }

    function isVerticalAllowed(shipLastId, lastShipIndex){
        let invalidRowRange = lastShipIndex * 10;
        if (shipLastId > 99 || shipLastId < invalidRowRange){
            return false;
        }else{
            return true;
        }
    }

    //Game Logic

    function playGame(){
        if (isGameOver) return
        
        if (currentPlayer === 'user'){
            turnDisplay.innerHTML = "Your Turn"
            aiSquares.forEach(square => square.addEventListener('click', function(e) {
                revealSquare(square);
            }))
        }else if (currentPlayer === 'ai'){
            turnDisplay.innerHTML = "Computer Turn"
            setTimeout(aiTurn, 1000)
        }
    }

    startButton.addEventListener('click', playGame)

    let destroyerCount = 0;
    let submarineCount = 0 ;
    let cruiserCount = 0;
    let battleshipCount = 0;
    let carrierCount = 0;

    function revealSquare(square){

        if(!square.classList.contains('hit')){
            if (square.classList.contains('destroyer')) destroyerCount++;
            if (square.classList.contains('submarine')) submarineCount++;
            if (square.classList.contains('cruiser')) cruiserCount++;
            if (square.classList.contains('battleship')) battleshipCount++;
            if (square.classList.contains('carrier')) carrierCount++;
        }
        if(square.classList.contains('taken')){
            square.classList.add('hit');
        }else{
            square.classList.add('miss');
        }

        currentPlayer = 'ai';
        playGame()
    }

    let aiDestroyerCount = 0;
    let aiSubmarineCount = 0 ;
    let aiCruiserCount = 0;
    let aiBattleshipCount = 0;
    let aiCarrierCount = 0;

    function aiTurn(){

        let random = Math.floor(Math.random() * userSquares.length);

        if(!userSquares[random].classList.contains('hit')){
            if (userSquares[random].classList.contains('destroyer')) aiDestroyerCount++;
            if (userSquares[random].classList.contains('submarine')) aiSubmarineCount++;
            if (userSquares[random].classList.contains('cruiser')) aiCruiserCount++;
            if (userSquares[random].classList.contains('battleship')) aiBattleshipCount++;
            if (userSquares[random].classList.contains('carrier')) aiCarrierCount++;
        }else{
            aiTurn()
        }
        
        if(userSquares[random].classList.contains('taken')){
            userSquares[random].classList.add('hit');
        }else{
            userSquares[random].classList.add('miss');
        }
        currentPlayer = 'user';
    }

    function checkForWins(){
        if (destroyerCount === 2){
            info.innerHTML = "You sunk enemy's destroyer"
            destroyerCount = 10;
        }
        if (submarine === 3){
            info.innerHTML = "You sunk enemy's submarine"
            submarineCount = 10;
        }
        if (cruiserCount === 3){
            info.innerHTML = "You sunk enemy's cruiser"
            cruiserCount = 10;
        }
        if (battleshipCount === 4){
            info.innerHTML = "You sunk enemy's battleship"
            battleshipCount = 10;
        }
        if (carrierCount === 5){
            info.innerHTML = "You sunk enemy's carrier"
            carrierCount = 10;
        }

        if (aiDestroyerCount === 2){
            info.innerHTML = "You sunk enemy's aiDestroyer"
            aiDestroyerCount = 10;
        }
        if (aiSubmarine === 3){
            info.innerHTML = "You sunk enemy's aiSubmarine"
            aiSubmarineCount = 10;
        }
        if (aiCruiserCount === 3){
            info.innerHTML = "You sunk enemy's aiCruiser"
            aiCruiserCount = 10;
        }
        if (aiBattleshipCount === 4){
            info.innerHTML = "You sunk enemy's aiBattleship"
            aiBattleshipCount = 10;
        }
        if (aiCarrierCount === 5){
            info.innerHTML = "You sunk enemy's aiCarrier"
            aiCarrierCount = 10;
        }

        if (destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount === 50){
            info.innerHTML = "You won"
            gameOver()
        }

        if (aiDestroyerCount + aiSubmarineCount + aiCruiserCount + aiBattleshipCount + aiCarrierCount === 50){
            info.innerHTML = "You won"
            gameOver()
        }

    }

    function gameOver(){
        isGameOver = true;
        startButton.removeEventListener('click', playGame)
    }

    
})