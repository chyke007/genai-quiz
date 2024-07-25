import QuizPage from "@/app/quiz/[id]/component/quiz-page";
import Navbar from "../../../components/Navbar";

export default async function Page() {

  return (
    <>
        <Navbar/>
        <QuizPage />
    </>
  );
}
