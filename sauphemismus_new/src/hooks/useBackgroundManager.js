import { useState, useEffect, useCallback } from 'react';
import { getRandomBackgroundImage, getRandomTopic } from '../services/pixabay';
import { analyzePartOfSpeech, buildSearchKeywords } from '../services/huggingface';
import { SEARCH_CONFIG } from '../config/searchConfig';

export const useBackgroundManager = (theme) => {
  const [backgroundImages, setBackgroundImages] = useState(['', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const loadBackgroundImage = useCallback(async (keywords, index) => {
    try {
      const imageUrl = await getRandomBackgroundImage(keywords);
      if (imageUrl) {
        setBackgroundImages(prev => {
          const newImages = [...prev];
          newImages[index] = imageUrl;
          return newImages;
        });
      }
    } catch (error) {
      console.error('Error loading background image:', error);
    }
  }, []);

  // Load initial background
  useEffect(() => {
    if (theme && theme.backgroundTopics) {
      const topic = getRandomTopic(theme.backgroundTopics);
      //console.log('Loading initial background with topic:', topic);
      loadBackgroundImage(topic, 0);
    }
  }, [theme, loadBackgroundImage]);

  const changeBackground = useCallback(async (generatedText = null) => {
    if (isChanging) return;
    
    setIsChanging(true);
    const nextIndex = activeIndex === 0 ? 1 : 0;
    
    let searchKeywords;
    
    if (generatedText) {
      // Analyze the generated text for keywords using the new system
      try {
        const posGroups = await analyzePartOfSpeech(generatedText);
        
        if (SEARCH_CONFIG.DEBUG_KEYWORDS) {
          //console.log('POS Analysis result:', posGroups);
        }
        
        searchKeywords = buildSearchKeywords(posGroups, SEARCH_CONFIG.USE_MULTIPLE_KEYWORDS);
        
        if (SEARCH_CONFIG.DEBUG_KEYWORDS) {
          //console.log('Built search keywords:', searchKeywords);
        }
      } catch (error) {
        console.error('Error analyzing text for background:', error);
        searchKeywords = getRandomTopic(theme.backgroundTopics);
        //console.log('Error occurred, using theme topic:', searchKeywords);
      }
    } else {
      // For initial load or when no text is provided, use predefined topics
      searchKeywords = getRandomTopic(theme.backgroundTopics);
      //console.log('No text provided, using theme topic:', searchKeywords);
    }

    //console.log('Loading background for keywords:', searchKeywords);
    await loadBackgroundImage(searchKeywords, nextIndex);
    
    // Smooth transition
    setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsChanging(false);
    }, 100);
  }, [activeIndex, isChanging, theme, loadBackgroundImage]);

  return {
    backgroundImages,
    activeIndex,
    changeBackground,
    isChanging
  };
};
