import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SignUp = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    terms: false
  });

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;

    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateInput = () => {
    if (!user.username.trim()) {
      toast.error("Username is required!");
      return false;
    }

    if (!user.email) {
      toast.error("Email is required!");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!user.password) {
      toast.error("Password is required!");
      return false;
    }

    if (!user.terms) {
      toast.error("Please agree the terms and conditions");
      return false;
    }

    // Optional: add more rules (length, special chars...)
    // if (user.password.length < 8) {
    //   toast.error("Password must be at least 8 characters");
    //   return false;
    // }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!validateInput()) return;

      const toastId = toast.loading("creating your account...");

      const URL = "/api/user/signup/";
      const dataToSend = {
        username: user.username,
        email: user.email,
        password: user.password
      };
      const response = await axios.post(URL, dataToSend, {withCredentials:true});

      toast.dismiss(toastId);

      if (response.status === 201) {
        toast.dismiss();
        toast.success("Account created! Redirecting to sign in...");
        setTimeout(() => {
          navigate('/signin');
        }, 1500);
      }else{
        console.log(response);
      }

      
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }

  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-red-500">
            MyApp
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-800">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm outline-none transition-colors"
                  onChange={handleInput}
                  value={user.username}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm outline-none transition-colors"
                  onChange={handleInput}
                  value={user.email}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm outline-none transition-colors"
                  onChange={handleInput}
                  value={user.password}
                />
              </div>
            </div>

            {/* <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm outline-none transition-colors"
                />
              </div>
            </div> */}

            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  onChange={handleInput}
                  value={user.terms}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-colors"
                onClick={handleSubmit}
              >
                Create account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  {/* Google icon (same as sign-in) */}
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.55L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31031 0 3.25531 2.69 1.28031 6.61L5.27031 9.705C6.21531 6.86 8.87031 4.75 12.0003 4.75Z" fill="#4285F4" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.69C18.36 16.01 17.44 17.22 16.06 18.01L19.47 20.785C21.93 18.495 23.49 15.605 23.49 12.275Z" fill="#34A853" />
                  <path d="M5.27 14.295C4.97 13.575 4.79 12.805 4.79 12C4.79 11.195 4.97 10.425 5.26 9.705L1.27 6.61C0.46 8.475 0 10.575 0 12.775C0 14.975 0.46 17.075 1.27 18.94L5.27 15.845C5.27 15.845 5.27 14.295 5.27 14.295Z" fill="#FBBC05" />
                  <path d="M12 23.5C15.105 23.5 17.78 22.435 19.675 20.785L16.27 18.01C15.17 18.695 13.71 19.125 12 19.125C8.87 19.125 6.215 17.015 5.27 14.17L1.28 17.265C3.255 21.185 7.31 23.5 12 23.5Z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  {/* Facebook icon (same as sign-in) */}
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}