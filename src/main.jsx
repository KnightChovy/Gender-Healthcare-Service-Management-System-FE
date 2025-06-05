<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
>>>>>>> da4fb03104d9cb8704fd21ea541154a969039329

import { RouterProvider } from "react-router-dom";
import router from "./Router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
<<<<<<< HEAD
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
=======
    <RouterProvider router={router} />
  </StrictMode>
);
>>>>>>> da4fb03104d9cb8704fd21ea541154a969039329
