require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const Note = require('./models/note')
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))


let notes = [
  // {
  //   id: 1,
  //   content: "HTML is easy",
  //   important: true
  // },
  // {
  //   id: 2,
  //   content: "Browser can execute only JavaScript",
  //   important: false
  // },
  // {
  //   id: 3,
  //   content: "GET and POST are the most important methods of HTTP protocol",
  //   important: true
  // }
]

  app.get('/', (req,res) => {
    res.send('<h1>Hello Earthair</h1>')
    console.log('GET / received',Date())
  })

  app.get('/api/notes', (req,res) => {
    Note.find({}).then(notes => {
      res.json(notes)
    })
    console.log('GET /api/notes received',Date())
  })

  app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        //console.log('Palvelin sanoo: 404 :(')
        response.status(404).end()
      }
    })
    .catch(error => {
      //console.log(error)
      //const syy = new mongoose.Error(error.message)
      //console.log(syy)
      //console.log(syy instanceof mongoose.Error.CastError )
      //console.log(error instanceof mongoose.Error.CastError )
      // omaa testiä
      if (error instanceof mongoose.Error.CastError) {
        console.log('CastError havaittu')
        response.status(400).send({ error: 'malformatted id'})
      }
      else {
      response.status(500).end()
      }
    })
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    console.log('DELETE',id)
    response.status(204).end()
  })


  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }

  app.post('/api/notes', (request,response) => {
    console.log('POST')
    console.log(request.headers)

    const body = request.body
    
    if (body.content === undefined) {
      return response.status(400).json({error: 'content missing'})
    }

    const note = new Note({
      content: body.content,
      important: body.important || false,
      //id: generateId(),
    })
    //notes = notes.concat(note)
    note.save().then(savedNote => {
      response.json(note)
    })
  })
    
  // middleware routejen jälkeen
  // näin ei ole https://github.com/fullstack-hy2020/part3-notes-backend/blob/part3-3/index.js ??
  // const unknownEndpoint = (request, response) => {
  //   response.status(404).send({error: 'unknown endpoint'})
  // }

  // tämä vain tänne ja tuo ylös
  app.use(unknownEndpoint)
  

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
