import React from 'react'
import { useState } from 'react'
import { performOpinionMining } from './performOpinionMining'

function Opinion() {
  const [inputData, setInputData] = useState('')
  var result = ['']
  const handleSubmit = async (e) => {
    e.preventDefault()

    result = await performOpinionMining(inputData)

    //console.log(result)

    for (var i = 0; i < result[0].sentences.length; i++) {
      console.log(result[0].sentences[i].minedOpinions)
    }
  }

  return (
    <div>
      <h4>Hello</h4>
      <div style={{ width: '500px', marginLeft: '50px' }}>
        <form>
          <div className="form-group">
            <textarea
              className="form-control"
              value={inputData}
              onChange={(e) => {
                setInputData(e.target.value)
              }}
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
        <br></br>
        <p>{result}</p>
      </div>
    </div>
  )
}

export default Opinion
