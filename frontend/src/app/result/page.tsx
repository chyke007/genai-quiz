import ResultPage from "@/app/result/component/result-page";
import Navbar from "@/components/Navbar";
import { getResult as getResultAction } from "@/app/actions";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getResult() {
  try {
    let result = await getResultAction();
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default async function Page() {
  try {
    const result = await getResult();

    return (
      <>
        <Navbar />
        {result && result.data ? (
          <ResultPage result={result.data} />
        ) : (
          <section className="h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6">
            <div className="flex justify-center m-4 p-8 text-gray-900 dark:text-white">
              No Saved Score Available
            </div>
          </section>
        )}
      </>
    );
  } catch (e) {
    return NextResponse.json({
      apiMessage: { errorMsg: "Internal Server Error, Please try again later" },
    });
  }
}
