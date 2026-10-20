/**
 * ESAA Enterprise AI Platform — Production Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. TOAST SYSTEM
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'info', duration = 3500) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : ''}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }

  /* ==========================================================================
     2. ANNOUNCEMENT BAR
     ========================================================================== */
  const announcementBar = document.getElementById('announcement-bar');
  const announcementClose = document.getElementById('announcement-close');

  if (announcementClose && announcementBar) {
    announcementClose.addEventListener('click', () => {
      announcementBar.classList.add('is-hidden');
      setTimeout(() => {
        announcementBar.style.display = 'none';
      }, 300);
    });
  }

  /* ==========================================================================
     3. STICKY HEADER & SCROLL BEHAVIOR
     ========================================================================== */
  const stickyHeader = document.getElementById('sticky-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      stickyHeader?.classList.add('scrolled');
    } else {
      stickyHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     4. MEGA MENU DATA & LOGIC
     ========================================================================== */
  const megaMenuData = {
    product: {
      col1: {
        title: "Platform Capabilities",
        links: [
          { text: "Hybrid Vector + BM25 RAG", desc: "Enterprise semantic and exact keyword search", target: "#statement" },
          { text: "Autonomous Deep Research", desc: "Multi-step iterative inquiry & web synthesis", target: "#dark-section" },
          { text: "Craft Sandbox & Build Mode", desc: "Containerized app generation with live preview", target: "#dark-section" }
        ]
      },
      col2: {
        title: "Integrations & Tools",
        links: [
          { text: "50+ Enterprise Connectors", desc: "Continuous sync with SAP, Drive, and Jira", target: "#stats" },
          { text: "ServiceNow & SAP Actions", desc: "Live record updates, tickets, and sales orders", target: "#accordion" },
          { text: "Model Context Protocol (MCP)", desc: "Open standard tool connections & agents", target: "#accordion" }
        ]
      },
      col3: {
        title: "Security & Governance",
        links: [
          { text: "Zero-Trust Document ACLs", desc: "Inherit permissions straight from source", target: "#accordion" },
          { text: "SAML 2.0 & SCIM Sync", desc: "Automated provisioning with Okta & Entra ID", target: "#stats" },
          { text: "Evals Benchmark Harness", desc: "Measure latency, accuracy, and recall", target: "#dark-section" }
        ]
      },
      promo: {
        title: "ESAA v2.4 Architecture",
        desc: "Unified AI orchestration designed specifically for regulated enterprise workloads.",
        btn: "Schedule Demo",
        action: "demo"
      }
    },
    customers: {
      col1: {
        title: "Industry Solutions",
        links: [
          { text: "Global Financial Services", desc: "Private on-premise RAG with strict auditing", target: "#stats" },
          { text: "Life Sciences & Pharma", desc: "Literature synthesis & patent document search", target: "#tabs" },
          { text: "High-Tech Manufacturing", desc: "SAP S/4HANA supply chain orchestration", target: "#accordion" }
        ]
      },
      col2: {
        title: "Customer Impact",
        links: [
          { text: "85% Reduction in Search Latency", desc: "Single query across 20+ enterprise wikis", target: "#statement" },
          { text: "Zero Hallucination Tolerance", desc: "Verified inline citations on every answer", target: "#carousel" },
          { text: "Fast Air-Gapped Deployment", desc: "<1GB RAM containerized Lite mode", target: "#stats" }
        ]
      },
      col3: {
        title: "Security Certifications",
        links: [
          { text: "SOC2 Type II Report", desc: "Independently audited governance controls", target: "#resources" },
          { text: "ISO 27001 Certified", desc: "Stringent information security management", target: "#resources" },
          { text: "GDPR Article 17 Compliant", desc: "Strict deletion and redaction pipelines", target: "#tabs" }
        ]
      },
      promo: {
        title: "Global 2000 Case Studies",
        desc: "Read how Fortune 100 teams deploy digital coworkers with full document-level ACLs.",
        btn: "Read Studies",
        action: "demo"
      }
    },
    solutions: {
      col1: {
        title: "By Department",
        links: [
          { text: "IT & Helpdesk Automation", desc: "Auto-resolve ServiceNow tickets via Slack", target: "#accordion" },
          { text: "Enterprise Legal & Compliance", desc: "Contract analysis with exact paragraph links", target: "#statement" },
          { text: "Engineering & Dev Productivity", desc: "GitHub, Linear, and Jira cross-reference", target: "#tabs" }
        ]
      },
      col2: {
        title: "By Architecture",
        links: [
          { text: "Sovereign Private Cloud", desc: "Deploy within AWS, Azure, GCP, or bare metal", target: "#accordion" },
          { text: "Air-Gapped Kubernetes", desc: "Helm charts with zero external model calls", target: "#stats" },
          { text: "Multi-Model Gateway", desc: "Route between OpenAI, Bedrock, and Ollama", target: "#carousel" }
        ]
      },
      col3: {
        title: "Workflows",
        links: [
          { text: "From Knowledge to Action", desc: "Formulate remediation steps and execute", target: "#action-plan" },
          { text: "Automated Ticket Triage", desc: "Extract error stacks and notify Slack", target: "#action-plan" },
          { text: "Executive Briefings", desc: "Scheduled deep research digest generation", target: "#tabs" }
        ]
      },
      promo: {
        title: "Custom Workflows",
        desc: "Equip your custom AI agents with scoped API tools and verified document sets.",
        btn: "Request Architecture",
        action: "demo"
      }
    },
    resources: {
      col1: {
        title: "Documentation & Guides",
        links: [
          { text: "Hybrid RAG Architecture Paper", desc: "Deep vector embeddings + BM25 keyword", target: "#resources" },
          { text: "Connector Reference Matrix", desc: "API limits and indexing speeds for 50+ tools", target: "#stats" },
          { text: "Security Whitepaper", desc: "Document ACL inheritance in detail", target: "#resources" }
        ]
      },
      col2: {
        title: "Developer Tools",
        links: [
          { text: "Model Evaluations CLI", desc: "Run benchmark test suites against RAG recall", target: "#dark-section" },
          { text: "OpenAPI Tool Importer", desc: "Convert existing REST endpoints to LLM tools", target: "#accordion" },
          { text: "OpenTelemetry & Langfuse", desc: "Trace latency and token cost per agent", target: "#accordion" }
        ]
      },
      col3: {
        title: "Community & Events",
        links: [
          { text: "Enterprise AI Summit 2026", desc: "Keynotes on sovereign LLMs and RAG", target: "#resources" },
          { text: "Release Notes v2.4", desc: "SAP S/4HANA OData and SCIM 2.0 updates", target: "#statement" },
          { text: "Webinar: Zero-Trust AI", desc: "Implementing document permissions at scale", target: "#resources" }
        ]
      },
      promo: {
        title: "Technical Benchmark",
        desc: "Discover how ESAA achieves 98.4% retrieval recall on enterprise knowledge benchmarks.",
        btn: "Get Benchmark",
        action: "demo"
      }
    },
    company: {
      col1: {
        title: "About ESAA",
        links: [
          { text: "Our Mission", desc: "Unlocking enterprise intelligence without compromise", target: "#hero" },
          { text: "Leadership & Team", desc: "Pioneers in distributed systems and NLP", target: "#statement" },
          { text: "Careers at ESAA", desc: "Join our engineering and research teams", target: "#resources" }
        ]
      },
      col2: {
        title: "Governance",
        links: [
          { text: "Trust & Safety Center", desc: "PII masking and toxic input guardrails", target: "#accordion" },
          { text: "Privacy Policy", desc: "Zero training on enterprise client data", target: "#resources" },
          { text: "Security Standards", desc: "End-to-end encryption at rest and in transit", target: "#accordion" }
        ]
      },
      col3: {
        title: "Contact & Partners",
        links: [
          { text: "Global Partner Program", desc: "System integrators and SAP consultants", target: "#stats" },
          { text: "Press & Media Kit", desc: "Brand assets and executive headshots", target: "#resources" },
          { text: "Contact Sales", desc: "Get in touch with an account executive", target: "#hero" }
        ]
      },
      promo: {
        title: "Join the Partner Network",
        desc: "Partner with ESAA to deliver sovereign AI solutions to enterprise clients.",
        btn: "Become a Partner",
        action: "demo"
      }
    }
  };

  const navItems = document.querySelectorAll('#desktop-nav-menu .nav-item');
  const megaMenuPanel = document.getElementById('mega-menu-panel');
  const megaMenuOverlay = document.getElementById('mega-menu-overlay');
  const megaMenuContent = document.getElementById('mega-menu-content');
  let currentActiveMenu = null;
  let megaMenuTimeout = null;

  function renderMegaMenu(key) {
    if (!megaMenuContent) return;

    if (key === 'product') {
      megaMenuContent.innerHTML = `
        <div class="product-mega-layout">
          <!-- Left Column: Platform overview with Luminous Animated Banner -->
          <div class="product-mega-left">
            <a href="#hero" class="product-overview-card mega-link" id="product-overview-card">
              <div class="luminous-banner-wrap">
                <div class="luminous-mesh-wrap">
                  <div class="luminous-blob luminous-blob-1"></div>
                  <div class="luminous-blob luminous-blob-2"></div>
                  <div class="luminous-blob luminous-blob-3"></div>
                  <div class="luminous-blob luminous-blob-4"></div>
                  <div class="luminous-blob luminous-blob-5"></div>
                </div>
                <div class="luminous-overlay-glass"></div>
                <div class="luminous-banner-title" id="product-luminous-title">AI for Enterprise</div>
              </div>
              <div class="product-overview-info">
                <div class="product-overview-title">Platform overview</div>
                <div class="product-overview-sub">See how ESAA works across your enterprise &rarr;</div>
              </div>
            </a>

            <div class="product-built-label">Built for enterprise AI.</div>

            <div class="product-tree-grid">
              <div class="tree-group">
                <div class="tree-root-item">
                  <a href="#statement" class="tree-parent-link mega-link" data-luminous="Enterprise Context">
                    <span class="tree-parent-icon">✻</span>
                    <span>ESAA Enterprise Context</span>
                  </a>
                  <a href="#stats" class="tree-child-link mega-link" data-luminous="50+ Connectors">Connectors &amp; actions</a>
                </div>

                <div class="tree-root-item">
                  <a href="#accordion" class="tree-parent-link mega-link" data-luminous="Enterprise APIs">
                    <span class="tree-parent-icon">⚙</span>
                    <span>APIs</span>
                  </a>
                  <a href="#accordion" class="tree-child-link mega-link" data-luminous="API Lookbook">API lookbook</a>
                </div>

                <div class="tree-root-item">
                  <a href="#dark-section" class="tree-parent-link mega-link" data-luminous="ESAA Protect">
                    <span class="tree-parent-icon">🛡</span>
                    <span>ESAA Protect</span>
                  </a>
                </div>
              </div>

              <div class="tree-group">
                <div class="tree-root-item">
                  <a href="#statement" class="tree-parent-link mega-link" data-luminous="ESAA Intelligence">
                    <span class="tree-parent-icon">🌐</span>
                    <span>ESAA Intelligence</span>
                  </a>
                  <a href="#statement" class="tree-child-link mega-link" data-luminous="Auto Routing">Auto routing</a>
                  <a href="#carousel" class="tree-child-link mega-link" data-luminous="Model Hub">Model hub</a>
                  <a href="#accordion" class="tree-child-link mega-link" data-luminous="Usage Controls">Usage controls</a>
                  <a href="#dark-section" class="tree-child-link mega-link" data-luminous="AI Gateway">AI gateway</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle & Right Columns + Bottom Banner -->
          <div class="product-mega-main-area">
            <div class="product-mega-columns-row">
              <!-- Middle Column: ESAA Assistant -->
              <div>
                <div class="product-col-header">
                  <div class="product-col-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="4"></rect>
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 7v1"></path><path d="M12 16v1"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="product-col-title">ESAA Assistant</div>
                    <div class="product-col-sub">Your enterprise AI coworker</div>
                  </div>
                </div>

                <ul class="product-feature-list">
                  <li class="product-feature-item">
                    <a href="#statement" class="mega-link" data-luminous="Proactive AI">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
                      </svg>
                      <span>Proactive AI</span>
                    </a>
                  </li>
                  <li class="product-feature-item">
                    <a href="#tabs" class="mega-link" data-luminous="Content Creation">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line>
                      </svg>
                      <span>Content creation</span>
                    </a>
                  </li>
                  <li class="product-feature-item">
                    <a href="#tabs" class="mega-link" data-luminous="Multiplayer AI">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span>Multiplayer</span>
                    </a>
                  </li>
                  <li class="product-feature-item">
                    <a href="#action-plan" class="mega-link" data-luminous="Work Execution">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                      <span>Work execution</span>
                    </a>
                  </li>
                  <li class="product-feature-item">
                    <a href="#dark-section" class="mega-link" data-luminous="Deep Research">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                      <span>Data analysis and research</span>
                    </a>
                  </li>
                  <li class="product-feature-item">
                    <a href="#statement" class="mega-link" data-luminous="Enterprise Search">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <span>Enterprise search</span>
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Right Column: ESAA Agents -->
              <div>
                <div class="product-col-header">
                  <div class="product-col-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div class="product-col-title">ESAA Agents</div>
                    <div class="product-col-sub">Build and manage agents</div>
                  </div>
                </div>

                <ul class="product-feature-list">
                  <li class="product-feature-item">
                    <a href="#accordion" class="mega-link" data-luminous="Agent Builder">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      <span>Agent builder</span>
                    </a>
                  </li>
                  <li class="product-feature-item">
                    <a href="#tabs" class="mega-link" data-luminous="Agent Orchestration">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <circle cx="12" cy="12" r="3"></circle><circle cx="6" cy="6" r="2"></circle><circle cx="18" cy="6" r="2"></circle><circle cx="6" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle>
                      </svg>
                      <span>Agent orchestration</span>
                    </a>
                  </li>
                  <li class="product-feature-item">
                    <a href="#accordion" class="mega-link" data-luminous="Agent Governance">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <span>Agent governance</span>
                    </a>
                  </li>
                  <li class="product-feature-item">
                    <a href="#stats" class="mega-link" data-luminous="Agent Library">
                      <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                      <span>Agent library</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Bottom Banner -->
            <a href="#dark-section" class="product-bottom-banner mega-link">
              <span class="coming-soon-pill">Coming soon</span>
              <span class="bottom-banner-title">ESAA Transform</span>
              <span class="bottom-banner-sub">See where AI can make the biggest impact &rarr;</span>
            </a>
          </div>
        </div>
      `;

      // Interactive hover for product banner
      const luminousTitle = document.getElementById('product-luminous-title');
      const defaultTitle = "AI for Enterprise";
      megaMenuContent.querySelectorAll('[data-luminous]').forEach(item => {
        item.addEventListener('mouseenter', () => {
          if (luminousTitle) {
            luminousTitle.textContent = item.getAttribute('data-luminous');
          }
        });
        item.addEventListener('mouseleave', () => {
          if (luminousTitle) {
            luminousTitle.textContent = defaultTitle;
          }
        });
      });

    } else if (key === 'solutions') {
      // Solutions Mega Menu: EXACT Glean layout matching user screenshot 2 (Compact 2-col subgrids)
      megaMenuContent.innerHTML = `
        <div class="solutions-mega-layout">
          <!-- Column 1: DEPARTMENTS (Split into 2 Columns like Pic 2) -->
          <div class="solutions-column">
            <div class="solutions-column-header">Departments</div>
            <div class="solutions-two-col-grid">
              <!-- Sub-col 1 -->
              <ul class="solutions-nav-list">
                <li>
                  <a href="#hero" class="solutions-item-link mega-link" data-card="all">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </span>
                    <span>All Teams</span>
                  </a>
                </li>
                <li>
                  <a href="#statement" class="solutions-item-link mega-link is-active" data-card="engineering">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    </span>
                    <span>Engineering</span>
                  </a>
                </li>
                <li>
                  <a href="#accordion" class="solutions-item-link mega-link" data-card="customer-service">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                    </span>
                    <span>Customer Service</span>
                  </a>
                </li>
                <li>
                  <a href="#stats" class="solutions-item-link mega-link" data-card="sales">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </span>
                    <span>Sales</span>
                  </a>
                </li>
                <li>
                  <a href="#action-plan" class="solutions-item-link mega-link" data-card="it">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </span>
                    <span>IT</span>
                  </a>
                </li>
              </ul>

              <!-- Sub-col 2 -->
              <ul class="solutions-nav-list">
                <li class="solutions-tree-group">
                  <a href="#resources" class="solutions-item-link mega-link" data-card="marketing">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
                    </span>
                    <span>Marketing</span>
                  </a>
                  <ul class="solutions-tree-children">
                    <li><a href="#resources" class="solutions-sub-link mega-link" data-card="marketing">B2B Marketing</a></li>
                    <li><a href="#resources" class="solutions-sub-link mega-link" data-card="marketing">B2C Marketing</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#company" class="solutions-item-link mega-link" data-card="people">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </span>
                    <span>People</span>
                  </a>
                </li>
                <li>
                  <a href="#stats" class="solutions-item-link mega-link" data-card="finance">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    </span>
                    <span>Finance</span>
                  </a>
                </li>
                <li>
                  <a href="#statement" class="solutions-item-link mega-link" data-card="legal">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h18"></path></svg>
                    </span>
                    <span>Legal</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Column 2: INDUSTRIES (Split into 2 Columns like Pic 2) -->
          <div class="solutions-column">
            <div class="solutions-column-header">Industries</div>
            <div class="solutions-two-col-grid">
              <!-- Sub-col 1 -->
              <ul class="solutions-nav-list">
                <li>
                  <a href="#stats" class="solutions-item-link mega-link" data-card="retail">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </span>
                    <span>Retail</span>
                  </a>
                </li>
                <li>
                  <a href="#tabs" class="solutions-item-link mega-link" data-card="consumer-goods">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    </span>
                    <span>Consumer Goods</span>
                  </a>
                </li>
                <li class="solutions-tree-group">
                  <a href="#accordion" class="solutions-item-link mega-link" data-card="industrials">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2 20h20"></path><path d="M4 20V9l4-3v14"></path><path d="M12 20V4l6 4v12"></path></svg>
                    </span>
                    <span>Industrials</span>
                  </a>
                  <ul class="solutions-tree-children">
                    <li><a href="#accordion" class="solutions-sub-link mega-link" data-card="industrials">Energy &amp; Utilities</a></li>
                    <li><a href="#accordion" class="solutions-sub-link mega-link" data-card="industrials">Manufacturing</a></li>
                    <li><a href="#accordion" class="solutions-sub-link mega-link" data-card="industrials">Supply Chain</a></li>
                  </ul>
                </li>
                <li class="solutions-tree-group">
                  <a href="#carousel" class="solutions-item-link mega-link" data-card="professional-services">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </span>
                    <span>Professional Services</span>
                  </a>
                  <ul class="solutions-tree-children">
                    <li><a href="#carousel" class="solutions-sub-link mega-link" data-card="professional-services">Consulting</a></li>
                    <li><a href="#carousel" class="solutions-sub-link mega-link" data-card="professional-services">Construction</a></li>
                    <li><a href="#carousel" class="solutions-sub-link mega-link" data-card="professional-services">IT Services</a></li>
                  </ul>
                </li>
              </ul>

              <!-- Sub-col 2 -->
              <ul class="solutions-nav-list">
                <li class="solutions-tree-group">
                  <a href="#stats" class="solutions-item-link mega-link" data-card="financial-services">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </span>
                    <span>Financial Services</span>
                  </a>
                  <ul class="solutions-tree-children">
                    <li><a href="#stats" class="solutions-sub-link mega-link" data-card="financial-services">Banking</a></li>
                    <li><a href="#stats" class="solutions-sub-link mega-link" data-card="financial-services">PE/VC</a></li>
                    <li><a href="#stats" class="solutions-sub-link mega-link" data-card="financial-services">Asset management</a></li>
                    <li><a href="#stats" class="solutions-sub-link mega-link" data-card="financial-services">Insurance</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#statement" class="solutions-item-link mega-link" data-card="government">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 21h18"></path><path d="M5 21V10"></path><path d="M9 21V10"></path><path d="M15 21V10"></path><path d="M19 21V10"></path><path d="M2 10h20L12 3 2 10z"></path></svg>
                    </span>
                    <span>Government</span>
                  </a>
                </li>
                <li class="solutions-tree-group">
                  <a href="#tabs" class="solutions-item-link mega-link" data-card="healthcare">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                    </span>
                    <span>Healthcare</span>
                  </a>
                  <ul class="solutions-tree-children">
                    <li><a href="#tabs" class="solutions-sub-link mega-link" data-card="healthcare">Life Sciences</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#resources" class="solutions-item-link mega-link" data-card="education">
                    <span class="solutions-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                    </span>
                    <span>Higher Education</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Column 3: The Featured Animated Luminous Card (Side-by-side Body like Pic 2) -->
          <div class="solutions-featured-card">
            <div class="luminous-banner-wrap">
              <div class="luminous-mesh-wrap">
                <div class="luminous-blob luminous-blob-1"></div>
                <div class="luminous-blob luminous-blob-2"></div>
                <div class="luminous-blob luminous-blob-3"></div>
                <div class="luminous-blob luminous-blob-4"></div>
                <div class="luminous-blob luminous-blob-5"></div>
              </div>
              <div class="luminous-overlay-glass"></div>
              <div class="luminous-banner-title" id="solutions-banner-title">AI for Engineering</div>
            </div>
            <div class="solutions-card-body-two-col">
              <div class="solutions-card-col-left">
                <div class="solutions-card-heading" id="solutions-card-heading">What's the state of your AI stack for software engineering?</div>
                <a href="#stats" class="solutions-card-cta mega-link" id="solutions-card-cta">
                  <span id="solutions-card-btn-text">Take the quiz</span>
                  <span class="cta-arrow">&rarr;</span>
                </a>
              </div>
              <div class="solutions-card-col-right">
                <div class="solutions-card-desc" id="solutions-card-desc">See how your engineering AI stack performs across delivery speed, incident response, and context access. Get your AI Stack Score and next-step recommendations.</div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Interactive content mapper for Solutions
      const solutionsData = {
        'engineering': {
          title: "AI for Engineering",
          heading: "What's the state of your AI stack for software engineering?",
          desc: "See how your engineering AI stack performs across delivery speed, incident response, and context access. Get your AI Stack Score and next-step recommendations.",
          cta: "Take the quiz",
          link: "#stats"
        },
        'customer-service': {
          title: "AI for Customer Service",
          heading: "Accelerate first-contact resolution with verified enterprise RAG",
          desc: "Connect ServiceNow, Zendesk, and internal playbooks to resolve client tickets with zero hallucination and complete source auditability.",
          cta: "Explore customer service",
          link: "#accordion"
        },
        'sales': {
          title: "AI for Enterprise Sales",
          heading: "Real-time CRM context & automated proposal acceleration",
          desc: "Equip account executives with instant cross-repository customer intelligence, RFP answering, and automated Salesforce updates.",
          cta: "Explore sales solutions",
          link: "#stats"
        },
        'it': {
          title: "AI for IT & Helpdesk",
          heading: "Automate tier-1 incident triage & ServiceNow actions",
          desc: "Allow digital coworkers to auto-diagnose infrastructure alerts, query runbooks, and perform authenticated remediations in Slack.",
          cta: "Explore IT workflows",
          link: "#action-plan"
        },
        'marketing': {
          title: "AI for Marketing",
          heading: "Context-grounded campaign generation & brand consistency",
          desc: "Produce high-converting B2B and B2C campaigns backed by organizational knowledge assets, brand guides, and compliance rules.",
          cta: "Explore marketing AI",
          link: "#resources"
        },
        'people': {
          title: "AI for HR & People Teams",
          heading: "Instant onboarding, benefits lookup & policy navigation",
          desc: "Give every employee instant, permission-aware answers to HR, health insurance, and holiday policies with document citations.",
          cta: "Explore HR solutions",
          link: "#company"
        },
        'finance': {
          title: "AI for Finance & Operations",
          heading: "Automated SAP S/4HANA invoice and order reconciliation",
          desc: "Reconcile vendor payments, query general ledger anomalies, and generate financial reports directly from ERP data.",
          cta: "Explore finance AI",
          link: "#stats"
        },
        'legal': {
          title: "AI for Legal & Compliance",
          heading: "Instant clause comparison & strict GDPR/SOC2 compliance",
          desc: "Review MSAs, DPAs, and NDAs against standard terms with exact clause citations while maintaining air-gapped zero-retention data privacy.",
          cta: "Explore legal AI",
          link: "#statement"
        },
        'financial-services': {
          title: "AI for Financial Services",
          heading: "Sovereign on-premise RAG with strict auditing & ACLs",
          desc: "Deploy air-gapped LLMs with document-level permissions and full SOC2/GDPR compliance for banks, PE/VC, and asset managers.",
          cta: "Explore financial solutions",
          link: "#stats"
        },
        'healthcare': {
          title: "AI for Healthcare & Life Sciences",
          heading: "HIPAA-ready clinical synthesis & literature research",
          desc: "Synthesize research papers, clinical trial protocols, and medical records within a zero-data-retention security boundary.",
          cta: "Explore healthcare AI",
          link: "#tabs"
        },
        'retail': {
          title: "AI for Retail & Consumer Goods",
          heading: "Omnichannel inventory intelligence & supply chain tracking",
          desc: "Integrate SAP S/4HANA supply chain data with conversational commerce and store operational playbooks.",
          cta: "Explore retail solutions",
          link: "#stats"
        },
        'industrials': {
          title: "AI for Industrials & Manufacturing",
          heading: "Real-time shop-floor documentation & SAP maintenance",
          desc: "Empower plant managers and engineers with instant access to technical schematics, maintenance manuals, and ERP parts inventory.",
          cta: "Explore industrial solutions",
          link: "#accordion"
        },
        'all': {
          title: "AI for All Teams",
          heading: "Unified enterprise intelligence across every department",
          desc: "Connect 50+ enterprise systems, preserve document ACLs, and deploy autonomous digital coworkers across Slack, Web, and Teams.",
          cta: "Schedule a demo",
          link: "#hero"
        }
      };

      const bannerTitle = document.getElementById('solutions-banner-title');
      const cardHeading = document.getElementById('solutions-card-heading');
      const cardDesc = document.getElementById('solutions-card-desc');
      const cardCta = document.getElementById('solutions-card-cta');
      const cardBtnText = document.getElementById('solutions-card-btn-text');

      megaMenuContent.querySelectorAll('[data-card]').forEach(link => {
        link.addEventListener('mouseenter', () => {
          const cardKey = link.getAttribute('data-card');
          const itemData = solutionsData[cardKey];
          if (itemData) {
            megaMenuContent.querySelectorAll('.solutions-item-link').forEach(el => el.classList.remove('is-active'));
            link.classList.add('is-active');
            if (bannerTitle) bannerTitle.textContent = itemData.title;
            if (cardHeading) cardHeading.textContent = itemData.heading;
            if (cardDesc) cardDesc.textContent = itemData.desc;
            if (cardBtnText) cardBtnText.textContent = itemData.cta;
            if (cardCta) cardCta.setAttribute('href', itemData.link);
          }
        });
      });

    } else if (key === 'resources') {
      // Resources Mega Menu: EXACT Glean layout matching user screenshot
      megaMenuContent.innerHTML = `
        <div class="resources-mega-layout">
          <!-- Left 3 Columns + Bottom Full Width Strip -->
          <div class="resources-main-content">
            <div class="resources-columns-row">
              <!-- Column 1: EXPLORE -->
              <div class="resources-column">
                <div class="solutions-column-header">Explore</div>
                <a href="#resources" class="content-hub-card mega-link" data-resource="content-hub">
                  <div class="content-hub-text">
                    <span class="content-hub-bold">Content</span>
                    <span class="content-hub-serif">Hub</span>
                  </div>
                  <div class="content-hub-art-wrap">
                    <div class="content-hub-optic-wave"></div>
                  </div>
                </a>
              </div>

              <!-- Column 2: ENGAGE -->
              <div class="resources-column">
                <div class="solutions-column-header">Engage</div>
                <ul class="resources-links-list">
                  <li>
                    <a href="#resources" class="resources-text-link mega-link" data-resource="esaa-go">
                      ESAA:GO 2026
                    </a>
                  </li>
                  <li>
                    <a href="#company" class="resources-text-link mega-link" data-resource="community">
                      ESAAverse Community
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Column 3: SUPPORT & SERVICES -->
              <div class="resources-column">
                <div class="solutions-column-header">Support &amp; Services</div>
                <ul class="resources-links-list">
                  <li>
                    <a href="#resources" class="resources-text-link mega-link" data-resource="help-center">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#accordion" class="resources-text-link mega-link" data-resource="developers">
                      Developers
                    </a>
                  </li>
                  <li>
                    <a href="#stats" class="resources-text-link mega-link" data-resource="partners">
                      Partners
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Full-width Bottom Strip across columns 1, 2, 3 -->
            <a href="#statement" class="work-ai-institute-bar mega-link" data-resource="institute">
              <span class="work-ai-title">Work AI Institute</span>
              <span class="work-ai-arrow">&rarr;</span>
            </a>
          </div>

          <!-- Column 4 (Right): Featured Card with Luminous Sunset Fluid Mesh -->
          <div class="resources-featured-card">
            <div class="luminous-banner-wrap luminous-sunset-mesh">
              <div class="luminous-mesh-wrap luminous-sunset-gradient">
                <div class="luminous-blob luminous-sunset-blob-1"></div>
                <div class="luminous-blob luminous-sunset-blob-2"></div>
                <div class="luminous-blob luminous-blob-3"></div>
                <div class="luminous-blob luminous-sunset-blob-4"></div>
                <div class="luminous-blob luminous-blob-5"></div>
                <div class="luminous-stipple-dots"></div>
              </div>
              <div class="luminous-overlay-glass"></div>
              <div class="luminous-banner-title luminous-sunset-title" id="resources-banner-title">
                The Tokenomics<br>of Enterprise AI
              </div>
            </div>
            <div class="solutions-card-body">
              <div class="solutions-card-heading" id="resources-card-heading">The AI Token Savings Story</div>
              <div class="solutions-card-desc" id="resources-card-desc">Explore how context and model routing affect token costs, output quality, and savings at scale.</div>
              <a href="#stats" class="solutions-card-cta mega-link" id="resources-card-cta">
                <span id="resources-card-btn-text">Explore the story</span>
                <span class="cta-arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      `;

      // Interactive content mapper for Resources
      const resourcesCardData = {
        'default': {
          title: "The Tokenomics<br>of Enterprise AI",
          heading: "The AI Token Savings Story",
          desc: "Explore how context and model routing affect token costs, output quality, and savings at scale.",
          cta: "Explore the story",
          link: "#stats"
        },
        'content-hub': {
          title: "Enterprise Knowledge<br>&amp; Insights",
          heading: "The Unified Hybrid RAG Benchmark",
          desc: "Read how dense vector + BM25 keyword retrieval achieves 98.4% recall across internal wikis and documents.",
          cta: "Read benchmark paper",
          link: "#resources"
        },
        'esaa-go': {
          title: "ESAA:GO 2026<br>Global Summit",
          heading: "Keynotes on Sovereign LLMs & Autonomous Agents",
          desc: "Join 5,000+ enterprise AI leaders, security officers, and systems architects for our annual virtual summit.",
          cta: "Register for ESAA:GO",
          link: "#resources"
        },
        'community': {
          title: "ESAAverse<br>Community",
          heading: "Connect with 12,000+ Enterprise Builders",
          desc: "Share custom agent templates, discuss MCP tool integrations, and learn production prompting patterns.",
          cta: "Join community",
          link: "#company"
        },
        'help-center': {
          title: "Enterprise<br>Help Center",
          heading: "Deployment Runbooks & Connector Setup Guides",
          desc: "Step-by-step guides for connecting SAP S/4HANA, ServiceNow, Salesforce, and configuring SCIM 2.0 provisioning.",
          cta: "Search help center",
          link: "#resources"
        },
        'developers': {
          title: "Developer Hub<br>&amp; MCP Tools",
          heading: "Build Custom Agents with Scoped API Tools",
          desc: "Convert OpenAPI specs into live LLM tools, run benchmark test suites, and inspect traces in Langfuse.",
          cta: "Explore developer docs",
          link: "#accordion"
        },
        'partners': {
          title: "Global Partner<br>Ecosystem",
          heading: "Deliver Governed AI with Certified SI Partners",
          desc: "Partner with ESAA to deploy air-gapped on-premise RAG and SAP digital coworkers for Fortune 500 clients.",
          cta: "Become a partner",
          link: "#stats"
        },
        'institute': {
          title: "Work AI<br>Institute",
          heading: "State of Enterprise Digital Coworkers Report",
          desc: "Independent research on how autonomous agents transform worker productivity, ticket resolution, and decision speed.",
          cta: "Download report",
          link: "#statement"
        }
      };

      const resBannerTitle = document.getElementById('resources-banner-title');
      const resHeading = document.getElementById('resources-card-heading');
      const resDesc = document.getElementById('resources-card-desc');
      const resCta = document.getElementById('resources-card-cta');
      const resBtnText = document.getElementById('resources-card-btn-text');

      megaMenuContent.querySelectorAll('[data-resource]').forEach(link => {
        link.addEventListener('mouseenter', () => {
          const resKey = link.getAttribute('data-resource');
          const data = resourcesCardData[resKey];
          if (data) {
            if (resBannerTitle) resBannerTitle.innerHTML = data.title;
            if (resHeading) resHeading.textContent = data.heading;
            if (resDesc) resDesc.textContent = data.desc;
            if (resBtnText) resBtnText.textContent = data.cta;
            if (resCta) resCta.setAttribute('href', data.link);
          }
        });
      });

    } else {
      const data = megaMenuData[key];
      if (!data) return;

      megaMenuContent.innerHTML = `
        <div class="mega-standard-grid">
          <div>
            <div class="mega-col-title">${data.col1.title}</div>
            <ul class="mega-link-list">
              ${data.col1.links.map(l => `
                <li class="mega-link-item">
                  <a href="${l.target}" class="mega-link">
                    <div class="mega-link-title">${l.text}</div>
                    <div class="mega-link-desc">${l.desc}</div>
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
          <div>
            <div class="mega-col-title">${data.col2.title}</div>
            <ul class="mega-link-list">
              ${data.col2.links.map(l => `
                <li class="mega-link-item">
                  <a href="${l.target}" class="mega-link">
                    <div class="mega-link-title">${l.text}</div>
                    <div class="mega-link-desc">${l.desc}</div>
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
          <div>
            <div class="mega-col-title">${data.col3.title}</div>
            <ul class="mega-link-list">
              ${data.col3.links.map(l => `
                <li class="mega-link-item">
                  <a href="${l.target}" class="mega-link">
                    <div class="mega-link-title">${l.text}</div>
                    <div class="mega-link-desc">${l.desc}</div>
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="mega-promo-card">
            <div>
              <div class="mega-promo-title">${data.promo.title}</div>
              <div class="mega-promo-text">${data.promo.desc}</div>
            </div>
            <div>
              <button class="btn btn-sm btn-black ${data.promo.action === 'demo' ? 'demo-trigger-btn' : ''}">
                ${data.promo.btn} &rarr;
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Reattach demo trigger
    attachDemoTriggers();

    // Attach click listener to smooth scroll and close
    megaMenuContent.querySelectorAll('.mega-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          closeMegaMenu();
          const targetEl = document.querySelector(href);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          }
        }
      });
    });
  }

  function openMegaMenu(key, itemEl) {
    clearTimeout(megaMenuTimeout);
    currentActiveMenu = key;
    navItems.forEach(el => el.classList.remove('is-active'));
    itemEl.classList.add('is-active');
    itemEl.querySelector('button')?.setAttribute('aria-expanded', 'true');
    renderMegaMenu(key);
    megaMenuPanel?.classList.add('is-open');
    megaMenuOverlay?.classList.add('is-open');
  }

  function closeMegaMenu() {
    clearTimeout(megaMenuTimeout);
    currentActiveMenu = null;
    navItems.forEach(el => {
      el.classList.remove('is-active');
      el.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
    megaMenuPanel?.classList.remove('is-open');
    megaMenuOverlay?.classList.remove('is-open');
  }

  navItems.forEach(item => {
    const key = item.getAttribute('data-menu');
    item.addEventListener('mouseenter', () => {
      openMegaMenu(key, item);
    });

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentActiveMenu === key) {
        closeMegaMenu();
      } else {
        openMegaMenu(key, item);
      }
    });

    item.addEventListener('mouseleave', () => {
      megaMenuTimeout = setTimeout(() => {
        closeMegaMenu();
      }, 180);
    });
  });

  megaMenuPanel?.addEventListener('mouseenter', () => {
    clearTimeout(megaMenuTimeout);
  });

  megaMenuPanel?.addEventListener('mouseleave', () => {
    megaMenuTimeout = setTimeout(() => {
      closeMegaMenu();
    }, 180);
  });

  megaMenuOverlay?.addEventListener('click', closeMegaMenu);

  /* ==========================================================================
     5. MOBILE MENU
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');

  if (hamburgerBtn && mobileNavPanel) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileNavPanel.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileNavPanel.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavPanel.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     6. SEARCH MODAL & LIVE FILTERING
     ========================================================================== */
  const searchModal = document.getElementById('search-modal');
  const openSearchBtn = document.getElementById('open-search-btn');
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const searchModalClose = document.getElementById('search-modal-close');
  const searchQueryInput = document.getElementById('search-query-input');
  const searchResultsContainer = document.getElementById('search-results-container');

  const siteTopics = [
    { title: "Hybrid RAG", badge: "Architecture", target: "#statement" },
    { title: "50+ connectors", badge: "Integrations", target: "#stats" },
    { title: "Deep Research", badge: "Capabilities", target: "#tabs" },
    { title: "Custom agents", badge: "Personas", target: "#accordion" },
    { title: "SAP and ServiceNow actions", badge: "Workflows", target: "#accordion" },
    { title: "Security and SSO", badge: "Governance", target: "#accordion" },
    { title: "Capabilities tabs", badge: "Platform", target: "#tabs" },
    { title: "Platform numbers", badge: "Metrics", target: "#stats" },
    { title: "Challenges", badge: "Solutions", target: "#carousel" },
    { title: "Pillars", badge: "Catalog", target: "#accordion" },
    { title: "Get a demo", badge: "Action", target: "demo" }
  ];

  function renderSearchResults(query = '') {
    if (!searchResultsContainer) return;
    const cleanQ = query.trim().toLowerCase();
    const filtered = cleanQ
      ? siteTopics.filter(t => t.title.toLowerCase().includes(cleanQ) || t.badge.toLowerCase().includes(cleanQ))
      : siteTopics;

    if (filtered.length === 0) {
      searchResultsContainer.innerHTML = `
        <li style="padding: 20px; text-align: center; color: var(--muted); font-size: 14px;">
          No matching topics found for "${query}"
        </li>
      `;
      return;
    }

    searchResultsContainer.innerHTML = filtered.map((item, idx) => `
      <li class="search-result-item ${idx === 0 ? 'is-selected' : ''}" data-target="${item.target}">
        <span class="search-result-title">${item.title}</span>
        <span class="search-result-badge">${item.badge}</span>
      </li>
    `).join('');

    // Attach click events
    searchResultsContainer.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        selectSearchResult(el.getAttribute('data-target'));
      });
    });
  }

  function selectSearchResult(target) {
    closeSearchModal();
    if (target === 'demo') {
      openDemoModal();
    } else if (target && target.startsWith('#')) {
      const targetEl = document.querySelector(target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  }

  function openSearchModal() {
    if (!searchModal) return;
    searchModal.classList.add('is-open');
    renderSearchResults('');
    setTimeout(() => searchQueryInput?.focus(), 50);
  }

  function closeSearchModal() {
    searchModal?.classList.remove('is-open');
    if (searchQueryInput) searchQueryInput.value = '';
  }

  openSearchBtn?.addEventListener('click', openSearchModal);
  mobileSearchBtn?.addEventListener('click', () => {
    mobileNavPanel?.classList.remove('is-open');
    hamburgerBtn?.classList.remove('is-active');
    openSearchModal();
  });
  searchModalClose?.addEventListener('click', closeSearchModal);

  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearchModal();
  });

  searchQueryInput?.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  searchQueryInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearchModal();
    } else if (e.key === 'Enter') {
      const firstItem = searchResultsContainer?.querySelector('.search-result-item');
      if (firstItem) {
        const target = firstItem.getAttribute('data-target');
        selectSearchResult(target);
      }
    }
  });

  // Global Ctrl/Cmd + K shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal?.classList.contains('is-open')) {
        closeSearchModal();
      } else {
        openSearchModal();
      }
    }
  });

  /* ==========================================================================
     7. GET A DEMO MODAL & SIGN IN MODAL
     ========================================================================== */
  const demoModal = document.getElementById('demo-modal');
  const demoModalClose = document.getElementById('demo-modal-close');
  const demoForm = document.getElementById('demo-form');
  const demoFormContainer = document.getElementById('demo-form-container');
  const demoSuccessScreen = document.getElementById('demo-success-screen');

  function openDemoModal() {
    if (!demoModal) return;
    if (demoFormContainer) demoFormContainer.style.display = 'block';
    if (demoSuccessScreen) demoSuccessScreen.style.display = 'none';
    if (demoForm) demoForm.reset();
    demoModal.classList.add('is-open');
    setTimeout(() => document.getElementById('demo-name')?.focus(), 80);
  }

  function closeDemoModal() {
    demoModal?.classList.remove('is-open');
  }

  function attachDemoTriggers() {
    document.querySelectorAll('.demo-trigger-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        openDemoModal();
      };
    });
  }
  attachDemoTriggers();

  demoModalClose?.addEventListener('click', closeDemoModal);
  demoModal?.addEventListener('click', (e) => {
    if (e.target === demoModal) closeDemoModal();
  });

  demoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('demo-name')?.value.trim();
    const email = document.getElementById('demo-email')?.value.trim();
    const company = document.getElementById('demo-company')?.value.trim();

    // Validation
    if (!name || name.length < 2) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('Please enter a valid work email address.', 'error');
      return;
    }
    if (!company) {
      showToast('Please enter your company name.', 'error');
      return;
    }

    // Success Screen
    if (demoFormContainer) demoFormContainer.style.display = 'none';
    if (demoSuccessScreen) demoSuccessScreen.style.display = 'block';
    showToast('Demo request scheduled successfully!', 'success');

    // Auto-close after 3.5s
    setTimeout(() => {
      closeDemoModal();
    }, 3500);
  });

  // Sign In Modal
  const signinModal = document.getElementById('signin-modal');
  const signinBtn = document.getElementById('sign-in-btn');
  const mobileSigninBtn = document.getElementById('mobile-sign-in-btn');
  const signinModalClose = document.getElementById('signin-modal-close');
  const signinForm = document.getElementById('signin-form');

  function openSignInModal() {
    signinModal?.classList.add('is-open');
    signinForm?.reset();
    setTimeout(() => document.getElementById('signin-email')?.focus(), 80);
  }

  function closeSignInModal() {
    signinModal?.classList.remove('is-open');
  }

  signinBtn?.addEventListener('click', openSignInModal);
  mobileSigninBtn?.addEventListener('click', () => {
    mobileNavPanel?.classList.remove('is-open');
    hamburgerBtn?.classList.remove('is-active');
    openSignInModal();
  });
  signinModalClose?.addEventListener('click', closeSignInModal);
  signinModal?.addEventListener('click', (e) => {
    if (e.target === signinModal) closeSignInModal();
  });

  signinForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email')?.value.trim();
    const password = document.getElementById('signin-password')?.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('Please enter a valid corporate email.', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    closeSignInModal();
    showToast(`Signed in as ${email}`, 'success');
  });

  /* ==========================================================================
     8. HERO PROMPT TYPING EFFECT (CYCLING 3 QUERIES)
     ========================================================================== */
  const heroTypingTarget = document.getElementById('hero-typing-target');
  const heroQueries = [
    "Which launch blocker is buried in legal edits, release notes, and field notes?",
    "Show Q3 revenue impact from APAC supply chain delays across SAP & Salesforce",
    "Draft an incident response plan and sync Jira ticket with ServiceNow",
    "Synthesize customer feedback from Slack, Zendesk, and Confluence"
  ];

  // Interactive connector chips click
  const heroChips = document.querySelectorAll('.hero-search-card .chip');
  heroChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const src = chip.getAttribute('data-source');
      heroChips.forEach(c => c.style.borderColor = 'rgba(0, 0, 0, 0.05)');
      chip.style.borderColor = '#2a52ff';
      chip.style.backgroundColor = '#edf1ff';
      if (heroTypingTarget) {
        heroTypingTarget.textContent = `Search all ${src} docs and tickets for latest product updates...`;
      }
    });
  });

  let queryIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 42;

  function typeHeroQuery() {
    if (!heroTypingTarget) return;
    const currentQuery = heroQueries[queryIndex];

    if (prefersReducedMotion) {
      heroTypingTarget.textContent = currentQuery;
      return;
    }

    if (isDeleting) {
      heroTypingTarget.textContent = currentQuery.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 20;
    } else {
      heroTypingTarget.textContent = currentQuery.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 45;
    }

    if (!isDeleting && charIndex === currentQuery.length) {
      typingDelay = 3200; // Pause at end of sentence
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      queryIndex = (queryIndex + 1) % heroQueries.length;
      typingDelay = 400; // Pause before new word
    }

    setTimeout(typeHeroQuery, typingDelay);
  }
  typeHeroQuery();

  /* ==========================================================================
     9. STATS COUNT-UP (60% VISIBLE INTERSECTION OBSERVER)
     ========================================================================== */
  const statsElements = document.querySelectorAll('.stat-num-val, .hatched-number');

  function animateCountUp(element) {
    const target = parseFloat(element.getAttribute('data-target') || element.getAttribute('data-count'));
    const isDecimal = element.getAttribute('data-decimal') === 'true';
    const duration = prefersReducedMotion ? 0 : 1600;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * easeProgress;

      if (isDecimal) {
        element.textContent = currentVal.toFixed(1);
      } else {
        element.textContent = Math.floor(currentVal);
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = isDecimal ? target.toFixed(1) : target;
      }
    }

    requestAnimationFrame(updateNumber);
  }

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statsElements.forEach(el => statObserver.observe(el));

  /* ==========================================================================
     10. TABS & TYPING PROMPT ON TAB CHANGE
     ========================================================================== */
  const tabsData = {
    knowledge: {
      badge: "Pillar 1 & 2",
      headline: "Unified Enterprise Knowledge & Agentic RAG",
      bullets: [
        { title: "Hybrid Dense + Sparse Indexing", desc: "Combines vector embeddings with BM25 keyword matching for exact part numbers, SKUs, and jargon." },
        { title: "Cross-Encoder Re-Ranking", desc: "Dynamically scores candidate passages so LLMs receive the most accurate semantic context." },
        { title: "Document Sets & Inline Citations", desc: "Group knowledge by department; every generated answer links directly back to verified source files." }
      ],
      promptTag: "Live RAG Query",
      promptText: "Locate the latest GDPR compliance policy across Confluence and Google Drive, then highlight Article 17 obligations.",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.45), rgba(10, 16, 32, 0.78)), url('tab-knowledge.png') center/cover no-repeat"
    },
    agents: {
      badge: "Pillar 3",
      headline: "Specialized Agents, Personas & Guardrails",
      bullets: [
        { title: "Scoped Permissions & Roles", desc: "Assign custom tools, system prompts, and strict document visibility to specific agent personas." },
        { title: "Global vs Department Sharing", desc: "Publish agents company-wide or restrict access to vetted engineering or executive groups." },
        { title: "Starter Guidance", desc: "Equip non-technical staff with one-click contextual prompt buttons for repeatable accuracy." }
      ],
      promptTag: "Agent Persona",
      promptText: "Act as Senior IT Helpdesk Specialist. Validate the user's Okta session and inspect active VPN gateways.",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.45), rgba(10, 16, 32, 0.78)), url('tab-agents.png') center/cover no-repeat"
    },
    "deep-research": {
      badge: "Pillar 4",
      headline: "Autonomous Multi-Step Deep Research",
      bullets: [
        { title: "Iterative Sub-Query Decomposition", desc: "Breaks intricate enterprise queries into multi-step investigative hypotheses automatically." },
        { title: "Cross-Corroboration", desc: "Simultaneously queries internal documentation and live web search engines to confirm facts." },
        { title: "Publication-Grade Deliverables", desc: "Produces structured analytical executive dossiers with comparative metrics and bibliography." }
      ],
      promptTag: "Deep Research Mode",
      promptText: "Perform full competitive breakdown between Q3 regional supplier quotes and identify price drift anomalies.",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.42), rgba(15, 23, 42, 0.8)), url('autonomous-deep-research.jpg') center/cover no-repeat"
    },
    actions: {
      badge: "Pillar 5",
      headline: "Enterprise Extensibility & Live Actions",
      bullets: [
        { title: "SAP S/4HANA & ServiceNow Tools", desc: "Create sales orders, query OData tables, and resolve IT incident tickets straight from chat." },
        { title: "Model Context Protocol (MCP)", desc: "Plug into local or remote MCP servers for instantaneous integration with enterprise tools." },
        { title: "Isolated Python Sandbox", desc: "Safely execute mathematical routines, parse raw CSV dumps, and generate dynamic visual plots." }
      ],
      promptTag: "Live Tool Execution",
      promptText: "Create a High-Priority incident in ServiceNow for server cluster 'eu-west-04' and notify on-call in #devops-alerts.",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.4), rgba(10, 16, 32, 0.75)), url('tab-actions.png') center/cover no-repeat"
    },
    workflows: {
      badge: "Pillar 6",
      headline: "Autonomous Workflow Orchestration & Multi-Agent Mesh",
      bullets: [
        { title: "Autonomous Planning & Execution", desc: "Agents decompose complex cross-platform business workflows into ordered sub-tasks." },
        { title: "Live Enterprise Tool Invocation", desc: "Directly trigger SAP orders, ServiceNow tickets, and Slack alerts with strict authorization." },
        { title: "Human-in-the-Loop Approvals", desc: "Built-in review gates for high-impact actions like ledger updates and permission changes." }
      ],
      promptTag: "Orchestration Prompt",
      promptText: "Initiate cross-system employee onboarding: generate Okta credentials, provision GitHub access, and notify manager.",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.45), rgba(10, 16, 32, 0.8)), url('tab-workflows.png') center/cover no-repeat"
    },
    security: {
      badge: "Pillar 7",
      headline: "Zero-Trust Security, SCIM & ACL Mirroring",
      bullets: [
        { title: "Document-Level Permissions", desc: "Mirror original access rights from Google Drive, Confluence, and Slack so users only see what they own." },
        { title: "Identity & SCIM 2.0 Provisioning", desc: "Native SAML 2.0, Okta, and Microsoft Entra ID integration with automatic offboarding." },
        { title: "PII Masking & Evals CLI", desc: "Intercept sensitive prompts in flight and benchmark model adherence against compliance tests." }
      ],
      promptTag: "Security Governance",
      promptText: "Audit query: Verify that Employee #4092 cannot access executive compensation folders during salary review.",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.45), rgba(10, 16, 32, 0.8)), url('tab-security.png') center/cover no-repeat"
    }
  };

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabIndicator = document.getElementById('tab-indicator');
  const tabBadge = document.getElementById('tab-badge');
  const tabHeadline = document.getElementById('tab-headline');
  const tabBullets = document.getElementById('tab-bullets');
  const tabGradientPanel = document.getElementById('tab-gradient-panel');
  const tabPromptTag = document.getElementById('tab-prompt-tag');
  const tabPromptText = document.getElementById('tab-prompt-text');

  let tabTypeTimeout = null;

  function updateTabIndicator(activeBtn) {
    if (!tabIndicator || !activeBtn) return;
    const parentRect = activeBtn.parentElement.parentElement.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    tabIndicator.style.left = `${btnRect.left - parentRect.left}px`;
    tabIndicator.style.width = `${btnRect.width}px`;
  }

  function typeTabPrompt(text) {
    if (!tabPromptText) return;
    clearTimeout(tabTypeTimeout);

    if (prefersReducedMotion) {
      tabPromptText.textContent = `"${text}"`;
      return;
    }

    tabPromptText.textContent = '"';
    let idx = 0;

    function step() {
      if (idx < text.length) {
        tabPromptText.textContent += text.charAt(idx);
        idx++;
        tabTypeTimeout = setTimeout(step, 18);
      } else {
        tabPromptText.textContent += '"';
      }
    }
    step();
  }

  function activateTab(tabKey, btn) {
    const data = tabsData[tabKey];
    if (!data) return;

    tabButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    updateTabIndicator(btn);

    if (tabBadge) tabBadge.textContent = data.badge;
    if (tabHeadline) tabHeadline.textContent = data.headline;
    if (tabBullets) {
      tabBullets.innerHTML = data.bullets.map(b => `
        <li class="tab-bullet-item">
          <div class="tab-bullet-title">${b.title}</div>
          <div class="tab-bullet-desc">${b.desc}</div>
        </li>
      `).join('');
    }
    if (tabGradientPanel) tabGradientPanel.style.background = data.gradient;
    if (tabPromptTag) tabPromptTag.textContent = data.promptTag;

    typeTabPrompt(data.promptText);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-tab');
      activateTab(key, btn);
    });
  });

  // Set initial indicator
  const initialTab = document.querySelector('.tab-btn.is-active');
  if (initialTab) {
    setTimeout(() => updateTabIndicator(initialTab), 100);
  }
  window.addEventListener('resize', () => {
    const cur = document.querySelector('.tab-btn.is-active');
    if (cur) updateTabIndicator(cur);
  });

  /* ==========================================================================
     11. ACCORDION (8 PILLARS)
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others (one open at a time)
      accordionItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
        const otherContent = other.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        if (content) content.style.maxHeight = `${content.scrollHeight + 30}px`;
      }
    });
  });

  /* ==========================================================================
     12. CAROUSEL (5 CHALLENGES, AUTO-ADVANCE 3.5S, 2ND PIC EXPAND ROTATE)
     ========================================================================== */
  const carouselCards = document.querySelectorAll('.carousel-card');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const progressBar = document.getElementById('carousel-progress-bar');
  const carouselStage = document.getElementById('carousel-stage');
  const ROTATE_INTERVAL = 3500; // 3.5 seconds auto-advance rotation
  let currentCarouselIndex = 0;
  let carouselTimer = null;

  function resetProgressBar() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    void progressBar.offsetWidth; // Force layout flush for smooth restart
    if (!prefersReducedMotion) {
      progressBar.style.transition = `width ${ROTATE_INTERVAL}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  function setCarouselCard(index) {
    if (!carouselCards.length) return;
    currentCarouselIndex = (index + carouselCards.length) % carouselCards.length;
    carouselCards.forEach((card, idx) => {
      const isActive = idx === currentCarouselIndex;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
    resetProgressBar();
  }

  function startCarouselTimer() {
    stopCarouselTimer();
    if (prefersReducedMotion) return;
    resetProgressBar();
    carouselTimer = setInterval(() => {
      setCarouselCard(currentCarouselIndex + 1);
    }, ROTATE_INTERVAL);
  }

  function stopCarouselTimer() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
    if (progressBar) {
      const computedWidth = window.getComputedStyle(progressBar).width;
      progressBar.style.transition = 'none';
      progressBar.style.width = computedWidth;
    }
  }

  carouselCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index') || '0', 10);
      setCarouselCard(idx);
      startCarouselTimer();
    });
  });

  prevBtn?.addEventListener('click', () => {
    setCarouselCard(currentCarouselIndex - 1);
    startCarouselTimer();
  });

  nextBtn?.addEventListener('click', () => {
    setCarouselCard(currentCarouselIndex + 1);
    startCarouselTimer();
  });

  carouselStage?.addEventListener('mouseenter', stopCarouselTimer);
  carouselStage?.addEventListener('mouseleave', startCarouselTimer);

  // Pause rotation when tab is hidden, resume when tab is active
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCarouselTimer();
    } else {
      startCarouselTimer();
    }
  });

  startCarouselTimer();

  /* ==========================================================================
     13. DARK SECTION: ROW HOVER & CURSOR-FOLLOWING GRADIENT THUMBNAIL
     ========================================================================== */
  const darkRows = document.querySelectorAll('.dark-row-item');
  const cursorThumbnail = document.getElementById('cursor-thumbnail');

  darkRows.forEach(row => {
    row.addEventListener('mouseenter', (e) => {
      const thumbGrad = row.getAttribute('data-thumb');
      if (cursorThumbnail && thumbGrad) {
        if (thumbGrad.startsWith('url(')) {
          cursorThumbnail.style.background = 'none';
          cursorThumbnail.style.backgroundImage = thumbGrad;
          cursorThumbnail.style.backgroundSize = 'cover';
          cursorThumbnail.style.backgroundPosition = 'center';
        } else {
          cursorThumbnail.style.backgroundImage = 'none';
          cursorThumbnail.style.background = thumbGrad;
        }
        cursorThumbnail.classList.add('is-visible');
      }
    });

    row.addEventListener('mousemove', (e) => {
      if (cursorThumbnail) {
        cursorThumbnail.style.left = `${e.clientX + 30}px`;
        cursorThumbnail.style.top = `${e.clientY - 20}px`;
      }
    });

    row.addEventListener('mouseleave', () => {
      cursorThumbnail?.classList.remove('is-visible');
    });
  });

  /* ==========================================================================
     14. FROM KNOWLEDGE TO ACTION: CHECKLIST & PROGRESS BAR
     ========================================================================== */
  const planCard = document.getElementById('plan-trigger-card');
  const planProgressBar = document.getElementById('plan-progress-bar');
  const planCounter = document.getElementById('plan-counter');
  const planStatusLabel = document.getElementById('plan-status-label');
  const checkItems = [
    document.getElementById('check-item-1'),
    document.getElementById('check-item-2'),
    document.getElementById('check-item-3')
  ];
  let planAnimated = false;

  const planObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !planAnimated) {
        planAnimated = true;
        runPlanAnimation();
      }
    });
  }, { threshold: 0.4 });

  if (planCard) planObserver.observe(planCard);

  function runPlanAnimation() {
    if (planStatusLabel) planStatusLabel.textContent = 'Executing...';
    let completed = 0;

    const interval = prefersReducedMotion ? 100 : 700;

    checkItems.forEach((item, index) => {
      setTimeout(() => {
        item?.classList.add('is-done');
        completed++;
        const percent = (completed / checkItems.length) * 100;
        if (planProgressBar) planProgressBar.style.width = `${percent}%`;
        if (planCounter) planCounter.textContent = `${completed} of ${checkItems.length} completed`;

        if (completed === checkItems.length) {
          if (planStatusLabel) {
            planStatusLabel.textContent = 'All steps verified';
            planStatusLabel.style.color = '#1cb561';
            planStatusLabel.style.fontWeight = '600';
          }
        }
      }, (index + 1) * interval);
    });
  }

  /* ==========================================================================
     15. FIXED LEFT RAIL (HIDDEN ON HERO, VISIBLE ON REMAINING SECTIONS)
     ========================================================================== */
  const fixedRail = document.getElementById('fixed-rail');
  const railItems = document.querySelectorAll('.rail-item');
  const heroSection = document.getElementById('hero');

  // Hide rail on Hero section, show smoothly on remaining sections
  function updateRailVisibility() {
    if (!fixedRail) return;
    if (!heroSection) {
      fixedRail.classList.add('is-visible');
      return;
    }
    const heroRect = heroSection.getBoundingClientRect();
    // If bottom of hero is within 140px of top viewport, user is still in hero section
    const isInHero = heroRect.bottom > 140;
    if (isInHero) {
      fixedRail.classList.remove('is-visible');
      fixedRail.classList.remove('is-expanded');
    } else {
      fixedRail.classList.add('is-visible');
    }
  }

  window.addEventListener('scroll', updateRailVisibility, { passive: true });
  window.addEventListener('resize', updateRailVisibility, { passive: true });
  updateRailVisibility();

  // Toggle expand on touch/click
  if (fixedRail) {
    fixedRail.addEventListener('click', (e) => {
      if (!fixedRail.classList.contains('is-expanded')) {
        fixedRail.classList.add('is-expanded');
      }
    });

    fixedRail.addEventListener('touchstart', () => {
      fixedRail.classList.add('is-expanded');
    }, { passive: true });

    // Close when clicking/touching outside
    document.addEventListener('click', (e) => {
      if (!fixedRail.contains(e.target)) {
        fixedRail.classList.remove('is-expanded');
      }
    });

    document.addEventListener('touchstart', (e) => {
      if (!fixedRail.contains(e.target)) {
        fixedRail.classList.remove('is-expanded');
      }
    }, { passive: true });
  }

  // Smooth scroll and active state on item click
  railItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetId = item.getAttribute('data-target');
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          railItems.forEach(r => r.classList.remove('is-active'));
          item.classList.add('is-active');
          targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          setTimeout(() => {
            fixedRail?.classList.remove('is-expanded');
          }, 800);
        }
      }
    });
  });

  // Track sections while scrolling
  const railSections = [
    document.getElementById('statement'),
    document.getElementById('split-feature'),
    document.getElementById('dark-section'),
    document.getElementById('stats'),
    document.getElementById('carousel'),
    document.getElementById('tabs')
  ].filter(Boolean);

  const railObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        railItems.forEach(btn => {
          btn.classList.toggle('is-active', btn.getAttribute('data-target') === id);
        });
      }
    });
  }, { threshold: 0.3 });

  railSections.forEach(sec => railObserver.observe(sec));

  /* ==========================================================================
     16. CHAT WIDGET (BOTTOM-RIGHT) & KEYWORD TABLE
     ========================================================================== */
  const chatGreetingBubble = document.getElementById('chat-greeting-bubble');
  const chatBubbleClose = document.getElementById('chat-bubble-close');
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatPanel = document.getElementById('chat-panel');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');

  chatBubbleClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    chatGreetingBubble?.remove();
  });

  chatToggleBtn?.addEventListener('click', () => {
    const isOpen = chatPanel?.classList.toggle('is-open');
    if (isOpen) {
      chatGreetingBubble?.remove();
      setTimeout(() => chatInput?.focus(), 80);
    }
  });

  chatCloseBtn?.addEventListener('click', () => {
    chatPanel?.classList.remove('is-open');
  });

  // Keyword lookup table
  const esaKnowledgeTable = [
    {
      keywords: ['connector', 'connectors', 'sap', 'servicenow', 'jira', 'confluence', 'drive', 'slack', 'github', 'salesforce'],
      reply: "ESAA connects directly to 50+ enterprise sources including SAP S/4HANA, ServiceNow, Salesforce, Jira, Google Drive, and Slack with continuous incremental indexing, webhooks, and federated live search."
    },
    {
      keywords: ['security', 'sso', 'acl', 'saml', 'scim', 'permission', 'permissions', 'rbac'],
      reply: "Security is built into our core architecture. ESAA mirrors document-level ACLs directly from your identity provider (SAML 2.0, Okta, Microsoft Entra ID), ensuring users only receive answers generated from documents they have explicit clearance to view."
    },
    {
      keywords: ['agent', 'agents', 'persona', 'personas', 'custom'],
      reply: "Our Specialized Agents support custom persona instructions, temperature controls, scoped document collections, and tool permissions (e.g., an IT Agent with ServiceNow execution rights)."
    },
    {
      keywords: ['research', 'deep research', 'synthesis', 'report'],
      reply: "Autonomous Deep Research breaks complex questions into multi-step investigative hypotheses, cross-references internal records with external web engines, and outputs structured publication-grade executive reports."
    },
    {
      keywords: ['deployment', 'deploy', 'kubernetes', 'docker', 'cloud', 'aws', 'gcp', 'azure', 'lite'],
      reply: "ESAA is fully model- and infrastructure-agnostic. Deploy on self-hosted Kubernetes, private clouds (AWS, GCP, Azure), air-gapped Docker, or our ultra-lightweight Lite mode under 1GB RAM."
    },
    {
      keywords: ['model', 'models', 'openai', 'claude', 'gemini', 'bedrock', 'ollama', 'vllm'],
      reply: "You avoid vendor lock-in completely. ESAA supports OpenAI, Anthropic Claude, Google Gemini, AWS Bedrock, Azure OpenAI, and self-hosted private models via Ollama and vLLM."
    },
    {
      keywords: ['demo', 'contact', 'schedule', 'price', 'pricing', 'trial'],
      reply: "You can schedule a tailored architectural walkthrough by clicking any 'Get a demo' button on this page, or let me know and I'll open the request form for you!"
    }
  ];

  function appendChatMessage(text, sender = 'esa') {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.textContent = text;
    // Insert before typing indicator
    chatMessages.insertBefore(msgDiv, chatTypingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput?.value.trim();
    if (!query) return;

    // Append user message
    appendChatMessage(query, 'user');
    chatInput.value = '';

    // Show typing indicator
    if (chatTypingIndicator) {
      chatTypingIndicator.style.display = 'inline-flex';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Determine reply from keyword table
    const lowerQ = query.toLowerCase();
    let matchedReply = "ESAA turns foundational LLMs into secure, context-aware digital coworkers and autonomous agents connected to your enterprise systems. Could you clarify if you're interested in our connectors, security, or live demo?";

    for (const entry of esaKnowledgeTable) {
      if (entry.keywords.some(k => lowerQ.includes(k))) {
        matchedReply = entry.reply;
        break;
      }
    }

    // If user asked to open demo
    if (lowerQ.includes('demo') || lowerQ.includes('schedule')) {
      setTimeout(() => openDemoModal(), 800);
    }

    // Reply after 500ms
    setTimeout(() => {
      if (chatTypingIndicator) chatTypingIndicator.style.display = 'none';
      appendChatMessage(matchedReply, 'esa');
    }, 500);
  });
});
