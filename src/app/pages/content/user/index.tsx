import { message, Tabs, TabsProps } from "antd";
import React, { useEffect } from "react";
import UserInfo from "./info";
import UserPassword from "./password";

export default function User() {
  const user = JSON.parse(localStorage.getItem("user")!);
  const [messageApi, contextHolder] = message.useMessage();
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const showFailedMessage = (message: string) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Profile and visibility",
      children: <UserInfo user={user} onSaveSuccess={showSuccessMessage} />,
    },
    {
      key: "2",
      label: "Security",
      children: (
        <UserPassword
          user={user}
          onSaveSuccess={showSuccessMessage}
          onFailed={showFailedMessage}
        />
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <Tabs className="c-detail" items={items}></Tabs>;
    </>
  );
}
