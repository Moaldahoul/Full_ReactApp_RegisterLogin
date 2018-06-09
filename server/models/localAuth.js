export default (sequelize, DataTypes) => {
    const LocalAuth = sequelize.define('localAuth', {
      
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING, // the mistake was here :/      
    });
  
  LocalAuth.associate = (models) => {
     LocalAuth.belongsTo(models.User, { foreignKey:'userId' });
  };
    return LocalAuth;
  };