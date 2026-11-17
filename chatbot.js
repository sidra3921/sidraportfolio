/**
 * Sidra — portfolio assistant (chatbot)
 * ---------------------------------------------------------------
 * A small, fully client-side assistant. Answers come from the
 * knowledge base below (the same facts shown on the site), matched
 * by keywords — nothing a visitor types is sent to any server.
 *
 * To change what it says, edit INTENTS:
 *   keys      words/phrases that trigger the answer ([word, weight] for extra weight)
 *   priority  breaks ties: specific topics (2) beat general ones (1)
 *   answer    HTML shown to the visitor
 *   chips     follow-up suggestions shown after the answer
 */
(() => {
  'use strict';

  /* ------------------------------------------------------------
   * Links used in answers
   * ---------------------------------------------------------- */
  const ext = (href, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;
  const go = (hash, text) => `<a href="${hash}">${text}</a>`;
  const act = (action, text) => `<button type="button" class="chatbot-link" data-chat-action="${action}">${text}</button>`;
  const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

  const EMAIL = '<a href="mailto:sidra3921@gmail.com">sidra3921@gmail.com</a>';

  /* ------------------------------------------------------------
   * Knowledge base
   * ---------------------------------------------------------- */
  const INTENTS = [
    {
      id: 'greeting',
      priority: 0,
      keys: ['hi', 'hello', 'hey', 'hiya', 'salam', 'salaam', 'assalam', 'assalamualaikum', 'aoa', 'good morning', 'good afternoon', 'good evening'],
      answer: "Hi there! 👋 I'm Sidra's portfolio assistant. Ask me about her skills, projects, experience, research or certificates — or pick a topic below.",
      chips: ['About Sidra', 'Skills', 'Projects', 'Contact'],
    },
    {
      id: 'about',
      priority: 0.5,
      keys: ['about', 'who is', 'introduce', 'introduction', 'summary', 'bio', 'background', 'profile', 'kaun'],
      answer: `<p><strong>Sidra</strong> is an <strong>AI/ML Engineer &amp; Flutter Developer</strong> based in Lahore, Pakistan.</p>
        <p>She builds end-to-end ML pipelines and RAG/LLM applications — from EDA and model training to FastAPI deployment — and ships cross-platform Flutter apps backed by Firebase, including a published Play Store app with 100+ downloads.</p>
        <p>She holds a BE in Software Engineering from Lahore College for Women University (2026).</p>`,
      chips: ['Skills', 'Experience', 'Projects', 'Research'],
    },
    {
      id: 'skills',
      priority: 1,
      keys: ['skill', 'stack', 'tech', 'technolog', 'tools', 'expertise', 'languages', 'python', 'know', 'proficien'],
      answer: `<p>Here's Sidra's toolkit:</p>${list([
        '<strong>AI/ML:</strong> Python, Pandas, NumPy, Scikit-learn, Logistic Regression, KNN, feature engineering, EDA, cross-validation, hyperparameter tuning',
        '<strong>GenAI &amp; LLMs:</strong> RAG, LangChain, ChromaDB, Ollama, Llama 3, vector embeddings, Streamlit',
        '<strong>Mobile:</strong> Flutter, Dart, Firebase, Firestore, Firebase Auth, Crashlytics, Google Play Store',
        '<strong>Backend &amp; tools:</strong> FastAPI, RESTful APIs, model deployment, Git, GitHub, Agile/Scrum',
      ])}${go('#skills', 'See the skills section →')}`,
      chips: ['Projects', 'Mobile apps', 'GenAI & LLMs', 'Certificates'],
    },
    {
      id: 'projects',
      priority: 1,
      keys: ['project', 'portfolio', 'built', 'build', 'work samples', 'apps you', 'what has she made'],
      answer: `<p>Sidra's featured projects:</p>${list([
        '<strong>Wikipedia RAG Chatbot</strong> — fully local RAG with LangChain, ChromaDB &amp; Llama 3',
        '<strong>SheCan AI</strong> — Flutter + ML gig-matching platform for women in Pakistan',
        '<strong>End-to-End ML Pipeline</strong> — classifiers tuned to 80%+ accuracy, served with FastAPI',
        '<strong>TruckMe</strong> — full-stack freight loadboard (Flutter, FastAPI, Next.js)',
        '<strong>Rozana Budget</strong> — local-first budgeting app with a Gemini meal planner',
      ])}${go('#projects', 'See all projects →')}`,
      chips: ['SheCan AI', 'RAG Chatbot', 'TruckMe', 'Rozana Budget', 'ML Pipeline'],
    },
    {
      id: 'shecan',
      priority: 2,
      keys: ['shecan', 'she can', ['gig', 1], ['women', 1], ['freelance', 1]],
      answer: `<p><strong>SheCan AI</strong> is an AI-powered gig recommendation platform that matches women in Pakistan to freelance and gig work based on their skills, interests and availability.</p>
        <p>It's built with <strong>Flutter &amp; Dart</strong>, a Python ML backend with real-time <strong>Firebase</strong> sync, and an in-app AI assistant.</p>
        <p>${ext('https://shecan-ai.vercel.app/', 'Live demo')} · ${act('gallery:shecan', 'View 8 screenshots')}</p>`,
      chips: ['TruckMe', 'Mobile apps', 'Projects'],
    },
    {
      id: 'rag',
      priority: 2,
      keys: ['rag', 'wikipedia', 'retrieval', 'langchain', 'chromadb', 'ollama', 'llama'],
      answer: `<p><strong>Wikipedia RAG Chatbot</strong> answers questions from Wikipedia articles — fully locally.</p>
        ${list([
          'Articles embedded with Ollama (nomic-embed-text) and stored in ChromaDB',
          'Semantic search retrieves the right context',
          'Llama 3 generates answers locally — no external APIs, full data privacy',
          'Streamlit chat interface for real-time questions',
        ])}<p>${ext('https://github.com/sidra3921/ollama_rag_project', 'Source code')}</p>`,
      chips: ['GenAI & LLMs', 'Research', 'Projects'],
    },
    {
      id: 'pipeline',
      priority: 2,
      keys: ['pipeline', 'fastapi', 'model serving', 'deployment', 'deploy', 'classifier'],
      answer: `<p><strong>End-to-End ML Pipeline with FastAPI Model Serving</strong>:</p>${list([
        'Preprocessing, EDA and feature engineering on 1,000+ record datasets',
        'Logistic Regression and KNN classifiers tuned to <strong>80%+ accuracy</strong>',
        'Final model served as a live FastAPI REST endpoint for real-time inference',
      ])}`,
      chips: ['Experience', 'Skills', 'Projects'],
    },
    {
      id: 'truckme',
      priority: 2,
      keys: ['truckme', 'truck', 'freight', 'loadboard', 'logistics', 'shipper', 'driver'],
      answer: `<p><strong>TruckMe</strong> is a freight &amp; transport platform connecting shippers, fleet owners and drivers — load posting and offers, live trip tracking, payments and accounting, with cross-border rules between the UAE and Saudi Arabia.</p>
        ${list([
          'One Flutter app with role-based UI for every user type',
          'FastAPI backend with PostgreSQL/PostGIS, Celery and Redis, all in Docker',
          'Next.js admin panel for KYC, dispatch, finance and theming',
          'Google Maps &amp; Navigation SDK, and 5 languages including Urdu and Arabic (RTL)',
        ])}<p>${act('gallery:truckme', 'View 8 screenshots')}</p>`,
      chips: ['SheCan AI', 'Mobile apps', 'Projects'],
    },
    {
      id: 'rozana',
      priority: 2,
      keys: ['rozana', 'budget', 'grocery', 'pantry', 'meal', 'gemini'],
      answer: `<p><strong>Rozana Budget</strong> is a local-first household budgeting app for Pakistani families: expense, pantry and grocery trackers saved in the browser, plus a <strong>Gemini</strong>-powered weekly meal planner.</p>
        <p>Built with Next.js, React, TypeScript and Tailwind CSS.</p>
        <p>${ext('https://act-ai-xhsm.vercel.app/', 'Live demo')} · ${ext('https://github.com/sidra3921/act_ai', 'Source code')} · ${act('gallery:rozana', 'Screenshots')}</p>`,
      chips: ['GenAI & LLMs', 'Projects', 'Certificates'],
    },
    {
      id: 'experience',
      priority: 1,
      keys: ['experien', 'work', 'job', 'intern', 'career', 'employ', 'company', 'tajurba', 'kaam'],
      answer: `<p>Sidra's experience:</p>${list([
        '<strong>AI/ML Engineer Trainee — NETSOL Technologies</strong> (Feb–Jun 2026, Lahore): 3+ production-ready ML pipelines, classifiers at 80%+ accuracy, FastAPI deployment',
        '<strong>AI/ML Intern — Headstarter AI</strong> (Jul 2024–Nov 2025, New York): data processing and feature engineering on 1,000+ record datasets in a 4-member agile team',
        '<strong>Technical Intern — ACM UET Lahore</strong> (Jun 2024–Jun 2025): organized AI/ML and software engineering workshops',
      ])}${go('#experience', 'See the timeline →')}`,
      chips: ['NETSOL', 'Headstarter', 'Education', 'Projects'],
    },
    {
      id: 'netsol',
      priority: 2,
      keys: ['netsol', 'trainee'],
      answer: `<p><strong>AI/ML Engineer Trainee at NETSOL Technologies Pakistan</strong> (Feb–Jun 2026, Lahore):</p>${list([
        'Engineered 3+ production-ready ML pipelines — ingestion, EDA, feature engineering, training, evaluation and REST API deployment',
        'Trained and optimized Logistic Regression and KNN classifiers on 1,000+ record datasets to 80%+ accuracy',
        'Deployed models as scalable FastAPI REST APIs for real-time inference',
        'Ran structured EDA and data-quality checks to improve pipeline reliability',
      ])}`,
      chips: ['Headstarter', 'ML Pipeline', 'Skills'],
    },
    {
      id: 'headstarter',
      priority: 2,
      keys: ['headstarter'],
      answer: `<p><strong>AI/ML Intern at Headstarter AI</strong> (Jul 2024–Nov 2025, New York):</p>${list([
        'Processed and analyzed 1,000+ record datasets with Pandas and NumPy, with feature engineering that improved model accuracy',
        'Worked in a 4-member agile team with 10+ commits and structured peer code reviews on GitHub',
        'Delivered milestones across 5+ weekly sprints, on schedule',
      ])}`,
      chips: ['NETSOL', 'Experience', 'Skills'],
    },
    {
      id: 'education',
      priority: 1,
      keys: ['educat', 'degree', 'university', 'college', 'lcwu', 'study', 'studied', 'graduat', 'fsc', 'taleem', 'qualification'],
      answer: list([
        '<strong>Bachelor of Engineering in Software Engineering</strong> — Lahore College for Women University (Jun 2026)',
        '<strong>FSc Pre-Engineering</strong> — Punjab College, Lahore (Jan 2022)',
      ]),
      chips: ['Certificates', 'Experience', 'Research'],
    },
    {
      id: 'research',
      priority: 1.5,
      keys: ['research', 'paper', 'urdu', 'rtl', 'right to left', 'accessib', 'wcag', 'se4all', 'icse', 'publication'],
      answer: `<p>Sidra's current research — <strong>“Do LLMs Generate Accessible Urdu Interfaces?”</strong> — measures how AI-generated UIs fail Urdu (right-to-left) users.</p>
        ${list([
          '40 UI tasks prompted in both Urdu and English',
          'Every generated page audited with axe-core plus six custom RTL checks mapped to WCAG',
          'Tests whether a one-sentence RTL instruction fixes the failures',
        ])}<p>Status: in progress, targeting SE4All 2027 (ICSE 2027). ${go('#research', 'Read more →')}</p>`,
      chips: ['RAG Chatbot', 'Skills', 'Contact'],
    },
    {
      id: 'certificates',
      priority: 1,
      keys: ['certif', 'course', 'credential', 'navttc', 'coursera', 'kaggle', 'google', 'badge', 'training'],
      answer: `<p>Sidra's certifications:</p>${list([
        'Artificial Intelligence (ML, DL, Communication) — NAVTTC &amp; NETSOL, <strong>Grade A+</strong> (Sep 2026)',
        `ACT AI — AI SkillBridge (Jul 2026) · ${ext('https://actai.aiskillbridge.pk/v/ZTVNACS8QLBUYVNX', 'verify')}`,
        `Introduction to AI — Google · Coursera (Jun 2026) · ${ext('https://www.coursera.org/account/accomplishments/verify/LUTZXG2OBCAU', 'verify')}`,
        `Google AI Fundamentals — Google · Coursera (Jun 2026) · ${ext('https://www.coursera.org/account/accomplishments/verify/HF4ND7JXQNDB', 'verify')}`,
        `5-Day AI Agents Intensive — Kaggle &amp; Google (Dec 2025) · ${ext('https://www.kaggle.com/certification/badges/sidra3921/105', 'verify')}`,
        `Generative AI Application Developer — ULEF USA, <strong>Top Performer</strong> (Dec 2025) · ${ext('https://quiz.ideagist.com/ideagist-certificate/?cert_hash=4b82a6a73ae21452', 'verify')}`,
        'Introduction to Large Language Models — Google (2026)',
      ])}<p>${act('certificates', 'View certificate images')}</p>`,
      chips: ['Education', 'Skills', 'Resume'],
    },
    {
      id: 'mobile',
      priority: 1.5,
      keys: ['flutter', 'dart', 'mobile', 'android', 'ios', 'play store', 'playstore', 'cross platform', 'firebase'],
      answer: `<p>On the mobile side, Sidra builds cross-platform apps with <strong>Flutter &amp; Dart</strong>, backed by Firebase (Auth, Firestore, Crashlytics).</p>
        <p>She has a published Play Store app with <strong>100+ downloads</strong>, and her Flutter projects include <strong>SheCan AI</strong> and <strong>TruckMe</strong>.</p>`,
      chips: ['SheCan AI', 'TruckMe', 'Skills'],
    },
    {
      id: 'ml',
      priority: 1,
      keys: ['machine learning', 'ml', 'model', 'accuracy', 'data science', 'scikit', 'mlops'],
      answer: `<p>Sidra builds end-to-end ML pipelines — data ingestion, EDA, feature engineering, training, evaluation and FastAPI deployment.</p>
        <p>At NETSOL she delivered 3+ production-ready pipelines and tuned Logistic Regression and KNN classifiers to <strong>80%+ accuracy</strong> on 1,000+ record datasets.</p>`,
      chips: ['ML Pipeline', 'NETSOL', 'Skills'],
    },
    {
      id: 'genai',
      priority: 1.5,
      keys: ['genai', 'generative', 'llm', 'large language', 'agents', 'chatgpt', 'gpt'],
      answer: `<p>For GenAI, Sidra builds RAG and LLM apps with LangChain, ChromaDB, Ollama and Llama 3 — like her fully local <strong>Wikipedia RAG Chatbot</strong>.</p>
        <p>She used Gemini in <strong>Rozana Budget</strong>, researches the accessibility of LLM-generated UIs, and holds Google and Kaggle certificates in AI agents and LLMs.</p>`,
      chips: ['RAG Chatbot', 'Research', 'Certificates'],
    },
    {
      id: 'contact',
      priority: 1,
      keys: ['contact', 'email', 'mail', 'phone', 'number', 'call', 'reach', 'linkedin', 'github', 'whatsapp', 'connect', 'rabta'],
      answer: `<p>You can reach Sidra here:</p>${list([
        `Email: ${EMAIL}`,
        'Phone: <a href="tel:+923098699567">+92 309 8699567</a>',
        `LinkedIn: ${ext('https://www.linkedin.com/in/sidra3921', 'linkedin.com/in/sidra3921')}`,
        `GitHub: ${ext('https://github.com/sidra3921', 'github.com/sidra3921')}`,
      ])}<p>Or send a message through the ${go('#contact', 'contact form')}.</p>`,
      chips: ['Resume', 'Hire Sidra', 'Projects'],
    },
    {
      id: 'resume',
      priority: 1.5,
      keys: ['resume', 'cv', 'download'],
      answer: '<p>Here\'s Sidra\'s resume: <a href="assets/Sidra-Resume.pdf" download="Sidra-Resume.pdf">Download resume (PDF)</a></p>',
      chips: ['Contact', 'Experience', 'Skills'],
    },
    {
      id: 'hire',
      priority: 1.5,
      keys: ['hire', 'hiring', 'available', 'availability', 'open to', 'opportunit', 'vacancy', 'recruit', 'freelance work', 'collaborat'],
      answer: `<p>Sidra is open to <strong>AI/ML and Flutter opportunities</strong> and is based in Lahore, Pakistan.</p>
        <p>The quickest way to reach her is ${EMAIL} or the ${go('#contact', 'contact form')}.</p>`,
      chips: ['Resume', 'Skills', 'Projects'],
    },
    {
      id: 'location',
      priority: 1,
      keys: ['where', 'location', 'located', 'based', 'city', 'country', 'lahore', 'pakistan'],
      answer: '<p>Sidra is based in <strong>Lahore, Pakistan</strong>.</p>',
      chips: ['Contact', 'Hire Sidra'],
    },
    {
      id: 'bot',
      priority: 1,
      keys: ['who are you', 'what are you', 'are you a bot', 'are you ai', 'are you real', 'your name', 'how do you work'],
      answer: "<p>I'm a lightweight assistant built into Sidra's portfolio. I answer from the information on this site, right in your browser — nothing you type is sent anywhere.</p>",
      chips: ['About Sidra', 'Projects', 'Contact'],
    },
    {
      id: 'thanks',
      priority: 0.5,
      keys: ['thanks', 'thank you', 'thank', 'thx', 'shukriya', 'jazakallah', 'great', 'awesome', 'nice', 'cool'],
      answer: "<p>You're welcome! Anything else you'd like to know about Sidra?</p>",
      chips: ['Projects', 'Research', 'Contact'],
    },
    {
      id: 'bye',
      priority: 0.5,
      keys: ['bye', 'goodbye', 'see you', 'allah hafiz', 'khuda hafiz'],
      answer: `<p>Thanks for visiting! 👋 You can always reach Sidra at ${EMAIL}.</p>`,
      chips: [],
    },
  ];

  const WELCOME = {
    answer: "Hi! 👋 I'm Sidra's portfolio assistant. Ask me anything about her skills, projects, experience, research or certificates.",
    chips: ['About Sidra', 'Projects', 'Skills', 'Research', 'Certificates', 'Contact'],
  };

  const FALLBACK = {
    answer: `<p>I'm not sure about that one — I can answer questions about Sidra's <em>skills</em>, <em>projects</em>, <em>experience</em>, <em>research</em> and <em>certificates</em>.</p>
      <p>For anything else, ${go('#contact', 'contact her directly')}.</p>`,
    chips: ['About Sidra', 'Projects', 'Skills', 'Contact'],
  };

  /* ------------------------------------------------------------
   * Matching
   * ---------------------------------------------------------- */
  const normalize = (s) => s.toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9+#\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  function keyScore(text, tokens, key) {
    const [word, weight] = Array.isArray(key) ? key : [key, 2];
    if (word.includes(' ')) return ` ${text} `.includes(` ${word} `) ? weight + 1 : 0;   // phrase
    if (tokens.includes(word)) return weight;                                          // exact word
    if (word.length >= 4 && tokens.some((t) => t.startsWith(word))) return weight;     // stem: "project" → "projects"
    return 0;
  }

  function findAnswer(input) {
    const text = normalize(input);
    if (!text) return null;
    const tokens = text.split(' ');
    let best = null;
    INTENTS.forEach((intent, order) => {
      const score = intent.keys.reduce((sum, key) => sum + keyScore(text, tokens, key), 0);
      if (score < 2) return;
      const rank = score + intent.priority;
      if (!best || rank > best.rank || (rank === best.rank && order < best.order)) best = { intent, rank, order };
    });
    return best ? best.intent : FALLBACK;
  }

  /* ------------------------------------------------------------
   * UI
   * ---------------------------------------------------------- */
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const storage = {
    get(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };

  const root = document.createElement('div');
  root.className = 'chatbot';
  root.innerHTML = `
    <div class="chatbot-nudge" id="chatbot-nudge" hidden>
      <span>Hi! 👋 Ask me anything about Sidra.</span>
      <button type="button" class="chatbot-nudge-close" aria-label="Dismiss">×</button>
    </div>
    <section class="chatbot-panel" id="chatbot-panel" role="dialog" aria-modal="false" aria-labelledby="chatbot-title">
      <header class="chatbot-head">
        <img class="chatbot-avatar" src="assets/images/sidra-profile.jpg" alt="" width="40" height="40" />
        <div class="chatbot-head-text">
          <p class="chatbot-title" id="chatbot-title">Sidra's Assistant</p>
          <p class="chatbot-status">Online · instant answers</p>
        </div>
        <button type="button" class="icon-btn chatbot-close" aria-label="Close chat">
          <svg class="icon" aria-hidden="true"><use href="#i-x" /></svg>
        </button>
      </header>
      <div class="chatbot-messages" role="log" aria-live="polite" aria-label="Conversation"></div>
      <div class="chatbot-chips" aria-label="Suggested questions"></div>
      <form class="chatbot-form" autocomplete="off">
        <label class="visually-hidden" for="chatbot-input">Ask a question about Sidra</label>
        <input id="chatbot-input" type="text" maxlength="200" placeholder="Ask about skills, projects…" />
        <button type="submit" class="chatbot-send" aria-label="Send">
          <svg class="icon" aria-hidden="true"><use href="#i-send" /></svg>
        </button>
      </form>
    </section>
    <button type="button" class="chatbot-launcher" aria-expanded="false" aria-controls="chatbot-panel" aria-label="Open chat with Sidra's assistant">
      <svg class="icon icon-open" aria-hidden="true"><use href="#i-chat" /></svg>
      <svg class="icon icon-close" aria-hidden="true"><use href="#i-x" /></svg>
    </button>`;
  document.body.append(root);

  const panel = root.querySelector('.chatbot-panel');
  const launcher = root.querySelector('.chatbot-launcher');
  const messages = root.querySelector('.chatbot-messages');
  const chipsEl = root.querySelector('.chatbot-chips');
  const form = root.querySelector('.chatbot-form');
  const input = root.querySelector('#chatbot-input');
  const nudge = root.querySelector('#chatbot-nudge');
  let started = false;
  let busy = false;

  const scrollToEnd = () => { messages.scrollTop = messages.scrollHeight; };

  function addMessage(html, who) {
    const bubble = document.createElement('div');
    bubble.className = `chat-msg chat-msg--${who}`;
    if (who === 'user') bubble.textContent = html;   // visitor text is never parsed as HTML
    else bubble.innerHTML = html;
    messages.append(bubble);
    scrollToEnd();
    return bubble;
  }

  function setChips(chips) {
    chipsEl.textContent = '';
    chips.forEach((label) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chatbot-chip';
      chip.textContent = label;
      chip.addEventListener('click', () => ask(label));
      chipsEl.append(chip);
    });
    chipsEl.hidden = !chips.length;
  }

  function botReply(entry) {
    busy = true;
    setChips([]);
    const typing = addMessage('<span class="chat-typing" aria-label="Typing"><span></span><span></span><span></span></span>', 'bot');
    const delay = prefersReducedMotion() ? 120 : Math.min(450 + entry.answer.length * 0.6, 1100);
    setTimeout(() => {
      typing.remove();
      addMessage(entry.answer, 'bot');
      setChips(entry.chips || []);
      busy = false;
    }, delay);
  }

  function ask(text) {
    const question = text.trim();
    if (!question || busy) return;
    addMessage(question, 'user');
    botReply(findAnswer(question));
  }

  function openChat() {
    root.classList.add('is-open', 'has-opened');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Close chat');
    hideNudge(true);
    if (!started) {
      started = true;
      botReply(WELCOME);
    }
    setTimeout(() => input.focus({ preventScroll: true }), 80);
  }

  function closeChat(returnFocus = true) {
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', "Open chat with Sidra's assistant");
    if (returnFocus) launcher.focus({ preventScroll: true });
  }

  const isOpen = () => root.classList.contains('is-open');
  launcher.addEventListener('click', () => (isOpen() ? closeChat() : openChat()));
  root.querySelector('.chatbot-close').addEventListener('click', () => closeChat());
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) closeChat();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
    input.value = '';
  });

  // Links and actions inside answers.
  messages.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-chat-action]');
    if (actionEl) {
      const [type, name] = actionEl.dataset.chatAction.split(':');
      if (type === 'gallery') {
        const trigger = document.querySelector(`[data-gallery-open="${name}"]`);
        if (trigger) trigger.click();
      } else if (type === 'certificates') {
        const viewAll = document.getElementById('cert-view-all');
        if (viewAll && !viewAll.hidden) viewAll.click();
        else document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const link = event.target.closest('a[href^="#"]');
    if (link) {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      if (window.matchMedia('(max-width: 640px)').matches) closeChat(false);   // panel covers the page on phones
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  });

  /* A friendly one-time nudge so visitors notice the assistant. */
  const NUDGE_KEY = 'sidra-chat-nudge';
  let nudgeTimer;
  function hideNudge(remember) {
    nudge.hidden = true;
    clearTimeout(nudgeTimer);
    if (remember) storage.set(NUDGE_KEY, '1');
  }
  nudge.querySelector('.chatbot-nudge-close').addEventListener('click', () => hideNudge(true));
  nudge.querySelector('span').addEventListener('click', () => openChat());
  if (!storage.get(NUDGE_KEY)) {
    setTimeout(() => {
      if (isOpen()) return;
      nudge.hidden = false;
      nudgeTimer = setTimeout(() => hideNudge(true), 9000);
    }, 5000);
  }
})();
