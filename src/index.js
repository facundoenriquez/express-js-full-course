import express from "express";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(usersRouter);

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.get("/", loggingMiddleware, (req, res) => {
  res.status(201).send({ message: "Hello World" });
});

app.get("/api/products", (req, res) => {
  res.status(200).send([
    { id: 1, name: "Product A", price: 29.99 },
    { id: 2, name: "Product B", price: 49.99 },
    { id: 3, name: "Product C", price: 19.99 },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
