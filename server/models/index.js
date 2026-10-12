/**
 * models/index.js
 * 
 * Purpose: Unified Data Access Layer (Repository Pattern).
 * Implements clean abstraction between Controllers and Storage:
 * - When MongoDB is connected, leverages Mongoose ODM directly.
 * - When MongoDB is offline, transparently routes queries through our
 *   zero-config persistent file store (server/data/db.json).
 * 
 * Benefits for SEPM & WAD:
 * - High cohesion, loose coupling.
 * - Same controller code runs in production (MongoDB) or offline academic viva evaluation.
 * - Zero mock illusions: real disk persistence and state changes.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getDBState } = require('../config/db');

// Mongoose models
const UserModel = require('./User');
const SessionModel = require('./Session');
const ReviewModel = require('./Review');
const CreditTransactionModel = require('./CreditTransaction');
const NotificationModel = require('./Notification');

const DATA_FILE = path.join(__dirname, '..', 'data', 'db.json');

// Helper to generate 24-char hex IDs mimicking MongoDB ObjectIds
const generateId = () => crypto.randomBytes(12).toString('hex');

// File storage utilities
const readDb = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = {
        users: [],
        sessions: [],
        reviews: [],
        creditTransactions: [],
        notifications: []
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '{}');
  } catch (err) {
    console.error('Error reading JSON DB:', err.message);
    return { users: [], sessions: [], reviews: [], creditTransactions: [], notifications: [] };
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON DB:', err.message);
  }
};

// Generic matcher for query objects
const matchesQuery = (item, query = {}) => {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, value] of Object.entries(query)) {
    if (key === '$or' && Array.isArray(value)) {
      const orMatched = value.some(subQuery => matchesQuery(item, subQuery));
      if (!orMatched) return false;
      continue;
    }
    if (key === '_id' || key === 'id') {
      const itemKey = item._id || item.id;
      const targetVal = (value && value.toString) ? value.toString() : value;
      if (itemKey !== targetVal) return false;
      continue;
    }
    if (value && typeof value === 'object' && value.$ne !== undefined) {
      const itemVal = item[key];
      const targetVal = (value.$ne && value.$ne.toString) ? value.$ne.toString() : value.$ne;
      if (itemVal && itemVal.toString() === targetVal) return false;
      continue;
    }
    const itemVal = item[key];
    if (key === 'email' && typeof itemVal === 'string' && typeof value === 'string') {
      if (itemVal.toLowerCase() !== value.toLowerCase()) return false;
      continue;
    }
    const targetVal = (value && value.toString) ? value.toString() : value;
    if (itemVal === undefined && targetVal !== undefined) return false;
    if (itemVal && itemVal.toString() !== targetVal) return false;
    if (!itemVal && targetVal) return false;
  }
  return true;
};

// Unified Model Wrappers
const createModelWrapper = (collectionName, MongooseModel) => {
  return {
    async find(query = {}) {
      if (getDBState().mode === 'mongodb') {
        return await MongooseModel.find(query).lean ? MongooseModel.find(query).lean() : MongooseModel.find(query);
      }
      const db = readDb();
      const list = db[collectionName] || [];
      return list.filter(item => matchesQuery(item, query));
    },

    async findOne(query = {}) {
      if (getDBState().mode === 'mongodb') {
        return await MongooseModel.findOne(query);
      }
      const db = readDb();
      const list = db[collectionName] || [];
      const found = list.find(item => matchesQuery(item, query));
      return found ? { ...found } : null;
    },

    async findById(id) {
      if (!id) return null;
      if (getDBState().mode === 'mongodb') {
        return await MongooseModel.findById(id);
      }
      const db = readDb();
      const list = db[collectionName] || [];
      const strId = id.toString();
      const found = list.find(item => (item._id && item._id.toString() === strId) || (item.id && item.id.toString() === strId));
      return found ? { ...found } : null;
    },

    async create(docData) {
      if (getDBState().mode === 'mongodb') {
        return await MongooseModel.create(docData);
      }
      const db = readDb();
      if (!db[collectionName]) db[collectionName] = [];
      
      const newDoc = {
        _id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...docData
      };
      db[collectionName].push(newDoc);
      writeDb(db);
      return newDoc;
    },

    async findByIdAndUpdate(id, updateData, options = {}) {
      if (!id) return null;
      if (getDBState().mode === 'mongodb') {
        return await MongooseModel.findByIdAndUpdate(id, updateData, { new: true, ...options });
      }
      const db = readDb();
      const list = db[collectionName] || [];
      const strId = id.toString();
      const index = list.findIndex(item => (item._id && item._id.toString() === strId) || (item.id && item.id.toString() === strId));
      if (index === -1) return null;

      // Check for $set or direct update
      const changes = updateData.$set ? { ...updateData.$set } : { ...updateData };
      list[index] = {
        ...list[index],
        ...changes,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
      return { ...list[index] };
    },

    async findByIdAndDelete(id) {
      if (!id) return null;
      if (getDBState().mode === 'mongodb') {
        return await MongooseModel.findByIdAndDelete(id);
      }
      const db = readDb();
      const list = db[collectionName] || [];
      const strId = id.toString();
      const index = list.findIndex(item => (item._id && item._id.toString() === strId) || (item.id && item.id.toString() === strId));
      if (index === -1) return null;
      const removed = list.splice(index, 1)[0];
      writeDb(db);
      return removed;
    },

    async countDocuments(query = {}) {
      if (getDBState().mode === 'mongodb') {
        return await MongooseModel.countDocuments(query);
      }
      const db = readDb();
      const list = db[collectionName] || [];
      return list.filter(item => matchesQuery(item, query)).length;
    },

    async updateMany(query = {}, updateData = {}) {
      if (getDBState().mode === 'mongodb') {
        return await MongooseModel.updateMany(query, updateData);
      }
      const db = readDb();
      const list = db[collectionName] || [];
      let updatedCount = 0;
      const changes = updateData.$set ? updateData.$set : updateData;
      list.forEach((item, idx) => {
        if (matchesQuery(item, query)) {
          list[idx] = { ...item, ...changes, updatedAt: new Date().toISOString() };
          updatedCount++;
        }
      });
      writeDb(db);
      return { modifiedCount: updatedCount };
    }
  };
};

module.exports = {
  User: createModelWrapper('users', UserModel),
  Session: createModelWrapper('sessions', SessionModel),
  Review: createModelWrapper('reviews', ReviewModel),
  CreditTransaction: createModelWrapper('creditTransactions', CreditTransactionModel),
  Notification: createModelWrapper('notifications', NotificationModel),
  readRawDb: readDb,
  writeRawDb: writeDb
};
