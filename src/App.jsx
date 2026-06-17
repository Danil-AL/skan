import { useState } from 'react'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './context/useAuth'
import { Header, HeaderAuthorized, HeaderLoading, Footer, Hero, SliderSection, TariffsSection, LoginPage, SearchPage } from './components'

const AppInner = () => {
  const { user, isLoading } = useAuth()
  const [page, setPage] = useState('home')

  const navigate = (to) => {
    if (to === 'main') {
      setPage(user ? 'search' : 'login')
      return
    }
    if (to === 'search' && !user) {
      setPage('login')
      return
    }
    setPage(to)
  }

  if (page === 'login') {
    return (
      <div>
        <Header onNavigate={navigate} />
        <LoginPage onNavigate={navigate} />
        <Footer />
      </div>
    )
  }

  if (page === 'search' && user) {
    return (
      <div>
        <HeaderAuthorized onNavigate={navigate} />
        <SearchPage />
        <Footer />
      </div>
    )
  }

  const header = isLoading ? (
    <HeaderLoading />
  ) : user ? (
    <HeaderAuthorized onNavigate={navigate} />
  ) : (
    <Header onLogin={() => navigate('login')} onNavigate={navigate} />
  )

  return (
    <div>
      {header}
      <Hero onSearch={() => navigate('search')} />
      <SliderSection title="Почему именно мы" />
      <TariffsSection />
      <main>{/* страницы будут здесь */}</main>
      <Footer />
    </div>
  )
}

const App = () => (
  <AuthProvider>
    <AppInner />
  </AuthProvider>
)

export default App