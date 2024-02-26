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
    const [conversationsProfile, setConversationsProfile] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [customerProfile, setCustomerProfile] = useState(null);

    const pollingInterval = 30000;
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
                const apiUrl = process.env.REACT_APP_API_URL || 'https://richpanel-fb-helpdesk-gwbm.onrender.com';
                const response = await axios.get(`${apiUrl}/conversations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('// RESPONSE ', response.data);


                if (Array.isArray(response.data) && response.data.length > 0) {
                    setConversations(response.data);
                } else {
                    
                    console.log('No conversations found or data format is incorrect');
                    setConversations([]); 
                }
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
    }, [navigate]);

    const fetchMessages = useCallback(async () => {
        if (selectedConversation) {
            try {
                console.log('Going to fetch selected msg in convo---in selected convo block');
                const apiUrl = process.env.REACT_APP_API_URL || 'https://richpanel-fb-helpdesk-gwbm.onrender.com';
                const result = await axios.get(`${apiUrl}/user/conversations/${selectedConversation._id}`);
                console.log('found msg in convo', selectedConversation._id, result);

                // const newMessages = result.data.messages || [];
                // const lastFetchedMessage = messages[messages.length - 1];

                // const newMessagesToAdd = newMessages.filter(message =>
                //     !lastFetchedMessage || new Date(message.timestamp) > new Date(lastFetchedMessage.timestamp)
                // );

                // if (newMessagesToAdd.length > 0) {
                //     setMessages([...messages, ...newMessagesToAdd]);
                // }

                const newMessages = result.data.messages || [];
                console.log('NEW MESSAGES', newMessages);


                setMessages(currentMessages => {
                    const lastFetchedMessage = currentMessages[currentMessages.length - 1];
                    console.log('LAST FETCHED MESSAGE', lastFetchedMessage);
                    const newMessagesToAdd = newMessages.filter(message =>
                        !lastFetchedMessage || new Date(message.timestamp) > new Date(lastFetchedMessage.timestamp)
                    );
                    console.log('NEW MESSAGES TO ADD', newMessagesToAdd);
                    return [...currentMessages, ...newMessagesToAdd];
                });
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
            console.log('Going for Convo');
            const apiUrl = process.env.REACT_APP_API_URL || 'https://richpanel-fb-helpdesk-gwbm.onrender.com';
            const result = await axios.get(`${apiUrl}/user/conversations/${conversationId}`);
            console.log('Convo result', result);

            setSelectedConversation(result.data);
            console.log('Convo result data', result.data);

            setMessages(result.data.messages || []);
            console.log('Convo result t4ext', result.data.text);

            console.log('GOING FOR PROFILE');

            const PSID = result.data.customerId;
            const PAGE = result.data.pageId;
            console.log('PSID', PSID);
            console.log('PAGE', PAGE);
            // Fetch customer profile from your backend
            
            const profileResult = await axios.get(`${apiUrl}/user/customer/${PSID}/${PAGE}/profile`);
            console.log('PROFILE FETCHED', profileResult);

            setCustomerProfile(profileResult.data.profile);
            setConversationsProfile(profileResult.data.profile);

        } catch (error) {
            console.error('Failed to select conversation:', error);
        }
    };

    const sendMessage = async (text) => {
        if (selectedConversation) {
            try {
                console.log('send msg to server');
                const apiUrl = process.env.REACT_APP_API_URL || 'https://richpanel-fb-helpdesk-gwbm.onrender.com';
                const response = await axios.post(`${apiUrl}/user/chat/send-message`, {
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
                    senderId: selectedConversation.pageId,
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
            <MessagePanel messages={messages} onSendMessage={sendMessage} profile={customerProfile} />
            {customerProfile && <CustomerProfile profile={customerProfile} />}
        </div>
    );
};

ConversationList.propTypes = {
    conversations: PropTypes.array.isRequired,
    onSelectConversation: PropTypes.func.isRequired,
};

export default ChatPageONE;