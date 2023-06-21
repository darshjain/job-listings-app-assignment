import React from 'react'
import axios from 'axios'
import Link from 'next/link'

const Home = ({ jobs }) => {
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <p className="text-white font-bold text-xl">Job Board</p>
          </Link>
          <Link href="/apply">
            <p className="text-white">Support</p>
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          { jobs.map((job) => (
            <Link key={ job._id } href={ `/apply/${job._id}` }>
              <div className="bg-white p-4 rounded shadow hover:bg-gray-100 transition-colors cursor-pointer">
                <h2 className="text-xl font-bold mb-2">{ job.title }</h2>
                <p className="text-gray-600 mb-4">{ job.company }</p>
                <div className="overflow-hidden h-32">
                  <p className="text-gray-700">{ job.description }</p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500">Location: { job.location }</p>
                  <p className="text-gray-500">Salary: { job.salary }</p>
                </div>
                <p className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block">
                  Apply Now
                </p>
              </div>
            </Link>
          )) }
        </div>
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
