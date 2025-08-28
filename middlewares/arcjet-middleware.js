import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          message: "Too many requests - try later",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - bot detected",
        });
      }

      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    // Ako nije odbijen -> pusti dalje
    next();
  } catch (error) {
    console.error(`Arcjet error: ${error}`);
    next(error);
  }
};

export default arcjetMiddleware;
