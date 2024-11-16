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
    username: 'admin',
    password: '12345',
});