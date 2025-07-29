import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProviderWithRedirect from "./auth/authProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProviderWithRedirect>
      <App />
    </AuthProviderWithRedirect>
  </BrowserRouter>
);
