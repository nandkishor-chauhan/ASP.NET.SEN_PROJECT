let allStudents = []; // store all from API

$(document).ready(function () {
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Student/GetCreatedData',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                let schoolList = response.data;
                let gradeList = response.gradeNameList;

                // Populate Former Schools
                let select = $("#former-school");
                select.find("option:not([value=''], [value='Other'])").remove();

                schoolList.forEach(school => {
                    select.append(`<option value="${school.formerSchool}">${school.formerSchool}</option>`);
                });

                // Populate Grade Checkboxes
                let gradeContainer = $("#grade-container");
                gradeContainer.empty(); // clear previous if any

                gradeList.forEach(grade => {
                    gradeContainer.append(`
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="gradeFilter" value="${grade.grade}">
                            <label class="form-check-label">${grade.grade}</label>
                        </div>
                    `);
                });

                // Add "All" option at the end
                gradeContainer.append(`
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="gradeAll" value="All">
                        <label class="form-check-label" for="gradeAll">All</label>
                    </div>
                `);

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
                renderTable(allStudents); // show all initially

                // show total count before filtering
                $("#student-count").text(allStudents.length);

            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching students:", error);
        }
    });
});

// Render the student table
function renderTable(students) {
    let tbody = $("#student-table-body");
    tbody.empty();

    if (students.length === 0) {
        tbody.append('<tr><td colspan="3" class="text-center text-danger">No Data Found</td></tr>');
        return;
    }

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


$(document).ready(function () {
    // Disable all form fields except Qatar ID at start
    $("form :input").not("#qatar-id").prop("disabled", true);

    // Helper to control buttons
    function toggleButtons(found) {
        if (found === true) {
            // Student exists → only Delete enabled
            $("#btn-save-add, #btn-save-finish").prop("disabled", true);
            $("#btn-delete").prop("disabled", false);
        } else if (found === false) {
            // Student not found → Save buttons enabled
            $("#btn-save-add, #btn-save-finish").prop("disabled", false);
            $("#btn-delete").prop("disabled", true);
        } else {
            // Initial → all disabled
            $("#btn-save-add, #btn-save-finish, #btn-delete").prop("disabled", true);
        }
    }

    // Start with all buttons disabled
    toggleButtons(null);

    // When pressing Enter in Qatar ID
    $("#qatar-id").on("keypress", function (e) {
        if (e.which === 13) {
            let qatarID = parseInt($(this).val(), 10);

            if (isNaN(qatarID) || qatarID <= 0) {
                alert(" Please enter a valid Qatar ID.");
                return;
            }

            $.ajax({
                url: '/SpecialEducationEncyclopedia/Student/GetById?qatarID=' + qatarID,
                type: 'GET',
                success: function (res) {
                    if (res.success && res.data) {
                        // Student exists
                        alert("Student ID already exists.");
                        $("form :input").not("#qatar-id").prop("disabled", true);
                        toggleButtons(true);

                        // Example: populate fields
                        $("#first-name").val(res.data.firstName);
                        $("#last-name").val(res.data.lastName);
                        $("#grade").val(res.data.grade);
                        $("#support-level").val(res.data.levelSuport);
                        $("#entry-status").val(res.data.entryStatus);
                    } else {
                        // Student not found
                        alert("Student ID is Not Found. Please enter details.");
                        $("form :input").not("#qatar-id").prop("disabled", false);
                        toggleButtons(false);
                    }
                },
                error: function () {
                    alert(" Error fetching student data.");
                }
            });
        }
    });
});



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








