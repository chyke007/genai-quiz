import React, { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toaster({ toaster, message }: any) {
  useEffect(() => {
    toaster && toast(message);
  }, [toaster]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}
