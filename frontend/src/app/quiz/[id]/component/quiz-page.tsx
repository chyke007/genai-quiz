"use client";

import { PropsWithChildren, useState } from "react";
import Quiz from "react-quiz-component";
import { saveResult } from "@/app/actions";
import { Banner } from "flowbite-react";
import Link from "next/link";
import { HiArrowRight, HiX } from "react-icons/hi";
import Toaster from "@/components/Toaster";

export default function QuizPage({ content, id }: PropsWithChildren<any>) {
  const [toaster, setToaster] = useState({
    toaster: 0,
    message: "Unknown Error",
    type: "error"
  });
  const questions = content?.questions;
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
    await saveResult({
      id,
      correctPoints: obj.correctPoints,
      totalPoints: obj.totalPoints,
      title: content.title,
    });

    setToaster({
      message: "Result has been saved!",
      toaster: toaster.toaster + 1,
      type: "success"
    });
  };

  return (
    <main
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6`}
    >
      <Toaster toaster={toaster.toaster} message={toaster.message} type={toaster.type}/>
      <span className="lg:w-2/3 w-full h-full overflow-y-auto bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        <Banner>
          <div className="flex w-full flex-col justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
            <div className="mb-4 md:mb-0 md:mr-4">
              <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                Take Quiz Now
              </h2>
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                Quiz has been generated sucessfully. You can also view the source
                file/link by clicking the View Source button
              </p>
            </div>
            <div className="flex shrink-0 items-center">
              <Link
                href={url}
                target="_blank"
                className="mr-2 inline-flex items-center justify-center rounded-lg bg-cyan-700 px-3 py-2 text-xs font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                View Source
                <HiArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Banner.CollapseButton
                color="gray"
                className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
              >
                <HiX className="h-4 w-4" />
              </Banner.CollapseButton>
            </div>
          </div>
        </Banner>
        <Quiz
          quiz={quiz}
          timer={60}
          shuffle={true}
          allowPauseTimer={true}
          showInstantFeedback={true}
          onComplete={setQuizResult}
        />
      </span>
    </main>
  );
}
