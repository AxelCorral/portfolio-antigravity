import { Route, Routes } from "react-router-dom";
import OnePage from "@/OnePage";
import { LanguageToggle } from "@/components/LanguageToggle";
import { DeepDivePage } from "@/pages/DeepDivePage";

function App() {
  return (
    <>
      <LanguageToggle />
      <Routes>
        <Route path="/" element={<OnePage />} />
        <Route path="/projet/:slug" element={<DeepDivePage />} />
      </Routes>
    </>
  );
}

export default App;
