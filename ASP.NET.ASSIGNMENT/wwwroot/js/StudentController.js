let allProperties = []; // store all from API

$(document).ready(function () {
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Student/Get',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                let studentList = response.data;
                renderTable(studentList);
            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching properties:", error);
        }
    });
});

function renderTable(students) {
    let tbody = $("#student-table-body");
    tbody.empty(); // clear old rows if any

    students.forEach(function (student, index) {
        let row = `
            <tr data-qatarid="${student.qatarID}" class="clickable-row">
                <td>${student.nationalty}</td>
                <td>${student.fullName}</td>
                <td>${index + 1}</td>
            </tr>
        `;
        tbody.append(row);
    });

    $(".clickable-row").css("cursor", "pointer");
    $(".clickable-row").on("click", function () {
        let studentId = $(this).data("qatarid");
        console.log("StudentId is", studentId);
        $(".clickable-row").removeClass("table-active");
        $(this).addClass("table-active");
        getStudentById(studentId);
    });
}


function getStudentById(qatarID) {
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Student/GetById?qatarID=' + qatarID,
        type: 'GET',
        success: function (response) {
            if (response.success) {
                let student = response.data;

                $("#student-fullname").text(student.fullName);

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
                $("#previous-support-level").val(student.formerLevel || "");
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


                //console.log("Selected student:", student);

                //alert("Name: " + student.fullName + "\nNationality: " + student.nationalty);
            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching student by ID:", error);
        }
    });
}






