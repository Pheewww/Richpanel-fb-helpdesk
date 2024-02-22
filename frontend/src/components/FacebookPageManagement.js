import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacebookPageManagement = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [pageName, setPageName] = useState('');

    useEffect(() => {
        checkPageConnection();
    }, []);

    const checkPageConnection = async () => {
        try {
            const response = await axios.get('/api/check-connection');
            setIsConnected(response.data.isConnected);
            setPageName(response.data.pageName); 
        } catch (error) {
            console.error('Error checking page connection:', error);
        }
    };

    const connectPage = () => {
        window.location.href = '/api/auth/facebook';
    };

    const disconnectPage = async () => {
        try {
            await axios.post('/api/disconnect');
            setIsConnected(false);
            setPageName('');
        } catch (error) {
            console.error('Error disconnecting page:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                {!isConnected ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Connect your FB Page:</h2>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={connectPage}
                        >
                            Connect Page
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Delete/Disconnect Page:</h2>
                        <p className="mb-4">Integrated Page: {pageName}</p>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={disconnectPage}
                        >
                            Delete Integration
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => { /* TODO: Add navigation to message reply screen */ }}
                        >
                            Reply To Messages
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacebookPageManagement;
