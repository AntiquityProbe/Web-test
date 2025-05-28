(() => {
  // Pages navigation
  const navButtons = document.querySelectorAll('nav button');
  const pages = document.querySelectorAll('section.page');
  function setActivePage(pageId) {
    pages.forEach(page => {
      if(page.id === pageId){
        page.classList.add('active');
        page.setAttribute('tabindex', '0');
      } else {
        page.classList.remove('active');
        page.setAttribute('tabindex', '-1');
      }
    });
    navButtons.forEach(btn => {
      if(btn.dataset.page === pageId) {
        btn.setAttribute('aria-current', 'page');
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('active');
      } else {
        btn.removeAttribute('aria-current');
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('active');
      }
    });
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActivePage(btn.dataset.page);
      history.pushState({page: btn.dataset.page}, '', '#' + btn.dataset.page);
    });
  });

  // Handle browser navigation (back/forward)
  window.addEventListener('popstate', (event) => {
    if(event.state && event.state.page) {
      setActivePage(event.state.page);
    } else {
      setActivePage('home');
    }
  });

  // On load, check URL hash for page
  const initPage = window.location.hash ? window.location.hash.substring(1) : 'home';
  setActivePage(initPage);

  // Blog posts data
  const blogPosts = [
    {
      id: 'post1',
      title: 'Discovering Ancient Cities',
      category: 'casual',
      excerpt: 'An engaging casual post about archaeological discoveries around the world.',
      content: `Archaeology unveils the mysteries of ancient cities through ongoing excavations and analysis. Discover stories of lost civilizations, fascinating ruins, and the tales they tell about human history.`,
      tags: ['archaeology', 'history', 'cities']
    },
    {
      id: 'post2',
      title: 'Analysis of Roman Pottery',
      category: 'academic',
      excerpt: 'An academic deep-dive into the typologies and dating of Roman pottery.',
      content: `Roman pottery offers key insights into trade, daily life, and cultural interactions in antiquity. This study analyzes typologies, manufacturing techniques, and dating methods of pottery found across the Roman Empire.`,
      tags: ['roman', 'pottery', 'study']
    },
    {
      id: 'post3',
      title: 'Fieldwork Techniques in Archaeology',
      category: 'academic',
      excerpt: 'Fundamental fieldwork methodologies explained for students and practitioners.',
      content: `Effective fieldwork is essential to archaeological research. We review surveying, stratigraphy, sampling methods, and recording techniques to help practitioners conduct rigorous investigations.`,
      tags: ['fieldwork', 'research', 'techniques']
    },
    {
      id: 'post4',
      title: 'Casual Finds: Everyday Items of the Ancients',
      category: 'casual',
      excerpt: 'A look at common objects and their stories uncovered by archaeology.',
      content: `Beyond monumental ruins, everyday items tell intimate stories. This blog explores artifacts like utensils, toys, and personal ornaments that reveal aspects of daily life.`,
      tags: ['artifacts', 'daily life', 'casual']
    }
  ];

  const blogPostsContainer = document.querySelector('.blog-posts');
  const blogFilterButtons = document.querySelectorAll('.blog-filters button');

  function renderBlogPosts(filterCategory = 'all') {
    blogPostsContainer.innerHTML = '';

    const filteredPosts = filterCategory === 'all' ? blogPosts : blogPosts.filter(p => p.category === filterCategory);

    if(filteredPosts.length === 0) {
      blogPostsContainer.innerHTML = '<p>No posts found for this category.</p>';
      return;
    }

    filteredPosts.forEach(post => {
      const article = document.createElement('article');
      article.className = 'post';
      article.setAttribute('tabindex', '0');
      article.setAttribute('role', 'listitem');
      article.setAttribute('aria-label', `Blog post titled ${post.title}`);

      article.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="tags" aria-label="Tags: ${post.tags.join(', ')}">${post.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
      `;

      article.addEventListener('click', () => openPostDetail(post.id));
      article.addEventListener('keypress', e => { if(e.key === 'Enter' || e.key === ' ') { openPostDetail(post.id); } });

      blogPostsContainer.appendChild(article);
    });
  }

  blogFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      blogFilterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderBlogPosts(btn.dataset.category);
    });
  });

  // Initial blog posts render
  renderBlogPosts();

  // Blog post detail modal logic
  const postDetailOverlay = document.getElementById('postDetailOverlay');
  const postDetailTitle = document.getElementById('postDetailTitle');
  const postDetailBody = document.getElementById('postDetailBody');
  const postDetailTags = document.getElementById('postDetailTags');
  const closePostBtn = document.getElementById('closePostBtn');

  function openPostDetail(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if(!post) return;

    postDetailTitle.textContent = post.title;
    postDetailBody.textContent = post.content;
    postDetailTags.innerHTML = post.tags.map(tag => `<span>${tag}</span>`).join('');

    postDetailOverlay.classList.add('active');
    postDetailOverlay.focus();
  }

  function closePostDetail() {
    postDetailOverlay.classList.remove('active');
    // Return focus to blog page
    document.querySelector('section#blog').focus();
  }
  closePostBtn.addEventListener('click', closePostDetail);
  postDetailOverlay.addEventListener('click', (e) => {
    if(e.target === postDetailOverlay) closePostDetail();
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && postDetailOverlay.classList.contains('active')) {
      closePostDetail();
    }
  });

  // Resource pool data
  const resources = [
    { id: 'r1', name: 'Ancient Scripts Database', category: 'alphabet' },
    { id: 'r2', name: 'Egyptian Tomb Records', category: 'region' },
    { id: 'r3', name: 'Ceramics and Pottery Analysis', category: 'study' },
    { id: 'r4', name: 'Fieldwork Diaries Collection', category: 'alphabet' },
    { id: 'r5', name: 'Mesopotamian Artifacts Index', category: 'region' },
    { id: 'r6', name: 'Surveying Techniques Handbook', category: 'study' },
    { id: 'r7', name: 'Ancient Trade Routes Atlas', category: 'alphabet' },
    { id: 'r8', name: 'Prehistoric Cave Paintings', category: 'region' },
    { id: 'r9', name: 'Architectural Styles Guide', category: 'study' }
  ];

  const resourceFilterButtons = document.querySelectorAll('.resource-filters button');
  const resourcesList = document.querySelector('.resources-list');

  function renderResources(filter = 'alphabet') {
    resourcesList.innerHTML = '';

    let filtered = resources.filter(r => r.category === filter);

    // For alphabetical, show all sorted by name
    if (filter === 'alphabet') {
      filtered = [...resources].sort((a,b) => a.name.localeCompare(b.name));
    }

    if(filtered.length === 0) {
      resourcesList.innerHTML = '<li>No resources found for this filter.</li>';
      return;
    }

    filtered.forEach(r => {
      const li = document.createElement('li');
      li.textContent = r.name;
      resourcesList.appendChild(li);
    });
  }

  resourceFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      resourceFilterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderResources(btn.dataset.filter);
    });
  });

  // Initial render resources
  renderResources();

})();
