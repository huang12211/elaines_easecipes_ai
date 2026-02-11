import { db } from './index';
import { recipes, ingredients, measurementUnits, recipe_ingredient_measUnit } from './schema';

//------------------------------------------------//
// Seed Ingredients in Alphabetical Order         //
//------------------------------------------------//
const seedIngredients = [
    {ingr: 'Almond Flour'}, {ingr: 'Apples'},
    {ingr: 'Baking Powder'}, { ingr: 'Baking Soda'}, {ingr: 'Basil'}, {ingr: 'Black Beans'}, {ingr: 'Black Pepper'}, {ingr: 'Black Sesame Paste'}, {ingr: 'Black Sesame Seeds'}, { ingr: 'Blueberries'}, { ingr: 'Brown Sugar'}, 
    {ingr: 'Canola Oil'}, {ingr: 'Chickpeas'}, {ingr: 'Cocoa Powder'}, {ingr: 'Cornstarch'}, {ingr: 'Corn Kernels'},
    {ingr: 'Dark Chocolate, chopped'}, {ingr: 'Dijon Mustard'},
    {ingr: 'Egg(s)'}, {ingr: 'Egg White(s)'}, {ingr: 'Egg Yolk(s)'},
    {ingr: 'Flour' }, {ingr: 'Fresh Fruit'}, {ingr: 'Fresh Parsley'},
    {ingr: 'Garlic'}, {ingr: 'Gelatin Powder'}, {ingr: 'Granulated Sugar'}, { ingr: 'Tips of Green Onions' }, { ingr: 'Ground Cinnamon'},
    {ingr: 'Heavy Cream'}, {ingr: 'Honey / Maple Syrup'}, { ingr: 'Hot Water' }, {ingr: 'Hot Sauce'},
    {ingr: 'Kidney Beans'},
    {ingr: 'Lemon Juice'},
    {ingr: 'Margarine' }, { ingr: 'Milk' }, 
    {ingr: 'Olive Oil'},
    {ingr: 'Peaches'}, {ingr: 'Premade 9 inch Pie Crust'},
    {ingr: 'Quick Oats'},
    {ingr: 'Raspberries'}, {ingr: 'Red Onion, diced'}, {ingr: 'Red Wine Vinegar / Apple Cider Vinegar'}, {ingr: 'Rhubarb, chopped'},
    {ingr: 'Salt' }, { ingr: 'Salted Butter' }, {ingr: 'Semisweet Chocolate Chips'}, {ingr: 'Sweet Red Pepper, diced'},
    {ingr: 'Unsalted Butter' }, 
    {ingr: 'Vanilla Extract' }, { ingr: 'Vegetable Oil'}, 
    {ingr: 'Walnuts (optional)'}, {ingr: 'Water'}, {ingr: 'White Vinegar'}, {ingr: 'White Wine Vinegar / Apple Cider Vinegar / Lemon Juice'},
    {ingr: 'Yeast'},
];

//------------------------------------------------//
// Insert measurementsUnits                       //
//------------------------------------------------//
const seedMeasurementUnits =[
    {meas_unit: ' '}, {meas_unit: '12 oz can'}, {meas_unit: '15 oz can'}, {meas_unit: '19 oz can'}, 
    {meas_unit: 'clove(s) of'}, { meas_unit: 'cup(s)'}, {meas_unit: 'g'}, { meas_unit: 'tbsp(s)'}, {meas_unit: 'tsp(s)'},
];

//------------------------------------------------//
// Seed Recipes in Alphabetical Order             //
//------------------------------------------------//
const seedRecipes = [
  {
    title: "Apple Frangipane Tart",
    slug: "apple-frangipane-tart",
    tags: JSON.stringify(["Desserts"]),
    image: "/images/apple-frangipane-tart.png",
    rating: 5,
    views: 43381,
    bookmarked: false,
    featured: true,
    cookTime: 60,
    baseServings: 12,
    minServings: 12,
    servingIncrement: 12,
    directions: JSON.stringify([
      "title: Filling:",
      "Cream the butter and sugar together until fluffy.",
      "Add in all other ingredients for the filling until well-combined.",
      "title: Assemble:",
      "Preheat the oven to 375\u00B0F.",
      "Pour the filling mixture into the premade pie crust and use a spatula to spread the filling evenly.",
      "Slice the apples thinly and layer them in any pattern you wish on top of the filling.",
      "Bake the tart for 30-35 mins."
    ])
  },
    {
    title: "Chocolate Raspberry Mousse Cake",
    slug: "chocolate-raspberry-mousse-cake",
    tags: JSON.stringify(["Desserts"]),
    image: "/images/raspberry-chocolate-mousse.png",
    rating: 4,
    views: 43381,
    bookmarked: false,
    featured: false,
    cookTime: 45,
    baseServings: 12,
    minServings: 12,
    servingIncrement: 12,
    directions: JSON.stringify([
      "title: Cake Layer:",
      "Preheat the over to 350\u00B0F.",
      "Grease a 9-inch springform pan.",
      "In a large bowl, mix the water, oil and vinegar until well combined.",
      "Add the flour, sugar, sifted cocoa powder, and baking soda. Mix until well combined.",
      "Bake at 350\u00B0F for 10 to 12 minutes until a toothpick inserted into the center comes out clean.",
      "Leave to cool completely making sure that you DO NOT remove it from its pan.",
      "title: Raspberry Mousse Layer:",
      "In a small bowl, sprinkle the gelatin over the 1 tbsp of water and let bloom for 5 minutes.",
      "Meanwhile, in a small saucepan, add the raspberries, lemon juice, vanilla extract, granulated sugar and water. Whisk constantly over medium-heat until the sauce coats the back of a spoon and ressembles thick jam-consistency.",
      "Remove the saucepan from the head and stir in the bloomed gelatin mixture until well combined. Set the mixture aside to cool.",
      "In another bowl, whip the cream with an electric mixer until stiff peaks form. Mix in one quarter of the whipped cream to the cooled raspberry mixture. Then gently fold in the remaining cream.",
      "Spoon the raspberry mixture onto the cake layer.",
      "Place the cake into the fridge for at least 4 hours, or freeze for 2 hours.",
      "title: Chocolate Mousse Layer:",
      "In a small bowl, sprinkle the gelatin over the 1 tbsp of water and let bloom for 5 minutes.",
      "Melt your chocolate using either a bowl placed on top of a pot of simmering water, or using the microwave.",
      "In a separate bowl placed on top of a pot of simmering water, or using the microwave, and in a 1/3 cup of the cream with the sugar. Heat until the sugar has dissolved. Remove from the heat and add the gelatin mixture until well combined.",
      "Add the cream mixture to the warmed chocolate and mix until well combined.",
      `In another bowl, whip the cream with an electric mixer until stiff peaks form. Mix in one quarter of the whipped cream to the cooled chocolate mixture. Then gently fold in the remaining whipped cream.`,
      "Spoon the chocolate mousse onto the raspberry layer.",
      "Place the cake into the fridge for at least 4 hours, or freeze for 2 hours.",
      "title: Chocolate Ganache Glaze:",
      "Prepare a tray with wax paper and place a wire rack over it. Take the cake out of the springform pan and place the cake on top of the wire rack. This setup should allow you to catch any ganache that is poured over. If frozen, leave the cake out for 1 hour to let it come up to room temperature.",
      "Place the chocolate into a bowl.",
      "In a small saucepan, or using the microwave, bring the cream to a boil. Add the cream to the bowl of chocolate in small increments while stirring until the mixture is smooth. Then pour in the remaining cream. With a spatula, stir the ganache until smooth.",
      "Pour the chocolate ganache over the cake so that the entire cake is glazed.",
    ])
  },
  {
    title: "Fluffy Blueberry Muffins",
    slug: "fluffy-blueberry-muffins",
    tags: JSON.stringify(["Breakfast", "Desserts", "Quick & Easy"]),
    image: "/images/blueberry-muffins.png",
    rating: 4,
    views: 52000,
    bookmarked: false,
    featured: false,
    cookTime: 35,
    baseServings: 12,
    minServings: 12,
    servingIncrement: 12,
    directions: JSON.stringify([
      "Set to 375\u00B0F.",
      "In a mixer, cream the butter and sugar until light.",
      "Add the eggs, vanilla and milk. Mix until well-combined.",
      "Add the flour, salt and baking powder. Mix until well-combined.",
      "Fold-in the blueberries.",
      "Grease a standard muffin tin and fill with batter.",
      `Bake at 375\u00B0F for 30-35 mins.`,
      "Remove muffins from tin and leave them to cool for at least 30 mins.",
      "Store the muffins uncovered or else the muffins will be too moist on the second day.",
    ])
  //   directions: `Set to 375&deg;F.
  //           In a mixer, cream the butter and sugar until light.
  //           Add the eggs, vanilla and milk. Mix until well-combined.
  //           Add the flour, salt and baking powder. Mix until well-combined.
  //           Fold-in the blueberries.
  //           Grease a standard muffin tin and fill with batter.
  //           Bake at 375&deg;F for 30-35 mins.
  //           Remove muffins from tin and leave them to cool for at least 30 mins.
  //           Store the muffins uncovered or else the muffins will be too moist on the second day.`
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
    baseServings: 6,
    minServings: 6,
    servingIncrement: 6,
    directions: JSON.stringify([
      "Combine flour and salt together in a large bowl or mixer.",
      "Slowly add boiling water to the bowl while mixing using a fork until it forms a shaggy dough. It is normal at this point for the dough to not come together yet.",
      "Add your chopped-up green onion tips and your egg(s) to the mixture and continue to mix with your fork until the egg is well-combined.",
      "Knead your dough either by hand, or using a mixer with a dough-hook attachment until it forms a smooth dough.",
      "Roll the dough out into a sausage form and divide it into 6 equal pieces. Form each piece into a ball and brush with a bit of oil. Cover the dough balls and set aside to rest for 40 mins in a warm place.",
      "Flatten each ball into a round, trying to get it as thin as possible. Brush the spread onto the round, avoiding the edges. Make a slit in the round from its center to its border. Wrap the round in on itself into a cone as illustrated in the video to create the layers in the pastry. Roll the cone out back into a round. Tip: You can freeze your uncooked pancakes for up to a month at this point. Just place some parchment paper or some wax paper in between your pancakes and store in a ziplock bag.",
      "When you are ready to eat, fry-up the pancakes (no need to defrost if cooking from frozen) in a skillet with a little oil. Serve whilst hot."
    ])
  },
];

const seedIngredientMeasUnit = [
  // Apple Frangipane Tart
  {recipe_id: 'apple-frangipane-tart', component: 'Dough:', amount: '1', measUnit_id: ' ', ingredient_id: 'Premade 9 inch Pie Crust', min_amount: '1'},
  {recipe_id: 'apple-frangipane-tart', component: 'Filling:', amount: '4', measUnit_id: 'tbsp(s)', ingredient_id: 'Unsalted Butter', min_amount: '4'},
  {recipe_id: 'apple-frangipane-tart', component: 'Filling:', amount: '1/4', measUnit_id: 'cup(s)', ingredient_id: 'Granulated Sugar', min_amount: '1/4'},
  {recipe_id: 'apple-frangipane-tart', component: 'Filling:', amount: '1/2', measUnit_id: 'cup(s)', ingredient_id: 'Almond Flour', min_amount: '1/2'},
  {recipe_id: 'apple-frangipane-tart', component: 'Filling:', amount: '1/4', measUnit_id: 'tsp(s)', ingredient_id: 'Salt', min_amount: '1/4'},
  {recipe_id: 'apple-frangipane-tart', component: 'Filling:', amount: '1', measUnit_id: 'tbsp(s)', ingredient_id: 'Flour', min_amount: '1'},
  {recipe_id: 'apple-frangipane-tart', component: 'Filling:', amount: '1', measUnit_id: ' ', ingredient_id: 'Egg(s)', min_amount: '1'},
  {recipe_id: 'apple-frangipane-tart', component: 'Filling:', amount: '1', measUnit_id: 'tsp(s)', ingredient_id: 'Vanilla Extract', min_amount: '1'},
  {recipe_id: 'apple-frangipane-tart', component: 'Toppings:', amount: '2', measUnit_id: ' ', ingredient_id: 'Apples', min_amount: '2'},
  //Chocolate Raspberry Mousse Cake
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Cake Layer:', amount: '1/4', measUnit_id: 'cup(s)', ingredient_id: 'Water', min_amount: '1/4'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Cake Layer:', amount: '4', measUnit_id: 'tsp(s)', ingredient_id: 'Canola Oil', min_amount: '4'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Cake Layer:', amount: '2', measUnit_id: 'tsp(s)', ingredient_id: 'White Vinegar', min_amount: '2'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Cake Layer:', amount: '1/3', measUnit_id: 'cup(s)', ingredient_id: 'Flour', min_amount: '1/3'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Cake Layer:', amount: '3', measUnit_id: 'tbsp(s)', ingredient_id: 'Granulated Sugar', min_amount: '3'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Cake Layer:', amount: '1 1/2', measUnit_id: 'tbsp(s)', ingredient_id: 'Cocoa Powder', min_amount: '1 1/2'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Cake Layer:', amount: '1/8', measUnit_id: 'tsp(s)', ingredient_id: 'Baking Soda', min_amount: '1/8'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Raspberry Mousse:', amount: '1', measUnit_id: 'tsp(s)', ingredient_id: 'Gelatin Powder', min_amount: '1'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Raspberry Mousse:', amount: '1', measUnit_id: 'tbsp(s)', ingredient_id: 'Water', min_amount: '1'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Raspberry Mousse:', amount: '2', measUnit_id: 'cup(s)', ingredient_id: 'Raspberries', min_amount: '2'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Raspberry Mousse:', amount: '1', measUnit_id: 'tsp(s)', ingredient_id: 'Lemon Juice', min_amount: '1'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Raspberry Mousse:', amount: '1', measUnit_id: 'tsp(s)', ingredient_id: 'Vanilla Extract', min_amount: '1'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Raspberry Mousse:', amount: '1', measUnit_id: 'tbsp(s)', ingredient_id: 'Granulated Sugar', min_amount: '1'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Raspberry Mousse:', amount: '1/8', measUnit_id: 'cup(s)', ingredient_id: 'Water', min_amount: '1/8'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Raspberry Mousse:', amount: '1/4', measUnit_id: 'cup(s)', ingredient_id: 'Heavy Cream', min_amount: '1/4'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Chocolate Mousse:', amount: '140', measUnit_id: 'g', ingredient_id: 'Dark Chocolate, chopped', min_amount: '140'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Chocolate Mousse:', amount: '1', measUnit_id: 'tsp(s)', ingredient_id: 'Gelatin Powder', min_amount: '1'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Chocolate Mousse:', amount: '2', measUnit_id: 'tbsp(s)', ingredient_id: 'Water', min_amount: '2'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Chocolate Mousse:', amount: '1/2', measUnit_id: 'cup(s)', ingredient_id: 'Granulated Sugar', min_amount: '1/2'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Chocolate Mousse:', amount: '1 1/3', measUnit_id: 'cup(s)', ingredient_id: 'Heavy Cream', min_amount: '1 1/3'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Chocolate Ganache Glaze:', amount: '85', measUnit_id: 'g', ingredient_id: 'Dark Chocolate, chopped', min_amount: '85'},
  {recipe_id: 'chocolate-raspberry-mousse-cake', component: 'Chocolate Ganache Glaze:', amount: '1/3', measUnit_id: 'cup(s)', ingredient_id: 'Heavy Cream', min_amount: '1/3'},
  // Fluffy Blueberry Muffins
  {recipe_id: 'fluffy-blueberry-muffins', amount: '1/3', measUnit_id: 'cup(s)', ingredient_id: 'Unsalted Butter', min_amount: '1/3'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '2', measUnit_id: 'tbsp(s)', ingredient_id: 'Vegetable Oil', min_amount: '2'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '1', measUnit_id: 'cup(s)', ingredient_id: 'Brown Sugar', min_amount: '1'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '2', measUnit_id: ' ', ingredient_id: 'Egg(s)', min_amount: '2'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '1', measUnit_id: 'tsp(s)', ingredient_id: 'Vanilla Extract', min_amount: '1'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '1/2', measUnit_id: 'cup(s)', ingredient_id: 'Milk', min_amount: '1/2'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '2', measUnit_id: 'cup(s)', ingredient_id: 'Flour', min_amount: '2'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '1/2', measUnit_id: 'tsp(s)', ingredient_id: 'Salt', min_amount: '1/2'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '2', measUnit_id: 'tsp(s)', ingredient_id: 'Baking Powder', min_amount: '2'},
  {recipe_id: 'fluffy-blueberry-muffins', amount: '2', measUnit_id: 'cup(s)', ingredient_id: 'Blueberries', min_amount: '2'},
  // Onion Pancakes
  {recipe_id: 'onion-pancakes', component: 'Dough:', amount: '1 3/4', measUnit_id: 'cup(s)', ingredient_id: 'Flour', min_amount: '1 3/4'},
  {recipe_id: 'onion-pancakes', component: 'Dough:', amount: '3', measUnit_id: 'tsp(s)', ingredient_id: 'Salt', min_amount: '3'},
  {recipe_id: 'onion-pancakes', component: 'Dough:', amount: '1', measUnit_id: ' ', ingredient_id: 'Egg(s)', min_amount: '1'},
  {recipe_id: 'onion-pancakes', component: 'Dough:', amount: '1/2', measUnit_id: 'cup(s)', ingredient_id: 'Hot Water', min_amount: '1/2'},
  {recipe_id: 'onion-pancakes', component: 'Dough:', amount: '3', measUnit_id: ' ', ingredient_id: "Tips of Green Onions", min_amount: '3'},
  {recipe_id: 'onion-pancakes', component: 'Spread:', amount: '1/4', measUnit_id: 'cup(s)', ingredient_id: 'Salted Butter', min_amount: '1/4'},
];

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  db.delete(recipe_ingredient_measUnit).run(); // this line must run first (child tables must be deleted before parent tables due to foreign key constraints)
  db.delete(recipes).run();
  db.delete(ingredients).run();
  db.delete(measurementUnits).run();

  // Insert seed data
  for (const ingredient of seedIngredients) {
    db.insert(ingredients).values(ingredient).run();
  }
  console.log(`Seeded ${seedIngredients.length} ingredients`);

  for (const measUnit of seedMeasurementUnits) {
    db.insert(measurementUnits).values(measUnit).run();
  }
  console.log(`Seeded ${seedMeasurementUnits.length} measurement units...`)

  for (const recipe of seedRecipes) {
    db.insert(recipes).values(recipe).run();
  }
  console.log(`Seeded ${seedRecipes.length} recipes`);

  for (const rim of seedIngredientMeasUnit) {
    db.insert(recipe_ingredient_measUnit).values(rim).run();
  }
  console.log(`Seeded ${seedIngredientMeasUnit.length} recipe-ingredient-measurementUnit relationships...`)

  // Verify the data
  const allRecipes = db.select().from(recipes).all();
  console.log('All recipes:', allRecipes);
}

seed().catch(console.error);
