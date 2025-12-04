import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import SalesPage from './pages/SalesPage';
import LeadsPage from './pages/LeadsPage';
import ListingsPage from './pages/ListingsPage';
import SocialPage from './pages/SocialPage';
import AdsPage from './pages/AdsPage';
import CreateContentPage from './pages/CreateContentPage';
import EditProfilePage from './pages/EditProfilePage';
import TasksPage from './pages/TasksPage';
import PaymentPage from './pages/PaymentPage';

// Components
import BottomNav from './components/BottomNav';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';

// Main App Component
const App = () => {
  return (
      <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/create-content" element={<CreateContentPage />} />
              <Route path="/social" element={<SocialPage />} />
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/payment" element={<PaymentPage />} />
            </Routes>
            <BottomNav />
          </BrowserRouter>
        </AppProvider>
      </LanguageProvider>
      </ThemeProvider>
  );
};

export default App;
