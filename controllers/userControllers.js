const { User, Fruit } = require('../model');

//Attribute Detail stores all relevant associated table & join table detail to
const addlUserDetail = {
  include: [
    {
      model: Fruit, // model to include with user(s)
      as: 'Consumer', // alias for the user
      attributes: ['id', 'name'], // defines the attributes to includes from associated Fruit Table
      through: {
        attributes: ['counter'] // defines the attribute to include from join table
      }
    }
  ]
};

module.exports = {
  getAllUsers() {
    return User.findAll(addlUserDetail).then(users => {
      return users;
    });
  },
  getById(id) {
    return User.findById(id, addlUserDetail);
  },
  //FUNCTIONS BELOW ARE ATTEMPTS TO REWRITE FUNCTIONS ABOVE IN DIFFERENT WAY
  //Test function to get all users and then getConsumer as promise
  // This function will have promise that resolve with getPlain for each user
  // and getConsumer alongside each user
  //resolves value with have { user, userFruit } format
  findAllUsers() {
    return User.findAll().then(users => {
      const userFruits = users.map(user => user.getConsumer());
      return Promise.all(userFruits).then(userData => {
        return { users, userData };
      });
    });
  },
  //Test function to find user first and get associated consumer
  //Only for testing; doesn't figure into userRoute.js file
  findById(id) {
    return User.findById(id).then(async user => {
      const userFruits = user ? await user.getConsumer({ raw: true }) : null;
      user = user.get({ plain: true });
      return { user, userFruits };
    });
  }
};
