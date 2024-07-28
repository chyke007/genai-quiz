"use client";

import { useState } from "react";
import { Table } from "flowbite-react";
import Loader from "@/components/Loader";
import Link from "next/link";

interface FormElements extends HTMLFormControlsCollection {
  message: HTMLInputElement;
}

export default function ResultPage() {
  const [isloading, setIsLoading] = useState(false);

  return (
    <main
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6`}
    >
      <Loader loading={isloading} />
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
                <Table.HeadCell>Quiz ID</Table.HeadCell>
                <Table.HeadCell>Attempt</Table.HeadCell>
                <Table.HeadCell>Percentage</Table.HeadCell>
                <Table.HeadCell>Score</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only"></span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link
                      href="/quiz/123"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      {"123"}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>2</Table.Cell>
                  <Table.Cell>80%</Table.Cell>
                  <Table.Cell>80</Table.Cell>
                  <Table.Cell>
                    <Link
                      href="/quiz/123"
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      View Source
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
