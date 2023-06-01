import Head from 'next/head'
import Canvas from '../../components/InverseKinematics'
import Header from '@/components/Header'
import IKReference from '@/components/IKReference'

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
      </div>
      <IKReference/>
      <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg mx-8 mb-8 p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Note</h2>
        InverseKinematicsをCCD法で実装しました。

        2つのベクトルの角度を求める際に、acosを使用せずatan2を使うことで、値域を[0,pi]ではなく[-pi,pi]の範囲で受け取ることができ、条件分岐をせずに角度を求められました。
      </div>
    </>
  )
}
