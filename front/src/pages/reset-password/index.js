import React, { use, useState } from "react";

import { useRouter } from "next/router";

import ResetPassword from "@/components/Form/reset-password";

const index = () => {
  const router = useRouter();

  return (
    <div className={"container_page"}>
      <ResetPassword />
    </div>
  );
};

export default index;
