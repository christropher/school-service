### School Service :book:

#### Background

The goal of this project was to create a purely functional solution in vanilla JavaScript which pushed all side-effects to the edge of the application. I did this by passing all of the side-effects `(functions)(args)(data)` to each respective function in `main.js`. This was done by leveraging currying and a configuration object to partially apply arguments for each function. In, `main.js`, data (from `data.json`) is passed into each function. Most functions (with the exception of averaging functions) return `withSetState`, which takes the new evolved state and writes a new object to `data.json`. The design for this was meant to simulate a document database. By hoisting state as high as it can be in my application, unit testing and debugging errors becomes significantly easier. Configuring this to run in a production environment with AWS Lambda and DynamoDB is simple due to the functional design of this application. 

#### Data Structure ([data.json])
```javascript
const data = {
    students: {
      Chris: {
        Math: [100, 100, 100],
        Science: [60, 40]
      },
      Steven: {
        English: [12,29],
        Math: [100, 100, 100],
        Science: [60, 40]
      },
    },
    classrooms: {
      Math: {
        teacher: 'Taylor',
        students: ['Chris', 'Steven'],
      },
      English: {
        teacher: 'Carl',
        students: ['Chris', 'Steven']
      },
      Science: {
        teacher: 'James',
        students: ['Steven']
      }
    },
  }
```

#### Requirements
Node.js 12

#### Commands
`$ cd <path>/javascript-solution`
`$ node <path>/javascript-solution/main.js <command>`

| command      | description   |
|------------- |---------------|
| `clear`      |      Removes all data from `data.json`    |
| `student create <student_name>`      | Create student |
| `student add_score <student_name> <score> <classroom>`       | Add student score to respective classroom |
| `student average <student_name> <classroom>`  | Average classroom score for student |
| `classroom create <classroom_name> <teacher_name>`       | create a classroom with a name and a teacher name |
| `classroom add_student <classroom_name> <student_name>`       | add a student to a classroom |
| `classroom average <classroom_name>` | Get the average scores for all students in the classroom |
