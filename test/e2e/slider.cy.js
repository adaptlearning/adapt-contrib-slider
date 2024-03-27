describe('Slider', function () {
  beforeEach(function () {
    cy.getData()
    cy.visit('/');
  });

  it('should display the slider component', function () {
    const sliderComponents = this.data.components.filter((component) => component._component === 'slider')
    sliderComponents.forEach((sliderComponent) => {
      cy.visit(`/#/preview/${sliderComponent._id}`);
      cy.stripHtml(sliderComponent.body)
      const bodyWithoutHtml = this.text;
      cy.testContainsOrNotExists('.slider__body', bodyWithoutHtml)
      
      cy.testQuestionButtons()
      cy.testContainsOrNotExists('.slider__title', sliderComponent.displayTitle)
      cy.testContainsOrNotExists('.slider__instruction', sliderComponent.instruction)
      cy.get('.slider__number').should('contain', sliderComponent._scaleStart)
      cy.get('.slider__number').should('contain', sliderComponent._scaleEnd)
      
      // Make sure the current component is tested before moving to the next one
      // Custom cypress tests are async so we need to wait for them to pass first
      cy.wait(1000)
    });
  });
});