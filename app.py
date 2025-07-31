from flask import Flask, render_template, request, jsonify, send_from_directory
import google.generativeai as genai
import requests
import os

app = Flask(__name__)

# Configure Gemini API - Use environment variable
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

# GitHub and Resume Data
GITHUB_USERNAME = "kalasuryakiran"
RESUME_DATA = """
KALA SURYA KIRAN - AI Engineer | Prompt Engineer | LLM Developer

SKILLS:
- AI/LLM Technologies: OpenAI GPT-4, Google Gemini, Claude, LangChain, LlamaIndex
- Prompt Engineering: Few-shot learning, Chain-of-thought, Persona-based techniques
- Programming: Python, JavaScript, TypeScript, HTML, CSS, Dart
- Frameworks: React, Node.js, Flask, FastAPI, TensorFlow, PyTorch
- Data Analysis: Excel, SQL, Power BI, Jupyter Notebook
- APIs & Integration: REST APIs, GraphQL, OAuth, JWT
- Databases: PostgreSQL, MongoDB, SQLite, Redis
- Tools: Git, GitHub, Docker, VS Code

PROJECTS (Based on GitHub repositories):
1. Portfolio - Personal portfolio website
2. Resume-Tailor-Assistant - AI-powered resume customization
3. AI-Video-Creator - AI-powered video content creation
4. AI-Tutor - Educational AI assistant
5. Weekend-Budget-Planner - Financial planning application
6. Resume-BulletPoint-Generator - AI tool for resume bullet points
7. foodplannerbot - AI-powered food planning assistant
8. Swiggy_AI_Bot_Assistant - AI chatbot for food delivery
9. The-Chocolate-Report-Predictive-Analysis-Using-AI - Data science project
10. E-Commerce-Brazilian-Analysis-in-Q4 - Business intelligence analysis

EXPERIENCE & BACKGROUND:
- Fresh graduate seeking opportunities in AI/ML and Software Development
- Built 18+ projects on GitHub demonstrating practical skills in AI/ML applications
- Developed AI-powered tools for resume optimization and content creation
- Created data analysis and business intelligence solutions
- Implemented computer vision and deep learning projects
- Built full-stack applications with modern web technologies
- Specialized in prompt engineering and LLM integration
- Strong academic foundation with hands-on project experience
- Passionate about AI/ML and eager to contribute to innovative projects

CONTACT:
- Email: kalasuryakiran12@gmail.com
- Phone: +91 8688415437
- Location: Palwancha, Telangana, India
- LinkedIn: https://www.linkedin.com/in/kala-suryakiran
- GitHub: https://github.com/kalasuryakiran
"""

class AIChatbot:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro')
        self.github_data = self.fetch_github_data()
        self.context = self.create_context()
    
    def fetch_github_data(self):
        try:
            repos_url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=100"
            repos_response = requests.get(repos_url)
            repos = repos_response.json()
            
            github_data = {
                "username": GITHUB_USERNAME,
                "total_repos": len(repos),
                "stars": sum(repo.get("stargazers_count", 0) for repo in repos),
                "repositories": []
            }
            
            for repo in repos:
                repo_data = {
                    "name": repo.get("name"),
                    "description": repo.get("description", ""),
                    "language": repo.get("language"),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "url": repo.get("html_url"),
                    "updated_at": repo.get("updated_at")
                }
                github_data["repositories"].append(repo_data)
            
            return github_data
            
        except Exception as e:
            print(f"Error fetching GitHub data: {e}")
            return {"username": GITHUB_USERNAME, "repositories": []}
    
    def create_context(self):
        context = f"""
        You are an AI assistant for Kala Surya Kiran, a fresh graduate seeking opportunities in AI/ML and Software Development. 
        Use the following information to answer questions:

        RESUME INFORMATION:
        {RESUME_DATA}

        GITHUB INFORMATION:
        Username: {self.github_data['username']}
        Total Repositories: {self.github_data.get('total_repos', len(self.github_data['repositories']))}
        Total Stars: {self.github_data.get('stars', 0)}
        
        Top Projects:
        """
        
        sorted_repos = sorted(
            self.github_data['repositories'], 
            key=lambda x: (x['stars'], x['updated_at']), 
            reverse=True
        )
        
        for repo in sorted_repos[:10]:
            context += f"""
        - {repo['name']}: {repo['description']}
          Language: {repo['language']}
          Stars: {repo['stars']}, Forks: {repo['forks']}
          URL: {repo['url']}
        """
        
        context += """
        
        INSTRUCTIONS:
        1. Answer questions about Kala Surya Kiran's skills, projects, and background
        2. Emphasize that he is a fresh graduate seeking job opportunities
        3. Highlight his strong project portfolio and practical skills
        4. Focus on AI/ML expertise and GitHub projects
        5. Be helpful, professional, and accurate
        6. Keep responses concise but informative
        7. When asked about experience, mention it's primarily through academic projects and personal GitHub projects
        8. Emphasize eagerness to learn and contribute to real-world projects
        9. When asked about GitHub or LinkedIn links, provide the full URLs:
           - GitHub: https://github.com/kalasuryakiran
           - LinkedIn: https://www.linkedin.com/in/kala-suryakiran
           - Email: kalasuryakiran12@gmail.com
        10. Make links clickable by including the full URL in responses
        """
        
        return context
    
    def generate_response(self, user_question):
        try:
            prompt = f"""
            {self.context}
            
            User Question: {user_question}
            
            Please provide a helpful response based on the information provided.
            Remember that Kala Surya Kiran is a fresh graduate seeking job opportunities.
            
            IMPORTANT: If the user asks about GitHub, LinkedIn, or contact links, provide the full URLs:
            - GitHub: https://github.com/kalasuryakiran
            - LinkedIn: https://www.linkedin.com/in/kala-suryakiran
            - Email: kalasuryakiran12@gmail.com
            """
            
            response = self.model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"

# Initialize chatbot
chatbot = AIChatbot()

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    response = chatbot.generate_response(user_message)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 