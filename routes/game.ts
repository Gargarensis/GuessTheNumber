import express, { NextFunction, Request, Response } from 'express';
import { Services } from '../services/Services';
import { HandledError } from '../models/exceptions/HandledError';
import HttpStatusCode from '../models/exceptions/HttpStatusCode';
import { GameStatus } from '../models/game/GameStatus';

export const gameRouter = express.Router();

const BASE_ROUTE = '/games';

const gameService = Services.gameService;

/*
    POST route to create a new game.
    The body of the request can have a 'maxValue' field containing the maximum number that could be generated for the new game.

    Returns the new game identifier to the client.
*/
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

/*
    POST route to send user input to the game.
    The body must contain a 'chosenNumber' field containing the number chosen by the user.

    Returns the new status of the game or a 400 error if the input was not valid.
*/
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