describe('store-ui-shared', () => {
  beforeEach(() => cy.visit(
    '/iframe.html?id=headercomponent--primary&args=title:BoardGameHoard'
  ));
  it('should render the component', () => {
    cy.get('bg-hoard-header').contains('BoardGameHoard');
  });
});
