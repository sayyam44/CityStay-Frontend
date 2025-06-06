import React, { useState } from 'react'

function AppleComponent() {

    const [numberOfApples,setNumberofapples] = useState(0)

    function AppleDisplay(numberOfApples) {
        if (numberOfApples===0 || numberOfApples===1){
          return `John has ${numberOfApples} apples`;
        }
        else if (numberOfApples>1){
          return `John has ${numberOfApples} apples`;
        }
        else{
            return `John owes us ${numberOfApples} apples`;
        }
      }
    
    function IncreaseApple(){
        setNumberofapples((curr)=>curr+1)
    }

    function DecreaseApple(){
        setNumberofapples((curr)=>curr-1)
    }

  return (
    <>
    <div>
        <h1> {AppleDisplay(numberOfApples)}</h1>
    </div>
    <button onClick={IncreaseApple} className="add-btn">Increase</button>
    <button style={{ display:numberOfApples <=0 ? "None" : ""}} onClick={DecreaseApple} className="decrease-btn">Decrease</button>
    {/* {Toomanydisplay()} */}
    {numberOfApples > 10 ? <h1> John have too many apples</h1>:""}
    </>
  );
}

export default AppleComponent