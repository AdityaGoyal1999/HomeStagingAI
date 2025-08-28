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
   * Generate dynamic prompts based on user's selected style
   * @param {string} style - The room style selected by user
   * @returns {string} - Generated prompt for the specific style
   */
  generateStyleBasedPrompt(style) {
    const stylePrompts = {
      'minimalist': 'Transform this room into a minimalist paradise with clean lines, neutral colors, and uncluttered spaces. Use simple furniture with sleek designs, minimal decor, and plenty of breathing room. Focus on functionality and aesthetic simplicity.',
      
      'scandinavian': 'Convert this room to Scandinavian style with light wood furniture, soft neutral tones, and natural materials. Add cozy textiles, simple geometric patterns, and plenty of natural light. Include plants and organic elements for warmth.',
      
      'modern': 'Transform this room into a modern masterpiece with contemporary furniture, bold geometric shapes, and sophisticated color schemes. Use sleek materials like glass, metal, and leather. Add statement lighting and clean, uncluttered spaces.',
      
      'bohemian': 'Convert this room to bohemian style with eclectic furniture, rich textures, and vibrant colors. Layer rugs, add macrame wall hangings, and include vintage pieces. Use plants, candles, and artistic elements for a free-spirited atmosphere.',
      
      'vintage': 'Transform this room with vintage charm using antique furniture, classic patterns, and nostalgic decor. Include retro lighting, vintage textiles, and timeless accessories. Create a warm, inviting space with character and history.',
      
      'industrial': 'Convert this room to industrial style with exposed brick, metal furniture, and raw materials. Use vintage lighting, distressed wood, and urban elements. Include open shelving and mechanical details for an urban loft feel.',
      
      'rustic': 'Transform this room with rustic charm using natural wood, stone elements, and earthy colors. Include vintage farmhouse furniture, cozy textiles, and nature-inspired decor. Create a warm, welcoming atmosphere with country appeal.',
      
      'coastal': 'Convert this room to coastal style with light, airy colors, natural textures, and ocean-inspired elements. Use light wood furniture, nautical accents, and breezy fabrics. Include seashells, driftwood, and beach-inspired artwork.',
      
      'tropical': 'Transform this room with tropical vibes using vibrant colors, natural materials, and exotic patterns. Include palm leaf prints, bamboo furniture, and tropical plants. Create a lush, vacation-like atmosphere with bright, energetic elements.',
      
      'mid-century-modern': 'Convert this room to mid-century modern style with iconic furniture designs, organic shapes, and retro aesthetics. Use teak wood, bold colors, and geometric patterns. Include vintage lighting and classic mid-century decor elements.'
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

  async generateStagedImageFromBuffer(imageBuffer, style = 'modern') {
    try {
      console.log('Starting AI image generation with Replicate using image buffer...');
      
      // Convert buffer to base64 data URL for Replicate
      const base64Image = imageBuffer.toString('base64');
      const dataURL = `data:image/jpeg;base64,${base64Image}`;
      
      // Generate dynamic prompt based on user's selected style
      const dynamicPrompt = this.generateStyleBasedPrompt(style);
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