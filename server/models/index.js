import Sequelize from 'sequelize';
// import User from './user';


const sequelize = new Sequelize(
    'test_graphql_db' , 
    'test_graphql_admin', 
    'iampassword', 
    {
        host: 'localhost',
        dialect: 'postgres',
});

const db = {
   User: sequelize.import('./user'),
};

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default db;