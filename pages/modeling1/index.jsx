import Head from 'next/head'
import Canvas from '../../components/SplineCanvas'
import Header from '@/components/Header'
import SplineForm from '@/components/SplineForm'
import SplineLegends from '@/components/SplineLengends'
import SplineReference from '@/components/SplineReference'

export default function Home() {
  return (
    <>
      <Header subtitle="Assignment-1 Spline (last-modified:2023-05-04)"/>
      <Head>
        <title>Bezier and Spline</title>
        <meta name="description" content="Assignment Modeling-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex m-4 items-start'>
        <Canvas/>
        <SplineForm/>
      </div>
      <SplineLegends/>
      <SplineReference/>
    </>
  )
}
