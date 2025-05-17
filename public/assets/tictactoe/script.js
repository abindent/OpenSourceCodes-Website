document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');
    const strikeLine = document.getElementById('strike-line');
    const gameModeSelect = document.getElementById('gameMode');
    const boardElement = document.querySelector('.board');

    // Create AI difficulty selector
    const difficultyContainer = document.createElement('div');
    difficultyContainer.className = 'mode-selection ai-difficulty-selector'; // Added a specific class
    difficultyContainer.innerHTML = `
        <label for="aiDifficultySelect">AI Level:</label>
        <select id="aiDifficultySelect">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="unbeatable" selected>Unbeatable</option>
        </select>
    `;
    
    // Add the difficulty selector to the status area
    const statusArea = document.querySelector('.status-area');
    statusArea.appendChild(difficultyContainer); // Appends it after the existing mode selection
    
    // Get the newly created element
    const aiDifficultySelect = document.getElementById('aiDifficultySelect');
    
    // Show/hide difficulty selector based on game mode
    const updateDifficultyVisibility = () => {
        difficultyContainer.style.display = 
            gameModeSelect.value === 'ai' ? 'flex' : 'none';
    };
    
    // Initial visibility setup
    updateDifficultyVisibility();
    
    // Update visibility when game mode changes
    gameModeSelect.addEventListener('change', updateDifficultyVisibility);

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let isAiOpponent = gameModeSelect.value === 'ai';
    let aiDifficulty = aiDifficultySelect.value; 

    const winningConditions = [
        { combo: [0, 1, 2], class: 'strike-row-0' }, { combo: [3, 4, 5], class: 'strike-row-1' }, { combo: [6, 7, 8], class: 'strike-row-2' },
        { combo: [0, 3, 6], class: 'strike-col-0' }, { combo: [1, 4, 7], class: 'strike-col-1' }, { combo: [2, 5, 8], class: 'strike-col-2' },
        { combo: [0, 4, 8], class: 'strike-diag-0' }, { combo: [2, 4, 6], class: 'strike-diag-1' }
    ];

    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive || (isAiOpponent && currentPlayer === 'O')) {
            // If AI is opponent and it's AI's turn, human cannot click.
            return;
        }

        // Human's move
        makeMove(clickedCell, clickedCellIndex, currentPlayer);

        // If game is still active, it's AI's turn (if AI opponent)
        if (gameActive && isAiOpponent && currentPlayer === 'O') {
            boardElement.classList.add('ai-thinking'); 
            setTimeout(() => {
                aiMove();
                boardElement.classList.remove('ai-thinking');
            }, 600); 
        }
    };

    const makeMove = (cellElement, index, player) => {
        if (board[index] !== '' || !gameActive) {
            return;
        }
        board[index] = player;
        // cellElement.textContent = player; // Text content is hidden by CSS for X/O
        cellElement.classList.add(player); // Add 'X' or 'O' class for styling
        cellElement.style.pointerEvents = 'none'; 

        checkResult();
    };

    const checkResult = () => {
        let roundWon = false;
        let winningLineData = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const { combo, class: strikeClass } = winningConditions[i];
            const a = board[combo[0]];
            const b = board[combo[1]];
            const c = board[combo[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningLineData = winningConditions[i]; // Store the whole object
                break;
            }
        }

        if (roundWon) {
            statusDisplay.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            if (winningLineData) {
                drawStrikeLine(winningLineData.class);
            }
            boardElement.classList.add('game-over'); 
            return;
        }

        if (!board.includes('')) {
            statusDisplay.textContent = 'It\'s a Draw!';
            gameActive = false;
            boardElement.classList.add('game-over');
            return;
        }

        switchPlayer();
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    };

    const checkWinner = (boardState, player) => {
        for (let i = 0; i < winningConditions.length; i++) {
            const { combo } = winningConditions[i];
            if (boardState[combo[0]] === player && boardState[combo[1]] === player && boardState[combo[2]] === player) {
                return true;
            }
        }
        return false;
    };

    const getAvailableMoves = (boardState) => {
        return boardState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    };

    const minimax = (boardState, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
        if (checkWinner(boardState, 'O')) return 100 - depth; // AI (O) wins
        if (checkWinner(boardState, 'X')) return depth - 100; // Human (X) wins
        if (!boardState.includes('')) return 0; // Draw

        if (depth > 7) return evaluateBoard(boardState); // Depth limit for performance in complex states

        const availableMoves = getAvailableMoves(boardState);

        if (isMaximizing) { // AI's turn (O) - wants to maximize score
            let bestScore = -Infinity;
            const sortedMoves = sortMovesForMaximizer(boardState, availableMoves.slice());
            
            for (const move of sortedMoves) {
                boardState[move] = 'O'; 
                const score = minimax(boardState, depth + 1, false, alpha, beta);
                boardState[move] = ''; 
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            return bestScore;
        } else { // Human's turn (X) - wants to minimize score (from AI's perspective)
            let bestScore = Infinity;
            const sortedMoves = sortMovesForMinimizer(boardState, availableMoves.slice());

            for (const move of sortedMoves) {
                boardState[move] = 'X'; 
                const score = minimax(boardState, depth + 1, true, alpha, beta);
                boardState[move] = ''; 
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            return bestScore;
        }
    };
    
    const evaluateBoard = (boardState) => {
        let score = 0;
        const lines = winningConditions.map(wc => wc.combo); 
    
        for (const line of lines) {
            const [a, b, c] = line.map(idx => boardState[idx]); 
            const oCount = (a === 'O') + (b === 'O') + (c === 'O'); 
            const xCount = (a === 'X') + (b === 'X') + (c === 'X'); 
    
            if (oCount === 2 && xCount === 0) score += 10;  // AI has 2 in a row with an empty spot
            else if (oCount === 1 && xCount === 0) score += 1;   // AI has 1 in a row with two empty spots
            if (xCount === 2 && oCount === 0) score -= 10;  // Human has 2 in a row (block them!)
            else if (xCount === 1 && oCount === 0) score -= 1;   // Human has 1 in a row
        }
    
        if (boardState[4] === 'O') score += 3; // Center bonus for AI
        if (boardState[4] === 'X') score -= 3; // Center penalty if Human has it
        
        const corners = [0, 2, 6, 8];
        corners.forEach(corner => {
            if (boardState[corner] === 'O') score += 1;
            if (boardState[corner] === 'X') score -= 1;
        });
        return score;
    };
        
    const sortMovesForMaximizer = (boardState, moves) => {
        return moves.sort((a, b) => {
            const tempBoardA = [...boardState]; tempBoardA[a] = 'O';
            const scoreA = evaluateBoard(tempBoardA);
            const tempBoardB = [...boardState]; tempBoardB[b] = 'O';
            const scoreB = evaluateBoard(tempBoardB);
            return scoreB - scoreA; // Descending for maximizer (higher score is better)
        });
    };
    
    const sortMovesForMinimizer = (boardState, moves) => {
         return moves.sort((a, b) => {
            const tempBoardA = [...boardState]; tempBoardA[a] = 'X';
            const scoreA = evaluateBoard(tempBoardA);
            const tempBoardB = [...boardState]; tempBoardB[b] = 'X';
            const scoreB = evaluateBoard(tempBoardB);
            return scoreA - scoreB; // Ascending for minimizer (lower score is better for AI if human plays optimally)
        });
    };

    const findBestMove = () => { // Used by Medium and Unbeatable AI
        const openingBook = {
            ",,,,,,,,": 4, // Empty board: take center
            "X,,,,,,,,": 4, ",X,,,,,,,": 4, ",,X,,,,,,": 4, ",,,X,,,,,": 4, // Human corner/side, AI center
            ",,,,X,,,,": 0, // Human center: AI takes a corner (e.g., 0)
            "X,,,O,X,,,": 2, 
            "X,X,O,O,,,,": 6, 
        };
        const boardSignature = board.join(",");
        if (openingBook[boardSignature] !== undefined && board[openingBook[boardSignature]] === '') {
            return openingBook[boardSignature];
        }

        // Check for immediate win for AI (O)
        for (const move of getAvailableMoves(board)) {
            board[move] = 'O';
            if (checkWinner(board, 'O')) {
                board[move] = ''; return move;
            }
            board[move] = '';
        }
        // Check for immediate block for Human (X)
        for (const move of getAvailableMoves(board)) {
            board[move] = 'X';
            if (checkWinner(board, 'X')) {
                board[move] = ''; return move; // Block this move
            }
            board[move] = '';
        }
        
        let bestScore = -Infinity;
        let move = null;
        const availableMoves = getAvailableMoves(board);
        
        const strategicMoveOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter(m => availableMoves.includes(m));

        for (const currentMove of strategicMoveOrder) {
            board[currentMove] = 'O'; 
            const score = minimax(board, 0, false); 
            board[currentMove] = ''; 
            if (score > bestScore) {
                bestScore = score;
                move = currentMove;
            }
        }
        return move !== null ? move : availableMoves[0]; 
    };
    
    const findImmediateWinOrBlock = (player) => { // player is 'O' for AI win, 'X' for Human win (to block)
        const availableMoves = getAvailableMoves(board);
        for (const move of availableMoves) {
            board[move] = player; 
            if (checkWinner(board, player)) {
                board[move] = ''; 
                return move; 
            }
            board[move] = ''; 
        }
        return null;
    };
        
    const getWeightedRandomMove = () => { // Used by Medium AI
        const availableMoves = getAvailableMoves(board);
        if (availableMoves.length === 0) return null;
        
        let immediateMove = findImmediateWinOrBlock('O'); 
        if (immediateMove !== null) return immediateMove;
        immediateMove = findImmediateWinOrBlock('X'); 
        if (immediateMove !== null) return immediateMove;

        const weightedMoves = availableMoves.map(move => {
            let weight = 1; 
            if (move === 4) weight += 4; 
            if ([0, 2, 6, 8].includes(move)) weight += 2; 
            
            for (const { combo } of winningConditions) {
                if (combo.includes(move)) {
                    const lineCells = combo.map(idx => idx === move ? 'O' : board[idx]); 
                    const oCount = lineCells.filter(c => c === 'O').length;
                    const xCount = lineCells.filter(c => c === 'X').length;

                    if (oCount === 2 && xCount === 0) weight += 5; 
                    else if (oCount === 1 && xCount === 0) weight += 2; 
                    
                    const tempBoardBlock = [...board];
                    tempBoardBlock[move] = 'X'; 
                     if (checkWinner(tempBoardBlock, 'X')) { 
                         weight += 4; 
                     }
                }
            }
            return { move, weight };
        });
        
        const totalWeight = weightedMoves.reduce((sum, { weight }) => sum + weight, 0);
        if (totalWeight === 0) return availableMoves[Math.floor(Math.random() * availableMoves.length)];

        let randomVal = Math.random() * totalWeight;
        for (const { move, weight } of weightedMoves) {
            randomVal -= weight;
            if (randomVal <= 0) return move;
        }
        return availableMoves[availableMoves.length - 1]; 
    };

    const aiMove = () => {
        if (!gameActive || currentPlayer !== 'O') return;

        let moveIndex = null;
        const difficulty = aiDifficultySelect.value;
        const availableMoves = getAvailableMoves(board);

        if (availableMoves.length === 0) {
            console.error("AI tried to move but no spots available.");
            alert("AI tried to move but no spots available.")
            return; 
        }

        switch (difficulty) {
            case 'easy':
                // Easy AI: Picks a purely random available spot.
                // It does not check for wins or blocks.
                moveIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                break;
            case 'medium':
                // Medium AI: First checks for immediate win or block.
                // Then, 70% chance for minimax, 30% for weighted random.
                const aiWinningMoveMed = findImmediateWinOrBlock('O');
                if (aiWinningMoveMed !== null && board[aiWinningMoveMed] === '') {
                    moveIndex = aiWinningMoveMed;
                } else {
                    const humanWinningMoveToBlockMed = findImmediateWinOrBlock('X');
                    if (humanWinningMoveToBlockMed !== null && board[humanWinningMoveToBlockMed] === '') {
                        moveIndex = humanWinningMoveToBlockMed;
                    } else {
                        if (Math.random() < 0.70) {
                            moveIndex = findBestMove();
                        } else {
                            moveIndex = getWeightedRandomMove();
                        }
                    }
                }
                break;
            case 'unbeatable':
            default:
                // Unbeatable AI: Always checks for immediate win/block first, then uses findBestMove (minimax).
                // Note: findBestMove already includes win/block checks, but an explicit check here is fine.
                const aiWinningMoveUnb = findImmediateWinOrBlock('O');
                if (aiWinningMoveUnb !== null && board[aiWinningMoveUnb] === '') {
                    moveIndex = aiWinningMoveUnb;
                } else {
                    const humanWinningMoveToBlockUnb = findImmediateWinOrBlock('X');
                    if (humanWinningMoveToBlockUnb !== null && board[humanWinningMoveToBlockUnb] === '') {
                        moveIndex = humanWinningMoveToBlockUnb;
                    } else {
                        moveIndex = findBestMove();
                    }
                }
                break;
        }
        
        // Fallback if moveIndex is somehow not set or invalid after difficulty logic
        if (moveIndex === null || moveIndex === undefined || board[moveIndex] !== '') {
            console.warn("AI move selection resulted in null or invalid state. Fallback to first available.", {moveIndex, board_val: board[moveIndex], difficulty});
            if (availableMoves.length > 0) { // Ensure there are still available moves
                 moveIndex = availableMoves[0]; // Pick the first available as a last resort
            } else {
                console.error("AI Fallback: No available moves left.");
                return; // No move can be made
            }
        }

        // Make the move
        if (moveIndex !== null && board[moveIndex] === '') {
            const aiCellElement = document.querySelector(`.cell[data-index='${moveIndex}']`);
            makeMove(aiCellElement, moveIndex, 'O');
        } else {
            console.error("AI final attempt to move: moveIndex invalid or cell taken after all checks.", {moveIndex, cell_value: board[moveIndex]});
        }
    };

    const drawStrikeLine = (strikeClass) => {
        if (!strikeClass) return;
        strikeLine.className = 'strike-line'; // Reset classes first
        strikeLine.classList.add(strikeClass); 
        strikeLine.style.display = 'block';
    };

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X'; 
        isAiOpponent = gameModeSelect.value === 'ai';
        aiDifficulty = aiDifficultySelect.value; 

        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        boardElement.classList.remove('game-over', 'ai-thinking');

        cells.forEach(cell => {
            cell.textContent = ''; 
            cell.classList.remove('X', 'O');
            cell.style.pointerEvents = 'auto'; 
        });

        strikeLine.className = 'strike-line'; 
        strikeLine.style.display = 'none'; 

        updateDifficultyVisibility(); 
    };

    gameModeSelect.addEventListener('change', (event) => {
        isAiOpponent = event.target.value === 'ai';
        resetGame(); 
    });
    
    aiDifficultySelect.addEventListener('change', (event) => {
        aiDifficulty = event.target.value;
        resetGame(); 
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);

    // Initial setup
    resetGame(); 
});
