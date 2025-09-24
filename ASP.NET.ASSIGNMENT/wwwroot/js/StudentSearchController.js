let allStudents = []; // store all from API

$(document).ready(function () {
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Student/Get',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                allStudents = response.data;
                renderTable(allStudents);
            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching students:", error);
        }
    });

    //  apply filters whenever user types
    $("#filter-qatar-id, #filter-fullname, #filter-phone").on("keyup change", function () {
        renderTable(allStudents);
    });
});

function renderTable(students) {
    let tbody = $("#student-table-body");
    tbody.empty();

    //  take filter values
    let idFilter = $("#filter-qatar-id").val().toLowerCase();
    let nameFilter = $("#filter-fullname").val().toLowerCase();
    let phoneFilter = $("#filter-phone").val().toLowerCase();

    //  filter data
    let filtered = students.filter(s => {
        let matchId = !idFilter || (s.qatarID && s.qatarID.toString().toLowerCase().includes(idFilter));
        let matchName = !nameFilter || (s.fullName && s.fullName.toLowerCase().includes(nameFilter));
        let matchPhone = !phoneFilter || (
            (s.fatherPhone && s.fatherPhone.toLowerCase().includes(phoneFilter)) ||
            (s.matherPhone && s.matherPhone.toLowerCase().includes(phoneFilter)) ||
            (s.uncalPhone && s.uncalPhone.toLowerCase().includes(phoneFilter)) ||
            (s.otherPhone && s.otherPhone.toLowerCase().includes(phoneFilter))
        );
        return matchId && matchName && matchPhone;
    });

    //  render filtered rows
    filtered.forEach(function (student, index) {
        let row = `
            <tr data-qatarid="${student.qatarID}" class="clickable-row">
                <td>${student.qatarID}</td>
                <td>${student.fullName}</td>
                <td>${index+1}</td>
            </tr>
        `;
        tbody.append(row);
    });

    //  make rows clickable
    $(".clickable-row").css("cursor", "pointer");
    $(".clickable-row").on("click", function () {
        let studentId = $(this).data("qatarid");
        console.log("StudentId is", studentId);

        $(".clickable-row").removeClass("table-active");
        $(this).addClass("table-active");

        getStudentById(studentId);
    });
}


function confirmDelete() {
    if (confirm("هل أنت متأكد أنك تريد الحذف؟")) {
        alert("تم الحذف بنجاح");
    } else {
        alert("تم إلغاء الحذف");
    }
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


function saveStudent() {
    let student = {
        //fullName: $("#student-fullname").text(),
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

    $.ajax({
        url: "/SpecialEducationEncyclopedia/Student/Create",
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








