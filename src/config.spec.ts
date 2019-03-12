import { expect } from "chai";
import { NODE_ENV } from "./config";

describe("Check config", () => {
  it("NODE_ENV", () => {
    expect(NODE_ENV).to.eql("test");
  });
});
