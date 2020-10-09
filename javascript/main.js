const fs = require("fs");

const {
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
} = require("./functions");

// configure functions and partially apply arguments
const functions = {
  withAverage: average,
  withScoreArray: scoreArray,
  withSetState: setState(fs),
  withCheckArguments: checkArguments,
};

// state of the application to be passed into functions
const data = require("./data.json");

// user arguments
const args = process.argv.slice(2);

// create configuration object and partially apply functions
const configuration = {
  student: {
    create: createStudent(functions)({
      studentName: args[2] || Error("Please provide a valid student name."),
    }),
    add_score: addStudentScore(functions)({
      studentName: args[2] || Error("Please provide a valid student name."),
      score: parseInt(args[3], 10) || Error("Please provide a valid score."),
      classroomName: args[4] || Error("Please provide a valid score."),
    }),
    average: getStudentAverage(functions)({
      studentName: args[2] || Error("Please provide a valid student."),
      classroomName: args[3] || Error("Please provide a valid classroom."),
    }),
  },
  classroom: {
    create: createClassroom(functions)({
      classroomName: args[2] || Error("Please provide a valid classroom name."),
      teacherName: args[3] || Error("Please provide a valid teacher."),
    }),
    add_student: addStudentToClassroom(functions)({
      classroomName: args[2] || Error("Please provide a valid classroom name."),
      studentName: args[3] || Error("Please provide a valid student name."),
    }),
    average: getClassroomAverage(functions)({
      classroomName: args[2] || Error("Please provide a valid classroom."),
    }),
  },
};

// IIFE
(() => {
  // clear the state
  if (args[0] === "clear") {
    return clearState(fs);
  }

  // check for correct user arguments
  if (
    !["create", "add_score", "average", "add_student"].includes(args[1]) ||
    !["student", "classroom"].includes(args[0])
  ) {
    console.log("Please enter a valid command.");
    return;
  }

  // dynamically call the handler function using configuration
  configuration[args[0]][args[1]](data);
})();
