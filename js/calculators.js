/**
 * Calculadoras Financieras - JavaScript Functions
 * Funciones para calculadoras financieras
 */

(function() {
    'use strict';

    // ============================================
    // THEME TOGGLE (Dark/Light Mode)
    // ============================================
    
    window.initTheme = function() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'dark');
        
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        
        // Update button text
        updateThemeButton();
    };

    window.toggleTheme = function() {
        const isLight = document.body.classList.toggle('light-mode');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        
        // Update button text
        updateThemeButton();
    };

    function updateThemeButton() {
        const btn = document.getElementById('theme-toggle-btn');
        const mobileBtn = document.getElementById('theme-toggle-btn-mobile');
        const isLight = document.body.classList.contains('light-mode');
        const icon = isLight ? '🌙 Oscuro' : '☀️ Claro';
        
        if (btn) {
            btn.innerHTML = icon;
        }
        if (mobileBtn) {
            mobileBtn.innerHTML = icon;
        }
    }

    // Auto-inject theme toggle button if not present
    function injectThemeButton() {
        if (document.getElementById('theme-toggle-btn')) return;
        
        const nav = document.querySelector('.main-nav');
        if (!nav) return;
        
        const btn = document.createElement('button');
        btn.className = 'theme-toggle';
        btn.id = 'theme-toggle-btn';
        btn.setAttribute('aria-label', 'Cambiar modo de color');
        btn.onclick = toggleTheme;
        
        const isLight = document.body.classList.contains('light-mode');
        btn.innerHTML = isLight ? '🌙 Oscuro' : '☀️ Claro';
        
        // Add to nav (will be repositioned via CSS on mobile)
        nav.appendChild(btn);
        
        // Also add to mobile nav-list for easy access when menu is open
        const navList = document.querySelector('.nav-list');
        if (navList) {
            const mobileBtn = btn.cloneNode(true);
            mobileBtn.id = 'theme-toggle-btn-mobile';
            navList.appendChild(mobileBtn);
        }
    }

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    
    window.toggleMobileMenu = function() {
        var toggle = document.getElementById('mobile-menu-toggle');
        var navList = document.querySelector('.nav-list');
        
        if (!toggle || !navList) {
            // Try alternative selector if ID not found
            toggle = document.querySelector('.mobile-menu-toggle');
        }
        
        if (!toggle || !navList) {
            return;
        }
        
        // Toggle the active class on both elements
        toggle.classList.toggle('active');
        navList.classList.toggle('menu-open');
    };
    
    // Also handle click on hamburger icon directly when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        var hamburgerBtn = document.getElementById('mobile-menu-toggle');
        if (!hamburgerBtn) {
            hamburgerBtn = document.querySelector('.mobile-menu-toggle');
        }
        if (hamburgerBtn) {
            hamburgerBtn.onclick = function() {
                toggleMobileMenu();
            };
        }
    });

    // Auto-inject mobile menu button if not present
    function injectMobileMenuButton() {
        if (document.querySelector('.mobile-menu-toggle')) return;
        
        const nav = document.querySelector('.main-nav');
        if (!nav) return;
        
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.setAttribute('aria-label', 'Abrir menú de navegación');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.onclick = toggleMobileMenu;
        
        const icon = document.createElement('span');
        icon.className = 'hamburger-icon';
        toggle.appendChild(icon);
        
        const headerInner = document.querySelector('.header-inner');
        if (headerInner) {
            headerInner.insertBefore(toggle, nav);
        }
    }

    // Close mobile menu when clicking outside
    function handleClickOutside(event) {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (toggle && navList && navList.classList.contains('menu-open')) {
            if (!toggle.contains(event.target) && !navList.contains(event.target)) {
                toggleMobileMenu();
            }
        }
    }

    // Close mobile menu on window resize
    function handleResize() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (window.innerWidth > 768 && toggle && navList) {
            toggle.classList.remove('active');
            navList.classList.remove('active');
        }
    }

    // Initialize theme on page load
    document.addEventListener('DOMContentLoaded', function() {
        window.initTheme();
        //injectThemeButton();
        //injectMobileMenuButton();
        
        // Add event listeners
        document.addEventListener('click', handleClickOutside);
        window.addEventListener('resize', handleResize);
    });
    
    /**
     * Formatea un número como moneda (euros)
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Formatea un número con separadores de miles
     */
    function formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }

    /**
     * Valida que un valor sea número positivo
     */
    function validatePositive(value, fieldName) {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            alert(`Por favor, introduce un valor válido para ${fieldName}`);
            return false;
        }
        return true;
    }

    /**
     * Valida que un valor sea número no negativo
     */
    function validateNonNegative(value, fieldName) {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            alert(`Por favor, introduce un valor válido para ${fieldName}`);
            return false;
        }
        return true;
    }

    // ============================================
    // CALCULADORA DE INTERÉS COMPUESTO
    // ============================================
    
    window.calculateCompoundInterest = function() {
        const principal = parseFloat(document.getElementById('ci-principal').value);
        const rate = parseFloat(document.getElementById('ci-rate').value);
        const years = parseFloat(document.getElementById('ci-years').value);
        const frequency = parseInt(document.getElementById('ci-frequency').value);
        const monthlyContribution = parseFloat(document.getElementById('ci-contribution').value) || 0;

        if (!validatePositive(principal, 'capital inicial') ||
            !validatePositive(rate, 'tasa de interés') ||
            !validatePositive(years, 'años')) {
            return;
        }

        const n = frequency;
        const r = rate / 100;
        const t = years;

        // Fórmula de interés compuesto: A = P(1 + r/n)^(nt)
        let futureValue = principal * Math.pow(1 + r/n, n*t);
        
        // Añadir contribuciones mensuales
        if (monthlyContribution > 0) {
            const monthlyRate = r / 12;
            const totalMonths = t * 12;
            futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        }

        const totalContributed = principal + (monthlyContribution * 12 * t);
        const totalInterest = futureValue - totalContributed;

        const resultHTML = `
            <div class="result-main">${formatCurrency(futureValue)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Capital inicial</span>
                    <span class="result-value">${formatCurrency(principal)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total aportaciones</span>
                    <span class="result-value">${formatCurrency(monthlyContribution * 12 * t)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Interés ganado</span>
                    <span class="result-value">${formatCurrency(totalInterest)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Rendimiento total</span>
                    <span class="result-value">${((totalInterest / totalContributed) * 100).toFixed(2)}%</span>
                </div>
            </div>
        `;

        document.getElementById('ci-result').innerHTML = resultHTML;
        document.getElementById('ci-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE PRÉSTAMO
    // ============================================
    
    window.calculateLoan = function() {
        const principal = parseFloat(document.getElementById('loan-principal').value);
        const rate = parseFloat(document.getElementById('loan-rate').value);
        const years = parseFloat(document.getElementById('loan-years').value);

        if (!validatePositive(principal, 'importe del préstamo') ||
            !validatePositive(rate, 'tipo de interés') ||
            !validatePositive(years, 'plazo')) {
            return;
        }

        const monthlyRate = (rate / 100) / 12;
        const totalPayments = years * 12;

        // Fórmula de anualidad: M = P * [r(1+r)^n] / [(1+r)^n - 1]
        let monthlyPayment;
        if (monthlyRate === 0) {
            monthlyPayment = principal / totalPayments;
        } else {
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                             (Math.pow(1 + monthlyRate, totalPayments) - 1);
        }

        const totalPayment = monthlyPayment * totalPayments;
        const totalInterest = totalPayment - principal;

        // Calcular tabla de amortización
        let balance = principal;
        const amortization = [];

        for (let i = 1; i <= Math.min(12, totalPayments); i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            
            amortization.push({
                month: i,
                payment: monthlyPayment,
                interest: interestPayment,
                principal: principalPayment,
                balance: Math.max(0, balance)
            });
        }

        let amortizationTable = '';
        amortization.forEach(row => {
            amortizationTable += `
                <tr>
                    <td>${row.month}</td>
                    <td>${formatCurrency(row.payment)}</td>
                    <td>${formatCurrency(row.interest)}</td>
                    <td>${formatCurrency(row.principal)}</td>
                    <td>${formatCurrency(row.balance)}</td>
                </tr>
            `;
        });

        const resultHTML = `
            <div class="result-main">${formatCurrency(monthlyPayment)}/mes</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Importe solicitado</span>
                    <span class="result-value">${formatCurrency(principal)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total a pagar</span>
                    <span class="result-value">${formatCurrency(totalPayment)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total intereses</span>
                    <span class="result-value">${formatCurrency(totalInterest)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Plazo</span>
                    <span class="result-value">${years} años (${totalPayments} cuotas)</span>
                </div>
            </div>
            <h4 class="mt-4">Primeros 12 meses</h4>
            <table>
                <thead>
                    <tr>
                        <th>Mes</th>
                        <th>Cuota</th>
                        <th>Interés</th>
                        <th>Capital</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    ${amortizationTable}
                </tbody>
            </table>
        `;

        document.getElementById('loan-result').innerHTML = resultHTML;
        document.getElementById('loan-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE HIPOTECA
    // ============================================
    
    window.calculateMortgage = function() {
        const propertyValue = parseFloat(document.getElementById('mortgage-property').value);
        const downPayment = parseFloat(document.getElementById('mortgage-down').value);
        const rate = parseFloat(document.getElementById('mortgage-rate').value);
        const years = parseFloat(document.getElementById('mortgage-years').value);

        if (!validatePositive(propertyValue, 'valor de la vivienda') ||
            !validatePositive(rate, 'tipo de interés') ||
            !validatePositive(years, 'años')) {
            return;
        }

        const principal = propertyValue - downPayment;
        const monthlyRate = (rate / 100) / 12;
        const totalPayments = years * 12;

        let monthlyPayment;
        if (monthlyRate === 0) {
            monthlyPayment = principal / totalPayments;
        } else {
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                             (Math.pow(1 + monthlyRate, totalPayments) - 1);
        }

        const totalPayment = monthlyPayment * totalPayments;
        const totalInterest = totalPayment - principal;
        const percentageFinanced = ((principal / propertyValue) * 100).toFixed(1);

        // Calcular seguros anuales estimados
        const homeInsurance = propertyValue * 0.003;
        const propertyTax = propertyValue * 0.004;
        const monthlyExtras = (homeInsurance + propertyTax) / 12;

        const resultHTML = `
            <div class="result-main">${formatCurrency(monthlyPayment)}/mes</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Valor de la vivienda</span>
                    <span class="result-value">${formatCurrency(propertyValue)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Entrada</span>
                    <span class="result-value">${formatCurrency(downPayment)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Importe financiado</span>
                    <span class="result-value">${formatCurrency(principal)} (${percentageFinanced}%)</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total intereses</span>
                    <span class="result-value">${formatCurrency(totalInterest)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total a pagar</span>
                    <span class="result-value">${formatCurrency(totalPayment)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Gastos mensuales estimados (seguro + IBI)</span>
                    <span class="result-value">${formatCurrency(monthlyExtras)}</span>
                </div>
                <div class="result-item" style="background: rgba(76, 175, 80, 0.1); padding: 0.75rem; border-radius: 8px;">
                    <span class="result-label" style="font-weight: 700;">Cuota total mensual</span>
                    <span class="result-value" style="font-size: 1.25rem; color: var(--primary-color);">${formatCurrency(monthlyPayment + monthlyExtras)}</span>
                </div>
            </div>
        `;

        document.getElementById('mortgage-result').innerHTML = resultHTML;
        document.getElementById('mortgage-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE AHORRO
    // ============================================
    
    window.calculateSavings = function() {
        const initialAmount = parseFloat(document.getElementById('savings-initial').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('savings-monthly').value);
        const rate = parseFloat(document.getElementById('savings-rate').value);
        const years = parseFloat(document.getElementById('savings-years').value);

        if (!validatePositive(monthlyContribution, 'aportación mensual') ||
            !validatePositive(rate, 'tasa de interés') ||
            !validatePositive(years, 'años')) {
            return;
        }

        const monthlyRate = (rate / 100) / 12;
        const totalMonths = years * 12;

        // Cálculo del valor final con aportaciones mensuales
        let futureValue;
        if (monthlyRate === 0) {
            futureValue = initialAmount + (monthlyContribution * totalMonths);
        } else {
            const initialWithInterest = initialAmount * Math.pow(1 + monthlyRate, totalMonths);
            const contributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
            futureValue = initialWithInterest + contributions;
        }

        const totalContributed = initialAmount + (monthlyContribution * totalMonths);
        const totalInterest = futureValue - totalContributed;

        // Calcular objetivo
        const goal = parseFloat(document.getElementById('savings-goal').value);
        let goalMessage = '';
        if (goal > 0 && monthlyRate > 0) {
            const monthsToGoal = Math.log((goal * monthlyRate / monthlyContribution) + 1) / Math.log(1 + monthlyRate);
            const yearsToGoal = Math.ceil(monthsToGoal / 12);
            if (monthsToGoal > 0 && isFinite(monthsToGoal)) {
                goalMessage = `<div class="result-item" style="background: rgba(76, 175, 80, 0.1); padding: 0.75rem; border-radius: 8px; margin-top: 1rem;">
                    <span class="result-label">Tiempo para alcanzar ${formatCurrency(goal)}</span>
                    <span class="result-value">${yearsToGoal} años (${Math.ceil(monthsToGoal)} meses)</span>
                </div>`;
            }
        }

        const resultHTML = `
            <div class="result-main">${formatCurrency(futureValue)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Ahorro inicial</span>
                    <span class="result-value">${formatCurrency(initialAmount)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total aportaciones</span>
                    <span class="result-value">${formatCurrency(monthlyContribution * totalMonths)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Interés generado</span>
                    <span class="result-value">${formatCurrency(totalInterest)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Rendimiento</span>
                    <span class="result-value">${totalContributed > 0 ? ((totalInterest / totalContributed) * 100).toFixed(2) : 0}%</span>
                </div>
                ${goalMessage}
            </div>
        `;

        document.getElementById('savings-result').innerHTML = resultHTML;
        document.getElementById('savings-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE JUBILACIÓN
    // ============================================
    
    window.calculateRetirement = function() {
        const currentAge = parseInt(document.getElementById('retire-current').value);
        const retirementAge = parseInt(document.getElementById('retire-age').value);
        const currentSavings = parseFloat(document.getElementById('retire-savings').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('retire-contribution').value);
        const expectedReturn = parseFloat(document.getElementById('retire-return').value);
        const desiredIncome = parseFloat(document.getElementById('retire-income').value) || 0;
        const lifeExpectancy = parseInt(document.getElementById('retire-life').value) || 90;

        if (!validatePositive(currentAge, 'edad actual') ||
            !validatePositive(retirementAge, 'edad de jubilación') ||
            !validatePositive(monthlyContribution, 'aportación mensual') ||
            !validatePositive(expectedReturn, 'rentabilidad esperada')) {
            return;
        }

        if (currentAge >= retirementAge) {
            alert('La edad actual debe ser menor que la edad de jubilación');
            return;
        }

        const yearsToRetirement = retirementAge - currentAge;
        const yearsInRetirement = lifeExpectancy - retirementAge;
        const monthlyRate = (expectedReturn / 100) / 12;
        const totalMonthsToRetirement = yearsToRetirement * 12;
        const totalMonthsInRetirement = yearsInRetirement * 12;

        let retirementFund;
        if (monthlyRate === 0) {
            retirementFund = currentSavings + (monthlyContribution * totalMonthsToRetirement);
        } else {
            const currentWithInterest = currentSavings * Math.pow(1 + monthlyRate, totalMonthsToRetirement);
            const contributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonthsToRetirement) - 1) / monthlyRate);
            retirementFund = currentWithInterest + contributions;
        }

        let monthlyPension;
        if (monthlyRate === 0 || totalMonthsInRetirement === 0) {
            monthlyPension = totalMonthsInRetirement > 0 ? retirementFund / totalMonthsInRetirement : 0;
        } else {
            monthlyPension = retirementFund * (monthlyRate * Math.pow(1 + monthlyRate, totalMonthsInRetirement)) / 
                            (Math.pow(1 + monthlyRate, totalMonthsInRetirement) - 1);
        }

        let resultHTML = `
            <div class="result-main">${formatCurrency(monthlyPension)}/mes</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Años hasta jubilación</span>
                    <span class="result-value">${yearsToRetirement} años</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Ahorro proyectado</span>
                    <span class="result-value">${formatCurrency(retirementFund)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Años de jubilación</span>
                    <span class="result-value">${yearsInRetirement} años</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Pensión máxima posible</span>
                    <span class="result-value">${formatCurrency(monthlyPension)}/mes</span>
                </div>
        `;

        if (desiredIncome > 0) {
            let requiredCapital;
            if (monthlyRate === 0 || totalMonthsInRetirement === 0) {
                requiredCapital = desiredIncome * totalMonthsInRetirement;
            } else {
                requiredCapital = desiredIncome * ((Math.pow(1 + monthlyRate, totalMonthsInRetirement) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, totalMonthsInRetirement)));
            }

            const gap = desiredIncome - monthlyPension;
            const gapCapital = requiredCapital - retirementFund;

            resultHTML += `
                <div class="result-item">
                    <span class="result-label">Pensión deseada</span>
                    <span class="result-value">${formatCurrency(desiredIncome)}/mes</span>
                </div>
            `;

            if (gap > 0) {
                resultHTML += `
                <div class="result-item" style="background: #fff3cd; padding: 0.75rem; border-radius: 8px;">
                    <span class="result-label">Diferencia mensual</span>
                    <span class="result-value">${formatCurrency(gap)}/mes de déficit</span>
                </div>
                `;
            } else {
                resultHTML += `
                <div class="result-item" style="background: rgba(76, 175, 80, 0.1); padding: 0.75rem; border-radius: 8px;">
                    <span class="result-label">¡Objetivo alcanzado!</span>
                    <span class="result-value">Tu plan está cubierto</span>
                </div>
                `;
            }
        }

        resultHTML += `
            </div>
        `;

        document.getElementById('retire-result').innerHTML = resultHTML;
        document.getElementById('retire-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE INFLACIÓN
    // ============================================
    
    window.calculateInflation = function() {
        const currentAmount = parseFloat(document.getElementById('inf-current').value);
        const inflationRate = parseFloat(document.getElementById('inf-rate').value);
        const years = parseFloat(document.getElementById('inf-years').value);

        if (!validatePositive(currentAmount, 'cantidad actual') ||
            !validatePositive(inflationRate, 'tasa de inflación') ||
            !validatePositive(years, 'años')) {
            return;
        }

        // Fórmula: VF = VP / (1 + r)^n
        const futureValue = currentAmount / Math.pow(1 + inflationRate / 100, years);
        const purchasingPowerLost = currentAmount - futureValue;
        const percentageLost = ((purchasingPowerLost / currentAmount) * 100).toFixed(1);

        const neededAmount = currentAmount * Math.pow(1 + inflationRate / 100, years);

        const resultHTML = `
            <div class="result-main">${formatCurrency(futureValue)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Cantidad actual</span>
                    <span class="result-value">${formatCurrency(currentAmount)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Poder adquisitivo en ${years} años</span>
                    <span class="result-value">${formatCurrency(futureValue)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Pérdida de poder adquisitivo</span>
                    <span class="result-value">${formatCurrency(purchasingPowerLost)} (${percentageLost}%)</span>
                </div>
                <div class="result-item" style="background: rgba(76, 175, 80, 0.1); padding: 0.75rem; border-radius: 8px;">
                    <span class="result-label">Necesitarías para igualar</span>
                    <span class="result-value">${formatCurrency(neededAmount)}</span>
                </div>
            </div>
        `;

        document.getElementById('inf-result').innerHTML = resultHTML;
        document.getElementById('inf-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE DEPÓSITO
    // ============================================
    
    window.calculateDeposit = function() {
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        const rate = parseFloat(document.getElementById('deposit-rate').value);
        const months = parseFloat(document.getElementById('deposit-months').value);

        if (!validatePositive(amount, 'importe del depósito') ||
            !validatePositive(rate, 'tipo de interés') ||
            !validatePositive(months, 'plazo')) {
            return;
        }

        const annualRate = rate / 100;
        const monthlyRate = annualRate / 12;
        const interest = amount * monthlyRate * months;
        const total = amount + interest;

        const resultHTML = `
            <div class="result-main">${formatCurrency(total)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Capital inicial</span>
                    <span class="result-value">${formatCurrency(amount)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Intereses generados</span>
                    <span class="result-value">${formatCurrency(interest)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Plazo</span>
                    <span class="result-value">${months} meses</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tipo de interés</span>
                    <span class="result-value">${rate}% TAE</span>
                </div>
            </div>
        `;

        document.getElementById('deposit-result').innerHTML = resultHTML;
        document.getElementById('deposit-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE OBJETIVO DE AHORRO
    // ============================================
    
    window.calculateGoal = function() {
        const goal = parseFloat(document.getElementById('goal-amount').value);
        const current = parseFloat(document.getElementById('goal-current').value) || 0;
        const monthly = parseFloat(document.getElementById('goal-monthly').value);
        const rate = parseFloat(document.getElementById('goal-rate').value);

        if (!validatePositive(goal, 'objetivo de ahorro') ||
            !validatePositive(monthly, 'aportación mensual') ||
            !validateNonNegative(rate, 'tipo de interés')) {
            return;
        }

        if (current >= goal) {
            document.getElementById('goal-result').innerHTML = `
                <div class="result-main" style="color: var(--primary-color);">¡Ya has alcanzado tu objetivo!</div>
                <div class="result-breakdown">
                    <div class="result-item">
                        <span class="result-label">Objetivo</span>
                        <span class="result-value">${formatCurrency(goal)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Ahorro actual</span>
                        <span class="result-value">${formatCurrency(current)}</span>
                    </div>
                </div>
            `;
            document.getElementById('goal-result').style.display = 'block';
            return;
        }

        const remaining = goal - current;
        const monthlyRate = rate / 100 / 12;
        
        let months;
        if (monthlyRate === 0) {
            months = remaining / monthly;
        } else {
            months = Math.log((remaining * monthlyRate / monthly) + 1) / Math.log(1 + monthlyRate);
        }

        const years = Math.floor(months / 12);
        const remainingMonths = Math.ceil(months % 12);

        const resultHTML = `
            <div class="result-main">${years} años y ${remainingMonths} meses</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Objetivo</span>
                    <span class="result-value">${formatCurrency(goal)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Ahorro actual</span>
                    <span class="result-value">${formatCurrency(current)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Aportación mensual</span>
                    <span class="result-value">${formatCurrency(monthly)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tipo de interés</span>
                    <span class="result-value">${rate}%</span>
                </div>
            </div>
        `;

        document.getElementById('goal-result').innerHTML = resultHTML;
        document.getElementById('goal-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE RENTABILIDAD
    // ============================================
    
    window.calculateROI = function() {
        const initial = parseFloat(document.getElementById('roi-initial').value);
        const final = parseFloat(document.getElementById('roi-final').value);
        const years = parseFloat(document.getElementById('roi-years').value);

        if (!validatePositive(initial, 'capital inicial') ||
            !validatePositive(final, 'capital final') ||
            !validatePositive(years, 'período')) {
            return;
        }

        // Rentabilidad total
        const totalReturn = ((final - initial) / initial) * 100;
        
        // Rentabilidad anualizada: ((Final/Inicial)^(1/años) - 1) * 100
        const annualizedReturn = (Math.pow(final / initial, 1 / years) - 1) * 100;

        const resultHTML = `
            <div class="result-main">${annualizedReturn.toFixed(2)}% anual</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Capital inicial</span>
                    <span class="result-value">${formatCurrency(initial)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Capital final</span>
                    <span class="result-value">${formatCurrency(final)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Período</span>
                    <span class="result-value">${years} años</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Rentabilidad total</span>
                    <span class="result-value">${totalReturn.toFixed(2)}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Rentabilidad anual</span>
                    <span class="result-value">${annualizedReturn.toFixed(2)}%</span>
                </div>
            </div>
        `;

        document.getElementById('roi-result').innerHTML = resultHTML;
        document.getElementById('roi-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE PROYECCIÓN DE INVERSIÓN
    // ============================================
    
    window.calculateProjection = function() {
        const initial = parseFloat(document.getElementById('proj-initial').value);
        const monthly = parseFloat(document.getElementById('proj-monthly').value) || 0;
        const rate = parseFloat(document.getElementById('proj-rate').value);
        const years = parseFloat(document.getElementById('proj-years').value);

        if (!validatePositive(initial, 'inversión inicial') ||
            !validatePositive(rate, 'rentabilidad') ||
            !validatePositive(years, 'período')) {
            return;
        }

        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;

        let futureValue;
        if (monthlyRate === 0) {
            futureValue = initial + (monthly * totalMonths);
        } else {
            const initialWithInterest = initial * Math.pow(1 + monthlyRate, totalMonths);
            const contributions = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
            futureValue = initialWithInterest + contributions;
        }

        const totalContributed = initial + (monthly * totalMonths);
        const totalInterest = futureValue - totalContributed;

        const resultHTML = `
            <div class="result-main">${formatCurrency(futureValue)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Inversión inicial</span>
                    <span class="result-value">${formatCurrency(initial)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total aportaciones</span>
                    <span class="result-value">${formatCurrency(monthly * totalMonths)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Interés generado</span>
                    <span class="result-value">${formatCurrency(totalInterest)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Rentabilidad total</span>
                    <span class="result-value">${totalContributed > 0 ? ((totalInterest / totalContributed) * 100).toFixed(2) : 0}%</span>
                </div>
            </div>
        `;

        document.getElementById('proj-result').innerHTML = resultHTML;
        document.getElementById('proj-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE DIVIDENDOS
    // ============================================
    
    window.calculateDividends = function() {
        const portfolio = parseFloat(document.getElementById('div-portfolio').value);
        const yieldPercent = parseFloat(document.getElementById('div-yield').value);

        if (!validatePositive(portfolio, 'valor de la cartera') ||
            !validatePositive(yieldPercent, 'rendimiento por dividendos')) {
            return;
        }

        const annualDividends = portfolio * (yieldPercent / 100);
        const monthlyDividends = annualDividends / 12;

        const resultHTML = `
            <div class="result-main">${formatCurrency(monthlyDividends)}/mes</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Valor de la cartera</span>
                    <span class="result-value">${formatCurrency(portfolio)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Rendimiento</span>
                    <span class="result-value">${yieldPercent}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Dividendos anuales</span>
                    <span class="result-value">${formatCurrency(annualDividends)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Dividendos mensuales</span>
                    <span class="result-value">${formatCurrency(monthlyDividends)}</span>
                </div>
            </div>
        `;

        document.getElementById('div-result').innerHTML = resultHTML;
        document.getElementById('div-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA RATIO SHARPE
    // ============================================
    
    window.calculateSharpe = function() {
        const returnRate = parseFloat(document.getElementById('sharpe-return').value);
        const riskFree = parseFloat(document.getElementById('sharpe-riskfree').value);
        const volatility = parseFloat(document.getElementById('sharpe-volatility').value);

        if (!validatePositive(returnRate, 'rentabilidad') ||
            !validateNonNegative(riskFree, 'tipo sin riesgo') ||
            !validatePositive(volatility, 'volatilidad')) {
            return;
        }

        const sharpe = (returnRate - riskFree) / volatility;
        
        let interpretation = '';
        if (sharpe >= 3) {
            interpretation = 'Excepcional';
        } else if (sharpe >= 2) {
            interpretation = 'Muy bueno';
        } else if (sharpe >= 1) {
            interpretation = 'Bueno';
        } else {
            interpretation = 'Por debajo de la media';
        }

        const resultHTML = `
            <div class="result-main">${sharpe.toFixed(2)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Rentabilidad</span>
                    <span class="result-value">${returnRate}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tipo sin riesgo</span>
                    <span class="result-value">${riskFree}%</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Volatilidad</span>
                    <span class="result-value">${volatility}%</span>
                </div>
                <div class="result-item" style="background: ${sharpe >= 1 ? 'rgba(76, 175, 80, 0.1)' : '#fff3cd'}; padding: 0.75rem; border-radius: 8px;">
                    <span class="result-label">Interpretación</span>
                    <span class="result-value">${interpretation}</span>
                </div>
            </div>
        `;

        document.getElementById('sharpe-result').innerHTML = resultHTML;
        document.getElementById('sharpe-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE VACACIONES
    // ============================================
    
    window.calculateVacation = function() {
        const travelers = parseInt(document.getElementById('vac-travelers').value);
        const days = parseInt(document.getElementById('vac-days').value);
        const accommodation = parseFloat(document.getElementById('vac-accommodation').value) || 0;
        const transport = parseFloat(document.getElementById('vac-transport').value) || 0;
        const food = parseFloat(document.getElementById('vac-food').value) || 0;
        const activities = parseFloat(document.getElementById('vac-activities').value) || 0;

        if (!validatePositive(travelers, 'número de viajeros') ||
            !validatePositive(days, 'duración del viaje')) {
            return;
        }

        const accommodationTotal = accommodation * days;
        const foodTotal = food * travelers * days;
        const activitiesTotal = activities * travelers * days;
        
        const total = transport + accommodationTotal + foodTotal + activitiesTotal;
        const perPerson = total / travelers;
        const perDay = total / days;

        const resultHTML = `
            <div class="result-main">${formatCurrency(total)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Transporte</span>
                    <span class="result-value">${formatCurrency(transport)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Alojamiento (${days} noches)</span>
                    <span class="result-value">${formatCurrency(accommodationTotal)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Comida (${travelers} personas × ${days} días)</span>
                    <span class="result-value">${formatCurrency(foodTotal)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Actividades</span>
                    <span class="result-value">${formatCurrency(activitiesTotal)}</span>
                </div>
                <div class="result-item" style="background: rgba(76, 175, 80, 0.1); padding: 0.75rem; border-radius: 8px;">
                    <span class="result-label">Por persona</span>
                    <span class="result-value">${formatCurrency(perPerson)}</span>
                </div>
                <div class="result-item" style="background: rgba(76, 175, 80, 0.1); padding: 0.75rem; border-radius: 8px;">
                    <span class="result-label">Por día</span>
                    <span class="result-value">${formatCurrency(perDay)}</span>
                </div>
            </div>
        `;

        document.getElementById('vac-result').innerHTML = resultHTML;
        document.getElementById('vac-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE IMPUESTOS (IRPF)
    // ============================================
    
    window.calculateIRPF = function() {
        const income = parseFloat(document.getElementById('irpf-income').value);
        const deductions = parseFloat(document.getElementById('irpf-deductions').value) || 0;

        if (!validatePositive(income, 'base imponible')) {
            return;
        }

        const taxableIncome = income - deductions;
        
        // Tramos IRPF 2024 (España)
        const brackets = [
            { min: 0, max: 12450, rate: 19 },
            { min: 12450, max: 20200, rate: 24 },
            { min: 20200, max: 35200, rate: 30 },
            { min: 35200, max: 60000, rate: 37 },
            { min: 60000, max: 300000, rate: 45 },
            { min: 300000, max: Infinity, rate: 47 }
        ];

        let tax = 0;
        let remainingIncome = taxableIncome;

        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
            tax += taxableInBracket * (bracket.rate / 100);
            remainingIncome -= taxableInBracket;
        }

        const effectiveRate = taxableIncome > 0 ? (tax / taxableIncome) * 100 : 0;
        const netIncome = income - tax;

        const resultHTML = `
            <div class="result-main">${formatCurrency(tax)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Base imponible</span>
                    <span class="result-value">${formatCurrency(income)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Deducciones</span>
                    <span class="result-value">${formatCurrency(deductions)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Base liquidable</span>
                    <span class="result-value">${formatCurrency(taxableIncome)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Tipo medio</span>
                    <span class="result-value">${effectiveRate.toFixed(2)}%</span>
                </div>
                <div class="result-item" style="background: rgba(76, 175, 80, 0.1); padding: 0.75rem; border-radius: 8px;">
                    <span class="result-label">Neto aproximado</span>
                    <span class="result-value">${formatCurrency(netIncome)}/año</span>
                </div>
            </div>
            <p class="mt-3" style="font-size: 0.9rem; color: var(--text-light);">
                * Cálculo orientativo basado en tramos de IRPF 2024. Puede variar según situación personal.
            </p>
        `;

        document.getElementById('irpf-result').innerHTML = resultHTML;
        document.getElementById('irpf-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA BRUTO A NETO
    // ============================================
    
    window.calculateBrutoNeto = function() {
        const bruto = parseFloat(document.getElementById('bn-bruto').value);
        const extras = parseInt(document.getElementById('bn-extras').value) || 2;

        if (!validatePositive(bruto, 'salario bruto')) {
            return;
        }

        // Estimación simplificada: aproximadamente 70-75% del bruto
        const taxRate = 0.26; // Estimación media
        const neto = bruto * (1 - taxRate);
        const monthlyNeto = neto / (12 + extras);
        const monthlyBruto = bruto / (12 + extras);

        const resultHTML = `
            <div class="result-main">${formatCurrency(monthlyNeto)}/mes</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Bruto anual</span>
                    <span class="result-value">${formatCurrency(bruto)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Pagas extras</span>
                    <span class="result-value">${extras}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Neto anual estimado</span>
                    <span class="result-value">${formatCurrency(neto)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Neto mensual</span>
                    <span class="result-value">${formatCurrency(monthlyNeto)}</span>
                </div>
            </div>
            <p class="mt-3" style="font-size: 0.9rem; color: var(--text-light);">
                * Cálculo orientativo. El salario neto real depende de tu situación personal, deducciones y cotizaciones.
            </p>
        `;

        document.getElementById('bn-result').innerHTML = resultHTML;
        document.getElementById('bn-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE IVA
    // ============================================
    
    window.calculateIVA = function() {
        const base = parseFloat(document.getElementById('iva-base').value);
        const rate = parseFloat(document.getElementById('iva-rate').value);

        if (!validatePositive(base, 'base imponible') ||
            !validatePositive(rate, 'tipo de IVA')) {
            return;
        }

        const ivaAmount = base * (rate / 100);
        const total = base + ivaAmount;

        const resultHTML = `
            <div class="result-main">${formatCurrency(total)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Base imponible</span>
                    <span class="result-value">${formatCurrency(base)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">IVA (${rate}%)</span>
                    <span class="result-value">${formatCurrency(ivaAmount)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total</span>
                    <span class="result-value">${formatCurrency(total)}</span>
                </div>
            </div>
        `;

        document.getElementById('iva-result').innerHTML = resultHTML;
        document.getElementById('iva-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE AMORTIZACIÓN ANTICIPADA
    // ============================================
    
    window.calculateEarlyPayoff = function() {
        const balance = parseFloat(document.getElementById('ep-balance').value);
        const rate = parseFloat(document.getElementById('ep-rate').value);
        const remaining = parseFloat(document.getElementById('ep-remaining').value);
        const extra = parseFloat(document.getElementById('ep-extra').value);

        if (!validatePositive(balance, 'capital pendiente') ||
            !validatePositive(rate, 'tipo de interés') ||
            !validatePositive(remaining, 'meses restantes') ||
            !validatePositive(extra, 'aportación extra')) {
            return;
        }

        const monthlyRate = rate / 100 / 12;
        
        // Cuota original
        let originalPayment;
        if (monthlyRate === 0) {
            originalPayment = balance / remaining;
        } else {
            originalPayment = balance * (monthlyRate * Math.pow(1 + monthlyRate, remaining)) / 
                            (Math.pow(1 + monthlyRate, remaining) - 1);
        }

        // Nuevo saldo con amortización anticipada
        const newBalance = balance - extra;
        let newPayment;
        if (monthlyRate === 0 || newBalance <= 0) {
            newPayment = 0;
        } else {
            const newRemaining = Math.log((originalPayment * monthlyRate / (extra + originalPayment - newBalance * monthlyRate)) + 1) / Math.log(1 + monthlyRate);
            const actualNewRemaining = isFinite(newRemaining) && newRemaining > 0 ? newRemaining : remaining - (extra / originalPayment);
            newPayment = actualNewRemaining > 0 ? newBalance * (monthlyRate * Math.pow(1 + monthlyRate, actualNewRemaining)) / 
                            (Math.pow(1 + monthlyRate, actualNewRemaining) - 1) : 0;
        }

        // Intereses ahorrados
        const totalOriginal = originalPayment * remaining;
        const newTotal = newPayment * Math.max(1, remaining - (extra / originalPayment));
        const saved = totalOriginal - newTotal - extra;

        const resultHTML = `
            <div class="result-main">${formatCurrency(Math.max(0, saved))}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Capital pendiente</span>
                    <span class="result-value">${formatCurrency(balance)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Amortización anticipada</span>
                    <span class="result-value">${formatCurrency(extra)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Nuevo capital pendiente</span>
                    <span class="result-value">${formatCurrency(Math.max(0, newBalance))}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Intereses ahorrados</span>
                    <span class="result-value" style="color: var(--primary-color);">${formatCurrency(Math.max(0, saved))}</span>
                </div>
            </div>
        `;

        document.getElementById('ep-result').innerHTML = resultHTML;
        document.getElementById('ep-result').style.display = 'block';
    };

    // ============================================
    // CALCULADORA DE PLAN DE PENSIONES
    // ============================================
    
    window.calculatePensionPlan = function() {
        const annual = parseFloat(document.getElementById('pp-annual').value);
        const years = parseFloat(document.getElementById('pp-years').value);
        const rate = parseFloat(document.getElementById('pp-rate').value);

        if (!validatePositive(annual, 'aportación anual') ||
            !validatePositive(years, 'años') ||
            !validatePositive(rate, 'rentabilidad')) {
            return;
        }

        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;
        const monthly = annual / 12;

        let finalAmount;
        if (monthlyRate === 0) {
            finalAmount = monthly * totalMonths;
        } else {
            finalAmount = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        }

        const totalContributed = annual * years;
        const totalInterest = finalAmount - totalContributed;

        const resultHTML = `
            <div class="result-main">${formatCurrency(finalAmount)}</div>
            <div class="result-breakdown">
                <div class="result-item">
                    <span class="result-label">Aportación anual</span>
                    <span class="result-value">${formatCurrency(annual)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Años</span>
                    <span class="result-value">${years}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total aportaciones</span>
                    <span class="result-value">${formatCurrency(totalContributed)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Interés generado</span>
                    <span class="result-value">${formatCurrency(totalInterest)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Rentabilidad</span>
                    <span class="result-value">${totalContributed > 0 ? ((totalInterest / totalContributed) * 100).toFixed(2) : 0}%</span>
                </div>
            </div>
        `;

        document.getElementById('pp-result').innerHTML = resultHTML;
        document.getElementById('pp-result').style.display = 'block';
    };

    // ============================================
    // FAQ ACCORDION
    // ============================================
    
    window.initFAQ = function() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        });
    };

    // ============================================
    // MOBILE MENU
    // ============================================
    
    window.initMobileMenu = function() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav-list');
        
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
    };

    // ============================================
    // INITIALIZE ON DOM LOAD
    // ============================================
    
    document.addEventListener('DOMContentLoaded', function() {
        initFAQ();
        initMobileMenu();
    });

})();
