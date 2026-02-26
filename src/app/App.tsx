import Menu from '../components/layout/Menu'
import './App.css'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen my-8">
      <div className="flex flex-col items-center gap-4">
        <Menu
          label="Português"
          themeColor="portuguese"
        />

        <Menu
          label="Matemática"
          themeColor="math"
        />

        <Menu
          label="Geografia"
          themeColor="geo"
        />

        <Menu
          label="Inglês"
          themeColor="english"
        />
      </div>
    </div>
  )
}

export default App
