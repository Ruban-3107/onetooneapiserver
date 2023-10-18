const mongoose = require('mongoose');
const  { MongoMemoryServer } = require("mongodb-memory-server");

// Extend the default timeout so MongoDB binaries can download when first run
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
 class TestDbHelper {
    constructor() {
      this.db = null;
      this.server = new MongoMemoryServer();
      this.connection = null;
    }
  
    /**
     * Start the server and establish a connection
     */
    async start() {
      try {
        const url = await this.server.getUri();
        console.log("Connection URL " + url)
        this.connection = await mongoose.createConnection(
          url,
          { useNewUrlParser: true }
        );
        this.connection.on('error', () => {
          throw new Error(`unable to connect to database: ${mongoUri}`);
        });
      } catch (error) {
        console.log(error)
      }
     
    }
  
    /**
     * Close the connection and stop the server
     */
    stop() {
      
      try {
        this.connection.close();
        return this.server.stop();
      } catch (error) {
        console.error(error);
      }
     
    }
  
    /**
     * Delete all collections and indexes
     */
    async cleanup() {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        return Promise.all(
          collections
            .map(({ name }) => name)
            .map(collection =>{
              try {
                if( collection !== "system.version")
                mongoose.connection.db.dropCollection(collection)
              } catch (error) {
                console.log("Error " + error)
              }
             
            } )
        );
      } catch (error) {
        console.error(error);
      }
      
     
    }
  
    /**
     * Manually insert a document into the database and return the created document
     * @param {string} collectionName
     * @param {Object} document
     */
    async createDoc(collectionName, document) {
      const { ops } = await this.db
        .collection(collectionName)
        .insertOne(document);
      return ops[0];
    }
  }

  module.exports = TestDbHelper;