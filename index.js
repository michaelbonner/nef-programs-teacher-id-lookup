import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  font-family: sans-serif;
  font-size: 1.2em;
  max-width: 700px;
  width: 100%;
  color: #4a5568;
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
      color: #a0aec0;
      background-color: white;
      border: thin solid white;
      appearance: none;
      padding: 0.5rem 0.75rem;
      flex: 1 1 0%;
      margin: 0 1rem;
    }

    .active {
      color: #38b2ac;
      border-bottom: thin solid #38b2ac;
    }
  }

  .school-search {
    padding: 1rem 0;
  }

  .teacher-box {
    background: white;
    border: thin solid #a0aec0;
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
    background: white;
    border: thin solid #a0aec0;
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
    color: white;

    padding: 1rem 1.25rem;
    font-size: 1.125rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    line-height: 1.25;
    font-weight: 600;
    border-radius: 0.5rem;
    background-color: #38b2ac;
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
    background-color: white;
    color: #38b2ac;
  }

  .opacity-25 {
    opacity: 0.25;
  }

  .block {
    display: block;
  }

  .error-message {
    color: #ed8936;
  }

  .my-6 {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const TeacherIDLookup = ({ version }) => {
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

  useEffect(() => {
    if (!teacherSearch || teacherSearch.length < 2) {
      setTeacherSearchState("initial");
      setTeachers([]);
      return;
    }

    const endpoint =
      parseInt(version) === 1
        ? `https://programs.nef1.org/api/teacher.php?schoolId=${selectedSchool.schoolID}&name=${teacherSearch}`
        : `https://api.programs.nef1.org/api/open/teacher-search?school_id=${selectedSchool.id}&last_name=${teacherSearch}`;

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

    const endpoint =
      parseInt(version) === 1
        ? `https://programs.nef1.org/api/school.php?name=${schoolSearch}`
        : `https://api.programs.nef1.org/api/open/school-search?search=${schoolSearch}`;

    const nameKey = parseInt(version) === 1 ? "schoolName" : "name";
    axios
      .get(endpoint)
      .then(({ data }) => {
        setSchoolSearchState("loaded");
        setSchools(
          data.data.sort(
            (a, b) => a[nameKey].toLowerCase() > b[nameKey].toLowerCase()
          )
        );
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
    <Container>
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
              placeholder="School Name"
              type="text"
              value={schoolSearch}
            />
          </div>
          <div className={`${isSubmitting ? "opacity-25" : ""}`}>
            <button
              type="button"
              disabled={isSubmitting}
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
            {schools.map((school) => (
              <div key={school.schoolID || school.id}>
                <button
                  type="button"
                  className="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSchool(school);
                    setStep(2);
                  }}
                >
                  {school.schoolName || school.name} -{" "}
                  {school.programShortDescription
                    ? school.programShortDescription.replace(
                        new Date().getFullYear(),
                        ""
                      )
                    : school.program_name}{" "}
                  ({school.schoolCity || school.city},{" "}
                  {school.schoolState || school.state})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="my-6">
            Great! Now we know you're at{" "}
            <strong>{selectedSchool.schoolName}</strong>. Now tell us which
            teacher you have.
          </p>

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
ReactDOM.render(
  <TeacherIDLookup version={teacherIdContainer.getAttribute("version")} />,
  teacherIdContainer
);
