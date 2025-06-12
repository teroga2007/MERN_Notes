import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, type NavigateFunction, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  [key: string]: unknown;
};

const NoteDetail = () => {
  const [note, setNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate: NavigateFunction = useNavigate();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSave = async () => {
    if (!note) {
      toast.error("Note data is missing.");
      return;
    }
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }
    setSaving(true);
    try {
      if (note._id) {
        // Update existing note
        await api.put(`/notes/${note._id}`, note);
        toast.success("Note updated successfully");
        navigate("/"); // Redirect to home after saving
      }
    } catch (error) {
      console.error("Error saving note:", error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setLoading(true);
    try {
      await api.delete(`/notes/${note?._id}`);
      toast.success("Note deleted successfully");
      navigate("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting note:", error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note?.title ?? ""}
                  onChange={(e) => setNote(note ? { ...note, title: e.target.value } : null)}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note?.content ?? ""}
                  onChange={(e) => setNote(note ? { ...note, content: e.target.value } : null)}
                />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteDetail;