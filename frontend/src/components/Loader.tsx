import {default as Animation} from "react-spinners/HashLoader";

export default function Loader({ loading, message }: any) {
  return (
    loading && (
      <aside className="fixed z-20 left-0 top-0 bottom-0 w-full h-full bg-white flex flex-col justify-center items-center">
        <Animation size={40} color={"#1c4ed8"} loading={loading} />
        
         {message && <p className="absolute mb-24 bottom-0 text-md md:text-xl lg:text-2xl font-bold text-black">{ message }</p>}
      </aside>
    )
  );
}
