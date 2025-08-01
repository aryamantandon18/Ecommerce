import { redisClient } from "../server.js";

// The res.json method is overridden to perform caching before actually sending the response.
// When the controller executes and calls res.json to send a response, this overridden version of res.json is triggered instead.
// After caching the response, it calls res.sendResponse(body) to actually send the response back to the client. This is the original res.json function that was saved earlier.
export const cacheMiddleware = async(req,res,next)=>{
    const cacheKey = req.originalUrl;  // original
    try {
        const cachedData = await redisClient.get(cacheKey);
        if(cachedData){
            return res.status(200).json(JSON.parse(cachedData));
        }
    // If no cached data, continue with the request
    res.sendResponse = res.json; // Save the original `res.json` function
    res.json = (body) => {
      // Store the response in the cache before sending it
      redisClient.setex(cacheKey, 3600, JSON.stringify(body)); // Cache for 2 hours (7200 seconds)
      res.sendResponse(body); // Send the response
    };

    next(); // Continue to the next middleware/controller
    } catch (error) {
        next(error);  // If there's an error, pass it to the next middleware
    }
}