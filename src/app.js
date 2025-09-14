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

// Apply OpenAPI validator to routes, matching the basePath defined in servers
app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpecPath,
    validateRequests: true,
    validateResponses: true,
    validateSecurity: {
      handlers: {
        JWT: async (req, scopes, schema) => {
          // Expect Authorization: Bearer <token>
          const auth =
            req.headers["authorization"] || req.headers["Authorization"];
          if (!auth || !auth.startsWith("Bearer ")) {
            throw new Error("Missing or invalid Authorization header");
          }
          const token = auth.substring("Bearer ".length).trim();
          // Simple demo validation: accept a fixed token value. Replace with real JWT verification if needed.
          // Example valid token: "testtoken"
          if (token !== "testtoken") {
            throw new Error("Invalid token");
          }
          // Optionally verify scopes if your API requires them
          return true;
        },
      },
    },
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
