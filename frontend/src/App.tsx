import { Route, Routes } from "react-router"
import Homepage from "./pages/Homepage"
import CreatePage from "./pages/CreatePage"
import NoteDetail from "./pages/NoteDetail"
import NavBar from "./components/NavBar"

const App = () => {
  return (
    <div className="relative h-full w-full">
      <NavBar />
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
      </Routes>
    </div>
  )
}

export default App