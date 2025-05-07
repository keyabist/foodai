// This script handles the frontend logic for the chat interface.
// It initializes Firebase and communicates with the Cloud Function backend.

// ========================================================================
// 1. Firebase Configuration
// IMPORTANT: Replace this with your actual Firebase config object.
// You can find this in your Firebase Project Settings > General > "Your apps" section.
// ========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyBMZQx3VYrY_z_e9TUBzl1RY5YNNruo5lA",
    authDomain: "test-7b7ce.firebaseapp.com",
    projectId: "test-7b7ce",
    storageBucket: "test-7b7ce.firebasestorage.app",
    messagingSenderId: "656082047707",
    appId: "1:656082047707:web:5703da5200bdd01726b2fe"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  
  
  // Initialize Firebase
  // We use the compat version here as included in index.html for simplicity.
  // For new projects, consider the modular SDK if you don't need compat.
  firebase.initializeApp(firebaseConfig);
  
  // ========================================================================
  // 2. Get DOM Elements
  // ========================================================================
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  
  // ========================================================================
  // 3. Helper Function to Add Messages to the Chat UI
  // ========================================================================
  /**
   * Adds a message bubble to the chat interface.
   * @param {string} text - The message text.
   * @param {'user' | 'bot'} sender - The sender of the message ('user' or 'bot').
   */
  function addMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message', `${sender}-message`);
  
      const bubbleElement = document.createElement('div');
      bubbleElement.classList.add('bubble');
      bubbleElement.textContent = text;
  
      messageElement.appendChild(bubbleElement);
      chatBox.appendChild(messageElement);
  
      // Auto-scroll to the latest message
      chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  // ========================================================================
  // 4. Function to Send Message to Cloud Function
  // ========================================================================
  async function sendMessage() {
      const userText = userInput.value.trim();
  
      if (userText === '') {
          return; // Don't send empty messages
      }
  
      // Add user message to UI
      addMessage(userText, 'user');
  
      // Clear input and disable elements while waiting for response
      userInput.value = '';
      userInput.disabled = true;
      sendButton.disabled = true;
  
      // Prepare data to send to the Cloud Function
      const payload = {
          prompt: userText
      };
  
      // Send the prompt to the Cloud Function via HTTP POST
      // The /agentHandler path is routed to the agentHandler function by firebase.json
      try {
          const response = await fetch('/agentHandler', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
          });
  
          if (!response.ok) {
              const errorDetails = await response.text(); // Get text to see potential server error
              console.error('HTTP error! status:', response.status, errorDetails);
              addMessage(`Error: Could not get a response from the agent. Status: ${response.status}`, 'bot');
              return;
          }
  
          const responseData = await response.json();
          console.log('Received from function:', responseData);
  
          // Add the AI's reply to the UI
          addMessage(responseData.reply, 'bot');
  
          // You could potentially use responseData.data here for more advanced UI feedback
          // e.g., display map data, confirmation of file upload, etc.
          if (responseData.data) {
              console.log("Function execution data:", responseData.data);
              // Example: add a small note if data is present (optional)
              // addMessage("Function execution details available in console.", 'bot');
          }
  
      } catch (error) {
          console.error('Error calling Cloud Function:', error);
          addMessage(`An error occurred: ${error.message}`, 'bot');
      } finally {
          // Re-enable input and button
          userInput.disabled = false;
          sendButton.disabled = false;
          userInput.focus(); // Put focus back on input
      }
  }
  
  // ========================================================================
  // 5. Event Listeners
  // ========================================================================
  
  // Send message when button is clicked
  sendButton.addEventListener('click', sendMessage);
  
  // Send message when Enter key is pressed in the input field
  userInput.addEventListener('keypress', function(event) {
      // Check if the key pressed was Enter (key code 13)
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission behavior
          sendMessage();
      }
  });
  
  // Initial message already in HTML, but you could add dynamic ones here too.
  // Example: addMessage("Hello! I'm your Agentic AI assistant. How can I help you today?", 'bot');
  
  