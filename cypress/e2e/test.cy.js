describe('ToDo List App', () => {
    
  beforeEach(() => {
      cy.visit('http://localhost:3000'); 
  });
  
it('should create a new task', () => {
    cy.get('.create-task').click(); // Click on the "Create Task" button
    cy.get('input[name="taskName"]').type('Test Task'); // Enter task name
    cy.get('textarea[name="description"]').type('Test Description'); // Enter task description
    cy.get('.create').click(); 
    cy.contains('Test Task').should('exist'); // Assert that the task was created and exists
});
it('should save the created task in the local storage', () => {
  const taskName = 'Test Task';
  const taskDescription = 'Test Description';

  // Step 1: Open the Create Task modal and create a new task
  cy.get('.create-task').click();
  cy.get('input[name="taskName"]').type(taskName);
  cy.get('textarea[name="description"]').type(taskDescription);
  cy.get('.create').contains(/Create/i).click();
  cy.contains('Test Task').should('exist');

  // Step 2: Check the local storage to verify that the task has been saved
  cy.window().its('localStorage.taskList').should('exist').then((taskListJSON) => {
      // Parse the taskList JSON string from local storage to an array
      const taskList = JSON.parse(taskListJSON);

      // Check that the taskList array contains a task with the correct details
      expect(taskList).to.have.length.greaterThan(0); // Verify that there's at least one task
      expect(taskList[taskList.length - 1]).to.deep.equal({
          Name: taskName,
          Description: taskDescription,
      });
  });
});

it('should edit an existing task', () => {
  cy.get('.create-task').click(); // Click on the "Create Task" button
    cy.get('input[name="taskName"]').type('Test Task'); // Enter task name
    cy.get('textarea[name="description"]').type('Test Description'); // Enter task description
    cy.get('.create').click(); 
    cy.contains('Test Task').should('exist'); // Assert that the task was created and exists
      cy.contains('Test Task').parent().find('i.far.fa-edit').click(); // Click on the edit icon of the task
      cy.get('input[name="taskName"]').clear().type('Updated Test Task'); // Update task name
      cy.get('textarea[name="description"]').clear().type('Updated Test Description'); // Update task description
      cy.get('.update').click(); // Click on the "Update" button in the modal
      cy.contains('Updated Test Task'); // Assert that the task was updated
  });

  it('should delete a task', () => {
    cy.get('.create-task').click(); // Click on the "Create Task" button
    cy.get('input[name="taskName"]').type('Test Task'); // Enter task name
    cy.get('textarea[name="description"]').type('Test Description'); // Enter task description
    cy.get('.create').click(); 
    cy.contains('Test Task').should('exist'); // Assert that the task was created and exists    
    cy.contains('Test Task').parent().find('i.fas.fa-trash-alt').click();
    cy.contains('Test Task').should('not.exist'); 
  });
  it('should open and close the "Create Task" modal', () => {
    cy.get('.create-task').click(); // Open "Create Task" modal
    cy.get('.modal-container').should('be.visible');
    cy.get('.cancel').click(); // Close modal
    cy.get('.modal-container').should('not.exist');
  });
  it('should properly load the task list from local storage on startup', () => {
    cy.get('.create-task').click(); // Click on the "Create Task" button
    cy.get('input[name="taskName"]').type('Test Task 1'); // Enter task name
    cy.get('textarea[name="description"]').type('Test Description 1'); // Enter task description
    cy.get('.create').click(); 
    cy.contains('Test Task 1').should('exist'); 
    cy.wait(1000);
    cy.get('.create-task').click(); // Click on the "Create Task" button
    cy.get('input[name="taskName"]').type('Test Task 2'); // Enter task name
    cy.get('textarea[name="description"]').type('Test Description 2'); // Enter task description
    cy.get('.create').click();
    cy.contains('Test Task 2').should('exist'); 
  });
  it('should display edit and delete buttons on each card', () => {
    cy.get('.create-task').click(); // Click on the "Create Task" button
    cy.get('input[name="taskName"]').type('Test Task'); // Enter task name
    cy.get('textarea[name="description"]').type('Test Description'); // Enter task description
    cy.get('.create').click(); 
    cy.contains('Test Task').should('exist'); // Assert that the task was created and exists
    cy.get('i.far.fa-edit').should('exist');
    cy.get('i.fas.fa-trash-alt').should('exist');
  });
  it('should retain tasks after page refresh because data is stored in localstorage', () => {

    cy.get('.create-task').click(); 
    cy.get('input[name="taskName"]').type('Test Task'); 
    cy.get('textarea[name="description"]').type('Test Description'); 
    cy.get('.create').click(); 
    cy.contains('Test Task').should('exist');
  
    // Refresh the page
    cy.reload();
  
    // Assert that the task is still present after the refresh
    cy.contains('Test Task').should('exist');
  });
  
  
  
});

describe('Responsive Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display correctly on large screens', () => {
    cy.viewport(1920, 1080);
    cy.get('.header').should('be.visible');
    cy.get('.task-container').should('be.visible');
  });

  it('should display correctly on tablet screens', () => {
    cy.viewport(768, 1024);
    cy.get('.header').should('be.visible');
    cy.get('.task-container').should('be.visible');
  });

  it('should display correctly on mobile screens', () => {
    cy.viewport(375, 667);
    cy.get('.header').should('be.visible');
    cy.get('.task-container').should('be.visible');
  });

});

