import React from "react";

import ToolList from "@/modules/tools/components/ToolList";

const ToolsPage = () => {
  return (
    <div className="w-full p-6 flex flex-col gap-4 h-dvh">
      <h1 className="text-3xl font-semibold">Custom tools</h1>
      <ToolList />
    </div>
  );
};

export default ToolsPage;
