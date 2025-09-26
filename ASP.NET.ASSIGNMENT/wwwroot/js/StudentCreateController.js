let allStudents = []; // store all from API

$(document).ready(function () {
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Student/GetCreatedData',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                let schoolList = response.data;

                // Populate Former Schools
                let select = $("#former-school");
                select.find("option:not([value=''], [value='Other'])").remove();

                schoolList.forEach(school => {
                    select.append(`<option value="${school.formerSchool}">${school.formerSchool}</option>`);
                });

            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching schools/grades:", error);
        }
    });
});

$(document).ready(function () {
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Student/Get',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                allStudents = response.data;

            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching students:", error);
        }
    });
});

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}


$(document).ready(function () {
    $("form :input").not("#qatar-id").prop("disabled", true);

    function toggleButtons(found) {
        if (found === true) {
            $("#btn-save-add, #btn-save-finish").prop("disabled", true);
            $("#btn-delete").prop("disabled", false);
        } else if (found === false) {
            $("#btn-save-add, #btn-save-finish").prop("disabled", false);
            $("#btn-delete").prop("disabled", true);
        } else {
            $("#btn-save-add, #btn-save-finish, #btn-delete").prop("disabled", true);
        }
    }

    toggleButtons(null);

    // 🔹 Search function
    const searchStudent = debounce(function () {
        let qatarID = parseInt($("#qatar-id").val(), 10);

        if (isNaN(qatarID) || qatarID <= 0) {
            resetFields(); // clear fields if invalid input
            toggleButtons(null);
            return;
        }

        let student = allStudents.find(s => s.qatarID === qatarID);

        if (student) {
            // Student exists
            alert("Student ID already exists.");
            $("form :input").not("#qatar-id").prop("disabled", true);
            toggleButtons(true);

            $("#first-name").val(student.firstName ?? "");
            $("#last-name").val(student.lastName ?? "");
            $("#grade").val(student.grade ?? "");
            $("#support-level").val(student.levelSuport ?? "");
            $("#entry-status").val(student.entryStatus ?? "");
        } else {
            // Student not found
            alert("Student ID not found. Please enter details.");
            $("form :input").not("#qatar-id").prop("disabled", false);
            toggleButtons(false);

            resetFields();
        }
    }, 1000); // 2-second delay

    $("#qatar-id").on("input", searchStudent);

    function resetFields() {
        $("#first-name, #last-name, #grade, #support-level, #entry-status").val("");
    }
});


/*$(document).ready(function () {
    // Disable all form fields except Qatar ID at start
    $("form :input").not("#qatar-id").prop("disabled", true);

    function toggleButtons(found) {
        if (found === true) {
            $("#btn-save-add, #btn-save-finish").prop("disabled", true);
            $("#btn-delete").prop("disabled", false);
        } else if (found === false) {
            $("#btn-save-add, #btn-save-finish").prop("disabled", false);
            $("#btn-delete").prop("disabled", true);
        } else {
            $("#btn-save-add, #btn-save-finish, #btn-delete").prop("disabled", true);
        }
    }

    toggleButtons(null);

    $("#qatar-id").on("keypress", function (e) {
        if (e.which === 13) {
            let qatarID = parseInt($(this).val(), 10);

            if (isNaN(qatarID) || qatarID <= 0) {
                alert("Please enter a valid Qatar ID.");
                return;
            }

            // 🔹 Search in already loaded students
            let student = allStudents.find(s => s.qatarID === qatarID);

            if (student) {
                alert("Student ID already exists.");
                $("form :input").not("#qatar-id").prop("disabled", true);
                toggleButtons(true);

                // Populate fields from student object
                $("#first-name").val(student.firstName ?? "");
                $("#last-name").val(student.lastName ?? "");
                $("#grade").val(student.grade ?? "");
                $("#support-level").val(student.levelSuport ?? "");
                $("#entry-status").val(student.entryStatus ?? "");
            } else {
                alert("Student ID not found. Please enter details.");
                $("form :input").not("#qatar-id").prop("disabled", false);
                toggleButtons(false);

                // Clear input fields
                $("#first-name, #last-name, #grade, #support-level, #entry-status").val("");
            }
        }
    });
});

*/


function saveStudent() {
    // Array of required field selectors
    const requiredFields = [
        "#qatar-id",
        "#first-name",
        "#last-name",
        "#grade",
        "#support-level",
        "#entry-status"
    ];

    let isValid = true;

    // Validate required fields
    requiredFields.forEach(selector => {
        const field = $(selector);
        if (!field.val() || field.val().trim() === "") {
            field.css("border", "2px solid red");
            isValid = false;
        } else {
            field.css("border", "1px solid #ced4da");
        }
    });

    if (!isValid) {
        alert("Please fill all required fields.");
        return; // Stop if validation fails
    }

    // Collect form data
    let student = {
        city: $("#student-city").val(),
        zoneNumber: $("#student-zone").val(),
        streetNumber: $("#student-street").val(),
        homeNumber: $("#student-home").val(),
        fatherPhone: $("#father-phone").val(),
        matherPhone: $("#mother-phone").val(),
        uncalPhone: $("#uncle-phone").val(),
        otherPhone: $("#other-phone").val(),
        qatarID: parseInt($("#qatar-id").val(), 10),
        firstName: $("#first-name").val().trim(),
        lastName: $("#last-name").val().trim(),
        nationalty: $("#nationality").val(),
        grade: $("#grade").val(),
        division: $("#division").val(),
        levelSuport: $("#support-level").val(),
        formerLevel: $("#previous-support-level").val(),
        entryStatus: $("#entry-status").val(),
        formerSchool: $("#former-school").val(),
        dateOfBirth: $("#date-of-birth").val(),
        dateOfRegistration: $("#date-of-registration").val(),
        reportDate: $("#report-date").val(),
        severity: $("#severity").val(),
        healthNumber: $("#health-number").val(),
        diagnosis: $("#diagnosis").val(),
        typeOfDisability: $("#type-of-disability").val(),
        iq: $("#iq").val(),
        stat: $("#stat").val(),
        reportSource: $("#report-source").val(),
        caseDescription: $("#case-description").val()
    };

    // Send AJAX request
    $.ajax({
        url: "/SpecialEducationEncyclopedia/Student/Create",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(student),
        success: function (res) {
            alert(res.message || "Student saved successfully!");
        },
        error: function (err) {
            console.error(err);
            alert("Error saving student");
        }
    });
}








