export class SessionException extends Error {
    constructor() {super('Malformed or undefined session');}
}

export class JWTException extends Error {
    constructor() {super('JWT expired or invalid');}
}