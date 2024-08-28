import { useReducer, useEffect } from 'react';
const questions = [
  {
    id: 1,
    text: "Which database is used in the MERN stack?",
    options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
    correctAnswer: "MongoDB",
  },
  {
    id: 2,
    text: "Which framework is used to build the front end in the MERN stack?",
    options: ["Angular", "Vue", "React", "Svelte"],
    correctAnswer: "React",
  },
  {
    id: 3,
    text: "Which library is used for building user interfaces in the MERN stack?",
    options: ["Vue", "Angular", "React", "Ember"],
    correctAnswer: "React",
  },
  {
    id: 4,
    text: "Which framework is used for backend development in the MERN stack?",
    options: ["Django", "Express", "Laravel", "Spring"],
    correctAnswer: "Express",
  },
  {
    id: 5,
    text: "Node.js is built on which JavaScript engine?",
    options: ["V8", "SpiderMonkey", "Chakra", "JavaScriptCore"],
    correctAnswer: "V8",
  },
];
const initialState = {
  currentQuestion: 0,
  answers: {},//it is object becoz I need to store the questionID and also a selectedOption
  score: null,
  isSubmitted : false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "NEXT_QUESTION": {
      return { ...state, currentQuestion: state.currentQuestion + 1 }
    }
    case "PREV_QUESTION": {
      return { ...state, currentQuestion: state.currentQuestion - 1 }
    }
    case "ANS_QUESTION": {
      return {
        ...state, answers: {
          ...state.answers, [action.payload.questionId]: action.payload.selectedOption
        }
      }
    }

    case "SET_SCORE": {
      return { ...state, score: action.payload,
        isSubmitted : true
       }
    }

    case "RETAKE_QUIZ":{
      return {...state,isSubmitted:false,score:null,answers:{},currentQuestion:0}
      //or else spread the initial state = return {...initialState} 
    }
   
  }
}


export default function App() {
  const [state, dispatch] = useReducer(
    reducer,
    localStorage.getItem("state")
      ? JSON.parse(localStorage.getItem("state"))
      : initialState
  );

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state])

  const handleAnswer = (question, option) => {
    dispatch({
      type: 'ANS_QUESTION',
      payload: {
        questionId: question.id,
        selectedOption: option
      }
    })
  }

  const handleRetake=()=>{
      dispatch({type:"RETAKE_QUIZ",payload:state.score})
  }

  const renderQuestion = () => {
    const question = questions[state.currentQuestion]
    return (
      <div>
        <h1> {question.id} : {question.text} </h1>
        <h3>{question.options.map((option, index) => {
          return (
            <div key={index}>
              <input
                type="radio"
                id={option}
                name={`question_${question.id}`}
                checked={option == state.answers[question.id]}
                onChange={(e) => {
                  handleAnswer(question, option)
                }}
              />
              <label htmlFor={option}>{option}</label>

            </div>
          )
        })}</h3>
      </div>
    )
  }

  const handleNext = () => {
    dispatch({ type: "NEXT_QUESTION" })
  }
  const handlePrev = () => {
    dispatch({ type: "PREV_QUESTION" })
  }

  const handleSubmit = () => {
    let score = 0
    for (const qId in state.answers) {
      const question = questions.find(ele => ele.id == qId)
      if (question.correctAnswer == state.answers[qId]) {
        score++
      }
    }
    dispatch({ type: "SET_SCORE", payload: score })
  }

  return (
    <div>

      {console.log("state", state)}

      <h1>Quiz App</h1>

      {state.isSubmitted ? (
        <div>
          <h2>Your score is {state.score}</h2>
          <button onClick={handleRetake}>Retake quiz</button>
        </div>
      ) :
        (
          <div>
            {renderQuestion()}
            {state.currentQuestion > 0 && <button onClick={handlePrev}>Previous</button>}
            {state.currentQuestion < questions.length - 1 && <button onClick={handleNext}>Next</button>}

            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}



    </div>
  )
}



{/* <input type="radio" name="question_1" value="Option 1" /> Option 1
<input type="radio" name="question_1" value="Option 2" /> Option 2
<input type="radio" name="question_1" value="Option 3" /> Option 3
Here:
All radio buttons share the same name value (question_1), so they are grouped together.
Only one radio button can be selected within this group.

name={question_${question.id}} dynamically sets the name based on the question's ID.
For example, if question.id is 1, the name becomes question_1.
All radio buttons for question 1 will share the same name, making them part of the same group. Therefore, the user can only select one option for that question. */}