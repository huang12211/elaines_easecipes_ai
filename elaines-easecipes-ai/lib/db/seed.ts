import { db } from './index';
import { recipes } from './schema';

const seedRecipes = [
  {
    title: "Raspberry Chocolate Mousse",
    slug: "raspberry-chocolate-mousse",
    tags: JSON.stringify(["Desserts"]),
    image: "/images/raspberry-chocolate-mousse.png",
    rating: 4,
    views: 43381,
    bookmarked: false,
    featured: false,
    cookTime: 45,
    servings: 6,
    minServings: 2,
    ingredients: JSON.stringify([
      "200g dark chocolate",
      "3 large eggs",
      "1/4 cup sugar",
      "1 cup heavy cream",
      "1 tsp vanilla extract",
      "1 cup fresh raspberries",
      "Pinch of salt",
      "Mint leaves for garnish"
    ]),
    directions: JSON.stringify([
      "Melt the dark chocolate in a double boiler or microwave, stirring until smooth. Let cool slightly.",
      "Separate the eggs. Beat egg yolks with half the sugar until pale and creamy.",
      "In a separate bowl, whip the heavy cream with vanilla until soft peaks form.",
      "Beat egg whites with salt until foamy, then gradually add remaining sugar until stiff peaks form.",
      "Fold the melted chocolate into the egg yolk mixture.",
      "Gently fold in the whipped cream, then fold in the egg whites.",
      "Divide half the mousse among serving glasses, add a layer of raspberries, then top with remaining mousse.",
      "Refrigerate for at least 4 hours. Garnish with raspberries and mint before serving."
    ])
  },
  {
    title: "Onion Pancakes",
    slug: "onion-pancakes",
    tags: JSON.stringify(["Breakfast", "Quick & Easy"]),
    image: "/images/onion-pancakes.png",
    rating: 4,
    views: 38500,
    bookmarked: false,
    featured: false,
    cookTime: 25,
    servings: 4,
    minServings: 2,
    ingredients: JSON.stringify([
      "2 cups all-purpose flour",
      "3/4 cup boiling water",
      "1/4 cup cold water",
      "3 green onions, finely chopped",
      "2 tbsp sesame oil",
      "1 tsp salt",
      "Vegetable oil for frying",
      "Soy sauce for dipping"
    ]),
    directions: JSON.stringify([
      "Place flour in a bowl. Pour boiling water over flour and stir. Add cold water and mix until a dough forms.",
      "Knead the dough for 5-10 minutes until smooth. Cover and rest for 30 minutes.",
      "Divide dough into 4 portions. Roll each into a thin circle.",
      "Brush with sesame oil, sprinkle with salt and green onions.",
      "Roll up the dough into a log, then coil into a spiral. Flatten and roll out again.",
      "Heat oil in a pan over medium heat. Cook pancakes for 2-3 minutes per side until golden and crispy.",
      "Cut into wedges and serve hot with soy sauce."
    ])
  },
  {
    title: "Blueberry Muffins",
    slug: "blueberry-muffins",
    tags: JSON.stringify(["Breakfast", "Desserts"]),
    image: "/images/blueberry-muffins.png",
    rating: 4,
    views: 52000,
    bookmarked: false,
    featured: false,
    cookTime: 35,
    servings: 12,
    minServings: 6,
    ingredients: JSON.stringify([
      "2 cups all-purpose flour",
      "3/4 cup sugar",
      "2 tsp baking powder",
      "1/2 tsp salt",
      "1/3 cup vegetable oil",
      "1 large egg",
      "1 cup milk",
      "1 tsp vanilla extract",
      "1 1/2 cups fresh blueberries",
      "2 tbsp coarse sugar for topping"
    ]),
    directions: JSON.stringify([
      "Preheat oven to 400°F (200°C). Line a 12-cup muffin tin with paper liners.",
      "In a large bowl, whisk together flour, sugar, baking powder, and salt.",
      "In another bowl, mix oil, egg, milk, and vanilla extract.",
      "Pour wet ingredients into dry ingredients and stir until just combined.",
      "Gently fold in the blueberries, being careful not to overmix.",
      "Divide batter evenly among muffin cups. Sprinkle tops with coarse sugar.",
      "Bake for 20-25 minutes until golden and a toothpick comes out clean.",
      "Cool in pan for 5 minutes, then transfer to a wire rack."
    ])
  },
  {
    title: "Apple Frangipane Tart",
    slug: "apple-frangipane-tart",
    tags: JSON.stringify(["Desserts"]),
    image: "/images/apple-frangipane-tart.png",
    rating: 4,
    views: 43381,
    bookmarked: false,
    featured: true,
    cookTime: 60,
    servings: 8,
    minServings: 2,
    ingredients: JSON.stringify([
      "1 sheet puff pastry",
      "1 cup almond flour",
      "1/2 cup butter, softened",
      "1/2 cup sugar",
      "2 large eggs",
      "1 tsp almond extract",
      "3 medium apples",
      "2 tbsp apricot jam",
      "Sliced almonds for garnish",
      "Powdered sugar for dusting"
    ]),
    directions: JSON.stringify([
      "Preheat oven to 375°F (190°C). Roll out puff pastry and fit into a 9-inch tart pan.",
      "For the frangipane: Beat butter and sugar until fluffy. Add eggs one at a time, then mix in almond flour and almond extract.",
      "Spread frangipane evenly over the pastry base.",
      "Peel and thinly slice the apples. Arrange in overlapping circles over the frangipane.",
      "Bake for 40-45 minutes until golden and the frangipane is set.",
      "Warm apricot jam and brush over the hot tart for a glossy finish.",
      "Sprinkle with sliced almonds and dust with powdered sugar before serving."
    ])
  },
];

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  db.delete(recipes).run();

  // Insert seed data
  for (const recipe of seedRecipes) {
    db.insert(recipes).values(recipe).run();
  }

  console.log(`Seeded ${seedRecipes.length} recipes`);

  // Verify the data
  const allRecipes = db.select().from(recipes).all();
  console.log('All recipes:', allRecipes);
}

seed().catch(console.error);
