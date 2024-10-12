import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api.js';

function Pages() {
    const navigate = useNavigate();
    const [pageName, setPageName] = useState('');

    useEffect(() => {
        const fetchPageData = async () => {
            console.log('// going for page search');


            const token = localStorage.getItem('token');
            console.log('// User Token', token);
          

            // if (!token) {
            //     navigate('/');
            // }
            try {
                const response = await fetch('http://localhost:5000/user/facebook-page', {
                    method: 'GET',
                    headers: new Headers({
                        'authorization': `${token}`,
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('token')
                    })
                });
                console.log('// RESPONSE DATA -- PAGES IN FRONTEND', response);

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const data = await response.json();
                console.log('// found a page ');
                setPageName(data.pageName);
            } catch (error) {
                console.error('Error fetching Facebook page:', error);
                setPageName('No page connected');
            }

            console.log('// end of search ');
        };

        fetchPageData();
    }, [navigate]);

    // const disconnectPage = () => {

    //     console.log('// going for page disconnect');
    //     const pageId = ''; 

    //     axios.post(`${process.env.REACT_APP_API_URL}/user/facebook-page/disconnect`, { pageId }, {
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`
    //         }
    //     })
    //         .then(response => {
    //             console.log(response.data); 
    //             setPageName('No page connected. Did You Connect Ur FB Page');
    //         })
    //         .catch(error => {
    //             console.error('Error disconnecting Facebook page:', error);
    //         });
    // };

    return (
        <div className="flex justify-center items-center h-screen bg-blue-600">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Facebook Page Integration</h2>
                <p className="mb-4 text-center">Integrated Page: {pageName}</p>
                <div className="flex flex-col items-center space-y-4">


                    <a
                        href="https://richpanel-fb-helpdesk-gwbm.onrender.com/data-deletion"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full text-center"
                    >

                        Delete Integration
                    </a>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full text-center"
                        onClick={() => navigate('/chat')}
                    >
                        Reply To Messages
                    </button>
                </div>
            </div>
        </div>

    );
}

export default Pages;
