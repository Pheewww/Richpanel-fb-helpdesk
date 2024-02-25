import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import FacebookPageManagement from './components/ConnectPages';
import ChatPage from './components/messaging/ChatPage';
import ChatPageONE from './components/messaging/ChatPageONE';
import Verify from './components/Verify';
import Pages from './components/Pages';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/connect-pages" element={<FacebookPageManagement />} />
          <Route path="/pages" element={<Verify/>} />
          <Route path="/pages-chat" element={<Pages/>} />
          {/* <Route path="/chat" element={<ChatPage />} /> */}
          <Route path="/chat" element={<ChatPageONE />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
