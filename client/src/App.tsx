import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CreativesPage } from './pages/CreativesPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { PatternsPage } from './pages/PatternsPage';
import { DateRangeProvider } from './context/DateRangeContext';
import { ComparisonProvider } from './context/ComparisonContext';

export default function App() {
  return (
    <BrowserRouter>
      <DateRangeProvider>
        <ComparisonProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/creatives" element={<CreativesPage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/patterns" element={<PatternsPage />} />
            </Route>
          </Routes>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#f3f4f6',
                border: '1px solid #374151',
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#1f2937',
                },
              },
            }}
          />
        </ComparisonProvider>
      </DateRangeProvider>
    </BrowserRouter>
  );
}
