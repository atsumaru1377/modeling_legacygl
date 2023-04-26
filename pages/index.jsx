import Link from 'next/link';
import Card from '../components/Card';
import Header from '@/components/Header';
import SplineForm from '@/components/SplineForm';

export default function Home() {
  return (
    <div>
      <Header/>
      <div className="flex flex-wrap p-4">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4  p-4">
          <Link href="/modeling1">
            <Card
              title="Modeling 1"
              content="Making Bezier and Spline"
              imgUrl="/spline.png"
              />
          </Link>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4  p-4">
          <Link href="/modeling2">
            <Card
              title="Modeling 2"
              content="Subdivision Surface"
              imgUrl="/spline.png"
              />
          </Link>
        </div>
      </div>
    </div>
  );
}
