import { useEffect, useState } from "react";
import RateLimited from "../components/RateLimited";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import { LoaderIcon } from "lucide-react";
import NotesNotFound from "../components/NotesNotFound";
import api from "../lib/axios";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  [key: string]: unknown;
};

export const Homepage = () => {
  const [isRateLimit, setIsRateLimit] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log("Notes fetched:", res.data);
        setNotes(res.data);
        setIsRateLimit(false);
      } catch (error: unknown) {
        console.error("Error fetching notes:", error);
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { status?: number } }).response === "object" &&
          (error as { response?: { status?: number } }).response?.status === 429
        ) {
          setIsRateLimit(true);
        } else if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
          console.error("Error message:", error.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      {isRateLimit && <RateLimited />}

      {notes.length === 0 && !isRateLimit && <NotesNotFound />}

      <div className="max-w-6xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary mt-10">
          <LoaderIcon className="animate-spin size-10" />
        </div>}
        {!loading && !isRateLimit && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Homepage;