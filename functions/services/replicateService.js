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

  async generateStagedImage(imageUrl, style = 'modern') {
    try {
      console.log('Starting AI image generation with Replicate...');
      
      // Using a popular image-to-image model for room staging
      // You can experiment with different models based on your needs
      const output = await this.replicate.run(
        "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        {
          input: {
            // TODO: Modify the prompt later
            prompt: `A bedroom with a bohemian spirit centered around a relaxed canopy bed complemented by a large macrame wall hanging. An eclectic dresser serves as a unique storage solution while an array of potted plants brings life and color to the room`,
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
      
      // Handle the output based on the model's documentation
      if (output && typeof output === 'object' && typeof output.url === 'function') {
        // This model returns an object with a url() method
        const imageUrl = output.url();
        console.log('Generated image URL:', imageUrl);
        return imageUrl;
      } else if (Array.isArray(output) && output.length > 0) {
        // Fallback for array format
        return output[0];
      } else if (typeof output === 'string') {
        // Fallback for string format
        return output;
      } else {
        console.error('Unexpected output format:', output);
        throw new Error('Unexpected output format from Replicate API');
      }
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
      
      // Using a popular image-to-image model for room staging
      const output = await this.replicate.run(
        "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        {
          input: {
            prompt: `A bedroom with a bohemian spirit centered around a relaxed canopy bed complemented by a large macrame wall hanging. An eclectic dresser serves as a unique storage solution while an array of potted plants brings life and color to the room`,
            image: dataURL,
          }
        }
      );

      console.log('AI generation completed successfully');
      console.log('Output type:', typeof output);
      console.log('Output:', output);
      
      // Handle the output based on the model's documentation
      if (output && typeof output === 'object' && typeof output.url === 'function') {
        // This model returns an object with a url() method
        const imageUrl = output.url();
        console.log('Generated image URL:', imageUrl);
        return imageUrl;
      } else if (Array.isArray(output) && output.length > 0) {
        // Fallback for array format
        return output[0];
      } else if (typeof output === 'string') {
        // Fallback for string format
        return output;
      } else {
        console.error('Unexpected output format:', output);
        throw new Error('Unexpected output format from Replicate API');
      }
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
        if (output && typeof output === 'object' && typeof output.url === 'function') {
          variations.push(output.url());
        } else if (Array.isArray(output) && output.length > 0) {
          variations.push(output[0]);
        } else {
          variations.push(output);
        }
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
      return output[0];
    } catch (error) {
      console.error('Error generating alternative staged image:', error);
      throw new Error(`Failed to generate alternative staged image: ${error.message}`);
    }
  }
}

module.exports = ReplicateService; 