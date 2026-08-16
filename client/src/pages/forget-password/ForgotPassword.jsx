import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/api/v1/users/forgot-password`,
                {
                    email: email.trim(),
                }
            );

            setMessage(
                response.data.message ||
                "If an account exists with this email, a reset link has been sent."
            );

            setEmail("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Forgot Password?
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Enter your email address and we'll send you a link
                        to reset your password.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="
                                w-full
                                px-4 py-3
                                text-sm
                                text-gray-900
                                bg-white
                                border border-gray-300
                                rounded-lg
                                outline-none
                                transition
                                placeholder:text-gray-400
                                focus:border-red-500
                                focus:ring-4
                                focus:ring-indigo-100
                            "
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            px-4 py-3
                            rounded-lg
                            bg-red-500
                            text-white
                            text-sm
                            font-semibold
                            transition
                            duration-200
                            hover:bg-red-600
                            focus:outline-none
                            focus:ring-4
                            focus:ring-red-200
                            disabled:bg-indigo-300
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {/* Success message */}
                {message && (
                    <p className="
                        mt-6
                        rounded-lg
                        border border-green-200
                        bg-green-50
                        px-4 py-3
                        text-sm
                        leading-5
                        text-green-700
                    ">
                        {message}
                    </p>
                )}

                {/* Error message */}
                {error && (
                    <p className="
                        mt-6
                        rounded-lg
                        border border-red-200
                        bg-red-50
                        px-4 py-3
                        text-sm
                        leading-5
                        text-red-700
                    ">
                        {error}
                    </p>
                )}
            </div>
        </div>

    );
};

export default ForgotPassword;
