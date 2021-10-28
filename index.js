import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  font-family: sans-serif;
  font-size: 1.2em;
  max-width: 700px;
  width: 100%;
  color: var(--nef-teacher-lookup-text-color);
  padding: 2rem 1rem;
  margin: auto;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  div {
    width: 100%;
  }

  h3 {
    font-size: 24px;
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .progress-tracker {
    display: flex;
    justify-content: stretch;
    margin-bottom: 2rem;

    button {
      font-size: 1.2rem;
      color: var(--nef-teacher-lookup-light-color);
      background-color: var(--nef-teacher-lookup-accent-color);
      border: thin solid var(--nef-teacher-lookup-accent-color);
      appearance: none;
      padding: 0.5rem 0.75rem;
      flex: 1 1 0%;
      margin: 0 1rem;
    }

    .active {
      color: var(--nef-teacher-lookup-base-color);
      border-bottom: thin solid var(--nef-teacher-lookup-base-color);
    }
  }

  .school-search {
    padding: 1rem 0;
  }

  .teacher-box {
    background: var(--nef-teacher-lookup-accent-color);
    border: thin solid var(--nef-teacher-lookup-light-color);
    margin-top: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  label {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input {
    background: var(--nef-teacher-lookup-accent-color);
    border: thin solid var(--nef-teacher-lookup-light-color);
    border-radius: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    appearance: none;
    line-height: 1.2rem;

    font-size: 1.2rem;
    width: 100%;

    :focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
    }
  }

  button[type="submit"] {
    margin-top: 1.5rem;
    border: none;
    color: var(--nef-teacher-lookup-accent-color);

    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    line-height: 1.25;
    font-weight: 600;
    border-radius: 0.5rem;
    background-color: var(--nef-teacher-lookup-base-color);
  }

  button.secondary {
    margin-top: 0.5rem;
    border: none;
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    line-height: 1.25;
    font-weight: 600;
    border-radius: 0.5rem;
    background-color: var(--nef-teacher-lookup-accent-color);
    color: var(--nef-teacher-lookup-base-color);
  }

  .opacity-25 {
    opacity: 0.25;
  }

  .block {
    display: block;
  }

  .error-message {
    color: var(--nef-teacher-lookup-error-color);
  }

  .my-6 {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const TeacherIDLookup = ({ programId, programJobCode, year }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schoolSearchState, setSchoolSearchState] = useState("initial");
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(false);
  const [teacherSearchState, setTeacherSearchState] = useState("initial");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(false);

  const apiBaseUrl =
    location.hostname === "localhost"
      ? `http://localhost/api/open/`
      : `https://api.programs.nef1.org/api/open/`;

  useEffect(() => {
    if (!teacherSearch || teacherSearch.length < 2) {
      setTeacherSearchState("initial");
      setTeachers([]);
      return;
    }

    const endpoint = `${apiBaseUrl}teacher-search?school_id=${selectedSchool.id}&last_name=${teacherSearch}`;

    axios
      .get(endpoint)
      .then(({ data }) => {
        setTeacherSearchState("loaded");
        setTeachers(data.data);
      })
      .catch((response) => {
        setTeachers([]);
        setTeacherSearchState("error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [selectedSchool, teacherSearch]);

  const searchForSchools = () => {
    setIsSubmitting(true);

    const endpoint = `${apiBaseUrl}school-search?search=${schoolSearch}&programId=${programId}&programJobCode=${programJobCode}&year=${year}`;

    const nameKey = "name";
    axios
      .get(endpoint)
      .then(({ data }) => {
        setSchoolSearchState("loaded");
        setSchools(
          data.data.sort(
            (a, b) => a[nameKey].toLowerCase() > b[nameKey].toLowerCase()
          )
        );
        if (!data.data.length) {
          setSchoolSearchState("error");
        }
      })
      .catch((response) => {
        setSchoolSearchState("error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    return false;
  };

  useEffect(() => {
    setSchools([]);
  }, [schoolSearch]);

  return (
    <Container id="teacher_id_lookup_container">
      <h2>Find your teacher ID</h2>
      <div className="progress-tracker">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setStep(1);
            setTeacherSearch("");
            setSchoolSearch("");
            setSelectedSchool(false);
            setSelectedTeacher(false);
            setSchools([]);
            setTeachers([]);
          }}
          className="active"
        >
          <strong>1</strong> <small>Find your school</small>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setStep(2);
            setTeacherSearch("");
            setSelectedTeacher(false);
            setTeachers([]);
          }}
          className={step > 1 ? "active" : ""}
          disabled={step < 2}
        >
          <strong>2</strong> <small>Find your teacher</small>
        </button>
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className={step > 2 ? "active" : ""}
          disabled={step < 3}
        >
          <strong>3</strong> <small>Submit your form</small>
        </button>
      </div>

      {step === 1 && (
        <div className="school-search">
          <div>
            <label htmlFor="schoolSearch">
              Enter the keyword of your school's name. Example - Kennedy for
              John F Kennedy
            </label>
            <input
              id="schoolSearch"
              onChange={(e) => {
                setSchoolSearch(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  searchForSchools();
                }
              }}
              placeholder="School Name"
              type="text"
              value={schoolSearch}
            />
          </div>
          <div
            className={`${
              isSubmitting || schoolSearch === "" ? "opacity-25" : ""
            }`}
          >
            <button
              type="button"
              disabled={isSubmitting || schoolSearch === ""}
              onClick={searchForSchools}
              type="submit"
            >
              Search for School
            </button>
          </div>
          <div>
            {schools.length ? <p>Choose from the list</p> : ""}
            {schoolSearchState === "error" && (
              <div className="error-message">No schools match your search</div>
            )}
            {schools.map((school) => {
              const schoolId = school.schoolID || school.id;
              const schoolName = school.schoolName || school.name;
              const programName = school.programShortDescription
                ? school.programShortDescription.replace(
                    new Date().getFullYear(),
                    ""
                  )
                : school.program_name;
              const schoolCity = school.schoolCity || school.city;
              const schoolState = school.schoolState || school.state;

              return (
                <div key={schoolId}>
                  <button
                    type="button"
                    className="secondary"
                    data-id={schoolId}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSchool(school);
                      setStep(2);
                    }}
                  >
                    {schoolName} - {programName}
                    {schoolCity && schoolState
                      ? ` (${schoolCity}, ${schoolState})`
                      : ""}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="my-6">Great! Now tell us which teacher you have.</p>

          <div>
            <label htmlFor="teacherSearch">Teacher Last Name</label>
            <input
              id="teacherSearch"
              type="text"
              value={teacherSearch}
              placeholder="Teacher Last Name"
              onChange={(e) => {
                setTeacherSearch(e.target.value);
              }}
            />
          </div>

          {teachers.length ? <p>Choose your teacher from the list</p> : ""}
          {teacherSearchState === "error" && (
            <div className="error-message">No teachers match your search</div>
          )}
          {teachers.map((teacher) => (
            <div key={teacher.teacherID || teacher.id}>
              <button
                data-id={teacher.teacherID || teacher.id}
                type="button"
                className="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTeacher(teacher);
                  setStep(3);
                }}
              >
                {teacher.teacherLastName || teacher.last_name},{" "}
                {teacher.teacherFirstName || teacher.first_name}
              </button>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="teacher-box">
          <h3>
            {selectedTeacher.teacherLastName || selectedTeacher.last_name},{" "}
            {selectedTeacher.teacherFirstName || selectedTeacher.first_name}
          </h3>
          <p>Teacher ID: {selectedTeacher.teacherID || selectedTeacher.id}</p>
          <p>
            {selectedTeacher.teacherID ? (
              <a
                href={`https://hews.nef1.org/forms/show/${
                  selectedTeacher.teacherID || selectedTeacher.id
                }`}
              >
                Submit your form
              </a>
            ) : (
              <a
                href={`https://worksheets.nef1.org/forms/show/${
                  selectedTeacher.teacherID || selectedTeacher.id
                }`}
              >
                Submit your form
              </a>
            )}
          </p>
        </div>
      )}
    </Container>
  );
};

var teacherIdContainer = document.getElementById(
  "NEF_Programs_Teacher_ID_Lookup_app"
);
if (teacherIdContainer) {
  ReactDOM.render(
    <TeacherIDLookup
      programId={teacherIdContainer.getAttribute("program_id")}
      programJobCode={teacherIdContainer.getAttribute("program_job_code")}
      year={teacherIdContainer.getAttribute("year")}
    />,
    teacherIdContainer
  );
}
