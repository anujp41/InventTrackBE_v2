const { Op } = require('sequelize');
const { User, Fruit, UserFruit } = require('../model');
const {
  addToSortedSet,
  getFromHash,
  getSortedSet,
  getZScore
} = require('../redis');

//Attribute Detail stores all relevant associated table & join table detail to
const addlUserDetail = {
  include: [
    {
      model: Fruit, // model to include with user(s)
      as: 'Consumer', // alias for the user
      attributes: ['id', 'name'], // defines the attributes to includes from associated Fruit Table
      through: {
        attributes: ['counter'], // defines the attribute to include from join table
        where: { counter: { [Op.gt]: 0 } } //ensure that only fruits that owner has more than 0 will be responded with
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
  updateFruit({ userId, fruitId: id }) {
    return Promise.resolve(
      getZScore(id).then(totalFruit => {
        totalFruit = parseInt(totalFruit);
        console.log('totalFruit ', totalFruit);
        if (totalFruit <= 0) return 'All taken';
        addToSortedSet(id, totalFruit - 1)
          .then(() =>
            UserFruit.findOne({
              where: { fruitId: id, userId }
            })
          )
          .then(userFruit => {
            getSortedSet().then(sorted => console.log('new data is ', sorted));
            userFruit.increment('counter', { by: 1 });
          })
          .then(() => 'Completed');
      })
      // .then(newCount => console.log('my new count is ', newCount))
    );
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
