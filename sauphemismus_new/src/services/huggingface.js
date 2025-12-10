import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient('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');

export const generateText = async (model, prompt, maxTokens = 100) => {
  console.log('Generating text with model:', model);
  try {
    const output = await client.chatCompletion({
      model: model,
      messages: [
      {
        role: "novita",
        content: prompt,
      },
      ],
      seed: Math.floor(Math.random() * 1000000),
      provider: "novita",
      parameters: {
      max_new_tokens: maxTokens,
      temperature: 0.7,
      repetition_penalty: 1.1,
      return_full_text: false,
      use_cache: false,
      }
    });
    console.log('Generated text:', output.choices[0].message);
    return output.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating text:', error);
    throw new Error('Failed to generate text');
  }
};

export const analyzePartOfSpeech = async (text) => {
  try {
    // Clean text: remove special characters and numbers for better analysis
    const cleanText = text
      .replace(/[^\w\säöüß]/gi, ' ') // Keep only letters, spaces, and German umlauts
      .replace(/\d+/g, '') // Remove numbers
      .trim();
    
    //console.log('Analyzing text:', cleanText);
    
    const output = await client.tokenClassification({
      model: "vblagoje/bert-english-uncased-finetuned-pos",
      inputs: cleanText,
      provider: "hf-inference",
    });
    
    //console.log('Raw POS output:', output);
    
    // Group keywords by part-of-speech tags like in the old system
    const posGroups = {};
    
    if (!output || !Array.isArray(output)) {
      console.warn('Invalid POS output format:', output);
      throw new Error('Invalid POS output');
    }
    
    output.forEach(token => {
      //console.log('Processing token:', token);
      
      // Use entity_group like in the old system
      const entity = token.entity_group || token.entity || token.label;
      
      if (['NOUN', 'PROPN', 'VERB', 'ADJ', 'ADV', 'ADP'].includes(entity)) {
        const cleanWord = token.word.replace(/##/g, ''); // Remove BERT subword markers

        //console.log(`Found ${entity}: "${cleanWord}"`);

        // Filter out very short words and common German stop words
        if (cleanWord.length > 2 && 
            !/^(der|die|das|ein|eine|und|oder|aber|mit|von|zu|in|auf|für|ist|sind|war|waren|haben|hat|hatte|sein|seine|ich|du|er|sie|es|wir|ihr|sie)$/i.test(cleanWord)) {
          
          if (!posGroups[entity]) {
            posGroups[entity] = [];
          }
          
          // Avoid duplicates
          if (!posGroups[entity].includes(cleanWord)) {
            posGroups[entity].push(cleanWord);
            //console.log(`Added to ${entity}: "${cleanWord}"`);
          }
        } else {
          //console.log(`Filtered out: "${cleanWord}" (too short or stopword)`);
        }
      } else {
        //console.log(`Ignored entity type: ${entity} for word: ${token.word}`);
      }
    });

    //console.log('Final POS groups:', posGroups);
    return posGroups;
  } catch (error) {
    console.error('Error analyzing part of speech:', error);
    
    // Fallback: simple keyword extraction
    try {
      //console.log('Using fallback keyword extraction for:', text);
      const words = text
        .replace(/[^\w\säöüß]/gi, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !/^(der|die|das|ein|eine|und|oder|aber|mit|von|zu|in|auf|für|ist|sind|war|waren|haben|hat|hatte|sein|seine|ich|du|er|sie|es|wir|ihr|sie)$/i.test(word))
        .slice(0, 3);

      //console.log('Fallback words:', words);
      return { NOUN: words };
    } catch (fallbackError) {
      console.error('Fallback keyword extraction failed:', fallbackError);
      return { NOUN: ['abstract'] };
    }
  }
};

export const buildSearchKeywords = (posGroups, useMultipleKeywords = true) => {
  // Configuration: set to false to use only single keywords
  if (!useMultipleKeywords) {
    // Single keyword mode - return first available keyword
    if (posGroups.NOUN && posGroups.NOUN.length > 0) return posGroups.NOUN[0];
    if (posGroups.PROPN && posGroups.PROPN.length > 0) return posGroups.PROPN[0];
    if (posGroups.VERB && posGroups.VERB.length > 0) return posGroups.VERB[0];
    if (posGroups.ADJ && posGroups.ADJ.length > 0) return posGroups.ADJ[0];
    return 'abstract';
  }

  // Multi-keyword mode - prioritized combinations like in the old system
  let keywords = '';

  // Priority 1: NOUN + VERB + ADJ (like old system)
  if (posGroups.NOUN && posGroups.VERB && posGroups.ADJ) {
    keywords = [
      posGroups.NOUN[0] || '',
      posGroups.VERB[0] || '',
      posGroups.ADJ[0] || ''
    ].filter(k => k).join(',');
  }
  // Priority 2: PROPN + VERB + ADJ
  else if (posGroups.PROPN && posGroups.VERB && posGroups.ADJ) {
    keywords = [
      posGroups.PROPN[0] || '',
      posGroups.VERB[0] || '',
      posGroups.ADJ[0] || ''
    ].filter(k => k).join(',');
  }
  // Priority 3: NOUN + VERB + ADV
  else if (posGroups.NOUN && posGroups.VERB && posGroups.ADV) {
    keywords = [
      posGroups.NOUN[0] || '',
      posGroups.VERB[0] || '',
      posGroups.ADV[0] || ''
    ].filter(k => k).join(',');
  }
  // Priority 4: PROPN + VERB + ADV
  else if (posGroups.PROPN && posGroups.VERB && posGroups.ADV) {
    keywords = [
      posGroups.PROPN[0] || '',
      posGroups.VERB[0] || '',
      posGroups.ADV[0] || ''
    ].filter(k => k).join(',');
  }
  // Priority 5: NOUN + VERB
  else if (posGroups.NOUN && posGroups.VERB) {
    keywords = [
      posGroups.NOUN[0] || '',
      posGroups.VERB[0] || ''
    ].filter(k => k).join(',');
  }
  // Priority 6: PROPN + VERB
  else if (posGroups.PROPN && posGroups.VERB) {
    keywords = [
      posGroups.PROPN[0] || '',
      posGroups.VERB[0] || ''
    ].filter(k => k).join(',');
  }
  // Fallback: single keywords
  else if (posGroups.NOUN && posGroups.NOUN.length > 0) {
    keywords = posGroups.NOUN[0];
  }
  else if (posGroups.PROPN && posGroups.PROPN.length > 0) {
    keywords = posGroups.PROPN[0];
  }
  else if (posGroups.VERB && posGroups.VERB.length > 0) {
    keywords = posGroups.VERB[0];
  }
  else if (posGroups.ADJ && posGroups.ADJ.length > 0) {
    keywords = posGroups.ADJ[0];
  }
  else if (posGroups.ADV && posGroups.ADV.length > 0) {
    keywords = posGroups.ADV[0];
  }
  else if (posGroups.ADP && posGroups.ADP.length > 0) {
    keywords = posGroups.ADP[0];
  }

  // If no keywords found, use default
  if (!keywords || keywords === '') {
    keywords = 'nice sunset';
  }

  console.log('Built search keywords:', keywords);
  return keywords;
};
