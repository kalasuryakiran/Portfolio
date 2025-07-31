// Single page navigation with anchor links
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully');
    
    // Sidebar toggle functionality
    const sidebarBtn = document.querySelector('[data-sidebar-btn]');
    const sidebar = document.querySelector('[data-sidebar]');
    
    if (sidebarBtn && sidebar) {
        sidebarBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    } else {
        console.log('Sidebar elements not found');
    }
    
    // Contact form functionality
    const form = document.querySelector('[data-form]');
    const formInputs = document.querySelectorAll('[data-form-input]');
    const formBtn = document.querySelector('[data-form-btn]');
    
    if (form && formInputs.length > 0 && formBtn) {
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (form.checkValidity()) {
                    formBtn.removeAttribute('disabled');
                } else {
                    formBtn.setAttribute('disabled', '');
                }
            });
        });
    } else {
        console.log('Contact form elements not found');
    }
    
    // Portfolio filter functionality
    const filterBtns = document.querySelectorAll('[data-filter-btn]');
    const filterItems = document.querySelectorAll('[data-filter-item]');
    
    if (filterBtns.length > 0 && filterItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filterValue = this.textContent.trim().toLowerCase();
                
                // Remove active from all filter buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                this.classList.add('active');
                
                // Filter items
                filterItems.forEach(item => {
                    const categories = item.dataset.category;
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            });
        });
    } else {
        console.log('Portfolio filter elements not found');
    }
    
    // Highlight active navigation link based on scroll position
    const navLinks = document.querySelectorAll('.navbar-link');
    const sections = document.querySelectorAll('article[id]');
    
    if (navLinks.length > 0 && sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    } else {
        console.log('Navigation elements not found');
    }
    
    // --- GitHub Projects Fetch and Dynamic Rendering ---
    const projectList = document.querySelector('.project-list');
    const githubUsername = 'kalasuryakiran'; // Change to your username if needed
    const viewMoreBtn = document.getElementById('view-more-projects-btn');
    let allRepos = [];
    let showingAll = false;
    const defaultVisible = 5;

    function extractSkillsFromReadme(readmeText) {
        const skills = [];
        const lines = readmeText.split('\n');
        let inSkillsSection = false;
        
        // Skills relevant to AI/LLM job roles - more focused and selective
        const roleRelevantSkills = [
            // Core AI/LLM Technologies (High Priority)
            /\b(OpenAI|GPT-4|GPT-3\.5|ChatGPT|Claude|Gemini|Anthropic|LangChain|LlamaIndex|Hugging Face|Transformers)\b/gi,
            // AI Techniques & Prompt Engineering (High Priority)
            /\b(Prompt Engineering|Few-shot|Chain of Thought|CoT|Persona-based|RAG|Retrieval Augmented Generation|Fine-tuning|Zero-shot|In-context Learning|Adversarial Prompting)\b/gi,
            // Core Programming Languages for AI (Medium Priority)
            /\b(Python|JavaScript|TypeScript|HTML|CSS)\b/gi,
            // AI/ML Frameworks (Medium Priority)
            /\b(TensorFlow|PyTorch|Scikit-learn|Flask|FastAPI|React|Node\.js|Express)\b/gi,
            // APIs & Integration (Medium Priority)
            /\b(API|REST|GraphQL|OAuth|JWT|AWS API|Google API|GitHub API)\b/gi,
            // Database for AI Applications (Low Priority)
            /\b(PostgreSQL|MongoDB|SQLite|Redis|Firebase)\b/gi,
            // Development Tools (Low Priority)
            /\b(Git|GitHub|Docker|VS Code|npm|yarn)\b/gi
        ];

        for (let line of lines) {
            line = line.trim();
            
            // Check for skills section headers
            if (/^(##+\s*)?(technologies|built with|stack|skills|tools|libraries|frameworks)/i.test(line)) {
                inSkillsSection = true;
                continue;
            }
            
            // Extract skills from bullet points in skills section
            if (inSkillsSection && (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• '))) {
                const skillText = line.replace(/^[-*•]\s*/, '');
                roleRelevantSkills.forEach(pattern => {
                    const matches = skillText.match(pattern);
                    if (matches) {
                        matches.forEach(match => {
                            if (!skills.includes(match)) skills.push(match);
                        });
                    }
                });
            } else if (inSkillsSection && line === '') {
                break;
            }
            
            // Also search for skills in regular content
            roleRelevantSkills.forEach(pattern => {
                const matches = line.match(pattern);
                if (matches) {
                    matches.forEach(match => {
                        if (!skills.includes(match)) skills.push(match);
                    });
                }
            });
        }
        
        // Limit to top 5-6 most relevant skills to avoid overwhelming the cards
        return skills.slice(0, 6);
    }

    function getFallbackSkills(repo) {
        // Fallback skills focused on AI/LLM job roles
        const fallbackSkills = [];
        
        if (repo.language) {
            // Only include relevant languages for AI roles
            const relevantLanguages = ['Python', 'JavaScript', 'TypeScript', 'HTML', 'CSS'];
            if (relevantLanguages.includes(repo.language)) {
                fallbackSkills.push(repo.language);
            }
        }
        
        // Add skills based on repo name patterns - focused on AI/LLM roles
        const name = repo.name.toLowerCase();
        const description = (repo.description || '').toLowerCase();
        
        // AI/LLM specific patterns
        if (name.includes('ai') || name.includes('chat') || name.includes('gpt') || description.includes('ai')) {
            fallbackSkills.push('AI', 'OpenAI');
        }
        if (name.includes('gemini') || description.includes('gemini')) {
            fallbackSkills.push('Google Gemini', 'AI');
        }
        if (name.includes('prompt') || description.includes('prompt')) {
            fallbackSkills.push('Prompt Engineering');
        }
        if (name.includes('llm') || description.includes('llm')) {
            fallbackSkills.push('LLM', 'AI');
        }
        if (name.includes('chatbot') || name.includes('bot') || description.includes('bot')) {
            fallbackSkills.push('AI', 'Chatbot');
        }
        
        // Web development patterns (relevant for AI applications)
        if (name.includes('api') || description.includes('api')) {
            fallbackSkills.push('API');
        }
        if (name.includes('web') || name.includes('frontend') || description.includes('web')) {
            fallbackSkills.push('HTML', 'CSS', 'JavaScript');
        }
        if (name.includes('react') || description.includes('react')) {
            fallbackSkills.push('React');
        }
        if (name.includes('node') || description.includes('node')) {
            fallbackSkills.push('Node.js');
        }
        if (name.includes('python') || description.includes('python')) {
            fallbackSkills.push('Python');
        }
        if (name.includes('flask') || description.includes('flask')) {
            fallbackSkills.push('Flask');
        }
        
        // Limit to 4-5 most relevant skills
        return [...new Set(fallbackSkills)].slice(0, 5);
    }

    function createProjectCard(repo, skills) {
        const li = document.createElement('li');
        li.className = 'project-item active';
        
        // Use extracted skills or fallback skills
        const displaySkills = skills && skills.length > 0 ? skills : getFallbackSkills(repo);
        
        li.innerHTML = `
            <div class="project-card">
              <div class="project-card-header">
                <ion-icon name="logo-github"></ion-icon>
                <h3 class="project-title">${repo.name}</h3>
              </div>
              <div class="project-tech">
                ${displaySkills.length > 0 ? displaySkills.map(skill => `<span class='tech-tag'>${skill}</span>`).join('') : '<span class="tech-tag">Code</span>'}
              </div>
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="github-btn">
                <ion-icon name="logo-github"></ion-icon>
                <span>View on GitHub</span>
              </a>
            </div>
        `;
        return li;
    }

    function renderProjects(showAll) {
        projectList.innerHTML = '';
        const toShow = showAll ? allRepos : allRepos.slice(0, defaultVisible);
        toShow.forEach(async repo => {
            // Try to fetch README.md or replit.md for skills
            let skills = [];
            try {
                const readmeRes = await fetch(`https://raw.githubusercontent.com/${githubUsername}/${repo.name}/main/README.md`);
                if (readmeRes.ok) {
                    const readmeText = await readmeRes.text();
                    skills = extractSkillsFromReadme(readmeText);
                } else {
                    // Try replit.md
                    const replitRes = await fetch(`https://raw.githubusercontent.com/${githubUsername}/${repo.name}/main/replit.md`);
                    if (replitRes.ok) {
                        const replitText = await replitRes.text();
                        skills = extractSkillsFromReadme(replitText);
                    }
                }
            } catch (e) {}
            projectList.appendChild(createProjectCard(repo, skills));
        });
    }

    if (projectList) {
        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`)
            .then(response => response.json())
            .then(repos => {
                allRepos = repos;
                renderProjects(false);
                if (viewMoreBtn && allRepos.length > defaultVisible) {
                    viewMoreBtn.style.display = '';
                    viewMoreBtn.textContent = 'View More';
                    showingAll = false;
                    viewMoreBtn.onclick = function() {
                        showingAll = !showingAll;
                        renderProjects(showingAll);
                        viewMoreBtn.textContent = showingAll ? 'View Less' : 'View More';
                    };
                } else if (viewMoreBtn) {
                    viewMoreBtn.style.display = 'none';
                }
            })
            .catch(err => {
                if (viewMoreBtn) viewMoreBtn.style.display = 'none';
                projectList.innerHTML = '<li style="color: #ff6f61; text-align: center;">Failed to load projects from GitHub.</li>';
            });
    }
    
    // Removed Go to Navigation button functionality (no longer present)

    console.log('Single page navigation initialized');
});