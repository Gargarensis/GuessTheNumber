import HttpStatusCode from "./HttpStatusCode";

export class HandledError extends Error {
    public readonly httpCode: HttpStatusCode;

    /*
        Represents an error raised deliberately by our application with an associated status code to return to the user.
    */
    constructor(description: string, httpCode?: HttpStatusCode) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.httpCode = httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR_500;

        Error.captureStackTrace(this);
    }
}