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
import SignUp from "./pages/Signup";
import SignIn from "./pages/Signin";
import ForgotPassword from "./pages/ForgetPassword";
import AuthProvider from "./components/Authentication/AuthProvider";
import Home from "./pages/Home";
import Rules from "./pages/Rules";
import StateEvaluationChessBoard from "./components/WeightedRandomChess/StateEvaluationChessBoard";
import Records from "./pages/Records";

const router = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SignUp />
  },
  {
    path: "/sign-in",
    element: <SignIn />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: '',
        element: <Banner />
      },
      {
        path: '/play-human',
        element: <MiniChessBoard />
      },
      {
        path: '/playai',
        element: <StateEvaluationChessBoard />
      },
      {
        path: 'rules',
        element: <Rules />
      },
      {
        path: 'records',
        element: <Records />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
