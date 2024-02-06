import React from "react";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
const DashBoard = () => {
  return (
    <div>
      <AppBar />
      <div className="">
        <Balance />
        <Users />
      </div>
    </div>
  );
};

export default DashBoard;
