// ========================================
// AUTHENTICATION STATE MANAGEMENT
// ========================================

// Check authentication state and update UI
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const writeBtn = document.getElementById('writeBtn');

    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        const user = JSON.parse(currentUser);

        // Hide auth buttons, show user profile
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (writeBtn) writeBtn.style.display = 'inline-flex';

        // Set user info
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (userName) userName.textContent = user.name;
        if (userAvatar) {
            // Get initials from name
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.textContent = initials;
        }
    } else {
        // Show auth buttons, hide user profile
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        if (writeBtn) writeBtn.style.display = 'none';
    }
}

// User profile dropdown toggle
const userProfileEl = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');

if (userProfileEl && userDropdown) {
    userProfileEl.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        userDropdown.classList.remove('show');
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.reload();
    });
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);

// ========================================
// EXISTING FUNCTIONALITY
// ========================================

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Category filter functionality
const categoryTabs = document.querySelectorAll('.category-tab');
const articleCards = document.querySelectorAll('.article-card');

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        categoryTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');

        const category = tab.textContent.trim().toLowerCase();

        // Filter articles
        articleCards.forEach(card => {
            const articleCategory = card.querySelector('.article-category').textContent.toLowerCase();

            if (category === 'all' || articleCategory === category) {
                card.style.display = 'grid';
                card.classList.add('fade-in-up');
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Search functionality
const searchInput = document.querySelector('.search-input');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();

        articleCards.forEach(card => {
            const title = card.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.article-category').textContent.toLowerCase();

            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });
    }, 300);
});

// Like button functionality
const likeButtons = document.querySelectorAll('.action-btn');

likeButtons.forEach(btn => {
    if (btn.textContent.includes('❤️')) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentText = btn.textContent;
            const count = parseInt(currentText.match(/[\d.]+K?/)?.[0] || 0);

            if (btn.classList.contains('liked')) {
                btn.classList.remove('liked');
                btn.style.color = 'var(--text-muted)';
            } else {
                btn.classList.add('liked');
                btn.style.color = '#ef4444';

                // Add pulse animation
                btn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
});

// Bookmark functionality
const bookmarkButtons = document.querySelectorAll('.action-btn');

bookmarkButtons.forEach(btn => {
    if (btn.textContent.includes('🔖')) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (btn.classList.contains('bookmarked')) {
                btn.classList.remove('bookmarked');
                btn.textContent = '🔖';
            } else {
                btn.classList.add('bookmarked');
                btn.textContent = '📌';

                // Add scale animation
                btn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
});

// Follow button functionality
const followButtons = document.querySelectorAll('.follow-btn');

followButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (btn.textContent === 'Follow') {
            btn.textContent = 'Following';
            btn.style.background = 'var(--accent-blue)';
            btn.style.color = 'white';
        } else {
            btn.textContent = 'Follow';
            btn.style.background = 'transparent';
            btn.style.color = 'var(--accent-blue)';
        }
    });
});

// Topic tags interaction
const topicTags = document.querySelectorAll('.topic-tag');

topicTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const topic = tag.textContent.trim();
        searchInput.value = topic;
        searchInput.dispatchEvent(new Event('input'));

        // Scroll to articles
        document.querySelector('.articles-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.style.boxShadow = 'none';
    } else {
        header.style.boxShadow = 'var(--shadow)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all article cards and sections
document.querySelectorAll('.article-card, .hero-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Trending items click to scroll
const trendingItems = document.querySelectorAll('.trending-item');

trendingItems.forEach(item => {
    item.addEventListener('click', () => {
        // Simulate navigation to article
        const title = item.querySelector('.trending-title').textContent;
        console.log(`Navigating to: ${title}`);

        // Add visual feedback
        item.style.background = 'var(--bg-hover)';
        setTimeout(() => {
            item.style.background = '';
        }, 300);
    });
});

// Article card click handler
articleCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on action buttons
        if (e.target.closest('.action-btn')) return;

        const title = card.querySelector('.article-title').textContent;
        console.log(`Opening article: ${title}`);

        // Simulate article opening
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC to clear search
    if (e.key === 'Escape') {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
    }

    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// Add loading state simulation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Console welcome message
console.log('%c🚀 Welcome to Insight!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with modern web technologies', 'color: #a0a8c0; font-size: 14px;');

