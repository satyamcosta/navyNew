// import React, { useRef, useEffect, useState } from "react";
// import Tick from "@pqina/flip";
// import "@pqina/flip/dist/flip.min.css";
// import "./loading.css";

// export const SaveTreeCounter = ({ value }) => {
//   const divRef = useRef();
//   const tickRef = useRef();

//   // Function to pad the input value with leading zeros
//   const padWithZeros = (input, minLength) => {
//     const numDigits = Math.max(minLength, input.length);
//     return input.padStart(numDigits, "0");
//   };

//   useEffect(() => {
//     const didInit = (tick) => {
//       tickRef.current = tick;
//     };

//     const currDiv = divRef.current;
//     const tickValue = tickRef.current;
//     const paddedValue = padWithZeros(String(value), 3); // Ensure 3-digit minimum
//     Tick.DOM.create(currDiv, {
//       value: paddedValue,
//       didInit,
//     });

//     return () => Tick.DOM.destroy(tickValue);
//   }, [value]);

//   useEffect(() => {
//     if (tickRef.current) {
//       const paddedValue = padWithZeros(String(value), 3); // Ensure 3-digit minimum
//       tickRef.current.value = paddedValue;
//     }
//   }, [value]);

//   return (
//     <>
//       <div className="counter_div">
//         <div className="counter_div_span">
//           <span>Saved Trees</span>
//         </div>
//         <div ref={divRef} className="tick">
//           <div data-repeat="true">
//             <span data-view="flip" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

import React, { useRef, useEffect, useState } from "react";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import "./loading.css";

export const SaveTreeCounter = ({ value }) => {
  const divRef = useRef();
  const tickRef = useRef();

  // Function to format the input value as "1k" for thousands
  // Function to format the input value with a minimum of 3 digits

  const formatValue = (input) => {
    if (input >= 1000000) {
      const billions = (input / 1000000).toFixed(0);
      return `${billions}`.padStart(3, "0");
    } else if (input >= 1000) {
      const millions = (input / 1000).toFixed(0);
      return `${millions}`.padStart(3, "0");
    } else {
      return input.toString().padStart(3, "0");
    }
  };

  useEffect(() => {
    const didInit = (tick) => {
      tickRef.current = tick;
    };

    const currDiv = divRef.current;
    const tickValue = tickRef.current;
    const formattedValue = formatValue(value);
    Tick.DOM.create(currDiv, {
      value: formattedValue,
      didInit,
    });

    return () => Tick.DOM.destroy(tickValue);
  }, [value]);

  useEffect(() => {
    if (tickRef.current) {
      const formattedValue = formatValue(value);
      tickRef.current.value = formattedValue;
    }
  }, [value]);

  return (
    <>
      <div className="counter_div">
        <div className="counter_div_span">
          <span>Trees</span>
        </div>
        <div ref={divRef} className="tick">
          <div data-repeat="true">
            <span data-view="flip" />
          </div>
          {value >= 1000000 ? (
            <div className="custum_m">
              <div>M</div>
            </div>
          ) : value >= 1000 ? (
            <div className="custum_m">
              <div>K</div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
