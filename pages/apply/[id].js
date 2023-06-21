import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import FormData from "form-data"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  location: z.string().min(1, "Please enter your location"),
  coverLetter: z.string().min(1, "Please enter your cover letter"),
  expectedCTC: z.string().min(1, "Please enter your expected CTC"),
  resume: z
    .object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
    })
    .nullable()
    .optional(),
})

const Apply = () => {
  const router = useRouter()
  const { id } = router.query
  const [jobDetails, setJobDetails] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    coverLetter: "",
    expectedCTC: "",
    resume: null,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/jobs/${id}`)
        const jobDetailsData = response.data
        setJobDetails(jobDetailsData)
      } catch (error) {
        console.error(error)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleChange = (e) => {
    if (e.target.name === "resume") {
      setFormData((prevData) => ({
        ...prevData,
        resume: e.target.files[0],
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const validatedData = schema.parse(formData)

      const formDataWithResume = new FormData()
      formDataWithResume.append("resume", validatedData.resume)
      formDataWithResume.append("name", validatedData.name)
      formDataWithResume.append("email", validatedData.email)
      formDataWithResume.append("location", validatedData.location)
      formDataWithResume.append("coverLetter", validatedData.coverLetter)
      formDataWithResume.append("expectedCTC", validatedData.expectedCTC)

      const response = await axios.post(
        `http://localhost:3001/api/jobs/${id}/apply`,
        formDataWithResume
      )

      console.log(response.data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap = error.flatten().fieldErrors
        const validationErrors = {}

        for (const field in errorMap) {
          validationErrors[field] = errorMap[field][0]
        }

        setErrors(validationErrors)
      } else {
        console.error(error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      { jobDetails ? (
        <div>
          <h2 className="text-2xl font-bold mb-4 max-w-3xl mx-auto">
            This Job Application is for { jobDetails.title } at { jobDetails.company }
          </h2>
          <p className="text-sm font-bold mb-4 max-w-md mx-auto">
            { jobDetails.description }
          </p>
          <form onSubmit={ handleSubmit } className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Enter your name"
                value={ formData.name }
                onChange={ handleChange }
              />
              { errors.name && <p className="text-red-500">{ errors.name }</p> }
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Enter your email"
                value={ formData.email }
                onChange={ handleChange }
              />
              { errors.email && <p className="text-red-500">{ errors.email }</p> }
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block mb-1 font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Enter your location"
                value={ formData.location }
                onChange={ handleChange }
              />
              { errors.location && <p className="text-red-500">{ errors.location }</p> }
            </div>
            <div className="mb-4">
              <label htmlFor="coverLetter" className="block mb-1 font-medium text-gray-700">
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Write your cover letter"
                rows="4"
                value={ formData.coverLetter }
                onChange={ handleChange }
              ></textarea>
              { errors.coverLetter && (
                <p className="text-red-500">{ errors.coverLetter }</p>
              ) }
            </div>
            <div className="mb-4">
              <label htmlFor="expectedCTC" className="block mb-1 font-medium text-gray-700">
                Expected CTC
              </label>
              <input
                type="text"
                id="expectedCTC"
                name="expectedCTC"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Enter your expected CTC"
                value={ formData.expectedCTC }
                onChange={ handleChange }
              />
              { errors.expectedCTC && (
                <p className="text-red-500">{ errors.expectedCTC }</p>
              ) }
            </div>
            <div className="mb-4">
              <label htmlFor="resume" className="block mb-1 font-medium text-gray-700">
                Resume
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                className="border border-gray-300 p-2 w-full rounded-md"
                accept=".pdf,.doc,.docx"
                onChange={ handleChange }
              />
              { errors.resume && <p className="text-red-500">{ errors.resume }</p> }
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      ) }
    </div>
  )
}

export default Apply
