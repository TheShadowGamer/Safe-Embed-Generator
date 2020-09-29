const { React, messages, channels } = require("powercord/webpack");
const { clipboard } = require("electron");
const request = require("request");
const { FormTitle, Button } = require("powercord/components");
const {
  TextAreaInput,
  SwitchItem,
  ColorPickerInput,
} = require("powercord/components/settings");
const { Modal } = require("powercord/components/modal");
const { close: closeModal } = require("powercord/modal");

class GeneratorModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      providerName: "",
      providerUrl: "",
      authorName: "",
      authorUrl: "",
      title: "",
      description: "",
      banner: false,
      image: "",
      color: "",
      userHasInputed: false,
    };

    this.hasUserInputed = () => {
      if (
        this.state.providerName == "" &&
        this.state.authorName == "" &&
        this.state.title == "" &&
        this.state.description == "" &&
        this.state.image == ""
      ) {
        this.setState({ userHasInputed: false });
      } else {
        this.setState({ userHasInputed: true });
      }
    };

    this._numberToHex = (color) => {
      const r = (color & 0xff0000) >>> 16;
      const g = (color & 0xff00) >>> 8;
      const b = color & 0xff;
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    };
  }

  render() {
    return (
      <Modal className="powercord-text">
        <Modal.Header>
          <FormTitle tag="h4">Safe Embed Generator</FormTitle>
        </Modal.Header>
        <Modal.Content>
          <TextAreaInput
            value={this.state.providerName}
            onChange={async (o) => {
              await this.setState({ providerName: o.toString() });
              this.hasUserInputed();
            }}
            rows={1}
          >
            Provider Name
          </TextAreaInput>
          <TextAreaInput
            value={this.state.providerUrl}
            onChange={(o) => {
              this.setState({ providerUrl: o.toString() });
            }}
            rows={1}
          >
            Provider URL
          </TextAreaInput>
          <TextAreaInput
            value={this.state.authorName}
            onChange={async (o) => {
              await this.setState({ authorName: o.toString() });
              this.hasUserInputed();
            }}
            rows={1}
          >
            Author Name
          </TextAreaInput>
          <TextAreaInput
            value={this.state.authorUrl}
            onChange={(o) => {
              this.setState({ authorUrl: o.toString() });
            }}
            rows={1}
          >
            Author URL
          </TextAreaInput>
          <TextAreaInput
            value={this.state.title}
            onChange={async (o) => {
              await this.setState({ title: o.toString() });
              this.hasUserInputed();
            }}
            rows={1}
          >
            Title
          </TextAreaInput>
          <TextAreaInput
            value={this.state.description}
            onChange={async (o) => {
              await this.setState({ description: o.toString() });
              this.hasUserInputed();
            }}
            rows={4}
          >
            Description
          </TextAreaInput>
          <TextAreaInput
            value={this.state.image}
            onChange={async (o) => {
              await this.setState({ image: o.toString() });
              this.hasUserInputed();
            }}
            rows={1}
          >
            Image URL
          </TextAreaInput>
          <SwitchItem
            note="Makes the image banner-sized."
            value={this.state.banner}
            onChange={() => {
              this.setState({ banner: !this.state.banner });
            }}
          >
            Image Banner
          </SwitchItem>
          <ColorPickerInput
            onChange={(c) =>
              this.setState({ color: c ? this._numberToHex(c) : null })
            }
            default={parseInt("202225", 16)}
            value={
              this.state.color ? parseInt(this.state.color.slice(1), 16) : 0
            }
          >
            Color
          </ColorPickerInput>
          <div style={{ marginBottom: 20 }} />
        </Modal.Content>
        <Modal.Footer>
          <Button
            color={Button.Colors.GREEN}
            disabled={!this.state.userHasInputed}
            onClick={() => {
              request(
                {
                  url: "https://em.bigdumb.gq/create/",
                  method: "POST",
                  json: this.state,
                },
                (err, res, body) => {
                  if (err) {
                    this.error(err, true);
                    return;
                  }
                  messages.sendMessage(channels.getChannelId(), {
                    content: `https://em.bigdumb.gq/embed/${body.id}`,
                  });
                  closeModal();
                }
              );
            }}
          >
            Send
          </Button>
          <Button
            style={{ marginRight: "10px" }}
            disabled={!this.state.userHasInputed}
            onClick={() => {
              request(
                {
                  url: "https://em.bigdumb.gq/create/",
                  method: "POST",
                  json: this.state,
                },
                (err, res, body) => {
                  if (err) {
                    this.error(err, true);
                    return;
                  }
                  clipboard.writeText(`https://em.bigdumb.gq/embed/${body.id}`);
                  closeModal();
                }
              );
            }}
          >
            Copy
          </Button>
          <Button
            onClick={closeModal}
            look={Button.Looks.LINK}
            color={Button.Colors.TRANSPARENT}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

module.exports = GeneratorModal;
