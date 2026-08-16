import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/api/v1/users/reset-password/${token}`,
                {
                    newPassword,
                }
            );

            setMessage(
                response.data.message || "Password reset successful!"
            );

            setNewPassword("");
            setConfirmPassword("");

            // Optional: redirect to login after a short delay
            setTimeout(() => {
                navigate("/signin");
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reset password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">

                {/* Header */}
                <div className="text-center mb-8">

                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                        <svg
                            className="h-7 w-7 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Reset Password
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Create a new password for your account.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* New password */}
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>

                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            required
                            className="
                                w-full
                                px-4 py-3
                                text-sm
                                text-gray-900
                                border border-gray-300
                                rounded-lg
                                outline-none
                                transition
                                placeholder:text-gray-400
                                focus:border-indigo-500
                                focus:ring-4
                                focus:ring-indigo-100
                            "
                        />
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm your password"
                            required
                            className="
                                w-full
                                px-4 py-3
                                text-sm
                                text-gray-900
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

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            px-4 py-3
                            rounded-lg
                            bg-red-600
                            text-white
                            text-sm
                            font-semibold
                            transition
                            duration-200
                            hover:bg-red-600
                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-200
                            disabled:bg-indigo-300
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? "Resetting Password..."
                            : "Reset Password"}
                    </button>
                </form>

                {/* Success */}
                {message && (
                    <p className="
                        mt-6
                        rounded-lg
                        border border-green-200
                        bg-green-50
                        px-4 py-3
                        text-sm
                        text-green-700
                    ">
                        {message}
                    </p>
                )}

                {/* Error */}
                {error && (
                    <p className="
                        mt-6
                        rounded-lg
                        border border-red-200
                        bg-red-50
                        px-4 py-3
                        text-sm
                        text-red-700
                    ">
                        {error}
                    </p>
                )}

                {/* Back to login */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => navigate("/signin")}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        ← Back to Login
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ResetPassword;
