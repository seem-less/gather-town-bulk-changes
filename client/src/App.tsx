import Store from './Store/Store'
import Main from './Main/Main'

const App: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#282c34', height: '100vh' }}>
      <Store>
        <header />
        <Main />
        <footer />
      </Store>
    </div>
  )
}
export default App
