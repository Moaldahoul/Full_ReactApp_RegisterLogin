export default (sequelize, DataTypes) => {
    const Suggestion = sequelize.define('suggestion', {
      text: DataTypes.STRING, // Suggestion has only text  
    });
  
    return Suggestion;
  }; 