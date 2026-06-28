import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEYS = {
  transactions: 'fintrackpro.transactions',
  profile: 'fintrackpro.profile',
  filter: 'fintrackpro.filter',
  page: 'fintrackpro.page',
  authUser: 'fintrackpro.authUser',
  registeredUser: 'fintrackpro.registeredUser',
  resetEmpty: 'fintrackpro.resetEmpty',
}

const categoryOptions = [
  'Food & Dining',
  'Shopping',
  'Recharge & Bills',
  'Petrol & Auto',
  'Utilities',
  'Salary',
  'Entertainment',
  'Other',
]

const defaultProfile = {
  displayName: 'Aarav',
  currency: 'INR',
  theme: 'dark',
}

const defaultForm = {
  type: 'expense',
  description: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  category: 'Food & Dining',
}

const defaultAuthForm = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function formatMoney(amount, currency) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function StatCard({ label, value, caption, tone }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{caption}</span>
    </article>
  )
}

function SectionCard({ title, eyebrow, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel__header">
        <div>
          <p className="panel__eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </header>
      {children}
    </section>
  )
}

function App() {
  const [profile, setProfile] = useState(() => readJSON(STORAGE_KEYS.profile, defaultProfile))
  const [registeredUser, setRegisteredUser] = useState(() => readJSON(STORAGE_KEYS.registeredUser, null))
  const [authUser, setAuthUser] = useState(() => readJSON(STORAGE_KEYS.authUser, null))
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = readJSON(STORAGE_KEYS.transactions, null)

    if (Array.isArray(savedTransactions)) {
      return savedTransactions
    }

    if (localStorage.getItem(STORAGE_KEYS.resetEmpty) === 'true') {
      return []
    }

    return []
  })
  const [filter, setFilter] = useState(() => localStorage.getItem(STORAGE_KEYS.filter) ?? 'all')
  const [page, setPage] = useState(() => localStorage.getItem(STORAGE_KEYS.page) ?? 'dashboard')
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState(defaultAuthForm)
  const [authError, setAuthError] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [formError, setFormError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))
    document.documentElement.dataset.theme = profile.theme
  }, [profile])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
    if (transactions.length > 0) {
      localStorage.removeItem(STORAGE_KEYS.resetEmpty)
    }
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.filter, filter)
  }, [filter])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.page, page)
  }, [page])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(authUser))
  }, [authUser])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.registeredUser, JSON.stringify(registeredUser))
  }, [registeredUser])

  const totals = useMemo(() => {
    return transactions.reduce(
      (accumulator, transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += transaction.amount
        } else {
          accumulator.expense += transaction.amount
        }

        accumulator.count += 1
        return accumulator
      },
      { income: 0, expense: 0, count: 0 },
    )
  }, [transactions])

  const visibleTransactions = useMemo(() => {
    if (filter === 'income') {
      return transactions.filter((transaction) => transaction.type === 'income')
    }

    if (filter === 'expense') {
      return transactions.filter((transaction) => transaction.type === 'expense')
    }

    return transactions
  }, [transactions, filter])

  const chartData = useMemo(() => {
    const grouped = new Map()

    transactions.forEach((transaction) => {
      const current = grouped.get(transaction.date) ?? { income: 0, expense: 0 }
      current[transaction.type] += transaction.amount
      grouped.set(transaction.date, current)
    })

    return [...grouped.entries()]
      .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
      .slice(-6)
      .map(([date, values]) => ({
        date,
        income: values.income,
        expense: values.expense,
      }))
  }, [transactions])

  const chartMax = Math.max(
    1,
    ...chartData.map((point) => Math.max(point.income, point.expense)),
  )

  function openModal() {
    setForm(defaultForm)
    setFormError('')
    setIsModalOpen(true)
  }

  function toggleMenu() {
    setIsMenuOpen((current) => !current)
  }

  function navigateTo(nextPage) {
    setPage(nextPage)
    setIsMenuOpen(false)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  function openAuthMode(mode) {
    setAuthMode(mode)
    setAuthError('')
    setAuthForm(defaultAuthForm)
  }

  function handleAuthSubmit(event) {
    event.preventDefault()

    const email = normalizeEmail(authForm.email)
    const displayName = authForm.displayName.trim()
    const password = authForm.password

    if (authMode === 'register') {
      if (!displayName || !email || !password || !authForm.confirmPassword) {
        setAuthError('Fill in every field to create your account.')
        return
      }

      if (password.length < 6) {
        setAuthError('Use a password with at least 6 characters.')
        return
      }

      if (password !== authForm.confirmPassword) {
        setAuthError('Passwords do not match.')
        return
      }

      if (registeredUser && registeredUser.email === email) {
        setAuthError('An account with this email already exists. Sign in instead.')
        return
      }

      const nextUser = { displayName, email, password }

      setRegisteredUser(nextUser)
      setAuthUser({ displayName, email })
      setProfile((current) => ({
        ...current,
        displayName,
      }))
      setAuthError('')
      setStatusMessage('Account created and dashboard unlocked.')
      return
    }

    if (!email || !password) {
      setAuthError('Enter your email and password to continue.')
      return
    }

    if (!registeredUser || registeredUser.email !== email || registeredUser.password !== password) {
      setAuthError('Invalid email or password.')
      return
    }

    setAuthUser({ displayName: registeredUser.displayName, email: registeredUser.email })
    setProfile((current) => ({
      ...current,
      displayName: registeredUser.displayName,
    }))
    setAuthError('')
    setStatusMessage('Welcome back. You are signed in.')
  }

  function handleSignOut() {
    setAuthUser(null)
    setIsMenuOpen(false)
    setIsModalOpen(false)
    setStatusMessage('')
  }

  function updateProfile(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !form.type ||
      !form.description.trim() ||
      !form.amount ||
      !form.date ||
      !form.category
    ) {
      setFormError('Please fill in every field before saving the transaction.')
      return
    }

    const amount = Number(form.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Enter a valid amount greater than zero.')
      return
    }

    setTransactions((current) => [
      {
        id: createId(),
        type: form.type,
        description: form.description.trim(),
        amount,
        date: form.date,
        category: form.category,
      },
      ...current,
    ])
    setFormError('')
    setStatusMessage('Transaction saved and dashboard refreshed.')
    setIsModalOpen(false)
  }

  function deleteTransaction(id) {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id))
    setStatusMessage('Transaction removed from the ledger.')
  }

  function resetAllData() {
    const shouldReset = window.confirm('Reset all saved data, preferences, and transactions?')

    if (!shouldReset) {
      return
    }

    localStorage.removeItem(STORAGE_KEYS.transactions)
    localStorage.removeItem(STORAGE_KEYS.profile)
    localStorage.removeItem(STORAGE_KEYS.filter)
    localStorage.removeItem(STORAGE_KEYS.page)
    localStorage.removeItem(STORAGE_KEYS.authUser)
    localStorage.removeItem(STORAGE_KEYS.registeredUser)
    localStorage.setItem(STORAGE_KEYS.resetEmpty, 'true')

    setProfile(defaultProfile)
    setRegisteredUser(null)
    setAuthUser(null)
    setTransactions([])
    setFilter('all')
    setPage('dashboard')
    setAuthMode('login')
    setAuthForm(defaultAuthForm)
    setStatusMessage('All data cleared. The app is back to a clean slate.')
  }

  const balance = totals.income - totals.expense

  if (!authUser) {
    return (
      <div className="app-shell auth-shell">
        <div className="aurora aurora--left" aria-hidden="true" />
        <div className="aurora aurora--right" aria-hidden="true" />

        <main className="auth-layout">
          <section className="auth-intro panel">
              <h1>Paise bachao</h1>
            <p className="brand-kicker">Personal Finance Tracker</p>
         
            <p className="auth-intro__copy">
              Sign in to manage your money, or create a new account to start tracking income and spending.
            </p>

            <div className="auth-highlights">
              <article>
                <strong>Dashboard access</strong>
                <span>Quickly review balance, income, and expenses.</span>
              </article>
              <article>
                <strong>Local save</strong>
                <span>Your account stays in the browser until you reset it.</span>
              </article>
              <article>
                <strong>Responsive UI</strong>
                <span>Built to work on phones, tablets, and desktop screens.</span>
              </article>
            </div>
          </section>

          <section className="auth-card panel">
            <div className="auth-switcher" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={authMode === 'login' ? 'filter-pill is-active' : 'filter-pill'}
                onClick={() => openAuthMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === 'register' ? 'filter-pill is-active' : 'filter-pill'}
                onClick={() => openAuthMode('register')}
              >
                Register
              </button>
            </div>

            <header className="auth-card__header">
              <p className="panel__eyebrow">{authMode === 'login' ? 'Welcome back' : 'Create account'}</p>
              <h2>{authMode === 'login' ? 'Login to your account' : 'Register a new account'}</h2>
            </header>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' ? (
                <label>
                  <span>Full name</span>
                  <input
                    type="text"
                    value={authForm.displayName}
                    onChange={(event) =>
                      setAuthForm((current) => ({ ...current, displayName: event.target.value }))
                    }
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>
              ) : null}

              <label>
                <span>Email address</span>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter your password"
                  autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                />
              </label>

              {authMode === 'register' ? (
                <label>
                  <span>Confirm password</span>
                  <input
                    type="password"
                    value={authForm.confirmPassword}
                    onChange={(event) =>
                      setAuthForm((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />
                </label>
              ) : null}

              {authError ? <p className="form-error">{authError}</p> : null}

              <button type="submit" className="primary-button auth-submit">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="aurora aurora--left" aria-hidden="true" />
      <div className="aurora aurora--right" aria-hidden="true" />

      <header className={isMenuOpen ? 'topbar is-menu-open' : 'topbar'}>
        <div className="brand-block">
          <div className="brand-mark">PB</div>
          <div>
            <p className="brand-kicker">Personal Finance Tracker</p>
            <h1>Paise bachao</h1>
          </div>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="menu-button__icon">
            <path d="M4 6.5h16M4 12h16M4 17.5h16" />
          </svg>
        </button>

        <nav id="primary-navigation" className="topnav" aria-label="Primary">
          <button
            type="button"
            className={page === 'dashboard' ? 'nav-pill is-active' : 'nav-pill'}
            onClick={() => navigateTo('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={page === 'settings' ? 'nav-pill is-active' : 'nav-pill'}
            onClick={() => navigateTo('settings')}
          >
            Settings
          </button>
        </nav>

        <div className="topbar__actions">
          <div className="session-chip">
            <span className="session-chip__dot" />
            Signed in as {authUser.displayName}
          </div>
          <button type="button" className="ghost-button" onClick={handleSignOut}>
            Sign out
          </button>
          {page === 'dashboard' ? (
            <button type="button" className="primary-button" onClick={openModal}>
              Add Transaction
            </button>
          ) : null}
        </div>
      </header>

      <main className="content-grid">
        {page === 'dashboard' ? (
          <>
            <section className="hero-panel panel">
              <div>
                <p className="panel__eyebrow">Overview</p>
                <h2>Money, movement, and momentum in one place.</h2>
                <p className="hero-panel__copy">
                  Track your income and spending, keep an eye on live cash flow, and switch between
                  filters without losing context.
                </p>
              </div>
              <div className="hero-panel__meta">
                <div>
                  <span>Current currency</span>
                  <strong>{profile.currency}</strong>
                </div>
                <div>
                  <span>Entries</span>
                  <strong>{totals.count}</strong>
                </div>
                <div>
                  <span>Theme</span>
                  <strong>{profile.theme}</strong>
                </div>
              </div>
            </section>

            <section className="stats-grid">
              <StatCard
                label="Current Balance"
                value={formatMoney(balance, profile.currency)}
                caption="Income minus spending"
                tone="balance"
              />
              <StatCard
                label="Total Income"
                value={formatMoney(totals.income, profile.currency)}
                caption="Money added to the account"
                tone="income"
              />
              <StatCard
                label="Total Expense"
                value={formatMoney(totals.expense, profile.currency)}
                caption="Money spent or withdrawn"
                tone="expense"
              />
              <StatCard
                label="Transactions"
                value={String(totals.count).padStart(2, '0')}
                caption="All tracked entries"
                tone="count"
              />
            </section>

            <div className="dashboard-grid">
              <SectionCard title="Cash Flow Chart" eyebrow="Visual snapshot" className="panel--chart">
                {chartData.length > 0 ? (
                  <div className="chart-shell">
                    <div className="chart-axis" aria-hidden="true">
                      <span>{formatMoney(chartMax, profile.currency)}</span>
                      <span>0</span>
                    </div>
                    <div className="chart-bars" role="img" aria-label="Cash flow chart">
                      {chartData.map((point) => (
                        <div key={point.date} className="chart-column">
                          <div className="chart-column__stack">
                            <div
                              className="chart-segment chart-segment--income"
                              style={{ height: `${(point.income / chartMax) * 100}%` }}
                              title={`Income ${formatMoney(point.income, profile.currency)}`}
                            />
                            <div
                              className="chart-segment chart-segment--expense"
                              style={{ height: `${(point.expense / chartMax) * 100}%` }}
                              title={`Expense ${formatMoney(point.expense, profile.currency)}`}
                            />
                          </div>
                          <span>
                            {new Date(point.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No chart data yet.</p>
                    <span>Add your first transaction to build a cash flow view.</span>
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Quick Insights" eyebrow="Highlights" className="panel--insights">
                <div className="insight-list">
                  <article>
                    <span>Highest income source</span>
                    <strong>
                      {transactions.find((transaction) => transaction.type === 'income')?.category ?? 'None'}
                    </strong>
                  </article>
                  <article>
                    <span>Top spending category</span>
                    <strong>
                      {transactions.find((transaction) => transaction.type === 'expense')?.category ?? 'None'}
                    </strong>
                  </article>
                  <article>
                    <span>Session status</span>
                    <strong>Active</strong>
                  </article>
                </div>
                <button type="button" className="secondary-button" onClick={openModal}>
                  Log a new transaction
                </button>
              </SectionCard>
            </div>

            <SectionCard title="Transaction Ledger" eyebrow="Live table" className="panel--table">
              <div className="filter-row" role="tablist" aria-label="Transaction filters">
                {[
                  { key: 'all', label: 'All Types' },
                  { key: 'income', label: 'Income Only' },
                  { key: 'expense', label: 'Expense Only' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={filter === item.key ? 'filter-pill is-active' : 'filter-pill'}
                    onClick={() => setFilter(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th aria-label="Delete transaction" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTransactions.length > 0 ? (
                      visibleTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td data-label="Date">{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                            <td data-label="Description">{transaction.description}</td>
                            <td data-label="Category">{transaction.category}</td>
                            <td data-label="Type">
                            <span className={`type-chip type-chip--${transaction.type}`}>
                              {transaction.type}
                            </span>
                          </td>
                            <td
                              data-label="Amount"
                            className={
                              transaction.type === 'income' ? 'amount amount--income' : 'amount amount--expense'
                            }
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatMoney(transaction.amount, profile.currency)}
                          </td>
                            <td data-label="Actions">
                            <button
                              type="button"
                              className="icon-button"
                              onClick={() => deleteTransaction(transaction.id)}
                              aria-label={`Delete ${transaction.description}`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <div className="empty-table">
                            <strong>No transactions match the selected filter.</strong>
                            <span>Add a new entry or switch back to All Types.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </>
        ) : (
          <section className="settings-layout">
            <SectionCard title="Profile Settings" eyebrow="Preferences" className="panel--settings">
              <div className="settings-grid">
                <label>
                  <span>Display name</span>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(event) => updateProfile('displayName', event.target.value)}
                    placeholder="Your name"
                  />
                </label>

                <label>
                  <span>Currency</span>
                  <select
                    value={profile.currency}
                    onChange={(event) => updateProfile('currency', event.target.value)}
                  >
                    <option value="USD">USD - $</option>
                    <option value="EUR">EUR - €</option>
                    <option value="GBP">GBP - £</option>
                    <option value="INR">INR - ₹</option>
                    <option value="JPY">JPY - ¥</option>
                  </select>
                </label>

                <label>
                  <span>Theme</span>
                  <select
                    value={profile.theme}
                    onChange={(event) => updateProfile('theme', event.target.value)}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </label>
              </div>

              <div className="settings-actions">
                <div className="settings-note">
                  <strong>Saved locally in the browser</strong>
                  <span>Refreshing the page keeps your name, currency, and theme.</span>
                </div>
                <button type="button" className="danger-button" onClick={resetAllData}>
                  Reset All Data
                </button>
              </div>
            </SectionCard>

            <SectionCard title="What this app remembers" eyebrow="Stored state" className="panel--details">
              <ul className="detail-list">
                <li>Transactions remain available after refresh using browser storage.</li>
                <li>Filters and the last viewed page are restored on return.</li>
                <li>The session switch can simulate a sign-in / sign-out flow.</li>
                <li>Reset clears the ledger and preference state so you can start again.</li>
              </ul>
            </SectionCard>
          </section>
        )}
      </main>

      {statusMessage ? <div className="toast">{statusMessage}</div> : null}

      {isModalOpen ? (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => event.target === event.currentTarget && closeModal()}
        >
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title">
            <header className="modal-card__header">
              <div>
                <p className="panel__eyebrow">Add entry</p>
                <h2 id="transaction-modal-title">Transaction details</h2>
              </div>
              <button type="button" className="icon-button" onClick={closeModal}>
                Close
              </button>
            </header>

            <form className="transaction-form" onSubmit={handleSubmit}>
              <label>
                <span>Type</span>
                <select
                  value={form.type}
                  onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>

              <label>
                <span>Description</span>
                <input
                  type="text"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Salary, groceries, rent..."
                />
              </label>

              <div className="form-grid">
                <label>
                  <span>Amount</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, amount: event.target.value }))
                    }
                    placeholder="0"
                  />
                </label>

                <label>
                  <span>Date</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                  />
                </label>
              </div>

              <label>
                <span>Category</span>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              {formError ? <p className="form-error">{formError}</p> : null}

              <div className="modal-actions">
                <button type="button" className="ghost-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
