document.addEventListener('DOMContentLoaded', function() {
    // This is a placeholder for future forum functionality
    console.log('Forum SDI page loaded');
    
    // You can add a countdown or notification when the forum will be available
    // For example:
    const comingSoonDate = new Date('2023-12-01');
    const today = new Date();
    
    if (today < comingSoonDate) {
        const daysLeft = Math.ceil((comingSoonDate - today) / (1000 * 60 * 60 * 24));
        const comingSoonElement = document.querySelector('.coming-soon p');
        comingSoonElement.innerHTML += `<br><br><strong>Forum akan tersedia dalam ${daysLeft} hari.</strong>`;
    }
});