const Replicate = require('replicate');

class ReplicateService {
  constructor() {
    // Get API token from environment variables or Firebase config
    const apiToken = process.env.REPLICATE_API_TOKEN || 
                    (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).replicate?.token);
    
    if (!apiToken) {
      throw new Error('REPLICATE_API_TOKEN is required. Set it in environment variables or Firebase config.');
    }

    this.replicate = new Replicate({
      auth: apiToken,
    });
  }

  /**
   * Generate dynamic prompts based on user's selected style and room type
   * @param {string} style - The room style selected by user
   * @param {string} roomType - The type of room (living room, bedroom, bathroom, etc.)
   * @returns {string} - Generated prompt for the specific style and room type
   */
  generateStyleBasedPrompt(style, roomType = 'room') {
    // Normalize room type for consistent formatting
    const normalizedRoomType = roomType.toLowerCase().replace(/\s+/g, ' ');
    
    const stylePrompts = {
      'minimalist': `Transform this ${normalizedRoomType} into a minimalist paradise with clean lines, neutral colors, and uncluttered spaces. Use simple furniture with sleek designs, minimal decor, and plenty of breathing room. Focus on functionality and aesthetic simplicity while maintaining the ${normalizedRoomType}'s purpose.`,
      
      'scandinavian': `Convert this ${normalizedRoomType} to Scandinavian style with light wood furniture, soft neutral tones, and natural materials. Add cozy textiles, simple geometric patterns, and plenty of natural light. Include plants and organic elements for warmth, creating a serene ${normalizedRoomType} atmosphere.`,
      
      'modern': `Transform this ${normalizedRoomType} into a modern masterpiece with contemporary furniture, bold geometric shapes, and sophisticated color schemes. Use sleek materials like glass, metal, and leather. Add statement lighting and clean, uncluttered spaces that enhance the ${normalizedRoomType}'s functionality.`,
      
      'bohemian': `Convert this ${normalizedRoomType} to bohemian style with eclectic furniture, rich textures, and vibrant colors. Layer rugs, add macrame wall hangings, and include vintage pieces. Use plants, candles, and artistic elements for a free-spirited ${normalizedRoomType} atmosphere.`,
      
      'vintage': `Transform this ${normalizedRoomType} with vintage charm using antique furniture, classic patterns, and nostalgic decor. Include retro lighting, vintage textiles, and timeless accessories. Create a warm, inviting ${normalizedRoomType} with character and history.`,
      
      'industrial': `Convert this ${normalizedRoomType} to industrial style with exposed brick, metal furniture, and raw materials. Use vintage lighting, distressed wood, and urban elements. Include open shelving and mechanical details for an urban loft feel in your ${normalizedRoomType}.`,
      
      'rustic': `Transform this ${normalizedRoomType} with rustic charm using natural wood, stone elements, and earthy colors. Include vintage farmhouse furniture, cozy textiles, and nature-inspired decor. Create a warm, welcoming ${normalizedRoomType} atmosphere with country appeal.`,
      
      'coastal': `Convert this ${normalizedRoomType} to coastal style with light, airy colors, natural textures, and ocean-inspired elements. Use light wood furniture, nautical accents, and breezy fabrics. Include seashells, driftwood, and beach-inspired artwork for a serene ${normalizedRoomType}.`,
      
      'tropical': `Transform this ${normalizedRoomType} with tropical vibes using vibrant colors, natural materials, and exotic patterns. Include palm leaf prints, bamboo furniture, and tropical plants. Create a lush, vacation-like atmosphere in your ${normalizedRoomType} with bright, energetic elements.`,
      
      'mid-century-modern': `Convert this ${normalizedRoomType} to mid-century modern style with iconic furniture designs, organic shapes, and retro aesthetics. Use teak wood, bold colors, and geometric patterns. Include vintage lighting and classic mid-century decor elements for a timeless ${normalizedRoomType}.`
    };

    // Return the specific style prompt or default to modern if style not found
    return stylePrompts[style.toLowerCase()] || stylePrompts['modern'];
  }

  // Helper method to handle different Replicate output formats
  handleReplicateOutput(output) {
    if (output && typeof output === 'object' && typeof output.url === 'function') {
      // This model returns an object with a url() method
      const imageUrl = output.url();
      console.log('Generated image URL (url method):', imageUrl);
      return imageUrl;
    } else if (Array.isArray(output) && output.length > 0) {
      // Fallback for array format
      console.log('Generated image URL (array):', output[0]);
      return output[0];
    } else if (typeof output === 'string') {
      // Fallback for string format
      console.log('Generated image URL (string):', output);
      return output;
    } else if (output && typeof output === 'object' && output.href) {
      // Some models return an object with href property
      console.log('Generated image URL (href):', output.href);
      return output.href;
    } else {
      console.error('Unexpected output format:', output);
      throw new Error('Unexpected output format from Replicate API');
    }
  }

  async generateStagedImage(imageUrl, style = 'modern') {
    try {
      console.log('Starting AI image generation with Replicate...');
      
      // Generate dynamic prompt based on user's selected style
      const dynamicPrompt = this.generateStyleBasedPrompt(style);
      console.log(`🔍 Using prompt for ${style} style:`, dynamicPrompt);
      
      // Using a popular image-to-image model for room staging
      // You can experiment with different models based on your needs
      const output = await this.replicate.run(
        "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        {
          input: {
            prompt: dynamicPrompt,
            image: imageUrl,
            // strength: 0.7, // Controls how much to transform the original image
            // guidance_scale: 7.5, // Controls how closely to follow the prompt
            // num_inference_steps: 20,
            // seed: Math.floor(Math.random() * 1000000), // Random seed for variety
          }
        }
      );

      console.log('AI generation completed successfully');
      console.log('Output type:', typeof output);
      console.log('Output:', output);
      
      return this.handleReplicateOutput(output);
    } catch (error) {
      console.error('Error generating staged image:', error);
      throw new Error(`Failed to generate staged image: ${error.message}`);
    }
  }

  async generateStagedImageFromBuffer(imageBuffer, style = 'modern', roomType = 'living room') {
    try {
      console.log('Starting AI image generation with Replicate using image buffer...');
      
      // Convert buffer to base64 data URL for Replicate
      const base64Image = imageBuffer.toString('base64');
      const dataURL = `data:image/jpeg;base64,${base64Image}`;
      
      // Generate dynamic prompt based on user's selected style
      const dynamicPrompt = this.generateStyleBasedPrompt(style, roomType);
      console.log(`🔍 Using prompt for ${style} style:`, dynamicPrompt);
      
      // Using a popular image-to-image model for room staging
      const output = await this.replicate.run(
        "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        {
          input: {
            prompt: dynamicPrompt,
            image: dataURL,
          }
        }
      );

      console.log('AI generation completed successfully');
      console.log('Output type:', typeof output);
      console.log('Output:', output);
      
      return this.handleReplicateOutput(output);
    } catch (error) {
      console.error('Error generating staged image from buffer:', error);
      throw new Error(`Failed to generate staged image from buffer: ${error.message}`);
    }
  }

  async generateMultipleVariations(imageUrl, style = 'modern', count = 3) {
    try {
      console.log(`Generating ${count} variations with style: ${style}`);
      
      const variations = [];
      
      for (let i = 0; i < count; i++) {
        const output = await this.replicate.run(
          "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          {
            input: {
              prompt: `Professional home staging of this room in ${style} style. Add elegant furniture, modern decor, proper lighting, and stylish accessories. Make it look like a luxury real estate listing.`,
              image: imageUrl,
              strength: 0.7,
              guidance_scale: 7.5,
              num_inference_steps: 20,
              seed: Math.floor(Math.random() * 1000000) + i, // Different seed for each variation
            }
          }
        );
        
        // Handle the output format for variations
        const imageUrl = this.handleReplicateOutput(output);
        variations.push(imageUrl);
      }

      console.log(`Generated ${variations.length} variations successfully`);
      return variations;
    } catch (error) {
      console.error('Error generating variations:', error);
      throw new Error(`Failed to generate variations: ${error.message}`);
    }
  }

  // Alternative model for more specialized room staging
  async generateStagedImageAlternative(imageUrl, roomType = 'living room', style = 'modern') {
    try {
      console.log(`Generating staged ${roomType} in ${style} style...`);
      
      const output = await this.replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: `Transform this ${roomType} into a professionally staged ${roomType} in ${style} style. Add appropriate furniture, lighting, decor, and accessories. Make it look like a high-end real estate listing with perfect staging.`,
            image: imageUrl,
            strength: 0.8,
            guidance_scale: 8.0,
            num_inference_steps: 25,
            seed: Math.floor(Math.random() * 1000000),
          }
        }
      );

      console.log('Alternative staging generation completed');
      return this.handleReplicateOutput(output);
    } catch (error) {
      console.error('Error generating alternative staged image:', error);
      throw new Error(`Failed to generate alternative staged image: ${error.message}`);
    }
  }
}

module.exports = ReplicateService; 