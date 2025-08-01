// Global variables
let transactions = [];
let filteredTransactions = [];
let currentUser = null;

// Sample transaction data
const sampleTransactions = [
    {
        id: 1,
        type: 'expense',
        category: 'food',
        amount: 45.50,
        description: 'Grocery shopping at Whole Foods',
        date: '2024-01-15',
        timestamp: new Date('2024-01-15')
    },
    {
        id: 2,
        type: 'income',
        category: 'income',
        amount: 2500.00,
        description: 'Monthly salary',
        date: '2024-01-01',
        timestamp: new Date('2024-01-01')
    },
    {
        id: 3,
        type: 'expense',
        category: 'transport',
        amount: 25.00,
        description: 'Uber ride to office',
        date: '2024-01-14',
        timestamp: new Date('2024-01-14')
    },
    {
        id: 4,
        type: 'expense',
        category: 'shopping',
        amount: 120.00,
        description: 'New clothes from Zara',
        date: '2024-01-13',
        timestamp: new Date('2024-01-13')
    },
    {
        id: 5,
        type: 'expense',
        category: 'bills',
        amount: 85.50,
        description: 'Electric bill payment',
        date: '2024-01-12',
        timestamp: new Date('2024-01-12')
    },
    {
        id: 6,
        type: 'expense',
        category: 'entertainment',
        amount: 35.00,
        description: 'Movie tickets',
        date: '2024-01-11',
        timestamp: new Date('2024-01-11')
    },
    {
        id: 7,
        type: 'income',
        category: 'income',
        amount: 150.00,
        description: 'Freelance project payment',
        date: '2024-01-10',
        timestamp: new Date('2024-01-10')
    },
    {
        id: 8,
        type: 'expense',
        category: 'food',
        amount: 28.75,
        description: 'Dinner at Italian restaurant',
        date: '2024-01-09',
        timestamp: new Date('2024-01-09')
    },
    {
        id: 9,
        type: 'expense',
        category: 'transport',
        amount: 50.00,
        description: 'Gas station fill-up',
        date: '2024-01-08',
        timestamp: new Date('2024-01-08')
    },
    {
        id: 10,
        type: 'expense',
        category: 'shopping',
        amount: 75.25,
        description: 'Online purchase from Amazon',
        date: '2024-01-07',
        timestamp: new Date('2024-01-07')
    },
    {
        id: 11,
        type: 'expense',
        category: 'food',
        amount: 15.50,
        description: 'Coffee and breakfast',
        date: '2024-01-06',
        timestamp: new Date('2024-01-06')
    },
    {
        id: 12,
        type: 'expense',
        category: 'entertainment',
        amount: 65.00,
        description: 'Concert tickets',
        date: '2024-01-05',
        timestamp: new Date('2024-01-05')
    },
    {
        id: 13,
        type: 'income',
        category: 'income',
        amount: 300.00,
        description: 'Side hustle earnings',
        date: '2024-01-04',
        timestamp: new Date('2024-01-04')
    },
    {
        id: 14,
        type: 'expense',
        category: 'bills',
        amount: 125.00,
        description: 'Internet and phone bill',
        date: '2024-01-03',
        timestamp: new Date('2024-01-03')
    },
    {
        id: 15,
        type: 'expense',
        category: 'transport',
        amount: 30.00,
        description: 'Metro card refill',
        date: '2024-01-02',
        timestamp: new Date('2024-01-02')
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load transactions from localStorage or use sample data
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    } else {
        transactions = [...sampleTransactions];
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    
    filteredTransactions = [...transactions];
    setupChartInteractions();
});

// Dashboard functions
function updateDashboard() {
    updateStats();
    updateRecentTransactions('recentTransactionsList', 5);
    animateStats();
}

function updateStats() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    
    // Update DOM elements
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const currentBalanceEl = document.getElementById('currentBalance');
    
    if (totalIncomeEl) totalIncomeEl.textContent = `$${income.toFixed(2)}`;
    if (totalExpensesEl) totalExpensesEl.textContent = `$${expenses.toFixed(2)}`;
    if (currentBalanceEl) currentBalanceEl.textContent = `$${balance.toFixed(2)}`;
}

function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 200);
        }, index * 100);
    });
}

function updateRecentTransactions(containerId, limit = 10) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    
    container.innerHTML = recentTransactions.map(transaction => 
        createTransactionHTML(transaction)
    ).join('');
}

function createTransactionHTML(transaction) {
    const icon = transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down';
    const amountClass = transaction.type === 'income' ? 'positive' : 'negative';
    const amountPrefix = transaction.type === 'income' ? '+' : '-';
    
    return `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${formatDate(transaction.date)} • ${capitalizeFirst(transaction.category)}</p>
                </div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${amountPrefix}$${transaction.amount.toFixed(2)}
            </div>
        </div>
    `;
}

// Add Transaction functions
function updateAddTransactionPage() {
    updateRecentTransactions('addPageTransactionsList', 8);
}

// Filter functions
function toggleFilters() {
    const filterPanel = document.getElementById('filterPanel');
    if (filterPanel) {
        filterPanel.classList.toggle('active');
    }
}

function applyFilters() {
    const fromDate = document.getElementById('filterFromDate').value;
    const toDate = document.getElementById('filterToDate').value;
    const category = document.getElementById('filterCategory').value;
    
    filteredTransactions = transactions.filter(transaction => {
        let passesFilter = true;
        
        if (fromDate && transaction.date < fromDate) {
            passesFilter = false;
        }
        
        if (toDate && transaction.date > toDate) {
            passesFilter = false;
        }
        
        if (category && transaction.category !== category) {
            passesFilter = false;
        }
        
        return passesFilter;
    });
    
    updateAddTransactionPage();
    showSuccessMessage(`Filters applied. Showing ${filteredTransactions.length} transactions.`);
}

function clearFilters() {
    document.getElementById('filterFromDate').value = '';
    document.getElementById('filterToDate').value = '';
    document.getElementById('filterCategory').value = '';
    
    filteredTransactions = [...transactions];
    updateAddTransactionPage();
    showSuccessMessage('Filters cleared.');
}

function exportTransactions() {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'transactions.json';
    link.click();
    
    showSuccessMessage('Transactions exported successfully!');
}
<script>
  document.addEventListener('DOMContentLoaded', function () {
    // all JS here
  });
</script>
resultsCount.textContent = `Showing ${count} transactions`;

// Monthly Summary functions
function updateMonthlySummary() {
    updateSummaryStats();
    updateTrends();
}

function updateSummaryStats() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
    });
    
    const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Update summary cards with animation
    animateValue('monthlyIncome', monthlyIncome);
    animateValue('monthlyExpenses', monthlyExpenses);
    animateValue('netSavings', monthlyIncome - monthlyExpenses);
}

function animateValue(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = finalValue / 30;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        element.textContent = `$${currentValue.toFixed(2)}`;
    }, 50);
}

function changeMonth(direction) {
    // This function would handle month navigation
    // For demo purposes, we'll just show a message
    const currentMonthEl = document.getElementById('currentMonth');
    if (currentMonthEl) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonth = new Date().getMonth();
        const newMonth = (currentMonth + direction + 12) % 12;
        currentMonthEl.textContent = `${months[newMonth]} 2024`;
    }
    showSuccessMessage('Month updated. Data refreshed.');
}

function updateTrends() {
    // Animate trend cards
    const trendCards = document.querySelectorAll('.trend-card');
    trendCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(-3px)';
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 200);
        }, index * 150);
    });
}

// Chart interactions
function setupChartInteractions() {
    // Bar chart hover effects
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scaleY(1.05)';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scaleY(1)';
        });
    });
    
    // Pie chart hover effects
    const pieSlices = document.querySelectorAll('.pie-slice');
    pieSlices.forEach(slice => {
        slice.addEventListener('mouseenter', function() {
            const category = this.dataset.category;
            const amount = this.dataset.amount;
            showTooltip(`${category}: $${amount}`, event);
        });
        
        slice.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Find active page and prepend message
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const content = activePage.querySelector('.dashboard-content, .page-content');
        if (content) {
            content.insertBefore(successDiv, content.firstChild);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successDiv.remove();
            }, 3000);
        }
    }
}

function showTooltip(text, event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: fixed;
        background: #1F2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.9rem;
        z-index: 1000;
        pointer-events: none;
        left: ${event.clientX + 10}px;
        top: ${event.clientY - 30}px;
    `;
    
    document.body.appendChild(tooltip);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize charts with animation
function initializeCharts() {
    // Animate bar chart on load
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.style.height = '0%';
        setTimeout(() => {
            bar.style.transition = 'height 0.8s ease-out';
            const targetHeight = bar.getAttribute('data-height');
            if (targetHeight) {
                bar.style.height = targetHeight;
            }
        }, index * 200);
    });
    
    // Animate pie chart on load
    const pieSlices = document.querySelectorAll('.pie-slice');
    pieSlices.forEach((slice, index) => {
        slice.style.strokeDasharray = '0 251.3';
        setTimeout(() => {
            slice.style.transition = 'stroke-dasharray 1s ease-out';
            slice.style.strokeDasharray = slice.getAttribute('style').match(/stroke-dasharray: ([^;]+)/)[1];
        }, index * 300);
    });
}

// Call chart initialization when page loads
setTimeout(initializeCharts, 1000);