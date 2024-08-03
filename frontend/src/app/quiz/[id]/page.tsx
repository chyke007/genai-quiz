import QuizPage from "@/app/quiz/[id]/component/quiz-page";
import Navbar from "@/components/Navbar";
import { getQuiz as getQuizAction } from "@/app/actions";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getQuiz(id: string) {
  try {
    let quiz = await getQuizAction(id);
    return quiz;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  try {
    const quiz = await getQuiz(id);

    return (
      <>
        <Navbar />
        {quiz && quiz.content ? (
           <QuizPage content={quiz.content} id={quiz.id} />
        ) : (
          <section className="h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6">
            <div className="flex justify-center m-4 p-8 text-gray-900 dark:text-white">
              Invalid Quiz
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

