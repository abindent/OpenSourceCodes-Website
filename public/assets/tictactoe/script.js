document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');
    const strikeLine = document.getElementById('strike-line');
    const gameModeSelect = document.getElementById('gameMode');
    const boardElement = document.querySelector('.board');

    // Create AI difficulty selector
    const difficultyContainer = document.createElement('div');
    difficultyContainer.className = 'mode-selection ai-difficulty-selector';
    difficultyContainer.innerHTML = `
        <label for="aiDifficultySelect">Level</label>
        <select id="aiDifficultySelect">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="unbeatable" selected>Unbeatable</option>
        </select>
    `;

    const statusArea = document.querySelector('.status-area');
    statusArea.appendChild(difficultyContainer);

    const aiDifficultySelect = document.getElementById('aiDifficultySelect');

    const updateDifficultyVisibility = () => {
        difficultyContainer.style.display =
            gameModeSelect.value === 'ai' ? 'flex' : 'none';
    };

    updateDifficultyVisibility();
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
            return;
        }

        makeMove(clickedCell, clickedCellIndex, currentPlayer);

        if (gameActive && isAiOpponent && currentPlayer === 'O') {
            boardElement.classList.add('ai-thinking');
            setTimeout(() => {
                aiMove();
                boardElement.classList.remove('ai-thinking');
            }, 600);
        }
    };

    const makeMove = (cellElement, index, player) => {
        if (board[index] !== '' || !gameActive) return;
        board[index] = player;
        cellElement.classList.add(player);
        cellElement.style.pointerEvents = 'none';
        checkResult();
    };

    const checkResult = () => {
        let roundWon = false;
        let winningLineData = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const { combo, class: strikeClass } = winningConditions[i];
            const a = board[combo[0]], b = board[combo[1]], c = board[combo[2]];
            if (a === '' || b === '' || c === '') continue;
            if (a === b && b === c) {
                roundWon = true;
                winningLineData = winningConditions[i];
                break;
            }
        }

        if (roundWon) {
            statusDisplay.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            if (winningLineData) drawStrikeLine(winningLineData.class);
            boardElement.classList.add('game-over');
            return;
        }

        if (!board.includes('')) {
            statusDisplay.textContent = "It's a Draw!";
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
            if (boardState[combo[0]] === player && boardState[combo[1]] === player && boardState[combo[2]] === player) return true;
        }
        return false;
    };

    const getAvailableMoves = (boardState) =>
        boardState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

    const minimax = (boardState, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
        if (checkWinner(boardState, 'O')) return 100 - depth;
        if (checkWinner(boardState, 'X')) return depth - 100;
        if (!boardState.includes('')) return 0;
        if (depth > 7) return evaluateBoard(boardState);

        const availableMoves = getAvailableMoves(boardState);

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (const move of sortMovesForMaximizer(boardState, availableMoves.slice())) {
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
            for (const move of sortMovesForMinimizer(boardState, availableMoves.slice())) {
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
        const lines = winningConditions.map(wc => wc.combo);
        for (const line of lines) {
            const [a, b, c] = line.map(idx => boardState[idx]);
            const oCount = (a === 'O') + (b === 'O') + (c === 'O');
            const xCount = (a === 'X') + (b === 'X') + (c === 'X');
            if (oCount === 2 && xCount === 0) score += 10;
            else if (oCount === 1 && xCount === 0) score += 1;
            if (xCount === 2 && oCount === 0) score -= 10;
            else if (xCount === 1 && oCount === 0) score -= 1;
        }
        if (boardState[4] === 'O') score += 3;
        if (boardState[4] === 'X') score -= 3;
        [0, 2, 6, 8].forEach(corner => {
            if (boardState[corner] === 'O') score += 1;
            if (boardState[corner] === 'X') score -= 1;
        });
        return score;
    };

    const sortMovesForMaximizer = (boardState, moves) =>
        moves.sort((a, b) => {
            const tA = [...boardState]; tA[a] = 'O';
            const tB = [...boardState]; tB[b] = 'O';
            return evaluateBoard(tB) - evaluateBoard(tA);
        });

    const sortMovesForMinimizer = (boardState, moves) =>
        moves.sort((a, b) => {
            const tA = [...boardState]; tA[a] = 'X';
            const tB = [...boardState]; tB[b] = 'X';
            return evaluateBoard(tA) - evaluateBoard(tB);
        });

    const findBestMove = () => {
        const openingBook = {
            ",,,,,,,,": 4,
            "X,,,,,,,,": 4, ",X,,,,,,,": 4, ",,X,,,,,,": 4, ",,,X,,,,,": 4,
            ",,,,X,,,,": 0,
            "X,,,O,X,,,": 2,
            "X,X,O,O,,,,": 6,
        };
        const boardSignature = board.join(",");
        if (openingBook[boardSignature] !== undefined && board[openingBook[boardSignature]] === '') {
            return openingBook[boardSignature];
        }

        for (const move of getAvailableMoves(board)) {
            board[move] = 'O';
            if (checkWinner(board, 'O')) { board[move] = ''; return move; }
            board[move] = '';
        }
        for (const move of getAvailableMoves(board)) {
            board[move] = 'X';
            if (checkWinner(board, 'X')) { board[move] = ''; return move; }
            board[move] = '';
        }

        let bestScore = -Infinity, move = null;
        const available = getAvailableMoves(board);
        for (const currentMove of [4, 0, 2, 6, 8, 1, 3, 5, 7].filter(m => available.includes(m))) {
            board[currentMove] = 'O';
            const score = minimax(board, 0, false);
            board[currentMove] = '';
            if (score > bestScore) { bestScore = score; move = currentMove; }
        }
        return move !== null ? move : available[0];
    };

    const findImmediateWinOrBlock = (player) => {
        for (const move of getAvailableMoves(board)) {
            board[move] = player;
            if (checkWinner(board, player)) { board[move] = ''; return move; }
            board[move] = '';
        }
        return null;
    };

    const getWeightedRandomMove = () => {
        const available = getAvailableMoves(board);
        if (available.length === 0) return null;
        let immediateMove = findImmediateWinOrBlock('O');
        if (immediateMove !== null) return immediateMove;
        immediateMove = findImmediateWinOrBlock('X');
        if (immediateMove !== null) return immediateMove;

        const weightedMoves = available.map(move => {
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
                    const tempBoard = [...board]; tempBoard[move] = 'X';
                    if (checkWinner(tempBoard, 'X')) weight += 4;
                }
            }
            return { move, weight };
        });

        const totalWeight = weightedMoves.reduce((sum, { weight }) => sum + weight, 0);
        if (totalWeight === 0) return available[Math.floor(Math.random() * available.length)];
        let randomVal = Math.random() * totalWeight;
        for (const { move, weight } of weightedMoves) {
            randomVal -= weight;
            if (randomVal <= 0) return move;
        }
        return available[available.length - 1];
    };

    const aiMove = () => {
        if (!gameActive || currentPlayer !== 'O') return;
        let moveIndex = null;
        const difficulty = aiDifficultySelect.value;
        const available = getAvailableMoves(board);
        if (available.length === 0) return;

        if (difficulty === 'easy') {
            // Easy: avoids strong positions entirely — prefers sides, then corners, never center first.
            // Also never intentionally wins; if a winning move exists it's ignored.
            const badMoveOrder = [1, 3, 5, 7, 0, 2, 6, 8, 4]; // sides → corners → center (weakest first)
            const easyPool = badMoveOrder.filter(m => available.includes(m));
            // Pick randomly from only the first ~half of the weak pool so it feels varied but genuinely bad
            const poolSize = Math.max(1, Math.ceil(easyPool.length * 0.6));
            moveIndex = easyPool[Math.floor(Math.random() * poolSize)];

        } else if (difficulty === 'medium') {
            const winMed = findImmediateWinOrBlock('O');
            if (winMed !== null && board[winMed] === '') { moveIndex = winMed; }
            else {
                const blockMed = findImmediateWinOrBlock('X');
                if (blockMed !== null && board[blockMed] === '') { moveIndex = blockMed; }
                else { moveIndex = Math.random() < 0.70 ? findBestMove() : getWeightedRandomMove(); }
            }

        } else {
            // Unbeatable: full minimax + fork-seeking bonus.
            // Actively hunts for moves that create 2+ simultaneous threats (forks).
            const countThreats = (b, player) => {
                let threats = 0;
                for (const { combo } of winningConditions) {
                    const vals = combo.map(i => b[i]);
                    if (vals.filter(v => v === player).length === 2 && vals.filter(v => v === '').length === 1)
                        threats++;
                }
                return threats;
            };

            let bestScore = -Infinity;
            let bestMoves = [];
            for (const move of [4, 0, 2, 6, 8, 1, 3, 5, 7].filter(m => available.includes(m))) {
                board[move] = 'O';
                let score = minimax(board, 0, false);
                if (countThreats(board, 'O') >= 2) score += 15; // big fork bonus
                board[move] = '';
                if (score > bestScore) { bestScore = score; bestMoves = [move]; }
                else if (score === bestScore) bestMoves.push(move);
            }
            // Among equally best moves, randomise so it doesn't feel scripted
            moveIndex = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        }

        if (moveIndex === null || moveIndex === undefined || board[moveIndex] !== '') {
            moveIndex = available.length > 0 ? available[0] : null;
        }
        if (moveIndex !== null && board[moveIndex] === '') {
            const aiCell = document.querySelector(`.cell[data-index='${moveIndex}']`);
            makeMove(aiCell, moveIndex, 'O');
        }
    };

    const drawStrikeLine = (strikeClass) => {
        if (!strikeClass) return;
        strikeLine.className = 'strike-line';
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

    gameModeSelect.addEventListener('change', (e) => { isAiOpponent = e.target.value === 'ai'; resetGame(); });
    aiDifficultySelect.addEventListener('change', (e) => { aiDifficulty = e.target.value; resetGame(); });
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);

    resetGame();
});