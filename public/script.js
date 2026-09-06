// --- CONSTANTS ---
const APP_VERSION = '3.8';

document.addEventListener('DOMContentLoaded', () => {
    // --- EMAILJS INIT ---
    // PLEASE REPLACE "YOUR_PUBLIC_KEY" WITH YOUR ACTUAL EMAILJS PUBLIC KEY
    try {
        if (typeof emailjs !== 'undefined') emailjs.init("TYMFze5rnBVIhturM");
    } catch (e) {
        console.error("EmailJS failed:", e);
    }
    // --- FIREBASE INIT IS IN INDEX.HTML ---

    // --- DOM ELEMENTS ---
    // Auth
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showLoginTab = document.getElementById('show-login-tab');
    const showSignupTab = document.getElementById('show-signup-tab');
    const demoLoginBtn = document.getElementById('demo-login-btn');

    // Header
    const modeToggle = document.getElementById('mode-toggle');
    const profileBtn = document.getElementById('profile-btn');

    // Views
    const views = {
        home: document.getElementById('view-home'),
        history: document.getElementById('view-history'),
        debt: document.getElementById('view-debt'),
        recurring: document.getElementById('view-recurring'),
        menu: document.getElementById('view-menu'),
        admin: document.getElementById('view-admin')
    };
    const navItems = document.querySelectorAll('.nav-item');
    const pageTitle = document.getElementById('page-title');

    // Home Elements
    const currentBalanceEl = document.getElementById('current-balance');
    const toggleBalanceBtn = document.getElementById('toggle-balance-visibility');
    const monthIncomeEl = document.getElementById('current-month-income');
    const monthExpenseEl = document.getElementById('current-month-expense');
    const topExpenseList = document.getElementById('top-expense-list');
    const expensesChartCtx = document.getElementById('expenses-chart').getContext('2d');
    const budgetAlert = document.getElementById('budget-alert');
    // Budget UI
    const budgetCard = document.getElementById('budget-card');
    const budgetProgressBar = document.getElementById('budget-progress-bar');
    const budgetStatusText = document.getElementById('budget-status-text');
    const budgetSpentEl = document.getElementById('budget-spent');
    const budgetLimitDisplay = document.getElementById('budget-limit-display');

    // History Elements
    const mainTransactionList = document.getElementById('main-transaction-list');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const noMoreDataEl = document.getElementById('no-more-data');
    const searchInput = document.getElementById('search-input');
    const filterDate = document.getElementById('filter-date');
    const filterType = document.getElementById('filter-type');
    const filterAccount = document.getElementById('filter-account');
    let currentHistoryViewMode = 'detailed';

    // Recurring Elements
    const recurringList = document.getElementById('recurring-list');
    const emptyRecurring = document.getElementById('empty-recurring');

    // Debt Elements
    const debtList = document.getElementById('debt-list');
    const totalOwedEl = document.getElementById('total-owed');
    const totalIOweEl = document.getElementById('total-i-owe');
    const refreshDebtBtn = document.getElementById('refresh-debt');
    const btnDebtReminder = document.getElementById('btn-debt-reminder');

    // Modals & FAB
    const fabBtn = document.getElementById('fab-add-transaction');
    const addModal = document.getElementById('add-transaction-modal');
    const saveTransactionBtn = document.getElementById('save-transaction-btn');
    const typeBtns = document.querySelectorAll('.type-btn');

    // Additional Modals
    const editModal = document.getElementById('edit-modal');
    const editRecurringModal = document.getElementById('edit-recurring-modal');
    const categoryModal = document.getElementById('category-modal');
    const accountModal = document.getElementById('account-modal');
    const savingsModal = document.getElementById('savings-modal');
    const budgetModal = document.getElementById('budget-modal');
    const exportModal = document.getElementById('export-modal');
    const settingsModal = document.getElementById('settings-modal');
    const debtDetailsModal = document.getElementById('debt-details-modal');
    const trashModal = document.getElementById('trash-modal');
    const smsParserModal = document.getElementById('sms-parser-modal');
    const trashBadgeCount = document.getElementById('trash-badge-count');
    const emptyTrashBtn = document.getElementById('empty-trash-btn');
    const trashItemsList = document.getElementById('trash-items-list');
    const emptyTrashState = document.getElementById('empty-trash-state');
    const btnParseSms = document.getElementById('btn-parse-sms');
    const smsInputText = document.getElementById('sms-input-text');

    // Form Inputs (Add Transaction)
    const tName = document.getElementById('t-name');
    const tAmount = document.getElementById('t-amount');
    const tDate = document.getElementById('t-date');

    // --- HELPERS ---
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const tAccount = document.getElementById('t-account');
    const tTransferToAccount = document.getElementById('t-transfer-to-account');
    const tCategory = document.getElementById('t-category');
    const tDebtType = document.getElementById('t-debt-type');
    const fieldCategory = document.getElementById('field-category');
    const fieldDebt = document.getElementById('field-debt');
    const fieldTransfer = document.getElementById('field-transfer');

    // Debt Contact Inputs (Add Modal)
    const tDebtPhone = document.getElementById('t-debt-phone');
    const tDebtWhatsapp = document.getElementById('t-debt-whatsapp');
    const tDebtEmail = document.getElementById('t-debt-email');
    const tDebtDueDate = document.getElementById('t-debt-due-date');
    const tDebtSameAsPhone = document.getElementById('t-debt-same-as-phone');
    const toggleDebtContactBtn = document.getElementById('toggle-debt-contact-fields');
    const debtOptionalContactInputs = document.getElementById('debt-optional-contact-inputs');

    // Debt Contact Modal (Edit Existing Person)
    const debtContactModal = document.getElementById('debt-contact-modal');
    const btnOpenContactModal = document.getElementById('btn-open-contact-modal');
    const saveDebtContactBtn = document.getElementById('save-debt-contact-btn');
    const editContactLedgerId = document.getElementById('edit-contact-ledger-id');
    const editContactPhone = document.getElementById('edit-contact-phone');
    const editContactWhatsapp = document.getElementById('edit-contact-whatsapp');
    const editContactEmail = document.getElementById('edit-contact-email');
    const editContactDueDate = document.getElementById('edit-contact-due-date');
    const debtContactBadges = document.getElementById('debt-contact-badges');
    const btnDebtStatementPdf = document.getElementById('btn-debt-statement-pdf');

    // Notification Action Sheet Modal
    const notifyActionSheetModal = document.getElementById('notify-action-sheet-modal');
    const voucherSlipPreviewText = document.getElementById('voucher-slip-preview-text');
    const notifyRecipientSubtitle = document.getElementById('notify-recipient-subtitle');
    const btnSheetWhatsapp = document.getElementById('btn-sheet-whatsapp');
    const btnSheetSms = document.getElementById('btn-sheet-sms');
    const btnSheetEmail = document.getElementById('btn-sheet-email');
    const btnSheetSkip = document.getElementById('btn-sheet-skip');

    // --- STATE ---
    let currentUser = null;
    let transactions = [];
    let lastDoc = null; // Cursor for pagination
    let isFetching = false;
    let hasMore = true;
    let chartInstance = null;
    let currentType = 'expense'; // expense, income, transfer, debt, recurring
    let currentSuggestionNames = [];
    let isBalanceHidden = localStorage.getItem('balance_hidden') === 'true';
    let currentBalanceValue = 0;
    let trashItems = [];
    let currentTrashFilter = 'all';
    let currentActiveDebtContact = null;
    let pendingNotificationData = null;
    window.userPaymentNumber = '';
    window.customSmsApiUrl = '';
    window.userDisplayName = 'AmarHishab';
    const PAGE_SIZE = 20;

    // --- MATH HELPER ---
    const safeMath = {
        add: (a, b) => Math.round((parseFloat(a || 0) + parseFloat(b || 0)) * 100) / 100,
        sub: (a, b) => Math.round((parseFloat(a || 0) - parseFloat(b || 0)) * 100) / 100
    };

    const formatCurrencyDisplay = (amount) => {
        if (isBalanceHidden) return '••••••';
        const num = parseFloat(amount) || 0;
        return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    };

    const updateBalanceDisplay = () => {
        if (currentBalanceEl) {
            currentBalanceEl.innerText = formatCurrencyDisplay(currentBalanceValue);
        }
    };

    const updateBalanceEyeIcon = () => {
        if (toggleBalanceBtn) {
            toggleBalanceBtn.innerHTML = isBalanceHidden ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        }
    };

    // --- INITIALIZATION ---
    const init = () => {
        setupAuthListeners();
        setupNavigation();
        setupModals();

        // Load Theme Preference
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // Set Default Date to current month for filters
        const today = new Date();
        filterDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        tDate.valueAsDate = today;

        // Hide APK Download if in App (Capacitor)
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
            const apkBtn = document.getElementById('menu-download-apk');
            if (apkBtn) apkBtn.style.display = 'none';
        }

        // Set Version Text
        const verDisplay = document.getElementById('app-version-display');
        if (verDisplay) verDisplay.innerText = 'AmarHishab v' + APP_VERSION;

        // Initialize Balance Visibility & Back Button
        updateBalanceEyeIcon();
        setupAndroidBackButton();
    };

    // --- AUTHENTICATION ---
    const setupAuthListeners = () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                authContainer.classList.add('hidden');
                appContainer.classList.remove('hidden');

                // Self-repair: Ensure email is saved for legacy users
                if (user.email) {
                    db.collection('users').doc(user.uid).set({
                        email: user.email
                    }, { merge: true }).catch(err => console.log("Email sync warning:", err));
                }

                try {
                    // Load all User Data
                    loadUserSettings();
                    await migrateRecurringTransactions(); // Run migration once
                    await checkRecurringTemplates();

                    loadDashboard();
                    loadFirstPageTransactions();
                    loadDebts();
                    loadRecurringTemplates();
                    loadSavingsGoals();
                    loadHomeSavings(); // Ensure home savings cards load independently
                    updateSuggestions('expense'); // Load names for auto-complete (default: expense)
                    updateTrashBadge(); // Load trash item count badge

                    // Mobile APK Popup logic
                    const isNativeApp = window.Capacitor && window.Capacitor.isNativePlatform();
                    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;

                    if (window.location.protocol.startsWith('http') && !isNativeApp && !isStandalone) {
                        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                        const hasSeenPopup = sessionStorage.getItem('apk_popup_shown');
                        if (isMobile && !hasSeenPopup) {
                            const apkModal = document.getElementById('apk-download-modal');
                            if (apkModal) {
                                setTimeout(() => {
                                    apkModal.classList.add('open');
                                    sessionStorage.setItem('apk_popup_shown', 'true');
                                    const closeBtn = apkModal.querySelector('.close-btn');
                                    if (closeBtn) {
                                        closeBtn.addEventListener('click', () => {
                                            apkModal.classList.remove('open');
                                        });
                                    }
                                }, 3000); // Show after 3 seconds
                            }
                        }
                    }

                    // Update System Check
                    checkAppVersion();

                } catch (err) {
                    console.error("Initialization warning:", err); // Log but continue
                }

                // Admin Check
                // Admin Check
                // Admin Check
                console.log("Current User Email:", currentUser.email);
                const adminEmails = ['sidr924@gmail.com'];
                if (currentUser.email && adminEmails.includes(currentUser.email.toLowerCase())) {
                    console.log("Admin User Detected!");
                    const adminBtn = document.getElementById('menu-admin');
                    if (adminBtn) adminBtn.classList.remove('hidden');
                }
            } else {
                currentUser = null;
                authContainer.classList.remove('hidden');
                appContainer.classList.add('hidden');
            }
        });

        // Tab Switching
        showLoginTab.addEventListener('click', () => {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            showLoginTab.classList.add('active');
            showSignupTab.classList.remove('active');
        });
        showSignupTab.addEventListener('click', () => {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            showLoginTab.classList.remove('active');
            showSignupTab.classList.add('active');
        });

        // Login Logic
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            auth.signInWithEmailAndPassword(email, password).catch(err => showToast(err.message, 'error'));
        });

        // Signup
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            try {
                const cred = await auth.createUserWithEmailAndPassword(email, password);
                await db.collection('users').doc(cred.user.uid).set({
                    name: name,
                    email: email, // ADDED: Save Email
                    categories: ['Food', 'Transport', 'Utilities'],
                    accounts: ['Cash', 'Bkash', 'Bank'],
                    createdAt: new Date()
                });
            } catch (err) {
                showToast(err.message, 'error');
            }
        });

        // Demo Login
        // Demo Login
        const demoLoginBtn = document.getElementById('demo-login-btn');
        if (demoLoginBtn) {
            demoLoginBtn.addEventListener('click', () => {
                const demoEmail = 'demo@demo.com';
                const demoPass = 'demo@demo.com';

                auth.signInWithEmailAndPassword(demoEmail, demoPass).catch(err => {
                    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-login-credentials' || err.code === 'auth/wrong-password') {
                        auth.createUserWithEmailAndPassword(demoEmail, demoPass).then((cred) => {
                            db.collection('users').doc(cred.user.uid).set({
                                name: 'Demo User',
                                categories: ['খাবার', 'যাতায়াত', 'বিল', 'বিনোদন'],
                                accounts: ['নগদ', 'বিকাশ', 'ব্যাংক'],
                                budgetLimit: 50000,
                                createdAt: new Date()
                            });
                            // Add Sample Recurring
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            db.collection('users').doc(cred.user.uid).collection('recurring_templates').add({
                                name: 'House Rent',
                                amount: 15000,
                                category: 'বিল',
                                account: 'ব্যাংক',
                                active: true,
                                nextDueDate: getLocalDateString(tomorrow),
                                totalPaid: 0
                            });
                            showToast("ডেমো একাউন্ট তৈরি করা হয়েছে!", "success");
                        }).catch(createErr => {
                            showToast("লগিন এরর: " + createErr.message, 'error');
                        });
                    } else {
                        showToast("লগিন এরর: " + err.message, 'error');
                    }
                });
            });
        }

        // Logout from Menu
        document.getElementById('menu-logout').addEventListener('click', () => {
            if (confirm("আপনি কি লগআউট করতে চান?")) auth.signOut();
        });

        // Logout from Settings
        document.getElementById('settings-logout-btn').addEventListener('click', () => {
            if (confirm("আপনি কি লগআউট করতে চান?")) {
                auth.signOut();
                settingsModal.classList.remove('open');
            }
        });
    };

    // --- NAVIGATION & UI INTERACTION ---
    const setupNavigation = () => {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');
                switchTab(target);
            });
        });

        // Menu Grid Clicks
        document.getElementById('menu-categories').addEventListener('click', () => categoryModal.classList.add('open'));
        document.getElementById('menu-accounts').addEventListener('click', () => accountModal.classList.add('open'));
        document.getElementById('menu-savings').addEventListener('click', () => savingsModal.classList.add('open'));
        document.getElementById('menu-budget').addEventListener('click', () => {
            budgetModal.classList.add('open');
            // Load current budget limit
            db.collection('users').doc(currentUser.uid).get().then(doc => {
                if (doc.data().budgetLimit) document.getElementById('budget-limit-input').value = doc.data().budgetLimit;
            });
        });
        document.getElementById('menu-export').addEventListener('click', () => exportModal.classList.add('open'));
        document.getElementById('menu-settings').addEventListener('click', () => settingsModal.classList.add('open'));

        // Menu Grid - Trash & SMS Parser
        const menuTrash = document.getElementById('menu-trash');
        if (menuTrash) {
            menuTrash.addEventListener('click', () => {
                if (trashModal) trashModal.classList.add('open');
                loadTrash();
            });
        }
        const menuSmsParser = document.getElementById('menu-sms-parser');
        if (menuSmsParser) {
            menuSmsParser.addEventListener('click', () => {
                if (smsParserModal) smsParserModal.classList.add('open');
            });
        }

        // Quick Actions Bar on Dashboard
        const qExp = document.getElementById('quick-add-expense');
        if (qExp) qExp.addEventListener('click', () => openQuickAdd('expense'));
        const qInc = document.getElementById('quick-add-income');
        if (qInc) qInc.addEventListener('click', () => openQuickAdd('income'));
        const qTra = document.getElementById('quick-add-transfer');
        if (qTra) qTra.addEventListener('click', () => openQuickAdd('transfer'));
        const qDeb = document.getElementById('quick-go-debt');
        if (qDeb) qDeb.addEventListener('click', () => switchTab('debt'));

        // Balance Eye Visibility Toggle
        if (toggleBalanceBtn) {
            toggleBalanceBtn.addEventListener('click', () => {
                isBalanceHidden = !isBalanceHidden;
                localStorage.setItem('balance_hidden', isBalanceHidden);
                updateBalanceEyeIcon();
                updateBalanceDisplay();
            });
        }

        // Trash Filter Tabs
        const trashFilterBtns = document.querySelectorAll('.trash-filter-btn');
        trashFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                trashFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTrashFilter = btn.getAttribute('data-filter') || 'all';
                renderTrashItems();
            });
        });

        if (emptyTrashBtn) {
            emptyTrashBtn.addEventListener('click', emptyTrash);
        }

        // Header Clicks
        modeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            modeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
        profileBtn.addEventListener('click', () => settingsModal.classList.add('open'));
        budgetCard.addEventListener('click', () => budgetModal.classList.add('open')); // Click budget card to edit

        // Search & Filter
        // Search & Filter
        const reloadList = debounce(() => {
            currentPage = 1;
            pageStack = [];
            loadFirstPageTransactions();
        }, 500);
        searchInput.addEventListener('input', reloadList);
        filterDate.addEventListener('change', loadFirstPageTransactions);
        filterType.addEventListener('change', loadFirstPageTransactions);
        filterAccount.addEventListener('change', loadFirstPageTransactions);
        document.getElementById('filter-sort').addEventListener('change', loadFirstPageTransactions);

        const viewModeBtns = document.querySelectorAll('.view-mode-btn');
        viewModeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewModeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentHistoryViewMode = btn.getAttribute('data-view');
                loadFirstPageTransactions();
            });
        });

        refreshDebtBtn.addEventListener('click', loadDebts);
    };

    const switchTab = (tabName) => {
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-target') === tabName);
        });
        Object.values(views).forEach(view => view.classList.remove('active'));
        views[tabName].classList.add('active');

        // Auto-Load Data on Tab Switch
        if (tabName === 'debt') loadDebts();
        if (tabName === 'recurring') loadRecurringTemplates();
        if (tabName === 'history') loadFirstPageTransactions();
        if (tabName === 'home') loadDashboard();
    };

    // --- RECURRING & MIGRATION ---
    const migrateRecurringTransactions = async () => {
        // Optimization: Run only once per device
        if (localStorage.getItem('migration_v3_4_done')) return;

        try {
            const userRef = db.collection('users').doc(currentUser.uid);

            // Strategy 1: Check 'type' == 'recurring'
            const snap1 = await userRef.collection('expenses').where('type', '==', 'recurring').get();

            // Strategy 2: Check 'isRecurring' == true (Legacy flag)
            const snap2 = await userRef.collection('expenses').where('isRecurring', '==', true).get();

            // Merge results (avoid duplicates by ID)
            const docs = new Map();
            snap1.forEach(doc => docs.set(doc.id, doc));
            snap2.forEach(doc => docs.set(doc.id, doc));

            if (docs.size === 0) {
                localStorage.setItem('migration_v3_4_done', 'true');
                return;
            }

            const batch = db.batch();
            let count = 0;

            docs.forEach(doc => {
                const data = doc.data();
                // Skip if already migrated
                if (data.type === 'migrated_recurring') return;

                // Create new Template
                const newTemplateRef = userRef.collection('recurring_templates').doc();
                batch.set(newTemplateRef, {
                    name: data.name,
                    amount: data.amount,
                    category: data.category || 'General',
                    account: data.account || 'Cash',
                    active: true,
                    nextDueDate: getLocalDateString(new Date()),
                    createdAt: new Date().toISOString()
                });

                // Mark old one as migrated
                batch.update(doc.ref, { type: 'migrated_recurring', isRecurring: false });
                count++;
            });

            if (count > 0) {
                await batch.commit();
                showToast(`${count} Old Recurring items migrated!`, "success");
                loadRecurringTemplates();
            }

            localStorage.setItem('migration_v3_4_done', 'true');

        } catch (e) {
            console.error("Migration Warning:", e);
        }
    };

    const checkRecurringTemplates = async () => {
        const userRef = db.collection('users').doc(currentUser.uid);

        // Fix: Use Local Date to avoid Timezone offsets (e.g., UTC vs UTC+6)
        const today = getLocalDateString(new Date());

        const snapshot = await userRef.collection('recurring_templates').where('active', '==', true).get();

        if (snapshot.empty) return;

        const batch = db.batch();
        let addedCount = 0;

        snapshot.forEach(doc => {
            const tmpl = doc.data();
            let nextDue = tmpl.nextDueDate;
            let changesMade = false;
            let loopGuard = 0;

            // Fix: Loop to catch up on ALL missed months
            while (nextDue <= today && loopGuard < 12) { // 12 month safety limit
                const newExpenseRef = userRef.collection('expenses').doc();
                batch.set(newExpenseRef, {
                    name: tmpl.name,
                    amount: tmpl.amount,
                    category: tmpl.category,
                    account: tmpl.account,
                    date: nextDue, // Use the actual due date for the record
                    type: 'expense',
                    autoGenerated: true,
                    fromTemplate: doc.id,
                    createdAt: new Date().toISOString()
                });

                // Increment Date Logic (Robust Month addition)
                const currentDueObj = new Date(nextDue);
                const nextDateObj = new Date(currentDueObj);
                nextDateObj.setMonth(nextDateObj.getMonth() + 1);

                // Handle month end edges (e.g. Jan 31 -> Feb 28/29)
                if (nextDateObj.getDate() !== currentDueObj.getDate()) {
                    nextDateObj.setDate(0);
                }

                nextDue = getLocalDateString(nextDateObj);

                changesMade = true;
                addedCount++;
                loopGuard++;
            }

            // Only update the template if we moved the date forward
            if (changesMade) {
                batch.update(doc.ref, { nextDueDate: nextDue });
            }
        });

        if (addedCount > 0) {
            await batch.commit();
            showToast(`${addedCount} টি বকেয়া পুনরাবৃত্ত খরচ যোগ করা হয়েছে!`, "success");
        }
    };

    const loadRecurringTemplates = async () => {
        try {
            const snapshot = await db.collection('users').doc(currentUser.uid).collection('recurring_templates').get();

            recurringList.innerHTML = '';
            if (snapshot.empty) {
                emptyRecurring.classList.remove('hidden');
            } else {
                emptyRecurring.classList.add('hidden');
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const li = document.createElement('li');
                    li.style.cursor = 'pointer'; // Indicate clickable
                    li.innerHTML = `
                    <div class="list-item-left">
                        <div class="icon-box" style="background: #6f42c1"><i class="fas fa-redo"></i></div>
                        <div class="item-details">
                            <h4>${data.name}</h4>
                            <p>পরবর্তী: ${data.nextDueDate}</p>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="item-amount amount-expense">-৳${data.amount}</span>
                        <button class="btn-delete-rec" onclick="deleteRecurring('${doc.id}')" style="background:none; border:none; color:var(--danger-color); cursor:pointer; padding:5px;"><i class="fas fa-trash"></i></button>
                    </div>
                `;

                    // Row Click Logic (Matches Debt List)
                    li.onclick = (e) => {
                        // Prevent if delete button clickable
                        if (e.target.closest('.btn-delete-rec')) {
                            e.stopPropagation();
                            return;
                        }
                        editRecurring(doc.id);
                    };

                    recurringList.appendChild(li);
                });
            }
        } catch (error) {
            console.error("Error loading recurring templates:", error);
            showToast("Error loading recurring data", "error");
        }
    };

    // Helper Maps separate from window to avoid conflicts, or attach to window
    window.editRecurring = (id) => {
        // Need to find data from snapshot or just pass it differently.
        // For simplicity, let's re-fetch or use quick find if data available.
        // Actually, better to just let the click on edit button trigger the modal directly 
        // passing data is complex in inline onclick. 
        // Let's refactor slightly to closure click, but user asked for delete.
        // I will stick to inline for delete, and for edit I will fetch doc or find in list.
        const item = Array.from(recurringList.children).find(el => el.innerHTML.includes(id));
        // This is getting messy. Let's just re-fetch inside edit for reliability or use a data attribute.
        // OR better: revert to list item click for edit, and stop propagation for delete.
    };

    window.deleteRecurring = async (id) => {
        if (window.event) window.event.stopPropagation();
        if (!confirm("আপনি কি নিশ্চিত? এটি রিসাইকেল বিনে জমা থাকবে এবং ৩০ দিন পর্যন্ত রিস্টোর করা যাবে।")) return;
        try {
            const docRef = db.collection('users').doc(currentUser.uid).collection('recurring_templates').doc(id);
            const snap = await docRef.get();
            if (snap.exists) {
                await moveToTrash('recurring_templates', id, snap.data());
                await docRef.delete();
                showToast("মুছে ফেলা হয়েছে (রিসাইকেল বিনে জমা হয়েছে)", "success");
                loadRecurringTemplates();
                updateTrashBadge();
            }
        } catch (e) {
            showToast("এরর: " + e.message, "error");
        }
    };

    window.editRecurring = async (id) => {
        event.stopPropagation();
        const doc = await db.collection('users').doc(currentUser.uid).collection('recurring_templates').doc(id).get();
        openEditRecurringModal(id, doc.data());
    };

    // End of helper functions


    // Edit Recurring Logic
    const openEditRecurringModal = (id, data) => {
        document.getElementById('edit-rec-id').value = id;
        document.getElementById('edit-rec-name').value = data.name;
        document.getElementById('edit-rec-amount').value = data.amount;
        document.getElementById('edit-rec-date').value = data.nextDueDate;
        editRecurringModal.classList.add('open');
    };

    document.getElementById('save-rec-edit-btn').addEventListener('click', async () => {
        const id = document.getElementById('edit-rec-id').value;
        const newData = {
            name: document.getElementById('edit-rec-name').value,
            amount: parseFloat(document.getElementById('edit-rec-amount').value),
            nextDueDate: document.getElementById('edit-rec-date').value
        };
        await db.collection('users').doc(currentUser.uid).collection('recurring_templates').doc(id).update(newData);
        editRecurringModal.classList.remove('open');
        showToast("আপডেট হয়েছে");
        loadRecurringTemplates();
    });


    // --- ADMIN BROADCAST SYSTEM ---
    document.getElementById('menu-admin').addEventListener('click', () => {
        console.log("Admin button clicked, switching tab...");
        switchTab('admin');
    });

    document.getElementById('btn-broadcast').addEventListener('click', async () => {
        const msg = document.getElementById('broadcast-msg').value;
        const manualInput = document.getElementById('manual-email-list').value;

        if (!msg) return showToast("Please enter a message", "error");
        if (!confirm("Are you sure you want to send this email to ALL users?")) return;

        const statusDiv = document.getElementById('broadcast-status');
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = 'Starting broadcast...<br>';

        const btn = document.getElementById('btn-broadcast');
        btn.disabled = true;
        btn.innerText = "Sending...";

        try {
            // 1. Fetch Firestore Users
            const snapshot = await db.collection('users').get();
            const firestoreDocs = snapshot.docs;

            // 2. Parse Manual Emails from TextArea
            let manualEmails = [];
            if (manualInput && manualInput.trim().length > 0) {
                manualEmails = manualInput.split(/[\n,]+/).map(e => e.trim()).filter(e => e.length > 5 && e.includes('@'));
                statusDiv.innerHTML += `Parsed ${manualEmails.length} manual emails.<br>`;
            }

            // 3. Create Unique List (Map: Email -> Name)
            // Priority: Firestore Name > 'User'
            let emailMap = new Map();

            // Add Firestore Users
            firestoreDocs.forEach(doc => {
                const data = doc.data();
                if (data.email) {
                    emailMap.set(data.email, data.name || 'User');
                }
            });

            // Add/Merge Manual Emails
            manualEmails.forEach(email => {
                if (!emailMap.has(email)) {
                    emailMap.set(email, 'User');
                }
            });

            const uniqueEmails = Array.from(emailMap.entries()); // [[email, name], ...]
            let total = uniqueEmails.length;
            let count = 0;
            let success = 0;

            statusDiv.innerHTML += `Targeting Total: ${total} unique recipients.<br>`;

            // REPLACE THESE WITH YOUR ACTUAL IDS
            const SERVICE_ID = "amarhishab";
            const TEMPLATE_ID = "template_7btl1nj";

            for (const [email, name] of uniqueEmails) {
                try {
                    count++;
                    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                        to_email: email,
                        message: msg,
                        to_name: name
                    });

                    statusDiv.innerHTML += `<span style="color:green">Sent (${count}/${total}): ${email}</span><br>`;
                    success++;
                    statusDiv.scrollTop = statusDiv.scrollHeight;
                } catch (err) {
                    console.error(err);
                    statusDiv.innerHTML += `<span style="color:red">Failed (${count}/${total}): ${email}</span><br>`;
                }
                // Small delay to prevent rate limits
                await new Promise(r => setTimeout(r, 200));
            }

            statusDiv.innerHTML += `<strong>Done! Successfully sent: ${success}/${total}</strong>`;
            alert(`Broadcast Complete! Sent: ${success}`);

        } catch (e) {
            console.error(e);
            showToast("Error: " + e.message, "error");
            statusDiv.innerHTML += `<br><strong>CRITICAL ERROR: ${e.message}</strong>`;
        } finally {
            btn.disabled = false;
            btn.innerText = "সবার কাছে ইমেইল পাঠান";
        }
    });

    // --- IN-APP UPDATE SYSTEM ---
    const checkAppVersion = async () => {
        try {
            const doc = await db.collection('system').doc('app_config').get();
            if (doc.exists) {
                const data = doc.data();
                if (data.latestVersion && data.latestVersion !== APP_VERSION) {
                    // Update Available
                    const modal = document.getElementById('update-modal');
                    const notes = document.getElementById('update-release-notes');
                    const btn = document.getElementById('update-link-btn');

                    notes.innerText = data.releaseNotes || "New features and bug fixes!";
                    btn.href = data.updateLink || "#";

                    modal.classList.add('open');

                    const closeBtn = modal.querySelector('.close-btn');
                    if (closeBtn) {
                        // Use onclick to avoid duplicate listeners without destroying the node
                        closeBtn.onclick = () => {
                            modal.classList.remove('open');
                        };
                    }
                }
            }
        } catch (e) {
            console.log("Version check failed", e);
        }
    };


    // --- TRANSACTIONS & PAGINATION ---

    // --- TRANSACTIONS & PAGINATION ---
    let allTransactionsCache = []; // Store full fetched sorted list for client-side pagination

    // Helper function for Bengali digits
    const translateNumber = (num) => {
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(num).replace(/[0-9]/g, (w) => banglaDigits[+w]);
    };

    const loadFirstPageTransactions = () => {
        currentPage = 1;
        loadTransactions();
    };

    const loadTransactions = async () => {
        if (isFetching) return;
        isFetching = true;

        // UI Reset
        mainTransactionList.innerHTML = '';
        noMoreDataEl.classList.add('hidden');
        document.getElementById('next-page-btn').textContent = 'লোড হচ্ছে...';

        // Skeleton
        mainTransactionList.innerHTML = `
            <li class="skeleton" style="height: 70px; margin-bottom: 10px;"></li>
            <li class="skeleton" style="height: 70px; margin-bottom: 10px;"></li>
            <li class="skeleton" style="height: 70px; margin-bottom: 10px;"></li>
        `;

        try {
            let query = db.collection('users').doc(currentUser.uid).collection('expenses');

            // 1. QUERY STRATEGY: Fetch by Date Range Only (or Latest)
            // We do NOT filter by Account/Type/Amount in Firestore to avoid Index Errors.
            if (filterDate.value) {
                const dateVal = new Date(filterDate.value);
                const start = getLocalDateString(new Date(dateVal.getFullYear(), dateVal.getMonth(), 1));
                const end = getLocalDateString(new Date(dateVal.getFullYear(), dateVal.getMonth() + 1, 0));
                query = query.where('date', '>=', start).where('date', '<=', end);
                // We fetch ALL for the month to sort/filter accurately in JS
            } else {
                // If no date selected, just fetch latest 150 items (limit history)
                query = query.orderBy('date', 'desc').limit(150);
            }

            const snapshot = await query.get();
            let rawDocs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                rawDocs.push(data);
            });

            // 2. CLIENT-SIDE FILTERING
            let filtered = rawDocs.filter(item => {
                // Type Filter
                if (filterType.value && item.type !== filterType.value) return false;
                // Account Filter
                if (filterAccount.value && item.account !== filterAccount.value) return false;
                // Search Filter
                const searchVal = searchInput.value.toLowerCase();
                if (searchVal && !item.name.toLowerCase().includes(searchVal)) return false;
                return true;
            });

            // 3. CLIENT-SIDE SORTING
            const sortVal = document.getElementById('filter-sort').value;
            filtered.sort((a, b) => {
                const amtA = parseFloat(a.amount) || 0;
                const amtB = parseFloat(b.amount) || 0;

                if (sortVal === 'amount-desc') return amtB - amtA;
                if (sortVal === 'amount-asc') return amtA - amtB;
                if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
                // Default: date-desc
                return new Date(b.date) - new Date(a.date);
            });

            allTransactionsCache = filtered;

            // 4. RENDER CURRENT PAGE
            renderPage(currentPage);

        } catch (e) {
            console.error(e);
            mainTransactionList.innerHTML = '<p style="text-align:center; color:red">Error loading data</p>';
        } finally {
            isFetching = false;
            document.getElementById('next-page-btn').innerHTML = 'পরবর্তী <i class="fas fa-arrow-right"></i>';
        }
    };

    // --- CONTEXT AWARE SUGGESTIONS ---
    const updateSuggestions = async (type) => {
        const datalist = document.getElementById('debt-names');
        if (!datalist) return;
        datalist.innerHTML = ''; // Clear existing

        try {
            const names = new Set();
            const userRef = db.collection('users').doc(currentUser.uid);

            if (type === 'debt') {
                // Fetch from Ledgers (Existing Logic)
                const snapshot = await userRef.collection('ledgers').get();
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.personName) names.add(data.personName);
                });
            } else if (type === 'recurring') {
                // Fetch from Templates
                const snapshot = await userRef.collection('recurring_templates').get();
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.name) names.add(data.name);
                });
            } else {
                // Expense or Income: Fetch from recent history
                // Limit to recent 50 to avoid heavy reads, order by date
                const snapshot = await userRef.collection('expenses')
                    .where('type', '==', type)
                    .orderBy('date', 'desc')
                    .limit(50)
                    .get();

                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.name) names.add(data.name);
                });
            }

            // Save names and render
            currentSuggestionNames = Array.from(names);
            renderSuggestions(tName.value);

        } catch (e) {
            console.log("Suggestion Warning:", e);
        }
    };

    const renderSuggestions = (query) => {
        const datalist = document.getElementById('debt-names');
        if (!datalist) return;
        datalist.innerHTML = '';

        const lowerQuery = (query || '').toLowerCase();
        let filtered = currentSuggestionNames;

        if (lowerQuery) {
            filtered = currentSuggestionNames.filter(n => n.toLowerCase().includes(lowerQuery));
        }

        filtered.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            datalist.appendChild(option);
        });
    };

    const renderDailySummary = (date, totals) => {
        if (totals.totalExpense === 0 && totals.totalIncome === 0) return;
        const li = document.createElement('li');

        // Let it inherit the default card design from `.transaction-list li`, but give it a highlighted look
        li.style.borderLeft = '4px solid var(--primary-color)';
        li.style.padding = '12px 15px';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginTop = '5px';
        li.style.marginBottom = '15px';
        li.style.backgroundColor = 'rgba(0, 123, 255, 0.05)'; // Very subtle tint

        let html = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="icon-box" style="width: 35px; height: 35px; background: var(--primary-color); color: white; border-radius: 8px;">
                    <i class="fas fa-calendar-check" style="font-size: 0.9rem;"></i>
                </div>
                <div>
                    <h4 style="font-size: 0.9rem; margin: 0; font-weight: 600;">${date}</h4>
                    <p style="font-size: 0.75rem; color: var(--secondary-color); margin: 0;">সারসংক্ষেপ (Summary)</p>
                </div>
            </div>
            <div style="display: flex; gap: 15px; text-align: right;">
                ${totals.totalExpense > 0 ? `<div>
                    <div style="font-size: 0.7rem; color: var(--secondary-color);">মোট খরচ</div>
                    <div class="amount-expense" style="font-size: 0.95rem; font-weight: 600;">-৳${totals.totalExpense}</div>
                </div>` : ''}
                ${totals.totalIncome > 0 ? `<div>
                    <div style="font-size: 0.7rem; color: var(--secondary-color);">মোট আয়</div>
                    <div class="amount-income text-success" style="font-size: 0.95rem; font-weight: 600;">+৳${totals.totalIncome}</div>
                </div>` : ''}
            </div>
        `;

        li.innerHTML = html;
        mainTransactionList.appendChild(li);
    };

    const renderSimplifiedItem = (data) => {
        const li = document.createElement('li');

        let detailsHtml = `<h4>${data.date}</h4><p>${translateNumber(data.transactionCount)} লেনদেন</p>`;

        let amountsHtml = '';
        if (data.totalExpense > 0) {
            amountsHtml += `<div class="amount-expense" style="font-size:0.9rem; margin-bottom: 2px;">-৳${data.totalExpense}</div>`;
        }
        if (data.totalIncome > 0) {
            amountsHtml += `<div class="amount-income text-success" style="font-size:0.9rem;">+৳${data.totalIncome}</div>`;
        }
        if (amountsHtml === '') {
            amountsHtml = `<div style="font-size:0.9rem; color:gray;">৳0</div>`;
        }

        li.innerHTML = `
            <div class="list-item-left">
                <div class="icon-box" style="background: var(--light-bg); color: var(--primary-color);">
                    <i class="fas fa-calendar-day"></i>
                </div>
                <div class="item-details">
                    ${detailsHtml}
                </div>
            </div>
            <div style="text-align:right;">
                ${amountsHtml}
            </div>
        `;
        mainTransactionList.appendChild(li);
    };

    const renderPage = (page) => {
        mainTransactionList.innerHTML = '';
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        let itemsToRender = allTransactionsCache;

        if (currentHistoryViewMode === 'simplified') {
            const grouped = {};
            allTransactionsCache.forEach(item => {
                if (!grouped[item.date]) {
                    grouped[item.date] = {
                        date: item.date,
                        type: 'simplified_group',
                        totalExpense: 0,
                        totalIncome: 0,
                        transactionCount: 0
                    };
                }
                grouped[item.date].transactionCount++;
                if (item.type === 'expense') grouped[item.date].totalExpense = safeMath.add(grouped[item.date].totalExpense, item.amount);
                if (item.type === 'income') grouped[item.date].totalIncome = safeMath.add(grouped[item.date].totalIncome, item.amount);
            });
            const sortVal = document.getElementById('filter-sort').value;
            itemsToRender = Object.values(grouped).sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return sortVal === 'date-asc' ? dateA - dateB : dateB - dateA;
            });
        }

        const pageItems = itemsToRender.slice(start, end);

        if (pageItems.length === 0) {
            if (page === 1) noMoreDataEl.classList.remove('hidden');
        } else {
            if (currentHistoryViewMode === 'simplified') {
                pageItems.forEach(item => renderSimplifiedItem(item));
            } else {
                let currentGroupDate = null;
                let dailyTotals = { totalExpense: 0, totalIncome: 0 };

                pageItems.forEach((item, index) => {
                    // When date changes, render summary for PREVIOUS date
                    if (currentGroupDate && currentGroupDate !== item.date) {
                        renderDailySummary(currentGroupDate, dailyTotals);
                        dailyTotals = { totalExpense: 0, totalIncome: 0 }; // Reset
                    }

                    // Render current item
                    renderTransactionItem(item);

                    // Accumulate totals
                    currentGroupDate = item.date;
                    if (item.type === 'expense') dailyTotals.totalExpense = safeMath.add(dailyTotals.totalExpense, item.amount);
                    if (item.type === 'income') dailyTotals.totalIncome = safeMath.add(dailyTotals.totalIncome, item.amount);

                    // If it's the last item on the page, or the very last item overall, render the final summary
                    // We render it at the end of the page even if the date continues on the next page, as a "Summary for this page's view of the date"
                    // Otherwise it gets way too complex tracking across pagination boundaries.
                    if (index === pageItems.length - 1) {
                        renderDailySummary(currentGroupDate, dailyTotals);
                    }
                });
            }
        }

        // Pagination UI
        document.getElementById('page-info').innerText = `পৃষ্ঠা ${translateNumber(page)}`;
        document.getElementById('prev-page-btn').disabled = page === 1;
        document.getElementById('next-page-btn').disabled = end >= itemsToRender.length;

        hasMore = end < itemsToRender.length;
    };

    // Event Listeners for Pagination
    document.getElementById('prev-page-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    document.getElementById('next-page-btn').addEventListener('click', () => {
        if (hasMore) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    const renderTransactionItem = (data) => {
        const li = document.createElement('li');
        const isIncome = data.type === 'income';
        const isDebt = data.type === 'debt';
        const isRecurring = data.isRecurring || data.autoGenerated;

        let iconClass = 'icon-expense';
        let icon = 'fa-arrow-up';
        let colorClass = 'amount-expense';
        let sign = '-';

        const isTransfer = data.type === 'transfer';

        if (isIncome) {
            iconClass = 'icon-income';
            icon = 'fa-arrow-down';
            colorClass = 'amount-income';
            sign = '+';
        } else if (isTransfer) {
            iconClass = 'icon-transfer';
            icon = 'fa-exchange-alt';
            colorClass = 'amount-transfer';
            sign = '⇄ ';
        } else if (isDebt) {
            iconClass = 'icon-debt';
            icon = 'fa-handshake';
            colorClass = 'amount-debt';
            sign = '';
        } else if (isRecurring) {
            icon = 'fa-sync-alt';
        }

        const accountDisplay = isTransfer ? `${data.account} ➔ ${data.toAccount || ''}` : data.account;
        const categoryDisplay = data.category && !isTransfer ? '| ' + data.category : '';

        li.innerHTML = `
            <div class="list-item-left">
                <div class="icon-box ${iconClass}"><i class="fas ${icon}"></i></div>
                <div class="item-details">
                    <h4>${data.name}</h4>
                    <p>${data.date} | ${accountDisplay} ${categoryDisplay}</p>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <span class="item-amount ${colorClass}">${sign}৳${data.amount}</span>
                <button onclick="editTransaction('${data.id}')" style="background:none; border:none; color:var(--primary-color); cursor:pointer;"><i class="fas fa-edit"></i></button>
                <button onclick="deleteTransaction('${data.id}')" style="background:none; border:none; color:var(--danger-color); cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `;
        li.addEventListener('click', () => openEditModal(data));
        mainTransactionList.appendChild(li);
    };

    // --- DASHBOARD & BUDGET ---

    // Stats Helper (Incremental Updates)
    const updateStats = async (amount, type, isDelete = false) => {
        const statsRef = db.collection('users').doc(currentUser.uid).collection('system').doc('stats');
        const increment = firebase.firestore.FieldValue.increment;
        // If delete, we subtract. If add, we add.
        const val = isDelete ? -Math.abs(amount) : Math.abs(amount);

        try {
            if (type === 'income') await statsRef.update({ totalIncome: increment(val) });
            else if (type === 'expense') await statsRef.update({ totalExpense: increment(val) });
            // Debt is calculated live
        } catch (e) {
            console.error("Stats Update Warning:", e);
        }
    };

    // Aggregation Migration Helper
    const recalculateStats = async () => {
        const userRef = db.collection('users').doc(currentUser.uid);
        const statsRef = userRef.collection('system').doc('stats');

        showToast("Recalculating Stats...", "info");

        const snapshot = await userRef.collection('expenses').get();
        let income = 0, expense = 0;

        snapshot.forEach(doc => {
            const d = doc.data();
            const amt = parseFloat(d.amount);
            if (d.type === 'income') income = safeMath.add(income, amt);
            else if (d.type === 'expense') expense = safeMath.add(expense, amt);
        });

        const debtSnap = await userRef.collection('ledgers').get();
        let lend = 0, borrow = 0;
        debtSnap.forEach(doc => {
            const bal = doc.data().netBalance || 0;
            if (bal > 0) lend = safeMath.add(lend, bal);
            else borrow = safeMath.add(borrow, Math.abs(bal));
        });

        await statsRef.set({
            totalIncome: income,
            totalExpense: expense,
            totalLend: lend,
            totalBorrow: borrow,
            lastUpdated: new Date().toISOString()
        });

        showToast("Stats Updated!", "success");
        loadDashboard(); // Reload UI
    };

    let isDashboardLoading = false;
    const loadDashboard = debounce(async () => {
        if (!currentUser || isDashboardLoading) return;
        isDashboardLoading = true;
        console.log("Loading Dashboard for:", currentUser.uid);

        const userRef = db.collection('users').doc(currentUser.uid);
        const today = new Date();
        const startOfMonth = getLocalDateString(new Date(today.getFullYear(), today.getMonth(), 1));
        const endOfMonth = getLocalDateString(new Date(today.getFullYear(), today.getMonth() + 1, 0));

        try {
            // 1. Fetch Month Data
            const snapshot = await userRef.collection('expenses')
                .where('date', '>=', startOfMonth).where('date', '<=', endOfMonth).get();

            let monthIncome = 0, monthExpense = 0;
            const categoryMap = {};

            snapshot.forEach(doc => {
                const d = doc.data();
                const amt = parseFloat(d.amount);
                if (d.type === 'income') monthIncome = safeMath.add(monthIncome, amt);
                else if (d.type === 'expense') {
                    monthExpense = safeMath.add(monthExpense, amt);
                    if (d.category) categoryMap[d.category] = safeMath.add(categoryMap[d.category], amt);
                }
            });

            // 2. Fetch LIFETIME Stats (Optimized for Income/Expense)
            const statsRef = userRef.collection('system').doc('stats');
            const statsSnap = await statsRef.get();

            let totalIncome = 0, totalExpense = 0;

            if (statsSnap.exists) {
                const s = statsSnap.data();
                totalIncome = s.totalIncome || 0;
                totalExpense = s.totalExpense || 0;
            } else {
                console.log("No stats found. Triggering calculation...");
                await recalculateStats();
                isDashboardLoading = false;
                return;
            }

            // 3. Fetch Debt Stats (LIVE - Small collection, better accuracy)
            const debtSnap = await userRef.collection('ledgers').get();
            let totalLend = 0, totalBorrow = 0;
            debtSnap.forEach(doc => {
                const bal = doc.data().netBalance || 0;
                if (bal > 0) totalLend = safeMath.add(totalLend, bal);
                else totalBorrow = safeMath.add(totalBorrow, Math.abs(bal));
            });

            // Update UI
            const safeSetText = (id, text) => {
                const el = document.getElementById(id);
                if (el) {
                    el.innerText = typeof text === 'number' ? (Math.round(text * 100) / 100).toLocaleString('en-IN') : text;
                }
            };

            safeSetText('current-month-income', monthIncome);
            safeSetText('current-month-expense', monthExpense);
            safeSetText('total-income', totalIncome);
            safeSetText('total-expense', totalExpense);
            safeSetText('total-owed', totalLend);
            safeSetText('total-i-owe', totalBorrow);

            currentBalanceValue = safeMath.sub(totalIncome, totalExpense);
            updateBalanceDisplay();

            // Monthly Comparison & Budget
            await loadComparisonAndBudget(userRef, today, monthExpense);

            renderChart(categoryMap);

            let expList = [];
            snapshot.forEach(doc => { if (doc.data().type === 'expense') expList.push(doc.data()) });
            expList.sort((a, b) => b.amount - a.amount);
            renderTopExpenses(expList.slice(0, 5));

            loadHomeSavings();

        } catch (e) {
            console.error("Dashboard Error:", e);
        } finally {
            isDashboardLoading = false;
        }
    }, 500);

    // Make deleteTransaction Global
    window.deleteTransaction = async (id) => {
        if (!confirm("আপনি কি নিশ্চিত? এটি রিসাইকেল বিনে জমা থাকবে এবং ৩০ দিন পর্যন্ত রিস্টোর করা যাবে।")) return;
        try {
            const docRef = db.collection('users').doc(currentUser.uid).collection('expenses').doc(id);
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                const oldData = docSnap.data();
                await moveToTrash('expenses', id, oldData);
                if (oldData.type === 'income' || oldData.type === 'expense') {
                    await updateStats(oldData.amount, oldData.type, true);
                }

                await docRef.delete();
                showToast("মুছে ফেলা হয়েছে (রিসাইকেল বিনে জমা হয়েছে)");
                loadDashboard();
                loadFirstPageTransactions();
                updateTrashBadge();
            }
        } catch (e) {
            console.error(e);
            showToast("মুছতে সমস্যা হয়েছে", "error");
        }
    };

    const loadComparisonAndBudget = async (userRef, today, monthExpense) => {
        try {
            const lastMonthStart = getLocalDateString(new Date(today.getFullYear(), today.getMonth() - 1, 1));
            const lastMonthEnd = getLocalDateString(new Date(today.getFullYear(), today.getMonth(), 0));

            const lastMonthSnap = await userRef.collection('expenses')
                .where('date', '>=', lastMonthStart).where('date', '<=', lastMonthEnd).get();

            let lastMonthExpense = 0;
            lastMonthSnap.forEach(doc => {
                const d = doc.data();
                if (d.type === 'expense') {
                    lastMonthExpense += parseFloat(d.amount); // safeMath not critical for rough comparison
                }
            });

            const diff = safeMath.sub(monthExpense, lastMonthExpense);
            const diffPercent = lastMonthExpense > 0 ? ((diff / lastMonthExpense) * 100).toFixed(1) : 0;

            const comparisonEl = document.getElementById('expense-comparison');
            if (comparisonEl) {
                let msg = '';
                let color = '';
                let icon = '';
                if (diff > 0) {
                    msg = `${diff}৳ বেশি (${diffPercent}%)`;
                    color = 'text-danger';
                    icon = '<i class="fas fa-arrow-up" style="margin-right:5px;"></i>';
                } else if (diff < 0) {
                    msg = `${Math.abs(diff)}৳ কম (${Math.abs(diffPercent)}%)`;
                    color = 'text-success';
                    icon = '<i class="fas fa-arrow-down" style="margin-right:5px;"></i>';
                } else {
                    msg = 'সমান';
                    color = 'text-secondary';
                    icon = '<i class="fas fa-equals" style="margin-right:5px;"></i>';
                }
                comparisonEl.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                    <div>
                        <span style="font-size:0.8rem; opacity:0.7; display:block; margin-bottom:2px;">গত মাস</span>
                        <h4 style="margin:0; font-size:1.1rem; color:var(--light-text);">৳${lastMonthExpense}</h4>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:0.8rem; opacity:0.7; display:block; margin-bottom:2px;">এই মাস</span>
                        <h4 style="margin:0; font-size:1.1rem; color:var(--primary-color);">৳${monthExpense}</h4>
                    </div>
                </div>
                <div class="comparison-details-box">
                     <span style="font-size:0.85rem; color:var(--secondary-color);">তুলনা:</span>
                     <span class="${color}" style="font-size:0.95rem; font-weight:600; display:flex; align-items:center;">
                        ${icon} ${msg}
                     </span>
                </div>
            `;
            }
        } catch (e) {
            console.error("Comparison Error:", e);
        }

        // Update Budget UI
        try {
            const settings = (await userRef.get()).data();
            if (settings && settings.budgetLimit) {
                const limit = parseFloat(settings.budgetLimit);
                const actualPercent = ((monthExpense / limit) * 100).toFixed(1);
                const cappedPercent = Math.min(100, actualPercent);

                budgetProgressBar.style.width = cappedPercent + '%';
                budgetStatusText.innerText = `${actualPercent}% খরচ`;
                budgetSpentEl.innerText = monthExpense;
                budgetLimitDisplay.innerText = limit;

                if (actualPercent > 100) {
                    budgetProgressBar.style.backgroundColor = 'var(--danger-color)';
                    budgetAlert.classList.remove('hidden');
                } else {
                    budgetProgressBar.style.backgroundColor = 'var(--primary-color)';
                    budgetAlert.classList.add('hidden');
                }
            } else {
                budgetStatusText.innerText = "বাজেট সেট করা নেই";
            }
        } catch (e) {
            console.error("Budget Error:", e);
        }

    };

    // --- HOME SAVINGS ---
    const loadHomeSavings = async () => {
        const list = document.getElementById('home-savings-list');
        list.innerHTML = '';
        const snap = await db.collection('users').doc(currentUser.uid).collection('savings').limit(5).get();
        if (snap.empty) {
            list.innerHTML = '<p style="font-size:0.8rem; color:var(--secondary-color); padding:10px;">কোন সেভিংস গোল নেই</p>';
            return;
        }
        snap.forEach(doc => {
            const data = doc.data();
            const div = document.createElement('div');
            div.className = 'saving-card-mini';
            div.innerHTML = `
                <h4>${data.name}</h4>
                <p>🎯 ৳${data.target}</p>
            `;
            list.appendChild(div);
        });
    };

    document.getElementById('view-all-savings').addEventListener('click', () => {
        savingsModal.classList.add('open');
    });

    // --- EXPORTS & REPORTS ---

    // Toggle Custom Date Input
    const exportRadios = document.querySelectorAll('input[name="export-period"]');
    const customDateDiv = document.getElementById('export-custom-date');
    exportRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'custom') customDateDiv.classList.remove('hidden');
            else customDateDiv.classList.add('hidden');
        });
    });

    const getExportDateRange = () => {
        const period = document.querySelector('input[name="export-period"]:checked').value;
        const today = new Date();
        let start, end;

        if (period === 'this-month') {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        } else if (period === 'last-month') {
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
        } else if (period === 'custom') {
            const s = document.getElementById('export-start-date').value;
            const e = document.getElementById('export-end-date').value;
            if (s) start = new Date(s);
            if (e) end = new Date(e);
        }
        // 'all' returns undefined start/end which means fetch all
        return { start, end };
    };

    const fetchExportData = async () => {
        const { start, end } = getExportDateRange();
        const incIncome = document.getElementById('exp-type-income').checked;
        const incExpense = document.getElementById('exp-type-expense').checked;
        const incDebt = document.getElementById('exp-type-debt').checked;

        let query = db.collection('users').doc(currentUser.uid).collection('expenses');

        // Date Filter
        if (start && end) {
            query = query.where('date', '>=', start.toISOString().slice(0, 10))
                .where('date', '<=', end.toISOString().slice(0, 10));
        }

        // Fetch
        const snapshot = await query.orderBy('date', 'desc').limit(1000).get(); // Limit increased
        const data = [];

        snapshot.forEach(doc => {
            const t = doc.data();
            // Type Filter (Client Side)
            if (t.type === 'income' && !incIncome) return;
            if (t.type === 'expense' && !incExpense) return;
            if (t.type === 'debt' && !incDebt) return;

            data.push(t);
        });

        return data;
    };

    const getFilename = (ext) => {
        // Source of truth: The name displayed on the dashboard
        let userName = 'User';
        const nameEl = document.getElementById('welcome-user-name');

        if (nameEl && nameEl.innerText && nameEl.innerText !== 'User') {
            userName = nameEl.innerText;
        } else if (currentUser && currentUser.displayName) {
            userName = currentUser.displayName;
        }

        // Sanitize but allow Bangla/Unicode: Replace only unsafe filesystem chars
        // Windows forbidden: < > : " / \ | ? *
        userName = userName.replace(/[<>:"/\\|?*]+/g, '_').trim();

        const dateStr = new Date().toISOString().slice(0, 10);
        return `${userName}_AmarHishab_Report_${dateStr}.${ext}`;
    };

    // PDF Export
    document.getElementById('export-pdf-btn').addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const rawData = await fetchExportData();

        // Calculate Summary
        let totalIncome = 0, totalExpense = 0;
        const data = rawData.map(t => {
            const amt = parseFloat(t.amount) || 0;
            if (t.type === 'income') totalIncome += amt;
            else if (t.type === 'expense') totalExpense += amt;

            return [
                t.date || '',
                t.name || '',
                t.type === 'income' ? 'Income' : (t.type === 'expense' ? 'Expense' : 'Debt'), // English for PDF mostly
                t.amount || 0,
                t.account || '',
                t.category || ''
            ];
        });
        const balance = totalIncome - totalExpense;

        // Header
        doc.setFontSize(18);
        doc.text("AmarHishab - Transaction Report", 105, 15, null, null, "center");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 22, null, null, "center");

        // Summary Box
        doc.setDrawColor(200);
        doc.setFillColor(245, 245, 245);
        doc.rect(14, 30, 182, 15, 'F');
        doc.setTextColor(0);
        doc.setFontSize(11);
        doc.text(`Total Income: ${totalIncome}`, 20, 40);
        doc.text(`Total Expense: ${totalExpense}`, 80, 40);
        doc.text(`Balance: ${balance}`, 150, 40);

        // Table
        doc.autoTable({
            head: [['Date', 'Name', 'Type', 'Amount', 'Account', 'Category']],
            body: data,
            startY: 55,
            styles: { font: "helvetica", overflow: 'linebreak', fontSize: 9 },
            headStyles: { fillColor: [41, 128, 185] },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 20 },
                3: { cellWidth: 20 },
                4: { cellWidth: 25 },
                5: { cellWidth: 25 }
            }
        });

        // Robust Footer Logic (Manual Loop)
        try {
            const pageCount = doc.internal.getNumberOfPages();
            const pageSize = doc.internal.pageSize;
            const pageHeight = (pageSize && pageSize.height) ? pageSize.height : 297; // Default A4 height

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text("Developed by MD.Tanvir Ahamed Siddike - fb.com/tanviras615", 105, pageHeight - 10, null, null, "center");
            }
        } catch (e) {
            console.error("Footer Error:", e);
        }

        doc.save(getFilename('pdf'));
        showToast("PDF ডাউনলোড শুরু হয়েছে...");
    });

    // Excel Export
    // Excel Export
    document.getElementById('export-excel-btn').addEventListener('click', async () => {
        const rawData = await fetchExportData();
        let totalIncome = 0, totalExpense = 0;

        const dataRows = rawData.map(t => {
            const amt = parseFloat(t.amount) || 0;
            if (t.type === 'income') totalIncome += amt;
            else if (t.type === 'expense') totalExpense += amt;

            // Translate Type
            let typeStr = t.type;
            if (t.type === 'income') typeStr = 'Income';
            else if (t.type === 'expense') typeStr = 'Expense';
            else if (t.type === 'debt') typeStr = 'Debt';
            else if (t.type === 'recurring') typeStr = 'Recurring';

            return [
                t.date,
                t.name,
                typeStr,
                t.amount,
                t.account,
                t.category
            ];
        });
        const balance = totalIncome - totalExpense;

        // Construct Excel Data Array (AOA)
        // Note: Empty strings are placeholders for merged cells
        const wbData = [
            ["AmarHishab - Transaction Report", "", "", "", "", ""],
            [`Generated: ${new Date().toLocaleString()}`, "", "", "", "", ""],
            ["", "", "", "", "", ""], // Row 2: Spacer
            ["Total Income", "", "Total Expense", "", "Balance", ""], // Row 3: Summary Headers
            [totalIncome, "", totalExpense, "", balance, ""],       // Row 4: Summary Values
            ["", "", "", "", "", ""], // Row 5: Spacer
            ["Date", "Name", "Type", "Amount", "Account", "Category"], // Row 6: Header
            ...dataRows,
            ["", "", "", "", "", ""], // Spacer
            ["Developed by MD.Tanvir Ahamed Siddike", "", "", "", "", ""], // Footer 1
            ["https://www.facebook.com/tanviras615", "", "", "", "", ""]   // Footer 2
        ];

        const ws = XLSX.utils.aoa_to_sheet(wbData);

        // Define Merges (r: row, c: col - 0-indexed)
        const merges = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Title A1:F1
            { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }, // Date A2:F2

            // Summary Headers
            { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // Total Income Label (A4:B4)
            { s: { r: 3, c: 2 }, e: { r: 3, c: 3 } }, // Total Expense Label (C4:D4)
            { s: { r: 3, c: 4 }, e: { r: 3, c: 5 } }, // Balance Label (E4:F4)

            // Summary Values
            { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, // Total Income Value
            { s: { r: 4, c: 2 }, e: { r: 4, c: 3 } }, // Total Expense Value
            { s: { r: 4, c: 4 }, e: { r: 4, c: 5 } }, // Balance Value
        ];

        // Add Footer Merges
        const lastRowIndex = wbData.length - 1;
        merges.push({ s: { r: lastRowIndex - 1, c: 0 }, e: { r: lastRowIndex - 1, c: 5 } }); // Dev Name
        merges.push({ s: { r: lastRowIndex, c: 0 }, e: { r: lastRowIndex, c: 5 } });     // Link

        ws['!merges'] = merges;

        // Column Widths
        ws['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, getFilename('xlsx'));
        showToast("Excel ডাউনলোড শুরু হয়েছে...");
    });


    // Print Report (Native Browser Print for Clean Bangla)
    document.getElementById('print-report-btn').addEventListener('click', async () => {
        const rawData = await fetchExportData();
        if (rawData.length === 0) return showToast("কোন ডাটা পাওয়া যায়নি", "error");

        let totalIncome = 0, totalExpense = 0;

        // Build HTML Table
        let rows = '';
        rawData.forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            if (t.type === 'income') totalIncome += amt;
            else if (t.type === 'expense') totalExpense += amt;

            rows += `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px;">${t.date}</td>
                    <td style="padding: 8px;">${t.name}</td>
                    <td style="padding: 8px;">${t.type === 'income' ? 'আয়' : (t.type === 'expense' ? 'খরচ' : 'দেনা/পাওনা')}</td>
                    <td style="padding: 8px; text-align: right;">${t.amount}</td>
                    <td style="padding: 8px;">${t.account}</td>
                    <td style="padding: 8px;">${t.category || '-'}</td>
                </tr>
             `;
        });

        // Calculate Balance
        const balance = totalIncome - totalExpense;

        // Create Print Window
        const printWindow = window.open('', '', 'width=900,height=600');
        printWindow.document.write(`
            <html>
            <head>
                <title>AmarHishab - Report</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Poppins', sans-serif, 'SolaimanLipi', Arial; padding: 20px; }
                    h2 { text-align: center; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #f8f9fa; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
                    .summary { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; display: flex; justify-content: space-around; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>

                <h2>AmarHishab - লেনদেন রিপোর্ট</h2>
                <p style="text-align:center; color:#666; font-size:0.9rem;">জেনারেট করা হয়েছে: ${new Date().toLocaleString()}</p>
                
                <div class="summary">
                    <div><strong>মোট আয়:</strong> ৳${totalIncome}</div>
                    <div><strong>মোট খরচ:</strong> ৳${totalExpense}</div>
                    <div><strong>ব্যালেন্স:</strong> ৳${balance}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>তারিখ</th>
                            <th>নাম / বিবরণ</th>
                            <th>ধরন</th>
                            <th style="text-align: right;">পরিমাণ (৳)</th>
                            <th>একাউন্ট</th>
                            <th>ক্যাটাগরি</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                
                <div class="footer" style="text-align:center; margin-top:50px; padding-top:20px; border-top:1px solid #eee; font-size:12px; color:#999;">
                    Developed by MD.Tanvir Ahamed Siddike - fb.com/tanviras615
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    });

    // --- SAVINGS GOALS ---
    const loadSavingsGoals = async () => {
        const manageList = document.getElementById('manage-goal-list');
        // const homeList = document.getElementById('home-savings-list'); // REMOVED: Managed by loadHomeSavings

        if (manageList) manageList.innerHTML = '';

        const snap = await db.collection('users').doc(currentUser.uid).collection('savings').get();

        if (snap.empty) {
            const emptyMsg = '<p style="text-align:center;color:var(--secondary-color); font-size:0.9rem; width:100%;">কোন সেভিংস গোল নেই</p>';
            if (manageList) manageList.innerHTML = emptyMsg;
            // if (homeList) homeList.innerHTML = emptyMsg; // REMOVED
            return;
        }

        snap.forEach(doc => {
            const data = doc.data();

            // 1. Populate Manage List (Modal)
            if (manageList) {
                const li = document.createElement('li');
                li.innerHTML = `${data.name} - 🎯 ৳${data.target} <button style="color:red;border:none;background:none;float:right" onclick="deleteSavings('${doc.id}')"><i class="fas fa-trash"></i></button>`;
                manageList.appendChild(li);
            }

            // 2. Populate Home List (REMOVED - Loop handled by loadHomeSavings)

        });
    };

    document.getElementById('add-goal-btn').addEventListener('click', async () => {
        const name = document.getElementById('new-goal-name').value;
        const target = document.getElementById('new-goal-target').value;
        if (!name || !target) return;
        await db.collection('users').doc(currentUser.uid).collection('savings').add({
            name, target, createdAt: new Date()
        });
        document.getElementById('new-goal-name').value = '';
        document.getElementById('new-goal-name').value = '';
        loadSavingsGoals(); // Refresh manage list
        loadHomeSavings();  // Refresh dashboard list

        showToast("সেভিংস গোল যোগ হয়েছে");
    });

    window.deleteSavings = async (id) => {
        if (!confirm('মুছে ফেলতে চান?')) return;
        await db.collection('users').doc(currentUser.uid).collection('savings').doc(id).delete();
        await db.collection('users').doc(currentUser.uid).collection('savings').doc(id).delete();
        loadSavingsGoals();
        loadHomeSavings();
    };

    // --- BUDGET LOGIC ---
    document.getElementById('save-budget-btn').addEventListener('click', async () => {
        const limit = document.getElementById('budget-limit-input').value;
        if (!limit) return;
        await db.collection('users').doc(currentUser.uid).update({ budgetLimit: limit });
        budgetModal.classList.remove('open');
        showToast("বাজেট সেট করা হয়েছে");
        loadDashboard();
    });

    // --- CHART, MODALS (Standard Logic) ---
    const renderChart = (dataMap) => {
        if (chartInstance) chartInstance.destroy();
        const labels = Object.keys(dataMap);
        const data = Object.values(dataMap);
        const getStyle = (v) => getComputedStyle(document.body).getPropertyValue(v).trim();
        const colors = [
            getStyle('--chart-1'), getStyle('--chart-2'), getStyle('--chart-3'),
            getStyle('--chart-4'), getStyle('--chart-5'), getStyle('--chart-6')
        ];
        chartInstance = new Chart(expensesChartCtx, {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: colors }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10 } } } }
        });
    };

    const renderTopExpenses = (list) => {
        topExpenseList.innerHTML = '';
        list.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<div class="list-item-left"><div class="item-details"><h4>${item.name}</h4><p>${item.date}</p></div></div><div class="item-amount amount-expense">৳${item.amount}</div>`;
            topExpenseList.appendChild(li);
        });
    };

    const setupModals = () => {
        tName.addEventListener('input', (e) => {
            if (typeof renderSuggestions === 'function') {
                renderSuggestions(e.target.value);
            }
        });

        window.populateTransferAccounts = async () => {
            if (!currentUser || !tTransferToAccount) return;
            try {
                const userDoc = await db.collection('users').doc(currentUser.uid).get();
                const accounts = (userDoc.exists && userDoc.data().accounts) ? userDoc.data().accounts : ['Cash', 'Bank', 'bKash'];
                tTransferToAccount.innerHTML = '<option value="" disabled selected>গন্তব্য একাউন্ট (To Account)</option>';
                accounts.forEach(acc => {
                    const opt = document.createElement('option');
                    opt.value = acc;
                    opt.textContent = acc;
                    tTransferToAccount.appendChild(opt);
                });
            } catch (e) {
                console.error("Error populating transfer accounts:", e);
            }
        };

        const handleTypeChange = (type) => {
            currentType = type;
            updateSuggestions(currentType);
            fieldCategory.classList.add('hidden');
            fieldDebt.classList.add('hidden');
            if (fieldTransfer) fieldTransfer.classList.add('hidden');

            if (currentType === 'expense') {
                fieldCategory.classList.remove('hidden');
            } else if (currentType === 'debt') {
                fieldDebt.classList.remove('hidden');
            } else if (currentType === 'transfer') {
                if (fieldTransfer) fieldTransfer.classList.remove('hidden');
                populateTransferAccounts();
            }
        };

        window.openQuickAdd = (type) => {
            addModal.classList.add('open');
            tName.value = '';
            tAmount.value = '';
            typeBtns.forEach(b => {
                const isMatch = b.getAttribute('data-type') === type;
                b.classList.toggle('active', isMatch);
            });
            handleTypeChange(type);
        };

        // Quick Amount Chips listener
        document.querySelectorAll('.amount-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.preventDefault();
                const addVal = parseFloat(chip.getAttribute('data-amount')) || 0;
                const currVal = parseFloat(tAmount.value) || 0;
                tAmount.value = currVal + addVal;
            });
        });

        fabBtn.addEventListener('click', () => {
            addModal.classList.add('open');
            tName.value = '';
            tAmount.value = '';
            updateSuggestions(currentType);
            handleTypeChange(currentType);
        });

        document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', (e) => e.target.closest('.modal').classList.remove('open')));
        typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                typeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                handleTypeChange(btn.getAttribute('data-type'));
            });
        });

        // SAVE TRANSACTION (Unified)
        saveTransactionBtn.addEventListener('click', async () => {
            const name = tName.value.trim(); const amount = parseFloat(tAmount.value); const date = tDate.value;
            if (!amount || !date) return showToast("পরিমাণ এবং তারিখ দিন", "error");
            if (currentType !== 'transfer' && !name) return showToast("বিবরণ / নাম দিন", "error");

            saveTransactionBtn.disabled = true; saveTransactionBtn.textContent = "সেভ হচ্ছে...";
            const userRef = db.collection('users').doc(currentUser.uid);
            try {
                if (currentType === 'recurring') {
                    await userRef.collection('recurring_templates').add({
                        name, amount, date, account: tAccount.value, category: tCategory.value || 'General',
                        active: true, nextDueDate: date, createdAt: new Date().toISOString()
                    });
                    showToast("রিকারিং খরচ সেট করা হয়েছে!", "success"); loadRecurringTemplates();
                } else if (currentType === 'debt') {
                    const ledgerRef = userRef.collection('ledgers');
                    const snap = await ledgerRef.where('personName', '==', name).get();
                    const debtVal = tDebtType.value === 'lend' ? amount : -amount;
                    const phone = tDebtPhone ? tDebtPhone.value.trim() : '';
                    const whatsapp = tDebtWhatsapp ? tDebtWhatsapp.value.trim() : '';
                    const email = tDebtEmail ? tDebtEmail.value.trim() : '';
                    const dueDate = tDebtDueDate ? tDebtDueDate.value : '';

                    let finalNetBal = debtVal;
                    let targetPhone = phone;
                    let targetWa = whatsapp || phone;
                    let targetEmail = email;

                    if (!snap.empty) {
                        const doc = snap.docs[0];
                        const existingData = doc.data();
                        finalNetBal = safeMath.add(existingData.netBalance || 0, debtVal);
                        const updatePayload = { netBalance: finalNetBal, lastUpdated: date };
                        if (phone) updatePayload.phone = phone;
                        if (whatsapp) updatePayload.whatsapp = whatsapp;
                        if (email) updatePayload.email = email;
                        if (dueDate) updatePayload.dueDate = dueDate;

                        targetPhone = phone || existingData.phone || '';
                        targetWa = whatsapp || existingData.whatsapp || targetPhone;
                        targetEmail = email || existingData.email || '';

                        await doc.ref.update(updatePayload);
                        await doc.ref.collection('history').add({ amount: amount, type: tDebtType.value === 'lend' ? 'GIVEN' : 'GOT', date: date, createdAt: new Date().toISOString() });
                    } else {
                        const createPayload = { personName: name, netBalance: debtVal, lastUpdated: date };
                        if (phone) createPayload.phone = phone;
                        if (whatsapp) createPayload.whatsapp = whatsapp;
                        if (email) createPayload.email = email;
                        if (dueDate) createPayload.dueDate = dueDate;

                        const newRef = await ledgerRef.add(createPayload);
                        await newRef.collection('history').add({ amount: amount, type: tDebtType.value === 'lend' ? 'GIVEN' : 'GOT', date: date, createdAt: new Date().toISOString() });
                    }
                    showToast("দেনা-পাওনা আপডেট হয়েছে", "success");
                    loadDebts();
                    addModal.classList.remove('open');

                    // Trigger Post-Save Notification Action Sheet
                    openNotifyActionSheet({
                        personName: name,
                        amount: amount,
                        type: tDebtType.value === 'lend' ? 'GIVEN' : 'GOT',
                        date: date,
                        netBalance: finalNetBal,
                        dueDate: dueDate,
                        phone: targetPhone,
                        whatsapp: targetWa,
                        email: targetEmail
                    });
                } else if (currentType === 'transfer') {
                    const toAccount = tTransferToAccount ? tTransferToAccount.value : '';
                    const fromAccount = tAccount.value;
                    if (!fromAccount || !toAccount) return showToast("উৎস এবং গন্তব্য একাউন্ট দুটিই দিন", "error");
                    if (fromAccount === toAccount) return showToast("উৎস ও গন্তব্য একই একাউন্ট হতে পারে না", "error");

                    await userRef.collection('expenses').add({
                        name: name || `স্থানান্তর: ${fromAccount} ➔ ${toAccount}`,
                        amount: amount,
                        date: date,
                        account: fromAccount,
                        toAccount: toAccount,
                        type: 'transfer',
                        category: 'স্থানান্তর',
                        createdAt: new Date().toISOString()
                    });
                    showToast("টাকা স্থানান্তর সফল!", "success");
                    loadDashboard(); loadFirstPageTransactions();
                } else {
                    await userRef.collection('expenses').add({
                        name, amount, date, account: tAccount.value, type: currentType,
                        category: currentType === 'expense' ? tCategory.value : null, createdAt: new Date().toISOString()
                    });
                    showToast("লেনদেন সফল!", "success");
                    await updateStats(amount, currentType);
                    loadDashboard(); loadFirstPageTransactions();
                }
                addModal.classList.remove('open');
            } catch (e) { console.error(e); showToast("এরর হয়েছে", "error"); }
            finally { saveTransactionBtn.disabled = false; saveTransactionBtn.textContent = "সেভ করুন"; }
        });

        // Restore Edit/Delete/AddCat/AddAcc handlers...
        document.getElementById('add-cat-btn').addEventListener('click', async () => {
            const name = document.getElementById('new-cat-name').value.trim();
            if (!name) return;
            await db.collection('users').doc(currentUser.uid).update({ categories: firebase.firestore.FieldValue.arrayUnion(name) });
            document.getElementById('new-cat-name').value = ''; showToast("ক্যাটাগরি যোগ হয়েছে"); loadUserSettings();
        });
        document.getElementById('add-acc-btn').addEventListener('click', async () => {
            const name = document.getElementById('new-acc-name').value.trim();
            if (!name) return;
            await db.collection('users').doc(currentUser.uid).update({ accounts: firebase.firestore.FieldValue.arrayUnion(name) });
            document.getElementById('new-acc-name').value = ''; showToast("একাউন্ট যোগ হয়েছে"); loadUserSettings();
        });
        document.getElementById('save-edit-btn').addEventListener('click', async () => {
            const id = document.getElementById('edit-id').value;
            const newData = {
                name: document.getElementById('edit-name').value, amount: parseFloat(document.getElementById('edit-amount').value),
                date: document.getElementById('edit-date').value, account: document.getElementById('edit-account').value,
                category: document.getElementById('edit-category').value
            };

            const docRef = db.collection('users').doc(currentUser.uid).collection('expenses').doc(id);
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                const oldData = docSnap.data();
                // 1. Revert Old Stats
                await updateStats(oldData.amount, oldData.type, true);

                await docRef.update(newData);

                // 2. Apply New Stats
                // Note: Type remains same as oldData unless changed (not in UI yet)
                await updateStats(newData.amount, oldData.type, false);

                editModal.classList.remove('open'); showToast("আপডেট হয়েছে");
                loadDashboard(); loadFirstPageTransactions();
            }
        });
        document.getElementById('delete-transaction-btn').addEventListener('click', async () => {
            const id = document.getElementById('edit-id').value;
            if (confirm("আপনি কি নিশ্চিত? এটি রিসাইকেল বিনে জমা থাকবে এবং ৩০ দিন পর্যন্ত রিস্টোর করা যাবে।")) {
                const docRef = db.collection('users').doc(currentUser.uid).collection('expenses').doc(id);
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    const oldData = docSnap.data();
                    await moveToTrash('expenses', id, oldData);
                    if (oldData.type === 'income' || oldData.type === 'expense') {
                        await updateStats(oldData.amount, oldData.type, true); // Delete stats
                    }

                    await docRef.delete();
                    editModal.classList.remove('open');
                    showToast("মুছে ফেলা হয়েছে (রিসাইকেল বিনে জমা হয়েছে)");
                    loadDashboard();
                    loadFirstPageTransactions();
                    updateTrashBadge();
                }
            }
        });
    };

    const openEditModal = async (data) => {
        if (data.type === 'debt') return;
        document.getElementById('edit-id').value = data.id;
        document.getElementById('edit-name').value = data.name;
        document.getElementById('edit-amount').value = data.amount;
        document.getElementById('edit-date').value = data.date;
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const cats = userDoc.data().categories || [];
        const accs = userDoc.data().accounts || [];
        const catSel = document.getElementById('edit-category');
        const accSel = document.getElementById('edit-account');
        catSel.innerHTML = ''; accSel.innerHTML = '';
        cats.forEach(c => catSel.innerHTML += `<option value="${c}" ${c === data.category ? 'selected' : ''}>${c}</option>`);
        accs.forEach(a => accSel.innerHTML += `<option value="${a}" ${a === data.account ? 'selected' : ''}>${a}</option>`);
        editModal.classList.add('open');
    };

    const loadDebts = async () => {
        debtList.innerHTML = '';
        const sn = await db.collection('users').doc(currentUser.uid).collection('ledgers').get();
        let owed = 0, iOwe = 0;
        sn.forEach(doc => {
            const d = doc.data(); const amt = d.netBalance || 0; if (amt == 0) return;
            if (amt > 0) owed += amt; else iOwe += Math.abs(amt);

            let dueBadge = '';
            if (d.dueDate) {
                const todayStr = getLocalDateString(new Date());
                const diffMs = new Date(d.dueDate) - new Date(todayStr);
                const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                if (daysLeft < 0) {
                    dueBadge = `<span class="badge-overdue"><i class="fas fa-exclamation-circle"></i> মেয়াদ শেষ</span>`;
                } else if (daysLeft === 0) {
                    dueBadge = `<span class="badge-due-soon"><i class="fas fa-clock"></i> আজ ফেরত</span>`;
                } else if (daysLeft <= 3) {
                    dueBadge = `<span class="badge-due-soon"><i class="fas fa-clock"></i> ${daysLeft} দিন বাকি</span>`;
                } else {
                    dueBadge = `<span style="font-size:0.72rem; color:var(--secondary-color);"><i class="fas fa-calendar-alt"></i> ${d.dueDate}</span>`;
                }
            }
            const phoneIcon = (d.phone || d.whatsapp) ? '<i class="fas fa-mobile-alt" style="margin-right:4px; color:var(--primary-color);" title="কন্টাক্ট যুক্ত আছে"></i>' : '';

            const li = document.createElement('li');
            li.innerHTML = `
                <div class="list-item-left">
                    <div class="icon-box icon-debt"><i class="fas fa-handshake"></i></div>
                    <div class="item-details">
                        <h4>${d.personName}</h4>
                        <p style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            <span>${phoneIcon}${d.lastUpdated}</span>
                            ${dueBadge}
                        </p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="item-amount ${amt > 0 ? 'amount-income' : 'amount-expense'}">${amt > 0 ? 'পাবেন' : 'দিতে হবে'} ৳${Math.abs(amt).toLocaleString('en-IN')}</span>
                    <button class="btn-edit-debt" data-id="${doc.id}" style="background:none; border:none; color:var(--primary-color); cursor:pointer;"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteDebt('${doc.id}')" style="background:none; border:none; color:var(--danger-color); cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
            `;
            // Click to view details (Using onclick for robustness)
            li.onclick = (e) => {
                // If retrieve/edit button was clicked (has class btn-edit-debt)
                if (e.target.closest('.btn-edit-debt')) {
                    e.stopPropagation();
                    window.openDebtDetails(doc.id, d);
                    return;
                }
                // If any other button (like delete)
                if (e.target.closest('button')) return;

                // Normal row click
                window.openDebtDetails(doc.id, d);
            };
            debtList.appendChild(li);
        });

        // Update Debt View Summary (Unique IDs)
        const dvOwed = document.getElementById('debt-view-total-owed');
        const dvIOwe = document.getElementById('debt-view-total-i-owe');
        if (dvOwed) dvOwed.innerText = owed;
        if (dvIOwe) dvIOwe.innerText = iOwe;

        // Also update Global Dashboard elements if they exist (sync)
        if (totalOwedEl) totalOwedEl.innerText = owed;
        if (totalIOweEl) totalIOweEl.innerText = iOwe;
    };

    // New helper for editing debt (simple rename for now as structure is complex)
    window.editDebt = async (id, currentName, currentAmount) => {
        const newName = prompt("নাম পরিবর্তন করুন:", currentName);
        if (newName && newName !== currentName) {
            await db.collection('users').doc(currentUser.uid).collection('ledgers').doc(id).update({ personName: newName });
            showToast("নাম আপডেট হয়েছে");
            loadDebts();
        }
    };

    window.deleteDebt = async (id) => {
        if (!confirm("আপনি কি নিশ্চিত? এটি রিসাইকেল বিনে জমা থাকবে এবং ৩০ দিন পর্যন্ত রিস্টোর করা যাবে।")) return;
        try {
            const ledgerRef = db.collection('users').doc(currentUser.uid).collection('ledgers').doc(id);
            const snap = await ledgerRef.get();
            if (snap.exists) {
                const histSnap = await ledgerRef.collection('history').get();
                const historyData = [];
                histSnap.forEach(h => historyData.push({ id: h.id, data: h.data() }));

                await moveToTrash('ledgers', id, { ...snap.data(), _subcollectionHistory: historyData });

                for (const h of historyData) {
                    await ledgerRef.collection('history').doc(h.id).delete();
                }
                await ledgerRef.delete();
                showToast("দেনা-পাওনার হিসাব রিসাইকেল বিনে সরানো হয়েছে");
                loadDebts();
                updateTrashBadge();
            }
        } catch (e) {
            console.error(e);
            showToast("মুছতে সমস্যা হয়েছে", "error");
        }
    };

    // --- NEW DEBT DETAILS LOGIC ---

    // --- NEW DEBT DETAILS LOGIC (Globalized) ---

    // Make global for robust access
    window.openDebtDetails = async (id, data = null) => {
        try {
            console.log("Opening details for:", id);
            const modal = document.getElementById('debt-details-modal');
            if (!modal) {
                alert("Error: Modal element not found!");
                return;
            }

            // 1. Open Modal Immediately
            modal.classList.add('open');
            console.log("Modal opened.");

            // If data is missing (e.g. called via string onclick), fetch it
            if (!data) {
                try {
                    const docSnap = await db.collection('users').doc(currentUser.uid).collection('ledgers').doc(id).get();
                    if (docSnap.exists) data = docSnap.data();
                } catch (err) {
                    console.error("Error fetching debt data", err);
                }
            }

            // Populate Info
            const nameEl = document.getElementById('debt-person-name');
            const hiddenId = document.getElementById('current-ledger-id');
            const newDateEl = document.getElementById('debt-new-date');
            const newAmountEl = document.getElementById('debt-new-amount');

            if (hiddenId) hiddenId.value = id;
            if (nameEl) nameEl.innerText = data ? data.personName : "Loading...";

            currentActiveDebtContact = { id: id, ...(data || {}) };
            renderDebtContactBadges(currentActiveDebtContact);

            // Update Balance UI
            const balance = (data && data.netBalance !== undefined) ? data.netBalance : 0;
            window.updateDebtUI(balance);

            // Reset Inputs
            if (newAmountEl) newAmountEl.value = '';
            if (newDateEl) {
                const today = new Date();
                newDateEl.value = today.toISOString().split('T')[0];
            }

            // Load History
            window.loadDebtHistory(id);

            // --- FIX CLOSE LOGIC ---
            const closeBtn = modal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modal.classList.remove('open');
                };
            }

        } catch (e) {
            console.error(e);
            alert("System Error: " + e.message);
        }
    };

    window.updateDebtUI = (balance) => {
        const balanceEl = document.getElementById('debt-net-balance');
        const badgeEl = document.getElementById('debt-status-badge');
        if (!balanceEl || !badgeEl) return;

        balanceEl.innerText = `৳${Math.abs(balance)}`;
        if (balance > 0) {
            balanceEl.style.color = 'var(--success-color)';
            badgeEl.innerText = 'পাওনা (You Get)';
            badgeEl.style.color = 'var(--success-color)';
            badgeEl.style.background = '#d4edda';
        } else if (balance < 0) {
            balanceEl.style.color = 'var(--danger-color)';
            badgeEl.innerText = 'দেনা (You Owe)';
            badgeEl.style.color = 'var(--danger-color)';
            badgeEl.style.background = '#f8d7da';
        } else {
            balanceEl.style.color = 'var(--secondary-color)';
            badgeEl.innerText = 'SETTLED';
            badgeEl.style.color = 'var(--secondary-color)';
            badgeEl.style.background = '#eee';
        }
    };

    window.loadDebtHistory = async (id) => {
        const list = document.getElementById('debt-history-list');
        if (!list) return;
        list.innerHTML = '<li class="skeleton" style="height:50px;"></li>';

        try {
            const snap = await db.collection('users').doc(currentUser.uid)
                .collection('ledgers').doc(id).collection('history')
                .orderBy('date', 'desc').limit(50).get();

            list.innerHTML = '';
            if (snap.empty) {
                list.innerHTML = '<p style="text-align:center; color:gray; font-size:0.8rem; margin-top:20px;">কোন লেনদেনের ইতিহাস নেই</p>';
                return;
            }

            snap.forEach(doc => {
                const d = doc.data();
                const li = document.createElement('li');
                li.style.cssText = "padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;";

                // Color logic based on type
                let color = 'black';
                let typeText = d.type;

                // Types: 'LEND_GIVEN' (+), 'DEBT_REPAID' (+), 'BORROW_TAKEN' (-), 'LEND_RETURNED' (-)
                if (d.type === 'GIVEN') {
                    color = 'green'; typeText = 'দিলাম (+powna)';
                } else if (d.type === 'GOT') {
                    color = 'red'; typeText = 'পেলাম (-powna)';
                } else if (d.type === 'INITIAL') {
                    color = 'gray'; typeText = 'শুরু';
                }

                li.innerHTML = `
                    <div>
                        <span style="font-weight: 500; font-size: 0.9rem;">${typeText}</span>
                        <div style="font-size: 0.75rem; color: gray;">${d.date}</div>
                    </div>
                    <div style="font-weight: bold; color: ${color};">৳${d.amount}</div>
                `;
                list.appendChild(li);
            });
        } catch (e) {
            console.error(e);
            list.innerHTML = '<p style="color:red; text-align:center;">ইতিহাস লোড হয়নি</p>';
        }
    };

    // Button Listeners for Debt Details
    const btnGive = document.getElementById('btn-give-money');
    const btnGet = document.getElementById('btn-get-money');
    if (btnGive) btnGive.addEventListener('click', () => window.handleDebtTransaction('GIVEN'));
    if (btnGet) btnGet.addEventListener('click', () => window.handleDebtTransaction('GOT'));

    window.handleDebtTransaction = async (type) => {
        const id = document.getElementById('current-ledger-id').value;
        const amount = parseFloat(document.getElementById('debt-new-amount').value);
        const date = document.getElementById('debt-new-date').value;

        if (!amount || !date) return showToast("পরিমাণ এবং তারিখ দিন", "error");

        const btn = type === 'GIVEN' ? document.getElementById('btn-give-money') : document.getElementById('btn-get-money');
        if (btn) {
            btn.innerText = "Processing...";
            btn.disabled = true;
        }

        try {
            const ledgerRef = db.collection('users').doc(currentUser.uid).collection('ledgers').doc(id);

            await db.runTransaction(async (t) => {
                const doc = await t.get(ledgerRef);
                const currentBal = doc.data().netBalance || 0;
                let change = 0;

                // Logic:
                // GIVEN: I gave money -> Powna increases (+) OR Dena decreases (+)
                // GOT: I got money -> Powna decreases (-) OR Dena increases (-)
                if (type === 'GIVEN') change = amount;
                else change = -amount;

                const newBal = safeMath.add(currentBal, change);

                t.update(ledgerRef, { netBalance: newBal, lastUpdated: date });

                const historyRef = ledgerRef.collection('history').doc();
                t.set(historyRef, {
                    amount: amount,
                    type: type,
                    date: date,
                    createdAt: new Date().toISOString()
                });
            });

            showToast("লেনদেন আপডেট হয়েছে", "success");

            // Refresh UI
            const updatedDoc = await ledgerRef.get();
            const updatedData = updatedDoc.data();
            currentActiveDebtContact = { id: id, ...updatedData };
            renderDebtContactBadges(currentActiveDebtContact);
            window.updateDebtUI(updatedData.netBalance);
            window.loadDebtHistory(id);
            loadDebts(); // Refresh background list

            document.getElementById('debt-new-amount').value = '';

            // Trigger Post-Save Notification Action Sheet
            openNotifyActionSheet({
                personName: updatedData.personName,
                amount: amount,
                type: type,
                date: date,
                netBalance: updatedData.netBalance,
                dueDate: updatedData.dueDate || '',
                phone: updatedData.phone || '',
                whatsapp: updatedData.whatsapp || updatedData.phone || '',
                email: updatedData.email || ''
            });

        } catch (e) {
            console.error(e);
            showToast("এরর: " + e.message, "error");
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerText = type === 'GIVEN' ? 'টাকা দিলাম (+)' : 'টাকা পেলাম (-)';
            }
        }
    };

    // Name Edit Helper
    document.getElementById('edit-debt-name-btn').addEventListener('click', async () => {
        const id = document.getElementById('current-ledger-id').value;
        const currentName = document.getElementById('debt-person-name').innerText;
        const newName = prompt("নতুন নাম:", currentName);
        if (newName && newName !== currentName) {
            await db.collection('users').doc(currentUser.uid).collection('ledgers').doc(id).update({ personName: newName });
            document.getElementById('debt-person-name').innerText = newName;
            loadDebts();
        }
    });

    const loadUserSettings = async () => {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        // Defaults if data missing
        const defaultCats = ['খাবার', 'যাতায়াত', 'বিল', 'বাজার', 'এন্টারটেইনমেন্ট', 'চিকিৎসা', 'শিক্ষা', 'অন্যান্য'];
        const defaultAccs = ['নগদ', 'বিকাশ', 'রকেট', 'ব্যাংক', 'কার্ড'];

        let categories = defaultCats;
        let accounts = defaultAccs;
        let userName = '';
        let userEmail = currentUser.email;

        if (doc.exists) {
            const data = doc.data();
            categories = (data.categories && data.categories.length > 0) ? data.categories : defaultCats;
            accounts = (data.accounts && data.accounts.length > 0) ? data.accounts : defaultAccs;
            userName = data.name || '';
            window.userPaymentNumber = data.paymentNumber || '';
            window.customSmsApiUrl = data.smsApiUrl || '';
        }

        window.userDisplayName = userName || (currentUser ? currentUser.displayName : '') || 'AmarHishab';

        // Update Settings Modal Inputs
        document.getElementById('settings-name').value = userName;
        document.getElementById('settings-email').value = userEmail;
        const payInput = document.getElementById('settings-payment-number');
        if (payInput) payInput.value = window.userPaymentNumber || '';
        const smsInput = document.getElementById('settings-sms-api-url');
        if (smsInput) smsInput.value = window.customSmsApiUrl || '';

        // Update Welcome Message
        const welcomeNameEl = document.getElementById('welcome-user-name');
        if (welcomeNameEl) {
            // Use full name, fallback to displayName or 'User'
            const displayName = userName || currentUser.displayName || 'User';
            welcomeNameEl.innerText = displayName;
        }

        const accSelect = document.getElementById('t-account');
        const catSelect = document.getElementById('t-category');

        accSelect.innerHTML = '<option disabled selected>একাউন্ট</option>';
        accounts.forEach(a => accSelect.innerHTML += `<option value="${a}">${a}</option>`);

        catSelect.innerHTML = '<option disabled selected>ক্যাটাগরি</option>';
        categories.forEach(c => catSelect.innerHTML += `<option value="${c}">${c}</option>`);

        // Populate Filter Account in History
        filterAccount.innerHTML = '<option value="">সকল একাউন্ট</option>';
        accounts.forEach(a => filterAccount.innerHTML += `<option value="${a}">${a}</option>`);

        const catList = document.getElementById('category-list');
        const accList = document.getElementById('account-list');

        catList.innerHTML = '';
        categories.forEach(c => catList.innerHTML += `<li>${c} <button style="color:red;border:none;background:none;" onclick="removeCategory('${c}')"><i class="fas fa-trash"></i></button></li>`);

        accList.innerHTML = '';
        accounts.forEach(a => accList.innerHTML += `<li>${a} <button style="color:red;border:none;background:none;" onclick="removeAccount('${a}')"><i class="fas fa-trash"></i></button></li>`);
    };

    // Settings Updates
    // Settings Updates - Safe Listeners
    const safeListener = (id, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', handler);
    };

    safeListener('update-name-btn', async () => {
        const name = document.getElementById('settings-name').value;
        if (!name) return;
        try {
            await db.collection('users').doc(currentUser.uid).update({ name: name });
            await currentUser.updateProfile({ displayName: name });
            showToast("নাম আপডেট হয়েছে");
        } catch (e) { console.error(e); }
    });

    safeListener('update-email-btn', async () => {
        const email = document.getElementById('settings-email').value;
        if (!email) return;
        try {
            await currentUser.updateEmail(email);
            showToast("ইমেইল আপডেট হয়েছে! আবার লগইন করুন।");
            auth.signOut();
        } catch (e) { showToast("এরর: " + e.message, 'error'); }
    });

    safeListener('update-pass-btn', async () => {
        const pass = document.getElementById('settings-password').value;
        if (!pass || pass.length < 6) return showToast("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে", 'error');
        try {
            await currentUser.updatePassword(pass);
            showToast("পাসওয়ার্ড পরিবর্তন হয়েছে!");
            document.getElementById('settings-password').value = '';
        } catch (e) {
            if (e.code === 'auth/requires-recent-login') showToast("নিরাপত্তার স্বার্থে আবার লগইন করে চেষ্টা করুন।", 'error');
            else showToast("এরর: " + e.message, 'error');
        }
    });

    safeListener('update-payment-number-btn', async () => {
        const num = document.getElementById('settings-payment-number').value.trim();
        try {
            await db.collection('users').doc(currentUser.uid).set({ paymentNumber: num }, { merge: true });
            window.userPaymentNumber = num;
            showToast("পেমেন্ট নম্বর সেভ হয়েছে!");
        } catch (e) {
            console.error(e);
            showToast("এরর: " + e.message, "error");
        }
    });

    safeListener('update-sms-api-btn', async () => {
        const url = document.getElementById('settings-sms-api-url').value.trim();
        try {
            await db.collection('users').doc(currentUser.uid).set({ smsApiUrl: url }, { merge: true });
            window.customSmsApiUrl = url;
            showToast("SMS API URL সেভ হয়েছে!");
        } catch (e) {
            console.error(e);
            showToast("এরর: " + e.message, "error");
        }
    });

    window.removeCategory = async (name) => { if (!confirm('মুছে ফেলতে চান?')) return; await db.collection('users').doc(currentUser.uid).update({ categories: firebase.firestore.FieldValue.arrayRemove(name) }); loadUserSettings(); };
    window.removeAccount = async (name) => { if (!confirm('মুছে ফেলতে চান?')) return; await db.collection('users').doc(currentUser.uid).update({ accounts: firebase.firestore.FieldValue.arrayRemove(name) }); loadUserSettings(); };
    window.showToast = (msg, type = 'success') => {
        if (typeof Toastify === 'undefined') { alert(msg); return; }
        Toastify({ text: msg, duration: 3000, gravity: "bottom", position: "center", style: { background: type === 'error' ? "#dc3545" : "#28a745", borderRadius: "8px" } }).showToast();
    };
    function debounce(func, timeout = 300) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => { func.apply(this, args); }, timeout); }; }

    // ==========================================
    // 30-DAY TRASH / RECYCLE BIN SYSTEM
    // ==========================================
    const moveToTrash = async (sourceCollection, originalId, data) => {
        if (!currentUser) return;
        try {
            const trashRef = db.collection('users').doc(currentUser.uid).collection('trash').doc();
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days retention
            const cleanedData = JSON.parse(JSON.stringify(data));

            await trashRef.set({
                sourceCollection: sourceCollection,
                originalId: originalId,
                data: cleanedData,
                deletedAt: now.toISOString(),
                expiresAt: expiresAt.toISOString()
            });
            console.log("Moved to trash:", trashRef.id);
        } catch (e) {
            console.error("Move to trash error:", e);
        }
    };

    const updateTrashBadge = async () => {
        if (!currentUser || !trashBadgeCount) return;
        try {
            const snap = await db.collection('users').doc(currentUser.uid).collection('trash').get();
            const count = snap.size;
            trashBadgeCount.innerText = count;
            trashBadgeCount.style.display = count > 0 ? 'inline-block' : 'none';
        } catch (e) {
            console.error("Trash badge error:", e);
        }
    };

    const loadTrash = async () => {
        if (!currentUser) return;
        try {
            if (trashItemsList) {
                trashItemsList.innerHTML = '<li style="text-align:center; padding:24px; color:var(--secondary-color);"><i class="fas fa-spinner fa-spin"></i> লোড হচ্ছে...</li>';
            }
            const snap = await db.collection('users').doc(currentUser.uid).collection('trash').orderBy('deletedAt', 'desc').get();
            const items = [];
            const now = new Date().toISOString();
            const expiredDocRefs = [];

            snap.forEach(doc => {
                const d = doc.data();
                d.id = doc.id;
                if (d.expiresAt && d.expiresAt < now) {
                    expiredDocRefs.push(doc.ref);
                } else {
                    items.push(d);
                }
            });

            // Clean expired items in background
            if (expiredDocRefs.length > 0) {
                const batch = db.batch();
                expiredDocRefs.forEach(ref => batch.delete(ref));
                batch.commit().catch(e => console.error("Auto purge error:", e));
            }

            trashItems = items;
            renderTrashItems();
            updateTrashBadge();
        } catch (e) {
            console.error("Load trash error:", e);
            if (trashItemsList) {
                trashItemsList.innerHTML = '<li style="text-align:center; padding:20px; color:var(--danger-color);">লোড করতে সমস্যা হয়েছে</li>';
            }
        }
    };

    const renderTrashItems = () => {
        if (!trashItemsList || !emptyTrashState) return;
        trashItemsList.innerHTML = '';

        let filtered = trashItems;
        if (currentTrashFilter === 'expense') {
            filtered = trashItems.filter(item => item.sourceCollection === 'expenses');
        } else if (currentTrashFilter === 'debt') {
            filtered = trashItems.filter(item => item.sourceCollection === 'ledgers');
        } else if (currentTrashFilter === 'recurring') {
            filtered = trashItems.filter(item => item.sourceCollection === 'recurring_templates');
        }

        if (filtered.length === 0) {
            emptyTrashState.style.display = 'block';
            trashItemsList.style.display = 'none';
            return;
        }

        emptyTrashState.style.display = 'none';
        trashItemsList.style.display = 'block';

        filtered.forEach(item => {
            const d = item.data || {};
            const li = document.createElement('li');
            li.className = 'trash-item-card';

            let typeLabel = 'খরচ';
            let typeBadgeClass = 'badge-expense';
            let title = d.name || 'লেনদেন';
            let amountStr = `৳${parseFloat(d.amount || 0).toLocaleString('en-IN')}`;

            if (item.sourceCollection === 'ledgers') {
                typeLabel = 'দেনা-পাওনা';
                typeBadgeClass = 'badge-debt';
                title = d.personName || 'দেনা-পাওনা';
                const bal = d.netBalance || 0;
                amountStr = `${bal > 0 ? 'পাবেন' : 'দিতে হবে'} ৳${Math.abs(bal).toLocaleString('en-IN')}`;
            } else if (item.sourceCollection === 'recurring_templates') {
                typeLabel = 'রিকারিং';
                typeBadgeClass = 'badge-recurring';
                title = d.name || 'রিকারিং খরচ';
            } else if (d.type === 'income') {
                typeLabel = 'আয়';
                typeBadgeClass = 'badge-income';
            } else if (d.type === 'transfer') {
                typeLabel = 'স্থানান্তর';
                typeBadgeClass = 'badge-transfer';
                title = d.name || `স্থানান্তর: ${d.account} ➔ ${d.toAccount}`;
            }

            // Days left calculation
            const expiresAtDate = item.expiresAt ? new Date(item.expiresAt) : new Date(Date.now() + 30 * 86400000);
            const msLeft = expiresAtDate.getTime() - Date.now();
            const daysLeft = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

            const deletedDateStr = item.deletedAt ? new Date(item.deletedAt).toLocaleDateString('bn-BD', {
                year: 'numeric', month: 'short', day: 'numeric'
            }) : '';

            li.innerHTML = `
                <div class="trash-item-top">
                    <div class="trash-item-info">
                        <span class="trash-type-badge ${typeBadgeClass}">${typeLabel}</span>
                        <h4>${title}</h4>
                        <div class="trash-item-meta">
                            <span>মুছে ফেলা হয়েছে: ${deletedDateStr}</span>
                            <span class="days-left-badge"><i class="fas fa-clock"></i> ${daysLeft} দিন বাকি</span>
                        </div>
                    </div>
                    <div class="trash-item-amount">${amountStr}</div>
                </div>
                <div class="trash-item-actions">
                    <button class="btn-restore-trash" onclick="restoreTrashItem('${item.id}')">
                        <i class="fas fa-undo-alt"></i> রিস্টোর
                    </button>
                    <button class="btn-perm-delete-trash" onclick="permanentDeleteTrash('${item.id}')">
                        <i class="fas fa-trash-alt"></i> মুছে ফেলুন
                    </button>
                </div>
            `;

            trashItemsList.appendChild(li);
        });
    };

    window.restoreTrashItem = async (trashDocId) => {
        if (!currentUser) return;
        try {
            const trashRef = db.collection('users').doc(currentUser.uid).collection('trash').doc(trashDocId);
            const trashSnap = await trashRef.get();
            if (!trashSnap.exists) {
                showToast("রেকর্ডটি পাওয়া যায়নি", "error");
                loadTrash();
                return;
            }

            const trashData = trashSnap.data();
            const { sourceCollection, originalId, data } = trashData;
            const userRef = db.collection('users').doc(currentUser.uid);

            if (sourceCollection === 'expenses') {
                const targetRef = originalId ? userRef.collection('expenses').doc(originalId) : userRef.collection('expenses').doc();
                await targetRef.set(data);
                if (data.type === 'income' || data.type === 'expense') {
                    await updateStats(data.amount, data.type, false);
                }
                loadDashboard();
                loadFirstPageTransactions();
            } else if (sourceCollection === 'recurring_templates') {
                const targetRef = originalId ? userRef.collection('recurring_templates').doc(originalId) : userRef.collection('recurring_templates').doc();
                await targetRef.set(data);
                loadRecurringTemplates();
            } else if (sourceCollection === 'ledgers') {
                const targetRef = originalId ? userRef.collection('ledgers').doc(originalId) : userRef.collection('ledgers').doc();
                const historyData = data._subcollectionHistory || [];
                delete data._subcollectionHistory;

                await targetRef.set(data);

                // Restore subcollection history
                for (const h of historyData) {
                    if (h.id && h.data) {
                        await targetRef.collection('history').doc(h.id).set(h.data);
                    }
                }
                loadDebts();
                loadDashboard();
            }

            await trashRef.delete();
            showToast("সফলভাবে রিস্টোর করা হয়েছে!", "success");
            loadTrash();
        } catch (e) {
            console.error("Restore error:", e);
            showToast("রিস্টোর করতে সমস্যা হয়েছে: " + e.message, "error");
        }
    };

    window.permanentDeleteTrash = async (trashDocId) => {
        if (!confirm("স্থায়ীভাবে মুছে ফেলতে চান? এটি আর কখনোই পুনরুদ্ধার করা যাবে না।")) return;
        try {
            await db.collection('users').doc(currentUser.uid).collection('trash').doc(trashDocId).delete();
            showToast("স্থায়ীভাবে মুছে ফেলা হয়েছে");
            loadTrash();
        } catch (e) {
            console.error("Permanent delete error:", e);
            showToast("এরর: " + e.message, "error");
        }
    };

    window.emptyTrash = async () => {
        if (!trashItems || trashItems.length === 0) {
            showToast("রিসাইকেল বিন ইতিমধ্যেই খালি!", "info");
            return;
        }
        if (!confirm("রিসাইকেল বিনের সব আইটেম স্থায়ীভাবে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।")) return;
        try {
            const batch = db.batch();
            const snap = await db.collection('users').doc(currentUser.uid).collection('trash').get();
            snap.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            showToast("রিসাইকেল বিন সম্পূর্ণ খালি করা হয়েছে");
            loadTrash();
        } catch (e) {
            console.error("Empty trash error:", e);
            showToast("এরর: " + e.message, "error");
        }
    };

    // ==========================================
    // MULTI-CHANNEL NOTIFICATION ENGINE & VOUCHER SLIP
    // ==========================================
    const generateDebtVoucherText = (personName, amount, type, date, netBalance, dueDate = '') => {
        const isGiven = type === 'GIVEN' || type === 'lend';
        const typeText = isGiven ? 'টাকা দেওয়া হয়েছে (Lent)' : 'টাকা পাওয়া গেছে (Received)';
        let balanceText = '';
        if (netBalance > 0) {
            balanceText = `৳${Math.abs(netBalance).toLocaleString('en-IN')} (পাওনা)`;
        } else if (netBalance < 0) {
            balanceText = `৳${Math.abs(netBalance).toLocaleString('en-IN')} (দেনা)`;
        } else {
            balanceText = `৳০ (হিসাব পরিশোধিত)`;
        }

        const dueDateLine = dueDate ? `\n📅 টাকা ফেরতের নির্ধারিত তারিখ: ${dueDate}` : '';
        const paymentNumber = window.userPaymentNumber ? `\n💳 বিকাশ/নগদ মারফত পরিশোধ করতে: ${window.userPaymentNumber}` : '';
        const sender = window.userDisplayName || 'AmarHishab';

        return `🧾 লেনদেন ভাউচার - AmarHishab\n────────────────────────\nসম্মানিত ${personName},\nআপনার সাথে একটি নতুন লেনদেন রেকর্ড করা হয়েছে:\n\n🔹 ধরন: ${typeText}\n🔹 পরিমাণ: ৳${parseFloat(amount || 0).toLocaleString('en-IN')}\n🔹 তারিখ: ${date}${dueDateLine}\n────────────────────────\n📌 বর্তমান অবশিষ্ট মোট হিসাব: ${balanceText}${paymentNumber}\n\nধন্যবাদান্তে,\n${sender} (AmarHishab)`;
    };

    const sendWhatsAppNotification = (rawPhone, text) => {
        let cleanPhone = (rawPhone || '').replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('01')) {
            cleanPhone = '88' + cleanPhone;
        }
        if (cleanPhone) {
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }
    };

    const sendSmsNotification = async (rawPhone, text) => {
        const cleanPhone = (rawPhone || '').replace(/[^0-9+]/g, '');
        if (!cleanPhone) {
            showToast("প্রাপকের মোবাইল নম্বর দেওয়া নেই। কন্টাক্ট এডিটে গিয়ে নম্বর দিন।", "error");
            return;
        }

        // Check if custom SMS API is configured in settings
        if (window.customSmsApiUrl && window.customSmsApiUrl.trim()) {
            try {
                showToast("SMS গেটওয়েতে পাঠানো হচ্ছে...", "info");
                let targetUrl = window.customSmsApiUrl
                    .replace('{phone}', encodeURIComponent(cleanPhone))
                    .replace('{number}', encodeURIComponent(cleanPhone))
                    .replace('{to}', encodeURIComponent(cleanPhone))
                    .replace('{text}', encodeURIComponent(text))
                    .replace('{message}', encodeURIComponent(text))
                    .replace('{msg}', encodeURIComponent(text));

                if (!window.customSmsApiUrl.includes('{phone}') && !window.customSmsApiUrl.includes('{to}')) {
                    const sep = targetUrl.includes('?') ? '&' : '?';
                    targetUrl += `${sep}to=${encodeURIComponent(cleanPhone)}&message=${encodeURIComponent(text)}`;
                }

                await fetch(targetUrl, { mode: 'no-cors' });
                showToast("SMS সফলভাবে পাঠানো হয়েছে!", "success");
                return;
            } catch (err) {
                console.warn("SMS Gateway warning, falling back to SIM:", err);
            }
        }

        // Universal SIM SMS intent fallback
        window.location.href = `sms:${cleanPhone}?body=${encodeURIComponent(text)}`;
    };

    const sendEmailNotification = async (email, personName, text) => {
        if (!email) {
            showToast("প্রাপকের ইমেইল এড্রেস দেওয়া নেই। কন্টাক্ট এডিটে গিয়ে ইমেইল দিন।", "error");
            return;
        }
        try {
            if (typeof emailjs !== 'undefined') {
                showToast("ইমেইল পাঠানো হচ্ছে...", "info");
                await emailjs.send("service_default", "template_default", {
                    to_email: email,
                    to_name: personName,
                    message: text,
                    subject: `AmarHishab লেনদেন ভাউচার - ${personName}`
                });
                showToast("ইমেইল সফলভাবে পাঠানো হয়েছে!", "success");
                return;
            }
        } catch (e) {
            console.warn("EmailJS send warning:", e);
        }
        window.location.href = `mailto:${email}?subject=${encodeURIComponent('AmarHishab লেনদেন ভাউচার')}&body=${encodeURIComponent(text)}`;
    };

    const openNotifyActionSheet = (data) => {
        pendingNotificationData = data;
        if (!notifyActionSheetModal) return;

        const voucherText = generateDebtVoucherText(
            data.personName,
            data.amount,
            data.type,
            data.date,
            data.netBalance,
            data.dueDate
        );

        if (voucherSlipPreviewText) voucherSlipPreviewText.innerText = voucherText;
        if (notifyRecipientSubtitle) notifyRecipientSubtitle.innerText = `${data.personName}-কে ডিজিটাল ভাউচার নোটিফিকেশন পাঠান`;

        if (btnSheetWhatsapp) {
            const waTarget = data.whatsapp || data.phone;
            btnSheetWhatsapp.innerHTML = `<i class="fab fa-whatsapp" style="font-size: 1.25rem;"></i> WhatsApp এ স্লিপ পাঠান ${waTarget ? `(${waTarget})` : ''}`;
        }
        if (btnSheetSms) {
            btnSheetSms.innerHTML = `<i class="fas fa-comment-dots" style="font-size: 1.15rem;"></i> SMS পাঠান ${data.phone ? `(${data.phone})` : ''}`;
        }
        if (btnSheetEmail) {
            btnSheetEmail.innerHTML = `<i class="fas fa-envelope" style="font-size: 1.15rem;"></i> Email এ রসিদ পাঠান ${data.email ? `(${data.email})` : ''}`;
        }

        notifyActionSheetModal.classList.add('open');
    };

    if (btnSheetWhatsapp) {
        btnSheetWhatsapp.addEventListener('click', () => {
            if (!pendingNotificationData) return;
            const voucherText = generateDebtVoucherText(
                pendingNotificationData.personName,
                pendingNotificationData.amount,
                pendingNotificationData.type,
                pendingNotificationData.date,
                pendingNotificationData.netBalance,
                pendingNotificationData.dueDate
            );
            sendWhatsAppNotification(pendingNotificationData.whatsapp || pendingNotificationData.phone, voucherText);
            notifyActionSheetModal.classList.remove('open');
        });
    }

    if (btnSheetSms) {
        btnSheetSms.addEventListener('click', () => {
            if (!pendingNotificationData) return;
            const voucherText = generateDebtVoucherText(
                pendingNotificationData.personName,
                pendingNotificationData.amount,
                pendingNotificationData.type,
                pendingNotificationData.date,
                pendingNotificationData.netBalance,
                pendingNotificationData.dueDate
            );
            sendSmsNotification(pendingNotificationData.phone, voucherText);
            notifyActionSheetModal.classList.remove('open');
        });
    }

    if (btnSheetEmail) {
        btnSheetEmail.addEventListener('click', () => {
            if (!pendingNotificationData) return;
            const voucherText = generateDebtVoucherText(
                pendingNotificationData.personName,
                pendingNotificationData.amount,
                pendingNotificationData.type,
                pendingNotificationData.date,
                pendingNotificationData.netBalance,
                pendingNotificationData.dueDate
            );
            sendEmailNotification(pendingNotificationData.email, pendingNotificationData.personName, voucherText);
            notifyActionSheetModal.classList.remove('open');
        });
    }

    if (btnSheetSkip) {
        btnSheetSkip.addEventListener('click', () => {
            if (notifyActionSheetModal) notifyActionSheetModal.classList.remove('open');
        });
    }

    // ==========================================
    // DEBT CONTACT BADGES & CUSTOMER KHOTIYAN PDF
    // ==========================================
    const renderDebtContactBadges = (data) => {
        if (!debtContactBadges) return;
        debtContactBadges.innerHTML = '';
        if (!data) return;

        let hasAny = false;

        if (data.phone) {
            hasAny = true;
            debtContactBadges.innerHTML += `
                <a href="tel:${data.phone}" class="contact-badge" title="কল করুন">
                    <i class="fas fa-phone"></i> ${data.phone}
                </a>
            `;
        }

        if (data.whatsapp || data.phone) {
            hasAny = true;
            const waNum = data.whatsapp || data.phone;
            const cleanWa = waNum.startsWith('01') ? '88' + waNum : waNum;
            debtContactBadges.innerHTML += `
                <a href="https://wa.me/${cleanWa}" target="_blank" class="contact-badge wa" title="WhatsApp চ্যাট">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            `;
        }

        if (data.email) {
            hasAny = true;
            debtContactBadges.innerHTML += `
                <a href="mailto:${data.email}" class="contact-badge email" title="ইমেইল করুন">
                    <i class="fas fa-envelope"></i> Email
                </a>
            `;
        }

        if (data.dueDate) {
            hasAny = true;
            const todayStr = getLocalDateString(new Date());
            const diffMs = new Date(data.dueDate) - new Date(todayStr);
            const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            let badgeClass = 'contact-badge due';
            let dueText = `ফেরত: ${data.dueDate}`;
            if (daysLeft < 0) {
                badgeClass += ' overdue';
                dueText = `মেয়াদ শেষ (${data.dueDate})`;
            } else if (daysLeft === 0) {
                dueText = `আজ ফেরত দিতে হবে`;
            } else if (daysLeft <= 3) {
                dueText = `${daysLeft} দিন বাকি (${data.dueDate})`;
            }
            debtContactBadges.innerHTML += `
                <span class="${badgeClass}">
                    <i class="fas fa-calendar-alt"></i> ${dueText}
                </span>
            `;
        }

        if (!hasAny) {
            debtContactBadges.innerHTML = `
                <span style="font-size: 0.75rem; color: var(--secondary-color); opacity: 0.8;">
                    (কোনো কন্টাক্ট নম্বর বা ইমেইল সেট করা নেই)
                </span>
            `;
        }
    };

    // Open Contact Modal Listener
    if (btnOpenContactModal) {
        btnOpenContactModal.addEventListener('click', () => {
            if (!currentActiveDebtContact) return;
            editContactLedgerId.value = currentActiveDebtContact.id;
            const sub = document.getElementById('debt-contact-modal-subtitle');
            if (sub) sub.innerText = `${currentActiveDebtContact.personName}-এর কন্টাক্ট তথ্য`;
            if (editContactPhone) editContactPhone.value = currentActiveDebtContact.phone || '';
            if (editContactWhatsapp) editContactWhatsapp.value = currentActiveDebtContact.whatsapp || '';
            if (editContactEmail) editContactEmail.value = currentActiveDebtContact.email || '';
            if (editContactDueDate) editContactDueDate.value = currentActiveDebtContact.dueDate || '';
            debtContactModal.classList.add('open');
        });
    }

    // Save Contact Modal Listener
    if (saveDebtContactBtn) {
        saveDebtContactBtn.addEventListener('click', async () => {
            const id = editContactLedgerId.value;
            if (!id || !currentUser) return;
            const phone = editContactPhone.value.trim();
            const whatsapp = editContactWhatsapp.value.trim();
            const email = editContactEmail.value.trim();
            const dueDate = editContactDueDate.value;

            saveDebtContactBtn.disabled = true;
            saveDebtContactBtn.innerText = "সেভ হচ্ছে...";

            try {
                const ledgerRef = db.collection('users').doc(currentUser.uid).collection('ledgers').doc(id);
                await ledgerRef.update({
                    phone: phone,
                    whatsapp: whatsapp,
                    email: email,
                    dueDate: dueDate
                });

                if (currentActiveDebtContact) {
                    currentActiveDebtContact.phone = phone;
                    currentActiveDebtContact.whatsapp = whatsapp;
                    currentActiveDebtContact.email = email;
                    currentActiveDebtContact.dueDate = dueDate;
                    renderDebtContactBadges(currentActiveDebtContact);
                }

                debtContactModal.classList.remove('open');
                showToast("কন্টাক্ট তথ্য আপডেট হয়েছে!", "success");
                loadDebts();
            } catch (e) {
                console.error("Save contact error:", e);
                showToast("এরর: " + e.message, "error");
            } finally {
                saveDebtContactBtn.disabled = false;
                saveDebtContactBtn.innerText = "কন্টাক্ট সেভ করুন";
            }
        });
    }

    // Customer Statement (খতিয়ান) PDF Generator
    const generateCustomerStatementPdf = async (ledgerId) => {
        try {
            showToast("খতিয়ান PDF তৈরি হচ্ছে...", "info");
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const userRef = db.collection('users').doc(currentUser.uid);
            const ledgerDoc = await userRef.collection('ledgers').doc(ledgerId).get();
            if (!ledgerDoc.exists) return showToast("হিসাব পাওয়া যায়নি", "error");

            const lData = ledgerDoc.data();
            const personName = lData.personName || 'Customer';
            const netBal = lData.netBalance || 0;

            const histSnap = await userRef.collection('ledgers').doc(ledgerId).collection('history').orderBy('date', 'desc').get();
            const rows = [];
            let totalGiven = 0;
            let totalGot = 0;

            histSnap.forEach(h => {
                const hd = h.data();
                const amt = parseFloat(hd.amount) || 0;
                const isGiven = hd.type === 'GIVEN';
                if (isGiven) totalGiven += amt;
                else totalGot += amt;

                rows.push([
                    hd.date || '',
                    isGiven ? 'টাকা দিলাম (Lent)' : 'টাকা পেলাম (Received)',
                    isGiven ? `Tk ${amt.toLocaleString('en-IN')}` : '-',
                    !isGiven ? `Tk ${amt.toLocaleString('en-IN')}` : '-'
                ]);
            });

            // Header
            doc.setFontSize(18);
            doc.text("AmarHishab - কাস্টমার হিসাব খতিয়ান", 105, 15, null, null, "center");
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`গ্রাহক/ব্যক্তির নাম: ${personName} | মোবাইল: ${lData.phone || 'N/A'}`, 105, 22, null, null, "center");
            doc.text(`রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}`, 105, 27, null, null, "center");

            // Summary Box
            doc.setDrawColor(200);
            doc.setFillColor(245, 245, 245);
            doc.rect(14, 32, 182, 16, 'F');
            doc.setTextColor(0);
            doc.setFontSize(10);
            doc.text(`মোট দিলাম: Tk ${totalGiven.toLocaleString('en-IN')}`, 20, 42);
            doc.text(`মোট পেলাম: Tk ${totalGot.toLocaleString('en-IN')}`, 80, 42);
            const statusText = netBal > 0 ? `পাওনা: Tk ${Math.abs(netBal).toLocaleString('en-IN')}` : (netBal < 0 ? `দেনা: Tk ${Math.abs(netBal).toLocaleString('en-IN')}` : 'পরিশোধিত');
            doc.text(`বর্তমান হিসাব: ${statusText}`, 140, 42);

            // Table
            doc.autoTable({
                head: [['তারিখ', 'লেনদেনের বিবরণ', 'টাকা দিলাম (+)', 'টাকা পেলাম (-)']],
                body: rows,
                startY: 52,
                styles: { font: "helvetica", overflow: 'linebreak', fontSize: 9 },
                headStyles: { fillColor: [79, 70, 229] }
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text("Developed by MD.Tanvir Ahamed Siddike - fb.com/tanviras615", 105, 290, null, null, "center");
            }

            const cleanName = personName.replace(/[<>:"/\\|?*]+/g, '_');
            doc.save(`${cleanName}_Khotiyan_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
            showToast("খতিয়ান PDF ডাউনলোড সম্পন্ন হয়েছে!", "success");
        } catch (e) {
            console.error("PDF statement error:", e);
            showToast("PDF তৈরি করতে সমস্যা হয়েছে: " + e.message, "error");
        }
    };

    if (btnDebtStatementPdf) {
        btnDebtStatementPdf.addEventListener('click', () => {
            const id = document.getElementById('current-ledger-id')?.value;
            if (id) {
                generateCustomerStatementPdf(id);
            }
        });
    }

    // Add modal toggle & same-as-phone listeners
    if (toggleDebtContactBtn && debtOptionalContactInputs) {
        toggleDebtContactBtn.addEventListener('click', () => {
            debtOptionalContactInputs.classList.toggle('hidden');
            toggleDebtContactBtn.innerHTML = debtOptionalContactInputs.classList.contains('hidden') ?
                '<i class="fas fa-plus-circle"></i> তথ্য দিন' : '<i class="fas fa-minus-circle"></i> লুকান';
        });
    }

    if (tDebtSameAsPhone && tDebtPhone && tDebtWhatsapp) {
        tDebtSameAsPhone.addEventListener('change', () => {
            if (tDebtSameAsPhone.checked) {
                tDebtWhatsapp.value = tDebtPhone.value;
                tDebtWhatsapp.readOnly = true;
            } else {
                tDebtWhatsapp.readOnly = false;
            }
        });
        tDebtPhone.addEventListener('input', () => {
            if (tDebtSameAsPhone.checked) {
                tDebtWhatsapp.value = tDebtPhone.value;
            }
        });
    }

    // Upgraded WhatsApp Debt Reminder Button with Contact & bKash info
    if (btnDebtReminder) {
        btnDebtReminder.addEventListener('click', () => {
            const personName = document.getElementById('debt-person-name')?.innerText || 'গ্রাহক';
            const balEl = document.getElementById('debt-net-balance');
            const rawBalText = balEl ? balEl.innerText.replace(/[^0-9.-]/g, '') : '0';
            const bal = parseFloat(rawBalText) || 0;

            if (bal <= 0) {
                showToast("এই ব্যক্তির কাছে আপনার কোনো পাওনা নেই।", "info");
                return;
            }

            const formattedBal = bal.toLocaleString('en-IN');
            const paymentText = window.userPaymentNumber ? `\nবিকাশ/নগদ মারফত পরিশোধ করতে: ${window.userPaymentNumber}` : '';
            const msg = `আসসালামু আলাইকুম ${personName}, আমারহিসাব অ্যাপের রেকর্ড অনুযায়ী আপনার কাছে ৳${formattedBal} পাওনা রয়েছে।${paymentText}\nঅনুগ্রহ করে সুবিধাজনক সময়ে পরিশোধ করবেন। ধন্যবাদ!`;

            const targetPhone = currentActiveDebtContact ? (currentActiveDebtContact.whatsapp || currentActiveDebtContact.phone || '') : '';
            const choice = confirm(`তাগাদা মেসেজ:\n"${msg}"\n\nWhatsApp-এ পাঠাতে চান? (Cancel চাপলে SMS অ্যাপে খুলবে)`);
            if (choice) {
                sendWhatsAppNotification(targetPhone, msg);
            } else {
                sendSmsNotification(targetPhone, msg);
            }
        });
    }

    // ==========================================
    // SMART SMS PARSER (bKash / Nagad / Bank)
    // ==========================================
    if (btnParseSms && smsInputText) {
        btnParseSms.addEventListener('click', () => {
            const text = smsInputText.value.trim();
            if (!text) {
                showToast("অনুগ্রহ করে SMS টেক্সট পেস্ট করুন", "error");
                return;
            }

            let parsedAmount = null;
            let parsedType = 'expense';
            let parsedAccount = 'বিকাশ';
            let parsedName = '';

            // Detect Account
            if (/bkash/i.test(text)) {
                parsedAccount = 'বিকাশ';
            } else if (/nagad/i.test(text)) {
                parsedAccount = 'নগদ';
            } else if (/rocket/i.test(text)) {
                parsedAccount = 'রকেট';
            } else if (/bank|card|acct|a\/c|credited|debited/i.test(text)) {
                parsedAccount = 'ব্যাংক';
            }

            // Detect Amount
            const amountMatch = text.match(/(?:Tk\.?|BDT|৳)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i) || 
                               text.match(/([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:Tk|BDT|টাকা)/i);
            if (amountMatch) {
                parsedAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
            }

            // Detect Type
            if (/cash\s*in|received|credited|deposit|recharge\s*received/i.test(text)) {
                parsedType = 'income';
            } else if (/cash\s*out|send\s*money|payment|debited|purchase|fee/i.test(text)) {
                parsedType = 'expense';
            }

            // Detect Counterparty or TrxID
            const counterMatch = text.match(/(?:to|from|at)\s+([A-Za-z0-9\s._-]+?)(?=\.|\s+TrxID|\s+on|\s+at|\s+balance|$)/i);
            const trxMatch = text.match(/TrxID\s+([A-Za-z0-9]+)/i);

            if (counterMatch && counterMatch[1]) {
                parsedName = `${parsedAccount}: ${counterMatch[1].trim()}`;
            } else if (trxMatch) {
                parsedName = `${parsedAccount} Trx: ${trxMatch[1]}`;
            } else {
                parsedName = `${parsedAccount} লেনদেন`;
            }

            if (!parsedAmount || isNaN(parsedAmount)) {
                showToast("SMS থেকে টাকার পরিমাণ শনাক্ত করা যায়নি। ম্যানুয়ালি লিখুন।", "error");
                return;
            }

            if (smsParserModal) smsParserModal.classList.remove('open');
            openQuickAdd(parsedType);

            tName.value = parsedName;
            tAmount.value = parsedAmount;
            tDate.value = getLocalDateString(new Date());

            for (let i = 0; i < tAccount.options.length; i++) {
                if (tAccount.options[i].value.toLowerCase().includes(parsedAccount.toLowerCase()) ||
                    parsedAccount.toLowerCase().includes(tAccount.options[i].value.toLowerCase())) {
                    tAccount.selectedIndex = i;
                    break;
                }
            }

            smsInputText.value = '';
            showToast(`SMS থেকে ৳${parsedAmount} শনাক্ত করা হয়েছে!`, "success");
        });
    }

    // ==========================================
    // ANDROID HARDWARE BACK BUTTON & PWA POPSTATE
    // ==========================================
    const setupAndroidBackButton = () => {
        const handleBackAction = () => {
            // 1. Close any open modal first
            const openModals = document.querySelectorAll('.modal.open');
            if (openModals.length > 0) {
                openModals[openModals.length - 1].classList.remove('open');
                return true;
            }

            // 2. Return to home view if on another tab
            const homeView = views.home;
            if (homeView && !homeView.classList.contains('active')) {
                switchTab('home');
                return true;
            }

            return false;
        };

        try {
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
                window.Capacitor.Plugins.App.addListener('backButton', ({ canGoBack }) => {
                    const wasHandled = handleBackAction();
                    if (!wasHandled) {
                        window.Capacitor.Plugins.App.exitApp();
                    }
                });
            }
        } catch (e) {
            console.log("Capacitor BackButton warning:", e);
        }

        window.addEventListener('popstate', () => {
            const wasHandled = handleBackAction();
            if (wasHandled) {
                history.pushState(null, document.title, location.href);
            }
        });
        history.pushState(null, document.title, location.href);
    };

    // Auto-Run Init
    // Only initialize once
    if (!window.appInitialized) {
        window.appInitialized = true;
        try {
            console.log('Initializing App...');
            init();
        } catch (e) {
            console.error("Init Error:", e);
            alert("App Init Error: " + e.message);
        }
    }
});