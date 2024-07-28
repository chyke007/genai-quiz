"use client";

import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  Flowbite,
  Navbar,
} from "flowbite-react";
import Link from "next/link";

export default function Component() {
  return (
    <Navbar className="px-2 bg-gray-200 dark:bg-gray-900 border-b border-slate-900/10 dark:border-slate-300/10" fluid rounded>
    <Navbar.Brand  href="/" className="flex">
          <span className="self-center whitespace-nowrap text-xl font-semibold  text-gray-900 sm:text-xl dark:text-white">
            {" "}
            GenAI Quiz
          </span>
      </Navbar.Brand>
      <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <span className=" mx-2">
          <Flowbite>
            <DarkThemeToggle />
          </Flowbite>
        </span>
        <Link
          href="https://github.com/chyke007/genai-quiz"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Github
        </Link>
      </div>
      <Navbar.Toggle />

      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/result">Result</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
