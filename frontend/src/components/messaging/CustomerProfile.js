import React from 'react';

const CustomerProfile = ({ profile }) => {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="flex flex-col items-center p-4">
                <img src={profile.profilePic} alt={profile.firstName} className="rounded-full h-24 w-24 border p-1" />
                <h3 className="mt-2 font-bold text-lg">{profile.name}</h3>
                <span className="text-gray-400">{profile.status}</span>
                <div className="flex mt-4 space-x-2">
                    <button className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex">
                        <i className="fa fa-phone mr-2"></i> Call
                    </button>
                    <button className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex">
                        <i className="fa fa-user mr-2"></i> Profile
                    </button>
                </div>
            </div>
            <div className="border-t mt-4 pt-4 mb-2 mx-4">
                <div className="text-lg font-bold text-gray-800 mb-2">Customer details</div>
                <div className="flex flex-col text-gray-600">
                    <span><strong>Email</strong> {profile.email}</span>
                    <span><strong>First Name</strong> {profile.firstName}</span>
                    <span><strong>Last Name</strong> {profile.lastName}</span>
                    <button className="text-blue-600 hover:underline mt-4">View more details</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;




