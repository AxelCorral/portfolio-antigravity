import { Route, Routes } from "react-router-dom";
import OnePage from "@/OnePage";
import { DeepDivePage } from "@/pages/DeepDivePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnePage />} />
      <Route path="/projet/:slug" element={<DeepDivePage />} />
    </Routes>
  );
}

export default App;
