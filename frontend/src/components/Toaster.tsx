import React, { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toaster({ toaster, message, type }: any) {
  useEffect(() => {
    toaster && toast(message, { type });
  }, [message, toaster, type]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}
