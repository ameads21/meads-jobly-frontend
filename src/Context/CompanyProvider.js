import React, { useState, useEffect } from "react";
import JoblyApi from "../Api";
import CompanyContext from "./CompanyContext";

const CompanyProvider = ({ children }) => {
  const [comp, setComp] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function getCompanies() {
      let companies = await JoblyApi.getCompanies();
      setComp(companies);
    }
    getCompanies();
  }, []);

  useEffect(() => {
    async function getJobs() {
      let jobs = await JoblyApi.getJobs();
      setJobs(jobs);
    }
    getJobs();
  }, []);

  return (
    <CompanyContext.Provider value={{ comp, jobs }}>
      {children}
    </CompanyContext.Provider>
  );
};
export default CompanyProvider;
