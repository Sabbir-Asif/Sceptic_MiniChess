import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../components/Authentication/AuthProvider";
import { BiSolidChess } from "react-icons/bi";

const SignIn = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      alert("Error sign in");
      setError(error.message);
    }
  };

  return (
    <div className="hero flex justify-center min-h-screen bg-black-secondary font-poppins">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex gap-12 flex-shrink-0 w-full shadow-2xl bg-base-200 rounded-lg">
          <div className="bg-gradient-to-r from-green-secondary to-green-600 px-20 rounded-l-lg flex flex-col justify-center items-center">
            <h1 className="text-4xl text-center pb-8 font-bold text-green-info">
              Mini-Chess
            </h1>
            <BiSolidChess className="text-6xl text-green-info" />
          </div>
          <form onSubmit={handleLogin} className="pr-20 pl-10 py-20">
            <h1 className="text-3xl font-bold text-center pb-5 text-green-secondary">Sign In</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="form-control">
              <label className="label">
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-gradient-to-r from-green-secondary to-green-600 hover:bg-[#32a247] text-green-info text-lg">
                Sign In
              </button>
            </div>
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-green-primary hover:underline">
                Sign Up
              </Link>
            </p>
            <p className="text-center mt-4">
              Forgot your password?{" "}
              <Link to="/forgot-password" className="text-green-primary hover:underline">
                Reset it
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
