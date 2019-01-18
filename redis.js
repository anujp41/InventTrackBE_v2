const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient(process.env.REDIS_PORT);
client.flushall();
const dbKey = process.env.REDIS_DB;

const addSortedSetAsync = promisify(client.zadd).bind(client);
const sortedSetGetAsync = promisify(client.zrevrange).bind(client);

const addToSortedSet = (id, count) =>
  addSortedSetAsync(dbKey, count, `fruit:${id}`);

const getSortedSet = () =>
  sortedSetGetAsync(dbKey, 0, -1, 'withscores').then(response =>
    console.log('redis sorted set', response)
  );

module.exports = { addToSortedSet, getSortedSet };
