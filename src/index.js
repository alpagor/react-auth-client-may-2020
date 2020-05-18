import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./lib/Auth"; //importamos el "provider" component

ReactDOM.render(
  //1.2 wrapping the entire App in the "Provider", in our case "AuthProvider".What's inside the tags
  // will be passed to Auth.js as props.children
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>,
  document.getElementById("root")
);
