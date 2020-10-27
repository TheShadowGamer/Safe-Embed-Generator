const { React, getModule } = require("powercord/webpack");
const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { findInReactTree } = require("powercord/util");
const ChannelTextAreaContainer = getModule(
  (m) =>
    m.type &&
    m.type.render &&
    m.type.render.displayName === "ChannelTextAreaContainer",
  false
);

const { open } = require("powercord/modal");
const GeneratorModal = require("./components/GeneratorModal");
const Button = require("./components/Button");

module.exports = class SafeEmbedGenerator extends Plugin {
  async startPlugin() {
    inject(
      "safe-embed-generator-button",
      ChannelTextAreaContainer.type,
      "render",
      (args, res) => {
        const props = findInReactTree(
          res,
          (r) => r && r.className && r.className.indexOf("buttons-") == 0
        );
        props.children.unshift(
          React.createElement(
            "div",
            {
              className: "safe-embed-generator-button",
              onClick: () => open(() => React.createElement(GeneratorModal)),
            },
            React.createElement(Button)
          )
        );
        return res;
      }
    );
    ChannelTextAreaContainer.type.render.displayName =
      "ChannelTextAreaContainer";
  }

  pluginWillUnload() {
    uninject("safe-embed-generator-button");
    document
      .querySelectorAll(".safe-embed-generator-button")
      .forEach((e) => (e.style.display = "none"));
  }
};
