import React from 'react'
import Questions from './components/Questions';
export default function App() {
  const [boolAmt, toggle] = React.useState({bool: false, amt:0});
  const [checkAns, setCheckAns] = React.useState({ toggleCheckAns: false, scoredPoints: 0, totalPoints: 0 })
  const [response, setResponse] = React.useState([]);
  function handleClick() {
    toggle(oldBool => ({...oldBool, bool: !oldBool.bool}))
  }
  function setQuestion(val){
    toggle(oldBool => ({...oldBool, amt: val}))
  }
  React.useEffect(() => {
    console.log("rendered");
    fetch(`https://opentdb.com/api.php?amount=${boolAmt.amt}`) // returns promise
      .then(res => res.json())
      .then(result => {
        const resultsWithId = result.results.map((resultsObject) => {
          let ans = [resultsObject.correct_answer, ...resultsObject.incorrect_answers]
          let indexArray = []
          for (let index = 0; index < ans.length;) {
            let ran = Math.round(Math.random() * (ans.length - 1))
            if (!indexArray.includes(ran)) {
              indexArray.push(ran)
              index++
            }
          }
          let ansObject = indexArray.map((index) => {
            return {
              ans: ans[index],
              isHeld: false,
              bgColor: null
            }
          })
          return {
            question: resultsObject.question,
            correct_answer: resultsObject.correct_answer,
            ans: ansObject,
            id: result.results.indexOf(resultsObject)
          }
        })
        console.log(resultsWithId)
        return setResponse(resultsWithId)
      })
      .catch(err => console.log(err))
  }, [boolAmt.bool, boolAmt.amt])
  const questArray = (
    response.map((item) => {
      return (
        <>
          <Questions id={item.id} item={item} selectAns={selectAns} />
          <hr />
        </>
      )
    })
  )

  function selectAns(questNo, ansNo) {
    setResponse(response => {
      const newResponse = response.map((responseItem) => {
        if (questNo === response.indexOf(responseItem)) {
          let updateAns = responseItem.ans.map((answerItem) => {
            return (ansNo === responseItem.ans.indexOf(answerItem) ?
              {
                ...answerItem,
                isHeld: !answerItem.isHeld
              } :
              {
                ...answerItem,
                isHeld: false
              }
            )
          })
          return {
            ...responseItem,
            ans: updateAns
          }
        }
        else {
          return responseItem
        }
      })
      return newResponse
    })
  }
  function submitAnswer() {
    if(checkAns.toggleCheckAns){
      toggle(oldState => ({bool: !oldState.bool, amt:0}));
      setCheckAns({
        toggleCheckAns: false,
        scoredPoints: 0,
        totalPoints: 0
      })
    }
    else{
      let checkAnswer = response.map((responseItem) => {
        return { ans: responseItem.ans, correct_answer: responseItem.correct_answer }
      })
      let totalPoints = response.length
      let scoredPoints = 0
      checkAnswer.forEach((ansObj) => {
        ansObj.ans.forEach((obj) => {
          if (!obj.isHeld) {
            return
          }
          else {
            if (obj.ans === ansObj.correct_answer) {
              scoredPoints += 1
            }
          }
        })
      })    
      setResponse(response => {
        const newResponse = response.map((responseItem) => {
        const responseItemObj = responseItem.ans.map((ansOb) => {
            if(ansOb.ans === responseItem.correct_answer && ansOb.isHeld){
              return {
                ...ansOb,
                bgColor: "green"
              }
            }
            else if(ansOb.ans === responseItem.correct_answer && !ansOb.isHeld){
              return {
                ...ansOb,
                bgColor: "green"
              }
            }
            else if(ansOb.ans !== responseItem.correct_answer && ansOb.isHeld){
              return {
                ...ansOb,
                bgColor: "red"
              }
            }
            else{
              return {
                ...ansOb,
                bgColor: "simple"
              }
            }
          })
        return {
          ...responseItem,
          ans:responseItemObj
        }
        })
        return newResponse
      })
      setCheckAns({
        toggleCheckAns: true,
        scoredPoints: scoredPoints,
        totalPoints: totalPoints
      })
    }
    
  }
  return (
    <main>
      {
        boolAmt.bool ? (
          <>
            {questArray}
            <div className="footer">
              {
                checkAns.toggleCheckAns && <span className="score">You scored {`${checkAns.scoredPoints}/${checkAns.totalPoints}`} correct answers</span>
              }
              <button onClick={submitAnswer} className="submit-btn">{checkAns.toggleCheckAns ? "New Quiz" : "Check Answers"}</button>
            </div>
          </>
        ) : (
          <div className="landing--page">
            <div className="title">
              Quizzical
            </div>
            <div className="desc">
              Insert Number of questions below.
            </div>
            <input onChange={(event) => setQuestion(event.currentTarget.value)} type="number" className="amt" />
            <button onClick={handleClick} className="btn">
              Start quiz
            </button>
          </div>
        )
      }
    </main>
  )
}