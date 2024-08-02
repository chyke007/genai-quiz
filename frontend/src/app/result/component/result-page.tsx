"use client";

import { PropsWithChildren } from "react";
import { Table } from "flowbite-react";
import Link from "next/link";


export default function ResultPage({ result }: PropsWithChildren<any>) {

  console.log({ result })

  return (
    <main
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6`}
    >
      <span className="lg:w-1/2 w-full h-full overflow-y-auto bg-gray-50 dark:bg-slate-900">
        <aside className="w-full rounded px-4 pt-6">
          <span className="lg:w-1/2 w-full h-full overflow-y-auto bg-gray-50 dark:bg-slate-900">
            <h3 className="mb-3 font-semibold text-gray-900 sm:text-4xl sm:leading-none sm:tracking-tight dark:text-white">
              Result
            </h3>
            <p className="mb-6 text-md font-normal text-gray-900 sm:text-xl dark:text-white">
              All attempts shown below:
            </p>
          </span>

          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Quiz Title</Table.HeadCell>
                <Table.HeadCell>Score</Table.HeadCell>
                <Table.HeadCell>Percentage</Table.HeadCell>
                <Table.HeadCell>Attempt</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white max-width-12">
                    <Link
                      href="/quiz/123"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      {"AWS re:Invent 2023"}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>1 of 2</Table.Cell>
                  <Table.Cell>50%</Table.Cell>
                  <Table.Cell><Link
                      href="/quiz/123"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Retake
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </aside>
      </span>
    </main>
  );
}
