/**
 * Returns average of either a classroom or a student
 * @param {Array} scores - Scores associated with either a classroom or student
 * @returns {Number} Average of scores
 */
const average = (scores) => {
  if (!scores.length) {
    return;
  }
  return (
    scores.reduce((accumulator, currentValue) => accumulator + currentValue) /
    scores.length
  );
};

/**
 * FlatMap students data object based on list of students in a given course
 * @param {Array} studentArray - Array of students in selected classroom
 * @param {String} classroomName - Name of classroom
 * @param {Object} data - student object
 * @returns {Array} Array of scores to average
 */
const scoreArray = (studentArray, classroomName, data) => {
  return studentArray.flatMap(
    (currentValue, index) => (
      (currentValue[index] = data[index]), data[currentValue][classroomName]
    ),
    []
  );
};

/**
 * Logs error passed and returns an Error
 * @param {Object} args - Arguments object to error check
 * @returns {Error}
 */
const checkArguments = (args) => {
  for (let argument in args) {
    if (args[argument] instanceof Error) {
      console.log(args[argument].message);
      return args[argument];
    }
  }
};

/**
 * Creates a student and returns an evolved data object with the mutation
 * @param {Function} functions.withSetState - Set the state of the application
 * @param {Function} functions.withCheckArguments - Argument error checking
 * @param {String} args.studentName - Name of student to be created
 * @param {Object} data - Current state of the application
 * @returns {Object} New data object with student added
 */
const createStudent = (functions) => (args) => (data) => {
  const { withSetState, withCheckArguments } = functions;

  // check if arguments exist
  if (withCheckArguments(args)) return;

  // destructure arguments
  const { studentName } = args;

  if (studentName in data.students) {
    console.log("Student already exists.");
    return;
  }

  // spread data into a new object
  return withSetState({
    ...data,
    students: {
      ...data.students,
      [studentName]: {},
    },
  });
};

/**
 * Adds score for a student based on a specific classroom
 * @param {Function} functions.withSetState - Set the state of the application
 * @param {Function} functions.withCheckArguments - Argument error checking
 * @param {String} args.studentName - Name of student to be created
 * @param {Number} args.score - Score to be applied to classroom
 * @param {String} args.classroomName - Name of classroom for score to be applied to
 * @param {Object} data - Current state of the application
 * @returns {Object} New data object with classroom score added to students object
 */
const addStudentScore = (functions) => (args) => (data) => {
  // destructure functions
  const { withSetState, withCheckArguments } = functions;

  // check if arguments exist
  if (withCheckArguments(args)) return;

  // destructure arguments
  const { studentName, score, classroomName } = args;

  if (!(studentName in data.students)) {
    console.log(`
            Student named ${studentName} doesn't exist. Run: student create ${studentName} to create
        `);
    return;
  }
  if (!(classroomName in data.students[studentName])) {
    console.log(`
            ${studentName} is not enrolled in ${classroomName}. 
            Run: classroom add_student ${studentName} ${classroomName} to enroll. 
        `);
    return;
  }
  data.students[studentName][classroomName].push(score);
  return withSetState(data);
};

/**
 * Averages scores for a student based on a specific classroom
 * @param {Function} functions.withAverage - Average array via a reducer
 * @param {Function} functions.withCheckArguments - Argument type checking
 * @param {String} args.studentName - Name of student to be created
 * @param {String} args.classroomName - Name of classroom for score to be applied to
 * @param {Object} data - Current state of the application
 * @returns {Number} Average score for a student based on a specific classroom
 */
const getStudentAverage = (functions) => (args) => (data) => {
  const { withAverage, withCheckArguments } = functions;
  if (withCheckArguments(args)) return;

  const { studentName, classroomName } = args;
  if (!(studentName in data.students)) {
    console.log("The student does not exist. Please create.");
    return;
  }
  if (!(classroomName in data.students[studentName])) {
    console.log(
      `The student is not enrolled in ${classroomName}. PLease add student to classroom.`
    );
    return;
  }

  if (!data.students[studentName][classroomName].length) {
    console.log("Student does not have any grades for this classroom.");
    return;
  }

  return console.log(withAverage(data.students[studentName][classroomName]));
};

/**
 * Creates one classroom with the given name, teacher.
 * @param {Function} functions.withSetState - Set the state of the application
 * @param {Function} functions.withCheckArguments - Argument error checking
 * @param {String} args.classroomName - Name of classroom to be created
 * @param {String} args.teacherName - Name of teacher applied to classroom
 * @param {Object} data - Current state of the application
 * @returns {Object} New data object with classroom added to classrooms object
 */
const createClassroom = (functions) => (args) => (data) => {
  const { withSetState, withCheckArguments } = functions;
  if (withCheckArguments(args)) return;

  const { classroomName, teacherName } = args;

  if (classroomName in data.classrooms) {
    console.log("Classroom already exists.");
    return;
  }
  // spreads data into new object to be written to state
  return withSetState({
    ...data,
    classrooms: {
      ...data.classrooms,
      [classroomName]: {
        teacher: teacherName,
        students: [],
      },
    },
  });
};

/**
 * Adds a student to a given classroom roster.
 * @param {Function} functions.withSetState - Set the state of the application
 * @param {Function} functions.withCheckArguments - Argument error checking
 * @param {String} args.classroomName - Name of classroom to be created
 * @param {String} args.studentName - Name of student applied to classroom
 * @param {Object} data - Current state of the application
 * @returns {Object} New data object with student added to classrooms object
 */
const addStudentToClassroom = (functions) => (args) => (data) => {
  const { withSetState, withCheckArguments } = functions;
  if (withCheckArguments(args)) return;

  const { classroomName, studentName } = args;
  if (!(classroomName in data.classrooms)) {
    console.log("Classroom doesn't exist. Please create.");
    return;
  }
  if (!(studentName in data.students)) {
    console.log("The student does not exist. Please create.");
    return;
  }
  if (data.classrooms[classroomName].students.includes(studentName)) {
    console.log("Student already enrolled in classroom.");
    return;
  }
  // add student to the class, and add class to the student.
  // this is a two way relationship (like in a real database)
  data.classrooms[classroomName].students.push(studentName);
  data.students[studentName] = {
    ...data.students[studentName],
    [classroomName]: [],
  };
  return withSetState(data);
};

/**
 *  Returns the average scores of all students for a given classroom.
 * @param {Function} functions.withAverage - Returns average of either a classroom or a student
 * @param {Function} functions.withScoreArray - FlatMap students data object based on list of students in a given course
 * @param {Function} functions.withCheckArguments - Argument error checking
 * @param {String} args.classroomName - Name of classroom to average
 * @param {Object} data - Current state of the application
 * @returns {Number} Average of a given classroom
 */
const getClassroomAverage = (functions) => (args) => (data) => {
  const { withAverage, withScoreArray, withCheckArguments } = functions;

  if (withCheckArguments(args)) return;

  const { classroomName } = args;
  if (!(classroomName in data.classrooms)) {
    console.log("Classroom doesn't exist. Please add.");
    return;
  }
  if (!data.classrooms[classroomName].students.length) {
    console.log("Classroom does not have any students.");
    return;
  }

  // could use compose or pipe for this
  return console.log(
    withAverage(
      withScoreArray(
        data.classrooms[classroomName].students,
        classroomName,
        data.students
      )
    ) || "There are no grades for this classroom."
  );
};

/**
 * Mutates the state of the application
 * @param {Function} fs - File System for I/O
 * @param {String} data - JSON to be written to state (data.json)
 */
const setState = (fs) => (data) => {
  // write to state
  try {
    fs.writeFileSync("./data.json", JSON.stringify(data));
  } catch (err) {
    console.log("Error writing file", err);
  }
  console.log(data);
};

/**
 * Restores state to empty JSON object
 * @param {Function} fs - File System for I/O
 */
const clearState = (fs) => {
  const data = {
    students: {},
    classrooms: {},
  };
  try {
    fs.writeFileSync("./data.json", JSON.stringify(data));
  } catch (err) {
    console.log("Error writing file", err);
  }
  console.log("Application state cleared");
};

module.exports = {
  createStudent,
  addStudentScore,
  getStudentAverage,
  createClassroom,
  addStudentToClassroom,
  getClassroomAverage,
  average,
  scoreArray,
  setState,
  clearState,
  checkArguments,
};
