const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient(process.env.REDIS_PORT);
client.flushall();
const dbKey = process.env.REDIS_DB;

/**@function - async version of node-redis hash functions */
const addHashAsync = promisify(client.hmset).bind(client);
const getAllHashAsync = promisify(client.hgetall).bind(client);

/**@function - add and get hash with multiple key/value pairs */
const addToHash = (id, name, count) =>
  addHashAsync(`fruit:${id}`, 'name', name, 'count', count);
const getFromHash = id => getAllHashAsync(`fruit:${id}`);

/**@function - async version of node-redis sorted set functions */
const addSortedSetAsync = promisify(client.zadd).bind(client);
const getSortedSetAsync = promisify(client.zrevrange).bind(client);
const getZScoreAsync = promisify(client.zscore).bind(client);

//FUNCTIONS TO ADD AND GET SORTED SET
/**@function - add and get sorted set */
const addToSortedSet = (id, count) =>
  Promise.resolve(addSortedSetAsync(dbKey, count, `fruit:${id}`));
const getSortedSet = () => getSortedSetAsync(dbKey, 0, -1, 'withscores');
const getZScore = id => getZScoreAsync(dbKey, `fruit:${id}`);

module.exports = {
  addToSortedSet,
  getSortedSet,
  getZScore,
  addToHash,
  getFromHash
};
