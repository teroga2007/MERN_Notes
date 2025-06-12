import Note from "../models/noteModel.js";

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json(notes);

  }
  catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
}

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    const note = new Note({
      title,
      content
    });
    const savedNote = await note.save();
    res.status(201).json({ message: "Note created successfully", note: savedNote });
  }
  catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note" });
  }
}

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Error updating note" });
  }
}

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ message: "Error deleting note" });
  }
}

export const getSpecificNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  }
  catch (error) {
    console.error("Error finding specific note:", error);
    res.status(500).json({ message: "Error finding specific note" });
  }

}