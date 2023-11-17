import "./App.css";
import { Routes, Route } from "react-router-dom";

import MainMenu from "./pages/MainMenu";
import EnterHouseholdInfo from "./pages/EnterHouseholdInfo";
import AddAppliance from "./pages/AddAppliance";
import ViewAppliances from "./pages/ViewAppliances";
import AddPowerGeneration from "./pages/AddPowerGeneration";
import ViewPowerGeneration from "./pages/ViewPowerGeneration";
import SubmissionComplete from "./pages/SubmissionComplete";
import SelectReport from "./pages/SelectReport";
import NotFound from "./pages/NotFound";
import Top25Manufacturers from "./pages/Report_Top25Manufacturers";
import ManufacturerModelSearch from "./pages/Report_ManufacturerModelSearch";
import HeatingCoolingMethodDetails from "./pages/Report_HeatingCoolingMethodDetails";
import WaterHeaterStatisticsByState from "./pages/Report_WaterHeaterStatisticsByState";
import OffTheGridHouseholdDashboard from "./pages/Report_OffTheGridHouseholdDashboard";
import HouseholdAveByRadius from "./pages/Report_HouseholdAveByRadius";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/householdInfo" element={<EnterHouseholdInfo />} />
        <Route path="/addAppliance" element={<AddAppliance />} />
        <Route path="/viewAppliances" element={<ViewAppliances />} />
        <Route path="/addPowerGeneration" element={<AddPowerGeneration />} />
        <Route path="/viewPowerGeneration" element={<ViewPowerGeneration />} />
        <Route path="/submissionComplete" element={<SubmissionComplete />} />
        <Route path="/reports" element={<SelectReport />} />
        <Route path="/top25Manufacturers" element={<Top25Manufacturers />} />
        <Route path="/manufacturerModelSearch" element={<ManufacturerModelSearch />} />
        <Route path="/heatingCoolingMethodDetails" element={<HeatingCoolingMethodDetails />} />
        <Route path="/waterHeaterStatisticsByState" element={<WaterHeaterStatisticsByState />} />
        <Route path="/offTheGridHouseholdDashboard" element={<OffTheGridHouseholdDashboard />} />
        <Route path="/householdAveByRadius" element={<HouseholdAveByRadius />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
