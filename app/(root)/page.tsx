import Loading from "./loading";

export default async function Home() {
  return (
    <div className="home">
      <div className="home-content">
        <h1 className='text-6xl font-bold text-slate-700 drop-shadow-md'>
          🖌  PicturIA
        </h1>
        <p className='text-2xl text-center  text-slate-700'>
          Audiovisual generation powered by IA
        </p>
      </div>
    </div>
  );
}
