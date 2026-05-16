import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/forgot-password', { email });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending reset email');
            setMessage('');
        }
    };

    return (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={handleForgotPassword}>
                <label className="block text-sm font-medium text-gray-900" htmlFor="email">Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="youremail@gmail.com"
                    id="email"
                    name="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#45423D] sm:text-sm"
                    required
                />
                {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
                {message && <p className="text-green-500 font-semibold mt-2">{message}</p>}
                <button className="mt-4 flex w-full justify-center rounded-md bg-[#6C6A61] px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-[#45423D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#45423D]" type="submit">
                    Send Reset Email
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;