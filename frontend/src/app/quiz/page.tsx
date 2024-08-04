import GetAllQuizPage from "@/app/quiz/component/all-quiz-page";
import Navbar from "@/components/Navbar";
import { getAllQuiz as getAllQuizAction } from "@/app/actions";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getAllQuiz() {
  try {
    let result = await getAllQuizAction();
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default async function Page() {
  try {
    const result = await getAllQuiz();

    return (
      <>
        <Navbar />
        {result && result.data ? (
          <GetAllQuizPage result={result.data} />
        ) : (
          <section className="h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6">
            <div className="flex justify-center m-4 p-8 text-gray-900 dark:text-white">
              No generated quiz yet
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
