document.addEventListener('DOMContentLoaded', function () {
    const temperatureGraphCtx = document.getElementById('temperatureGraph').getContext('2d');
    const phGraphCtx = document.getElementById('phGraph').getContext('2d');
    const oxygenGraphCtx = document.getElementById('oxygenGraph').getContext('2d');

    const temperaturePieChartCtx = document.getElementById('temperaturePieChart').getContext('2d');
    const phPieChartCtx = document.getElementById('phPieChart').getContext('2d');
    const oxygenPieChartCtx = document.getElementById('oxygenPieChart').getContext('2d');

    fetch('/api/sensor_data')
        .then(response => response.json())
        .then(data => {
            // Populate table
            const tableBody = document.querySelector('#sensorTable tbody');
            tableBody.innerHTML = data.map(entry => `
                <tr>
                    <td>${new Date(entry.timestamp).toLocaleString()}</td>
                    <td>${entry.temperature}</td>
                    <td>${entry.pH}</td>
                    <td>${entry.dissolvedOxygen}</td>
                </tr>
            `).join('');
            const timestamps = data.map(entry => new Date(entry.timestamp).toLocaleString());
            const temperatureData = data.map(entry => entry.temperature);
            const phData = data.map(entry => entry.pH);
            const oxygenData = data.map(entry => entry.dissolvedOxygen);

            // Line charts for Dashboard
            new Chart(temperatureGraphCtx, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: temperatureData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                }
            });

            new Chart(phGraphCtx, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [{
                        label: 'pH',
                        data: phData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                }
            });

            new Chart(oxygenGraphCtx, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [{
                        label: 'Dissolved Oxygen (ppm)',
                        data: oxygenData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                }
            });

            // Pie charts for Data Visualization
            new Chart(temperaturePieChartCtx, {
                type: 'pie',
                data: {
                    labels: [...new Set(temperatureData)].map(temp => `${temp}°C`),
                    datasets: [{
                        data: [...new Set(temperatureData)].map(temp => temperatureData.filter(t => t === temp).length),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });

            new Chart(phPieChartCtx, {
                type: 'pie',
                data: {
                    labels: [...new Set(phData)].map(ph => `${ph}`),
                    datasets: [{
                        data: [...new Set(phData)].map(ph => phData.filter(p => p === ph).length),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });

            new Chart(oxygenPieChartCtx, {
                type: 'pie',
                data: {
                    labels: [...new Set(oxygenData)].map(oxygen => `${oxygen} ppm`),
                    datasets: [{
                        data: [...new Set(oxygenData)].map(oxygen => oxygenData.filter(o => o === oxygen).length),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });

        })
        .catch(error => console.error('Error fetching sensor data:', error));

    const alertForm = document.getElementById('alertForm');

    alertForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const temperatureRange = document.getElementById('temperatureRange').value.split('-');
        const phRange = document.getElementById('phRange').value.split('-');
        const oxygenRange = document.getElementById('oxygenRange').value.split('-');

        console.log('Alert Configuration Saved:');
        console.log('Temperature Range:', temperatureRange);
        console.log('pH Range:', phRange);
        console.log('Dissolved Oxygen Range:', oxygenRange);
        // Save the configuration to the server or localStorage
    });
});
