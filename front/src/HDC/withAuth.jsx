import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { React, useEffect, useState } from "react";

const Withauth = (WrapperComponent) => {
  return (props) => {
    const Router = useRouter();
    const [authVerified, setAuthVerified] = useState(false);

    useEffect(() => {
      const storedToken = Cookies.get("jwt") || localStorage.getItem("token");
      if (!storedToken) {
        Router.push("/login");
      } else {
        setAuthVerified(true);
      }
    }, [Router]);
    if (authVerified) {
      return <WrapperComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default Withauth;
