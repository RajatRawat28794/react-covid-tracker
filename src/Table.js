import React from "react";
import "./Table.css";
//import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;

 {/* another way to do this destructing country object below {countries.map(country => {
        <tr>
           <td>{country.country}</td> 
           <td><strong>{country.cases}</strong></td>
        </tr>
      })} */} 