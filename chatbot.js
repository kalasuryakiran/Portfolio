// Chatbot JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('hidden');
        if (!chatbotContainer.classList.contains('hidden')) {
            chatbotInput.focus();
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.add('hidden');
    });

    // Send message function
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        try {
            // Send to backend API
            const response = await generateResponse(message);
            hideTypingIndicator();
            addMessage(response, 'bot');
        } catch (error) {
            hideTypingIndicator();
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Check if the text contains HTML (for links)
        if (text.includes('<a href=')) {
            messageDiv.innerHTML = text;
        } else {
            messageDiv.textContent = text;
        }
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // API integration for deployed backend
    async function generateResponse(userMessage) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            // Fallback to simple responses if API fails
            return generateSimpleResponse(userMessage);
        }
    }

    // Fallback simple response generation
    function generateSimpleResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('skill') || message.includes('technology')) {
            return "Kala Surya Kiran's main skills include AI/LLM Technologies (OpenAI GPT-4, Google Gemini, Claude, LangChain), Prompt Engineering, Programming (Python, JavaScript, TypeScript), Frameworks (React, Node.js, Flask, FastAPI), and Data Analysis tools.";
        }
        
        if (message.includes('project') || message.includes('github')) {
            return "Kala Surya Kiran has built 18+ projects on GitHub including AI-powered tools like Resume-Tailor-Assistant, AI-Video-Creator, AI-Tutor, and data analysis projects. You can view all projects at <a href='https://github.com/kalasuryakiran' target='_blank' style='color: var(--orange-yellow-crayola); text-decoration: underline;'>github.com/kalasuryakiran</a>";
        }
        
        if (message.includes('github') || message.includes('github link')) {
            return "Here's Kala Surya Kiran's GitHub profile: <a href='https://github.com/kalasuryakiran' target='_blank' style='color: var(--orange-yellow-crayola); text-decoration: underline;'>https://github.com/kalasuryakiran</a> - You can view all his projects, repositories, and contributions there!";
        }
        
        if (message.includes('linkedin') || message.includes('linkedin link')) {
            return "Here's Kala Surya Kiran's LinkedIn profile: <a href='https://www.linkedin.com/in/kala-suryakiran' target='_blank' style='color: var(--orange-yellow-crayola); text-decoration: underline;'>https://www.linkedin.com/in/kala-suryakiran</a> - Connect with him for professional opportunities!";
        }
        
        if (message.includes('experience') || message.includes('background')) {
            return "Kala Surya Kiran is a fresh graduate with strong project experience. He has built multiple AI/ML applications, data analysis projects, and full-stack applications. His experience comes from academic projects and personal GitHub projects.";
        }
        
        if (message.includes('contact') || message.includes('email')) {
            return "Contact Information: Email: <a href='mailto:kalasuryakiran12@gmail.com' style='color: var(--orange-yellow-crayola); text-decoration: underline;'>kalasuryakiran12@gmail.com</a>, Phone: +91 8688415437, Location: Palwancha, Telangana, India. LinkedIn: <a href='https://www.linkedin.com/in/kala-suryakiran' target='_blank' style='color: var(--orange-yellow-crayola); text-decoration: underline;'>linkedin.com/in/kala-suryakiran</a>";
        }
        
        if (message.includes('job') || message.includes('hire') || message.includes('opportunity')) {
            return "Kala Surya Kiran is actively seeking opportunities in AI Engineering, Prompt Engineering, and Software Development. He's a fresh graduate with strong technical skills and a passion for AI/ML. Feel free to reach out for potential collaborations!";
        }
        
        if (message.includes('link') || message.includes('social')) {
            return "Here are Kala Surya Kiran's main links:<br><br>• <a href='https://github.com/kalasuryakiran' target='_blank' style='color: var(--orange-yellow-crayola); text-decoration: underline;'>GitHub Profile</a><br>• <a href='https://www.linkedin.com/in/kala-suryakiran' target='_blank' style='color: var(--orange-yellow-crayola); text-decoration: underline;'>LinkedIn Profile</a><br>• <a href='mailto:kalasuryakiran12@gmail.com' style='color: var(--orange-yellow-crayola); text-decoration: underline;'>Email</a>";
        }
        
        return "Hello! I can help you learn about Kala Surya Kiran's skills, projects, and background. Ask me about his skills, projects, experience, contact information, or social links!";
    }

    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target)) {
            chatbotContainer.classList.add('hidden');
        }
    });

    // Prevent closing when clicking inside chatbot
    chatbotContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}); 