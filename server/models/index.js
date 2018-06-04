import Sequelize from 'sequelize';
// import User from './user';


const sequelize = new Sequelize(
    'react_app' , 
    'app_admin', 
    'admin', 
    {
        host: 'localhost',
        dialect: 'postgres',
});

const db = {
   User: sequelize.import('./user'),
   Board: sequelize.import('./board'),
   Suggestion: sequelize.import('./suggestion'),
   FbAuth: sequelize.import('./FbAuth'),
   LocalAuth: sequelize.import('./localAuth'),
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default db;