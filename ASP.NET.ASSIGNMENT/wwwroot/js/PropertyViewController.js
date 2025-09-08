let allProperties = []; // store all from API

$(document).ready(function () {
    $.ajax({
        url: '/HouseBroker/Home/GetCreateData',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                allProperties = response.data;
                renderCards(allProperties);
            } else {
                alert("Error: " + response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching properties:", error);
        }
    });

    // Search button click
    $("#btnSearch").click(applyFilters);

    // Live search on typing
    $("#searchLocation, #minPrice, #maxPrice, #propertyType").on("input change", applyFilters);
});

function applyFilters() {
    let searchText = $("#searchLocation").val().toLowerCase();
    let minPrice = parseFloat($("#minPrice").val()) || 0;
    let maxPrice = parseFloat($("#maxPrice").val()) || Number.MAX_SAFE_INTEGER;
    let selectedType = $("#propertyType").val().toLowerCase();

    let filtered = allProperties.filter(p => {
        let matchesLocation = !searchText || (p.location && p.location.toLowerCase().includes(searchText));
        let matchesPrice = p.price >= minPrice && p.price <= maxPrice;
        let matchesType = !selectedType || (p.propertyType && p.propertyType.toLowerCase() === selectedType);

        return matchesLocation && matchesPrice && matchesType;
    });

    renderCards(filtered);
}

function renderCards(properties) {
    let container = $("#propertyContainer");
    container.empty();

    if (!properties || properties.length === 0) {
        container.html(`<p class="text-muted">No properties found.</p>`);
        return;
    }

    properties.forEach(function (p) {
        let card = `
                <div class="col-md-3 mb-4">
        <div class="card property-card shadow-lg border-0 rounded-4 overflow-hidden">
            <div class="position-relative">
                <img src="${p.imageUrl}"
                    class="card-img-top"
                    alt="Property Image"
                    style="height:150px; object-fit:cover;">
                    <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3">
                        <div class="d-flex justify-content-between">
                            <span class="badge bg-gradient-success px-3 py-2 fs-6">$${p.price.toLocaleString()}</span>
                            <span class="badge bg-gradient-primary px-3 py-2 fs-6">${p.propertyType}</span>
                        </div>
                        <div class="text-end">
                            <i class="bi bi-heart fs-4 text-white"></i>
                        </div>
                    </div>
            </div>
            <div class="card-body">
                <h5 class="card-title fw-bold">Luxury ${p.propertyType}</h5>
                <strong>Features:</strong> ${p.features}<br>
                <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt-fill text-danger"></i> ${p.location}
                </p>
                <p class="card-text small text-secondary">
                    ${p.description}
                </p>
            </div>

            <div class="card-footer bg-light border-0 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <img src="/images/profile.png"
                        class="rounded-circle me-2"
                        style="width:45px;height:45px;object-fit:cover;border:2px solid #0d6efd;">
                        <div>
                            <p class="mb-0 fw-bold">${p.brokerName}</p>
                            <small class="text-muted">${p.brokerPhone}</small>
                        </div>
                </div>
                <a href="${p.brokerEmail}" class="btn btn-sm btn-outline-primary">
                    <i class="fa-regular fa-envelope"></i>
                </a>
            </div>
        </div>
    </div>
        `;
        container.append(card);
    });


}

/*<a href="/HouseBroker/Property/Details/${p.id}" class="btn btn-primary btn-sm">View Details</a>*/