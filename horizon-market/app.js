(() => {
  'use strict';

  /* ---------- Данные ---------- */
  const GAMES = [
    { id: 1,  title: 'Последний сигнал',   genre: 'Приключения', price: 1490, old: 1990, rating: 4.9, pop: 98, hue: 32,  art: 'hole',
      desc: 'Вы — оператор станции на краю системы. Сигнал с той стороны червоточины повторяется каждые 23 минуты. Кто-то зовёт домой.', tags: ['сюжет', 'одиночная', 'атмосфера'] },
    { id: 2,  title: 'Пыль эпохи',         genre: 'Выживание',   price: 990,  rating: 4.6, pop: 90, hue: 38,  art: 'dune',
      desc: 'Последние урожаи гибнут. Пыльные бури становятся длиннее. Выращивайте, стройте, решайте — остаться или улететь.', tags: ['крафт', 'кооператив', 'песочница'] },
    { id: 3,  title: 'Тессеракт',          genre: 'Головоломки', price: 690,  rating: 4.8, pop: 87, hue: 200, art: 'cube',
      desc: 'Головоломка в пяти измерениях. Время — это просто ещё одно направление, по которому можно пройти.', tags: ['логика', 'инди', 'минимализм'] },
    { id: 4,  title: 'Приливная волна',    genre: 'Экшен',       price: 1290, old: 1790, rating: 4.4, pop: 84, hue: 190, art: 'wave',
      desc: 'Водный мир у гиганта, где каждая волна — высотой с гору. Каждая минута стоит вам лет.', tags: ['экшен', 'паркур', 'открытый мир'] },
    { id: 5,  title: 'Холодная планета',   genre: 'RPG',         price: 1990, rating: 4.7, pop: 82, hue: 210, art: 'planet',
      desc: 'Ледяные облака, застывшие в воздухе, и учёный, который слишком долго был один. Можно ли доверять данным?', tags: ['ролевая', 'выбор', 'нелинейная'] },
    { id: 6,  title: 'Кольца',             genre: 'Симуляторы',  price: 1190, rating: 4.5, pop: 79, hue: 28,  art: 'ring',
      desc: 'Управляйте вращающимся кораблём-кольцом. Стыковка на скорости 68 оборотов в минуту — это не невозможно. Это необходимо.', tags: ['пилотирование', 'физика', 'VR'] },
    { id: 7,  title: 'Червоточина',        genre: 'Экшен',       price: 790,  old: 1190, rating: 4.3, pop: 76, hue: 280, art: 'hole',
      desc: 'Рогалик, в котором каждая попытка — новый прыжок сквозь пространство. Сфера в небе никогда не ведёт в одно и то же место.', tags: ['рогалик', 'динамика', 'процедурная'] },
    { id: 8,  title: 'Дрейф',              genre: 'Гонки',       price: 890,  rating: 4.2, pop: 70, hue: 12,  art: 'planet',
      desc: 'Гонки по орбитам в гравитационных колодцах. Используйте манёвр Оберта, чтобы обогнать соперника — и физику.', tags: ['гонки', 'мультиплеер', 'орбиты'] },
    { id: 9,  title: 'Горизонт событий',   genre: 'Стратегии',   price: 1590, rating: 4.8, pop: 88, hue: 42,  art: 'ring',
      desc: 'Стратегия колонизации на десять тысяч лет. Пока ваши корабли летят, на Земле сменяются поколения.', tags: ['4X', 'пошаговая', 'глубокая'] },
    { id: 10, title: 'Тишина',             genre: 'Хоррор',      price: 590,  rating: 4.1, pop: 64, hue: 0,   art: 'planet',
      desc: 'Заброшенный модуль. Кислорода на шесть часов. Что-то стучит в обшивку — но снаружи вакуум.', tags: ['хоррор', 'выживание', 'звук'] },
    { id: 11, title: 'Станция «Икар»',     genre: 'Симуляторы',  price: 1390, old: 1690, rating: 4.6, pop: 73, hue: 160, art: 'cube',
      desc: 'Постройте орбитальную станцию для всего человечества. Каждая ошибка в расчётах — это чьи-то жизни.', tags: ['строительство', 'менеджмент', 'кооператив'] },
    { id: 12, title: 'Пятое измерение',    genre: 'Головоломки', price: 490,  rating: 4.9, pop: 81, hue: 48,  art: 'dune',
      desc: 'Книжная полка, сквозь которую можно передавать послания в прошлое. Только гравитация. Только азбука Морзе.', tags: ['нарратив', 'короткая', 'эмоциональная'] }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => n.toLocaleString('ru-RU') + ' ₽';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  /* ---------- Процедурные обложки (SVG) ---------- */
  let uid = 0;
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  function cover(g) {
    const r = rng(g.id * 9973 + 7), id = 'c' + (uid++), h = g.hue;
    let stars = '';
    for (let i = 0; i < 60; i++) stars += `<circle cx="${(r()*400).toFixed(1)}" cy="${(r()*300).toFixed(1)}" r="${(r()*1.1+.2).toFixed(2)}" fill="#fff" opacity="${(r()*.7+.1).toFixed(2)}"/>`;
    const defs = `<defs>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h},25%,4%)"/><stop offset="1" stop-color="hsl(${h},35%,9%)"/></linearGradient>
      <radialGradient id="${id}p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="hsl(${h},60%,72%)"/><stop offset=".55" stop-color="hsl(${h},45%,30%)"/><stop offset="1" stop-color="hsl(${h},40%,6%)"/></radialGradient>
      <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="hsl(${h},90%,70%)" stop-opacity=".55"/><stop offset="1" stop-color="hsl(${h},90%,50%)" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}d" x1="0" x2="1"><stop offset="0" stop-color="hsl(${h},90%,60%)" stop-opacity="0"/><stop offset=".5" stop-color="hsl(${h+10},100%,88%)"/><stop offset="1" stop-color="hsl(${h},90%,60%)" stop-opacity="0"/></linearGradient>
    </defs>`;
    let art = '';
    const cx = 160 + r()*80, cy = 120 + r()*50;
    switch (g.art) {
      case 'hole':
        art = `<circle cx="200" cy="150" r="120" fill="url(#${id}g)"/>
          <ellipse cx="200" cy="150" rx="150" ry="16" fill="url(#${id}d)" opacity=".9"/>
          <circle cx="200" cy="150" r="46" fill="none" stroke="hsl(${h+10},100%,85%)" stroke-width="3" opacity=".9"/>
          <circle cx="200" cy="150" r="44" fill="#000"/>
          <path d="M60 150 Q200 168 340 150" stroke="url(#${id}d)" stroke-width="6" fill="none"/>`;
        break;
      case 'ring':
        art = `<circle cx="${cx}" cy="${cy}" r="58" fill="url(#${id}p)"/>
          <ellipse cx="${cx}" cy="${cy}" rx="120" ry="20" fill="none" stroke="hsl(${h},60%,70%)" stroke-opacity=".55" stroke-width="3" transform="rotate(-14 ${cx} ${cy})"/>
          <ellipse cx="${cx}" cy="${cy}" rx="100" ry="15" fill="none" stroke="hsl(${h},60%,80%)" stroke-opacity=".35" stroke-width="1.5" transform="rotate(-14 ${cx} ${cy})"/>`;
        break;
      case 'wave':
        art = `<circle cx="300" cy="70" r="30" fill="url(#${id}p)" opacity=".8"/>
          <path d="M0 230 Q60 225 110 200 Q170 80 230 200 Q290 228 400 222 L400 300 L0 300Z" fill="hsl(${h},40%,14%)"/>
          <path d="M0 250 Q100 240 200 248 T400 244 L400 300 L0 300Z" fill="hsl(${h},45%,7%)"/>
          <path d="M110 200 Q170 80 230 200" stroke="hsl(${h},70%,75%)" stroke-opacity=".5" fill="none"/>`;
        break;
      case 'dune':
        art = `<circle cx="${cx}" cy="140" r="70" fill="url(#${id}g)"/>
          <circle cx="${cx}" cy="150" r="26" fill="hsl(${h},90%,80%)" opacity=".85"/>
          <path d="M0 200 Q100 170 200 195 T400 185 L400 300 L0 300Z" fill="hsl(${h},30%,12%)"/>
          <path d="M0 235 Q120 215 240 238 T400 228 L400 300 L0 300Z" fill="hsl(${h},25%,6%)"/>`;
        break;
      case 'cube': {
        const s = 70, o = 26, x = 200 - s/2 - o/2, y = 150 - s/2 - o/2;
        const st = `stroke="hsl(${h},70%,75%)" stroke-opacity=".7" fill="none" stroke-width="1.2"`;
        art = `<circle cx="200" cy="150" r="110" fill="url(#${id}g)" opacity=".7"/>
          <rect x="${x}" y="${y}" width="${s}" height="${s}" ${st}/>
          <rect x="${x+o}" y="${y+o}" width="${s}" height="${s}" ${st}/>
          <path d="M${x} ${y}l${o} ${o}M${x+s} ${y}l${o} ${o}M${x} ${y+s}l${o} ${o}M${x+s} ${y+s}l${o} ${o}" ${st}/>
          <rect x="${x-30}" y="${y-30}" width="${s+o+60}" height="${s+o+60}" ${st} stroke-opacity=".2"/>`;
        break;
      }
      default:
        art = `<circle cx="${cx}" cy="${cy}" r="${70 + r()*20}" fill="url(#${id}p)"/>
          <circle cx="${cx + 110}" cy="${cy - 70}" r="${8 + r()*6}" fill="hsl(${h},20%,60%)" opacity=".6"/>`;
    }
    return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${defs}<rect width="400" height="300" fill="url(#${id}bg)"/>${stars}${art}</svg>`;
  }

  /* ---------- Космос: звёзды + чёрная дыра ---------- */
  const cv = $('#space'), ctx = cv.getContext('2d');
  let W, H, DPR, stars = [], disk = [], fall = 0;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.round(Math.min(700, W * H / 2600));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: Math.random() ** 2 * .9 + .1,
      tw: Math.random() * Math.PI * 2, s: Math.random() * .9 + .3
    }));
  }
  function initDisk() {
    const n = innerWidth < 760 ? 1400 : 2600;
    disk = Array.from({ length: n }, () => {
      const t = Math.random();
      return { r: 1.55 + t ** 1.6 * 3.6, a: Math.random() * Math.PI * 2, j: (Math.random() - .5) * .06, b: Math.random() };
    });
  }

  function blackHole(cx, cy, R, time) {
    const tilt = .14;
    ctx.globalCompositeOperation = 'lighter';
    // мягкое свечение
    const glow = ctx.createRadialGradient(cx, cy, R * .8, cx, cy, R * 6);
    glow.addColorStop(0, 'rgba(255,190,120,.22)');
    glow.addColorStop(.3, 'rgba(255,140,60,.06)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.fillRect(cx - R * 6, cy - R * 6, R * 12, R * 12);

    const front = [];
    for (const p of disk) {
      if (!reduced) p.a += .0022 / Math.pow(p.r, 1.5) * 3;
      const ca = Math.cos(p.a), sa = Math.sin(p.a);
      const heat = 1 - (p.r - 1.55) / 3.6;             // 1 у края, 0 снаружи
      const beam = 1 + .65 * ca;                        // доплеровское усиление
      const al = Math.min(1, (.12 + heat * .7) * beam * (.5 + p.b * .5));
      const x = cx + ca * p.r * R, y = cy + sa * p.r * R * tilt + p.j * R;
      if (sa < 0) dot(x, y, heat, al, R); else front.push([x, y, heat, al]);
      // гравитационная линза: дальняя сторона диска огибает тень сверху и снизу
      if (sa < 0 && p.r < 3.2) {
        const lr = R * (1.12 + (p.r - 1.55) * .28);
        dot(cx + ca * lr, cy - Math.abs(sa) * lr * .98 - (1 - Math.abs(ca)) * R * .05, heat, al * .7, R);
        if (p.b > .55) dot(cx + ca * lr * .96, cy + Math.abs(sa) * lr * .9, heat, al * .22, R);
      }
    }
    // фотонное кольцо + тень
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,225,180,.55)'; ctx.lineWidth = Math.max(1, R * .025); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = '#000'; ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    for (const f of front) dot(f[0], f[1], f[2], f[3], R);
    ctx.globalCompositeOperation = 'source-over';
  }
  function dot(x, y, heat, a, R) {
    const g = 150 + heat * 100 | 0, b = 70 + heat * 150 | 0;
    ctx.fillStyle = `rgba(255,${g},${b},${a.toFixed(3)})`;
    const s = Math.min(3, Math.max(.8, R * .018));
    ctx.fillRect(x, y, s * 1.8, s);
  }

  let last = 0;
  function frame(t) {
    const time = t / 1000;
    ctx.clearRect(0, 0, W, H);
    mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08;

    const mobile = W < 760;
    const base = Math.min(W, H) * (mobile ? .09 : .085);
    const R = base * (1 + fall * fall * 5);
    const cx = (mobile ? W * .5 : W * .66) + (W * .5 - (mobile ? W * .5 : W * .66)) * fall;
    const cy = (mobile ? H * .3 : H * .42) + (H * .5 - (mobile ? H * .3 : H * .42)) * fall;

    // звёзды
    for (const s of stars) {
      if (!reduced) { s.x -= s.z * .08; if (s.x < -10) s.x = W + 10; }
      let x = s.x, y = s.y;
      // гравитация курсора
      const dx = mouse.x - x, dy = mouse.y - y, d = Math.hypot(dx, dy);
      if (d < 260) { const k = (1 - d / 260) ** 2 * 38 * s.z; x += dx / d * k; y += dy / d * k; }
      // линзирование вокруг чёрной дыры
      const bx = x - cx, by = y - cy, bd = Math.hypot(bx, by) || 1;
      if (bd < R * 5) { const push = R * R * 1.4 / bd; x += bx / bd * push; y += by / bd * push; }
      if (Math.hypot(x - cx, y - cy) < R * 1.05) continue;
      const tw = .55 + .45 * Math.sin(time * s.s * 2 + s.tw);
      const a = Math.min(1, s.z * tw);
      if (fall > .05) {
        // при падении звёзды вытягиваются к центру
        const len = fall * fall * 60 * s.z;
        ctx.strokeStyle = `rgba(236,231,221,${a * .8})`; ctx.lineWidth = s.z * 1.2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - bx / bd * len, y - by / bd * len); ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(236,231,221,${a})`;
        ctx.fillRect(x, y, s.z * 1.6, s.z * 1.6);
      }
    }
    // курсор — маленький горизонт
    if (mouse.x > -100) {
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
      g.addColorStop(0, 'rgba(243,194,122,.07)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(mouse.x - 140, mouse.y - 140, 280, 280);
    }
    // после героя дыра растворяется, остаются только звёзды
    const after = Math.max(0, Math.min(1, (scrollY - (hero.offsetHeight - innerHeight)) / (innerHeight * .6)));
    if (after < 1) { ctx.globalAlpha = 1 - after; blackHole(cx, cy, R, time); ctx.globalAlpha = 1; }
    requestAnimationFrame(frame);
  }

  addEventListener('resize', () => { resize(); initDisk(); });
  addEventListener('pointermove', e => { mouse.tx = e.clientX; mouse.ty = e.clientY; if (mouse.x < -100) { mouse.x = e.clientX; mouse.y = e.clientY; } });
  document.addEventListener('pointerleave', () => { mouse.tx = mouse.ty = -9999; mouse.x = mouse.y = -9999; });

  /* ---------- Скролл: падение за горизонт ---------- */
  const hero = $('.hero'), heroText = $('#heroText'), hint = $('#scrollHint');
  function onScroll() {
    const max = hero.offsetHeight - innerHeight;
    fall = Math.max(0, Math.min(1, scrollY / max));
    heroText.style.opacity = Math.max(0, 1 - fall * 2.2);
    heroText.style.transform = `translateY(${-fall * 80}px) scale(${1 - fall * .08})`;
    heroText.style.filter = `blur(${fall * 8}px)`;
    hint.style.opacity = Math.max(0, 1 - fall * 4);
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Замедление времени ---------- */
  const RATE = 7 * 365.25 * 24;               // 1 час = 7 лет
  const total0 = store.get('hz_time', 0);
  const t0 = Date.now();
  const plural = (n, f) => f[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2];
  function tickTime() {
    const sec = total0 + (Date.now() - t0) / 1000;
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    $('#localTime').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const e = sec * RATE, days = e / 86400, y = Math.floor(days / 365.25), d = Math.floor(days % 365.25), h = Math.floor((e / 3600) % 24);
    $('#earthTime').textContent = y > 0
      ? `${y} ${plural(y, ['год', 'года', 'лет'])} ${d} ${plural(d, ['день', 'дня', 'дней'])}`
      : `${d} ${plural(d, ['день', 'дня', 'дней'])} ${h} ч`;
    store.set('hz_time', sec);
  }
  setInterval(tickTime, 250); tickTime();

  const baseTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'Вернитесь… на Земле проходят годы' : baseTitle;
  });

  /* ---------- Каталог ---------- */
  const genres = ['Все', ...new Set(GAMES.map(g => g.genre))];
  let state = { genre: 'Все', q: '', sort: 'pop' };
  let cart = store.get('hz_cart', []).filter(id => GAMES.some(g => g.id === id));

  $('#filters').innerHTML = genres.map(g => `<button class="chip${g === 'Все' ? ' active' : ''}" data-g="${g}">${g}</button>`).join('');
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip').forEach(c => c.classList.toggle('active', c === b));
    state.genre = b.dataset.g; render();
  });
  $('#search').addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); render(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });

  function render() {
    let list = GAMES.filter(g => (state.genre === 'Все' || g.genre === state.genre) &&
      (!state.q || (g.title + ' ' + g.genre + ' ' + g.tags.join(' ')).toLowerCase().includes(state.q)));
    const s = { pop: (a, b) => b.pop - a.pop, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating }[state.sort];
    list.sort(s);
    $('#empty').hidden = list.length > 0;
    $('#grid').innerHTML = list.map((g, i) => `
      <article class="card" data-id="${g.id}" style="transition-delay:${(i % 4) * 80}ms">
        <div class="cover">${cover(g)}${g.old ? `<span class="sale">−${Math.round((1 - g.price / g.old) * 100)}%</span>` : ''}</div>
        <div class="card-body">
          <div class="card-genre">${g.genre}</div>
          <h3 class="card-title">${g.title}</h3>
          <div class="card-foot">
            <div class="price">${fmt(g.price)}${g.old ? `<s>${fmt(g.old)}</s>` : ''}</div>
            <button class="add${cart.includes(g.id) ? ' done' : ''}" data-add="${g.id}" aria-label="В корзину">${cart.includes(g.id) ? '✓' : '+'}</button>
          </div>
        </div>
      </article>`).join('');
    $$('.card').forEach(c => { io.observe(c); bindTilt(c); });
  }

  function bindTilt(card) {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateY(${(px - .5) * 8}deg) rotateX(${(.5 - py) * 8}deg) translateZ(0)`;
      card.style.setProperty('--mx', px * 100 + '%'); card.style.setProperty('--my', py * 100 + '%');
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }

  $('#grid').addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { e.stopPropagation(); toggleCart(+add.dataset.add); return; }
    const card = e.target.closest('.card'); if (card) openModal(+card.dataset.id);
  });

  /* ---------- Модалка ---------- */
  const modal = $('#modal'); let current = null;
  function openModal(id) {
    const g = GAMES.find(x => x.id === id); current = g;
    $('#mCover').innerHTML = cover(g);
    $('#mGenre').textContent = `${g.genre} · ★ ${g.rating}`;
    $('#mTitle').textContent = g.title;
    $('#mDesc').textContent = g.desc;
    $('#mTags').innerHTML = g.tags.map(t => `<li>${t}</li>`).join('');
    $('#mPrice').innerHTML = fmt(g.price) + (g.old ? `<s>${fmt(g.old)}</s>` : '');
    syncModalBtn();
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
  function syncModalBtn() { if (current) $('#mAdd').textContent = cart.includes(current.id) ? 'В корзине ✓' : 'В корзину'; }
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
  $('#mAdd').addEventListener('click', () => current && toggleCart(current.id));

  /* ---------- Корзина ---------- */
  const drawer = $('#drawer');
  function toggleCart(id) {
    const g = GAMES.find(x => x.id === id);
    if (cart.includes(id)) { cart = cart.filter(x => x !== id); toast(`«${g.title}» покинул грузовой отсек`); }
    else { cart.push(id); toast(`«${g.title}» на борту`); const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    store.set('hz_cart', cart); syncCart();
  }
  function syncCart() {
    const items = cart.map(id => GAMES.find(g => g.id === id));
    $('#cartCount').textContent = items.length;
    $('#cartCount').classList.toggle('on', items.length > 0);
    $('#cartList').innerHTML = items.length ? items.map(g => `
      <li class="cart-item"><div class="thumb">${cover(g)}</div>
        <div><div class="t">${g.title}</div><div class="p">${fmt(g.price)}</div></div>
        <button data-rm="${g.id}" aria-label="Убрать">×</button></li>`).join('')
      : '<li class="cart-empty">Отсек пуст. Как и космос между звёздами.</li>';
    $('#cartTotal').textContent = fmt(items.reduce((s, g) => s + g.price, 0));
    $$('[data-add]').forEach(b => { const on = cart.includes(+b.dataset.add); b.classList.toggle('done', on); b.textContent = on ? '✓' : '+'; });
    syncModalBtn();
  }
  $('#cartList').addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) toggleCart(+b.dataset.rm); });
  $('#cartBtn').addEventListener('click', () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); });
  drawer.addEventListener('click', e => { if (e.target.closest('[data-close-cart]')) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); } });
  $('#checkout').addEventListener('click', () => {
    if (!cart.length) { toast('Сначала выберите мир'); return; }
    cart = []; store.set('hz_cart', cart); syncCart();
    drawer.classList.remove('open');
    toast('Заказ отправлен сквозь червоточину ✦');
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); drawer.classList.remove('open'); } });

  /* ---------- Сигнал ---------- */
  $('#signalForm').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Сигнал принят. Мы на связи.'); });

  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); }

  /* ---------- Звук: органный эмбиент (Web Audio) ---------- */
  let audio = null;
  $('#soundBtn').addEventListener('click', e => {
    const btn = e.currentTarget, on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', on);
    if (on) {
      if (!audio) {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const master = ac.createGain(); master.gain.value = 0;
        const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
        lp.connect(master); master.connect(ac.destination);
        [55, 82.41, 110, 164.81, 220, 329.63].forEach((f, i) => {
          const o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
          o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = (Math.random() - .5) * 8;
          g.gain.value = .06 / (i * .5 + 1);
          lfo.frequency.value = .05 + i * .03; lg.gain.value = g.gain.value * .8;
          lfo.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(lp); o.start(); lfo.start();
        });
        audio = { ac, master };
      }
      audio.ac.resume();
      audio.master.gain.cancelScheduledValues(audio.ac.currentTime);
      audio.master.gain.linearRampToValueAtTime(.5, audio.ac.currentTime + 3);
    } else if (audio) {
      audio.master.gain.cancelScheduledValues(audio.ac.currentTime);
      audio.master.gain.linearRampToValueAtTime(0, audio.ac.currentTime + 1.2);
    }
  });

  /* ---------- Старт ---------- */
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .15 });
  $$('.reveal').forEach(el => rio.observe(el));
  resize(); initDisk(); onScroll(); render(); syncCart();
  requestAnimationFrame(frame);
})();
