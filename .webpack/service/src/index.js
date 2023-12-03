/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/resolver/resolver.ts":
/*!**********************************!*\
  !*** ./src/resolver/resolver.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvers = void 0;
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const aws_sdk_1 = __importDefault(__webpack_require__(/*! aws-sdk */ "aws-sdk"));
const bcryptjs_1 = __importDefault(__webpack_require__(/*! bcryptjs */ "bcryptjs"));
exports.resolvers = {
    Query: {
        testMessage: () => 'Welcome.! Serverless-GraphQL CRUD Operation📝',
        getUsers: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
                const users = yield dynamoDB.scan({ TableName: "GraphqlServerlessCRUD" }).promise();
                console.log("users ", users);
                let userData = users.Items;
                if (!(userData === null || userData === void 0 ? void 0 : userData.length) || userData.length == 0) {
                    console.log(`NO Users Found`);
                    throw new Error(`NO Users Found `);
                }
                console.log("userData ", userData);
                userData = userData.filter((item) => {
                    delete item["password"];
                    return item;
                });
                return userData;
            }
            catch (e) {
                console.log("Error For getUsers  ", e.message);
                throw (e);
            }
        }),
        getUserById: (_, id) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log("id ", id);
                console.log("id.id", id.id);
                const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
                const params = {
                    TableName: "GraphqlServerlessCRUD",
                    Key: { id: id.id },
                };
                console.log("params ", params);
                let { Item } = yield dynamoDB.get(params).promise();
                if (Item == undefined) {
                    console.log(`No User Found For Given ID  `);
                    throw new Error(`No User Found For Given ID`);
                }
                console.log("Item ", Item);
                delete Item["password"];
                return Item;
            }
            catch (e) {
                console.log("Error For  getUserById  ", e.message);
                throw (e);
            }
        })
    },
    Mutation: {
        createUser: (_, input) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log("input ", input.input);
                const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
                const isUpdated = false;
                const createdAt = new Date().toISOString();
                const id = (0, uuid_1.v4)();
                const username = input.input.username;
                const email = input.input.email;
                const password = yield bcryptjs_1.default.hash(input.input.password, 10);
                const user = {
                    id,
                    username,
                    email,
                    password,
                    createdAt,
                    isUpdated: false
                };
                yield dynamoDB.put({
                    TableName: "GraphqlServerlessCRUD",
                    Item: user
                }).promise();
                console.log("User ", user);
                return { id, username, email, createdAt, isUpdated };
            }
            catch (e) {
                console.log("Error For createUser ", e.message);
                throw (e.message);
            }
        }),
        UpdateUser: (_, id, input) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
                const params = {
                    TableName: "GraphqlServerlessCRUD",
                    Key: {
                        id: id.id
                    },
                };
                console.log("params ", params);
                const { Item } = yield dynamoDB.get(params).promise();
                console.log("Item ", Item);
                if (Item == undefined) {
                    console.log(`No User Found For Given ID For Update `);
                    throw new Error(`No User Found For Given ID For Update`);
                }
                const updateUserParams = {
                    TableName: "GraphqlServerlessCRUD",
                    Key: {
                        id: id.id
                    },
                    UpdateExpression: "set isUpdated = :isUpdated , username = :username , email = :email , password = :password",
                    ExpressionAttributeValues: {
                        ':isUpdated': true,
                        ':username': id.input.username,
                        ':email': id.input.email,
                        ':password': id.input.password
                    },
                    ReturnValues: "ALL_NEW",
                };
                console.log("updateUserParams ", updateUserParams);
                let user = yield dynamoDB.update(updateUserParams).promise();
                console.log("Updated user ", user);
                let userData = user.Attributes;
                console.log("userData : ", userData);
                userData === null || userData === void 0 ? true : delete userData.password;
                return userData;
            }
            catch (e) {
                console.log("Error For  getUserById  ", e.message);
                throw (e);
            }
        }),
        DeleteUser: (_, id) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log("id ", id.id);
                const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
                const params = {
                    TableName: "GraphqlServerlessCRUD",
                    Key: {
                        id: id.id
                    },
                };
                console.log("params ", params);
                const { Item } = yield dynamoDB.get(params).promise();
                console.log("Item ", Item);
                if (Item == undefined) {
                    console.log(`No User Found For Given ID For Update `);
                    throw new Error(`No User Found For Given ID For Update`);
                }
                return dynamoDB.delete({ TableName: "GraphqlServerlessCRUD", Key: { id: id.id } }).promise().then((res) => {
                    return 'User Deleted Successfully!';
                });
            }
            catch (e) {
                console.log("Errror", e.message);
                throw (e);
            }
        }),
    }
};


/***/ }),

/***/ "./src/schema/schema.ts":
/*!******************************!*\
  !*** ./src/schema/schema.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeDefs = void 0;
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
exports.typeDefs = (0, apollo_server_lambda_1.gql) `
type Query {
   testMessage: String
}

type User {
    id: ID
    username: String
    email: String
    password: String
    createdAt: String
    isUpdated: Boolean
}

input createuser {
    username: String
    email: String
    password: String
}

input updateUser {
    username: String
    email: String
    password: String
}


type Query {
    getUsers: [User]
    getUserById(id: ID): User
}


type Mutation {
    createUser(input: createuser): User
    UpdateUser(id:ID! ,input:updateUser):User
    DeleteUser(id:ID!):String
}`;


/***/ }),

/***/ "apollo-server-lambda":
/*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("apollo-server-lambda");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("aws-sdk");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.graphqlHandler = void 0;
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
const resolver_1 = __webpack_require__(/*! ./resolver/resolver */ "./src/resolver/resolver.ts");
const schema_1 = __webpack_require__(/*! ./schema/schema */ "./src/schema/schema.ts");
const apolloServer = new apollo_server_lambda_1.ApolloServer({ resolvers: resolver_1.resolvers, typeDefs: schema_1.typeDefs, formatError: (err) => ({ message: err.message }), });
exports.graphqlHandler = apolloServer.createHandler();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBOzs7Ozs7Ozs7Ozs7OztBQzFMQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUNBOzs7Ozs7Ozs7OztBQ3ZDQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBRUE7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3NlcnZlcmxlc3MtZ3JhcGhxbC8uL3NyYy9yZXNvbHZlci9yZXNvbHZlci50cyIsIndlYnBhY2s6Ly9zZXJ2ZXJsZXNzLWdyYXBocWwvLi9zcmMvc2NoZW1hL3NjaGVtYS50cyIsIndlYnBhY2s6Ly9zZXJ2ZXJsZXNzLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiIiwid2VicGFjazovL3NlcnZlcmxlc3MtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcImF3cy1zZGtcIiIsIndlYnBhY2s6Ly9zZXJ2ZXJsZXNzLWdyYXBocWwvZXh0ZXJuYWwgY29tbW9uanMgXCJiY3J5cHRqc1wiIiwid2VicGFjazovL3NlcnZlcmxlc3MtZ3JhcGhxbC9leHRlcm5hbCBjb21tb25qcyBcInV1aWRcIiIsIndlYnBhY2s6Ly9zZXJ2ZXJsZXNzLWdyYXBocWwvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2VydmVybGVzcy1ncmFwaHFsLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHY0IH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgQVdTIGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0IGJjcnlwdGpzIGZyb20gJ2JjcnlwdGpzJztcbmV4cG9ydCBpbnRlcmZhY2UgVXNlckRldGFpbHMge1xuICAgIGlkPzogc3RyaW5nLFxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXG4gICAgZW1haWw6IHN0cmluZyxcbiAgICAvLyBwYXNzd29yZDogc3RyaW5nLFxuICAgIGNyZWF0ZWRBdDogRGF0ZSxcbiAgICBpc1VwZGF0ZWQ6IGJvb2xlYW5cbn1cblxuXG5cbmV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgdGVzdE1lc3NhZ2U6ICgpID0+ICdXZWxjb21lLiEgU2VydmVybGVzcy1HcmFwaFFMIENSVUQgT3BlcmF0aW9u8J+TnScsXG4gICAgICAgIGdldFVzZXJzOiBhc3luYyAoKTpQcm9taXNlPFVzZXJEZXRhaWxzW10gfCBzdHJpbmc+ID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZHluYW1vREIgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlcnMgPSBhd2FpdCBkeW5hbW9EQi5zY2FuKHsgVGFibGVOYW1lOiBcIkdyYXBocWxTZXJ2ZXJsZXNzQ1JVRFwiIH0pLnByb21pc2UoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXJzIFwiLCB1c2Vycyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgdXNlckRhdGEgPSB1c2Vycy5JdGVtcztcbiAgICAgICAgICAgICAgICBpZiAoIXVzZXJEYXRhPy5sZW5ndGggfHwgdXNlckRhdGEubGVuZ3RoID09MCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgTk8gVXNlcnMgRm91bmRgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yIChgTk8gVXNlcnMgRm91bmQgYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNlckRhdGEgXCIsIHVzZXJEYXRhKTtcbiAgICAgICAgICAgICAgICB1c2VyRGF0YSA9IHVzZXJEYXRhLmZpbHRlcigoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW1bXCJwYXNzd29yZFwiXVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXJEYXRhIGFzIFVzZXJEZXRhaWxzW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIEZvciBnZXRVc2VycyAgXCIsIGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgKGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG4gICAgICAgIGdldFVzZXJCeUlkOiBhc3luYyAoXzogYW55LCBpZDogYW55KTogUHJvbWlzZTxVc2VyRGV0YWlscyB8IGFueT4gPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlkIFwiLCBpZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZC5pZFwiLCBpZC5pZCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBkeW5hbW9EQiA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogXCJHcmFwaHFsU2VydmVybGVzc0NSVURcIixcbiAgICAgICAgICAgICAgICAgICAgS2V5OiB7IGlkOiBpZC5pZCB9LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwYXJhbXMgXCIsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgbGV0IHsgSXRlbSB9ID0gYXdhaXQgZHluYW1vREIuZ2V0KHBhcmFtcykucHJvbWlzZSgpO1xuICAgICAgICAgICAgICAgIGlmIChJdGVtID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgTm8gVXNlciBGb3VuZCBGb3IgR2l2ZW4gSUQgIGApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgKGBObyBVc2VyIEZvdW5kIEZvciBHaXZlbiBJRGApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkl0ZW0gXCIsIEl0ZW0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBJdGVtW1wicGFzc3dvcmRcIl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIEl0ZW07XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIEZvciAgZ2V0VXNlckJ5SWQgIFwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHRocm93IChlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSxcbiAgICBNdXRhdGlvbjoge1xuICAgICAgICBjcmVhdGVVc2VyOiBhc3luYyAoXzogYW55LCBpbnB1dDogYW55KTogUHJvbWlzZTxVc2VyRGV0YWlscyB8IGFueT4gPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlucHV0IFwiLCBpbnB1dC5pbnB1dCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgZHluYW1vREIgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNVcGRhdGVkPWZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWRBdCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHY0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlcm5hbWUgPWlucHV0LmlucHV0LnVzZXJuYW1lO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVtYWlsID1pbnB1dC5pbnB1dC5lbWFpbDtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXNzd29yZCA9IGF3YWl0IGJjcnlwdGpzLmhhc2goaW5wdXQuaW5wdXQucGFzc3dvcmQsMTApOyAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0ge1xuICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZEF0LFxuICAgICAgICAgICAgICAgICAgICBpc1VwZGF0ZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGR5bmFtb0RCLnB1dCh7XG4gICAgICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogXCJHcmFwaHFsU2VydmVybGVzc0NSVURcIixcbiAgICAgICAgICAgICAgICAgICAgSXRlbTogdXNlclxuICAgICAgICAgICAgICAgIH0pLnByb21pc2UoKVxuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIFwiLCB1c2VyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge2lkLHVzZXJuYW1lLGVtYWlsLGNyZWF0ZWRBdCxpc1VwZGF0ZWR9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIEZvciBjcmVhdGVVc2VyIFwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHRocm93IChlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBVcGRhdGVVc2VyOiBhc3luYyAoXzogYW55LCBpZDogYW55LCBpbnB1dDogYW55KTogUHJvbWlzZTxVc2VyRGV0YWlscyB8IGFueT4gPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkeW5hbW9EQiA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogXCJHcmFwaHFsU2VydmVybGVzc0NSVURcIixcbiAgICAgICAgICAgICAgICAgICAgS2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaWQuaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFyYW1zIFwiLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgSXRlbSB9ID0gYXdhaXQgZHluYW1vREIuZ2V0KHBhcmFtcykucHJvbWlzZSgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXRlbSBcIixJdGVtKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoSXRlbSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE5vIFVzZXIgRm91bmQgRm9yIEdpdmVuIElEIEZvciBVcGRhdGUgYCk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciAoYE5vIFVzZXIgRm91bmQgRm9yIEdpdmVuIElEIEZvciBVcGRhdGVgKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZVVzZXJQYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogXCJHcmFwaHFsU2VydmVybGVzc0NSVURcIixcbiAgICAgICAgICAgICAgICAgICAgS2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaWQuaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgVXBkYXRlRXhwcmVzc2lvbjpcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2V0IGlzVXBkYXRlZCA9IDppc1VwZGF0ZWQgLCB1c2VybmFtZSA9IDp1c2VybmFtZSAsIGVtYWlsID0gOmVtYWlsICwgcGFzc3dvcmQgPSA6cGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJzppc1VwZGF0ZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzp1c2VybmFtZSc6IGlkLmlucHV0LnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzplbWFpbCc6IGlkLmlucHV0LmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzpwYXNzd29yZCc6IGlkLmlucHV0LnBhc3N3b3JkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFJldHVyblZhbHVlczogXCJBTExfTkVXXCIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZVVzZXJQYXJhbXMgXCIsIHVwZGF0ZVVzZXJQYXJhbXMpO1xuICAgICAgICAgICAgICAgIGxldCB1c2VyID0gYXdhaXQgZHluYW1vREIudXBkYXRlKHVwZGF0ZVVzZXJQYXJhbXMpLnByb21pc2UoKTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRlZCB1c2VyIFwiLCB1c2VyKTtcbiAgICAgICAgICAgICAgICBsZXQgdXNlckRhdGEgPSB1c2VyLkF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyRGF0YSA6IFwiLHVzZXJEYXRhKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdXNlckRhdGE/LnBhc3N3b3JkXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXJEYXRhO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBGb3IgIGdldFVzZXJCeUlkICBcIiwgZS5tZXNzYWdlKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhyb3cgKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBEZWxldGVVc2VyOiBhc3luYyAoXzphbnksaWQ6IGFueSk6IFByb21pc2U8YW55PiA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaWQgXCIsIGlkLmlkKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGR5bmFtb0RCID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IFwiR3JhcGhxbFNlcnZlcmxlc3NDUlVEXCIsXG4gICAgICAgICAgICAgICAgICAgIEtleToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLmlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhcmFtcyBcIiwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IEl0ZW0gfSA9IGF3YWl0IGR5bmFtb0RCLmdldChwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkl0ZW0gXCIsSXRlbSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKEl0ZW0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBObyBVc2VyIEZvdW5kIEZvciBHaXZlbiBJRCBGb3IgVXBkYXRlIGApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgKGBObyBVc2VyIEZvdW5kIEZvciBHaXZlbiBJRCBGb3IgVXBkYXRlYClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGR5bmFtb0RCLmRlbGV0ZSh7VGFibGVOYW1lOlwiR3JhcGhxbFNlcnZlcmxlc3NDUlVEXCIsS2V5OntpZDppZC5pZH19KS5wcm9taXNlKCkudGhlbigocmVzKSA9PntcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdVc2VyIERlbGV0ZWQgU3VjY2Vzc2Z1bGx5ISdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJycm9yXCIsIGUubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICB9XG5cbn07IiwiaW1wb3J0IHsgZ3FsIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1sYW1iZGEnO1xuXG5leHBvcnQgY29uc3QgdHlwZURlZnMgPSBncWxgXG50eXBlIFF1ZXJ5IHtcbiAgIHRlc3RNZXNzYWdlOiBTdHJpbmdcbn1cblxudHlwZSBVc2VyIHtcbiAgICBpZDogSURcbiAgICB1c2VybmFtZTogU3RyaW5nXG4gICAgZW1haWw6IFN0cmluZ1xuICAgIHBhc3N3b3JkOiBTdHJpbmdcbiAgICBjcmVhdGVkQXQ6IFN0cmluZ1xuICAgIGlzVXBkYXRlZDogQm9vbGVhblxufVxuXG5pbnB1dCBjcmVhdGV1c2VyIHtcbiAgICB1c2VybmFtZTogU3RyaW5nXG4gICAgZW1haWw6IFN0cmluZ1xuICAgIHBhc3N3b3JkOiBTdHJpbmdcbn1cblxuaW5wdXQgdXBkYXRlVXNlciB7XG4gICAgdXNlcm5hbWU6IFN0cmluZ1xuICAgIGVtYWlsOiBTdHJpbmdcbiAgICBwYXNzd29yZDogU3RyaW5nXG59XG5cblxudHlwZSBRdWVyeSB7XG4gICAgZ2V0VXNlcnM6IFtVc2VyXVxuICAgIGdldFVzZXJCeUlkKGlkOiBJRCk6IFVzZXJcbn1cblxuXG50eXBlIE11dGF0aW9uIHtcbiAgICBjcmVhdGVVc2VyKGlucHV0OiBjcmVhdGV1c2VyKTogVXNlclxuICAgIFVwZGF0ZVVzZXIoaWQ6SUQhICxpbnB1dDp1cGRhdGVVc2VyKTpVc2VyXG4gICAgRGVsZXRlVXNlcihpZDpJRCEpOlN0cmluZ1xufWA7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhd3Mtc2RrXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJjcnlwdGpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IEFwb2xsb1NlcnZlciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItbGFtYmRhJztcbmltcG9ydCB7IHJlc29sdmVycyB9IGZyb20gJy4vcmVzb2x2ZXIvcmVzb2x2ZXInO1xuaW1wb3J0IHsgdHlwZURlZnMgfSBmcm9tICcuL3NjaGVtYS9zY2hlbWEnO1xuXG5jb25zdCBhcG9sbG9TZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgcmVzb2x2ZXJzLCB0eXBlRGVmcywgZm9ybWF0RXJyb3I6IChlcnIpID0+ICh7IG1lc3NhZ2U6IGVyci5tZXNzYWdlIH0pLCB9KTtcblxuZXhwb3J0IGNvbnN0IGdyYXBocWxIYW5kbGVyID0gYXBvbGxvU2VydmVyLmNyZWF0ZUhhbmRsZXIoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=