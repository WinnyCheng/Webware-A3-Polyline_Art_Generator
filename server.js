const express = require( 'express' ),
      app = express(),
      session = require( 'express-session' ),
      passport = require( 'passport' ),
      local = require( 'passport-local' ).Strategy,
      bodyParser = require( 'body-parser' ),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000,
      low = require('lowdb'),
      FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

const appdata = [
  { vertices: 8, 
    numPoly: 12,
    name: "Cube",
    points: [[-0.5, -0.5, -0.5, 1], 
             [0.5, -0.5, -0.5, 1], 
             [0.5, 0.5, -0.5, 1], 
             [-0.5, 0.5, -0.5, 1], 
             [-0.5, -0.5, 0.5, 1], 
             [0.5, -0.5, 0.5, 1],
             [0.5, 0.5, 0.5, 1],
             [-0.5, 0.5, 0.5, 1]],
    triangles: [3, 2, 1, 3, 1, 0, 6, 7, 4, 6, 4, 5, 5, 1, 2, 5, 2, 6, 0, 4,
                7, 0, 7, 3, 6, 2, 3, 6, 3, 7, 4, 0, 1, 4, 1, 5],
    user: "admin"},
  { vertices: 4, 
    numPoly: 4, 
    name: "Triangular Pyramid", 
    points: [[0.0, 1.0, -0.5, 1],
             [-1.0, -0.5, -0.5, 1],
             [1.0, -0.5, -0.5, 1],
             [0.0, 0.0, 0.5, 1]],
    triangles: [0, 3, 2, 2, 3, 1, 1, 3, 0, 0, 1, 2],
    user: "admin"}
]
const users = [
  {username: 'admin', password: 'iammi'}
]
db.defaults({ post: appdata, user: users }).write()

function randPoints(numPoints){
  let pointlist = []
  for(let i = 0; i < numPoints; i++){
    let point = []
    for(let j = 0; j < 3; j++){
      point.push(Math.random()*2 - 1)
    }
    point.push(1)
    pointlist.push(point)
  }
  return pointlist
}
function randTri(numPoly, numPoints){
  let triangles = []
  for(let i = 0; i < numPoly*3; i++){
    triangles.push(Math.floor(Math.random()*numPoints))
  }
  return triangles
}
             
app.use( express.static(dir) )
app.use( bodyParser.json() )

const myLocalStrategy = function( username, password, done ){
  const user = users.find( __user => __user.username === username )
  if( user === undefined ){
    return done(null, false, { message: 'user not found'})}
  else if( user.password === password )
    return done( null, { username, password })
  else
    return done(null, false, { message: 'incorrect password' })
}

passport.use( new local( myLocalStrategy ))
app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) )
app.use( passport.initialize() )
app.use( passport.session() )

passport.serializeUser( ( user, done ) => done( null, user.username ) )

passport.deserializeUser( ( username, done ) => {
  const user = users.find( u => u.username === username )
  console.log( 'deserializing:', username )
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})

app.get('/getDrawings', (req, res) => {
  const data = db.get('post').value()
  const type = mime.getType( data ) 
  res.writeHeader(200, { 'Content-Type': type })
  res.end(JSON.stringify(data));
})
app.post( '/generate', function( request, response ) {
  let data = request.body
  //generate random number for points
  let points = randPoints(data.vertices)
  let triangles = randTri(data.numPoly, data.vertices)

  let drawing = {
    "vertices": data.vertices, 
    "numPoly": data.numPoly, 
    "name": data.name,
    "points": points,
    "triangles": triangles,
    "user": data.user
  }

  db.get('post').push(drawing).write()
  
  console.log(db.get('post').value())
  
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  response.end()
})
app.post( '/delete', function( request, response ) {
  let object = db.get('post').value()[request.body.index]
  db.get('post').remove(object).write()
  
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  response.end()
})
app.post( '/update', function( request, response ) {
  let newData = request.body
  let idx = newData.idx
  let object = db.get('post').value()[idx]
  
  db.get('post').find(object).assign({
    vertices: newData.vertices,
    numPoly: newData.numPoly,
    name: newData.name,
    points: randPoints(newData.vertices),
    triangles: randTri(newData.numPoly, newData.vertices)
  }).write()
  
  console.log(db.get('post').value())
  
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  response.end()
})

app.post( '/login',
         passport.authenticate( 'local'),
         function( request, response ) {
            response.json( { status: true })
          })

app.post('/test', function( req, res ) {
  console.log( 'authenticate with cookie?', req.user )
  res.json({ status:'success' })
})

app.listen( process.env.PORT || port )
