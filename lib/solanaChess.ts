use anchor_lang::prelude::*;

declare_id!("Hp8cLdkPkHkSW9PbXutVUmoDR8pWbrqXLRbY3TmVj5kn");

#[program]
pub mod solana_chess {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, stake: u64) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.white = ctx.accounts.player.key();
        game.black = Pubkey::default();
        game.stake = stake;
        game.state = GameState::WaitingForOpponent;
        game.current_turn = 0;
        game.board = initial_board();
        game.en_passant = None;
        game.castling_rights = [true, true, true, true]; // WK, WQ, BK, BQ
        game.half_move_clock = 0;
        game.full_move_number = 1;
        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.state == GameState::WaitingForOpponent, ErrorCode::GameAlreadyStarted);
        game.black = ctx.accounts.player.key();
        game.state = GameState::InProgress;
        Ok(())
    }

    pub fn make_move(ctx: Context<MakeMove>, from: u8, to: u8, promotion: Option<PieceType>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.state == GameState::InProgress, ErrorCode::GameNotInProgress);

        let player = ctx.accounts.player.key();
        let is_white_turn = game.current_turn % 2 == 0;

        if is_white_turn {
            require!(player == game.white, ErrorCode::NotPlayerTurn);
        } else {
            require!(player == game.black, ErrorCode::NotPlayerTurn);
        }

        // Check if the move is valid
        require!(is_valid_move(game, from, to, promotion), ErrorCode::InvalidMove);

        // Make the move
        let captured_piece = make_move_on_board(game, from, to, promotion);

        // Update game state
        game.current_turn += 1;
        game.full_move_number += if !is_white_turn { 1 } else { 0 };
        
        if captured_piece.is_some() || 
           (game.board[to as usize].map(|p| p.piece_type) == Some(PieceType::Pawn)) {
            game.half_move_clock = 0;
        } else {
            game.half_move_clock += 1;
        }

        // Check for game end conditions
        if is_checkmate(game) {
            game.state = GameState::Finished;
            // Handle winner and stake distribution
        } else if is_stalemate(game) || game.half_move_clock >= 100 {
            game.state = GameState::Finished;
            // Handle draw and stake distribution
        }

        Ok(())
    }

    pub fn resign(ctx: Context<ResignGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.state == GameState::InProgress, ErrorCode::GameNotInProgress);

        let player = ctx.accounts.player.key();
        require!(player == game.white || player == game.black, ErrorCode::NotAPlayer);

        game.state = GameState::Finished;
        // Handle winner (the other player) and stake distribution

        Ok(())
    }

    pub fn offer_draw(ctx: Context<OfferDraw>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.state == GameState::InProgress, ErrorCode::GameNotInProgress);

        let player = ctx.accounts.player.key();
        require!(player == game.white || player == game.black, ErrorCode::NotAPlayer);

        game.draw_offer = Some(player);

        Ok(())
    }

    pub fn accept_draw(ctx: Context<AcceptDraw>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.state == GameState::InProgress, ErrorCode::GameNotInProgress);

        let player = ctx.accounts.player.key();
        require!(player == game.white || player == game.black, ErrorCode::NotAPlayer);

        if let Some(offer_from) = game.draw_offer {
            require!(offer_from != player, ErrorCode::CannotAcceptOwnDrawOffer);
            
            game.state = GameState::Finished;
            // Handle draw and stake distribution
        } else {
            return Err(ErrorCode::NoDrawOfferToAccept.into());
        }

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameState {
    WaitingForOpponent,
    InProgress,
    Finished,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum PieceType {
    Pawn,
    Knight,
    Bishop,
    Rook,
    Queen,
    King,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct Piece {
    pub piece_type: PieceType,
    pub is_white: bool,
}

#[account]
pub struct Game {
    pub white: Pubkey,
    pub black: Pubkey,
    pub stake: u64,
    pub state: GameState,
    pub current_turn: u16,
    pub board: [Option<Piece>; 64],
    pub en_passant: Option<u8>,
    pub castling_rights: [bool; 4],
    pub half_move_clock: u8,
    pub full_move_number: u16,
    pub draw_offer: Option<Pubkey>,
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = player, space = 8 + 32 + 32 + 8 + 1 + 2 + 64 * 3 + 1 + 4 + 1 + 2 + 33)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct MakeMove<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResignGame<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct OfferDraw<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct AcceptDraw<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The game has already started")]
    GameAlreadyStarted,
    #[msg("The game is not in progress")]
    GameNotInProgress,
    #[msg("It's not your turn")]
    NotPlayerTurn,
    #[msg("Invalid move")]
    InvalidMove,
    #[msg("Not a player in this game")]
    NotAPlayer,
    #[msg("Cannot accept your own draw offer")]
    CannotAcceptOwnDrawOffer,
    #[msg("No draw offer to accept")]
    NoDrawOfferToAccept,
}

// Helper functions

fn initial_board() -> [Option<Piece>; 64] {
    let mut board = [None; 64];
    // Set up initial board state
    // ... (implement the initial setup of chess pieces)
    board
}

fn is_valid_move(game: &Game, from: u8, to: u8, promotion: Option<PieceType>) -> bool {
    // Implement chess move validation logic
    // This should include checking:
    // - If the piece at 'from' belongs to the current player
    // - If the move is legal for that piece type
    // - If the move doesn't leave the king in check
    // - Special rules like en passant, castling, and pawn promotion
    true // Placeholder
}

fn make_move_on_board(game: &mut Game, from: u8, to: u8, promotion: Option<PieceType>) -> Option<Piece> {
    // Implement the logic to update the board state
    // This should handle:
    // - Moving the piece
    // - Capturing pieces
    // - Pawn promotion
    // - Updating en passant state
    // - Updating castling rights
    // Return the captured piece, if any
    None // Placeholder
}

fn is_checkmate(game: &Game) -> bool {
    // Implement checkmate detection
    false // Placeholder
}

fn is_stalemate(game: &Game) -> bool {
    // Implement stalemate detection
    false // Placeholder
}
