document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('product-select');
  const csvFilePath = 'product_master.csv';

  fetch(csvFilePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      const lines = data.split('\n');
      const products = lines.slice(1).map(line => line.split(',')[0].trim());

      const uniqueProducts = [...new Set(products)].filter(product => product !== '');

      uniqueProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product;
        option.textContent = product;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching or parsing CSV:', error);
    });
});