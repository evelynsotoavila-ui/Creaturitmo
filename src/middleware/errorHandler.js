export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }

  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_JSON", message: "El cuerpo de la petición no es JSON válido." },
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Token inválido o expirado." },
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Error interno del servidor." },
  });
}

export function notFound(req, res) {
  return res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` },
  });
}
