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
    // Get QatarID from query string
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
        getStudentById(id); // call your existing AJAX function
    }
});

function getStudentById(id) {
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Student/GetById?id=' + id,
        type: 'GET',
        success: function (response) {
            if (response.success) {
                let student = response.data;

                $("#id").val(student.id);
                $("#student-fullname").val(student.fullName);

                // Address Information
                $("#student-city").val(student.city || "");
                $("#student-zone").val(student.zoneNumber || "");
                $("#student-street").val(student.streetNumber || "");
                $("#student-home").val(student.homeNumber || "");

                // Contact Information
                $("#father-phone").val(student.fatherPhone || "");
                $("#mother-phone").val(student.matherPhone || "");
                $("#uncle-phone").val(student.uncalPhone || "");
                $("#other-phone").val(student.otherPhone || "");

                // Personal Information
                $("#qatar-id").val(student.qatarID || "");
                $("#first-name").val(student.firstName || "");
                $("#last-name").val(student.lastName || "");
                $("#nationality").val(student.nationalty || "");
                $("#grade").val(student.grade || "");
                $("#division").val(student.division || "");

                $("#support-level").val(student.levelSuport || "");
                $("#previous-support-level").val(student.PreviousLevelSuport || "");
                $("#entry-status").val(student.entryStatus || "");
                $("#former-school").val(student.formerSchool || "");

                $("#date-of-birth").val(student.dateOfBirth || "");
                $("#date-of-registration").val(student.dateOfRegistration || "");
                $("#report-date").val(student.reportDate || "");
                $("#severity").val(student.severity || "");

                $("#health-number").val(student.healthNumber || "");
                $("#diagnosis").val(student.diagnosis || "");
                $("#type-of-disability").val(student.typeOfDisability || "");
                $("#iq").val(student.iq || "");
                $("#stat").val(student.stat || "");
                $("#report-source").val(student.reportSource || "");

                $("#case-description").val(student.caseDescription || "");

            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching student by ID:", error);
        }
    });
}



function saveStudent() {
    let student = {
        //fullName: $("#student-fullname").val(),
        id: $("#id").val(),
        city: $("#student-city").val(),
        zoneNumber: $("#student-zone").val(),
        streetNumber: $("#student-street").val(),
        homeNumber: $("#student-home").val(),
        fatherPhone: $("#father-phone").val(),
        matherPhone: $("#mother-phone").val(),
        uncalPhone: $("#uncle-phone").val(),
        otherPhone: $("#other-phone").val(),
        qatarID: $("#qatar-id").val(),
        firstName: $("#first-name").val(),
        lastName: $("#last-name").val(),
        nationalty: $("#nationality").val(),
        grade: $("#grade").val(),
        division: $("#division").val(),
        levelSuport: $("#support-level").val(),
        previousLevelSuport: $("#previous-support-level").val(),
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

    $.ajax({
        url: "/SpecialEducationEncyclopedia/Student/Edit",
        type: "POST",
        data: student,
        success: function (res) {
            alert(res.message);
        },
        error: function (err) {
            console.error(err);
            alert("Error saving student");
        }
    });
}





