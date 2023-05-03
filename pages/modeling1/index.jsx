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
      <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg mx-8 mb-8 p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Note</h2>
        ベジェ曲線として、
        <li className='pl-4'>制御点列の先頭３点を利用した二次ベジェ曲線</li>
        <li className='pl-4'>制御点列の全てを利用したn次ベジェ曲線</li>
        <li className='pl-4'>適応的なサンプリングを行う三次ベジェ曲線</li>
        <li className='pl-4'>重みがw0=1,w1=2,w2=1の有理二次ベジェ曲線</li>
        を描画するボタンを配置しました。
        <br/><br/>
        スプライン曲線として、
        <li className='pl-4'>一様的なノット列によるCatmullRomスプライン</li>
        <li className='pl-4'>弧長に基づくノット列によるCatmullRomスプライン</li>
        <li className='pl-4'>向心的なノット列によるCatmullRomスプライン</li>
        を描画するボタンを配置しました。
        <br/><br/>
        また、YukselによるA Class of C2 Interpolating SplinesをBezier曲線による補間で実装しました。
      </div>
    </>
  )
}
