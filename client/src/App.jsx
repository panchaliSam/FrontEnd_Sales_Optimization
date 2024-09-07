import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MultiLevelSidebar } from "./components/sideNavBar";
import { SalesRecord } from "./components/salesRecord";
import CustomerCorrelation from "./pages/CustomerCorrelation";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {/* Sidebar Component */}
        <MultiLevelSidebar className="w-64 bg-gray-100" />

        {/* Sales Forecasting */}
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/sales-forecasting" element={<SalesRecord />} />
            <Route path="/customer-correlation" element={<CustomerCorrelation />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
