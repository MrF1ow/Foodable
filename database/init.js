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
    username: 'jimmy bill bob',
    email: 'dummy@gmail.com',
    settings: {
        theme: "light",
    },
    preferences: {
        dietaryRestrictions: ["vegetarian"],
        allergies: ["peanuts"],
    },

    favoriteRecipes: [],
    createdRecipes: [],
    groceryLists: [],
    following: [],
    followers: [],
    lastLogin: new Date(),
    dateJoined: new Date(),
});