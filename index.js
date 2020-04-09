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

  .my-0 {
    margin-top: 0;
    margin-bottom: 0;
  }
  .my-1 {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .my-3 {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .my-4 {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .my-5 {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }
  .my-6 {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .my-8 {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .my-10 {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }
  .my-12 {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
  .my-16 {
    margin-top: 4rem;
    margin-bottom: 4rem;
  }
  .my-20 {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  .my-24 {
    margin-top: 6rem;
    margin-bottom: 6rem;
  }
  .my-32 {
    margin-top: 8rem;
    margin-bottom: 8rem;
  }
`;

const TeacherIDLookup = () => {
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

    axios
      .get(
        `https://programs.nef1.org/api/teacher.php?schoolId=${selectedSchool.schoolID}&name=${teacherSearch}`
      )
      .then(({ data }) => {
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

  const searchForSchools = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    axios
      .get(`https://programs.nef1.org/api/school.php?name=${schoolSearch}`)
      .then(({ data }) => {
        setSchools(
          data.data.sort(
            (a, b) => a.schoolName.toLowerCase() > b.schoolName.toLowerCase()
          )
        );
      })
      .catch((response) => {
        setSchoolSearchState("error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    setSchools([]);
  }, [schoolSearch]);

  return (
    <Container>
      <h2>Find Your Teacher ID</h2>
      <div className="progress-tracker">
        <button
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
          <strong>1</strong> <small>Find Your School - Enter the keyword of your school's name example - Kennedy for John F Kennedy</small>
        </button>
        <button
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
          <strong>2</strong> <small>Find Your Teacher</small>
        </button>
        <button
          onClick={(e) => e.preventDefault()}
          className={step > 2 ? "active" : ""}
          disabled={step < 3}
        >
          <strong>3</strong> <small>Submit Your HEW</small>
        </button>
      </div>

      {step === 1 && (
        <form className="school-search" onSubmit={searchForSchools}>
          <div>
            <label htmlFor="schoolSearch">School Name</label>
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
            <button disabled={isSubmitting} type="submit">
              Search for School
            </button>
          </div>
          <div>
            {schools.length ? <p>Choose from the list</p> : ""}
            {schoolSearchState === "error" && (
              <div className="error-message">No schools match your search</div>
            )}
            {schools.map((school) => (
              <div key={school.schoolID}>
                <button
                  className="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSchool(school);
                    setStep(2);
                  }}
                >
                  {school.schoolName} ( {school.schoolCity}, {school.schoolState})
                </button>
              </div>
            ))}
          </div>
        </form>
      )}

      {step === 2 && (
        <div>
          <p className="my-6">
            Great! Now we know your at{" "}
            <strong>{selectedSchool.schoolName}</strong>. Now tell use which
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
            <div key={teacher.teacherID}>
              <button
                className="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTeacher(teacher);
                  setStep(3);
                }}
              >
                {teacher.teacherLastName}, {teacher.teacherFirstName}
              </button>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="teacher-box">
          <h3>
            {selectedTeacher.teacherLastName},{" "}
            {selectedTeacher.teacherFirstName}
          </h3>
          <p>Teacher ID: {selectedTeacher.teacherID}</p>
          <p>
            <a
              href={`https://hews.nef1.org/forms/show/${selectedTeacher.teacherID}`}
            >
              Submit an HEW
            </a>
          </p>
        </div>
      )}
    </Container>
  );
};

ReactDOM.render(
  <TeacherIDLookup />,
  document.getElementById("NEF_Programs_Teacher_ID_Lookup_app")
);
