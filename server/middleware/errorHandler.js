/**
 * Global error handling middleware for Express.
 * Maps Meta API errors to appropriate HTTP status codes and
 * returns a consistent error response shape.
 *
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  if (err.response) {
    const status = err.response.status;
    const metaError = err.response.data?.error;

    if (status === 401 || status === 190) {
      return res.status(401).json({
        error: {
          message: 'Invalid or expired Meta access token',
          code: 'AUTH_ERROR',
          details: metaError?.message,
        },
      });
    }

    if (status === 429 || metaError?.code === 32) {
      return res.status(429).json({
        error: {
          message: 'Meta API rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT',
          details: metaError?.message,
        },
      });
    }

    return res.status(status || 500).json({
      error: {
        message: metaError?.message || 'Meta API error',
        code: 'META_API_ERROR',
        details: metaError,
      },
    });
  }

  res.status(500).json({
    error: {
      message: err.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}

module.exports = { errorHandler };
