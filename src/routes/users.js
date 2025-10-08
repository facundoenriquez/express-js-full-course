import { Router } from "express";
import {
  createUserValidationSchema,
  getUsersValidationSchema,
} from "../utils/validationSchemas.js";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { mockUsers } from "../utils/constants.js";
import { resolveIndexByUserId } from "../utils/middlewares.js";

const router = Router();

router.get("/api/users", checkSchema(getUsersValidationSchema), (req, res) => {
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
});

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  const user = mockUsers[userIndex];
  if (!user) return res.sendStatus(404);
  res.status(200).send(user);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });
    const data = matchedData(req);
    const newUser = { id: mockUsers.length + 1, ...data };
    mockUsers.push(newUser);
    res.status(201).send(newUser);
  }
);

router.put(
  "/api/users/:id",
  resolveIndexByUserId,
//   [
//     body("username")
//       .notEmpty()
//       .withMessage("Username cannot be empty")
//       .isLength({ min: 3, max: 20 })
//       .withMessage("Username must be between 3-20 characters")
//       .isString()
//       .withMessage("Username must be a string"),
//     body("displayName").notEmpty(),
//   ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({ errors: result.array() });
    const data = matchedData(req);
    const { userIndex } = req;
    mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...data };
    res.status(200).send(mockUsers[userIndex]);
  }
);

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
  res.status(200).send(mockUsers[userIndex]);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  mockUsers.splice(userIndex, 1);
  res.sendStatus(204);
});

export default router;
