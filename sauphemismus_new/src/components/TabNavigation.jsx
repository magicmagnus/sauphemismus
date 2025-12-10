import { NavLink } from 'react-router-dom';

const TabNavigation = ({ themes }) => {
  //console.log('TabNavigation rendering with themes:', themes);
  
  if (!themes) {
    return <div className="text-white p-4">No themes loaded</div>;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl p-4 flex justify-center gap-4 z-[1000] border-b border-purple-500/30">
      {Object.entries(themes).map(([key, theme]) => {
        //console.log('Rendering tab:', key, theme);
        return (
          <NavLink
            key={key}
            to={`/${key}`}
            className={({ isActive }) => 
              `flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 text-white no-underline transition-all duration-300 border border-white/10 font-medium hover:bg-purple-500/20 ${
                isActive ? 'bg-purple-500/30 border-purple-400/50' : ''
              }`
            }
          >
            <span className="text-xl">{theme.emoji}</span>
            <span className="text-sm hidden md:inline">{theme.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default TabNavigation;
