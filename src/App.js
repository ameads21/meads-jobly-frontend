import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Nav from "./Nav";
import Routes from "./Routes";
import KeyProvider from "./Context/KeyProvider";
import CompanyProvider from "./Context/CompanyProvider";
import useLocalStorage from "./hooks/useLocalStorageState";
import jwt from "jsonwebtoken";
import JoblyApi from "./Api";
import UserContext from "./Context/UserContext";
import LoadingSpinner from "./common/LoadingSpinner";

export const TOKEN_STORAGE_ID = "authorization";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [applicationIds, setApplicationIds] = useState(new Set([]));

  useEffect(
    function loadUserInfo() {
      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwt.decode(token);
            JoblyApi.token = token;
            let currentUser = await JoblyApi.getCurrentUser(username);
            setCurrentUser(currentUser);
            setApplicationIds(new Set(currentUser.applications));
          } catch (err) {
            console.error("App loadUserInfo: problem loading", err);
            setCurrentUser(null);
          }
        }
        setInfoLoaded(true);
      }

      setInfoLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  function hasAppliedToJob(id) {
    return applicationIds.has(id);
  }

  /** Apply to a job: make API call and update set of application IDs. */
  function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    JoblyApi.applyToJob(currentUser.username, id);
    setApplicationIds(new Set([...applicationIds, id]));
  }

  async function signup(signupData) {
    try {
      let token = await JoblyApi.register(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await JoblyApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <div className="App">
      <KeyProvider>
        <BrowserRouter>
          <UserContext.Provider
            value={{ currentUser, hasAppliedToJob, applyToJob, setCurrentUser }}
          >
            <Nav logout={logout} />
            <CompanyProvider>
              <Routes login={login} signup={signup} />
            </CompanyProvider>
          </UserContext.Provider>
        </BrowserRouter>
      </KeyProvider>
    </div>
  );
}

export default App;
