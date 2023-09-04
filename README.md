## GroupChat

A node.js app for Group chat.

## Server features

1. Sets up middleware for user authentication (used JWT authenticatioin).
2. Connects to the MysqlDB using sequelize for CRUD operations.
3. Used Express server to serve API endpoints.
4. Integrated AWS to manage files.
5. Intergrated sendInBlue to send mail.
6. Used socket to connect realtime chat.

## API endpoints


1. **/user/signup**  - To register new users.
2. **/user/login**  - For login users.
3. **/group/create-group**  - To create Group.
4. **/group/get-groups**  - To get groups.
5. **/group/get-users**  - To get all users of group.
6. **/group/add-chat**  - To add chat in a group.
7. **/password/updatePassword/:resetPasswordid**  - To upadate the password to DB.
8. **/password/resetPassword/:id**  - TO reset the password.
9. **/password/forgotpassword**  - To use when you forgot password.
10. **/group/add-users**  - To add users to group.
11. **/group/remove-users**  - To remove users from group.
12. **/group/get-chat/:groupid**  - To get chat of particular group.
13. **/group/find-user**  - To find user in group.

**Note** : API endpoints '**/group/create-group**', '**/group/get-groups**', '**/group/get-users**', '**/group/add-chat**', '**/password/updatePassword/:resetPasswordid**', '**/password/resetPassword/:id**', '**/password/forgotpassword**', '**/group/add-users**', '**/group/remove-users**', '**/group/get-chat/:groupid**', '**/group/find-user**' needs to be authenticated by JWT token to work. The client needs to send the JSON web token through the Authorization header.

## Dependencies

* Cors (Any origin works in our API)
* Express
* sequelize(to connect to mysql)
* Mysql (schemas)
* dotenv (get the .env file working with environment variables)
* bcrypt (Hash our password) 
* JWT (Jason Web Tokens)
* body parser(to parse the incoming body requests)
* aws (To manage files)

 
