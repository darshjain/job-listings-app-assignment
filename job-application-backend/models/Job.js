const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  company: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  salary: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  }
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job
