
def student_create(student_names: str, data: dict):
    """
    Creates one or more students. Expects a single name or a space separated list. 
    Usage example: student create Mary
                   student create Mary Paul John

    :param student_names: one name or multiple space separated names
    :type student_names: str
    :param data: state of application
    :type data: dict
    """

    created = []
    # do a loop here to iterate through all the name(s) received.
    for student in student_names.split(' '):
        # don't create the same student twice
        if data['students'].get(student) == None:
            data['students'][student] = {}
            created.append(student)

    if not created:
        return 'Student(s) already exist.'
    print('>' , data) 
    return 'Added the following students: ' + ' '.join(created) + '.'


def student_add_score(args, data):
    """
    Add a score to a given student *based on a given classroom*
    Usage example: student add_score Mary Math 100

    :param args: name of a student, name of a classroom, numeric score. Space separated
    :type args: str
    :param data: state of application
    :type data: dict
    """
    three = args.split(' ')

    if len(three) != 3:
        return 'Error, malformed string.'

    student, classroom, score = tuple(three)

    # error check for missing student, missing enrollment, and non-numeric score
    errs = []
    if data['students'].get(student) == None:
        errs.append('The student does not exist')
    if data['students'][student].get(classroom) == None:
        errs.append('The student is not enrolled in %s' % (classroom))
    if not score.isnumeric():
        errs.append('The score is not a valid number')
    if errs:
        return ' and '.join(errs) + '.'

    data['students'][student][classroom].append(int(score))
    print('>' , data)
    return 'Added a score of %s to %s\'s %s class' % (score, student, classroom)


def student_average(args: str, data: dict):
    """
    Returns the average scores for a student based on a specific classroom
    Usage example: student average Mary Math

    :param args: name of a student, name of a class. Space separated
    :type args: str
    :param data: state of application
    :type data: dict
    """

    # must be given exactly two space separated arguments.
    pair = args.split(' ')
    if len(pair) != 2:
        return 'Error, malformed string.'

    student, classroom = tuple(pair)

    # can't calculate an average if the classroom is missing or has no students
    if data['students'].get(student) == None:
        return 'Student does not exist'
    scores = data['students'][student].get(classroom)
    if scores == None:  # if get(key) returns None, it means the key doesn't exist
        return 'Student is not enrolled in %s' % (classroom)
    # if get(key) returns [], they have already enrolled (on line 110), but it means there are no grades
    if scores == []:
        return 'Student does not have any scores.'

    return int(sum(scores) / len(scores))


def classroom_create(args: str, data: dict):
    """
    Creates one classroom with the given name, teacher. Expects a space separated string.
    Usage example: classroom create Math Daniel

    :param args: name of a classroom, name of a teacher. Space separated
    :type args: str
    :param data: state of application
    :type data: dict
    """
    # must be given exactly two space separated arguments.
    pair = args.split(' ')
    if len(pair) != 2:
        return 'Error, malformed string.'

    classroom, teacher = tuple(pair)

    # don't create the same class twice
    if data['classrooms'].get(classroom) != None:
        return 'Classroom already exists.'

    # create the class and return a success message
    data['classrooms'][classroom] = {'teacher': teacher, 'students': []}
    print('>' , data)
    return 'Added %s class with teacher %s.' % (classroom, teacher)


def classroom_add_student(args: str, data: dict):
    """
    Adds a student to a given classroom roster. 
    Usage example: classroom add_student Math Mary

    :param args: name of a classroom, name of a student. Space separated
    :type args: str
    :param data: state of application
    :type data: dict
    """

    # must be given exactly two space separated arguments
    pair = args.split(' ')
    if len(pair) != 2:
        return 'Error, malformed string.'

    classroom, student = tuple(pair)

    # require that the student and class both exist
    errs = []
    if data['students'].get(student) == None:
        errs.append('Student does not exist')
    if data['classrooms'].get(classroom) == None:
        errs.append('Classroom does not exist')
    if errs:
        return ' and '.join(errs) + '.'

    # check that the student is not already enrolled in the given class
    if student in data['classrooms'][classroom]['students']:
        return 'Student %s is already enrolled in %s.' % (student, classroom)

    # add student to the class, and add class to the student.
    # this is a two way relationship (like in a real database)
    data['classrooms'][classroom]['students'].append(student)
    data['students'][student][classroom] = []
    print('>' , data)
    return 'Added %s to %s' % (student, classroom)


def classroom_average(classroom: str, data: dict):
    """
    Returns the average scores of all students for a given classroom.
    Usage example: classroom average Math

    :param classroom: name of a classroom
    :type classroom: str
    :param data: state of application
    :type data: dict
    """

    # can't calculate an average if the classroom is missing or has no students
    if data['classrooms'].get(classroom) == None:
        return 'Classroom does not exist. Please create.'
    students = data['classrooms'][classroom]['students']
    if not students:
        return 'Classroom does not have any students.'

    # loop all students in the class, then loop all their grades
    grades = []
    for student in students:
        grades = grades + data['students'][student][classroom]

    # return an average score if available
    if not grades:
        return 'Classroom does not have any grades.'

    return int(sum(grades) / len(grades))


def entryPoint():
    # this is the application state (stores student, class, teacher, grade data)
    # this is the only mutative object within the code
    data = {
        'classrooms': {},
        'students': {},
    }

    print('Begin entering commands:')
    while(True):
        # read next line of input
        user_in = input('').strip()

        # quality of life improvement. lets you submit empty lines without error (for clearing screen)
        if user_in == '':
            continue

        # splits the input into three chunks
        # isolate the first two words, leave remaining args to be handled by designated method
        args = user_in.split(' ', 2)

        # makes sure we have three (or more) words as input.
        if len(args) != 3:
            print('> Please enter a valid command.')
            continue
        
        # want to use the 'domain' and 'operation' variable to call higher order functions
        # e.g. domain = 'student', operation = 'create', args = 'mary john bob'
        # validation of 'args' will be done from within the handler
        domain, operation, args = tuple(args)


        # this is the available command palette. the values are first
        # class function references that can be called safely and dynamically.
        commands = {
            'student':{
                'create': student_create,
                'add_score': student_add_score,
                'average': student_average,
            },
            'classroom':{
                'create': classroom_create,
                'add_student': classroom_add_student,
                'average': classroom_average,
            },
        }

        # dynamically call the handler function using the above map as config
        # I find doing it this way to be more readable, functional, and pythonic
        if domain in commands and operation in commands[domain]:
            print('>' , commands[domain][operation](args, data))
        else:
            print('> Please enter a valid command.')
        


if __name__ == "__main__":
    entryPoint()
