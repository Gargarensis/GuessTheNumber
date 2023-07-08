import express, { Express, NextFunction, Request, Response } from 'express';
import { Services } from '../services/Services';
import { HandledError } from '../models/exceptions/HandledError';
import HttpStatusCode from '../models/exceptions/HttpStatusCode';
import { GameStatus } from '../models/game/GameStatus';

export const gameRouter = express.Router();

const BASE_ROUTE = '/games';

const gameService = Services.gameService;

gameRouter.post(BASE_ROUTE + '/new', function(req: Request, res: Response, next: NextFunction) {
    let maxValue: number = Number(req.body.maxValue);

    if (isNaN(maxValue)) {
        maxValue = 10000;
    }

    const gameId: string = gameService.startNewGame(1, maxValue);

    res.status(200).send({
        gameId: gameId
    }).end();
});

gameRouter.post(BASE_ROUTE + '/:gameId/input', function(req: Request, res: Response, next: NextFunction) {
    const chosenNumber: number = Number(req.body.chosenNumber);

    if (isNaN(chosenNumber)) {
        throw new HandledError('Invalid input number.', HttpStatusCode.BAD_REQUEST_400);
    }

    const newStatus: GameStatus = gameService.makeMoveInGame(req.params.gameId, chosenNumber);

    res.status(200).send({ 
        newStatus: newStatus
    }).end();
});