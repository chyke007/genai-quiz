import {default as Animation} from "react-spinners/HashLoader";

export default function Loader({ loading }: any) {
  return (
    loading && (
      <aside className="fixed z-20 left-0 top-0 bottom-0 w-full h-full bg-white flex flex-col justify-center items-center">
        <Animation size={40} color={"#1c4ed8"} loading={loading} />
        <h1 className="m-8 text-xl font-bold text-black"> GenAi Quiz App</h1>
      </aside>
    )
  );
}
