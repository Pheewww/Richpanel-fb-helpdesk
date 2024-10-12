import React, { useState } from 'react';
import axios from 'axios';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();


        console.log('// LOGIN BEGINS');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'https://richpanel-fb-helpdesk-gwbm.onrender.com';
            const response = await axios.post(`${apiUrl}/login`, { email, password });
            console.log('// LOGIN RESPOONSE', response.data);

            if (response.data.success) {
                // Store the token / user ID in local storage 
                console.log('// TOKEN', response.data.token);
                localStorage.setItem('token', response.data.token);

                // Redirect to the home page
                window.location.href = '/connect-pages';
                console.log('// LOGIN DONE');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-blue-700">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Login to your account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="inline-block text-gray-700 text-sm font-bold mb-2" htmlFor="rememberMe">
                            Remember Me
                        </label>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="ml-2 leading-tight"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Login
                    </button>
                    <div className="flex items-center mt-6 justify-center ">

                        <a className="inline-block align-baseline justify-center font-bold text-sm text-blue-500 hover:text-blue-800" href="/signup">
                            New to MyApp? Sign Up
                        </a>

                    </div>
                    {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
