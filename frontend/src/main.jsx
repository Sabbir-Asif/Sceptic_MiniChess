import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./pages/Root";
import MiniChessBoard from "./components/chessBoard/MiniChessBoard";
import Banner from "./components/Banner/Banner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: 'home',
        element: <Banner />
      },
      {
        path: 'playai',
        element: <MiniChessBoard />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
