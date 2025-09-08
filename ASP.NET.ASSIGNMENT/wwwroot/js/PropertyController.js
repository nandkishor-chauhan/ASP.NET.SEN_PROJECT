var dataTable;
$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    dataTable = $('#tableData').DataTable({
        "ajax": {
            url: '/HouseBroker/Property/Get'
        },
        "columns": [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1; 
                },
            },
            {
                data: 'imageUrl',
                render: function (data) {
                    return `<img src="${data}" style="width:100px;height:auto;" />`;
                }
            },
            { data: 'propertyType' },
            { data: 'location' },
            { data: 'price' },
            { data: 'features' },
            { data: 'description' },
            {
                data: 'id',
                "render": function (data) {
                    let el = ` <div class="btn-group">
                        <a href="/HouseBroker/Property/create?id=${data}" class="btn btn-primary mx-2"> <i class="bi bi-pencil-square"></i> </a>
                        <a onClick=Delete('/HouseBroker/Property/delete/${data}') class="btn btn-danger mx-2"> <i class="bi bi-trash-fill"></i></a>
                    </div>`
                    return el;
                }
            },
        ]

    });
}

function editProperty(id) {
    $.ajax({
        url: `/HouseBroker/Property/GetById/${id}`,
        type: 'GET',
        success: function (response) {
            if (response.success) {
                window.location.href = '/HouseBroker/Property/Create';
            } else {
                alert('Error: ' + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


function Delete(url) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (data) {
                    dataTable.ajax.reload();
                    toastr.success(data.message, "", {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-right',
                        timeOut: 3000
                    });//message data come from ProductController
                }
            })
        }
    });
}