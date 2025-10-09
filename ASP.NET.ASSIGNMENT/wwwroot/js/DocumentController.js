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
                        <input class="form-check-input" type="checkbox" id="gradeAll" value="All" checked>
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
                //renderTable(allStudents); // show all initially

                applyFilters(); // apply default filters (if any)

                // show total count before filtering
                $("#student-count").text($("#student-table-body tr").length);

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

let filteredStudents = [];  // store filtered results
let currentIndex = 0;       // track selected row globally
let selectedStudentId = null;

function applyFilters() {
    let selectedLevel = $("input[name='supportLevel']:checked").val() || "All";
    let selectedStatus = $("input[name='entry-status']:checked").val();

    let selectedGrades = [];
    $("input[name='gradeFilter']:checked").each(function () {
        selectedGrades.push($(this).val());
    });

    if ($("#gradeAll").is(":checked")) {
        selectedGrades = "All";
    }

    // Filter students
    filteredStudents = allStudents.filter(student => {
        let matchLevel = (selectedLevel === "All" || student.levelSuport == selectedLevel);
        let matchStatus = (!selectedStatus || student.entryStatus === selectedStatus);
        let matchGrade = (selectedGrades === "All" || selectedGrades.length === 0 || selectedGrades.includes(student.grade));

        return matchLevel && matchStatus && matchGrade;
    });

    renderTable(filteredStudents);

    // Update student count
    $("#student-count").text(filteredStudents.length);
}

function renderTable(students) {
    let tbody = $("#student-table-body");
    tbody.empty();

    if (students.length === 0) {
        tbody.append('<tr><td colspan="3" class="text-center text-danger">No Data Found</td></tr>');
        clearPersonalInfo();
        selectedStudentId = null;
        $("#edit-button").attr("href", "#");
        return;
    }

    students.forEach(function (student, index) {
        let row = `
            <tr data-index="${index}" data-qatarid="${student.qatarID}" class="clickable-row">
                <td>${index + 1}</td>
                <td>${student.fullName}</td>
            </tr>
        `;
        tbody.append(row);
    });

    $(".clickable-row").css("cursor", "pointer").on("click", function () {
        currentIndex = $(this).data("index");
        selectRow(students, currentIndex);
    });

    // Auto-select first row
    currentIndex = 0;
    selectRow(students, currentIndex);
}


// Helper to select a row
function selectRow(students, index) {
    $(".clickable-row").removeClass("table-active");

    let row = $(`tr[data-index="${index}"]`);
    row.addClass("table-active");

    let student = students[index];
    if (student) {
        selectedStudentId = student.id; // store selected student ID
        fillPersonalInfo(student);
        loadStudentFilesByQatarID(student.qatarID);
    }
}

// fill details
function fillPersonalInfo(student) {

    $("#student-fullname").text(student.fullName);

    $("#qatar-id").text(student.qatarID || "");
    $("#grade").text(student.grade || "");
    $("#division").text(student.division || "");

    $("#support-level").text(student.levelSuport || "");

    $("#report-date").text(student.reportDate || "");

    $("#case-description").text(student.caseDescription || "");
}

function clearPersonalInfo() {

    $("#student-fullname").text("");

    // Personal Information
    $("#qatar-id").val("");
    $("#grade").text("");
    $("#division").text("");

    $("#support-level").text("");

    $("#report-date").text("");

    $("#report-source").text("");

    $("#case-description").text("");
}

// Next / Previous buttons
function nextStudent() {
    if (filteredStudents.length === 0) return;

    if (currentIndex < filteredStudents.length - 1) {
        currentIndex++;
        selectRow(filteredStudents, currentIndex);
    }
}

function prevStudent() {
    if (filteredStudents.length === 0) return;

    if (currentIndex > 0) {
        currentIndex--;
        selectRow(filteredStudents, currentIndex);
    }
}


function loadStudentFilesByQatarID(qatarID) {
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Document/GetFilesByQatarID?qatarID=' + qatarID,
        type: 'GET',
        success: function (res) {
            let tbody = $("#student-doc-table");
            tbody.empty();

            if (!res.success || !res.files || res.files.length === 0) {
                tbody.append(`<tr><td colspan="3" class="text-center text-danger">No files found for this student</td></tr>`);
                $("#file-count").text("0");
                return;
            }

            // Display total file count
            $("#file-count").text(res.count || 0);

            res.files.forEach((file, index) => {
                let row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td><a href="${file.url}" target="_blank">${file.fileName}</a></td>
                        <td>${file.dateCreated}</td>
                    </tr>
                `;
                tbody.append(row);
            });
        },
        error: function (xhr, status, error) {
            $("#student-doc-table").html(`<tr><td colspan="3" class="text-center text-danger">Error loading files</td></tr>`);
            $("#file-count").text("0");
        }
    });
}

