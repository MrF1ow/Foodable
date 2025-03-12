db = db.getSiblingDB('foodable_db');

db.createUser({
    user: 'admin',
    pwd: '12345',
    roles: [
        {
            role: 'readWrite',
            db: 'foodable_db'
        }
    ]
})

db.createCollection('users');
db.createCollection('recipes');
db.createCollection('groceryLists');
db.createCollection('vectors');

db.users.insertOne({
    clerkId: 'user_2tP71k5KYi1BwdxYvL629CWowjG',
    username: 'mrfoodie',
    email: 'foodable_user@gmail.com',
    settings: {
        theme: "light",
    },
    preferences: {
        dietaryRestrictions: ["carnivore"],
        budget: 100,
    },
    savedItems: {
        recipes: [],
        groceryLists: [],
    },
    currentGroceryList: null,
    createdRecipes: [],
    following: [],
    followers: [],
    lastLogin: new Date(),
    dateJoined: new Date(),
});