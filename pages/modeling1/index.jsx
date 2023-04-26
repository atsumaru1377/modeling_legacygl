import Head from 'next/head'
import Canvas from '../../components/SplineCanvas'
import Header from '@/components/Header'

export default function Home() {
  return (
    <>
      <Header subtitle="subdivision"/>
      <Head>
        <title>Bezier and Spline</title>
        <meta name="description" content="Assignment Modeling-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Canvas>
      </Canvas>
    </>
  )
}
