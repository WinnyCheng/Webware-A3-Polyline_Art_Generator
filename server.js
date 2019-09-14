const express = require( 'express' ),
      app = express(),
      session = require( 'express-session' ),
      passport = require( 'passport' ),
      local = require( 'passport-local' ).Strategy,
      bodyParser = require( 'body-parser' ),
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { "vertices": 8, 
    "numPoly": 12,
    "name": "Cube",
    "points": [[-0.5, -0.5, -0.5, 1], 
               [0.5, -0.5, -0.5, 1], 
               [0.5, 0.5, -0.5, 1], 
               [-0.5, 0.5, -0.5, 1], 
               [-0.5, -0.5, 0.5, 1], 
               [0.5, -0.5, 0.5, 1],
               [0.5, 0.5, 0.5, 1],
               [-0.5, 0.5, 0.5, 1]],
   "triangles":[3, 2, 1, 3, 1, 0, 6, 7, 4, 6, 4, 5, 5, 1, 2, 5, 2, 6, 0, 4,
                7, 0, 7, 3, 6, 2, 3, 6, 3, 7, 4, 0, 1, 4, 1, 5]},
  
  { "vertices": 4, 
    "numPoly": 4, 
    "name": "Triangular Pyramid", 
    "points": [[0.0, 1.0, -0.5, 1],
               [-1.0, -0.5, -0.5, 1],
               [1.0, -0.5, -0.5, 1],
               [0.0, 0.0, 0.5, 1]],
    "triangles": [0, 3, 2, 2, 3, 1, 1, 3, 0, 0, 1, 2]},
  { "vertices": 5, 
    "numPoly": 5, 
    "name": "This is Art!", 
    "points": randPoints(5),
    "triangles": randTri(5, 5)},
]

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

const users = [
  {username: 'iammi', password: 'asianmi'},
  {username: 'youareyu', password: 'asianyu'},
]

const myLocalStrategy = function( username, password, done ){
  const user = users.find( __user => __user.username === username )
  if( user === undefined )
    return done(null, false, { message: 'user not found'})
  else if( user.password === password )
    return done( null, { username, password })
  else
    return done(null, false, { message: 'incorrect password' })
}

passport.use( new local( myLocalStrategy ))
passport.initialize()
             
app.use( express.static(dir) )
app.use( bodyParser.json() )

app.get( '/getDrawings', function( request, response) {
  const type = mime.getType( appdata ) 
  response.writeHeader(200, { 'Content-Type': type })
  response.end(JSON.stringify(appdata));
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
    "triangles": triangles
  }

  appdata.push(drawing)
  
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  response.end()
})
app.post( '/delete', function( request, response ) {
  let index = request.body.index
  appdata.splice(index, 1)
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  response.end()
})
app.post( '/update', function( request, response ) {
  let newData = request.body
  let idx = newData.idx

  appdata[idx].vertices = newData.vertices
  appdata[idx].numPoly = newData.numPoly
  appdata[idx].name = newData.name
  appdata[idx].points = randPoints(newData.vertices)
  appdata[idx].triangles = randTri(newData.numPoly, newData.vertices)
  
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  response.end()
})
app.post( '/login', passport.authenticate( 'local' ), function( request, response ) {
  console.log( 'user:', request.user)
  console.log( 'password:', request.pass)
  response.json( { status: true })
})

app.listen( process.env.PORT || port )
