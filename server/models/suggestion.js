export default (sequelize, DataTypes) => {
    const suggestion = sequelize.define('suggestion', {
      text: DataTypes.STRING,
  
      
    });
  
    return suggestion;
  }; 