"use client";

import { PropsWithChildren } from "react";
import { Banner, Table } from "flowbite-react";
import { HiX } from "react-icons/hi";
import Link from "next/link";
import { truncate } from "@/utils/helpers";

interface ResultData {
  contentId: string;
  dateCreated: string;
  title: string;
}

export default function AllQuizPage({ result }: PropsWithChildren<any>) {
  return (
    <main
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6`}
    >
      <span className="lg:w-2/3 w-full h-full overflow-y-auto bg-gray-50 dark:bg-slate-900">
        <aside className="w-full rounded px-4 pt-6">
          <span className="lg:w-2/3 w-full h-full overflow-y-auto bg-gray-50 dark:bg-slate-900">
            <Banner>
          <div className="flex w-full flex-col justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
            <div className="mb-4 md:mb-0 md:mr-4">
              <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                All Quiz
              </h2>
              <span className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                Find below all generated quiz. You can take a quiz by clicking the <aside className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 px-2"> Take Quiz </aside> button
              </span>
            </div>
            <div className="flex shrink-0 items-center">
              <Banner.CollapseButton
                color="gray"
                className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
              >
                <HiX className="h-4 w-4" />
              </Banner.CollapseButton>
            </div>
          </div>
        </Banner>
          </span>

          <div className="overflow-x-auto my-4 ">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Quiz Title</Table.HeadCell>
                <Table.HeadCell>Attempt</Table.HeadCell>
                <Table.HeadCell>Date Taken</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {result &&
                  result.map((data: ResultData) => (
                    <Table.Row
                      key={data.contentId}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white max-width-12">
                        <Link
                          href={`/quiz/${data.contentId}`}
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        >
                          {truncate(data.title)}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          href={`/quiz/${data.contentId}`}
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        >
                          Take Quiz
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(data.dateCreated).toLocaleDateString()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </aside>
      </span>
    </main>
  );
}
