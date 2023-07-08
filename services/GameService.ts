import { HandledError } from "../models/exceptions/HandledError";
import HttpStatusCode from "../models/exceptions/HttpStatusCode";
import { Game } from "../models/game/Game";
import { GameStatus } from "../models/game/GameStatus";
import cron from "node-cron";

export class GameService {
    
    public static MAX_LIMIT: number = 10000000;

    private activeGames: Map<string, Game> = new Map();

    constructor () {
        cron.schedule("0 0 * * * *", () => {
            this.cleanUpOldGames();
        });
    }

    public startNewGame(lowerLimit: number, upperLimit: number): string {
        if (lowerLimit < -GameService.MAX_LIMIT) {
            lowerLimit = -GameService.MAX_LIMIT;
        }

        if (upperLimit > GameService.MAX_LIMIT) {
            upperLimit = GameService.MAX_LIMIT;
        }

        const newGame: Game = new Game(lowerLimit, upperLimit);
        const gameId: string = newGame.gameIdentifier;

        this.activeGames.set(gameId, newGame);
        return gameId;
    }

    public getGameById(gameId: string): Game {
        const game: Game | undefined = this.activeGames.get(gameId);

        if (game) {
            return game;
        } else {
            throw new HandledError(`Game ID not found.`, HttpStatusCode.NOT_FOUND_404);
        }
    }

    public makeMoveInGame(gameId: string, chosenNumber: number): GameStatus {
        const game: Game = this.getGameById(gameId);

        game.addUserInput(chosenNumber);        

        if (game.isFinished()) {
            this.activeGames.delete(gameId);
        }

        return game.gameStatus;
    }

    public getGameStatus(gameId: string): GameStatus {
        return this.getGameById(gameId).gameStatus;
    }

    public cleanUpOldGames(): void {
        const oneDay: number = 60 * 60 * 24 * 1000
        const dateNow: Date = new Date();
        const totalGames = this.activeGames.size;
        this.activeGames.forEach((value, key, map) => {
            if (dateNow.getTime() - value.startingDate.getTime() > oneDay) {
                map.delete(key);
            }
        });
        console.info(`Running old games cleanup. Removed ${totalGames - this.activeGames.size} old games.`);
    }
}