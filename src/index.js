import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} 🚀 http://localhost:${PORT}/v1/`
  );
  console.log(
    `Server is running on port ${PORT} 🚀 http://localhost:${PORT}/v2/`
  );
});
