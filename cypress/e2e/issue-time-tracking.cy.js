describe("Issue time tracking, adding, editing and deleting", () => {
  const inputField = 'input[placeholder="Number"]';
  const stopwatchIcon = '[data-testid="icon:stopwatch"]';
  const trackingModal = '[data-testid="modal:tracking"]';
  const issueDetailsModal = '[data-testid="modal:issue-details"]';

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should add, edit and delete values of time tracking", () => {
    // Deleting previous values
    cy.get(issueDetailsModal).should("be.visible");
    cy.get(inputField).clear().should("have.value", "");

    cy.get(stopwatchIcon).click();
    cy.get(trackingModal).within(() => {
      cy.get(inputField).eq(0).clear();
      cy.contains("Done").click();
    });
    cy.get(issueDetailsModal).should("be.visible");
    cy.get(inputField).should("have.value", "");
    cy.contains("No time logged").should("be.visible");

    // Adding new values
    cy.get(inputField).type(5);

    cy.get(stopwatchIcon).click();
    cy.get(trackingModal).within(() => {
      cy.get(inputField).eq(0).type(6);
      cy.get(inputField).eq(1).type(3);
      cy.contains("Done").click();
    });
    cy.get(inputField).should("have.value", "5");
    cy.get(issueDetailsModal).contains("6h logged");
    cy.get(issueDetailsModal).contains("3h remaining");

    // Editing time values
    cy.get(inputField).clear().type(7);

    cy.get(stopwatchIcon).click();
    cy.get(trackingModal).within(() => {
      cy.get(inputField).eq(0).clear().type(5);
      cy.get(inputField).eq(1).clear().type(9);
      cy.contains("Done").click();
    });
    cy.get(inputField).should("have.value", "7");
    cy.get(issueDetailsModal).contains("5h logged");
    cy.get(issueDetailsModal).contains("9h remaining");

    // Removing time values
    cy.get(inputField).clear();

    cy.get(stopwatchIcon).click();
    cy.get(trackingModal).within(() => {
      cy.get(inputField).eq(0).clear();
      cy.get(inputField).eq(1).clear();
      cy.contains("Done").click();
    });
    cy.get(inputField).should("have.value", "");
    cy.contains("No time logged").should("be.visible");

    // Adding values one field at the time
    cy.get(inputField).type(6);
    cy.get(inputField).should("have.value", "6");
    cy.get(issueDetailsModal).contains("6h estimated");

    cy.get(inputField).clear();
    cy.get(stopwatchIcon).click();
    cy.get(trackingModal).within(() => {
      cy.get(inputField).eq(0).type(2);
      cy.contains("Done").click();
    });
    cy.get(inputField).should("have.value", "");
    cy.get(issueDetailsModal).contains("2h logged");

    cy.get(stopwatchIcon).click();
    cy.get(trackingModal).within(() => {
      cy.get(inputField).eq(0).clear();
      cy.get(inputField).eq(1).type(5);
      cy.contains("Done").click();
    });
    cy.get(inputField).should("have.value", "");
    cy.get(issueDetailsModal).contains("5h remaining");
  });
});
