import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import LandingPage from './pages/LandingPage.jsx'
import CreateEventPage from './pages/CreateEventPage.jsx'
import EventPage from './pages/EventPage.jsx'
import SummaryPage from './pages/SummaryPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateEventPage />} />
            <Route path="/event/:slug" element={<EventPage />} />
            <Route path="/event/:slug/summary" element={<SummaryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
