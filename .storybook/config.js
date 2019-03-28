import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { setOptions } from "@storybook/addon-options";
import { withInfo } from "@storybook/addon-info";

function loadStories() {
  require("../stories");
}

addDecorator(story => [
  <div
    key="index"
    style={{
      background: "#262626",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center"
    }}
  >
    {story()}
  </div>
]);

configure(loadStories, module);
