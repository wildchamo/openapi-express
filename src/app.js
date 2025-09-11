import express from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import OpenApiValidator from "express-openapi-validator";
import path from "path";
import v1Router from "./routes/v1/index.js";
import v2Router from "./routes/v2/index.js";

const app = express();

const apiSpecPath = path.resolve(process.cwd(), "openapi.yaml");
const swaggerDocument = yaml.load(apiSpecPath);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

// Apply OpenAPI validator to v1 routes, matching the basePath defined in servers (/v1)
app.use(
  "/v1",
  OpenApiValidator.middleware({
    apiSpec: apiSpecPath,
    validateRequests: true,
    validateResponses: true,
    validateSecurity: true,
    ignorePaths: /.*\/docs.*/,
  })
);

// Mount versioned routers
app.use("/v1", v1Router);
app.use("/v2", v2Router);

// Error handler should be after all routes to catch validation and route errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

export default app;
