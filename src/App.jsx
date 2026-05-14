import './index.css'
import logo from './assets/Logo.png'

function App() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <img src={logo} alt="BeatBox Logo" style={{ width: '250px', borderRadius: '15px' }} />
      <h1 style={{ marginTop: '1rem', color: '#06b6d4' }}>Welcome to BeatBox</h1>
      <p>Clean slate ready! Start building here.</p>
    </div>
  )
}

export default App
