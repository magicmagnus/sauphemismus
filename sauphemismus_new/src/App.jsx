import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from './components/TabNavigation';
import ThemePage from './components/ThemePage';
import themesData from './data/themes.json';

function App() {
  //console.log('App is rendering...');
  const themes = themesData.themes;
  //console.log('Themes loaded:', themes);
  const firstTheme = Object.keys(themes)[0];
  //console.log('First theme:', firstTheme);

  // Use basename only in production (GitHub Pages)
  const basename = import.meta.env.PROD ? '/sauphemismus_new' : '';

  return (
    <Router basename={basename}>
      <div className="min-h-screen font-sans text-white bg-gray-900">
        <div className="p-4 text-center">
          <h1 className="text-2xl text-white mb-4">App Test</h1>
          <p className="text-white">Themes: {Object.keys(themes).join(', ')}</p>
        </div>
        <TabNavigation themes={themes} />
        
        <Routes>
          <Route path="/" element={<Navigate to={`/${firstTheme}`} replace />} />
          <Route path="/:themeId" element={<ThemePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
