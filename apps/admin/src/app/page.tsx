"use client"

import {useSession} from "next-auth/react";

const Page = () => {
  const {data: session} = useSession()

  return (
    <>
        {/*use session to check whether the user is logged in or not*/}
    </>
  );
}

export default Page;