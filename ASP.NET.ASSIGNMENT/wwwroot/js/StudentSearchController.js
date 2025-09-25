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

$(document).ready(function () {
    //  Reset other filters when typing
    $("#filter-qatar-id").on("input", function () {
        if ($(this).val().trim() !== "") {
            $("#filter-fullname").val("");
            $("#filter-phone").val("");
        }
        renderTable(allStudents); // refresh table
    });

    $("#filter-fullname").on("input", function () {
        if ($(this).val().trim() !== "") {
            $("#filter-qatar-id").val("");
            $("#filter-phone").val("");
        }
        renderTable(allStudents);
    });

    $("#filter-phone").on("input", function () {
        if ($(this).val().trim() !== "") {
            $("#filter-qatar-id").val("");
            $("#filter-fullname").val("");
        }
        renderTable(allStudents);
    });
});


function renderTable(students) {
    let tbody = $("#student-table-body");
    tbody.empty();

    // 🔹 take filter values
    let idFilter = $("#filter-qatar-id").val().toLowerCase();
    let nameFilter = $("#filter-fullname").val().toLowerCase();
    let phoneFilter = $("#filter-phone").val().toLowerCase();
    let statusFilter = $("input[name='entry-status']:checked").val(); // Supported / Not Supported

    // 🔹 filter data
    let filtered = students.filter(s => {
        let matchId = !idFilter || (s.qatarID && s.qatarID.toString().toLowerCase().includes(idFilter));
        let matchName = !nameFilter || (s.fullName && s.fullName.toLowerCase().includes(nameFilter));
        let matchPhone = !phoneFilter || (
            (s.fatherPhone && s.fatherPhone.toLowerCase().includes(phoneFilter)) ||
            (s.matherPhone && s.matherPhone.toLowerCase().includes(phoneFilter)) ||
            (s.uncalPhone && s.uncalPhone.toLowerCase().includes(phoneFilter)) ||
            (s.otherPhone && s.otherPhone.toLowerCase().includes(phoneFilter))
        );
        let matchStatus = !statusFilter || (s.entryStatus && s.entryStatus === statusFilter);

        return matchId && matchName && matchPhone && matchStatus;

    });

    // render filtered rows
    filtered.forEach(function (student, index) {
        let row = `
            <tr data-qatarid="${student.qatarID}" class="clickable-row">
                <td>${student.nationalty}</td>
                <td>${student.fullName}</td>
                <td>${index + 1}</td>
            </tr>
        `;
        tbody.append(row);
    });

    // 🔹 update student count
    $("#student-count").text(filtered.length);

    // make rows clickable
    $(".clickable-row").css("cursor", "pointer");
    $(".clickable-row").on("click", function () {
        let studentId = $(this).data("qatarid");
        console.log("StudentId is", studentId);

        $(".clickable-row").removeClass("table-active");
        $(this).addClass("table-active");

        getStudentById(studentId);
    });
}

$(document).on("change", "input[name='entry-status']", function () {
    renderTable(allStudents); // assuming allStudents is your full list
    
});



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
                $("#student-city").text(student.city || "");
                $("#student-zone").text(student.zoneNumber || "");
                $("#student-street").text(student.streetNumber || "");
                $("#student-home").text(student.homeNumber || "");

                // Contact Information
                $("#father-phone").text(student.fatherPhone || "");
                $("#mother-phone").text(student.matherPhone || "");
                $("#uncle-phone").text(student.uncalPhone || "");
                $("#other-phone").text(student.otherPhone || "");

                // Personal Information
                $("#qatar-id").text(student.qatarID || "");
                $("#first-name").text(student.firstName || "");
                $("#last-name").text(student.lastName || "");
                $("#nationality").text(student.nationalty || "");
                $("#grade").text(student.grade || "");
                $("#division").text(student.division || "");

                $("#support-level").text(student.levelSuport || "");
                $("#previous-support-level").text(student.formerLevel || "");
                $("#entry-status").text(student.entryStatus || "");
                $("#former-school").text(student.formerSchool || "");

                $("#date-of-birth").text(student.dateOfBirth || "");
                $("#date-of-registration").text(student.dateOfRegistration || "");
                $("#report-date").text(student.reportDate || "");
                $("#severity").text(student.severity || "");

                $("#health-number").text(student.healthNumber || "");
                $("#diagnosis").text(student.diagnosis || "");
                $("#type-of-disability").text(student.typeOfDisability || "");
                $("#iq").text(student.iq || "");
                $("#stat").text(student.stat || "");
                $("#report-source").text(student.reportSource || "");

                $("#case-description").text(student.caseDescription || "");


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








