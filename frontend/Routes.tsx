import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import { AssistantPage } from "./pages/assistant/page";
import { ProfilePage } from "./pages/profile/page";
import Layout from "./layout";
import { ModulesPage } from "./pages/modules/page";

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/modules" element={<ModulesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
