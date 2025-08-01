import React, { Fragment, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import MetaData from '../layouts/MetaData';
import SideBar from './SideBar';

const SendEmailPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !message) {
      toast.error('Please fill all the fields');
      return;
    }

    setIsSending(true);
    try {
      const { data } = await axios.post(`http://localhost:4000/users/send-bulk-email`, { subject, message });
      if (data.success) {
        toast.success("Emails queued successfully!");
        setSubject('');
        setMessage('');
      } else {
        throw new Error("Failed to send emails");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send emails");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <Fragment>
      <MetaData title={'Send Emails'} />
      <div className="flex min-h-screen bg-gray-50 sm:mt-[72px] mt-16">
        <SideBar />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex-1 p-6 md:p-10 lg:p-12 max-w-4xl mx-auto w-full"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Send Email to All Users</h2>
              <p className="text-gray-600">Compose a message to be sent to all registered users</p>
            </div>

            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-40"
              ></textarea>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                onClick={handleSubmit}
                disabled={isSending}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 ${
                  isSending 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isSending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Emails'
                )}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </Fragment>
  );
};

export default SendEmailPage;