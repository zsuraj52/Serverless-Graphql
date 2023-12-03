import { v4 } from 'uuid';
import AWS from 'aws-sdk';
import bcryptjs from 'bcryptjs';


export interface UserDetails {
    id?: string,
    username: string,
    email: string,
    // password: string,
    createdAt: Date,
    isUpdated: boolean
}



export const resolvers = {
    Query: {
        testMessage: () => 'Welcome.! Serverless-GraphQL CRUD Operation📝',
        getUsers: async ():Promise<UserDetails[] | string> => {
            try {
                const dynamoDB = new AWS.DynamoDB.DocumentClient();
                const users = await dynamoDB.scan({ TableName: "GraphqlServerlessCRUD" }).promise();
                console.log("users ", users);

                let userData = users.Items;
                if (!userData?.length || userData.length ==0) {
                    console.log(`NO Users Found`);
                    throw new Error (`NO Users Found `);
                }
                console.log("userData ", userData);
                userData = userData.filter((item)=>{
                    delete item["password"]
                    return item
                })
                return userData as UserDetails[]
            }
            catch (e: any) {
                console.log("Error For getUsers  ", e.message);
                throw (e);
            }

        },
        getUserById: async (_: any, id: any): Promise<UserDetails | any> => {
            try {
                console.log("id ", id);
                console.log("id.id", id.id);

                const dynamoDB = new AWS.DynamoDB.DocumentClient();
                const params = {
                    TableName: "GraphqlServerlessCRUD",
                    Key: { id: id.id },
                };
                console.log("params ", params);
                let { Item } = await dynamoDB.get(params).promise();
                if (Item == undefined) {
                    console.log(`No User Found For Given ID  `);
                    throw new Error (`No User Found For Given ID`);
                }
                console.log("Item ", Item);
                delete Item["password"];
                return Item;

            }
            catch (e: any) {
                console.log("Error For  getUserById  ", e.message);
                throw (e);
            }

        }
    },
    Mutation: {
        createUser: async (_: any, input: any): Promise<UserDetails | any> => {
            try {
                console.log("input ", input.input);
                
                const dynamoDB = new AWS.DynamoDB.DocumentClient();
                const isUpdated=false;
                const createdAt = new Date().toISOString();
                const id = v4();
                const username =input.input.username;
                const email =input.input.email;
                const password = await bcryptjs.hash(input.input.password,10);              

                const user = {
                    id,
                    username,
                    email,
                    password,
                    createdAt,
                    isUpdated: false
                };

                await dynamoDB.put({
                    TableName: "GraphqlServerlessCRUD",
                    Item: user
                }).promise()

                console.log("User ", user);
                return {id,username,email,createdAt,isUpdated}

            }
            catch (e: any) {
                console.log("Error For createUser ", e.message);
                throw (e.message);
            }
        },
        UpdateUser: async (_: any, id: any, input: any): Promise<UserDetails | any> => {
            try {
                const dynamoDB = new AWS.DynamoDB.DocumentClient();
                const params = {
                    TableName: "GraphqlServerlessCRUD",
                    Key: {
                        id: id.id
                    },
                };
                console.log("params ", params);
                const { Item } = await dynamoDB.get(params).promise();
                console.log("Item ",Item);
                
                if (Item == undefined) {
                    console.log(`No User Found For Given ID For Update `);
                    throw new Error (`No User Found For Given ID For Update`)
                }

                const updateUserParams = {
                    TableName: "GraphqlServerlessCRUD",
                    Key: {
                        id: id.id
                    },
                    UpdateExpression:
                        "set isUpdated = :isUpdated , username = :username , email = :email , password = :password",
                    ExpressionAttributeValues: {
                        ':isUpdated': true,
                        ':username': id.input.username,
                        ':email': id.input.email,
                        ':password': id.input.password
                    },
                    ReturnValues: "ALL_NEW",
                };
                console.log("updateUserParams ", updateUserParams);
                let user = await dynamoDB.update(updateUserParams).promise();

                console.log("Updated user ", user);
                let userData = user.Attributes;
                console.log("userData : ",userData);
                delete userData?.password
                return userData;

            }
            catch (e: any) {
                console.log("Error For  getUserById  ", e.message);                
                throw (e);
            }
        },
        DeleteUser: async (_:any,id: any): Promise<any> => {
            try {
                console.log("id ", id.id);

                const dynamoDB = new AWS.DynamoDB.DocumentClient();

                const params = {
                    TableName: "GraphqlServerlessCRUD",
                    Key: {
                        id: id.id
                    },
                };
                console.log("params ", params);
                const { Item } = await dynamoDB.get(params).promise();
                console.log("Item ",Item);
                
                if (Item == undefined) {
                    console.log(`No User Found For Given ID For Update `);
                    throw new Error (`No User Found For Given ID For Update`)
                }
                return dynamoDB.delete({TableName:"GraphqlServerlessCRUD",Key:{id:id.id}}).promise().then((res) =>{
                    return 'User Deleted Successfully!'
                })
            }
            catch (e: any) {
                console.log("Errror", e.message);
                throw (e);
            }
        },


    }

};