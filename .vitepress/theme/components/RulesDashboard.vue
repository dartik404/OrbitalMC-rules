<script setup>
import { ref, computed, onMounted } from 'vue'

const currentMode = ref('smp')

const switchMode = (mode) => {
  currentMode.value = mode
  toastText.value = mode === 'smp' ? 'Режим изменен: SMP (Классическое выживание)' : 'Режим изменен: GRIEF (Свободные сражения)'
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2500)
}

const smpSections = [
  {
    id: 'discord',
    title: 'Раздел 1. Правила общения в Discord',
    desc: 'Регламент взаимодействия на официальном Discord-сервере проекта.',
    icon: 'discord',
    rules: [
      { id: '1.1', name: 'Спам', desc: 'Отправка трех и более однотипных сообщений в течение одной минуты.', punishment: 'Мут на 30 минут', severity: 'mute-low' },
      { id: '1.2', name: 'Оскорбления игроков', desc: 'Прямые или завуалированные оскорбления участников сервера, токсичное поведение.', punishment: 'Мут на 1 час', severity: 'mute' },
      { id: '1.3', name: 'Запрещенный контент', desc: 'Публикация медиафайлов, ссылок, стикеров или GIF-анимаций политического характера, а также материалов с рейтингом 18+ и шок-контента.', punishment: 'Мут на 1 день', severity: 'mute-high' },
      { id: '1.4', name: 'Реклама', desc: 'Упоминание или публикация ссылок на сторонние проекты, серверы или ресурсы, не относящиеся к OrbitalMC.', punishment: 'Мут на 1 день', severity: 'mute-high' },
      { id: '1.5', name: 'Оскорбление проекта/сервера', desc: 'Публичное неуважительное отношение, оскорбления, токсичная критика или клевета в адрес проекта OrbitalMC, его персонала и администрации.', punishment: 'Мут на 1 день / Блокировка от 3 до 7 дней', severity: 'mute-high' }
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
      { id: '2.6', name: 'Оскорбление проекта/сервера', desc: 'Публичная критика или упоминание сервера, администрации или проекта в унизительной, оскорбительной или деструктивной форме.', punishment: 'Мут на 4 часа / Блокировка от 1 до 3 дней', severity: 'mute-high' },
      { id: '2.7', name: 'Реклама', desc: 'Упоминание сторонних серверов или сервисов.', punishment: 'Мут на 4 часа', severity: 'mute-med' }
    ]
  },
  {
    id: 'gameplay',
    title: 'Раздел 3. Правила игрового процесса (SMP)',
    desc: 'Регулирование честной игры, экономики и безопасности на сервере SMP.',
    icon: 'gameplay',
    rules: [
      { id: '3.1', name: 'Использование запрещенного ПО', desc: 'Строго запрещено использование любых сторонних программ, модификаций, скриптов или инъекций, предоставляющих несправедливое преимущество перед другими игроками. Это включает (но не ограничивается) автоматизацию действий, получение скрытой информации об игровом мире, вмешательство в механики боя, передвижения и взаимодействия с окружением.', punishment: 'Блокировка по IP до 15 дней', severity: 'ban-high' },
      { id: '3.2', name: 'Хранение запрещенного ПО', desc: 'Хранение читов и стороннего ПО на персональном компьютере разрешено исключительно для версий Minecraft ниже 1.21.11. Уточнение: В случае обнаружения подобного ПО при проверке, проверяющий обязан проанализировать логи и активность. Если будет доказан факт использования данного софта на сервере OrbitalMC — выдается блокировка.', punishment: 'Блокировка по IP до 15 дней (при доказанном факте использования)', severity: 'ban-high' },
      { id: '3.3', name: 'Использование уязвимостей (Багоюз)', desc: 'Намеренное использование недоработок сервера, плагинов или ванильных механик Minecraft для получения выгоды, обхода системных ограничений или дюпа предметов.', punishment: 'Блокировка от 7 до 15 дней', severity: 'ban-med' },
      { id: '3.4', name: 'Вредительство и угроза стабильности', desc: 'Создание лаг-машин, намеренный вызов критических ошибок (краш), использование уязвимостей, разрушающих экономику сервера, и любые другие действия, направленные на дестабилизацию работы оборудования.', punishment: 'Блокировка по IP на 15 дней (с изъятием имущества)', severity: 'ban-high' },
      { id: '3.5', name: 'Некорректный никнейм', desc: 'Использование никнеймов, содержащих ненормативную лексику, оскорбления, рекламу или имитирующих префиксы администрации проекта.', punishment: 'Предупреждение / Блокировка до 15 дней', severity: 'warning' },
      { id: '3.6', name: 'Уход от PvP через автоматизированные механизмы', desc: 'Запрещено использовать любые стационарные механизмы, конструкции или уязвимости для автоматической телепортации или выхода из боя во время активного режима PvP (например, стазис-камеры с эндер-жемчугом, активируемые водой, люками или редстоуном).', punishment: 'Блокировка от 3 до 7 дней', severity: 'ban-med' }
    ]
  },
  {
    id: 'checks',
    title: 'Раздел 4. Порядок проведения проверок на стороннее ПО',
    desc: 'Регламент действий при вызове игрока на проверку (Screen-Share / Автоматическая проверка).',
    icon: 'checks',
    rules: [
      { id: '4.1', name: 'Игнорирование вызова или автоматической проверки (ApexGuard)', desc: 'Если вы были вызваны на проверку автоматической системой (уведомление на весь экран) или модератором в чате, вам необходимо строго следовать инструкциям. Игнорирование требований, отсутствие реакции на сообщения или отказ переходить по предоставленной ссылке приравниваются к отказу от проверки.', punishment: 'Блокировка по IP на 15 дней (Приравнивается к отказу)', severity: 'ban-high' },
      { id: '4.2', name: 'Отказ или выход (лив) с проверки', desc: 'Выход с сервера Minecraft (лив), отключение от голосового канала или сервера Discord, обрыв соединения, закрытие программы удаленного доступа (AnyDesk) во время проведения проверки, а также прямой отказ от её прохождения.', punishment: 'Блокировка по IP на 15 дней', severity: 'ban-high' },
      { id: '4.3', name: 'Неадекватное поведение и оскорбления при проверке', desc: 'Неуважительное отношение к проверяющему модератору или администрации, неадекватное поведение, агрессия, провокации, троллинг или создание токсичной атмосферы во время проведения проверки.', punishment: 'Блокировка от 3 до 15 дней / Мут до 5 дней', severity: 'ban-med' },
      { id: '4.4', name: 'Неследование инструкциям администрации и помеха', desc: 'Отказ или намеренное затягивание выполнения законных требований проверяющего модератора, вмешательство в процесс работы, самостоятельное закрытие окон, папок, браузера или завершение процессов в системе без прямого разрешения.', punishment: 'Блокировка по IP на 15 дней', severity: 'ban-high' },
      { id: '4.5', name: 'Отказ от установки диагностического ПО', desc: 'Нежелание скачивать и запускать официальные программы для проверки (ApexGuard, AnyDesk, Process Hacker и др. из утвержденного списка) по требованию модератора.', punishment: 'Блокировка по IP на 15 дней', severity: 'ban-high' },
      { id: '4.6', name: 'Сокрытие улик', desc: 'Очистка корзины, удаление логов Minecraft, истории браузера, недавних файлов или очистка реестра непосредственно перед началом или во время проведения проверки.', punishment: 'Блокировка по IP на 15 дней', severity: 'ban-high' }
    ]
  }
]

const griefSections = [
  {
    id: 'discord',
    title: 'Раздел 1. Правила общения в Discord',
    desc: 'Регламент взаимодействия на официальном Discord-сервере проекта.',
    icon: 'discord',
    rules: smpSections[0].rules
  },
  {
    id: 'chat',
    title: 'Раздел 2. Правила игрового чата',
    desc: 'Регламент общения в текстовом чате внутри Minecraft.',
    icon: 'chat',
    rules: smpSections[1].rules
  },
  {
    id: 'gameplay',
    title: 'Раздел 3. Правила игрового процесса (GRIEF)',
    desc: 'Регулирование честной игры, экономики и безопасности на сервере GRIEF.',
    icon: 'gameplay',
    rules: [
      smpSections[2].rules[0],
      smpSections[2].rules[1],
      smpSections[2].rules[2],
      smpSections[2].rules[3],
      smpSections[2].rules[4],
      smpSections[2].rules[5],
      { id: '3.7', name: 'Гриферство и рейды (GRIEF)', desc: 'В режиме GRIEF разрешены рейды чужих баз, не защищенных приватом, гриферство и свободное PvP в открытом мире. Запрещено только использование багов и уязвимостей для обхода системных приватов.', punishment: 'Игровой процесс / Разрешено', severity: 'warning' }
    ]
  },
  {
    id: 'checks',
    title: 'Раздел 4. Порядок проведения проверок на стороннее ПО',
    desc: 'Регламент действий при вызове игрока на проверку (Screen-Share / Автоматическая проверка).',
    icon: 'checks',
    rules: smpSections[3].rules
  }
]

const currentSections = computed(() => {
  return currentMode.value === 'smp' ? smpSections : griefSections
})

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

const searchQuery = ref('')
const activeSection = ref('all')
const highlightedRule = ref(null)
const toastText = ref('')
const showToast = ref(false)
const searchInputRef = ref(null)

const highlightText = (text) => {
  if (!searchQuery.value) return text;
  const regex = new RegExp(`(${searchQuery.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

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

const filteredSections = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  
  return currentSections.value.map(s => {
    const matchedRules = s.rules.filter(r => 
      r.id.toLowerCase().includes(query) ||
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

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      if (searchInputRef.value) searchInputRef.value.focus()
    }
  })
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

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'discord', name: 'Discord' },
  { id: 'chat', name: 'Чат' },
  { id: 'gameplay', name: 'Игровой процесс' },
  { id: 'checks', name: 'Проверки' },
  { id: 'software', name: 'Софт' }
]

const resetFiltersAndScrollTop = () => {
  searchQuery.value = ''
  activeSection.value = 'all'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="orbital-app-wrapper" :data-mode="currentMode">
    
    <div class="premium-background">
      <div class="grid-layer"></div>
      <div class="glow-orb red-orb"></div>
      <div class="glow-orb blue-orb"></div>
      <div class="vignette"></div>
    </div>

    <header class="top-navbar">
      <div class="navbar-container">
        <div class="navbar-logo" @click="resetFiltersAndScrollTop">
          <span class="logo-text">Orbital<span class="gradient-text">MC</span></span>
          <span class="logo-subtext">Правила</span>
        </div>
        
        <div class="navbar-search">
          <div class="search-wrapper">
            <svg class="search-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              ref="searchInputRef"
              v-model="searchQuery" 
              type="text" 
              placeholder="Поиск..." 
              class="search-input"
            />
            <div class="search-shortcut" v-if="!searchQuery">⌘ K</div>
            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="navbar-server-selector">
          <div class="server-toggle">
            <button 
              :class="['server-btn smp-btn', { active: currentMode === 'smp' }]" 
              @click="switchMode('smp')"
            >
              SMP
            </button>
            <button 
              :class="['server-btn grief-btn', { active: currentMode === 'grief' }]" 
              @click="switchMode('grief')"
            >
              GRIEF
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="app-container">

      <nav class="category-nav">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="['category-btn', { active: activeSection === cat.id }]"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </nav>

      <section class="info-grid">
        <div class="info-card">
          <div class="card-icon-wrapper blue-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="card-text" v-if="currentMode === 'smp'">
            <h3>Режим SMP (Классическое выживание)</h3>
            <p>На сервере ценится <strong>честное выживание, экономика и союзы</strong>.</p>
          </div>
          <div class="card-text" v-else>
            <h3>Режим GRIEF (Свободные сражения)</h3>
            <p>На сервере разрешены <strong>PvP, рейды and гриферство</strong>. Защищайте свои базы приватом и создавайте кланы!</p>
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
            <p>Любые попытки <strong>помехи проверкам, лив или неадекватное поведение</strong> строго наказываются баном по IP.</p>
          </div>
        </div>
      </section>

      <div v-if="searchQuery" class="search-summary">
        Найдено: <span>{{ filteredSections.reduce((sum, s) => sum + s.rules.length, 0) + filteredSoftware.length }}</span>
      </div>

      <main class="rules-main-content">

        <div v-if="filteredSections.length === 0 && filteredSoftware.length === 0" class="no-results">
          <svg class="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h4>Ничего не найдено</h4>
          <p>Попробуйте другой запрос</p>
        </div>

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

    <transition name="toast-fade">
      <div v-if="showToast" class="toast">
        <span>{{ toastText }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>

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
  padding: 94px 20px 30px 20px;
  background-color: var(--bg-base);
  color: var(--c-light-gray);
  font-family: var(--font-sans);
  position: relative;
  overflow-x: hidden;
}

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

h1, h2, h3, h4 { color: var(--c-text); margin: 0; }
p { line-height: 1.5; margin: 0; }

:deep(mark) {
  background: rgba(255, 110, 122, 0.25);
  color: #fff;
  border-radius: 3px;
  padding: 0 2px;
}

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
  mask-image: radial-gradient(circle at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%);
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.25;
}

.red-orb {
  width: 450px; height: 450px;
  background: radial-gradient(circle, var(--c-header) 0%, transparent 70%);
  top: -100px; left: 10%;
}

.blue-orb {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #4A6FFF 0%, transparent 70%);
  bottom: 10%; right: 5%;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 30%, var(--bg-base) 95%);
}

.app-container {
  width: 100%;
  max-width: 900px;
  position: relative;
  z-index: 1;
}

.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(17, 17, 17, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar-container {
  width: 100%;
  max-width: 900px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--c-header) 0%, var(--c-soft-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-subtext {
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
  color: var(--c-mid-gray);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.navbar-search {
  flex: 1;
  max-width: 420px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--c-mid-gray);
}

.search-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 8px 12px 8px 36px;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  background: rgba(0, 0, 0, 0.6);
}

.orbital-app-wrapper[data-mode="smp"] .search-input:focus {
  border-color: rgba(100, 150, 255, 0.5);
  box-shadow: 0 0 10px rgba(100, 150, 255, 0.15);
}

.orbital-app-wrapper[data-mode="grief"] .search-input:focus {
  border-color: rgba(255, 110, 122, 0.5);
  box-shadow: 0 0 10px rgba(255, 110, 122, 0.15);
}

.search-shortcut {
  position: absolute;
  right: 12px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--c-mid-gray);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.clear-search {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--c-mid-gray);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: var(--c-text);
  background: rgba(255, 255, 255, 0.08);
}

.navbar-server-selector {
  display: flex;
  align-items: center;
}

.server-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 3px;
  border-radius: 10px;
}

.server-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--c-mid-gray);
  padding: 6px 14px;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.server-btn:hover {
  color: #fff;
}

.server-btn.active.smp-btn {
  background: rgba(100, 150, 255, 0.12);
  color: #a3c2ff;
  border-color: rgba(100, 150, 255, 0.3);
  box-shadow: 0 0 10px rgba(100, 150, 255, 0.1);
}

.server-btn.active.grief-btn {
  background: rgba(255, 110, 122, 0.12);
  color: #ff9bab;
  border-color: rgba(255, 110, 122, 0.3);
  box-shadow: 0 0 10px rgba(255, 110, 122, 0.1);
}

.category-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 4px 12px 4px;
  margin-bottom: 24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-nav::-webkit-scrollbar {
  display: none;
}

.category-btn {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 8px 18px;
  color: var(--c-mid-gray);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-btn:hover {
  color: var(--c-text);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.category-btn.active {
  color: #ffffff;
}

.orbital-app-wrapper[data-mode="smp"] .category-btn.active {
  background: rgba(100, 150, 255, 0.15);
  border-color: rgba(100, 150, 255, 0.4);
  box-shadow: 0 0 12px rgba(100, 150, 255, 0.15);
}

.orbital-app-wrapper[data-mode="grief"] .category-btn.active {
  background: rgba(255, 110, 122, 0.15);
  border-color: rgba(255, 110, 122, 0.4);
  box-shadow: 0 0 12px rgba(255, 110, 122, 0.15);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
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

.search-summary {
  font-size: 0.85rem; color: var(--c-mid-gray); margin-bottom: 20px; padding-left: 4px;
}
.search-summary span { color: var(--c-text); font-weight: 600; }

.rules-main-content {
  display: flex; flex-direction: column; gap: 40px;
}

.no-results {
  text-align: center; padding: 60px 20px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 16px;
}
.no-results svg { margin: 0 auto 16px; }
.no-results h4 { font-size: 1.2rem; margin-bottom: 6px; }
.no-results p { color: var(--c-mid-gray); font-size: 0.9rem; }

.rules-section {
  scroll-margin-top: 80px;
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
  flex-wrap: wrap;
}

.punishment-label { color: var(--c-mid-gray); }
.punishment-text { font-weight: 600; }

.mute-low { color: var(--c-soft-green); }
.mute, .mute-med { color: #FFE49E; }
.mute-high { color: #FFB86B; }
.ban-med { color: #FF8B8B; }
.ban-high { color: #FF5C5C; text-shadow: 0 0 10px rgba(255,92,92,0.3); }
.warning { color: var(--c-soft-aqua); }

.software-section .section-header { margin-bottom: 24px; }

.mods-card {
  background: linear-gradient(135deg, rgba(212, 255, 211, 0.05) 0%, rgba(0,0,0,0) 100%);
  border: 1px solid rgba(212, 255, 211, 0.2);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
  position: relative;
}

.mods-badge {
  display: inline-block;
  background: rgba(212, 255, 211, 0.15);
  color: var(--c-soft-green);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mods-content h3 { font-size: 1.1rem; margin-bottom: 6px; color: #fff; }
.mods-content p { font-size: 0.9rem; color: var(--c-light-gray); margin-bottom: 12px; }

.important-marker {
  font-size: 0.85rem; font-weight: 600; color: var(--c-soft-green);
  display: flex; align-items: center; gap: 8px;
}
.important-marker::before { content: '✓'; font-weight: 800; }

.software-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.sw-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 16px;
  display: flex; flex-direction: column; justify-content: space-between;
}

.sw-header {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px;
}

.sw-name { font-weight: 700; font-size: 0.95rem; color: #fff; }

.sw-tag {
  font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 4px;
  background: rgba(255,255,255,0.05); color: var(--c-mid-gray);
  white-space: nowrap;
}

.sw-desc { font-size: 0.85rem; color: var(--c-mid-gray); line-height: 1.4; }

.rules-footer {
  margin-top: 60px;
  border-top: 1px solid var(--border-subtle);
  padding-top: 24px;
  text-align: center;
  color: var(--c-mid-gray);
  font-size: 0.85rem;
}

.toast {
  position: fixed;
  bottom: 30px; right: 30px;
  background: #222226;
  border: 1px solid var(--c-header);
  color: #fff;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(255, 110, 122, 0.2);
  z-index: 100;
}

.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(10px); }

@media (max-width: 768px) {
  .orbital-app-wrapper {
    padding: 180px 16px 30px 16px;
  }
  
  .rules-section {
    scroll-margin-top: 175px;
  }
  
  .top-navbar {
    height: auto;
    padding: 14px 0;
  }
  
  .navbar-container {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .navbar-logo {
    justify-content: center;
  }
  
  .navbar-search {
    max-width: 100%;
  }
  
  .navbar-server-selector {
    justify-content: center;
  }
  
  .server-toggle {
    width: 100%;
  }
  
  .server-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
