import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Pages() {
    const navigate = useNavigate();
    const [pageName, setPageName] = useState('');

    useEffect(() => {

        console.log('// going for page search');
        // Add your token retrieval logic here

        
        const token = localStorage.getItem('token');
        console.log('// User Token', token);

        if (!token) {
            navigate('/'); // Redirect to login if no token is found
        }

        axios.get('http://localhost:5000/user/facebook-page', {
            headers: {
                'Authorization': `Bearer ${token}`
            }

        })
            .then(response => {
                console.log('// found a page ');
                setPageName(response.data.pageName);
            })
            .catch(error => {
                console.error('Error fetching Facebook page:', error);
                setPageName('No page connected');
            });

        console.log('// end of search ');
    }, [navigate]);

    const disconnectPage = () => {

        console.log('// going for page disconnect');
        const pageId = ''; 

        axios.post('/user/facebook-page/disconnect', { pageId }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log(response.data); // The JSON is automatically parsed
                setPageName('No page connected');
            })
            .catch(error => {
                console.error('Error disconnecting Facebook page:', error);
            });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-blue-600">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Facebook Page Integration</h2>
                <p className="mb-4 text-center">Integrated Page: {pageName}</p>
                <div className="flex flex-col items-center space-y-4">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full text-center"
                        onClick={disconnectPage}
                    >
                        Delete Integration
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full text-center"
                        onClick={() => navigate('/chat')} // Navigates to the chat page
                    >
                        Reply To Messages
                    </button>
                </div>
            </div>
        </div>

    );
}

export default Pages;
