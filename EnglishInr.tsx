import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

function ToggleableForm() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => setIsOpen(!isOpen);

  return (
    <div >
      <Button color="primary" onClick={toggleForm}>
        {isOpen ? 'Hide Form' : 'Show Form'}
      </Button>
      {/* Form appears here directly below the button */}
      {isOpen && (
        <Form className='flex flex-col mt-16'>
          <FormGroup>
            <Label for="exampleEmail">Email</Label>
            <Input type="email" name="email" id="exampleEmail" placeholder="Enter email" />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input type="password" name="password" id="examplePassword" placeholder="Password" />
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </div>
  );
}

export default ToggleableForm;
