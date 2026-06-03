require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Please add:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadImages() {
  const imageDir = path.join(__dirname, '..', '..', 'public', 'product-images');

  if (!fs.existsSync(imageDir)) {
    console.error('❌ Image directory not found:', imageDir);
    console.log('📁 Create folder: public/product-images/');
    console.log('   Then organize images by category:');
    console.log('   - public/product-images/Groceries/');
    console.log('   - public/product-images/Dairy/');
    console.log('   - etc.');
    return;
  }

  try {
    // Get all category folders
    const categories = fs.readdirSync(imageDir);

    for (const category of categories) {
      const categoryPath = path.join(imageDir, category);

      // Skip if not a directory
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      console.log(`\n📂 Processing category: ${category}`);

      // Get all images in category folder
      const images = fs
        .readdirSync(categoryPath)
        .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

      for (const image of images) {
        const imagePath = path.join(categoryPath, image);
        const fileBuffer = fs.readFileSync(imagePath);

        // Create filename
        const filename = `${category}/${image}`;

        try {
          const { data, error } = await supabase.storage
            .from('products')
            .upload(filename, fileBuffer, {
              upsert: true,
              contentType: `image/${path.extname(image).slice(1)}`,
            });

          if (error) {
            console.error(`❌ Error uploading ${image}:`, error.message);
          } else {
            console.log(`✅ Uploaded: ${filename}`);
          }
        } catch (err) {
          console.error(`❌ Exception uploading ${image}:`, err.message);
        }
      }
    }

    console.log('\n✨ Image upload completed!');
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

uploadImages();