import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const Apply = ({ jobs }) => {
  console.log(jobs)

  return (
    <div>Apply for  </div>
  )
}
export async function getServerSideProps() {
  try {
    const router = useRouter()
    const { id } = router.query
    const response = await axios.get('http://localhost:3001/api/jobs/' + id)
    const jobs = response.data
    console.log(jobs)
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

export default Apply