// components/CustomerProfile.js
import React from 'react';

const CustomerProfile = ({ profile }) => {
    return (
        <div className="w-1/4 bg-gray-50 h-screen p-4">
            <div className="flex flex-col items-center">
                <img src={profile.picture} alt="Profile" className="rounded-full h-24 w-24" />
                <div className="mt-4">
                    <div className="font-bold">{profile.name}</div>
                    <div className="text-sm text-gray-600">{profile.email}</div>
                </div>
                <div className="flex mt-4 space-x-2">
                    <button className="border p-2 bg-green-500 text-white">Call</button>
                    <button className="border p-2 bg-blue-500 text-white">Profile</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
