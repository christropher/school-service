### School Service

#### Background

The goal of this project was to create an imperative solution that leveraged semi-pure functions in a pythonic way, while still keeping state at the edge of my application. Functions were written in a generic and uniform way for easy refactoring. Each function takes `args` and `data`, and state (`data`) is being mutated and returned to the console.

#### Data Structure
```python
data = {
    'classrooms': {
      'Math': {
        'teacher': 'Taylor',
        'students': ['Chris', 'Steven'],
      },
      'English': {
        'teacher': 'Carl',
        'students': ['Chris', 'Steven']
      },
      'Science': {
        'teacher': 'James',
        'students': ['Steven']
      },
    },
    'students': {
      'Chris': {
        'Math': [100, 100, 100],
        'Science': [60, 40]
      },
      'Steven': {
        'English': [12,29],
        'Math': [100, 100, 100],
        'Science': [60, 40]
      },
    },
  }
```

#### Requirements
Python 3.latest

#### Commands

`$ python3 <path>/python-solution/main.py <command>`

| command      | description   |
|------------- |---------------|
| `student create <student_name>`      | Create student |
| `student add_score <student_name> <score> <classroom>`       | Add student score to respective classroom |
| `student average <student_name> <classroom>`  | Average classroom score for student |
| `classroom create <classroom_name> <teacher_name>`       | create a classroom with a name and a teacher name |
| `classroom add_student <classroom_name> <student_name>`       | add a student to a classroom |
| `classroom average <classroom_name>` | Get the average scores for all students in the classroom |
