import { useParams } from 'react-router-dom';
import { useTextBuffer } from '../hooks/useTextBuffer';
import { useBackgroundManager } from '../hooks/useBackgroundManager';
import BackgroundContainer from './BackgroundContainer';
import Loader from './Loader';
import ShareButton from './ShareButton';
import themesData from '../data/themes.json';

const ThemePage = () => {
  const { themeId } = useParams();
  //console.log('ThemePage rendering with themeId:', themeId);
  const theme = themesData.themes[themeId];
  //console.log('Theme data:', theme);

  const { currentText, getNextText, isLoading } = useTextBuffer(theme);
  const { backgroundImages, activeIndex, changeBackground } = useBackgroundManager(theme);

  const handleGenerate = async () => {
    const newText = await getNextText();
    if (newText) {
      // Change background with the new text for keyword analysis
      changeBackground(newText);
    }
  };

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 pt-24 relative z-2">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 border border-red-400/30">
            <div className="text-6xl mb-4 animate-bounce">❌</div>
            <h2 className="text-3xl mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent font-bold">
              Theme not found
            </h2>
            <p className="text-lg text-white/80">
              The requested theme "{themeId}" does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundContainer 
        backgroundImages={backgroundImages}
        activeIndex={activeIndex}
      />
      
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-20 md:pt-24 relative z-2">
        <div className="max-w-4xl w-full text-center relative">
          {/* Main container with glassmorphism */}
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-3xl md:rounded-[2rem] p-8 md:p-12 border border-white/20 shadow-2xl shadow-purple-500/10 relative overflow-hidden animate-slide-up">
            
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl md:rounded-[2rem]">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-float"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-3xl md:text-6xl lg:text-7xl text-white mb-6 md:mb-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 font-bold drop-shadow-2xl">
                <span className="text-4xl md:text-7xl lg:text-8xl animate-float hover:scale-110 transition-transform duration-300 cursor-default">
                  {theme.emoji}
                </span>
                <span className="bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent font-extrabold tracking-tight">
                  {theme.title}
                </span>
              </h1>              
              {/* Text Display Area */}
              <div className="min-h-[200px] flex items-center justify-center my-8 md:my-12">
                {isLoading ? (
                  <Loader isVisible={true} />
                ) : (
                  currentText && (
                    <div className="relative">
                      {/* Text container with enhanced styling */}
                      <div className="bg-gradient-to-r from-white/10 via-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/30 shadow-inner-glow">
                        <h2 className="text-xl md:text-3xl lg:text-4xl leading-relaxed font-light text-white drop-shadow-lg bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                          {currentText}
                        </h2>
                      </div>
                      
                      {/* Decorative elements */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-sm opacity-60 animate-pulse"></div>
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-sm opacity-60 animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                  )
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-6 md:gap-8 items-center">
                <button 
                  className="group relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 border-0 rounded-full text-white text-lg md:text-xl font-semibold px-10 md:px-12 py-4 md:py-5 cursor-pointer transition-all duration-500 shadow-glow disabled:opacity-60 disabled:cursor-not-allowed hover:not(:disabled):-translate-y-2 hover:not(:disabled):shadow-glow-lg hover:not(:disabled):animate-pulse-glow active:scale-95 overflow-hidden"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  style={{
                    backgroundSize: '200% 100%',
                    backgroundPosition: isLoading ? '100% 0' : '0% 0',
                    backgroundImage: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #8b5cf6)'
                  }}
                >
                  {/* Button text */}
                  <span className="relative z-10 font-bold tracking-wide">
                    {isLoading ? 'Generiere...' : theme.buttonText}
                  </span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
                
                {currentText && (
                  <ShareButton text={currentText} theme={theme} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemePage;
