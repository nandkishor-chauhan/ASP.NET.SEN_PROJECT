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
    // Fetch all students
    $.ajax({
        url: '/SpecialEducationEncyclopedia/Student/Get',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                allStudents = response.data;
                renderTable(allStudents); // show all initially
            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching students:", error);
        }
    });

    // Filter on typing
    $("#filter-qatar-id, #filter-fullname").on("input", function () {
        applyTextFilters();
    });
});

let filteredStudents = [];
let currentIndex = 0;
let selectedStudentId = null;

function applyTextFilters() {
    let qatarIDFilter = $("#filter-qatar-id").val().trim();
    let fullnameFilter = $("#filter-fullname").val().trim().toLowerCase();

    filteredStudents = allStudents.filter(student => {
        let matchID = qatarIDFilter === "" || student.qatarID.toString().includes(qatarIDFilter);
        let matchName = fullnameFilter === "" || student.fullName.toLowerCase().includes(fullnameFilter);
        return matchID && matchName;
    });

    renderTable(filteredStudents);
}

function renderTable(students) {
    let tbody = $("#student-table-body");
    tbody.empty();

    if (students.length === 0) {
        tbody.append('<tr><td colspan="3" class="text-center text-danger">No Data Found</td></tr>');
        clearPersonalInfo();
        selectedStudentId = null;
        return;
    }

    students.forEach(function (student, index) {
        tbody.append(`
            <tr data-index="${index}" data-qatarid="${student.qatarID}" class="clickable-row">
                <td>${index + 1}</td>
                <td>${student.fullName}</td>
            </tr>
        `);
    });

    $(".clickable-row").css("cursor", "pointer").on("click", function () {
        currentIndex = $(this).data("index");
        selectRow(students, currentIndex);
    });

    // Auto-select first row
    currentIndex = 0;
    selectRow(students, currentIndex);
}

function selectRow(students, index) {
    $(".clickable-row").removeClass("table-active");
    let row = $(`tr[data-index="${index}"]`);
    row.addClass("table-active");

    let student = students[index];
    if (student) {
        selectedStudentId = student.id;
        fillPersonalInfo(student);
        loadStudentFilesByQatarID(student.qatarID); // Load files for this student
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

$(document).ready(function () {
    // Initial state
    $("#filter-qatar-id").prop("disabled", true);
    $("#filter-fullname").prop("disabled", true);

    // Listen for radio changes
    $("input[name='mode']").on("change", function () {
        if ($("#radioSearch").is(":checked")) {
            $("#filter-qatar-id").prop("disabled", false).focus();
            $("#filter-fullname").prop("disabled", false);
        } else {
            $("#filter-qatar-id").prop("disabled", true).val("");
            $("#filter-fullname").prop("disabled", true).val("");
            applyTextFilters(); // reset filter if needed
        }
    });
});


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

