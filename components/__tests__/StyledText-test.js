import * as React from "react";
import renderer from "react-test-renderer";

import { MonoText, HeaderText } from "../StyledText";

describe("<MonoText/>", () => {
  it("Renders correctly", () => {
    const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("<HeaderText/>", () => {
  it("Renders correctly", () => {
    const tree = renderer
      .create(<HeaderText>Snapshot test!</HeaderText>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
