import { Request, NextFunction, Response } from "express-serve-static-core";
import { PassageConfig } from "./types/PassageConfig";
import Passage from "./classes/Passage";


declare global{
    namespace Express {
        export interface Response {
            passage: Passage
        }
    }
}

/**
 * Initialize a new instance of the Passage middleware.
 * 
 * @param config The default config for Passage initialization
 * @returns Callback function
 */
export default function initialize(config: PassageConfig) {
    if (!config.appID) throw new Error("Passage requires an App ID");
    
    let passage = new Passage(config);
    return (req: Request, res: Response, next: NextFunction) => {
        passage.authenticateRequest(req, res, next);
    }
}

module.exports = initialize;

export {
    Passage as Passage
}