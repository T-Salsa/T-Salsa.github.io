document.addEventListener('DOMContentLoaded', function() {
    // Function to parse CSV data
    function parseCSV(csv) {
        var lines = csv.split('\n');
        var data = [];
        for (var i = 0; i < lines.length; i++) {
            var columns = lines[i].split(',');
            if (columns.length === 4) { // Ensure each row has four columns
                data.push({
                    rank: parseInt(columns[0]),
                    city: columns[1],
                    state: columns[2].trim(), // Trim leading and trailing whitespace
                    salary: parseInt(columns[3])
                });
            }
        }
        return data;
    }

    // Function to display data in table
    function displayData(data) {
        var tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = ''; // Clear previous data
        if (data.length === 0) {
            var row = document.createElement('tr');
            row.innerHTML = '<td colspan="3">No results</td>';
            tableBody.appendChild(row);
        } else {
            for (var i = 0; i < data.length; i++) {
                var row = document.createElement('tr');
                // Combine city and state into one string for display
                var cityState = data[i].city + ', ' + data[i].state;
                // Format salary with commas and "$" symbol
                var formattedSalary = '$' + data[i].salary.toLocaleString('en-US', {maximumFractionDigits: 0});
                row.innerHTML = `
                    <td>${data[i].rank}</td>
                    <td>${cityState}</td>
                    <td>${formattedSalary}</td>
                `;
                row.setAttribute('data-city', data[i].city); // Store city as a data attribute for filtering by city
                tableBody.appendChild(row);
            }
        }
    }

    // Function to fetch and display data based on selections
    function fetchDataAndDisplay() {
        var profession = document.getElementById('profession').value;
        var sorting = document.getElementById('sorting').value;
        var state = document.getElementById('state').value;
        var city = document.getElementById('city').value.trim();
        var filePath = '';

        // Determine CSV file path based on profession selection
        if (profession === 'software') {
            filePath = 'Software Developer Descending Cleaned.csv';
        } else if (profession === 'mechanical') {
            filePath = 'Mechanical Engineer Descending Cleaned.csv';
        }

        // Fetch CSV file
        fetch(filePath)
        .then(response => response.text())
        .then(csv => {
            var data = parseCSV(csv);
            // Filter data based on state selection
            if (state !== 'all') {
                data = data.filter(item => item.state === state.toUpperCase());
            }
            // Filter data based on city search
            if (city !== '') {
                data = data.filter(item => item.city.toLowerCase().includes(city.toLowerCase()));
            }
            // Sort data based on sorting selection
            if (sorting === 'highest') {
                data.sort((a, b) => b.salary - a.salary);
            } else if (sorting === 'lowest') {
                data.sort((a, b) => a.salary - b.salary);
            }
            displayData(data);
        })
        .catch(error => console.error('Error fetching CSV file:', error));
    }

    // Function to scroll back to the top of the page
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'auto' // Change 'smooth' to 'auto'
        });
    }

    // Event listeners for dropdown changes
    document.getElementById('profession').addEventListener('change', fetchDataAndDisplay);
    document.getElementById('sorting').addEventListener('change', fetchDataAndDisplay);
    document.getElementById('state').addEventListener('change', fetchDataAndDisplay);
    document.getElementById('city').addEventListener('input', function() {
        fetchDataAndDisplay(); // Call fetchDataAndDisplay on each input change
    });
    document.getElementById('searchBtn').addEventListener('click', fetchDataAndDisplay);
    document.getElementById('clearBtn').addEventListener('click', function() {
        document.getElementById('profession').value = 'software'; // Set default profession
        document.getElementById('sorting').value = 'highest'; // Set default sorting
        document.getElementById('state').value = 'all'; // Set default state
        document.getElementById('city').value = ''; // Clear search input
        fetchDataAndDisplay(); // Fetch and display default data
    });

    // Initial data fetch and display
    fetchDataAndDisplay();
});
