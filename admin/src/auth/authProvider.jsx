import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const AuthProviderWithRedirect = ({ children }) => {
  const navigate = useNavigate();

  const domain = "dev-e6qbovpsssxtr7qp.us.auth0.com";
  const clientId = "53cJFOqfJj4gFrcqgpoisKpugN3gKWNu";
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || "/admin");
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProviderWithRedirect;
