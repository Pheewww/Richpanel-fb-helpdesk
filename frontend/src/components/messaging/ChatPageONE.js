// components/ChatPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ConversationList from './ConversationsList';
import MessagePanel from './MessagePanel';
import CustomerProfile from './CustomerProfile';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


const ChatPageONE = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [customerProfile, setCustomerProfile] = useState(null);

    const pollingInterval = 3000000;
    const navigate = useNavigate();

    useEffect(() => {

        const fetchConversations = async () => {
            try {


            //     const email = localStorage.getItem('email');
            //    // console.log('// User email', user.email);
            //     if (!email) {
            //         console.log('No email found');
            //         //return; // Redirect to login if no token is found
            //     }
                const token = localStorage.getItem('token');
                console.log('// User Token', token);
                if (!token) {
                    navigate('/');
                    console.log('// USER TOKEN NOT FOUND');

                    return; // Redirect to login if no token is found
                }

                console.log('Going to fetch convo');
                //             , { headers: {
                //             'Authorization': `Bearer ${token}`
                // }}
                // axios.get('http://localhost:5000/conversations').then(response => {
                //     console.log('// found a convo ');
                //     //setPageID(response.data.pageName);
                //     setConversations(response.data);


                //     console.log('I AM IN FETCH CONVERSATION -- PAGE ID ', response.data.pageId);

                // })
                //     .catch(error => {
                //         console.error('Error fetching Convo ', error);
                //         //setPageID('No page connected');
                //         // console.log('convo brought', response.data);
                //         setConversations('No convo found');

                //     });

                const response = await axios.get('http://localhost:5000/conversations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('// RESPONSE ', response);
                console.log('// present user profile ', req.user);
                

                setConversations(response.data);
                console.log('// end of search ');

            } catch (error) {
                console.error('Error fetching conversations:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/');
                }
            }
        };

        fetchConversations();
        const intervalId = setInterval(fetchConversations, pollingInterval);

        return () => clearInterval(intervalId);
    }, []);

    const fetchMessages = useCallback(async () => {
        if (selectedConversation) {
            try {
                console.log('Going to fetch msg in convo---in selected convo bloack');

                const result = await axios.get(`http://localhost:5000/conversations/${selectedConversation._id}/messages`);
                console.log('found msg in convo');

                setMessages(result.data.messages);
            } catch (error) {
                console.error('Failed to fetch messages for conversation:', error);
            }
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (selectedConversation) {
            const intervalId = setInterval(fetchMessages, pollingInterval);

            return () => clearInterval(intervalId);
        }
    }, [selectedConversation, fetchMessages]);

    const selectConversation = async (conversationId) => {
        try {
            const result = await axios(`http://localhost:5000/conversations/${conversationId}`);
            setSelectedConversation(result.data);
            setMessages(result.data.messages);
        } catch (error) {
            console.error('Failed to select conversation:', error);
        }
    };

    const sendMessage = async (text) => {
        if (selectedConversation) {
            try {
                // Send message to the server
                console.log('send msg to server');
                const response = await axios.post('http://localhost:5000/send-message', {
                    senderPsid: selectedConversation.customerId,
                    messageText: text,
                    conversationId: selectedConversation._id,
                    pageId: selectedConversation.pageId
                });

                console.log('Message sent and logged!', response.data);
                console.log('Working on showing message on screen ');



                const newMessage = {
                    text: text,
                    timestamp: response.data.sentAt,
                    messageId: response.data.messageId,
                    senderId: 'PAGE_ID', // Replace with actual Page ID
                    recipientId: selectedConversation.customerId,
                    outgoing: true
                };
                setMessages([...messages, newMessage]);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    return (
        <div className="flex">
            <ConversationList conversations={conversations} onSelectConversation={selectConversation} />
            <MessagePanel messages={messages} onSendMessage={sendMessage} />
            {customerProfile && <CustomerProfile profile={customerProfile} />}
        </div>
    );
};

ConversationList.propTypes = {
    conversations: PropTypes.array.isRequired,
    onSelectConversation: PropTypes.func.isRequired,
};

export default ChatPageONE;