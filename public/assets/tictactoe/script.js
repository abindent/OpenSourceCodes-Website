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

        if (board[clickedCellIndex] !== '' || !gameActive) {
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
        if (checkWinner(boardState, 'O')) return 100 - depth; 
        if (checkWinner(boardState, 'X')) return depth - 100; 
        if (!boardState.includes('')) return 0; 

        if (depth > 7) return evaluateBoard(boardState); // Depth limit for performance

        const availableMoves = getAvailableMoves(boardState);

        if (isMaximizing) {
            let bestScore = -Infinity;
            const sortedMoves = sortMovesForMaximizer(boardState, availableMoves.slice()); // Use a copy for sorting
            
            for (const move of sortedMoves) {
                boardState[move] = 'O'; 
                const score = minimax(boardState, depth + 1, false, alpha, beta);
                boardState[move] = ''; 
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) break; 
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            const sortedMoves = sortMovesForMinimizer(boardState, availableMoves.slice()); // Use a copy for sorting

            for (const move of sortedMoves) {
                boardState[move] = 'X'; 
                const score = minimax(boardState, depth + 1, true, alpha, beta);
                boardState[move] = ''; 
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) break; 
            }
            return bestScore;
        }
    };
    
    const evaluateBoard = (boardState) => {
        let score = 0;
        const lines = winningConditions.map(wc => wc.combo); // Get just the combo arrays
    
        for (const line of lines) {
            const [a, b, c] = line.map(idx => boardState[idx]); // Get 'X', 'O', or ''
            const oCount = (a === 'O') + (b === 'O') + (c === 'O'); // Count 'O's
            const xCount = (a === 'X') + (b === 'X') + (c === 'X'); // Count 'X's
    
            if (oCount === 2 && xCount === 0) score += 10;  // AI has 2 in a row with an empty spot
            else if (oCount === 1 && xCount === 0) score += 1;   // AI has 1 in a row with two empty spots
            if (xCount === 2 && oCount === 0) score -= 10;  // Human has 2 in a row (block them!)
            else if (xCount === 1 && oCount === 0) score -= 1;   // Human has 1 in a row
        }
    
        if (boardState[4] === 'O') score += 3; // Center bonus for AI
        if (boardState[4] === 'X') score -= 3; // Center bonus for Human (means AI should avoid this)
        
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
            return scoreB - scoreA; // Descending for maximizer
        });
    };
    
    const sortMovesForMinimizer = (boardState, moves) => {
         return moves.sort((a, b) => {
            const tempBoardA = [...boardState]; tempBoardA[a] = 'X';
            const scoreA = evaluateBoard(tempBoardA);
            const tempBoardB = [...boardState]; tempBoardB[b] = 'X';
            const scoreB = evaluateBoard(tempBoardB);
            return scoreA - scoreB; // Ascending for minimizer
        });
    };

    const findBestMove = () => {
        const openingBook = {
            ",,,,,,,,": 4, "X,,,,,,,,": 4, ",,X,,,,,,": 4, ",,,,,,X,,": 4, ",,,,,,,,X": 4,
            ",,,,X,,,,": 0, // If human takes center, AI takes a corner
            // Simple responses to common human center + corner plays
            "X,,,O,,,,": 2, // Human: 0, AI: 4 -> AI plays 2 (or 6, 8)
            ",,X,O,,,,": 0, // Human: 2, AI: 4 -> AI plays 0 (or 6, 8)
            ",,,,O,,X,": 0, // Human: 6, AI: 4 -> AI plays 0 (or 2, 8)
            ",,,,O,,,X": 2, // Human: 8, AI: 4 -> AI plays 2 (or 0, 6)
        };
        const boardSignature = board.join(",");
        if (openingBook[boardSignature] !== undefined && board[openingBook[boardSignature]] === '') {
            return openingBook[boardSignature];
        }

        // Check for immediate win for AI
        for (const move of getAvailableMoves(board)) {
            board[move] = 'O';
            if (checkWinner(board, 'O')) {
                board[move] = ''; return move;
            }
            board[move] = '';
        }
        // Check for immediate block for Human
        for (const move of getAvailableMoves(board)) {
            board[move] = 'X';
            if (checkWinner(board, 'X')) {
                board[move] = ''; return move;
            }
            board[move] = '';
        }
        
        let bestScore = -Infinity;
        let move = null;
        const availableMoves = getAvailableMoves(board);
        
        // Prioritize center, then corners, then sides
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
        return move !== null ? move : availableMoves[0]; // Fallback if no move found (should not happen)
    };

    const aiMove = () => {
        if (!gameActive || currentPlayer !== 'O') return;

        let moveIndex;
        const difficulty = aiDifficultySelect.value; // Get current difficulty

        switch (difficulty) {
            case 'easy':
                moveIndex = Math.random() < 0.3 ? findBestMove() : getWeightedRandomMove();
                break;
            case 'medium':
                moveIndex = Math.random() < 0.7 ? findBestMove() : getWeightedRandomMove();
                break;
            case 'unbeatable':
            default:
                moveIndex = findBestMove();
                break;
        }
        
        if (moveIndex !== null && board[moveIndex] === '') {
            const aiCellElement = document.querySelector(`.cell[data-index='${moveIndex}']`);
            makeMove(aiCellElement, moveIndex, 'O');
        } else {
            // Fallback if something went wrong, pick any available spot
            const available = getAvailableMoves(board);
            if (available.length > 0) {
                 const fallbackMoveIndex = available[Math.floor(Math.random() * available.length)];
                 const aiCellElement = document.querySelector(`.cell[data-index='${fallbackMoveIndex}']`);
                 makeMove(aiCellElement, fallbackMoveIndex, 'O');
            }
        }
    };
    
    const findImmediateWinOrBlock = (player) => { // Player is 'O' for win, 'X' for block
        const opponent = player === 'O' ? 'X' : 'O';
        for (const move of getAvailableMoves(board)) {
            board[move] = player; // Try making a move for 'player'
            if (checkWinner(board, player)) {
                board[move] = ''; return move; // This move wins for 'player'
            }
            board[move] = ''; // Undo
        }
        return null;
    };
        
    const getWeightedRandomMove = () => {
        const availableMoves = getAvailableMoves(board);
        if (availableMoves.length === 0) return null;
        
        // Check for immediate win or block first even in weighted random
        let immediateMove = findImmediateWinOrBlock('O'); // Try to win
        if (immediateMove !== null) return immediateMove;
        immediateMove = findImmediateWinOrBlock('X'); // Try to block
        if (immediateMove !== null) return immediateMove;

        const weightedMoves = availableMoves.map(move => {
            let weight = 1; 
            if (move === 4) weight += 4; // Center
            if ([0, 2, 6, 8].includes(move)) weight += 2; // Corners
            
            // Check potential lines
            for (const { combo } of winningConditions) {
                if (combo.includes(move)) {
                    const lineCells = combo.map(idx => board[idx]);
                    const oCount = lineCells.filter(c => c === 'O').length;
                    const xCount = lineCells.filter(c => c === 'X').length;
                    if (oCount === 1 && xCount === 0) weight += 2; // One O, no X
                    if (oCount === 0 && xCount === 1) weight += 1; // One X, no O (less important to take but good)
                }
            }
            return { move, weight };
        });
        
        const totalWeight = weightedMoves.reduce((sum, { weight }) => sum + weight, 0);
        if (totalWeight === 0) return availableMoves[Math.floor(Math.random() * availableMoves.length)]; // Pure random if no weights

        let randomVal = Math.random() * totalWeight;
        for (const { move, weight } of weightedMoves) {
            randomVal -= weight;
            if (randomVal <= 0) return move;
        }
        return availableMoves[0]; // Fallback
    };

    const drawStrikeLine = (strikeClass) => {
        if (!strikeClass) return;
        strikeLine.className = ''; 
        strikeLine.classList.add(strikeClass); 
        strikeLine.style.display = 'block';
    };

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        isAiOpponent = gameModeSelect.value === 'ai';
        // aiDifficulty is already updated by its event listener

        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        boardElement.classList.remove('game-over', 'ai-thinking');

        cells.forEach(cell => {
            cell.textContent = ''; // Clear any residual text (though hidden by CSS)
            cell.classList.remove('X', 'O');
            cell.style.pointerEvents = 'auto'; 
        });

        strikeLine.className = ''; 
        strikeLine.style.display = 'none'; 

        // Use the direct reference to difficultyContainer
        difficultyContainer.style.display = isAiOpponent ? 'flex' : 'none';

        if (isAiOpponent && currentPlayer === 'O') { 
            boardElement.classList.add('ai-thinking');
            setTimeout(() => {
                aiMove();
                boardElement.classList.remove('ai-thinking');
            }, 500);
        }
    };

    gameModeSelect.addEventListener('change', (event) => {
        isAiOpponent = event.target.value === 'ai';
        // Visibility of AI difficulty is handled by its own listener now.
        resetGame(); 
    });
    
    aiDifficultySelect.addEventListener('change', (event) => {
        aiDifficulty = event.target.value; // Update global aiDifficulty
        // No need to reset game here if only difficulty changes, 
        // unless desired. Current behavior resets on mode change.
        // If a reset is desired on difficulty change mid-game:
        // resetGame(); 
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);

    // Initial setup
    resetGame(); 
});