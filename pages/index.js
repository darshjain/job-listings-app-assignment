import React from 'react'
import axios from 'axios'
import Link from 'next/link'


const Home = ({ jobs }) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        { jobs.map((job) => (
          <div key={ job._id } className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">{ job.title }</h2>
            <p className="text-gray-600 mb-4">{ job.company }</p>
            <p className="text-gray-700">{ job.description }</p>
            <p className="text-gray-500 mt-4">Location: { job.location }</p>
            <p className="text-gray-500">Salary: { job.salary }</p>
            <Link href={ `/apply/${job._id}` }>
              <p className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block">Apply Now</p>
            </Link>
          </div>
        )) }
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const response = await axios.get('http://localhost:3001/api/jobs')
    const jobs = response.data
    return {
      props: { jobs },
    }
  } catch (error) {
    console.error(error)
    return {
      props: { jobs: [] },
    }
  }
}

export default Home
