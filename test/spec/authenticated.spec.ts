import { expect } from "chai";
import { openTestPage } from "./helpers/nav";
import { oneiam } from "./helpers/oneiam";
import { loginOneiam, logoutOneiam } from "./helpers/session";

describe("oneiam.authenticated", function () {
  it("should return false if OneIAM is not authenticated", function () {
    logoutOneiam();
    openTestPage();
    expect(oneiam.authenticated()).to.be.false;
  });

  it("should return true if OneIAM is authenticated", function () {
    loginOneiam();
    openTestPage();
    expect(oneiam.authenticated()).to.be.true;
  });
});
