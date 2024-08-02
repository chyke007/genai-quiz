"use client";

import { PropsWithChildren } from "react";
import Quiz from "react-quiz-component";
import { saveResult } from "@/app/actions";
import { Button } from "flowbite-react";
import Link from "next/link";

export default function QuizPage({ content, id }: PropsWithChildren<any>) {
  const questions = content?.questions;
  console.log({ questions });
  const url = content?.url;
  const quiz = {
    quizTitle: content.title,
    quizSynopsis: `Get set to be tested on the supplied information, this test would help access your level of preparedness for your upcoming exams. 
       To better be prepared be advised to take weeks to set up mind for this monster!
       In this mode, you can see your correct answer or feedback in realtime as you proceed in the test
       `,
    nrOfQuestions: questions?.length,
    questions,
  };

  const setQuizResult = async (obj: any) => {
    const saveScore = await saveResult({
      id,
      correctPoints: obj.correctPoints,
      totalPoints: obj.totalPoints,
      title: content.title
    });

    console.log({ saveScore })
    //Add saving score loader
  };

  return (
    <main
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6`}
    >
      <span className="lg:w-1/2 w-full h-full overflow-y-auto bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        <h4>Quiz Page</h4>

        <Link href={url} target="_blank">
          <Button className="m-4 p-1">View source</Button>
        </Link>
        <Quiz
          quiz={quiz}
          timer={20}
          shuffle={true}
          shuffleAnswer={true}
          allowPauseTimer={true}
          showInstantFeedback={true}
          onComplete={setQuizResult}
        />
      </span>
    </main>
  );
}
