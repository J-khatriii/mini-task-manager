import { Router } from "express";
import {
  getAllTasks,
  createTask,
  toggleTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = Router();

router.route("/").get(getAllTasks).post(createTask);

router.route("/:id").patch(toggleTask).delete(deleteTask);

export default router;
