import { mockUsers } from "./constants.js";

export const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const userIndex = mockUsers .findIndex((user) => user.id === parsedId);
  if (userIndex === -1) return res.sendStatus(404);
  req.userIndex = userIndex;
  next();
};
