'use strict';

// ─── DATA ────────────────────────────────────────────────────────────────────

const CLASSES = {
  warrior: {
    name: '전사', icon: '🛡', sprite: '🧔',
    baseStats: { hp: 180, mp: 40, atk: 28, def: 22, spd: 10, crit: 8 },
    growthStats: { hp: 25, mp: 5, atk: 4, def: 4, spd: 1, crit: 0.5 },
    skills: [
      { id: 'slash', name: '강타', icon: '⚔', mpCost: 0, damage: 1.6, type: 'physical', desc: '강력한 일격을 가합니다', target: 'enemy' },
      { id: 'shield', name: '방패막기', icon: '🛡', mpCost: 10, damage: 0, type: 'defense', desc: '다음 공격을 50% 감소', target: 'self', effect: 'shield' },
      { id: 'warcry', name: '전투의 함성', icon: '📢', mpCost: 15, damage: 1.0, type: 'physical', desc: '전체 공격력 +20% (3턴)', target: 'self', effect: 'atkUp' },
      { id: 'cleave', name: '대검 회전', icon: '🌀', mpCost: 20, damage: 2.2, type: 'physical', desc: '회전 강타로 큰 피해를 줍니다', target: 'enemy' },
    ]
  },
  mage: {
    name: '마법사', icon: '✦', sprite: '🧙',
    baseStats: { hp: 100, mp: 120, atk: 38, def: 8, spd: 12, crit: 12 },
    growthStats: { hp: 12, mp: 18, atk: 6, def: 1, spd: 1.5, crit: 1 },
    skills: [
      { id: 'fireball', name: '화염구', icon: '🔥', mpCost: 15, damage: 2.0, type: 'magic', desc: '화염 구체를 발사합니다', target: 'enemy' },
      { id: 'lightning', name: '번개 화살', icon: '⚡', mpCost: 18, damage: 1.8, type: 'magic', desc: '빠른 번개로 공격하고 기절 확률', target: 'enemy', effect: 'stun' },
      { id: 'icewall', name: '빙결', icon: '❄', mpCost: 20, damage: 1.5, type: 'magic', desc: '얼음으로 적을 속박하고 공격', target: 'enemy', effect: 'freeze' },
      { id: 'meteor', name: '메테오', icon: '☄', mpCost: 45, damage: 4.0, type: 'magic', desc: '강력한 메테오로 대폭발을 일으킵니다', target: 'enemy' },
    ]
  },
  rogue: {
    name: '도적', icon: '🗡', sprite: '🥷',
    baseStats: { hp: 130, mp: 70, atk: 32, def: 12, spd: 22, crit: 22 },
    growthStats: { hp: 15, mp: 8, atk: 5, def: 2, spd: 3, crit: 2 },
    skills: [
      { id: 'ambush', name: '기습', icon: '🗡', mpCost: 12, damage: 2.4, type: 'physical', desc: '급소를 노린 치명적 공격', target: 'enemy', crit: true },
      { id: 'poison', name: '독 단검', icon: '🧪', mpCost: 15, damage: 1.2, type: 'physical', desc: '독을 주입해 지속적으로 피해를 줍니다', target: 'enemy', effect: 'poison' },
      { id: 'shadow', name: '은신', icon: '🌑', mpCost: 20, damage: 0, type: 'status', desc: '은신하여 다음 공격 치명타 보장', target: 'self', effect: 'stealth' },
      { id: 'shadowstrike', name: '그림자 참격', icon: '💀', mpCost: 35, damage: 3.5, type: 'physical', desc: '그림자에서 나타나 치명적 피해를 가합니다', target: 'enemy', crit: true },
    ]
  }
};

const ENEMIES = [
  { id: 'goblin', name: '고블린', sprite: '👺', hp: 60, atk: 12, def: 4, spd: 14, exp: 30, gold: [8, 20], lv: 1, bg: 'dungeon1' },
  { id: 'slime', name: '점액 슬라임', sprite: '🟢', hp: 45, atk: 8, def: 8, spd: 6, exp: 20, gold: [5, 12], lv: 1, bg: 'dungeon1' },
  { id: 'bat', name: '피의 박쥐', sprite: '🦇', hp: 50, atk: 18, def: 3, spd: 20, exp: 35, gold: [10, 18], lv: 2, bg: 'dungeon1' },
  { id: 'skeleton', name: '뼈다귀 해골', sprite: '💀', hp: 90, atk: 20, def: 10, spd: 10, exp: 60, gold: [15, 30], lv: 3, bg: 'dungeon2' },
  { id: 'orc', name: '산적 오크', sprite: '👹', hp: 140, atk: 28, def: 16, spd: 8, exp: 90, gold: [25, 50], lv: 5, bg: 'dungeon2' },
  { id: 'wolf', name: '철의 늑대', sprite: '🐺', hp: 110, atk: 24, def: 8, spd: 25, exp: 75, gold: [20, 40], lv: 4, bg: 'forest' },
  { id: 'golem', name: '용암 골렘', sprite: '🗿', hp: 220, atk: 32, def: 30, spd: 5, exp: 150, gold: [50, 80], lv: 7, bg: 'volcano' },
  { id: 'vampire', name: '뱀파이어 경', sprite: '🧛', hp: 180, atk: 35, def: 18, spd: 18, exp: 200, gold: [60, 100], lv: 8, bg: 'castle' },
  { id: 'dragon', name: '고대 드래곤', sprite: '🐉', hp: 500, atk: 55, def: 35, spd: 15, exp: 800, gold: [200, 400], lv: 12, boss: true, bg: 'dragon' },
  { id: 'demon', name: '심연의 악마', sprite: '😈', hp: 350, atk: 48, def: 25, spd: 22, exp: 500, gold: [120, 200], lv: 10, boss: true, bg: 'hell' },
];

const ITEMS = {
  // Weapons
  w_dagger: { id: 'w_dagger', name: '낡은 단검', icon: '🗡', type: 'weapon', rarity: 'common', atk: 8, desc: '낡고 작은 단검. 하지만 없는 것보다는 낫다.', price: 50, sellPrice: 20 },
  w_sword: { id: 'w_sword', name: '철제 검', icon: '⚔', type: 'weapon', rarity: 'uncommon', atk: 18, desc: '견고한 철로 만들어진 표준 검.', price: 200, sellPrice: 80 },
  w_greatsword: { id: 'w_greatsword', name: '강철 대검', icon: '🗡', type: 'weapon', rarity: 'rare', atk: 32, spd: -3, desc: '무겁지만 강력한 대검. 느리지만 치명적이다.', price: 600, sellPrice: 240 },
  w_staff: { id: 'w_staff', name: '마법 지팡이', icon: '🪄', type: 'weapon', rarity: 'uncommon', atk: 14, mp: 30, desc: '마법 에너지가 응축된 지팡이.', price: 220, sellPrice: 88 },
  w_arcane_staff: { id: 'w_arcane_staff', name: '비전 지팡이', icon: '🌟', type: 'weapon', rarity: 'rare', atk: 28, mp: 60, crit: 8, desc: '강력한 마법력이 담긴 고급 지팡이.', price: 700, sellPrice: 280 },
  w_rogue_blade: { id: 'w_rogue_blade', name: '암살자의 단검', icon: '💀', type: 'weapon', rarity: 'epic', atk: 35, crit: 15, spd: 5, desc: '암살을 위해 단조된 날카로운 단검.', price: 1200, sellPrice: 480 },
  w_dragon_sword: { id: 'w_dragon_sword', name: '용의 검', icon: '🔥', type: 'weapon', rarity: 'legendary', atk: 55, crit: 10, desc: '용의 심장으로 단조된 전설의 검.', price: 5000, sellPrice: 2000 },

  // Armor
  a_cloth: { id: 'a_cloth', name: '낡은 옷', icon: '👕', type: 'armor', rarity: 'common', def: 4, desc: '단순한 천으로 만든 옷.', price: 40, sellPrice: 15 },
  a_leather: { id: 'a_leather', name: '가죽 갑옷', icon: '🧥', type: 'armor', rarity: 'uncommon', def: 12, hp: 20, desc: '가죽으로 만든 가벼운 갑옷.', price: 180, sellPrice: 72 },
  a_chainmail: { id: 'a_chainmail', name: '사슬 갑옷', icon: '⛓', type: 'armor', rarity: 'rare', def: 22, hp: 40, desc: '금속 고리를 엮어 만든 갑옷.', price: 550, sellPrice: 220 },
  a_plate: { id: 'a_plate', name: '강판 갑옷', icon: '🛡', type: 'armor', rarity: 'epic', def: 38, hp: 80, spd: -2, desc: '두꺼운 강판으로 만든 최고의 갑옷.', price: 1500, sellPrice: 600 },
  a_robe: { id: 'a_robe', name: '마법사의 로브', icon: '🔮', type: 'armor', rarity: 'rare', def: 10, mp: 50, crit: 5, desc: '마법을 증폭시키는 로브.', price: 480, sellPrice: 192 },
  a_shadow_cloak: { id: 'a_shadow_cloak', name: '그림자 망토', icon: '🌑', type: 'armor', rarity: 'epic', def: 20, crit: 12, spd: 8, desc: '그림자처럼 움직이게 해주는 망토.', price: 1300, sellPrice: 520 },

  // Consumables
  hp_small: { id: 'hp_small', name: '소형 회복약', icon: '🧪', type: 'consumable', rarity: 'common', heal: 50, desc: '50 HP를 회복합니다.', price: 30, sellPrice: 10 },
  hp_medium: { id: 'hp_medium', name: '중형 회복약', icon: '❤️', type: 'consumable', rarity: 'uncommon', heal: 150, desc: '150 HP를 회복합니다.', price: 80, sellPrice: 30 },
  hp_large: { id: 'hp_large', name: '대형 회복약', icon: '💉', type: 'consumable', rarity: 'rare', heal: 400, desc: '400 HP를 회복합니다.', price: 200, sellPrice: 80 },
  mp_potion: { id: 'mp_potion', name: 'MP 포션', icon: '💙', type: 'consumable', rarity: 'uncommon', healMp: 60, desc: '60 MP를 회복합니다.', price: 50, sellPrice: 20 },
  elixir: { id: 'elixir', name: '엘릭서', icon: '✨', type: 'consumable', rarity: 'rare', heal: 999, healMp: 999, desc: 'HP와 MP를 완전히 회복합니다.', price: 500, sellPrice: 200 },
  antidote: { id: 'antidote', name: '해독제', icon: '🌿', type: 'consumable', rarity: 'common', cure: 'poison', desc: '독 상태를 해제합니다.', price: 25, sellPrice: 8 },
  strength_scroll: { id: 'strength_scroll', name: '강화 주문서', icon: '📜', type: 'consumable', rarity: 'rare', buffAtk: 15, buffTurns: 5, desc: '5턴 동안 공격력 +15.', price: 120, sellPrice: 48 },
};

const SHOP_ITEMS = {
  town: ['hp_small', 'hp_medium', 'mp_potion', 'antidote', 'w_dagger', 'a_cloth', 'a_leather'],
  dungeon_shop: ['hp_medium', 'hp_large', 'mp_potion', 'elixir', 'w_sword', 'a_chainmail', 'strength_scroll'],
};

const WORLD_MAP = [
  { id: 'town', name: '출발의 마을', icon: '🏘', x: 25, y: 60, type: 'town', minLv: 1 },
  { id: 'cave', name: '어둠의 동굴', icon: '⛏', x: 42, y: 45, type: 'dungeon', minLv: 1, maxDepth: 5, enemies: ['goblin', 'slime', 'bat'], color: '#2a1a3a' },
  { id: 'forest', name: '저주받은 숲', icon: '🌲', x: 60, y: 35, type: 'dungeon', minLv: 4, maxDepth: 6, enemies: ['wolf', 'skeleton', 'bat'], color: '#1a2a1a' },
  { id: 'ruins', name: '폐허의 성채', icon: '🏰', x: 72, y: 55, type: 'dungeon', minLv: 6, maxDepth: 7, enemies: ['skeleton', 'orc', 'vampire'], color: '#2a1a1a' },
  { id: 'volcano', name: '불의 화산', icon: '🌋', x: 55, y: 72, type: 'dungeon', minLv: 8, maxDepth: 8, enemies: ['golem', 'orc'], color: '#3a1a0a' },
  { id: 'dragon_lair', name: '용의 둥지', icon: '🐉', x: 80, y: 25, type: 'dungeon', minLv: 12, maxDepth: 10, enemies: ['dragon', 'golem'], boss: 'dragon', color: '#1a0a0a' },
];

const DIALOGUES = {
  innkeeper: ['어서오세요! 황금 여관에 오신 것을 환영합니다!', '여기서 충분히 쉬어 가세요. 몸이 완전히 회복될 겁니다.', '세상은 넓고 위험합니다. 잘 준비하고 나서세요.'],
  shopkeeper: ['안녕하세요! 제 물건들을 구경해 보세요.', '최고의 품질만을 취급합니다!', '모험에 필요한 건 다 있답니다.'],
  blacksmith: ['새로운 무기가 필요하신가요? 지금은 재고가 없네요...', '곧 새 장비들이 들어올 거예요. 나중에 또 오세요!', '이 검은 직접 단조한 겁니다. 최고의 품질이죠.'],
  guild: ['모험가 길드에 오신 것을 환영합니다!', '새로운 의뢰가 들어오고 있습니다.', '실력을 갈고 닦아 강한 적들에게 도전해 보세요!'],
};

const DUNGEON_EVENTS = [
  { type: 'battle', weight: 45 },
  { type: 'treasure', weight: 20 },
  { type: 'trap', weight: 15 },
  { type: 'rest', weight: 10 },
  { type: 'nothing', weight: 10 },
];

const BG_COLORS = {
  dungeon1: 'linear-gradient(180deg, #0e0a18 0%, #1a1028 50%, #0e0a18 100%)',
  dungeon2: 'linear-gradient(180deg, #1a0a0a 0%, #281a1a 50%, #1a0a0a 100%)',
  forest: 'linear-gradient(180deg, #0a1408 0%, #142010 50%, #0a1408 100%)',
  volcano: 'linear-gradient(180deg, #2a0a04 0%, #400e06 50%, #2a0a04 100%)',
  castle: 'linear-gradient(180deg, #0e0e1e 0%, #1a1a2e 50%, #0e0e1e 100%)',
  dragon: 'linear-gradient(180deg, #1a0404 0%, #280808 50%, #1a0404 100%)',
  hell: 'linear-gradient(180deg, #200004 0%, #3a0008 50%, #200004 100%)',
};

// ─── ACCOUNT SYSTEM ──────────────────────────────────────────────────────────

const ACCOUNTS_KEY = 'shadowChroniclesAccounts';

function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}'); }
  catch { return {}; }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function authLogin(username, password) {
  const username_trim = username.trim();
  if (!username_trim) return '아이디를 입력해주세요.';
  if (!password) return '비밀번호를 입력해주세요.';
  const accounts = getAccounts();
  if (!accounts[username_trim]) return '존재하지 않는 아이디입니다.';
  if (accounts[username_trim].password !== password) return '비밀번호가 틀렸습니다.';
  return null;
}

function authSignup(username, password, passwordConfirm) {
  const u = username.trim();
  if (!u || u.length < 2 || u.length > 12) return '아이디는 2~12자여야 합니다.';
  if (!/^[a-zA-Z0-9가-힣_]+$/.test(u)) return '아이디에 특수문자를 사용할 수 없습니다.';
  if (!password || password.length < 4) return '비밀번호는 4자 이상이어야 합니다.';
  if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다.';
  const accounts = getAccounts();
  if (accounts[u]) return '이미 사용 중인 아이디입니다.';
  accounts[u] = { password, saveData: null };
  saveAccounts(accounts);
  return null;
}

function checkUsernameAvailable(username) {
  const u = username.trim();
  if (!u) return { ok: false, msg: '' };
  if (u.length < 2) return { ok: false, msg: '2자 이상 입력해주세요' };
  if (u.length > 12) return { ok: false, msg: '12자 이하로 입력해주세요' };
  if (!/^[a-zA-Z0-9가-힣_]+$/.test(u)) return { ok: false, msg: '특수문자 불가' };
  const accounts = getAccounts();
  if (accounts[u]) return { ok: false, msg: '이미 사용 중인 아이디입니다' };
  return { ok: true, msg: '사용 가능한 아이디입니다 ✓' };
}

// ─── GAME STATE ──────────────────────────────────────────────────────────────

let G = {
  hero: null,
  inventory: [],
  equipped: { weapon: null, armor: null },
  gold: 0,
  currentPanel: 'worldMap',
  currentDungeon: null,
  dungeonDepth: 0,
  battle: null,
  buffs: [],
  statuses: [],
  currentUser: null,
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const $ = id => document.getElementById(id);
const pct = (cur, max) => clamp((cur / max) * 100, 0, 100);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = '';
  });
  const el = $(id);
  el.style.display = 'flex';
  requestAnimationFrame(() => el.classList.add('active'));
}

function showPanel(id) {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
  $(id).classList.add('active');
  G.currentPanel = id;
  if (id === 'worldMap') startMapLoop();
}

function openModal(id) { $(id).classList.add('open'); }
function closeModal(id) { $(id).classList.remove('open'); }
function openPopup(id) { $(id).classList.add('open'); }
function closePopup(id) { $(id).classList.remove('open'); }

function notify(msg, color = null) {
  const n = document.createElement('div');
  n.className = 'notification';
  n.textContent = msg;
  if (color) n.style.borderLeftColor = color;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3500);
}

function spawnDamageNumber(text, x, y, color = '#ff4040') {
  const el = document.createElement('div');
  el.className = 'damage-number';
  el.style.cssText = `left:${x}px;top:${y}px;color:${color};font-size:${Math.abs(parseInt(text)) > 99 ? '2rem' : '1.5rem'};`;
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// ─── TITLE PARTICLES ─────────────────────────────────────────────────────────

function initParticles() {
  const container = $('titleParticles');
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = rand(0, 100) + '%';
    p.style.animationDelay = rand(0, 8) + 's';
    p.style.animationDuration = rand(6, 14) + 's';
    p.style.width = p.style.height = rand(2, 5) + 'px';
    p.style.background = ['#f0c040','#c060ff','#4080ff','#40d0ff'][rand(0,3)];
    container.appendChild(p);
  }
}

// ─── HERO MANAGEMENT ─────────────────────────────────────────────────────────

function createHero(className, name) {
  const cls = CLASSES[className];
  const stats = { ...cls.baseStats };
  return {
    name: name || cls.name,
    class: className,
    className: cls.name,
    icon: cls.icon,
    sprite: cls.sprite,
    level: 1,
    exp: 0,
    expNext: 100,
    hp: stats.hp,
    maxHp: stats.hp,
    mp: stats.mp,
    maxMp: stats.mp,
    atk: stats.atk,
    def: stats.def,
    spd: stats.spd,
    crit: stats.crit,
    sp: 0,
    skills: cls.skills,
  };
}

function getHeroEffectiveStats() {
  const h = G.hero;
  let atk = h.atk, def = h.def, spd = h.spd, crit = h.crit, hp = h.maxHp, mp = h.maxMp;
  const w = G.equipped.weapon ? ITEMS[G.equipped.weapon] : null;
  const a = G.equipped.armor ? ITEMS[G.equipped.armor] : null;
  if (w) { atk += w.atk || 0; mp += w.mp || 0; crit += w.crit || 0; spd += w.spd || 0; }
  if (a) { def += a.def || 0; hp += a.hp || 0; mp += a.mp || 0; crit += a.crit || 0; spd += a.spd || 0; }
  for (const b of G.buffs) {
    if (b.atkUp) atk = Math.round(atk * (1 + b.atkUp));
  }
  return { atk, def, spd, crit, maxHp: hp, maxMp: mp };
}

function gainExp(amount) {
  G.hero.exp += amount;
  if (G.hero.exp >= G.hero.expNext) levelUp();
  updateHUD();
}

function levelUp() {
  G.hero.exp -= G.hero.expNext;
  G.hero.level++;
  G.hero.expNext = Math.floor(100 * Math.pow(1.35, G.hero.level - 1));
  const cls = CLASSES[G.hero.class];
  const g = cls.growthStats;
  const gains = {
    hp: Math.round(g.hp + rand(0, 5)),
    mp: Math.round(g.mp + rand(0, 3)),
    atk: Math.round(g.atk + rand(0, 2)),
    def: Math.round(g.def + rand(0, 1)),
    spd: Math.round(g.spd),
    crit: parseFloat(g.crit.toFixed(1)),
  };
  G.hero.maxHp += gains.hp;
  G.hero.hp = Math.min(G.hero.hp + gains.hp, G.hero.maxHp);
  G.hero.maxMp += gains.mp;
  G.hero.mp = Math.min(G.hero.mp + gains.mp, G.hero.maxMp);
  G.hero.atk += gains.atk;
  G.hero.def += gains.def;
  G.hero.spd += gains.spd;
  G.hero.crit += gains.crit;
  G.hero.sp = (G.hero.sp || 0) + 2;

  $('levelUpText').textContent = `레벨 ${G.hero.level}이 되었습니다!`;
  const sg = $('statGains');
  sg.innerHTML = `
    <div class="gain-item"><span class="gain-value">+${gains.hp}</span><span class="gain-label">HP</span></div>
    <div class="gain-item"><span class="gain-value">+${gains.mp}</span><span class="gain-label">MP</span></div>
    <div class="gain-item"><span class="gain-value">+${gains.atk}</span><span class="gain-label">ATK</span></div>
    <div class="gain-item"><span class="gain-value">+${gains.def}</span><span class="gain-label">DEF</span></div>
  `;
  openPopup('levelUpPopup');
  if (G.hero.exp >= G.hero.expNext) levelUp();
}

// ─── HUD ─────────────────────────────────────────────────────────────────────

function updateHUD() {
  const h = G.hero;
  if (!h) return;
  $('hudHeroName').textContent = h.name;
  $('hudLevel').textContent = `Lv.${h.level}`;
  $('hudHpFill').style.width = pct(h.hp, h.maxHp) + '%';
  $('hudHpText').textContent = `${h.hp}/${h.maxHp}`;
  $('hudMpFill').style.width = pct(h.mp, h.maxMp) + '%';
  $('hudMpText').textContent = `${h.mp}/${h.maxMp}`;
  $('hudExpFill').style.width = pct(h.exp, h.expNext) + '%';
  $('hudExpText').textContent = `${h.exp}/${h.expNext}`;
  $('hudGold').textContent = G.gold;
  $('heroPortrait').textContent = h.sprite;
}

// ─── WORLD MAP — FREE ROAMING ─────────────────────────────────────────────────

const keys = {};
const mapPlayer = { x: 0, y: 0, facing: 1, walkFrame: 0, walkTimer: 0 };
let mapTarget = null;
let mapAnimId = null;
let nearbyLoc = null;
let mapBgCanvas = null;
let mapFrameCount = 0;
let mapPlayerInited = false;

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  // 방향키 페이지 스크롤 방지
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key) && G.currentPanel === 'worldMap') {
    e.preventDefault();
    mapTarget = null;
  }
  // E키로 입장
  if ((e.key === 'e' || e.key === 'E') && G.currentPanel === 'worldMap' && nearbyLoc) {
    enterLocation(nearbyLoc);
  }
});
document.addEventListener('keyup', e => { keys[e.key] = false; });

function initMap() {
  const canvas = $('mapCanvas');
  const W = canvas.parentElement.offsetWidth || 800;
  const H = canvas.parentElement.offsetHeight || 500;
  canvas.width = W;
  canvas.height = H;

  // 최초 1회: 마을 위치 근처에서 시작
  if (!mapPlayerInited) {
    const town = WORLD_MAP[0];
    mapPlayer.x = (town.x / 100) * W;
    mapPlayer.y = (town.y / 100) * H;
    mapPlayerInited = true;
  }

  $('mapLocations').innerHTML = ''; // HTML 마커 제거 (캔버스에서 직접 그림)
  generateMapBackground(canvas);

  // 캔버스 클릭: 클릭 이동 or 근처 장소 입장
  canvas.onclick = (e) => {
    if (G.currentPanel !== 'worldMap') return;
    if (nearbyLoc) { enterLocation(nearbyLoc); return; }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mapTarget = { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  startMapLoop();
}

function generateMapBackground(canvas) {
  mapBgCanvas = document.createElement('canvas');
  mapBgCanvas.width = canvas.width;
  mapBgCanvas.height = canvas.height;
  const ctx = mapBgCanvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // 하늘 그라디언트
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#050810');
  sky.addColorStop(0.45, '#0c1220');
  sky.addColorStop(1, '#121c2c');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  // 성운 빛망울
  [
    [0.2,0.25,0.28,'rgba(70,20,140,0.1)'], [0.75,0.18,0.22,'rgba(20,50,180,0.09)'],
    [0.5,0.65,0.32,'rgba(160,30,30,0.07)'], [0.88,0.55,0.18,'rgba(140,70,10,0.09)'],
    [0.1,0.7,0.2,'rgba(10,80,60,0.08)'],
  ].forEach(([bx,by,br,bc]) => {
    const g = ctx.createRadialGradient(bx*W,by*H,0,bx*W,by*H,br*W);
    g.addColorStop(0, bc); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  });

  // 별
  const prng = n => { let x = Math.sin(n*9301+49297)*233280; return x-Math.floor(x); };
  for (let i = 0; i < 200; i++) {
    const x = prng(i)*W, y = prng(i+100)*H*0.85;
    const r = prng(i+200)*1.6+0.2;
    const a = prng(i+300)*0.6+0.25;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    // 밝은 별에 십자 빛
    if (r > 1.3) {
      ctx.strokeStyle = `rgba(255,255,255,${a*0.4})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x-4,y); ctx.lineTo(x+4,y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x,y-4); ctx.lineTo(x,y+4); ctx.stroke();
    }
  }

  // 산 실루엣 (뒤→앞 순서로)
  const drawMountains = (baseY, col, freqA, freqB, ampA, ampB) => {
    ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 2) {
      const y = baseY - Math.abs(Math.sin(x/freqA))*ampA - Math.abs(Math.sin(x/freqB))*ampB;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W,H); ctx.closePath();
    ctx.fillStyle = col; ctx.fill();
  };
  drawMountains(H*0.52,'rgba(14,18,30,0.8)',180,90,H*0.18,H*0.08);
  drawMountains(H*0.60,'rgba(12,15,24,0.7)',100,55,H*0.12,H*0.06);
  drawMountains(H*0.66,'rgba(10,13,20,0.6)',60,32,H*0.08,H*0.04);

  // 지면
  const grd = ctx.createLinearGradient(0,H*0.68,0,H);
  grd.addColorStop(0,'rgba(12,18,10,0.7)'); grd.addColorStop(1,'rgba(8,12,8,0.9)');
  ctx.fillStyle = grd; ctx.fillRect(0,H*0.68,W,H*0.32);

  // 지면 텍스처 패치
  for (let i = 0; i < 30; i++) {
    const tx = prng(i+400)*W, ty = H*0.7+prng(i+500)*H*0.28, tr = prng(i+600)*70+15;
    const cols = ['rgba(18,28,12,0.35)','rgba(25,15,8,0.28)','rgba(12,18,28,0.28)','rgba(22,12,8,0.3)'];
    const pg = ctx.createRadialGradient(tx,ty,0,tx,ty,tr);
    pg.addColorStop(0,cols[i%4]); pg.addColorStop(1,'transparent');
    ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(tx,ty,tr,0,Math.PI*2); ctx.fill();
  }

  // 위치 간 점선 경로
  ctx.strokeStyle='rgba(200,160,60,0.18)'; ctx.lineWidth=1.5;
  ctx.setLineDash([9,15]);
  [[0,1],[1,2],[2,3],[3,4],[1,3],[2,5]].forEach(([a,b])=>{
    if (b>=WORLD_MAP.length) return;
    ctx.beginPath();
    ctx.moveTo(WORLD_MAP[a].x/100*W, WORLD_MAP[a].y/100*H);
    ctx.lineTo(WORLD_MAP[b].x/100*W, WORLD_MAP[b].y/100*H);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // 지도 테두리
  ctx.strokeStyle='rgba(200,160,60,0.18)'; ctx.lineWidth=3;
  ctx.strokeRect(6,6,W-12,H-12);
  ctx.strokeStyle='rgba(200,160,60,0.08)'; ctx.lineWidth=1;
  ctx.strokeRect(12,12,W-24,H-24);
}

function startMapLoop() {
  if (mapAnimId) cancelAnimationFrame(mapAnimId);
  function loop() {
    if (G.currentPanel !== 'worldMap') { mapAnimId = null; return; }
    updateMapPlayer();
    drawMapFrame();
    mapAnimId = requestAnimationFrame(loop);
  }
  loop();
}

function updateMapPlayer() {
  const canvas = $('mapCanvas');
  const W = canvas.width, H = canvas.height;
  const speed = 2.8;
  let dx = 0, dy = 0, moving = false;

  // 키보드 입력
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) { dx -= speed; mapPlayer.facing = -1; moving = true; mapTarget = null; }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) { dx += speed; mapPlayer.facing = 1; moving = true; mapTarget = null; }
  if (keys['ArrowUp'] || keys['w'] || keys['W']) { dy -= speed; moving = true; mapTarget = null; }
  if (keys['ArrowDown'] || keys['s'] || keys['S']) { dy += speed; moving = true; mapTarget = null; }

  // 클릭 이동
  if (!moving && mapTarget) {
    const tdx = mapTarget.x - mapPlayer.x;
    const tdy = mapTarget.y - mapPlayer.y;
    const tdist = Math.hypot(tdx, tdy);
    if (tdist < 5) { mapTarget = null; }
    else {
      const spd = Math.min(speed, tdist);
      dx = (tdx/tdist)*spd; dy = (tdy/tdist)*spd;
      if (tdx !== 0) mapPlayer.facing = tdx > 0 ? 1 : -1;
      moving = true;
    }
  }

  if (moving) {
    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
    mapPlayer.walkTimer++;
    if (mapPlayer.walkTimer % 10 === 0) mapPlayer.walkFrame = (mapPlayer.walkFrame+1) % 4;
  } else {
    mapPlayer.walkFrame = 0;
  }

  mapPlayer.x = clamp(mapPlayer.x + dx, 18, W - 18);
  mapPlayer.y = clamp(mapPlayer.y + dy, 18, H - 18);

  // 근접 장소 감지
  nearbyLoc = null;
  if (G.hero) {
    WORLD_MAP.forEach(loc => {
      const lx = (loc.x/100)*W, ly = (loc.y/100)*H;
      if (Math.hypot(mapPlayer.x-lx, mapPlayer.y-ly) < 55 && G.hero.level >= loc.minLv) {
        nearbyLoc = loc;
      }
    });
  }
}

function drawMapFrame() {
  const canvas = $('mapCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  mapFrameCount++;

  // 배경 블릿
  if (mapBgCanvas) ctx.drawImage(mapBgCanvas, 0, 0);
  else { ctx.fillStyle='#080a12'; ctx.fillRect(0,0,W,H); }

  // 안개 레이어 (미세 애니메이션)
  const fogAlpha = 0.03 + Math.sin(mapFrameCount*0.003)*0.015;
  ctx.fillStyle = `rgba(8,6,16,${fogAlpha})`;
  ctx.fillRect(0,0,W,H);

  // 장소 마커 렌더링
  WORLD_MAP.forEach((loc, i) => {
    const lx=(loc.x/100)*W, ly=(loc.y/100)*H;
    const locked = G.hero && G.hero.level < loc.minLv;
    const isNear = nearbyLoc === loc;
    const pulse = Math.sin(mapFrameCount*0.065 + i*1.3)*0.5+0.5;

    // 글로우 헤일로
    if (!locked) {
      const glowR = 26 + pulse*13 + (isNear ? 18 : 0);
      const gcArr = isNear ? '240,220,80' : (loc.type==='town' ? '240,192,64' : '220,80,60');
      const gAlpha = 0.12 + pulse*0.13 + (isNear ? 0.18 : 0);
      const grd = ctx.createRadialGradient(lx,ly,0,lx,ly,glowR);
      grd.addColorStop(0,`rgba(${gcArr},${gAlpha+0.1})`);
      grd.addColorStop(0.5,`rgba(${gcArr},${gAlpha})`);
      grd.addColorStop(1,`rgba(${gcArr},0)`);
      ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(lx,ly,glowR,0,Math.PI*2); ctx.fill();
    }

    // 마커 원
    const dotR = locked ? 8 : 11+pulse*2.5;
    ctx.beginPath(); ctx.arc(lx,ly,dotR,0,Math.PI*2);
    if (locked) {
      ctx.fillStyle='#2a2a3c';
    } else {
      const dg = ctx.createRadialGradient(lx-2,ly-2,0,lx,ly,dotR);
      const dc1 = loc.type==='town' ? '#fff8c0' : (isNear ? '#ffff80' : '#ff7070');
      const dc2 = loc.type==='town' ? '#c0900c' : '#801010';
      dg.addColorStop(0,dc1); dg.addColorStop(1,dc2);
      ctx.fillStyle=dg;
    }
    ctx.fill();
    ctx.strokeStyle = locked ? 'rgba(70,70,90,0.5)' : (isNear ? 'rgba(255,255,100,0.95)' : 'rgba(255,255,255,0.3)');
    ctx.lineWidth = locked ? 1 : (isNear ? 2.5 : 1.5);
    ctx.stroke();

    // 아이콘
    ctx.font='14px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(locked ? '🔒' : loc.icon, lx, ly);

    // 이름 레이블
    ctx.shadowColor='rgba(0,0,0,1)'; ctx.shadowBlur=10;
    ctx.font=`bold ${isNear?13:12}px "Noto Serif KR",serif`;
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillStyle = locked ? 'rgba(90,90,110,0.7)' : (isNear ? '#fff4a0' : '#ddd8c0');
    ctx.fillText(loc.name, lx, ly+dotR+4);
    ctx.font='10px serif';
    ctx.fillStyle = locked ? 'rgba(200,80,80,0.75)' : 'rgba(150,140,120,0.8)';
    ctx.fillText(locked ? `🔒 Lv.${loc.minLv} 필요` : (loc.type==='town' ? '🏘 마을' : `⚔ Lv.${loc.minLv}+`), lx, ly+dotR+20);
    ctx.shadowBlur=0;

    // 근처 입장 표시
    if (isNear) {
      const floatY = Math.sin(mapFrameCount*0.12)*4;
      ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=12;
      ctx.font='bold 13px "Noto Serif KR",serif';
      ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.fillStyle='#f5e040';
      ctx.fillText('[ E ] 또는 클릭으로 입장', lx, ly-dotR-6+floatY);
      ctx.shadowBlur=0;
    }
  });

  // 플레이어 스프라이트
  drawPlayerOnMap(ctx);

  // 하단 근처 장소 안내바
  if (nearbyLoc) {
    const barA = 0.82 + Math.sin(mapFrameCount*0.1)*0.08;
    ctx.fillStyle=`rgba(6,5,14,${barA*0.8})`;
    ctx.fillRect(W/2-160, H-44, 320, 32);
    ctx.strokeStyle=`rgba(240,200,60,${barA*0.5})`; ctx.lineWidth=1;
    ctx.strokeRect(W/2-160, H-44, 320, 32);
    ctx.font='bold 13px "Noto Serif KR",serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle=`rgba(245,230,80,${barA})`;
    ctx.fillText(`${nearbyLoc.icon} ${nearbyLoc.name} 근처`, W/2, H-28);
  }

  // 조작 안내 (처음 8초)
  if (mapFrameCount < 480) {
    const a = mapFrameCount < 360 ? 0.72 : 0.72*(1-(mapFrameCount-360)/120);
    ctx.fillStyle=`rgba(6,5,12,${a*0.65})`;
    ctx.fillRect(8, H-30, 380, 22);
    ctx.font='11px "Noto Serif KR",serif';
    ctx.textAlign='left'; ctx.textBaseline='middle';
    ctx.fillStyle=`rgba(165,155,125,${a})`;
    ctx.fillText('WASD / 방향키: 이동  ·  E: 입장  ·  클릭: 이동 또는 입장', 14, H-19);
  }
}

function drawPlayerOnMap(ctx) {
  const px = mapPlayer.x, py = mapPlayer.y;
  const sprite = G.hero ? G.hero.sprite : '🧙';
  const bobs = [0,-4,-7,-4];
  const bob = bobs[mapPlayer.walkFrame] || 0;

  // 발 그림자
  ctx.fillStyle='rgba(0,0,0,0.32)';
  ctx.beginPath(); ctx.ellipse(px, py+14, 11, 4, 0, 0, Math.PI*2); ctx.fill();

  // 오라 글로우
  const aura = ctx.createRadialGradient(px,py,0,px,py,26);
  aura.addColorStop(0,'rgba(80,120,255,0.22)'); aura.addColorStop(1,'transparent');
  ctx.fillStyle=aura; ctx.beginPath(); ctx.arc(px,py,26,0,Math.PI*2); ctx.fill();

  // 스프라이트 이모지 (방향에 따라 좌우 반전)
  ctx.save();
  ctx.font='28px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  if (mapPlayer.facing < 0) {
    ctx.translate(px, py+bob); ctx.scale(-1,1); ctx.fillText(sprite,0,0);
  } else {
    ctx.fillText(sprite, px, py+bob);
  }
  ctx.restore();

  // 이름 태그
  if (G.hero) {
    const nm = G.hero.name;
    ctx.font='bold 11px "Noto Serif KR",serif';
    const tw = ctx.measureText(nm).width;
    ctx.fillStyle='rgba(8,6,18,0.8)';
    ctx.fillRect(px-tw/2-6, py-30+bob, tw+12, 16);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#f0e870';
    ctx.fillText(nm, px, py-22+bob);
  }
}

function enterLocation(loc) {
  mapTarget = null;
  if (loc.type === 'town') {
    $('locationInfo').textContent = `🗺 ${loc.name}`;
    showPanel('townPanel');
  } else if (loc.type === 'dungeon') {
    startDungeon(loc);
  }
}

// ─── TOWN ────────────────────────────────────────────────────────────────────

function initTown() {
  $('locationInfo').textContent = '🏘 출발의 마을';
  $('innBuilding').addEventListener('click', () => openModal('innModal'));
  $('shopBuilding').addEventListener('click', () => openShop('town'));
  $('smithBuilding').addEventListener('click', () => showDialogue('blacksmith', '대장장이'));
  $('guildBuilding').addEventListener('click', () => showDialogue('guild', '길드 마스터'));
  $('leaveBtn').addEventListener('click', () => {
    showPanel('worldMap');
    $('locationInfo').textContent = '🗺 세계 지도';
  });
}

function showDialogue(npcId, npcName) {
  const lines = DIALOGUES[npcId];
  let idx = 0;
  $('npcAvatar').textContent = { blacksmith: '👨‍🔧', guild: '🧙‍♂️', innkeeper: '🧑‍💼', shopkeeper: '🧑‍💼' }[npcId] || '🧑';
  $('npcNameTag').textContent = npcName;
  const show = () => {
    $('dialogueText').textContent = lines[idx];
  };
  show();
  openPopup('dialoguePopup');
  $('dialogueNext').onclick = () => {
    idx++;
    if (idx >= lines.length) { closePopup('dialoguePopup'); return; }
    show();
  };
}

// ─── SHOP ────────────────────────────────────────────────────────────────────

let shopMode = 'buy';

function openShop(shopId) {
  shopMode = 'buy';
  renderShop(shopId);
  $('shopGold').textContent = G.gold;
  openModal('shopModal');

  document.querySelectorAll('#shopModal .tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('#shopModal .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      shopMode = btn.dataset.stab;
      renderShop(shopId);
    };
  });
}

function renderShop(shopId) {
  const container = $('shopItems');
  container.innerHTML = '';
  if (shopMode === 'buy') {
    const itemIds = SHOP_ITEMS[shopId] || SHOP_ITEMS.town;
    itemIds.forEach(id => {
      const item = ITEMS[id];
      const canAfford = G.gold >= item.price;
      const el = document.createElement('div');
      el.className = 'shop-item';
      const statsText = Object.entries(item)
        .filter(([k]) => ['atk','def','hp','mp','crit','spd','heal','healMp'].includes(k))
        .map(([k,v]) => `${k.toUpperCase()}: +${v}`)
        .join(' | ');
      el.innerHTML = `
        <div class="shop-item-icon">${item.icon}</div>
        <div class="shop-item-name" style="color:${rarityColor(item.rarity)}">${item.name}</div>
        <div class="shop-item-desc">${item.desc}</div>
        ${statsText ? `<div class="shop-item-desc">${statsText}</div>` : ''}
        <div class="shop-item-price">💰 ${item.price} 골드</div>
        <button class="shop-buy-btn" ${canAfford ? '' : 'disabled'}>${canAfford ? '구매' : '골드 부족'}</button>
      `;
      el.querySelector('.shop-buy-btn').addEventListener('click', () => {
        if (G.gold >= item.price) {
          G.gold -= item.price;
          addItem(id);
          $('shopGold').textContent = G.gold;
          updateHUD();
          notify(`${item.name}을(를) 구매했습니다!`, 'var(--green)');
          renderShop(shopId);
        }
      });
      container.appendChild(el);
    });
  } else {
    const sellable = G.inventory.filter(slot => slot && slot.qty > 0);
    if (!sellable.length) {
      container.innerHTML = '<p style="color:var(--text-dim);padding:20px;grid-column:1/-1;text-align:center">판매할 아이템이 없습니다</p>';
      return;
    }
    sellable.forEach((slot, i) => {
      const item = ITEMS[slot.id];
      const el = document.createElement('div');
      el.className = 'shop-item';
      el.innerHTML = `
        <div class="shop-item-icon">${item.icon}</div>
        <div class="shop-item-name">${item.name} (${slot.qty})</div>
        <div class="shop-item-price">💰 ${item.sellPrice} 골드</div>
        <button class="shop-buy-btn">판매</button>
      `;
      el.querySelector('.shop-buy-btn').addEventListener('click', () => {
        G.gold += item.sellPrice;
        removeItem(slot.id, 1);
        $('shopGold').textContent = G.gold;
        updateHUD();
        notify(`${item.name}을(를) 판매했습니다! +${item.sellPrice} 골드`, 'var(--gold)');
        renderShop(shopId);
      });
      container.appendChild(el);
    });
  }
}

function rarityColor(r) {
  return { common: '#aaa', uncommon: '#30d030', rare: '#3060ff', epic: '#c040ff', legendary: '#f0c040' }[r] || '#aaa';
}

// ─── INN ─────────────────────────────────────────────────────────────────────

function initInn() {
  $('restBtn').addEventListener('click', () => {
    if (G.gold < 20) { notify('골드가 부족합니다!', 'var(--red)'); return; }
    G.gold -= 20;
    G.hero.hp = G.hero.maxHp;
    G.hero.mp = G.hero.maxMp;
    G.statuses = [];
    G.buffs = [];
    updateHUD();
    closeModal('innModal');
    notify('완전히 회복되었습니다! 🌟', 'var(--green)');
  });
  $('closeInnBtn').addEventListener('click', () => closeModal('innModal'));
  $('closeInn').addEventListener('click', () => closeModal('innModal'));
}

// ─── INVENTORY ───────────────────────────────────────────────────────────────

function addItem(id, qty = 1) {
  const existing = G.inventory.find(s => s && s.id === id);
  if (existing) { existing.qty += qty; return; }
  G.inventory.push({ id, qty });
}

function removeItem(id, qty = 1) {
  const slot = G.inventory.find(s => s && s.id === id);
  if (!slot) return;
  slot.qty -= qty;
  if (slot.qty <= 0) G.inventory = G.inventory.filter(s => s.id !== id);
}

let selectedInvItem = null;

function renderInventory(filterType = 'all') {
  const grid = $('inventoryGrid');
  grid.innerHTML = '';
  const slots = G.inventory.filter(s => {
    if (filterType === 'all') return true;
    return ITEMS[s.id]?.type === filterType;
  });

  const maxSlots = 24;
  for (let i = 0; i < maxSlots; i++) {
    const slot = slots[i];
    const el = document.createElement('div');
    if (slot) {
      const item = ITEMS[slot.id];
      el.className = `inv-slot item-rarity-${item.rarity}`;
      if (selectedInvItem === slot.id) el.classList.add('selected');
      el.innerHTML = `
        <div class="slot-icon">${item.icon}</div>
        <div class="slot-name">${item.name}</div>
        ${slot.qty > 1 ? `<div class="slot-qty">${slot.qty}</div>` : ''}
      `;
      el.addEventListener('click', () => { selectedInvItem = slot.id; renderInventory(filterType); showItemDetail(slot.id); });
    } else {
      el.className = 'inv-slot empty';
    }
    grid.appendChild(el);
  }
}

function showItemDetail(itemId) {
  const item = ITEMS[itemId];
  const isEquipped = G.equipped.weapon === itemId || G.equipped.armor === itemId;
  const statsText = Object.entries(item)
    .filter(([k]) => ['atk','def','hp','mp','crit','spd','heal','healMp'].includes(k))
    .map(([k,v]) => `<span class="item-stat-tag">${k.toUpperCase()} +${v}</span>`)
    .join('');

  let actions = '';
  if (item.type === 'weapon' || item.type === 'armor') {
    actions = `<button class="item-action-btn equip" onclick="toggleEquip('${itemId}')">${isEquipped ? '🔓 해제' : '⚔ 장착'}</button>`;
  } else if (item.type === 'consumable') {
    actions = `<button class="item-action-btn use" onclick="useItem('${itemId}')">💊 사용</button>`;
  }

  $('itemDetail').innerHTML = `
    <div class="item-detail-content">
      <h4 style="color:${rarityColor(item.rarity)}">${item.icon} ${item.name}</h4>
      <p class="item-type">${{ weapon: '⚔ 무기', armor: '🛡 방어구', consumable: '💊 소모품' }[item.type]} · ${item.rarity.toUpperCase()}</p>
      <p class="item-desc">${item.desc}</p>
      <div class="item-stats">${statsText}</div>
      <div class="item-actions">${actions}</div>
    </div>
  `;
}

function toggleEquip(itemId) {
  const item = ITEMS[itemId];
  const slot = item.type === 'weapon' ? 'weapon' : 'armor';
  if (G.equipped[slot] === itemId) {
    G.equipped[slot] = null;
    notify(`${item.name} 해제됨`, 'var(--text-dim)');
  } else {
    G.equipped[slot] = itemId;
    notify(`${item.name} 장착됨!`, 'var(--green)');
  }
  renderEquipped();
  showItemDetail(itemId);
  updateHUD();
}

function useItem(itemId, inBattle = false) {
  const item = ITEMS[itemId];
  const h = G.hero;
  let used = false;
  if (item.heal) {
    const healed = Math.min(item.heal, h.maxHp - h.hp);
    h.hp = Math.min(h.maxHp, h.hp + item.heal);
    notify(`HP +${healed} 회복!`, 'var(--green)');
    used = true;
  }
  if (item.healMp) {
    const healed = Math.min(item.healMp, h.maxMp - h.mp);
    h.mp = Math.min(h.maxMp, h.mp + item.healMp);
    notify(`MP +${healed} 회복!`, 'var(--blue)');
    used = true;
  }
  if (item.cure) {
    G.statuses = G.statuses.filter(s => s.type !== item.cure);
    notify(`${item.cure === 'poison' ? '독' : '상태이상'} 해제!`, 'var(--green)');
    used = true;
  }
  if (item.buffAtk) {
    G.buffs = G.buffs.filter(b => !b.atkUp);
    G.buffs.push({ atkUp: item.buffAtk / 100, turns: item.buffTurns });
    notify(`공격력 +${item.buffAtk} (${item.buffTurns}턴)`, 'var(--gold)');
    used = true;
  }
  if (used) {
    removeItem(itemId, 1);
    updateHUD();
    if (inBattle) updateBattleUI();
    renderInventory();
    renderItemBtns();
  }
}

function renderEquipped() {
  const container = $('equippedItems');
  const slots = [
    { key: 'weapon', label: '무기' },
    { key: 'armor', label: '방어구' },
  ];
  container.innerHTML = slots.map(s => {
    const id = G.equipped[s.key];
    const item = id ? ITEMS[id] : null;
    return `
      <div class="equip-slot">
        <span class="equip-slot-label">${s.label}</span>
        <span class="equip-slot-item">${item ? item.icon : '–'}</span>
        <span class="equip-slot-name">${item ? item.name : '없음'}</span>
      </div>
    `;
  }).join('');
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function renderStats() {
  const h = G.hero;
  const eff = getHeroEffectiveStats();
  $('statsContent').innerHTML = `
    <div class="stats-grid">
      <div class="stat-group">
        <h4>⚔ 기본 정보</h4>
        <div class="stat-row"><span>직업</span><span>${h.className}</span></div>
        <div class="stat-row"><span>레벨</span><span>${h.level}</span></div>
        <div class="stat-row"><span>경험치</span><span>${h.exp} / ${h.expNext}</span></div>
        <div class="stat-row"><span>스킬 포인트</span><span style="color:var(--gold)">${h.sp || 0}</span></div>
      </div>
      <div class="stat-group">
        <h4>💪 전투 스탯</h4>
        <div class="stat-row"><span>HP</span><span>${h.hp} / ${eff.maxHp}</span></div>
        <div class="stat-row"><span>MP</span><span>${h.mp} / ${eff.maxMp}</span></div>
        <div class="stat-row"><span>공격력</span><span>${eff.atk}${eff.atk !== h.atk ? ` <span class="stat-bonus">(+${eff.atk-h.atk})</span>` : ''}</span></div>
        <div class="stat-row"><span>방어력</span><span>${eff.def}${eff.def !== h.def ? ` <span class="stat-bonus">(+${eff.def-h.def})</span>` : ''}</span></div>
        <div class="stat-row"><span>속도</span><span>${eff.spd}</span></div>
        <div class="stat-row"><span>치명타</span><span>${eff.crit}%</span></div>
      </div>
      <div class="stat-group">
        <h4>🎒 장착 중</h4>
        <div class="stat-row"><span>무기</span><span>${G.equipped.weapon ? ITEMS[G.equipped.weapon].name : '없음'}</span></div>
        <div class="stat-row"><span>방어구</span><span>${G.equipped.armor ? ITEMS[G.equipped.armor].name : '없음'}</span></div>
      </div>
      <div class="stat-group">
        <h4>📊 기타</h4>
        <div class="stat-row"><span>보유 골드</span><span style="color:var(--gold)">💰 ${G.gold}</span></div>
        <div class="stat-row"><span>아이템 수</span><span>${G.inventory.length}종</span></div>
        <div class="stat-row"><span>상태</span><span>${G.statuses.length ? G.statuses.map(s=>s.type).join(', ') : '정상'}</span></div>
      </div>
    </div>
  `;
}

// ─── DUNGEON ──────────────────────────────────────────────────────────────────

function startDungeon(loc) {
  G.currentDungeon = loc;
  G.dungeonDepth = 0;
  $('locationInfo').textContent = `⛏ ${loc.name}`;
  $('dungeonBg').style.background = BG_COLORS[loc.bg || 'dungeon1'] || BG_COLORS.dungeon1;
  $('dungeonProgressBar').style.width = '0%';
  $('dungeonProgressText').textContent = '진행: 0%';
  $('dungeonEvents').textContent = `${loc.name}에 들어섰습니다. 어떤 위험이 기다리고 있을까...`;
  $('exploreBtn').disabled = false;
  showPanel('dungeonPanel');
}

function getDungeonEvent() {
  const weights = DUNGEON_EVENTS.map(e => e.weight);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const e of DUNGEON_EVENTS) {
    r -= e.weight;
    if (r <= 0) return e.type;
  }
  return 'battle';
}

function exploreDungeon() {
  const loc = G.currentDungeon;
  G.dungeonDepth++;
  const progress = Math.min((G.dungeonDepth / loc.maxDepth) * 100, 100);
  $('dungeonProgressBar').style.width = progress + '%';
  $('dungeonProgressText').textContent = `진행: ${Math.round(progress)}%`;

  const eventType = getDungeonEvent();
  const eventsEl = $('dungeonEvents');

  if (G.dungeonDepth >= loc.maxDepth) {
    // Dungeon complete
    eventsEl.innerHTML = `<span style="color:var(--gold)">🎉 ${loc.name}을(를) 완전히 탐험했습니다!</span>`;
    const bonusGold = rand(50, 150) * G.hero.level;
    G.gold += bonusGold;
    gainExp(100 * G.hero.level);
    updateHUD();
    $('exploreBtn').disabled = true;
    notify(`던전 완료! +${bonusGold} 골드`, 'var(--gold)');
    return;
  }

  switch (eventType) {
    case 'battle': {
      const enemyIds = loc.enemies;
      const enemyId = G.dungeonDepth === loc.maxDepth - 1 && loc.boss
        ? loc.boss
        : enemyIds[rand(0, enemyIds.length - 1)];
      const baseEnemy = ENEMIES.find(e => e.id === enemyId);
      const scaledEnemy = scaleEnemy(baseEnemy);
      eventsEl.innerHTML = `<span style="color:var(--red)">⚔ ${scaledEnemy.name}이(가) 나타났습니다!</span>`;
      setTimeout(() => startBattle(scaledEnemy), 800);
      break;
    }
    case 'treasure': {
      const possibleItems = ['hp_small', 'hp_medium', 'mp_potion', 'antidote'];
      const found = possibleItems[rand(0, possibleItems.length - 1)];
      const item = ITEMS[found];
      addItem(found);
      const goldFound = rand(10, 50) * G.hero.level;
      G.gold += goldFound;
      updateHUD();
      eventsEl.innerHTML = `<span style="color:var(--gold)">💰 보물 상자를 발견했습니다! ${item.icon} ${item.name}과 ${goldFound} 골드를 획득!</span>`;
      break;
    }
    case 'trap': {
      const eff = getHeroEffectiveStats();
      const dmg = Math.max(5, rand(10, 20) * G.hero.level - eff.def);
      G.hero.hp = Math.max(1, G.hero.hp - dmg);
      updateHUD();
      eventsEl.innerHTML = `<span style="color:var(--red)">🪤 함정에 걸렸습니다! ${dmg} 피해를 받았습니다.</span>`;
      if (G.hero.hp <= 0) { triggerGameOver(); }
      break;
    }
    case 'rest': {
      const healed = Math.round(G.hero.maxHp * 0.15);
      G.hero.hp = Math.min(G.hero.maxHp, G.hero.hp + healed);
      updateHUD();
      eventsEl.innerHTML = `<span style="color:var(--green)">🌿 신비로운 샘물을 발견했습니다! HP +${healed} 회복.</span>`;
      break;
    }
    case 'nothing':
      eventsEl.innerHTML = `<span style="color:var(--text-dim)">🌑 어두운 복도를 조용히 걸었습니다...</span>`;
      break;
  }
}

function scaleEnemy(base) {
  const lvDiff = Math.max(0, G.hero.level - base.lv);
  const scale = 1 + lvDiff * 0.15;
  return {
    ...base,
    hp: Math.round(base.hp * scale),
    maxHp: Math.round(base.hp * scale),
    atk: Math.round(base.atk * scale),
    def: Math.round(base.def * scale),
    exp: Math.round(base.exp * (1 + lvDiff * 0.05)),
    gold: base.gold.map(g => Math.round(g * scale)),
  };
}

// ─── BATTLE SYSTEM ───────────────────────────────────────────────────────────

function startBattle(enemy) {
  G.battle = {
    enemy: { ...enemy, hp: enemy.hp || enemy.maxHp },
    turn: 'player',
    statusEnemy: [],
    round: 0,
  };

  const bg = BG_COLORS[enemy.bg || 'dungeon1'] || BG_COLORS.dungeon1;
  $('battleBg').style.background = bg;
  $('enemySprite').textContent = enemy.sprite;
  $('enemyName').textContent = enemy.name;
  $('heroBattleSprite').textContent = G.hero.sprite;

  updateBattleUI();
  clearBattleLog();
  addLog(`⚔ ${enemy.name}과의 전투 시작!`, 'log-system');

  renderAttackBtns();
  renderSkillBtns();
  renderItemBtns();

  showPanel('battlePanel');
  showTurnIndicator('당신의 차례');
}

function updateBattleUI() {
  const h = G.hero;
  const e = G.battle.enemy;
  const eff = getHeroEffectiveStats();

  $('enemyHpFill').style.width = pct(e.hp, e.maxHp) + '%';
  $('enemyHpText').textContent = `${e.hp}/${e.maxHp}`;
  $('battleHpFill').style.width = pct(h.hp, eff.maxHp) + '%';
  $('battleHpText').textContent = `${h.hp}/${eff.maxHp}`;
  $('battleMpFill').style.width = pct(h.mp, eff.maxMp) + '%';
  $('battleMpText').textContent = `${h.mp}/${eff.maxMp}`;

  // Enemy statuses
  $('enemyStatus').innerHTML = G.battle.statusEnemy.map(s =>
    `<span class="status-icon">${s.type === 'poison' ? '🟢 독' : s.type === 'freeze' ? '❄ 빙결' : s.type === 'stun' ? '⭐ 기절' : s.type}</span>`
  ).join('');

  updateHUD();
}

function clearBattleLog() { $('battleLog').innerHTML = ''; }

function addLog(text, cls = '') {
  const log = $('battleLog');
  const div = document.createElement('div');
  div.className = 'log-entry ' + cls;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function showTurnIndicator(text) {
  const el = $('turnIndicator');
  el.textContent = text;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1200);
}

function renderAttackBtns() {
  $('attackBtns').innerHTML = `
    <button class="action-btn" onclick="playerAction('attack','basic')">⚔ 일반 공격</button>
  `;
}

function renderSkillBtns() {
  const container = $('skillBtns');
  container.innerHTML = '';
  G.hero.skills.forEach(skill => {
    const hasMP = G.hero.mp >= skill.mpCost;
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.disabled = !hasMP;
    btn.innerHTML = `${skill.icon} ${skill.name}${skill.mpCost > 0 ? `<span class="mp-cost">MP ${skill.mpCost}</span>` : ''}`;
    btn.addEventListener('click', () => playerAction('skill', skill.id));
    container.appendChild(btn);
  });
}

function renderItemBtns() {
  const container = $('itemBtns');
  container.innerHTML = '';
  const consumables = G.inventory.filter(s => ITEMS[s.id]?.type === 'consumable');
  if (!consumables.length) {
    container.innerHTML = '<span style="color:var(--text-dim);font-size:0.75rem">소모품 없음</span>';
    return;
  }
  consumables.slice(0, 4).forEach(slot => {
    const item = ITEMS[slot.id];
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.textContent = `${item.icon} ${item.name} (${slot.qty})`;
    btn.addEventListener('click', () => { useItem(slot.id, true); renderItemBtns(); });
    container.appendChild(btn);
  });
}

function setBattleActionsEnabled(enabled) {
  document.querySelectorAll('.action-btn').forEach(btn => {
    if (!enabled) btn.disabled = true;
    else renderSkillBtns(); // re-render with proper mp check
  });
  if (enabled) {
    renderAttackBtns();
    renderItemBtns();
  }
}

async function playerAction(type, id) {
  if (G.battle.turn !== 'player') return;
  G.battle.turn = 'processing';
  setBattleActionsEnabled(false);

  const h = G.hero;
  const e = G.battle.enemy;
  const eff = getHeroEffectiveStats();

  // Check stealth
  const inStealth = G.statuses.find(s => s.type === 'stealth');
  if (inStealth) { G.statuses = G.statuses.filter(s => s.type !== 'stealth'); }

  let dmg = 0, skipEnemy = false;

  if (type === 'attack') {
    const isCrit = Math.random() * 100 < eff.crit || !!inStealth;
    dmg = calcDamage(eff.atk, e.def, isCrit);
    applyDamageToEnemy(dmg, isCrit);
    addLog(`${h.name}이(가) 일반 공격! ${isCrit ? '💥 치명타! ' : ''}${dmg} 피해`, isCrit ? 'log-crit' : 'log-damage');
  } else if (type === 'skill') {
    const skill = h.skills.find(s => s.id === id);
    if (!skill || h.mp < skill.mpCost) { G.battle.turn = 'player'; setBattleActionsEnabled(true); return; }
    h.mp -= skill.mpCost;

    const isCrit = Math.random() * 100 < eff.crit || skill.crit || !!inStealth;

    if (skill.target === 'enemy' && skill.damage > 0) {
      dmg = calcDamage(Math.round(eff.atk * skill.damage), e.def, isCrit);
      applyDamageToEnemy(dmg, isCrit);
      addLog(`${h.name}이(가) ${skill.icon} ${skill.name}! ${isCrit ? '💥 치명타! ' : ''}${dmg} 피해`, isCrit ? 'log-crit' : 'log-skill');
    } else if (skill.target === 'self') {
      addLog(`${h.name}이(가) ${skill.icon} ${skill.name} 사용!`, 'log-skill');
    }

    if (skill.effect === 'shield') { G.statuses.push({ type: 'shield', turns: 1 }); addLog('🛡 방패막기 준비!', 'log-info'); }
    if (skill.effect === 'atkUp') { G.buffs.push({ atkUp: 0.2, turns: 3 }); addLog('📢 공격력 +20% (3턴)!', 'log-info'); }
    if (skill.effect === 'stun') { if (Math.random() < 0.4) { G.battle.statusEnemy.push({ type: 'stun', turns: 1 }); addLog('⭐ 적이 기절했습니다!', 'log-skill'); skipEnemy = true; } }
    if (skill.effect === 'freeze') { if (Math.random() < 0.5) { G.battle.statusEnemy.push({ type: 'freeze', turns: 2 }); addLog('❄ 적이 빙결되었습니다!', 'log-skill'); skipEnemy = true; } }
    if (skill.effect === 'poison') { G.battle.statusEnemy.push({ type: 'poison', turns: 3, dmg: Math.round(eff.atk * 0.3) }); addLog('🟢 독 주입!', 'log-skill'); }
    if (skill.effect === 'stealth') { G.statuses.push({ type: 'stealth' }); addLog('🌑 은신! 다음 공격 치명타 보장.', 'log-skill'); }
  }

  updateBattleUI();
  await delay(400);

  if (checkBattleEnd()) return;

  // Poison tick on enemy
  for (const st of G.battle.statusEnemy) {
    if (st.type === 'poison') {
      const pdmg = st.dmg || 10;
      e.hp = Math.max(0, e.hp - pdmg);
      addLog(`🟢 독 피해: ${pdmg}`, 'log-skill');
    }
  }
  G.battle.statusEnemy = G.battle.statusEnemy
    .map(s => ({ ...s, turns: s.turns - 1 }))
    .filter(s => s.turns > 0);

  updateBattleUI();
  await delay(300);
  if (checkBattleEnd()) return;

  if (!skipEnemy) {
    // Enemy's turn
    showTurnIndicator('적의 차례');
    await delay(600);
    await enemyTurn();
  }

  if (checkBattleEnd()) return;

  // Decrement buffs
  G.buffs = G.buffs.map(b => ({ ...b, turns: b.turns - 1 })).filter(b => b.turns > 0);

  G.battle.round++;
  G.battle.turn = 'player';
  setBattleActionsEnabled(true);
  showTurnIndicator('당신의 차례');
}

function calcDamage(atk, def, crit = false) {
  const base = Math.max(1, atk - def / 2 + rand(-3, 3));
  return crit ? Math.round(base * 1.75) : base;
}

function applyDamageToEnemy(dmg, crit = false) {
  G.battle.enemy.hp = Math.max(0, G.battle.enemy.hp - dmg);
  const sprite = $('enemySprite');
  sprite.classList.remove('shake');
  void sprite.offsetWidth;
  sprite.classList.add('shake');
  const rect = sprite.getBoundingClientRect();
  spawnDamageNumber(crit ? `💥${dmg}` : `-${dmg}`, rect.left + rand(-20, 20), rect.top + rand(-10, 10), crit ? '#f0c040' : '#ff4040');
}

async function enemyTurn() {
  const e = G.battle.enemy;
  const h = G.hero;
  const eff = getHeroEffectiveStats();

  // Check stun/freeze
  const isStunned = G.battle.statusEnemy.find(s => s.type === 'stun' || s.type === 'freeze');
  if (isStunned) {
    addLog(`${e.name}은(는) ${isStunned.type === 'stun' ? '기절' : '빙결'} 상태로 행동할 수 없습니다!`, 'log-enemy');
    return;
  }

  // Enemy attacks
  const hasShield = G.statuses.find(s => s.type === 'shield');
  if (hasShield) G.statuses = G.statuses.filter(s => s.type !== 'shield');

  const isCrit = Math.random() < 0.1;
  let dmg = calcDamage(e.atk, hasShield ? eff.def * 2 : eff.def, isCrit);
  if (hasShield) { dmg = Math.round(dmg * 0.5); addLog('🛡 방패로 공격을 막았습니다!', 'log-info'); }

  h.hp = Math.max(0, h.hp - dmg);
  const sprite = $('heroBattleSprite');
  sprite.classList.remove('shake');
  void sprite.offsetWidth;
  sprite.classList.add('shake');
  const rect = sprite.getBoundingClientRect();
  spawnDamageNumber(`-${dmg}`, rect.left + rand(-10,10), rect.top, '#ff4040');

  addLog(`${e.name}이(가) 공격! ${isCrit ? '💥 치명타! ' : ''}${dmg} 피해`, isCrit ? 'log-crit' : 'log-enemy');

  // Enemy special: boss attacks
  if (e.boss && G.battle.round % 3 === 2) {
    const specialDmg = Math.round(e.atk * 1.8);
    const actualDmg = Math.max(1, specialDmg - eff.def / 2);
    h.hp = Math.max(0, h.hp - actualDmg);
    addLog(`🔥 ${e.name}의 강력한 특수 공격! ${actualDmg} 피해!`, 'log-crit');
  }

  updateBattleUI();
  await delay(200);
}

function checkBattleEnd() {
  const e = G.battle.enemy;
  const h = G.hero;
  if (e.hp <= 0) {
    endBattle('win');
    return true;
  }
  if (h.hp <= 0) {
    endBattle('lose');
    return true;
  }
  return false;
}

function endBattle(result) {
  G.battle.turn = 'over';
  setBattleActionsEnabled(false);

  if (result === 'win') {
    const e = G.battle.enemy;
    const goldGained = rand(e.gold[0], e.gold[1]);
    G.gold += goldGained;

    // Random item drop
    let dropped = null;
    if (Math.random() < 0.3) {
      const drops = ['hp_small', 'hp_medium', 'mp_potion', 'antidote'];
      dropped = drops[rand(0, drops.length - 1)];
      addItem(dropped);
    }

    $('resultIcon').textContent = '🏆';
    $('resultTitle').textContent = '승리!';
    $('resultMessage').textContent = `${e.name}을(를) 쓰러뜨렸습니다!`;
    $('battleRewards').innerHTML = `
      <div class="reward-item"><span class="reward-value">+${e.exp}</span><span class="reward-label">경험치</span></div>
      <div class="reward-item"><span class="reward-value">+${goldGained}💰</span><span class="reward-label">골드</span></div>
      ${dropped ? `<div class="reward-item"><span class="reward-value">${ITEMS[dropped].icon}</span><span class="reward-label">${ITEMS[dropped].name}</span></div>` : ''}
    `;
    $('battleResultContent').style.borderColor = 'var(--gold)';

    gainExp(e.exp);
    updateHUD();
    openPopup('battleResultPopup');

    $('battleResultClose').onclick = () => {
      closePopup('battleResultPopup');
      // Return to dungeon
      if (G.currentDungeon) showPanel('dungeonPanel');
      else showPanel('worldMap');
    };

  } else {
    triggerGameOver();
  }
}

function triggerGameOver() {
  $('gameOverMsg').textContent = `레벨 ${G.hero.level}의 ${G.hero.name}이(가) 쓰러졌습니다...`;
  showScreen('gameOverScreen');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── SAVE / LOAD ─────────────────────────────────────────────────────────────

function saveGame() {
  if (!G.currentUser) return;
  const accounts = getAccounts();
  if (!accounts[G.currentUser]) return;
  accounts[G.currentUser].saveData = {
    hero: G.hero,
    inventory: G.inventory,
    equipped: G.equipped,
    gold: G.gold,
  };
  saveAccounts(accounts);
  notify('게임이 저장되었습니다! 💾', 'var(--gold)');
}

function loadGame() {
  if (!G.currentUser) return false;
  const accounts = getAccounts();
  const user = accounts[G.currentUser];
  if (!user || !user.saveData) return false;
  const data = user.saveData;
  G.hero = data.hero;
  G.inventory = data.inventory || [];
  G.equipped = data.equipped || { weapon: null, armor: null };
  G.gold = data.gold || 0;
  return true;
}

function hasSaveData() {
  if (!G.currentUser) return false;
  const accounts = getAccounts();
  return !!(accounts[G.currentUser]?.saveData);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

function initGame() {
  if (G.currentUser) $('hudUsername').textContent = `👤 ${G.currentUser}`;
  updateHUD();
  initMap();
  initTown();
  initInn();
  showPanel('worldMap');

  // Add starting items
  if (G.inventory.length === 0) {
    addItem('hp_small', 3);
    addItem('mp_potion', 2);
    const cls = G.hero.class;
    if (cls === 'warrior') { addItem('w_dagger'); addItem('a_cloth'); }
    else if (cls === 'mage') { addItem('w_staff'); addItem('a_cloth'); }
    else { addItem('w_dagger'); addItem('a_cloth'); }
  }
}

// ─── EVENT LISTENERS ─────────────────────────────────────────────────────────

// ── Auth screen ──
const loginTab = $('loginTab');
const signupTab = $('signupTab');
const loginForm = $('loginForm');
const signupForm = $('signupForm');

loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  $('loginError').textContent = '';
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  $('signupError').textContent = '';
});

// 아이디 실시간 중복 체크
$('signupUsername').addEventListener('input', () => {
  const val = $('signupUsername').value;
  const checkEl = $('usernameCheck');
  if (!val) { checkEl.textContent = ''; checkEl.className = 'auth-check-msg'; return; }
  const result = checkUsernameAvailable(val);
  checkEl.textContent = result.msg;
  checkEl.className = 'auth-check-msg ' + (result.ok ? 'ok' : 'err');
});

// 엔터키 지원
$('loginPassword').addEventListener('keydown', e => { if (e.key === 'Enter') $('loginBtn').click(); });
$('signupPasswordConfirm').addEventListener('keydown', e => { if (e.key === 'Enter') $('signupBtn').click(); });

$('loginBtn').addEventListener('click', () => {
  const username = $('loginUsername').value.trim();
  const password = $('loginPassword').value;
  const err = authLogin(username, password);
  if (err) {
    $('loginError').textContent = err;
    $('loginError').style.animation = 'none';
    requestAnimationFrame(() => { $('loginError').style.animation = ''; });
    return;
  }
  G.currentUser = username;
  $('loginError').textContent = '';
  $('loginUsername').value = '';
  $('loginPassword').value = '';
  showScreen('startScreen');
  // 불러오기 버튼 표시 여부 업데이트
  $('loadGameBtn').style.display = hasSaveData() ? '' : 'none';
});

$('signupBtn').addEventListener('click', () => {
  const username = $('signupUsername').value;
  const password = $('signupPassword').value;
  const confirm = $('signupPasswordConfirm').value;
  const err = authSignup(username, password, confirm);
  if (err) {
    $('signupError').textContent = err;
    $('signupError').style.animation = 'none';
    requestAnimationFrame(() => { $('signupError').style.animation = ''; });
    return;
  }
  G.currentUser = username.trim();
  $('signupError').textContent = '';
  $('signupUsername').value = '';
  $('signupPassword').value = '';
  $('signupPasswordConfirm').value = '';
  $('usernameCheck').textContent = '';
  notify(`환영합니다, ${G.currentUser}님! 모험을 시작하세요!`, 'var(--gold)');
  showScreen('startScreen');
  $('loadGameBtn').style.display = 'none'; // 새 계정은 저장 없음
});

// ── Start screen ──
$('newGameBtn').addEventListener('click', () => {
  // 이름을 계정 아이디로 고정
  const nameInput = $('heroName');
  nameInput.value = G.currentUser || '';
  nameInput.readOnly = true;
  showScreen('charCreateScreen');
});
$('loadGameBtn').addEventListener('click', () => {
  if (loadGame()) {
    showScreen('gameScreen');
    initGame();
  } else {
    notify('저장된 게임이 없습니다!', 'var(--red)');
  }
});
$('creditsBtn').addEventListener('click', () => {
  notify('Shadow Chronicles v1.0 - Made with ❤ by Claude', 'var(--purple)');
});

// ── Logout ──
$('logoutBtn').addEventListener('click', () => {
  if (!confirm('로그아웃 하시겠습니까? 저장되지 않은 진행 내용은 사라집니다.')) return;
  G.currentUser = null;
  G.hero = null;
  G.inventory = [];
  G.equipped = { weapon: null, armor: null };
  G.gold = 0;
  G.buffs = [];
  G.statuses = [];
  showScreen('authScreen');
});

// Char create
let selectedClass = null;
document.querySelectorAll('.class-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedClass = card.dataset.class;
  });
});

$('startAdventureBtn').addEventListener('click', () => {
  if (!selectedClass) { notify('직업을 선택하세요!', 'var(--red)'); return; }
  const name = G.currentUser || CLASSES[selectedClass].name; // 계정 아이디 고정
  G.hero = createHero(selectedClass, name);
  G.inventory = [];
  G.equipped = { weapon: null, armor: null };
  G.gold = 0;
  G.buffs = [];
  G.statuses = [];
  showScreen('gameScreen');
  initGame();
});

// HUD buttons
$('openInventory').addEventListener('click', () => {
  selectedInvItem = null;
  renderInventory();
  renderEquipped();
  $('itemDetail').innerHTML = '<p class="empty-msg">아이템을 선택하세요</p>';
  document.querySelectorAll('#inventoryModal .tab-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#inventoryModal .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderInventory(btn.dataset.tab);
    });
  });
  openModal('inventoryModal');
});

$('openStats').addEventListener('click', () => { renderStats(); openModal('statsModal'); });
$('saveBtn').addEventListener('click', saveGame);

$('closeInventory').addEventListener('click', () => closeModal('inventoryModal'));
$('closeStats').addEventListener('click', () => closeModal('statsModal'));
$('closeShop').addEventListener('click', () => closeModal('shopModal'));

// Dungeon
$('exploreBtn').addEventListener('click', exploreDungeon);
$('retreatBtn').addEventListener('click', () => {
  if (confirm('던전에서 나가시겠습니까?')) {
    showPanel('worldMap');
    $('locationInfo').textContent = '🗺 세계 지도';
    G.currentDungeon = null;
    G.dungeonDepth = 0;
  }
});

// Battle result
$('levelUpClose').addEventListener('click', () => closePopup('levelUpPopup'));

// Game over
$('respawnBtn').addEventListener('click', () => {
  G.hero.hp = Math.round(G.hero.maxHp * 0.5);
  G.hero.mp = Math.round(G.hero.maxMp * 0.5);
  G.gold = Math.max(0, G.gold - 50);
  G.statuses = [];
  G.buffs = [];
  showScreen('gameScreen');
  showPanel('worldMap');
  updateHUD();
  notify('여관으로 부활했습니다. 골드 -50', 'var(--text-dim)');
});

$('goTitleBtn').addEventListener('click', () => {
  // 타이틀로 돌아가기 (로그인 유지)
  showScreen('startScreen');
  $('loadGameBtn').style.display = hasSaveData() ? '' : 'none';
});

// 리사이즈 시 배경 재생성
window.addEventListener('resize', () => {
  if (G.currentPanel === 'worldMap') {
    mapPlayerInited = true; // 위치 유지
    initMap();
  }
});

// ─── BOOT ─────────────────────────────────────────────────────────────────────

function initParticlesBoth() {
  initParticles(); // title particles
  // auth particles
  const container = $('authParticles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = rand(0, 100) + '%';
    p.style.animationDelay = rand(0, 10) + 's';
    p.style.animationDuration = rand(8, 16) + 's';
    p.style.width = p.style.height = rand(2, 4) + 'px';
    p.style.background = ['#f0c040','#9060ff','#4060ff'][rand(0,2)];
    container.appendChild(p);
  }
}

initParticlesBoth();
showScreen('authScreen');
