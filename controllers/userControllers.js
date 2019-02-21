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
        where: { counter: { [Op.gte]: 0 } } //ensure that only fruits that owner has more than 0 will be responded with
      }
    }
  ]
};

module.exports = {
  getAllUsers() {
    return User.findAll(addlUserDetail).then(users => {
      const userObj = users
        .map(user => user.toJSON()) //converts to plain JSON to remove metadata
        .reduce((acc, user) => {
          //convert array to object with id as key
          acc[user.id] = user;
          return acc;
        }, {});
      return userObj;
    });
  },
  getById(id) {
    return User.findById(id, addlUserDetail);
  },
  updateFruit({ userId, fruitId: id }) {
    return getZScore(id).then(async totalFruit => {
      totalFruit = parseInt(totalFruit);
      if (totalFruit <= 0) {
        return { message: 'All taken' };
      } else {
        let updateCount = await addToSortedSet(id, totalFruit - 1)
          .then(() =>
            UserFruit.findOne({
              where: { fruitId: id, userId }
            })
          )
          .then(userFruit => userFruit.increment('counter', { by: 1 }));
        updateCount = updateCount.toJSON();
        return { message: 'Completed', updateCount };
      }
    });
  },
  //TEST FUNCTION - ROUTE IS NOT CALLED IN FRONT-END
  gettingAllUser() {
    return User.findAll(addlUserDetail).then(async users => {
      const allFruits = await Fruit.findAll({
        attributes: ['id', 'name'],
        raw: true
      });
      const userDV = users.map(user => user.dataValues);
      userDV.forEach(user =>
        user.Consumer.forEach(consumer =>
          console.log('here', user.name, ' loves ', consumer.name)
        )
      );
      console.log('allFruits ', userDV);
      return users;
    });
  },
  saveUser(newUser) {
    const { name } = newUser;
    return User.findOrCreate({
      where: { name: { [Op.iLike]: name } },
      defaults: newUser
    }).spread((user, created) => ({
      user: user.get({ plain: true }),
      created
    }));
  }
  /*
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
  */
};
