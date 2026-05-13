import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import toast from "react-hot-toast";

function AuthLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const { login, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await login(email, pass);
      toast.success("Logged in successfully");

      if (loggedUser?.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }
      if (!loggedUser?.isVerified) {
        navigate("/verify-email", { replace: true });
        return;
      }
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#C5C7CA]">
      <h2 className="sm:mx-auto sm:w-full sm:max-w-sm text-2xl">Login</h2>
      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <label
            className="block text-sm/6 font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            name="email"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#45423D] sm:text-sm/6"
          />
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <label
            className="block text-sm/6 font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#45423D] sm:text-sm/6"
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <div className="mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-[#45423D] underline hover:text-[#6C6A61]"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <button
            className="flex w-full justify-center rounded-md bg-[#6C6A61] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#45423D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#45423D]"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
      <p className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        Dont have an account?{" "}
        <Link to="/register" className="underline decoration-[#45423D]">
          Register
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
