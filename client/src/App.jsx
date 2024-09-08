import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MultiLevelSidebar } from './components/sideNavBar';
import { SalesRecord } from './components/salesRecord';
import { CustomerRecord } from './components/customerRecord';
import { SalesRecordBarChart } from './components/salesRecordBarChart';
import { SeasonalDemand } from './components/customerDemand';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {/* Sidebar Component */}
        <MultiLevelSidebar className="w-64 bg-gray-100" />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route
              path="/sales-forecasting"
              element={
                <>
                  <SalesRecord />
                  <br></br>
                  <SalesRecordBarChart />
                </>
              }
            />
            <Route
              path="/customer-segmentation"
              element={<CustomerRecord />}
            />
            <Route
              path="/customer-demand-analysis"
              element={<SeasonalDemand />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
