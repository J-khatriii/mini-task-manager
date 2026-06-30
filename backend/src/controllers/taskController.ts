import { Request, Response } from "express";
import Task from "../models/Task.js";

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Title is required and must be a non-empty string",
      });
      return;
    }

    const task = await Task.create({
      title: title.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const toggleTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    task.completed = !task.completed;

    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? "completed" : "incomplete"}`,
      data: task,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { id: task._id },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
