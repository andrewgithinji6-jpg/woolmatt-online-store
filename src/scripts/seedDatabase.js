require('dotenv').config({ path: '.env.local' });

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

const categories = [
  { name: 'Groceries', icon: '🥬' },
  { name: 'Dairy', icon: '🥛' },
  { name: 'Meat', icon: '🍖' },
  { name: 'Bakery', icon: '🍞' },
  { name: 'Beverages', icon: '🥤' },
  { name: 'Pantry', icon: '🥫' },
  { name: 'Electronics', icon: '📱' },
  { name: 'Furniture', icon: '🛋️' },
];

const products = [
  // Groceries
  {
    name: 'Organic Tomatoes',
    description: 'Fresh, organic tomatoes picked daily',
    price: 450,
    original_price: 600,
    discount: 25,
    category: 'Groceries',
    rating: 4.5,
    reviews: 128,
    in_stock: true,
    image_url: 'Groceries/organic-tomatoes.png',
  },
  {
    name: 'Fresh Bananas',
    description: 'Yellow, ripe bananas - perfect for smoothies',
    price: 200,
    original_price: 250,
    discount: 20,
    category: 'Groceries',
    rating: 4.8,
    reviews: 95,
    in_stock: true,
    image_url: 'Groceries/fresh-bananas.png',
  },
  {
    name: 'Red Onions',
    description: 'Fresh red onions for cooking',
    price: 350,
    original_price: 450,
    discount: 22,
    category: 'Groceries',
    rating: 4.3,
    reviews: 76,
    in_stock: true,
    image_url: 'Groceries/red-onions.png',
  },
  {
    name: 'Fresh Carrots',
    description: 'Crispy, orange carrots rich in vitamins',
    price: 300,
    original_price: 400,
    discount: 25,
    category: 'Groceries',
    rating: 4.6,
    reviews: 102,
    in_stock: true,
    image_url: 'Groceries/fresh-carrots.png',
  },

  // Dairy
  {
    name: 'Fresh Milk',
    description: 'Pasteurized whole milk - 1 liter',
    price: 180,
    original_price: 200,
    discount: 10,
    category: 'Dairy',
    rating: 4.7,
    reviews: 156,
    in_stock: true,
    image_url: 'Dairy/fresh-milk.png',
  },
  {
    name: 'Cheddar Cheese',
    description: 'Premium aged cheddar cheese - 500g',
    price: 850,
    original_price: 1000,
    discount: 15,
    category: 'Dairy',
    rating: 4.5,
    reviews: 89,
    in_stock: true,
    image_url: 'Dairy/cheddar-cheese.png',
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt - 500g',
    price: 450,
    original_price: 550,
    discount: 18,
    category: 'Dairy',
    rating: 4.8,
    reviews: 112,
    in_stock: true,
    image_url: 'Dairy/greek-yogurt.png',
  },
  {
    name: 'Eggs - 1 Dozen',
    description: 'Fresh farm eggs - 12 pieces',
    price: 280,
    original_price: 350,
    discount: 20,
    category: 'Dairy',
    rating: 4.6,
    reviews: 134,
    in_stock: true,
    image_url: 'Dairy/eggs-1-dozen.png',
  },

  // Meat
  {
    name: 'Beef Steaks',
    description: 'Premium beef steaks - 500g',
    price: 2500,
    original_price: 3000,
    discount: 17,
    category: 'Meat',
    rating: 4.7,
    reviews: 98,
    in_stock: true,
    image_url: 'Meat/beef-steaks.png',
  },
  {
    name: 'Chicken Breast',
    description: 'Fresh chicken breast - 1kg',
    price: 1200,
    original_price: 1500,
    discount: 20,
    category: 'Meat',
    rating: 4.5,
    reviews: 145,
    in_stock: true,
    image_url: 'Meat/chicken-breast.png',
  },
  {
    name: 'Fresh Fish',
    description: 'Tilapia fish - 800g',
    price: 1800,
    original_price: 2200,
    discount: 18,
    category: 'Meat',
    rating: 4.6,
    reviews: 76,
    in_stock: true,
    image_url: 'Meat/fresh-fish.png',
  },
  {
    name: 'Ground Beef',
    description: 'Lean ground beef - 500g',
    price: 1500,
    original_price: 1800,
    discount: 17,
    category: 'Meat',
    rating: 4.4,
    reviews: 87,
    in_stock: true,
    image_url: 'Meat/ground-beef.png',
  },

  // Bakery
  {
    name: 'Whole Wheat Bread',
    description: 'Fresh whole wheat bread - 500g',
    price: 150,
    original_price: 180,
    discount: 17,
    category: 'Bakery',
    rating: 4.5,
    reviews: 103,
    in_stock: true,
    image_url: 'Bakery/whole-wheat-bread.png',
  },
  {
    name: 'Croissants',
    description: 'Buttery croissants - 6 pieces',
    price: 350,
    original_price: 450,
    discount: 22,
    category: 'Bakery',
    rating: 4.8,
    reviews: 127,
    in_stock: true,
    image_url: 'Bakery/croissants.png',
  },
  {
    name: 'Donuts',
    description: 'Assorted donuts - 6 pieces',
    price: 280,
    original_price: 350,
    discount: 20,
    category: 'Bakery',
    rating: 4.7,
    reviews: 91,
    in_stock: true,
    image_url: 'Bakery/donuts.png',
  },
  {
    name: 'Cinnamon Rolls',
    description: 'Fresh cinnamon rolls - 4 pieces',
    price: 320,
    original_price: 400,
    discount: 20,
    category: 'Bakery',
    rating: 4.9,
    reviews: 156,
    in_stock: true,
    image_url: 'Bakery/cinnamon-rolls.png',
  },

  // Beverages
  {
    name: 'Orange Juice',
    description: 'Fresh orange juice - 1 liter',
    price: 380,
    original_price: 450,
    discount: 15,
    category: 'Beverages',
    rating: 4.6,
    reviews: 112,
    in_stock: true,
    image_url: 'Beverages/orange-juice.png',
  },
  {
    name: 'Green Tea',
    description: 'Organic green tea - 50 bags',
    price: 450,
    original_price: 550,
    discount: 18,
    category: 'Beverages',
    rating: 4.7,
    reviews: 98,
    in_stock: true,
    image_url: 'Beverages/green-tea.png',
  },
  {
    name: 'Coffee Beans',
    description: 'Premium coffee beans - 500g',
    price: 1200,
    original_price: 1500,
    discount: 20,
    category: 'Beverages',
    rating: 4.8,
    reviews: 134,
    in_stock: true,
    image_url: 'Beverages/coffee-beans.png',
  },
  {
    name: 'Bottled Water',
    description: 'Pure bottled water - 6 x 500ml',
    price: 250,
    original_price: 300,
    discount: 17,
    category: 'Beverages',
    rating: 4.5,
    reviews: 178,
    in_stock: true,
    image_url: 'Beverages/bottled-water.png',
  },

  // Pantry
  {
    name: 'Rice (2kg)',
    description: 'Long grain white rice - 2kg bag',
    price: 450,
    original_price: 550,
    discount: 18,
    category: 'Pantry',
    rating: 4.6,
    reviews: 145,
    in_stock: true,
    image_url: 'Pantry/rice-2kg.png',
  },
  {
    name: 'Pasta',
    description: 'Premium pasta - 500g',
    price: 280,
    original_price: 350,
    discount: 20,
    category: 'Pantry',
    rating: 4.7,
    reviews: 103,
    in_stock: true,
    image_url: 'Pantry/pasta.png',
  },
  {
    name: 'Olive Oil',
    description: 'Extra virgin olive oil - 500ml',
    price: 950,
    original_price: 1200,
    discount: 21,
    category: 'Pantry',
    rating: 4.8,
    reviews: 87,
    in_stock: true,
    image_url: 'Pantry/olive-oil.png',
  },
  {
    name: 'Canned Beans',
    description: 'Black beans - 400g can',
    price: 180,
    original_price: 220,
    discount: 18,
    category: 'Pantry',
    rating: 4.4,
    reviews: 56,
    in_stock: true,
    image_url: 'Pantry/canned-beans.png',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Insert categories
    console.log('📚 Inserting categories...');
    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert([category], { onConflict: 'name' });

      if (error) {
        console.error(
          `❌ Error inserting category ${category.name}:`,
          error.message
        );
      } else {
        console.log(`✅ ${category.name}`);
      }
    }

    // Insert products
    console.log('\n📦 Inserting products...');
    for (const product of products) {
      // Get category ID
      const { data: categoryData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', product.category)
        .single();

      if (catError || !categoryData) {
        console.error(`❌ Category not found: ${product.category}`);
        continue;
      }

      const { error } = await supabase.from('products').insert([
        {
          name: product.name,
          description: product.description,
          price: product.price,
          original_price: product.original_price,
          discount: product.discount,
          category_id: categoryData.id,
          rating: product.rating,
          reviews: product.reviews,
          in_stock: product.in_stock,
          image_url: product.image_url,
        },
      ]);

      if (error) {
        console.error(
          `❌ Error inserting product ${product.name}:`,
          error.message
        );
      } else {
        console.log(`✅ ${product.name}`);
      }
    }

    console.log('\n✨ Database seed completed!');
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Seed failed:', errorMessage);
    process.exit(1);
  }
}

seedDatabase();