import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../components/Authentication/AuthProvider";
import { BiSolidChess } from "react-icons/bi";

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await createUser(email, password, name);

      navigate("/");
    } catch (error) {
      console.error("SignUp Error: ", error);
      alert("Error sign up", error);
      setError(error.message || "An error occurred");
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
          <form onSubmit={handleSignUp} className="pr-20 pl-10 py-14">
            <h1 className="text-3xl font-bold text-center mb-8 text-green-secondary">Sign Up</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="form-control">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input input-bordered mb-2"
                required
              />
            </div>
            <div className="form-control">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered mb-2"
                required
              />
            </div>
            <div className="form-control">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered mb-2"
                required
              />
            </div>
            <div className="form-control mt-6">
              <button 
              className="btn bg-gradient-to-r from-green-secondary to-green-600 text-lg text-green-info hover:bg-[#269b47]">
                Sign Up
              </button>
            </div>
            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-green-primary hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
