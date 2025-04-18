require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');
const Category = require('./models/Category');

// Initialize DB connection
let initialize = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL environment variable is not defined');
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Define default categories
    const defaultCategories = [
      { id: 1, category: "Home & Garden" },
      { id: 2, category: "Electronics, Computers & Video Games" },
      { id: 3, category: "Clothing" },
      { id: 4, category: "Sports & Outdoors" },
      { id: 5, category: "Pets" }
    ];

    // Check if categories collection is empty
    const categoryCount = await Category.countDocuments();
    
    if (categoryCount === 0) {
      // Insert default categories
      await Category.insertMany(defaultCategories);
      console.log('Default categories added successfully');
    }
    
    console.log('Successfully connected to MongoDB');
    return Promise.resolve();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return Promise.reject(error);
  }
};

// Item operations
let getAllItems = async () => {
  try {
    return await Item.find().lean();
  } catch (error) {
    throw new Error('Unable to get items');
  }
};

let getItemsByCategory = async (category) => {
  try {
    return await Item.find({ category: parseInt(category) }).lean();
  } catch (error) {
    throw new Error('Unable to get items by category');
  }
};

let getItemsByMinDate = async (minDate) => {
  try {
    return await Item.find({ postDate: { $gte: new Date(minDate) } }).lean();
  } catch (error) {
    throw new Error('Unable to get items by date');
  }
};

let getItemById = async (id) => {
  try {
    const item = await Item.findOne({ id: parseInt(id) }).lean();
    if (!item) throw new Error('Item not found');
    return item;
  } catch (error) {
    throw new Error('Unable to get item by id');
  }
};

let addItem = async (itemData) => {
  try {
    const allItems = await getAllItems();
    const newId = Math.max(...allItems.map(item => item.id)) + 1;
    
    const newItem = new Item({
      id: newId,
      category: parseInt(itemData.category),
      postDate: new Date(),
      featureImage: itemData.featureImage,
      price: parseFloat(itemData.price),
      title: itemData.title,
      body: itemData.body,
      published: itemData.published ? true : false
    });
    
    await newItem.save();
    return newItem;
  } catch (error) {
    throw new Error('Unable to add item');
  }
};

let getPublishedItems = async () => {
  try {
    return await Item.find({ published: true }).lean();
  } catch (error) {
    throw new Error('Unable to get published items');
  }
};

let getPublishedItemsByCategory = async (category) => {
  try {
    return await Item.find({ 
      published: true, 
      category: parseInt(category) 
    }).lean();
  } catch (error) {
    throw new Error('Unable to get published items by category');
  }
};

let deletePostById = async (id) => {
  try {
    const result = await Item.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) throw new Error('Item not found');
    return true;
  } catch (error) {
    throw new Error('Unable to delete item');
  }
};

// Category operations
let getCategories = async () => {
  try {
    const categories = await Category.find().lean();
    console.log(`Retrieved ${categories.length} categories:`, categories);
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Unable to get categories');
  }
};

let addCategory = async (categoryData) => {
  try {
    const allCategories = await getCategories();
    const newId = Math.max(...allCategories.map(cat => cat.id)) + 1;
    
    const newCategory = new Category({
      id: newId,
      category: categoryData.category
    });
    
    await newCategory.save();
    return newCategory;
  } catch (error) {
    throw new Error('Unable to add category');
  }
};

let deleteCategoryById = async (id) => {
  try {
    const result = await Category.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) throw new Error('Category not found');
    return true;
  } catch (error) {
    throw new Error('Unable to delete category');
  }
};

module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getPublishedItemsByCategory,
  getCategories,
  addItem,
  getItemById,
  getItemsByCategory,
  getItemsByMinDate,
  addCategory,
  deleteCategoryById,
  deletePostById
};


