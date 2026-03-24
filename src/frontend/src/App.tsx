import { Toaster } from "@/components/ui/sonner";
import { Layout } from "./components/Layout";
import { Route, Router, Routes } from "./components/RouterShim";
import { AppProvider } from "./context/AppContext";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { Deposit } from "./pages/Deposit";
import { Earning } from "./pages/Earning";
import { Markets } from "./pages/Markets";
import { Withdraw } from "./pages/Withdraw";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/earning" element={<Earning />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </AppProvider>
  );
}
