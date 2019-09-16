Assignment 3 - Persistence: Two-tier Web Application with Flat File Database, Express server, and CSS template
===
## Polyline Art Generator
https://winnycheng-a3.glitch.me/

The website allows user to either sign in if they have an account or create a new account. Once the user is signed in they can create a polyline art simply by inputing the number vertices, the number of triangles to draw and a name. The user can view all the polylines drawings ever generated but can only edit or delete their own polyline drawings. If the user is the admin, they can edit and delete any thing in the database.

The goal was to create an application with a server using express and have a persistant database. The greatest challenges was understanding the workings of passport local authentication and the workings and location of the database file. Glitch does automatically update with a database file so the file was not visible till the code was pushed and then pulled. I chose passport local authentication and lowdb database for the authentication and database because they were discussed in class and I have no other knowledge of other authentication systems nor databases. I used PURE as it had a template layout I liked. I added a few little things to the CSS such as adding borders to the input and button tags, placing and formatting the table, and placing the canvas item to the right of the inputs.  

Here are some users I created:
- **username**: admin, **password**: iammi
- **username**: winny, **password**: iloveanime
- **username**: shine, **password**: sunshine

**Express Middleware Packages**
- express: used for server framework, making requests like post and get
- express.static: serve static files
- passport: authentication for logins and cookies
- body-parser: parses the data passed in with the request
- express-session: establish server-based sessions

## Technical Achievements
- **Create User**: I added a list of users and passwords to the database so new users can be created
- **Logout**: A logout button was implemented allowing users to logout (brings them back to login screen)
- **Error Checking**: User cannot create a new account with a username that already exists, users cannot input negative values for number of vertices and number of triangles.

### Design/Evaluation Achievements
- **Design Achievement 1**: Implemented a CSS template layout and editing some of it to fit my webpage

Ching Wing (Winny) Cheng 
