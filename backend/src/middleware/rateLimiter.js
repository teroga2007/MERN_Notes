import ratelimit from "../config/upstash.js";

// Middleware to limit the rate of requests
const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }

    next(); // Proceed to the next middleware or route handler


  } catch (error) {
    console.error("Rate limiter error:", console.error);
    next(error); // Pass the error to the next middleware
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default ratelimiter;