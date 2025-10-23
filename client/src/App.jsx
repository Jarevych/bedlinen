// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div className="app">
      <header className="header">
        <h1>Ласкаво просимо до Bedlinen!</h1>
        <p>Тут можна знайти ніжну та затишну постільну білизну.</p>
      </header>
      <main>
        <img src="/bed.jpg" alt="Постільна білизна" className="main-image" />
      </main>
    </div>
    </>
  )
}

export default App
