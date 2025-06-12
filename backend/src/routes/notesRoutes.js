import express from "express";
import { createNote, getAllNotes, updateNote, deleteNote, getSpecificNote } from "../controllers/noteController.js";

const router = express.Router();

router.get("/", getAllNotes);

router.get("/:id", getSpecificNote);

router.post("/", createNote);

router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router;