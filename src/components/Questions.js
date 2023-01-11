import React from 'react'

export default function Questions(props) {
    // success = #94D7A2;
    // wrong =#F8BCBC;
    let colorAndStyle;
    const ansArray = props.item.ans;
    const mapOptions = (
        ansArray.map((value, i) => {
            if (value.bgColor === "green") {
                colorAndStyle = {
                    backgroundColor: "#94D7A2",
                    color: "#293264"
                }
            }
            else if (value.bgColor === "red") {
                colorAndStyle = {
                    backgroundColor: "#F8BCBC",
                    color: "#293264"
                }
            }
            else if (value.bgColor === "simple") {
                colorAndStyle = {
                    opacity: 0.5,
                    border: "0.794239px solid #4D5B9E",
                    borderRadius: "7.94239px"
                }
            }
            else if(value.isHeld) {
                colorAndStyle = {
                    backgroundColor: "#D6DBF5"
                }
            }
            else{
                colorAndStyle = {
                    backgroundColor: "white"
                }
            }
            return (
                <span className='option' style={colorAndStyle} onClick={() => {
                    props.selectAns(props.item.id, i)
                }} dangerouslySetInnerHTML={{ __html: value.ans }} />
            )
        })
    )
    return (

        <div className="wrapQuestion">
            <div className='qeustions' dangerouslySetInnerHTML={{ __html: props.item.question }} />
            <div className="options">
                {
                    mapOptions
                }
            </div>
        </div>
    )
}