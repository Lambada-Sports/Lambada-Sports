import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Customisation from "./components/User/Customisation";
import HomePage from "./components/User/HomePage";
import AboutPage from "./components/User/AboutPage";
import SelectSportPage from "./components/User/SelectSportPage";
import CustomizePage from "./components/User/CustomizePage";
import OrderFormPage from "./components/User/OrderFormPage";

const domain = "dev-e6qbovpsssxtr7qp.us.auth0.com";
const clientId = "53cJFOqfJj4gFrcqgpoisKpugN3gKWNu";

export default function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/select-sport" element={<SelectSportPage />} />
          <Route path="/customize/:sport/:fit" element={<CustomizePage />} />
          <Route path="/design-editor" element={<Customisation />} />
          <Route path="/order-form" element={<OrderFormPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
}
