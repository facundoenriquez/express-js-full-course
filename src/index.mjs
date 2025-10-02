import express from "express";
import { query, validationResult } from "express-validator";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const userIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (userIndex === -1) return res.sendStatus(404);
  req.userIndex = userIndex;
  next();
};

const mockUsers = [
  { id: 1, username: "anson", displayName: "Anson" },
  { id: 2, username: "brad", displayName: "Brad" },
  { id: 3, username: "charlie", displayName: "Charlie" },
  { id: 4, username: "david", displayName: "David" },
  { id: 5, username: "evan", displayName: "Evan" },
  { id: 6, username: "frank", displayName: "Frank" },
  { id: 7, username: "george", displayName: "George" },
  { id: 8, username: "henry", displayName: "Henry" },
  { id: 9, username: "ian", displayName: "Ian" },
  { id: 10, username: "jack", displayName: "Jack" },
];

app.get("/", loggingMiddleware, (req, res) => {
  res.status(201).send({ message: "Hello World" });
});

app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("filter must be a non-empty string")
    .isLength({ min: 3, max: 10 })
    .withMessage("filter must be a string between 3-10 characters"),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { filter, value } = req.query;
    if (filter && value) {
      return res
        .status(200)
        .send(mockUsers.filter((user) => user[filter].includes(value)));
    }
    res.status(200).send(mockUsers);
  }
);

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  const user = mockUsers[userIndex];
  if (!user) return res.sendStatus(404);
  res.status(200).send(user);
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers.length + 1, ...body };
  mockUsers.push(newUser);
  res.status(201).send(newUser);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
  res.status(200).send(mockUsers[userIndex]);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
  res.status(200).send(mockUsers[userIndex]);
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  mockUsers.splice(userIndex, 1);
  res.sendStatus(204);
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
