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


function toggleOtherSchool(select) {
    const newSchoolInput = document.getElementById("new-school");
    if (select.value === "Other") {
        newSchoolInput.style.display = "block";
    } else {
        newSchoolInput.style.display = "none";
        newSchoolInput.value = "";
    }
}



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

    $(document).on("change", "input[name='supportLevel'], input[name='entry-status'], input[name='gradeFilter'], #gradeAll", function () {
        // If "All" grades is checked → uncheck others
        if ($(this).attr("id") === "gradeAll" && $(this).is(":checked")) {
            $("input[name='gradeFilter']").prop("checked", false);
        } else if ($(this).attr("name") === "gradeFilter" && $(this).is(":checked")) {
            $("#gradeAll").prop("checked", false);
        }

        applyFilters();
    });

});

function applyFilters() {
    let selectedLevel = $("input[name='supportLevel']:checked").val() || "All";
    let selectedStatus = $("input[name='entry-status']:checked").val() || "";

    let selectedGrades = [];
    $("input[name='gradeFilter']:checked").each(function () {
        selectedGrades.push($(this).val());
    });

    // If "All" is checked, ignore grade filter
    if ($("#gradeAll").is(":checked")) {
        selectedGrades = "All";
    }

    // Filter students
    let filtered = allStudents.filter(student => {
        let matchLevel = (selectedLevel === "All" || student.levelSuport == selectedLevel);
        let matchStatus = (!selectedStatus || student.entryStatus === selectedStatus);
        let matchGrade =
            (selectedGrades === "All" || selectedGrades.length === 0 || selectedGrades.includes(student.grade));

        return matchLevel && matchStatus && matchGrade;
    });

    renderTable(filtered);

    // Update student count
    $("#student-count").text(filtered.length);
}


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


function uploadFiles() {
    let studentId = parseInt($("#qatar-id").val(), 10); // convert to int
    let files = $("#formFile")[0].files;

    // Get selected file type (name) and date
    let selectedFileName = $("#selected-file-name").val();
    let selectedDate = $("#selected-date").val();

    if (isNaN(studentId) || studentId <= 0) {
        alert("Please enter a valid student ID.");
        return;
    }
    if (files.length === 0) {
        alert("Please select at least one file.");
        return;
    }

    let formData = new FormData();
    formData.append("studentId", studentId); // int value

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        // Default: keep original filename
        let newName = file.name;

        // If either filename OR date is selected → rename
        if (selectedFileName || selectedDate) {
            let ext = file.name.split('.').pop();
            newName = (selectedFileName ? selectedFileName.replace(/\s+/g, "_") : "File");
            if (selectedDate) {
                newName += "_" + selectedDate;
            }
            newName += "." + ext;
        }

        // Attach file (renamed if applicable)
        formData.append("files", file, newName);
    }

    $.ajax({
        url: "/SpecialEducationEncyclopedia/Student/UploadFiles",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res && res.success) {
                $("#upload-status").text(res.message || "Files uploaded successfully!");
            } else {
                $("#upload-status").text("Upload failed: " + (res.message || "Unknown error"));
            }
        },
        error: function (xhr, status, error) {
            console.error("Upload error:", error);
            $("#upload-status").text("Error uploading files.");
        }
    });
}







