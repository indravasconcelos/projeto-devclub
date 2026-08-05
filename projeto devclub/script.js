/* ============================================
   DEVCLUB — Script
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // HERO — PREMIUM VIDEO SECTION
  // ============================================

  function initHero() {
    var heroContent = document.getElementById('hero-content');
    var heroVideo = document.querySelector('.hero__video');

    /* Show content after video starts playing */
    if (heroVideo) {
      heroVideo.addEventListener('canplay', function () {
        setTimeout(function () {
          if (heroContent) heroContent.classList.add('visible');
        }, 300);
      });

      /* Fallback if video doesn't load */
      heroVideo.addEventListener('error', function () {
        setTimeout(function () {
          if (heroContent) heroContent.classList.add('visible');
        }, 800);
      });
    }

    /* Fallback — show content after 1.5 seconds regardless */
    setTimeout(function () {
      if (heroContent && !heroContent.classList.contains('visible')) {
        heroContent.classList.add('visible');
      }
    }, 1500);
  }

  // ============================================
  // NAVBAR
  // ============================================

  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    function onScroll() {
      if (window.pageYOffset > 50) {
        if (navbar) navbar.classList.add('scrolled');
      } else {
        if (navbar) navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var active = links.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', active);
      document.body.classList.toggle('no-scroll', active);
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ============================================
  // SCROLL REVEAL
  // ============================================

  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      els.forEach(function (el) { obs.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  // ============================================
  // COUNTER ANIMATION
  // ============================================

  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    function animateCounter(el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var isDecimal = el.dataset.decimal === 'true';
      var duration = 2000;
      var start = performance.now();

      function update(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var current = target * eased;

        if (isDecimal) {
          el.textContent = current.toFixed(1) + suffix;
        } else {
          el.textContent = Math.floor(current).toLocaleString('pt-BR') + suffix;
        }

        if (p < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateCounter(e.target);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });

      els.forEach(function (el) { obs.observe(el); });
    } else {
      els.forEach(function (el) { animateCounter(el); });
    }
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // SEÇÃO 1 — JORNADA (Sticky Stack)
  // ============================================

  function initJornada() {
    var cards = document.querySelectorAll('.jornada-card');
    var progress = document.querySelector('.jornada-progress');
    var fill = document.getElementById('jprogress-fill');
    var dots = document.querySelectorAll('.jdot');
    var counterCurrent = document.getElementById('jcounter-current');
    var section = document.getElementById('jornada');
    if (!cards.length || !progress || !fill || !section) return;

    var totalCards = cards.length;
    var currentStep = -1;

    function updateProgress(index) {
      if (index === currentStep) return;
      currentStep = index;

      var pct = ((index + 1) / totalCards) * 100;
      fill.style.height = pct + '%';

      dots.forEach(function (dot, i) {
        dot.classList.remove('active', 'past');
        if (i === index) {
          dot.classList.add('active');
        } else if (i < index) {
          dot.classList.add('past');
        }
      });

      if (counterCurrent) {
        counterCurrent.textContent = (index + 1).toString().padStart(2, '0');
      }

      cards.forEach(function (card, i) {
        card.classList.toggle('is-pinned', i === index);
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            var step = parseInt(entry.target.dataset.step);
            updateProgress(step);
          }
        });
      }, {
        threshold: [0.5, 0.75, 1],
        rootMargin: '-10% 0px -30% 0px'
      });

      cards.forEach(function (card) {
        observer.observe(card);
      });
    } else {
      cards.forEach(function (card, i) {
        card.classList.add('is-pinned');
      });
      updateProgress(totalCards - 1);
    }

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        progress.classList.toggle('visible', entry.isIntersecting && entry.intersectionRatio > 0.1);
      });
    }, { threshold: [0, 0.1, 0.2] });

    sectionObserver.observe(section);
    updateProgress(0);
  }

  // ============================================
  // SEÇÃO 2 — O QUE VOCÊ VAI APRENDER
  // ============================================

  function initLearn() {
    var cats = document.querySelectorAll('.learn-cat');
    var panels = document.querySelectorAll('.learn-panel');
    if (!cats.length || !panels.length) return;

    function switchTo(catName) {
      cats.forEach(function (c) {
        c.classList.toggle('active', c.dataset.cat === catName);
      });
      panels.forEach(function (p) {
        p.classList.toggle('active', p.dataset.panel === catName);
      });
    }

    cats.forEach(function (cat) {
      cat.addEventListener('click', function () {
        switchTo(this.dataset.cat);
      });
    });
  }

  // ============================================
  // SEÇÃO 4 — MENTORES (Prompt Switch)
  // ============================================

  function initMentors() {
    var prompts = document.querySelectorAll('.mentor-prompt');
    var responses = document.querySelectorAll('.response-card');
    if (!prompts.length) return;

    prompts.forEach(function (prompt) {
      prompt.addEventListener('click', function () {
        var target = this.dataset.prompt;

        prompts.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');

        responses.forEach(function (r) {
          r.classList.remove('active');
          if (r.dataset.prompt === target) {
            r.classList.add('active');
          }
        });
      });
    });
  }

  // ============================================
  // NEURAL NETWORK — GALÁXIA NEURAL
  // ============================================

  function initNeuralNetwork() {
    var canvas = document.getElementById('neural-canvas');
    var nodesWrap = document.getElementById('neural-nodes');
    var infoPanel = document.getElementById('neural-info');
    if (!canvas || !nodesWrap) return;

    var ctx = canvas.getContext('2d');
    var W, H;
    var nodes = [];
    var connections = [];
    var flowParticles = [];
    var mouse = { x: -1000, y: -1000 };
    var hoveredNode = null;
    var orbitalTime = 0;
    var paused = false;
    var MIN_DISTANCE = 65;

    var teamMembers = [
      { name: 'Rodolfo Mori', role: 'Fundador e Mentor Principal', desc: 'De eletricista a Dev Sênior. Mentor de +25K alunos.', type: 'fundador', photo: 'assets/rodolfo-ig.jpg' },
      { name: 'Fernanda Costa', role: 'Mentora de RH e Carreira', desc: 'Ex-LATAM • 20 anos de experiência em RH', type: 'tutor', photo: 'assets/fernanda costa.jpg' },
      { name: 'Agustinho Neto', role: 'Engenheiro & Trainer', desc: 'Sistemas Distribuídos • Back-end • MongoDB', type: 'mentor', photo: 'https://i.pravatar.cc/300?img=11' },
      { name: 'Henrique Francisco', role: 'Suporte Técnico', desc: 'Especialista em suporte • 10K+ alunos atendidos', type: 'tutor', photo: 'https://i.pravatar.cc/300?img=12' },
      { name: 'Juliana Nunes', role: 'Mentora de Carreira', desc: 'RH • Recrutamento & Seleção • LinkedIn', type: 'tutor', photo: 'assets/juliana nunes.jpg' },
      { name: 'Mateus Nogueira', role: 'Mentor de IA', desc: 'Arquiteto de IA • LLMs & Agents • RAG', type: 'instrutor', photo: 'assets/mateus.jpg' },
      { name: 'Felipe Brito', role: 'Professor de Código', desc: 'JavaScript • React • Mobile • Java', type: 'mentor', photo: 'https://i.pravatar.cc/300?img=14' },
      { name: 'Iury Pierot', role: 'Desenvolvedor Full Stack', desc: 'JavaScript • React • Node.js', type: 'instrutor', photo: 'assets/iury pierot.jpg' },
      { name: 'Jacqueline da Rocha', role: 'Dev Frontend', desc: 'HTML • CSS • JavaScript • React', type: 'mentor', photo: 'https://i.pravatar.cc/300?img=25' },
      { name: 'Márcio Conceição', role: 'Terapeuta de Alta Performance', desc: 'Mentalidade • Desbloqueio • Performance Mental', type: 'instrutor', photo: 'assets/marcio.jpg' }
    ];

    function getInitials(name) {
      var parts = name.split(' ');
      return parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '');
    }

    function createNodes() {
      nodes = [];
      var cx = W / 2;
      var cy = H / 2;
      var minDim = Math.min(W, H);

      var innerMembers = [];
      var outerMembers = [];

      teamMembers.forEach(function (m, i) {
        if (m.type === 'fundador') return;
        if (i <= 4) innerMembers.push(m);
        else outerMembers.push(m);
      });

      /* Founder at center */
      nodes.push({
        x: cx, y: cy, targetX: cx, targetY: cy,
        name: teamMembers[0].name,
        role: teamMembers[0].role,
        desc: teamMembers[0].desc,
        type: teamMembers[0].type,
        photo: teamMembers[0].photo || null,
        initials: getInitials(teamMembers[0].name),
        isFounder: true,
        orbitAngle: 0,
        orbitSpeed: 0,
        orbitRadiusX: 0,
        orbitRadiusY: 0,
        orbitTilt: 0,
        orbitalTime: 0
      });

      /* Inner orbit — 4 members, 90° offset, radius ~30% */
      var innerRadiusX = minDim * 0.3;
      var innerRadiusY = minDim * 0.22;
      innerMembers.forEach(function (m, i) {
        var angleOffset = (i / 4) * Math.PI * 2;
        nodes.push({
          x: cx, y: cy, targetX: cx, targetY: cy,
          name: m.name,
          role: m.role,
          desc: m.desc,
          type: m.type,
          photo: m.photo || null,
          initials: getInitials(m.name),
          isFounder: false,
          orbitAngle: angleOffset,
          orbitSpeed: 0.35 + i * 0.07,
          orbitRadiusX: innerRadiusX + (i % 2) * minDim * 0.04,
          orbitRadiusY: innerRadiusY + (i % 2) * minDim * 0.03,
          orbitTilt: 0.3 + i * 0.15,
          orbitalTime: angleOffset
        });
      });

      /* Outer orbit — 5 members, different offset, radius ~55% */
      var outerRadiusX = minDim * 0.55;
      var outerRadiusY = minDim * 0.38;
      outerMembers.forEach(function (m, i) {
        var angleOffset = (i / 5) * Math.PI * 2 + 0.5;
        nodes.push({
          x: cx, y: cy, targetX: cx, targetY: cy,
          name: m.name,
          role: m.role,
          desc: m.desc,
          type: m.type,
          photo: m.photo || null,
          initials: getInitials(m.name),
          isFounder: false,
          orbitAngle: angleOffset,
          orbitSpeed: 0.18 + i * 0.05,
          orbitRadiusX: outerRadiusX + (i % 2) * minDim * 0.05,
          orbitRadiusY: outerRadiusY + (i % 2) * minDim * 0.04,
          orbitTilt: 0.5 + i * 0.12,
          orbitalTime: angleOffset
        });
      });

      /* Create connections — founder to all, some peer links */
      connections = [];
      nodes.forEach(function (n, i) {
        if (i === 0) return;
        connections.push({ from: 0, to: i, strength: 0.5 + Math.random() * 0.5 });
      });
      /* Peer connections between outer orbit members */
      for (var i = 6; i < nodes.length; i++) {
        var peerIdx = 6 + ((i - 6 + 1) % (nodes.length - 6));
        if (peerIdx < nodes.length && peerIdx !== i) {
          var exists = connections.some(function (c) {
            return (c.from === i && c.to === peerIdx) || (c.from === peerIdx && c.to === i);
          });
          if (!exists) {
            connections.push({ from: i, to: peerIdx, strength: 0.3 + Math.random() * 0.3 });
          }
        }
      }
    }

    function createDOMNodes() {
      nodesWrap.innerHTML = '';
      nodes.forEach(function (n, i) {
        var el = document.createElement('div');
        el.className = 'neural-node';
        el.dataset.role = n.type;
        el.dataset.index = i;
        el.style.left = (n.x / W * 100) + '%';
        el.style.top = (n.y / H * 100) + '%';
        el.style.transform = 'translate(-50%, -50%)';

        var photoHtml = n.photo
          ? '<img src="' + n.photo + '" alt="' + n.name + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div style="width:100%;height:100%;display:none;align-items:center;justify-content:center;font-size:' + (n.isFounder ? '1.4rem' : '1rem') + ';font-weight:700;color:#110f12;background:linear-gradient(135deg,#39D353,#8532F2);">' + n.initials + '</div>'
          : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:' + (n.isFounder ? '1.4rem' : '1rem') + ';font-weight:700;color:#110f12;background:linear-gradient(135deg,#39D353,#8532F2);">' + n.initials + '</div>';

        el.innerHTML =
          '<div class="neural-node-inner">' +
            '<div class="neural-node-photo">' + photoHtml +
              '<div class="holo-shine"></div>' +
              '<div class="energy-ring"></div>' +
            '</div>' +
            '<span class="neural-node-label">' + n.name + '</span>' +
            '<span class="neural-node-role">' + n.role + '</span>' +
          '</div>';

        el.addEventListener('mouseenter', function () {
          hoveredNode = i;
          paused = true;
        });

        el.addEventListener('mouseleave', function () {
          hoveredNode = null;
          paused = false;
        });

        /* Touch events — mobile */
        el.addEventListener('touchstart', function () {
          hoveredNode = i;
          paused = true;
        }, { passive: true });

        el.addEventListener('touchend', function () {
          hoveredNode = null;
          paused = false;
        }, { passive: true });

        el.addEventListener('touchcancel', function () {
          hoveredNode = null;
          paused = false;
        }, { passive: true });

        /* Click */
        el.addEventListener('click', function () {
          var wasActive = el.classList.contains('active');

          /* Remove active from all nodes */
          document.querySelectorAll('.neural-node.active').forEach(function (nd) {
            nd.classList.remove('active');
            nd.classList.remove('click-active');
          });
          nodesWrap.classList.remove('has-active');

          if (!wasActive) {
            el.classList.add('active');
            el.classList.add('click-active');
            nodesWrap.classList.add('has-active');

            /* Auto-remove click-active after animation */
            setTimeout(function () {
              el.classList.remove('click-active');
            }, 600);
          }
        });

        nodesWrap.appendChild(el);
      });
    }

    function resize() {
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
      createNodes();
      createDOMNodes();
      initFlowParticles();
    }

    /* Orbital simulation — suave */
    function simulate() {
      if (!paused) {
        orbitalTime += 0.005;
      }

      var cx = W / 2;
      var cy = H / 2;

      nodes.forEach(function (n) {
        if (n.isFounder) {
          n.targetX = cx;
          n.targetY = cy;
          return;
        }
        var a = n.orbitalTime + orbitalTime * n.orbitSpeed;
        n.targetX = cx + Math.cos(a) * n.orbitRadiusX;
        n.targetY = cy + Math.sin(a) * n.orbitRadiusY * Math.cos(n.orbitTilt);
      });

      /* Mouse parallax offset */
      var parallaxX = 0;
      var parallaxY = 0;
      if (mouse.x > 0 && mouse.y > 0) {
        parallaxX = ((mouse.x - W / 2) / (W / 2)) * 8;
        parallaxY = ((mouse.y - H / 2) / (H / 2)) * 5;
      }

      nodes.forEach(function (n) {
        n.x += (n.targetX + parallaxX - n.x) * 0.04;
        n.y += (n.targetY + parallaxY - n.y) * 0.04;
      });

      /* Collision avoidance — empurra nós para não se sobrepor */
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i];
          var b = nodes[j];
          var dx = b.x - a.x;
          var dy = b.y - a.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MIN_DISTANCE && dist > 0) {
            var push = (MIN_DISTANCE - dist) / 2;
            var nx = dx / dist;
            var ny = dy / dist;
            a.x -= nx * push;
            a.y -= ny * push;
            b.x += nx * push;
            b.y += ny * push;
          }
        }
      }
    }

    /* Draw curved connections with energy pulse */
    var pulseTime = 0;
    function drawConnections() {
      pulseTime += 0.02;

      connections.forEach(function (c, ci) {
        var from = nodes[c.from];
        var to = nodes[c.to];
        if (!from || !to) return;

        var isHighlighted = hoveredNode === c.from || hoveredNode === c.to;
        var baseAlpha = isHighlighted ? 0.45 : 0.07;
        var pulse = Math.sin(pulseTime + ci * 0.6) * 0.04;
        var alpha = Math.max(0.03, baseAlpha + pulse);

        var midX = (from.x + to.x) / 2;
        var midY = (from.y + to.y) / 2;
        var perpX = -(to.y - from.y) * 0.12;
        var perpY = (to.x - from.x) * 0.12;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(midX + perpX, midY + perpY, to.x, to.y);

        var color = from.type === 'fundador' || to.type === 'fundador' ? '57, 211, 83' : '133, 50, 242';
        ctx.strokeStyle = 'rgba(' + color + ', ' + alpha + ')';
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.stroke();
      });
    }

    /* Traveling energy particles along connections */
    function initFlowParticles() {
      flowParticles = [];
      connections.forEach(function (c, ci) {
        var count = 2 + Math.floor(Math.random() * 2);
        for (var p = 0; p < count; p++) {
          flowParticles.push({
            connIdx: ci,
            t: Math.random(),
            speed: 0.001 + Math.random() * 0.002,
            size: 1.2 + Math.random() * 1.5
          });
        }
      });
    }

    function drawFlowParticles() {
      flowParticles.forEach(function (fp) {
        fp.t += fp.speed;
        if (fp.t > 1) fp.t -= 1;

        var c = connections[fp.connIdx];
        var from = nodes[c.from];
        var to = nodes[c.to];
        if (!from || !to) return;

        var t = fp.t;
        var midX = (from.x + to.x) / 2;
        var midY = (from.y + to.y) / 2;
        var perpX = -(to.y - from.y) * 0.12;
        var perpY = (to.x - from.x) * 0.12;

        var x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * (midX + perpX) + t * t * to.x;
        var y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * (midY + perpY) + t * t * to.y;

        var isHighlighted = hoveredNode === c.from || hoveredNode === c.to;
        var alpha = isHighlighted ? 0.9 : 0.35;
        var color = from.type === 'fundador' || to.type === 'fundador' ? '57, 211, 83' : '133, 50, 242';

        ctx.beginPath();
        ctx.arc(x, y, fp.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + color + ', ' + alpha + ')';
        ctx.fill();
      });
    }

    /* Main render loop */
    function render() {
      ctx.clearRect(0, 0, W, H);
      simulate();
      drawConnections();
      drawFlowParticles();

      /* Update DOM positions */
      var nodeEls = nodesWrap.querySelectorAll('.neural-node');
      nodeEls.forEach(function (el, i) {
        if (nodes[i]) {
          el.style.left = (nodes[i].x / W * 100) + '%';
          el.style.top = (nodes[i].y / H * 100) + '%';
        }
      });

      requestAnimationFrame(render);
    }

    /* Mouse tracking for parallax */
    var container = canvas.parentElement;
    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      /* Apply subtle 3D tilt to container */
      var rotX = -((mouse.y - H / 2) / (H / 2)) * 4;
      var rotY = ((mouse.x - W / 2) / (W / 2)) * 4;
      nodesWrap.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
    });

    container.addEventListener('mouseleave', function () {
      mouse.x = -1000;
      mouse.y = -1000;
      nodesWrap.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });

    /* Init */
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(render);
  }

  // ============================================
  // COMMUNITY PARTICLES
  // ============================================

  function initCommunityParticles() {
    var canvas = document.getElementById('community-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    var particles = [];
    var mouse = { x: -1000, y: -1000 };

    function resize() {
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
      createParticles();
    }

    function createParticles() {
      particles = [];
      var count = Math.min(60, Math.round((W * H) / 15000));
      for (var i = 0; i < count; i++) {
        var isGreen = Math.random() > 0.4;
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: 1.5 + Math.random() * 2,
          color: isGreen ? '57, 211, 83' : '133, 50, 242',
          phase: Math.random() * Math.PI * 2,
          speed: 0.001 + Math.random() * 0.002
        });
      }
    }

    function animate(now) {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        var pulse = 0.6 + 0.4 * Math.sin(now * p.speed + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ', ' + (0.3 + pulse * 0.4) + ')';
        ctx.fill();
      }

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            var alpha = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(57, 211, 83, ' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(animate);
  }

  // ============================================
  // TESTIMONIALS CAROUSEL DUPLICATE
  // ============================================

  function initTestimonialsCarousel() {
    var track = document.getElementById('testimonials-track');
    if (!track) return;
    var cards = track.innerHTML;
    track.innerHTML = cards + cards;
  }

  // ============================================
  // COMMUNITY STAT COUNTERS
  // ============================================

  // ============================================
  // MURAL PHOTO WALL ENTRY ANIMATION
  // ============================================

  function initMuralPhotos() {
    var photos = document.querySelectorAll('.mural-photo[data-reveal]');
    if (!photos.length) return;

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var delay = Math.random() * 400 + 100;
            setTimeout(function () {
              e.target.classList.add('revealed');
            }, delay);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      photos.forEach(function (el) { obs.observe(el); });
    } else {
      photos.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================

  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      btn.addEventListener('click', function () {
        var isActive = item.classList.contains('active');
        faqItems.forEach(function (el) { el.classList.remove('active'); });
        if (!isActive) { item.classList.add('active'); }
      });
    });
  }

  // ============================================
  // INIT
  // ============================================

  initHero();
  initNavbarScroll();
  initMobileMenu();
  initReveal();
  initCounters();
  initSmoothScroll();
  initJornada();
  initLearn();
  initMentors();
  initNeuralNetwork();
  initCommunityParticles();
  initTestimonialsCarousel();
  initMuralPhotos();
  initFAQ();

})();
