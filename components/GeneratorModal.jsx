const { React } = require("powercord/webpack");
const { clipboard } = require("electron");
const request = require("request");
const { FormTitle, Button, Divider } = require("powercord/components");
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
            onChange={(o) => {
              this.setState({ providerName: o.toString() });
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
            onChange={(o) => {
              this.setState({ authorName: o.toString() });
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
            onChange={(o) => {
              this.setState({ title: o.toString() });
            }}
            rows={1}
          >
            Title
          </TextAreaInput>
          <TextAreaInput
            value={this.state.description}
            onChange={(o) => {
              this.setState({ description: o.toString() });
            }}
            rows={4}
          >
            Description
          </TextAreaInput>
          <TextAreaInput
            value={this.state.image}
            onChange={(o) => {
              this.setState({ image: o.toString() });
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
        </Modal.Content>
        <Modal.Footer>
          <Button
            onClick={() => {
              request(
                {
                  url: "https://em.kyza.net/create/",
                  method: "POST",
                  json: this.state,
                },
                (err, res, body) => {
                  if (err) {
                    this.error(err, true);
                    return;
                  }
                  clipboard.writeText(`https://em.kyza.net/embed/${body.id}`);
                  closeModal();
                }
              );
            }}
          >
            Generate
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
