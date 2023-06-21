const express = require('express')
const router = express.Router()
const multer = require('multer')
const Job = require('../models/Job')
const User = require('../models/User')

// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed'))
  }
}

const upload = multer({ storage, fileFilter })

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
    res.json(jobs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }
    res.json(job)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/jobs
router.post('/', async (req, res) => {
  try {
    const { title, company, location, salary, description } = req.body
    const job = new Job({
      title,
      company,
      location,
      salary,
      description,

    })
    await job.save()

    res.status(201).json(job)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/jobs/:id/apply
router.post('/:id/apply', upload.single('resume'), async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, location, coverLetter, expectedCTC } = req.body
    const resumePath = req.file.path

    const job = await Job.findById(id)
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    const user = new User({
      name,
      email,
      location,
      coverLetter,
      expectedCTC,
      resume: resumePath,
      jobID: id,
    })
    await user.save()

    res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
