"use client";

import { useRef, useState } from "react";
import { Button, Tabs, TabsRef, FileInput, Label } from "flowbite-react";
import { HiClipboardList } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { Amplify } from 'aws-amplify'
import { awsExport } from '@/utils/aws-export';
import Loader from "@/components/Loader";
import Toaster from "@/components/Toaster";
import { SourceStages } from "@/utils/types";
import config from "@/utils/config";
import { addLink } from "@/app/actions";
import {
  isYouTubeLink,
  s3UploadUnAuth,
  replaceSpacesWithHyphens,
} from "@/utils/helpers";

interface FormElements extends HTMLFormControlsCollection {
  message: HTMLInputElement;
}

Amplify.configure(awsExport);


export default function Home() {
  const [isloading, setIsLoading] = useState(false);
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const [toaster, setToaster] = useState({
    toaster: 0,
    message: "Unknown Error",
  });

  const emptyContents = () => {
    setIsLoading(false);
    setLink("");
    setContent("");
  };

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadPdf(e);
  };

  const uploadPdf = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files;

    if (file == null || file[0] == undefined) return;
    const maxSizeInBytes = config.MAX_ATTACHMENT_SIZE * 1000000;

    if (file && file[0] && file[0].size > maxSizeInBytes) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE} MB.`
      );
      return;
    }

    if (file && file[0] && file[0].type !== "application/pdf") {
      alert("Please upload a valid pdf");
      return;
    }

    setIsLoading(true);

    try {
      const fileName = replaceSpacesWithHyphens(
        `${Date.now()}-${file[0].name}`
      );

      await s3UploadUnAuth(file[0], fileName);
      setIsLoading(false);
      setToaster({
        message: "Uploaded successful ... Redirecting to Quiz Page",
        toaster: toaster.toaster + 1,
      });
    } catch (e: any) {
      console.log(e);
      setToaster({
        message: e.errors[0].message || "Unknown Error",
        toaster: toaster.toaster + 1,
      });
      setIsLoading(false);
      emptyContents();
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const link = event.currentTarget?.link?.value;

      if (!link || !isYouTubeLink(link)) {
        alert("Please enter valid Youtube Link");
        return;
      }
    

    setIsLoading(true);
    try {
      const res = await addLink({
        value: link
      });
      emptyContents();

      const output = res;
      setIsLoading(false);
    } catch (e: any) {
      emptyContents();
      console.log(e);
      setIsLoading(false);
    }
  };
  return (
    <main
      className={`h-screen flex flex-col bg-white dark:bg-slate-900 items-center lg:px-12 px-8 py-6`}
    >
      <Loader loading={isloading} />
      <Toaster toaster={toaster.toaster} message={toaster.message} />
      <span className="lg:w-1/2 w-full h-full overflow-y-auto bg-gray-50 dark:bg-slate-900">
        <aside className="w-full rounded px-4 pt-6">
          <form onSubmit={handleSubmit} className="rounded">
            <span className="lg:w-1/2 w-full h-full overflow-y-auto bg-gray-50 dark:bg-slate-900">
              <h3 className="mb-3 font-semibold text-gray-900 sm:text-4xl sm:leading-none sm:tracking-tight dark:text-white">
                Get Started
              </h3>
              <p className="mb-6 text-md font-normal text-gray-900 sm:text-xl dark:text-white">
                Generate quiz by uploading file or entering youtube link
              </p>
            </span>

            {!isloading && (
              <div className="flex flex-col gap-3 text-md">
                <Tabs
                  aria-label="Default tabs"
                  style="default"
                  ref={tabsRef}
                  onActiveTabChange={(tab) => setActiveTab(tab)}
                >
                  <Tabs.Item active title="Youtube" icon={MdDashboard}>
                    {activeTab === 0 && (
                      <>
                        <span className="font-medium text-gray-800 dark:text-white">
                          Enter Youtube link below
                        </span>
                        <div className="w-full my-4">
                          <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                              <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                              </svg>
                            </span>
                            <input
                              type="text"
                              id={SourceStages.LINK}
                              name={SourceStages.LINK}
                              className="rounded-none rounded-e-lg bg-gray-50 py-4 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Enter link"
                              value={link}
                              onChange={handleLinkChange}
                            />
                          </div>

                          <div className="flex items-center justify-between my-4 py-2 dark:border-gray-600">
                            <button
                              type="submit"
                              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-700 hover:bg-blue-600"
                            >
                              Generate Quiz
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </Tabs.Item>

                  <Tabs.Item title="PDF" icon={HiClipboardList}>
                    {activeTab === 1 && (
                      <>
                        <span className="font-medium text-gray-800 dark:text-white">
                          Supports various pdf formats, from tables to plain
                          text. Max size is {config.MAX_ATTACHMENT_SIZE}MB
                        </span>

                        <div className="flex w-full my-4 items-center justify-center">
                          <Label
                            htmlFor="dropzone-file"
                            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                              <svg
                                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  // strokeLineJoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PDF (MAX {config.MAX_ATTACHMENT_SIZE}MB)
                              </p>
                            </div>
                            <FileInput
                              id="dropzone-file"
                              className="hidden"
                              onChange={selectFile}
                              name={SourceStages.FILE}
                              accept="text/plain, application/pdf"
                            />
                          </Label>
                        </div>
                      </>
                    )}
                  </Tabs.Item>
                </Tabs>
              </div>
            )}
          </form>
        </aside>
      </span>
    </main>
  );
}
