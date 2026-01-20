// Lead Management System
document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');
    const formMessage = document.getElementById('formMessage');

    if (leadForm) {
        leadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const mobile = document.getElementById('mobile').value;
            const query = document.getElementById('query').value;
            const date = new Date().toLocaleString();

            // Save to LocalStorage for Admin Panel
            const leads = JSON.parse(localStorage.getItem('leads') || '[]');
            leads.push({ name, mobile, query, date });
            localStorage.setItem('leads', JSON.stringify(leads));

            // WhatsApp Redirection
            const wpNumber = "918090090051";
            const message = `*New Security Inquiry - Vijay Electronics*%0A%0A*Name:* ${name}%0A*Mobile:* ${mobile}%0A*Requirement:* ${query}%0A*Date:* ${date}`;
            const wpUrl = `https://wa.me/${wpNumber}?text=${message}`;

            if (formMessage) {
                formMessage.textContent = 'Redirecting to WhatsApp...';
                formMessage.style.display = 'block';
                formMessage.style.color = '#25D366';
            }

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = wpUrl;
            }, 1000);

            this.reset();
        });
    }

    // Admin Panel Logic - Heavily modified
    const loginForm = document.getElementById('loginForm');
    const adminContent = document.getElementById('adminContent'); // This was 'adminContent' in original, 'adminPanel' in new
    const loginSection = document.getElementById('loginSection');
    const leadsBody = document.getElementById('leadsBody'); // This was 'leadsBody' in original, 'leadList' in new

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('adminPass').value;

            if (pass === 'vijay@2026') {
                if (loginSection) loginSection.style.display = 'none';
                if (adminContent) adminContent.style.display = 'block'; // Assuming adminContent is the correct ID for the panel
                displayLeads();
            } else {
                alert('Incorrect Password');
            }
        });
    }

    function displayLeads() {
        const leadList = document.getElementById('leadsBody'); // Using original ID 'leadsBody'
        if (!leadList) return;

        const leads = JSON.parse(localStorage.getItem('leads') || '[]'); // Key changed to 'leads'
        leadList.innerHTML = '';

        if (leads.length === 0) {
            leadList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No leads found yet.</td></tr>'; // colspan changed to 5 for new delete column
            return;
        }

        leads.reverse().forEach((lead, index) => {
            const row = document.createElement('tr');
            // The index here is for the reversed array, need to adjust for actual deletion
            const originalIndex = leads.length - 1 - index;
            row.innerHTML = `
                <td>${lead.date}</td>
                <td>${lead.name}</td>
                <td><a href="tel:${lead.mobile}" style="color: var(--primary-color); text-decoration: none;">${lead.mobile}</a></td>
                <td>${lead.query}</td>
                <td><button onclick="deleteLead(${originalIndex})" style="background: red; border: none; padding: 5px; border-radius: 4px; color: #fff; cursor: pointer;"><i class="fas fa-trash"></i></button></td>
            `;
            leadList.appendChild(row);
        });
    }

    // New function for deleting a single lead
    window.deleteLead = (index) => {
        const leads = JSON.parse(localStorage.getItem('leads') || '[]');
        leads.splice(index, 1);
        localStorage.setItem('leads', JSON.stringify(leads));
        displayLeads();
    };

    // Initial Admin Load - Added for admin panel
    if (document.getElementById('leadsBody')) { // Using original ID 'leadsBody'
        displayLeads();
    }

    // Mobile Menu Toggle - Modified existing logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('nav-active'); // Changed from 'active' to 'nav-active'
            const icon = mobileMenuBtn.querySelector('i');
            if (nav.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when clicking a link - Adjusted for new class name
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // Clear Leads Function (for admin use)
    window.clearLeads = () => {
        if (confirm('Are you sure you want to clear all leads?')) {
            localStorage.removeItem('leads');
            displayLeads();
        }
    };

    // AI Voice Welcome - Home Page Only (1.5s Auto-play)
    const homePagePaths = ['index.html', ''];
    const currentPath = window.location.pathname.split('/').pop();

    if (homePagePaths.includes(currentPath) || window.location.pathname === '/' || window.location.href.endsWith('/')) {
        const playWelcome = () => {
            const welcomeAudio = new Audio('audio/welcome.wav');
            welcomeAudio.play().then(() => {
                // Remove interaction listeners if auto-play succeeded
                document.removeEventListener('click', playWelcome);
                document.removeEventListener('touchstart', playWelcome);
                document.removeEventListener('scroll', playWelcome);
            }).catch(error => {
                console.log("Browser blocked autoplay. Audio will play on first interaction.");
                // Fallback: Play on first user interaction
                const startOnInteraction = () => {
                    welcomeAudio.play();
                    document.removeEventListener('click', startOnInteraction);
                    document.removeEventListener('touchstart', startOnInteraction);
                    document.removeEventListener('scroll', startOnInteraction);
                };
                document.addEventListener('click', startOnInteraction, { once: true });
                document.addEventListener('touchstart', startOnInteraction, { once: true });
                document.addEventListener('scroll', startOnInteraction, { once: true });
            });
        };

        setTimeout(playWelcome, 1500); // Exactly 1.5 Seconds
    }
});
