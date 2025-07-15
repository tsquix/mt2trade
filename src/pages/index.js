import Header from '@/components/Header';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <div className="">
        <Header noMb />
        <Image
          src={
            'https://mt2trade.s3.eu-north-1.amazonaws.com/76a89c6b-61ac-4f50-ad08-5b72ec0b4232.webp'
          }
          width={1920}
          height={1020}
          alt=""
        />
      </div>
    </>
  );
}
