import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import UserContext from "./context/user-context.js";
import Layout from "./components/Layout/Layout.jsx";

function App() {
  const [user, setUser] = useState();
  const value = { user, setUser };
  return (
    <div>
      <UserContext.Provider value={value}>
        <Router>
          <Layout />
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
