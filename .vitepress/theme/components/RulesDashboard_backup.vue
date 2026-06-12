<script setup>
import { ref, computed, onMounted } from 'vue'

// Rules database
const sections = [
  {
    id: 'discord',
    title: 'Раздел 1. Правила общения в Discord',
    desc: 'Регламент взаимодействия на официальном Discord-сервере проекта.',
    icon: 'discord',
    rules: [
      { id: '1.1', name: 'Спам', desc: 'Отправка трех и более однотипных сообщений в течение одной минуты.', punishment: 'Мут на 30 минут', severity: 'mute-low' },
      { id: '1.2', name: 'Оскорбления', desc: 'Прямые или завуалированные оскорбления участников сервера, токсичное поведение.', punishment: 'Мут на 1 час', severity: 'mute' },
      { id: '1.3', name: 'Запрещенный контент', desc: 'Публикация медиафайлов, ссылок, стикеров или GIF-анимаций политического характера, а также материалов с рейтингом 18+ и шок-контента.', punishment: 'Мут на 1 день', severity: 'mute-high' },
      { id: '1.4', name: 'Реклама', desc: 'Упоминание или публикация ссылок на сторонние проекты, серверы или ресурсы, не относящиеся к OrbitalMC.', punishment: 'Мут на 1 день', severity: 'mute-high' }
    ]
  },
  {
    id: 'chat',
    title: 'Раздел 2. Правила игрового чата',
    desc: 'Регламент общения в текстовом чате внутри Minecraft.',
    icon: 'chat',
    rules: [
      { id: '2.1', name: 'Спам', desc: 'Отправка трех и более однотипных сообщений в течение минуты.', punishment: 'Мут на 15 минут', severity: 'mute-low' },
      { id: '2.2', name: 'Флуд', desc: 'Публикация бессмысленного потока сообщений или символов.', punishment: 'Мут на 15 минут', severity: 'mute-low' },
      { id: '2.3', name: 'Капс', desc: 'Злоупотребление заглавными буквами в сообщениях (более 50% текста).', punishment: 'Мут на 15 минут', severity: 'mute-low' },
      { id: '2.4', name: 'Оскорбление игроков', desc: 'Унижение чести и достоинства других пользователей.', punishment: 'Мут на 30 минут', severity: 'mute' },
      { id: '2.5', name: 'Оскорбление администрации', desc: 'Неуважительное отношение к представителям команды проекта.', punishment: 'Мут на 1 час', severity: 'mute' },
      { id: '2.6', name: 'Оскорбление проекта', desc: 'Публичная критика сервера в оскорбительной форме.', punishment: 'Мут на 2 часа', severity: 'mute' },
      { id: '2.7', name: 'Реклама', desc: 'Упоминание сторонних серверов или сервисов.', punishment: 'Мут на 4 часа', severity: 'mute-med' }
    ]
  },
  {
    id: 'gameplay',
    title: 'Раздел 3. Правила игрового процесса',
    desc: 'Регулирование честной игры, экономики и безопасности сервера.',
    icon: 'gameplay',
    rules: [
      { id: '3.1', name: 'Использование запрещенного ПО', desc: 'Строго запрещено использование любых сторонних программ, модификаций, скриптов или инъекций, предоставляющих несправедливое преимущество перед другими игроками. Это включает (но не ограничивается) автоматизацию действий, получение скрытой информации об игровом мире, вмешательство в механики боя, передвижения и взаимодействия с окружением.', punishment: 'Блокировка по IP до 15 дней', severity: 'ban-high' },
      { id: '3.2', name: 'Хранение запрещенного ПО', desc: 'Хранение читов и стороннего ПО на персональном компьютере разрешено исключительно для версий Minecraft ниже 1.21.11. Уточнение: В случае обнаружения подобного ПО при проверке, проверяющий обязан проанализировать логи и активность. Если будет доказан факт использования данного софта на сервере OrbitalMC — выдается блокировка.', punishment: 'Блокировка по IP до 15 дней (при доказанном факте использования на сервере)', severity: 'ban-high' },
      { id: '3.3', name: 'Использование уязвимостей (Багоюз)', desc: 'Намеренное использование недоработок сервера, плагинов или ванильных механик Minecraft для получения выгоды, обхода системных ограничений или дюпа предметов.', punishment: 'Блокировка от 7 до 15 дней', severity: 'ban-med' },
      { id: '3.4', name: 'Вредительство и угроза стабильности', desc: 'Создание лаг-машин, намеренный вызов критических ошибок (краш), использование уязвимостей, разрушающих экономику сервера, и любые другие действия, направленные на дестабилизацию работы оборудования.', punishment: 'Блокировка по IP на 15 дней (с возможным изъятием имущества)', severity: 'ban-high' },
      { id: '3.5', name: 'Некорректный никнейм', desc: 'Использование никнеймов, содержащих ненормативную лексику, оскорбления, рекламу или имитирующих префиксы администрации проекта.', punishment: 'Предупреждение / Блокировка до 15 дней', severity: 'warning' }
    ]
  },
  {
    id: 'checks',
    title: 'Раздел 4. Порядок проведения проверок на стороннее ПО',
    desc: 'Регламент действий при вызове игрока на проверку (Screen-Share / Автоматическая проверка).',
    icon: 'checks',
    rules: [
      { id: '4.1', name: 'Автоматическая проверка (ApexGuard)', desc: 'Если вы были вызваны на проверку автоматической системой (на сервере появится соответствующее оповещение на весь экран), вам необходимо: 1. Перейти по предоставленной в чате/оповещении одноразовой ссылке; 2. Скачать официальную утилиту проверки ApexGuard; 3. Запустить программу и строго следовать инструкциям внутри приложения. Игнорирование данного требования приравнивается к отказу от проверки.', punishment: 'Приравнивается к отказу от проверки', severity: 'warning' },
      { id: '4.2', name: 'Отказ или затягивание ручной проверки', desc: 'Превышение выделенного времени на предоставление контактных данных (Discord) или программ для удаленного доступа (AnyDesk), а также игнорирование законных требований проверяющего модератора.', punishment: 'Блокировка по IP на 15 дней', severity: 'ban-high' },
      { id: '4.3', name: 'Отказ от установки диагностического ПО', desc: 'Нежелание скачивать и запускать программы из утвержденного списка (раздел 5) по требованию модератора.', punishment: 'Блокировка по IP на 15 дней', severity: 'ban-high' },
      { id: '4.4', name: 'Помеха проведению проверки', desc: 'Вмешательство в процесс работы модератора, самостоятельное закрытие окон, папок или завершение процессов без прямого разрешения.', punishment: 'Блокировка по IP на 15 дней', severity: 'ban-high' },
      { id: '4.5', name: 'Сокрытие улик', desc: 'Очистка корзины, удаление логов, истории браузера или недавней активности непосредственно перед началом или во время проведения проверки.', punishment: 'Блокировка по IP на 15 дней (приравнивается к использованию запрещенного ПО)', severity: 'ban-high' }
    ]
  }
]

// Approved software database
const softwareList = [
  { name: 'ApexGuard', desc: 'Официальная утилита OrbitalMC для автоматического сканирования сессии и выявления инъекций без участия модератора.', role: 'Авто-проверка', type: 'primary' },
  { name: 'AnyDesk', desc: 'Обеспечение удаленного доступа для проведения ручной проверки модератором.', role: 'Удаленный доступ', type: 'access' },
  { name: 'Everything', desc: 'Утилита для мгновенного глобального поиска файлов в файловой системе ПК.', role: 'Поиск файлов', type: 'utility' },
  { name: 'ShellBag Analyzer', desc: 'Анализ реестра ShellBag для просмотра истории взаимодействия с папками и удаленными файлами.', role: 'Анализ папок', type: 'utility' },
  { name: 'Process Hacker 2', desc: 'Углубленный анализ запущенных процессов, служб, сетевых соединений и скрытых потоков.', role: 'Анализ процессов', type: 'utility' },
  { name: 'USBDeview', desc: 'Мониторинг и вывод истории подключений внешних накопителей и USB-устройств.', role: 'История USB', type: 'utility' },
  { name: 'LastActivityView', desc: 'Просмотр детальной хронологии запуска исполняемых файлов и активности пользователя.', role: 'Активность Windows', type: 'utility' },
  { name: 'ExecutedProgramsList', desc: 'Сбор данных и составление списка всех ранее запускавшихся в системе приложений.', role: 'Запуски ПО', type: 'utility' },
  { name: 'WinPrefetchView', desc: 'Анализ системной папки Prefetch для выявления следов запуска удаленного или скрытого софта.', role: 'Анализ Prefetch', type: 'utility' },
  { name: 'RecentFilesView', desc: 'Просмотр детальной истории недавно открытых или измененных файлов на дисках.', role: 'История файлов', type: 'utility' },
  { name: 'UserAssistView', desc: 'Извлечение системной информации из реестра о запускавшихся файлах .exe.', role: 'Логи реестра', type: 'utility' },
  { name: 'Luyten / Recaf', desc: 'Утилиты для декомпиляции и детального анализа подозрительных модификаций (.jar файлов) на скрытый код.', role: 'Декомпиляция .jar', type: 'utility' }
]

// Interactive state
const searchQuery = ref('')
const activeSection = ref('all')
const highlightedRule = ref(null)
const toastText = ref('')
const showToast = ref(false)

// Highlight text helper
const highlightText = (text) => {
  if (!searchQuery.value) return text;
  const regex = new RegExp(`(${searchQuery.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Clipboard API logic
const copyRule = (id) => {
  const cleanId = id.replace('.', '-')
  const url = `${window.location.origin}${window.location.pathname}#r${cleanId}`
  navigator.clipboard.writeText(url).then(() => {
    toastText.value = `Ссылка на правило ${id} скопирована`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2500)
  }).catch(() => {
    toastText.value = `Ошибка копирования`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2500)
  })
}

// Search & filter computed values
const filteredSections = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  
  return sections.map(s => {
    const matchedRules = s.rules.filter(r => 
      r.id.includes(query) ||
      r.name.toLowerCase().includes(query) ||
      r.desc.toLowerCase().includes(query) ||
      r.punishment.toLowerCase().includes(query)
    )
    return { ...s, rules: matchedRules }
  }).filter(s => {
    const matchesCategory = activeSection.value === 'all' || s.id === activeSection.value
    const hasRules = s.rules.length > 0
    return matchesCategory && (query === '' ? true : hasRules)
  })
})

const filteredSoftware = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const isSoftwareSection = activeSection.value === 'all' || activeSection.value === 'software'
  if (!isSoftwareSection) return []
  
  if (!query) return softwareList
  return softwareList.filter(sw => 
    sw.name.toLowerCase().includes(query) || 
    sw.desc.toLowerCase().includes(query) ||
    sw.role.toLowerCase().includes(query)
  )
})

// Highlight rule from hash on mount
onMounted(() => {
  const handleHashChange = () => {
    const hash = window.location.hash
    if (hash && hash.startsWith('#r')) {
      const ruleId = hash.substring(2)
      const formattedId = ruleId.replace('-', '.')
      highlightedRule.value = formattedId
      
      setTimeout(() => {
        const el = document.getElementById(`r-${ruleId}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 150)
      
      setTimeout(() => {
        highlightedRule.value = null
      }, 4000)
    }
  }

  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
})

const selectCategory = (catId) => {
  activeSection.value = catId
  if (catId !== 'all') {
    setTimeout(() => {
      const el = document.getElementById(`sec-${catId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}
</script>

<template>
  <div class="orbital-app-wrapper">
    <!-- Clean Abstract Grid Background -->
    <div class="premium-background">
      <div class="grid-layer"></div>
      <div class="glow-orb red-orb"></div>
      <div class="glow-orb blue-orb"></div>
      <div class="vignette"></div>
    </div>

    <div class="app-container">
      
      <!-- Compact Header -->
      <header class="hero-section">
        <div class="hero-content">
          <h1 class="main-title">Orbital<span class="gradient-text">MC</span></h1>
          <p class="subtitle">Официальный свод правил игрового сервера</p>
        </div>
      </header>

      <!-- Essential Server Info Cards (Compact) -->
      <section class="info-grid">
        <div class="info-card">
          <div class="card-icon-wrapper blue-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="card-text">
            <h3>Свободные Сражения</h3>
            <p>На сервере разрешены <strong>PvP и гриферство</strong>. Выживание и союзы — часть процесса.</p>
          </div>
        </div>

        <div class="info-card">
          <div class="card-icon-wrapper red-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div class="card-text">
            <h3>Полномочия Администрации</h3>
            <p>Администрация может ограничивать доступ за деструктивные действия вне правил.</p>
          </div>
        </div>
      </section>

      <!-- Premium Search Control Panel -->
      <div class="control-panel">
        <div class="search-wrapper">
          <svg class="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Поиск правил, наказаний или софта..." 
            class="search-input"
          />
          <div class="search-shortcut" v-if="!searchQuery">⌘ K</div>
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav class="navigation-tabs">
          <button :class="['tab-btn', { active: activeSection === 'all' }]" @click="selectCategory('all')">Все</button>
          <button :class="['tab-btn', { active: activeSection === 'discord' }]" @click="selectCategory('discord')">Discord</button>
          <button :class="['tab-btn', { active: activeSection === 'chat' }]" @click="selectCategory('chat')">Чат</button>
          <button :class="['tab-btn', { active: activeSection === 'gameplay' }]" @click="selectCategory('gameplay')">Игровой процесс</button>
          <button :class="['tab-btn', { active: activeSection === 'checks' }]" @click="selectCategory('checks')">Проверки</button>
          <button :class="['tab-btn', { active: activeSection === 'software' }]" @click="selectCategory('software')">Софт</button>
        </nav>
      </div>

      <!-- Search Summary -->
      <div v-if="searchQuery" class="search-summary">
        Найдено: <span>{{ filteredSections.reduce((sum, s) => sum + s.rules.length, 0) + filteredSoftware.length }}</span>
      </div>

      <!-- Main Content -->
      <main class="rules-main-content">
        
        <!-- Empty State -->
        <div v-if="filteredSections.length === 0 && filteredSoftware.length === 0" class="no-results">
          <svg class="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h4>Ничего не найдено</h4>
          <p>Попробуйте другой запрос</p>
        </div>

        <!-- Render Sections -->
        <section 
          v-for="section in filteredSections" 
          :key="section.id" 
          :id="'sec-' + section.id"
          class="rules-section"
        >
          <div class="section-header">
            <h2>{{ section.title }}</h2>
            <p class="section-description">{{ section.desc }}</p>
          </div>

          <div class="rules-list">
            <article 
              v-for="rule in section.rules" 
              :key="rule.id" 
              :id="'r-' + rule.id.replace('.', '-')"
              :class="['rule-card', { 'highlighted-glow': highlightedRule === rule.id }]"
            >
              <div class="rule-header">
                <div class="rule-title">
                  <span class="rule-id" v-html="highlightText(rule.id)"></span>
                  <h3 class="rule-name" v-html="highlightText(rule.name)"></h3>
                </div>
                <button @click="copyRule(rule.id)" class="copy-btn" title="Копировать ссылку">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </button>
              </div>

              <p class="rule-description" v-html="highlightText(rule.desc)"></p>

              <div class="rule-footer">
                <span class="punishment-label">Наказание:</span>
                <span :class="['punishment-text', rule.severity]" v-html="highlightText(rule.punishment)"></span>
              </div>
            </article>
          </div>
        </section>

        <!-- Section 5: Software & Mods Section -->
        <section 
          v-if="filteredSoftware.length > 0 || (searchQuery === '' && (activeSection === 'all' || activeSection === 'software'))"
          id="sec-software" 
          class="rules-section software-section"
        >
          <div class="section-header">
            <h2>Раздел 5. ПО и Модификации</h2>
            <p class="section-description">Регламентированный список разрешенных модификаций и утвержденного ПО для проверок.</p>
          </div>

          <div class="mods-card" v-if="!searchQuery">
            <div class="mods-badge">Разрешено</div>
            <div class="mods-content">
              <h3>Игровые моды и улучшения</h3>
              <p>Разрешены оптимизирующие моды (Sodium, Optifine) и интерфейсные дополнения.</p>
              <div class="important-marker">Использование миникарт полностью разрешено.</div>
            </div>
          </div>

          <div class="software-grid">
            <div v-for="sw in filteredSoftware" :key="sw.name" class="sw-card">
              <div class="sw-header">
                <span class="sw-name" v-html="highlightText(sw.name)"></span>
                <span class="sw-tag" v-html="highlightText(sw.role)"></span>
              </div>
              <p class="sw-desc" v-html="highlightText(sw.desc)"></p>
            </div>
          </div>
        </section>
      </main>

      <footer class="rules-footer">
        <p>&copy; 2026 OrbitalMC. Все права защищены.</p>
      </footer>
    </div>

    <!-- Notification Toast -->
    <transition name="toast-fade">
      <div v-if="showToast" class="toast">
        <span>{{ toastText }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Server Palette Variables */
.orbital-app-wrapper {
  --c-header: #FF6E7A;
  --c-number: #FF9BA7;
  --c-text: #FFFFFF;
  --c-light-gray: #D2D2D2;
  --c-mid-gray: #9B9B9B;
  --c-soft-green: #D4FFD3;
  --c-soft-red: #FFCFCF;
  --c-soft-blue: #D3D6FF;
  --c-soft-aqua: #D3FFF4;
  --c-separator: #3D3D3D;

  --bg-base: #111111;
  --bg-surface: rgba(28, 28, 30, 0.6);
  --bg-surface-hover: rgba(38, 38, 42, 0.8);
  --border-subtle: rgba(255, 255, 255, 0.08);

  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --transition-fast: all 0.2s ease;
  
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 30px 20px;
  background-color: var(--bg-base);
  color: var(--c-light-gray);
  font-family: var(--font-sans);
  position: relative;
  overflow-x: hidden;
}

/* SVG Utilities */
.w-4 { width: 1rem; }
.h-4 { height: 1rem; }
.w-5 { width: 1.25rem; }
.h-5 { height: 1.25rem; }
.w-6 { width: 1.5rem; }
.h-6 { height: 1.5rem; }
.w-10 { width: 2.5rem; }
.h-10 { height: 2.5rem; }
.w-12 { width: 3rem; }
.h-12 { height: 3rem; }

/* Typography and Highlighting */
h1, h2, h3, h4 { color: var(--c-text); margin: 0; }
p { line-height: 1.5; margin: 0; }

:deep(mark) {
  background: rgba(255, 110, 122, 0.25);
  color: #fff;
  border-radius: 3px;
  padding: 0 2px;
}

/* Premium Background */
.premium-background {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background-color: var(--bg-base);
  pointer-events: none;
}

.grid-layer {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
  animation: orbDrift 20s infinite alternate ease-in-out;
}

.red-orb {
  width: 60vw; height: 60vh;
  background: var(--c-header);
  top: -20%; right: -10%;
}

.blue-orb {
  width: 50vw; height: 50vh;
  background: var(--c-soft-blue);
  bottom: -10%; left: -20%;
  animation-delay: -10s;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 40%, var(--bg-base) 100%);
}

@keyframes orbDrift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-50px, 50px); }
}

/* Layout */
.app-container {
  width: 100%;
  max-width: 860px;
  z-index: 1;
  position: relative;
}

/* Compact Hero */
.hero-section {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 20px;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 8px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--c-header) 0%, var(--c-soft-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--c-mid-gray);
  font-size: 1rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 30px;
}

.info-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  gap: 16px;
  backdrop-filter: blur(10px);
}

.card-icon-wrapper {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.blue-icon { background: rgba(211, 214, 255, 0.1); color: var(--c-soft-blue); border: 1px solid rgba(211, 214, 255, 0.2); }
.red-icon { background: rgba(255, 110, 122, 0.1); color: var(--c-header); border: 1px solid rgba(255, 110, 122, 0.2); }

.card-text h3 { font-size: 1rem; margin-bottom: 4px; }
.card-text p { font-size: 0.85rem; color: var(--c-mid-gray); }

/* Control Panel */
.control-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute; left: 16px; color: var(--c-mid-gray);
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 18px 50px;
  color: var(--c-text);
  font-family: var(--font-sans);
  font-size: 1.05rem;
  outline: none;
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-input:focus {
  border-color: var(--c-header);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(255, 110, 122, 0.15), 0 8px 24px rgba(0, 0, 0, 0.3);
  transform: translateY(-1px);
}

.search-shortcut {
  position: absolute; right: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--c-mid-gray);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
}

.clear-search {
  position: absolute; right: 16px;
  background: none; border: none; color: var(--c-mid-gray);
  cursor: pointer; padding: 4px; border-radius: 50%;
}
.clear-search:hover { color: var(--c-text); background: rgba(255,255,255,0.1); }

.navigation-tabs {
  display: flex; flex-wrap: wrap; gap: 8px;
}

.tab-btn {
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 8px 14px;
  color: var(--c-mid-gray);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.tab-btn:hover {
  color: var(--c-text); background: rgba(255,255,255,0.05);
}

.tab-btn.active {
  background: rgba(255, 110, 122, 0.1);
  border-color: var(--c-header);
  color: var(--c-header);
}

/* Lists */
.rules-main-content {
  display: flex; flex-direction: column; gap: 40px;
}

.section-header {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 12px;
}

.section-header h2 { font-size: 1.3rem; margin-bottom: 4px; }
.section-description { font-size: 0.9rem; color: var(--c-mid-gray); }

.rules-list { display: flex; flex-direction: column; gap: 12px; }

.rule-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 18px;
  transition: var(--transition-fast);
}

.rule-card:hover {
  border-color: rgba(255,255,255,0.15);
  background: var(--bg-surface-hover);
}

.rule-card.highlighted-glow {
  border-color: var(--c-header);
  box-shadow: 0 0 20px rgba(255, 110, 122, 0.2);
}

.rule-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.rule-title { display: flex; align-items: center; gap: 10px; }

.rule-id {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-number);
  background: rgba(255, 155, 167, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
}

.rule-name { font-size: 1.05rem; }

.copy-btn {
  background: none; border: none; color: var(--c-mid-gray);
  cursor: pointer; padding: 4px; border-radius: 6px;
}
.copy-btn:hover { color: var(--c-text); background: rgba(255,255,255,0.05); }

.rule-description { font-size: 0.9rem; color: var(--c-light-gray); margin-bottom: 12px; }

.rule-footer {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.85rem;
}

.punishment-label { color: var(--c-mid-gray); }
.punishment-text { font-weight: 600; }

.mute-low { color: var(--c-soft-aqua); }
.mute { color: var(--c-soft-blue); }
.mute-high { color: #f97316; }
.mute-med { color: #f59e0b; }
.warning { color: var(--c-soft-blue); }
.ban-med { color: var(--c-number); }
.ban-high { color: var(--c-header); }

/* Software Section */
.mods-card {
  background: rgba(211, 214, 255, 0.05);
  border: 1px solid rgba(211, 214, 255, 0.2);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
  position: relative;
}

.mods-badge {
  position: absolute; top: 18px; right: 18px;
  background: rgba(212, 255, 211, 0.1);
  color: var(--c-soft-green);
  font-family: var(--font-mono);
  font-size: 0.7rem; font-weight: 600;
  padding: 2px 8px; border-radius: 10px;
}

.mods-content h3 { font-size: 1.1rem; margin-bottom: 6px; }
.mods-content p { font-size: 0.9rem; color: var(--c-mid-gray); margin-bottom: 10px; }

.important-marker {
  display: inline-block;
  background: rgba(255, 255, 255, 0.05);
  border-left: 2px solid var(--c-soft-blue);
  padding: 6px 12px;
  font-size: 0.85rem;
  color: var(--c-light-gray);
  border-radius: 0 6px 6px 0;
}

.software-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}

.sw-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 14px;
}

.sw-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.sw-name { font-weight: 600; color: var(--c-text); font-size: 0.95rem;}
.sw-tag { 
  font-family: var(--font-mono); font-size: 0.7rem; 
  background: rgba(255,255,255,0.05); color: var(--c-mid-gray); 
  padding: 2px 6px; border-radius: 4px;
}

.sw-desc { font-size: 0.85rem; color: var(--c-mid-gray); }

/* Utilities */
.search-summary { font-size: 0.85rem; color: var(--c-mid-gray); margin-bottom: 16px; padding-left: 4px; }
.search-summary span { color: var(--c-header); font-weight: 600; }

.no-results { text-align: center; padding: 40px; color: var(--c-mid-gray); }
.no-results h4 { color: var(--c-text); margin: 10px 0 4px; }

.rules-footer { margin-top: 50px; text-align: center; color: var(--c-mid-gray); font-size: 0.85rem; }

/* Toast */
.toast {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  background: rgba(28, 28, 30, 0.9);
  border: 1px solid var(--border-subtle);
  padding: 10px 20px;
  border-radius: 20px;
  color: var(--c-text);
  font-size: 0.85rem;
  backdrop-filter: blur(10px);
  z-index: 1000;
}
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translate(-50%, 10px); }

@media (max-width: 768px) {
  .info-grid, .software-grid { grid-template-columns: 1fr; }
  .main-title { font-size: 2rem; }
}
</style>
