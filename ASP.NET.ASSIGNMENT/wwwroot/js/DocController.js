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

let filteredStudents = []; // currently filtered data
let selectedIndex = 0;

function renderTable(students) {
    let tbody = $("#student-table-body");
    tbody.empty();

    let idFilter = $("#filter-qatar-id").val().toLowerCase();
    let nameFilter = $("#filter-fullname").val().toLowerCase();
    let phoneFilter = $("#filter-phone").val().toLowerCase();

    // Filter data
    filteredStudents = students.filter(s => {
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

    // Render rows
    filteredStudents.forEach((student, index) => {
        let row = `
            <tr data-index="${index}" data-qatarid="${student.qatarID}" class="clickable-row">
                <td>${index + 1}</td>
                <td>${student.fullName}</td>
            </tr>
        `;
        tbody.append(row);
    });

    $("#student-count").text(filteredStudents.length);

    $(".clickable-row").css("cursor", "pointer");
    $(".clickable-row").on("click", function () {
        selectedIndex = $(this).data("index");
        selectRow(filteredStudents, selectedIndex); // ✅ use selectRow
    });
}

$(document).ready(function () {
    // Call renderTable when a radio button changes
    $("input[name='entry-status']").on("change", function () {
        renderTable(allStudents);
    });

    // Also call renderTable when typing in filters
    $("#filter-qatar-id, #filter-fullname, #filter-phone").on("input", function () {
        renderTable(allStudents);
    });
});



function selectRow(students, index) {
    $(".clickable-row").removeClass("table-active");

    let row = $(`tr[data-index="${index}"]`);
    row.addClass("table-active");

    let student = students[index];
    if (student) {
        selectedStudentId = student.id; // store selected student ID
        fillPersonalInfo(student);
        loadStudentFilesByQatarID(student.qatarID);
        // Update Edit button href
        $("#edit-button").attr("href", `/SpecialEducationEncyclopedia/Student/Edit?id=${selectedStudentId}`);
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
        
function nextStudent() {
    if (filteredStudents.length === 0) return;

    selectedIndex = (selectedIndex + 1) % filteredStudents.length;
    selectRow(filteredStudents, selectedIndex);
}

function prevStudent() {
    if (filteredStudents.length === 0) return;

    selectedIndex = (selectedIndex - 1 + filteredStudents.length) % filteredStudents.length;
    selectRow(filteredStudents, selectedIndex);
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








