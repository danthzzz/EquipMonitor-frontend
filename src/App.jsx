import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import Login from "./pages/Login";
import Track from './pages/Track';
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard';

import CreatePin from "./pages/pins/CreatePin";
import SinglePin from './pages/pins/SinglePin';
import UpdatePin from "./pages/pins/UpdatePin";

import Customers from './pages/customers/Customers';
import CreateCustomer from './pages/customers/CreateCustomer';
import UpdateCustomer from './pages/customers/UpdateCustomer';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';

import Equips from './pages/equips/Equips';

// Import Contexts
import { UserProvider, AlertProvider, PinsPMProvider, ThemeModeProvider, SnackbarProvider } from "./context";

function App() {
  return (
    <BrowserRouter>
      <ThemeModeProvider>
        <SnackbarProvider>
          <UserProvider>
            <AlertProvider>
              <PinsPMProvider>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/dash" element={<Dashboard />} />
                  <Route path="/create" element={<CreatePin />} />
                  <Route path="/pin/:id" element={<SinglePin />} />
                  <Route path="/update/:id" element={<UpdatePin />} />
                  <Route path="/track" element={<Track />} />
                  <Route path="/allequips" element={<Equips />} />
                  <Route path="/allcustomers" element={<Customers />} />
                  <Route path="/customer/:id" element={<CustomerDetailPage />} />
                  <Route path="/createcustomer" element={<CreateCustomer />} />
                  <Route path="/updatecustomer/:id" element={<UpdateCustomer />} />
                </Routes>
              </PinsPMProvider>
            </AlertProvider>
          </UserProvider>
        </SnackbarProvider>
      </ThemeModeProvider>
    </BrowserRouter>
  );
}

export default App;
