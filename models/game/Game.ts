import crypto from "crypto";
import { GameStatus } from "./GameStatus";

export class Game {

    private _gameIdentifier: string;
    private _chosenNumber: number;
    private _userInputs: number[];
    private _gameStatus: GameStatus;
    private _startingDate: Date;

    constructor(lowerLimit: number, upperLimit: number) {
        this._gameIdentifier = crypto.randomBytes(64).toString('hex');
        this._chosenNumber = this.getRandomInt(lowerLimit, upperLimit);
        this._userInputs = [];
        this._gameStatus = GameStatus.STARTED;
        this._startingDate = new Date();
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public isFinished(): boolean {
        return GameStatus.GAME_WON.valueOf() === this._gameStatus.valueOf();
    }

    public get gameIdentifier(): string {
        return this._gameIdentifier;
    }

    public get chosenNumber(): number {
        return this._chosenNumber;
    }
    
    public addUserInput(input: number): void {
        if (this.isFinished()) {
            return;
        }

        this._userInputs.push(input);

        if (input === this._chosenNumber) {
            this._gameStatus = GameStatus.GAME_WON;
        } else {
            if (input > this._chosenNumber) {
                this._gameStatus = GameStatus.LAST_NUMBER_BIGGER;
            } else {
                this._gameStatus = GameStatus.LAST_NUMBER_LOWER;
            }
        }
    }

    public get userInputs(): number[] {
        return this._userInputs;
    }

    public get gameStatus(): GameStatus {
        return this._gameStatus;
    }

    public get startingDate(): Date {
        return this._startingDate;
    }
}