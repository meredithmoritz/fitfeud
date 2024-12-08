// Describe block groups related tests - usually by feature or page
describe('Workout Creation Flow', () => {
    // Before each test, we set up our initial state
    beforeEach(() => {
        // Custom command to handle login - defined in support/auth-commands.js
        cy.login('testuser@example.com', 'password123');
        // Visit the workout creation page
        cy.visit('/workouts/create');
        // Verify we're on the right page
        cy.url().should('include', '/workouts/create');
    });

    // Test case 1: Basic page rendering
    it('should display all required form elements', () => {
        // Check for essential elements
        cy.get('h1').contains('Add Workout').should('be.visible');
        cy.get('.select__control').first().should('exist'); // Category dropdown
        cy.get('button').contains('Add Another Exercise').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    // Test case 2: Category selection behavior
    it('should enable exercise selection after choosing category', () => {
        // Initially, exercise dropdown should be disabled
        cy.get('.select__control').eq(1).should('not.exist');

        // Select Strength category
        cy.get('.select__control').first().click();
        cy.contains('Strength/Lifting').click();

        // Exercise dropdown should now be enabled
        cy.get('.select__control').eq(1).should('exist');
    });

    // Test case 3: Complete workout creation
    it('should successfully create a workout with one exercise', () => {
        // Select category
        cy.get('.select__control').first().click();
        cy.contains('Strength/Lifting').click();

        // Select exercise
        cy.get('.select__control').eq(1).click();
        cy.contains('Barbell Squat').click();

        // Add a set
        cy.contains('Add Set').click();

        // Fill in set details
        cy.get('input[placeholder="Weight (lbs)"]').type('135');
        cy.get('input[placeholder="Reps"]').type('10');

        // Add notes
        cy.get('textarea').type('First workout test');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Verify redirect and success
        cy.url().should('include', '/workouts');
        cy.contains('Barbell Squat').should('exist');
    });

    // Test case 4: Validation checks
    it('should show validation errors for incomplete submission', () => {
        // Try to submit without selecting category
        cy.get('button[type="submit"]').click();
        cy.contains('Please select a category').should('be.visible');

        // Select category but try to submit without exercise
        cy.get('.select__control').first().click();
        cy.contains('Strength/Lifting').click();
        cy.get('button[type="submit"]').click();
        cy.contains('Please select an exercise').should('be.visible');
    });
});