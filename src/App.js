import React, { useEffect, useState } from 'react';
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import './App.css';
import InfoBox from "./InfoBox";
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './Utils';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
 // for default worlWide adding on selection
 const [country, setCountry] = useState("worldwide");
 const [countryInfo, setCountryInfo] = useState({});
 const [tableData, setTableData] = useState([]);
 const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });//center of map
 const [mapZoom, setMapZoom] = useState(3);
 const [mapCountries, setMapCountries] = useState([]);
 const [casesType, setCasesType] = useState("cases");


 useEffect(() => {
  fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
      console.log(data,"showing *******")
    });
}, []);
  //state short term memory space
  //STATE = How to write a variable in REACT

   //API : https://disease.sh/v3/covid-19/countries
  //FOR API calling , we need to use useEffect() hookss
  //USEEFFECT = Runs a piece of code based on given condition.
  //here below [] is condition.
  //empty [] means the code inside useEffect will run once 
  // when component or app loads and not again.
  // if [countries] - it means app will load once as well when
  //countries variable changes.
  useEffect(() => {
// we need to run a piece of code which is async
//async-> send a request to server, wait for it, 
//then do something with info.
 const getCountriesData = async() => {
   await fetch("https://disease.sh/v3/covid-19/countries")
     .then((response) => response.json())
     .then((data) => {
      const countries = data.map((country) => (
       //create object below
        {
          name: country.country,
          value: country.countryInfo.iso2
        }));
        //list of countries
        //setTableData(data);  now we hacve sorted country on basis of data
        const sortedData = sortData(data);
        setTableData(sortedData);
        //setTableData(data)
        setMapCountries(data);
        setCountries(countries);


     });
 };
  getCountriesData();
  }, []);

  //create function to render selected country data

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log(countryCode);
   //set the selected country variable
    setCountry(countryCode);
    
    const url =
    countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        // All of the data....
        // from the country response.
        setCountryInfo(data);
        // it will help when we click on any country, it will take us to selected country on maps
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]); 
        setMapZoom(4);
      });

  };

  console.log("Country info >>>", countryInfo)
  return (
    //here app is parent container for app__left & app__right -> use flex
    <div className="app">
    <div className="app__left">
    <div className='app__header'>
     <h1>COVID-19 TRACKER</h1>
     <FormControl className='app__dropdown'>
      {/* <Select variant="outlined" value="abc"> */}
      <Select variant="outlined" onChange = {onCountryChange} value={country}>
      <MenuItem value="worldwide">WorldWide
        </MenuItem>
        {/* Instead of doing hard coded below,
        loop through all the countries and show abc
        drop down lists of the options */}
        {/* <MenuItem value="worldwide">worldwide
        </MenuItem>
        <MenuItem value="worldwide">Option2
        </MenuItem>
         */}
        {countries.map((country) => (
          // .value and .name object value defined in useEffect()
         <MenuItem value={country.value}>{country.name}</MenuItem>
        ))
        }
      </Select>
      </FormControl>
      </div>
      {/* Header */}
      {/* title + Select input dropdown field */}

      <div className='app__stats'>
        <InfoBox
         active={casesType === "cases"}
         isRed
         onClick={(e) => setCasesType("cases")}
        title ="Coronavirus Cases"
         cases={prettyPrintStat(countryInfo.todayCases)} // 004545 value give to like +139.5k format
          total={prettyPrintStat(countryInfo.cases)}/>
        <InfoBox
        active={casesType === "recovered"}
        onClick={(e) => setCasesType("recovered")}
         title ="Recovered"
          cases={prettyPrintStat(countryInfo.todayRecovered)}
           total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox 
        active={casesType === "deaths"}
         onClick={(e) => setCasesType("deaths")}
         title ="Deaths"
         isRed
         cases={prettyPrintStat(countryInfo.todayDeaths)} 
         total={prettyPrintStat(countryInfo.deaths)}/>
    {/* <InfoBox title ="Coronavirus Cases" cases={123} total={2000}/>
        <InfoBox title ="Recovered" cases={1234} total={3000}/>
        <InfoBox title ="Deaths" cases={12345} total={4000}/> */}
      {/* InfoBoxs title="Coronovirus cases "*/}
      {/* InfoBoxs title = "recoveries"*/}
      {/* InfoBoxs */}
      </div>
      {/* Table */}
      {/* Graph */}
      {/* Map */}
      <Map
       caseType={casesType}
        countries = {mapCountries} center = {mapCenter} zoom = {mapZoom} />
    </div>

    <Card className="app__right">
      <CardContent>
       <h3>Live Cases by Country</h3>
       <Table countries={tableData} />
       <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
       <LineGraph className="app__graph" casesType={casesType}/>
       {/* Table */}
       {/* Graph */}
      </CardContent>
    </Card>
    </div>
  );
}

export default App;
