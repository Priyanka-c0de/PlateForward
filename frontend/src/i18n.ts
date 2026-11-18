export type Language = 'en' | 'hi' | 'ta' | 'ml' | 'kn' | 'te';

export interface Translations {
  appName: string;
  tagline: string;
  taglineSubtitle: string;
  manageInventory: string;
  viewAnalytics: string;
  navDashboard: string;
  navSurplus: string;
  navNeeds: string;
  navMatching: string;
  navAnalytics: string;
  navReports: string;
  navDataImport: string;
  navNearbyMap: string;
  navDatabaseAdmin: string;
  
  // KPIs
  kpiTotalSurplus: string;
  kpiWasteReduced: string;
  kpiCostSavings: string;
  kpiNgoPartnerships: string;
  kpiCarbonOffset: string;
  kpiMealsProvided: string;
  kpiVsLastPeriod: string;
  kpiReductionRate: string;
  
  // Dashboard sections
  surplusInventoryTitle: string;
  surplusInventorySubtitle: string;
  activeRedistributionsTitle: string;
  activeRedistributionsSubtitle: string;
  quickActionsTitle: string;
  quickActionsSubtitle: string;
  surplusTrendTitle: string;
  surplusTrendSubtitle: string;
  categoryBreakdownTitle: string;
  categoryBreakdownSubtitle: string;
  alertHighSurplus: string;
  alertHighSurplusDesc: string;
  
  // Actions
  addSurplus: string;
  contactNgo: string;
  runSmartMatch: string;
  viewReports: string;
  impactAnalysis: string;
  importDataset: string;
  refreshData: string;
  generatingMatches: string;
  generateSuccess: string;
  approve: string;
  reject: string;
  deleteBtn: string;
  cancel: string;
  save: string;
  loading: string;
  noData: string;
  
  // Form fields
  donorName: string;
  recipientOrg: string;
  category: string;
  quantity: string;
  unit: string;
  location: string;
  deadline: string;
  priority: string;
  status: string;
  description: string;
  actions: string;
  score: string;
  explanation: string;
  
  // Statuses
  statusPending: string;
  statusApproved: string;
  statusRejected: string;
  statusUrgent: string;
  statusReady: string;
  statusInTransit: string;
  statusDelivered: string;
  statusScheduled: string;
  statusOpen: string;
  statusFulfilled: string;
  
  // User info & Auth
  userRole: string;
  signOut: string;
  signIn: string;
  register: string;
  myProfile: string;
  demoBadge: string;

  // Nearby & Maps
  useMyLocation: string;
  locatingUser: string;
  locationDetected: string;
  locationDenied: string;
  distanceRadius: string;
  kmAway: string;
  nearbyFoodTitle: string;
  nearbyFoodSubtitle: string;
  viewMap: string;
  viewList: string;

  // Admin Database
  adminTitle: string;
  adminSubtitle: string;
  totalUsersCount: string;
  exportCsv: string;
  editUser: string;
  deleteUser: string;
  deleteUserConfirm: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Urban Food Waste Intelligence",
    tagline: "Food Waste Intelligence",
    taglineSubtitle: "Reduce waste, save costs, and make a positive environmental impact with data-driven insights.",
    manageInventory: "Manage Inventory",
    viewAnalytics: "View Analytics",
    navDashboard: "Dashboard",
    navSurplus: "Surplus Food",
    navNeeds: "Recipient Needs",
    navMatching: "Smart Matching",
    navAnalytics: "Waste Analytics",
    navReports: "Reports & Import",
    navDataImport: "Data Import",
    navNearbyMap: "Nearby Food & Map",
    navDatabaseAdmin: "Database Admin",

    kpiTotalSurplus: "Total Surplus Logged",
    kpiWasteReduced: "Waste Reduced",
    kpiCostSavings: "Cost Savings",
    kpiNgoPartnerships: "NGO Partnerships",
    kpiCarbonOffset: "Carbon Footprint",
    kpiMealsProvided: "Meals Provided",
    kpiVsLastPeriod: "from last week",
    kpiReductionRate: "Waste Reduction Rate",

    surplusInventoryTitle: "Surplus Food Inventory",
    surplusInventorySubtitle: "Current surplus items ready for redistribution",
    activeRedistributionsTitle: "Active Redistributions",
    activeRedistributionsSubtitle: "Ongoing food donations to partner NGOs",
    quickActionsTitle: "Quick Actions",
    quickActionsSubtitle: "Common tasks and operations",
    surplusTrendTitle: "Surplus Trend",
    surplusTrendSubtitle: "Daily surplus logged over time",
    categoryBreakdownTitle: "Category Balance",
    categoryBreakdownSubtitle: "Comparison of surplus available vs requested recipient needs",
    alertHighSurplus: "High Surplus Alert",
    alertHighSurplusDesc: "Consider donating soon to avoid perishable spoilage.",

    addSurplus: "Add Surplus",
    contactNgo: "Add Recipient Need",
    runSmartMatch: "Run Smart Match",
    viewReports: "View Reports",
    impactAnalysis: "Impact Analysis",
    importDataset: "Import CSV/Excel",
    refreshData: "Refresh",
    generatingMatches: "Computing matches...",
    generateSuccess: "Matches generated successfully!",
    approve: "Approve",
    reject: "Reject",
    deleteBtn: "Delete",
    cancel: "Cancel",
    save: "Submit",
    loading: "Loading real-time data...",
    noData: "No records found in database.",

    donorName: "Donor / Source",
    recipientOrg: "Recipient NGO",
    category: "Category",
    quantity: "Quantity",
    unit: "Unit",
    location: "Location",
    deadline: "Deadline / Expiry",
    priority: "Priority",
    status: "Status",
    description: "Description",
    actions: "Actions",
    score: "Match Score",
    explanation: "Recommendation Reason",

    statusPending: "Pending",
    statusApproved: "Approved",
    statusRejected: "Rejected",
    statusUrgent: "Urgent",
    statusReady: "Ready",
    statusInTransit: "In Transit",
    statusDelivered: "Delivered",
    statusScheduled: "Scheduled",
    statusOpen: "Open",
    statusFulfilled: "Fulfilled",

    userRole: "Operations Lead",
    signOut: "Sign Out",
    signIn: "Sign In",
    register: "Register",
    myProfile: "My Profile",
    demoBadge: "Connected to FastAPI • SQLite live database",

    useMyLocation: "Use My Current Location",
    locatingUser: "Retrieving GPS coordinates...",
    locationDetected: "Location detected successfully",
    locationDenied: "Location permission denied. Enter location manually.",
    distanceRadius: "Search Radius",
    kmAway: "km away",
    nearbyFoodTitle: "Nearby Food Discovery & Scarcity Map",
    nearbyFoodSubtitle: "Locate proximate food donors and recipient organizations using real-time GPS coordinates",
    viewMap: "Map View",
    viewList: "List View",

    adminTitle: "Database Management & Administration",
    adminSubtitle: "Inspect live SQLite database tables, audit records, and manage registered platform accounts",
    totalUsersCount: "Total Registered Users",
    exportCsv: "Export CSV",
    editUser: "Edit User",
    deleteUser: "Delete User",
    deleteUserConfirm: "Are you sure you want to delete this user account?",
  },

  hi: {
    appName: "शहरी खाद्य अपशिष्ट इंटेलिजेंस",
    tagline: "खाद्य अपशिष्ट इंटेलिजेंस",
    taglineSubtitle: "डेटा-संचालित इनसाइट्स के साथ बर्बादी कम करें, लागत बचाएं और सकारात्मक पर्यावरणीय प्रभाव डालें।",
    manageInventory: "इन्वेंट्री प्रबंधित करें",
    viewAnalytics: "एनालिटिक्स देखें",
    navDashboard: "डैशबोर्ड",
    navSurplus: "अतिरिक्त भोजन",
    navNeeds: "प्राप्तकर्ता आवश्यकताएं",
    navMatching: "स्मार्ट मिलान",
    navAnalytics: "अपशिष्ट विश्लेषण",
    navReports: "रिपोर्ट्स और आयात",
    navDataImport: "डेटा आयात",
    navNearbyMap: "निकटवर्ती भोजन और नक्शा",
    navDatabaseAdmin: "डेटाबेस व्यवस्थापक",

    kpiTotalSurplus: "कुल अतिरिक्त भोजन",
    kpiWasteReduced: "कम किया गया अपशिष्ट",
    kpiCostSavings: "लागत बचत",
    kpiNgoPartnerships: "एनजीओ साझेदारियाँ",
    kpiCarbonOffset: "कार्बन प्रभाव में कमी",
    kpiMealsProvided: "प्रदान किया गया भोजन",
    kpiVsLastPeriod: "पिछले सप्ताह की तुलना में",
    kpiReductionRate: "अपशिष्ट में कमी दर",

    surplusInventoryTitle: "अतिरिक्त खाद्य सूची",
    surplusInventorySubtitle: "पुनर्वितरण के लिए तैयार मौजूदा अतिरिक्त खाद्य वस्तुएं",
    activeRedistributionsTitle: "सक्रिय पुनर्वितरण",
    activeRedistributionsSubtitle: "सहयोगी गैर-सरकारी संगठनों (NGO) को चल रहा खाद्य दान",
    quickActionsTitle: "त्वरित कार्रवाई",
    quickActionsSubtitle: "सामान्य कार्य और संचालन",
    surplusTrendTitle: "अतिरिक्त भोजन रुझान",
    surplusTrendSubtitle: "समय के साथ दर्ज किया गया अतिरिक्त भोजन",
    categoryBreakdownTitle: "श्रेणी संतुलन",
    categoryBreakdownSubtitle: "उपलब्ध अतिरिक्त बनाम आवश्यक भोजन की तुलना",
    alertHighSurplus: "उच्च अधिशेष चेतावनी",
    alertHighSurplusDesc: "खराब होने से बचाने के लिए जल्द से जल्द भोजन दान करें।",

    addSurplus: "अतिरिक्त भोजन जोड़ें",
    contactNgo: "नई आवश्यकता दर्ज करें",
    runSmartMatch: "स्मार्ट मिलान चलाएं",
    viewReports: "रिपोर्ट्स देखें",
    impactAnalysis: "प्रभाव विश्लेषण",
    importDataset: "CSV/Excel आयात करें",
    refreshData: "ताज़ा करें",
    generatingMatches: "मिलान की गणना हो रही है...",
    generateSuccess: "मिलान सफलतापूर्वक तैयार किए गए!",
    approve: "स्वीकृत करें",
    reject: "अस्वीकार करें",
    deleteBtn: "हटाएं",
    cancel: "रद्द करें",
    save: "जमा करें",
    loading: "वास्तविक समय डेटा लोड हो रहा है...",
    noData: "डेटाबेस में कोई रिकॉर्ड नहीं मिला।",

    donorName: "दाता / स्रोत",
    recipientOrg: "प्राप्तकर्ता एनजीओ",
    category: "श्रेणी",
    quantity: "मात्रा",
    unit: "इकाई",
    location: "स्थान",
    deadline: "संग्रह समय सीमा",
    priority: "प्राथमिकता",
    status: "स्थिति",
    description: "विवरण",
    actions: "कार्रवाई",
    score: "मिलान स्कोर",
    explanation: "सिफारिश का कारण",

    statusPending: "लंबित",
    statusApproved: "स्वीकृत",
    statusRejected: "अस्वीकृत",
    statusUrgent: "अत्यावश्यक",
    statusReady: "तैयार",
    statusInTransit: "मार्ग में",
    statusDelivered: "वितरित",
    statusScheduled: "निर्धारित",
    statusOpen: "खुला",
    statusFulfilled: "पूर्ण",

    userRole: "परिचालन प्रमुख",
    signOut: "साइन आउट",
    signIn: "साइन इन",
    register: "पंजीकरण करें",
    myProfile: "मेरी प्रोफ़ाइल",
    demoBadge: "FastAPI • SQLite लाइव डेटाबेस से जुड़ा है",

    useMyLocation: "मेरे वर्तमान स्थान का उपयोग करें",
    locatingUser: "जीपीएस स्थान प्राप्त किया जा रहा है...",
    locationDetected: "स्थान सफलतापूर्वक प्राप्त हुआ",
    locationDenied: "स्थान की अनुमति अस्वीकृत। मैन्युअल रूप से दर्ज करें।",
    distanceRadius: "खोज दायरा",
    kmAway: "किमी दूर",
    nearbyFoodTitle: "निकटवर्ती भोजन और अभाव नक्शा",
    nearbyFoodSubtitle: "वास्तविक समय जीपीएस निर्देशांकों का उपयोग करके नजदीकी भोजन दाताओं और एनजीओ का पता लगाएं",
    viewMap: "नक्शा दृश्य",
    viewList: "सूची दृश्य",

    adminTitle: "डेटाबेस प्रबंधन और प्रशासन",
    adminSubtitle: "लाइव SQLite डेटाबेस तालिकाओं का निरीक्षण करें और पंजीकृत खातों का प्रबंधन करें",
    totalUsersCount: "कुल पंजीकृत उपयोगकर्ता",
    exportCsv: "CSV निर्यात करें",
    editUser: "संपादित करें",
    deleteUser: "हटाएं",
    deleteUserConfirm: "क्या आप वाकई इस उपयोगकर्ता खाते को हटाना चाहते हैं?",
  },

  ta: {
    appName: "நகர்ப்புற உணவு வீணடிப்பு நுண்ணறிவு",
    tagline: "உணவு வீணடிப்பு நுண்ணறிவு",
    taglineSubtitle: "தரவு அடிப்படையிலான நுண்ணறிவுகளுடன் வீணாவதைத் தடுக்கவும், செலவைச் சேமிக்கவும், சுற்றுசூழலைப் பாதுகாக்கவும்.",
    manageInventory: "சரக்குகளை நிர்வகிக்கவும்",
    viewAnalytics: "பகுப்பாய்வைக் காண்க",
    navDashboard: "முகப்பலகை",
    navSurplus: "கூடுதல் உணவு",
    navNeeds: "தேவைப்படும் அமைப்புகள்",
    navMatching: "திறன்மிகு பொருத்தம்",
    navAnalytics: "கழிவு பகுப்பாய்வு",
    navReports: "அறிக்கைகள் & இறக்குமதி",
    navDataImport: "தரவு இறக்குமதி",
    navNearbyMap: "அருகிலுள்ள உணவு & வரைபடம்",
    navDatabaseAdmin: "தரவுத்தள நிர்வாகம்",

    kpiTotalSurplus: "பதிவு செய்யப்பட்ட உபரி உணவு",
    kpiWasteReduced: "தவிர்க்கப்பட்ட கழிவு",
    kpiCostSavings: "செலவு சேமிப்பு",
    kpiNgoPartnerships: "தன்னார்வ தொண்டு நிறுவனங்கள்",
    kpiCarbonOffset: "கார்பன் குறைப்பு",
    kpiMealsProvided: "வழங்கப்பட்ட உணவுகள்",
    kpiVsLastPeriod: "கடந்த வாரத்தை விட",
    kpiReductionRate: "கழிவு குறைப்பு விகிதம்",

    surplusInventoryTitle: "உபரி உணவு சரக்கு விவரம்",
    surplusInventorySubtitle: "மறுபகிர்வுக்குத் தயாராக உள்ள தற்போதைய உபரி உணவுப் பொருட்கள்",
    activeRedistributionsTitle: "செயலில் உள்ள உணவு பகிர்வு",
    activeRedistributionsSubtitle: "தன்னார்வ அமைப்புகளுக்கு வழங்கப்பட்டு வரும் உணவுகள்",
    quickActionsTitle: "விரைவுச் செயல்பாடுகள்",
    quickActionsSubtitle: "முக்கிய செயல்பாடுகள்",
    surplusTrendTitle: "உபரி உணவுப் போக்கு",
    surplusTrendSubtitle: "காலப்போக்கில் பதிவு செய்யப்பட்ட உபரி உணவின் அளவு",
    categoryBreakdownTitle: "பிரிவு வாரியான ஒப்பீடு",
    categoryBreakdownSubtitle: "உபரி உணவு மற்றும் தேவைகளின் ஒப்பீட்டு சமநிலை",
    alertHighSurplus: "உயர் உபரி எச்சரிக்கை",
    alertHighSurplusDesc: "உணவு கெட்டுப்போவதைத் தவிர்க்க உடனடியாக பகிரவும்.",

    addSurplus: "உபரி உணவைச் சேர்",
    contactNgo: "தேவையைச் சேர்",
    runSmartMatch: "பொருத்தத்தை இயக்கு",
    viewReports: "அறிக்கைகளைக் காண்க",
    impactAnalysis: "தாக்க பகுப்பாய்வு",
    importDataset: "கோப்பை இறக்குமதி செய்",
    refreshData: "புதுப்பி",
    generatingMatches: "பொருத்தங்கள் கணக்கிடப்படுகின்றன...",
    generateSuccess: "பொருத்தங்கள் வெற்றிகரமாக உருவாக்கப்பட்டன!",
    approve: "ஒப்புதல் அளி",
    reject: "நிராகரி",
    deleteBtn: "நீக்கு",
    cancel: "ரத்து செய்",
    save: "சமர்ப்பி",
    loading: "தரவு ஏற்றப்படுகிறது...",
    noData: "தரவுத்தளத்தில் பதிவுகள் எதுவும் இல்லை.",

    donorName: "வழங்குநர் / மூல அமைப்பு",
    recipientOrg: "பெறும் தன்னார்வ அமைப்பு",
    category: "வகை",
    quantity: "அளவு",
    unit: "அலகு",
    location: "இடம்",
    deadline: "சேகரிக்கும் காலக்கெடு",
    priority: "முன்னுரிமை",
    status: "நிலை",
    description: "விளக்கம்",
    actions: "செயல்கள்",
    score: "பொருத்த மதிப்பெண்",
    explanation: "பரிந்துரைக்கான காரணம்",

    statusPending: "நிலுவையில்",
    statusApproved: "ஒப்புதல் அளிக்கப்பட்டது",
    statusRejected: "நிராகரிக்கப்பட்டது",
    statusUrgent: "அவசரம்",
    statusReady: "தயார்",
    statusInTransit: "வழியில் உள்ளது",
    statusDelivered: "வழங்கப்பட்டது",
    statusScheduled: "திட்டமிடப்பட்டது",
    statusOpen: "திறந்துள்ளது",
    statusFulfilled: "நிறைவேற்றப்பட்டது",

    userRole: "செயல்பாட்டுத் தலைவர்",
    signOut: "வெளியேறு",
    signIn: "உள்நுழை",
    register: "பதிவு செய்",
    myProfile: "என் சுயவிவரம்",
    demoBadge: "FastAPI • SQLite நேரடி தரவுத்தளத்துடன் இணைக்கப்பட்டுள்ளது",

    useMyLocation: "எனது தற்போதைய இடத்தைப் பயன்படுத்து",
    locatingUser: "GPS இடம் பெறப்படுகிறது...",
    locationDetected: "இருப்பிடம் வெற்றிகரமாக கண்டறியப்பட்டது",
    locationDenied: "இருப்பிட அனுமதி மறுக்கப்பட்டது. கைமுறையாக உள்ளிடவும்.",
    distanceRadius: "தேடல் ஆரம்",
    kmAway: "கி.மீ தொலைவில்",
    nearbyFoodTitle: "அருகிலுள்ள உணவு தேடல் & வரைபடம்",
    nearbyFoodSubtitle: "ஜிபிஎஸ் பயன்படுத்தி அருகிலுள்ள உணவு வழங்குநர்கள் மற்றும் தொண்டு நிறுவனங்களைக் கண்டறியவும்",
    viewMap: "வரைபடக் காட்சி",
    viewList: "பட்டியல் காட்சி",

    adminTitle: "தரவுத்தள மேலாண்மை & நிர்வாகம்",
    adminSubtitle: "SQLite தரவுத்தள அட்டவணைகளை ஆய்வு செய்து பதிவு செய்யப்பட்ட கணக்குகளை நிர்வகிக்கவும்",
    totalUsersCount: "மொத்த பதிவு செய்த பயனர்கள்",
    exportCsv: "CSV ஏற்றுமதி",
    editUser: "திருத்து",
    deleteUser: "நீக்கு",
    deleteUserConfirm: "இந்த பயனரை நிச்சயம் நீக்க விரும்புகிறீர்களா?",
  },

  ml: {
    appName: "നഗര ഭക്ഷ്യ പാഴ് വസ്തു ഇന്റലിജൻസ്",
    tagline: "ഭക്ഷ്യ പാഴ് വസ്തു ഇന്റലിജൻസ്",
    taglineSubtitle: "ഡാറ്റ അടിസ്ഥാനമാക്കിയുള്ള വിവരങ്ങളിലൂടെ പാഴാക്കൽ കുറയ്ക്കുകയും ചെലവ് ലാഭിക്കുകയും ചെയ്യുക.",
    manageInventory: "ഇൻവെന്ററി നിയന്ത്രിക്കുക",
    viewAnalytics: "വിശകലനം കാണുക",
    navDashboard: "ഡാഷ്‌ബോർഡ്",
    navSurplus: "മിച്ചഭക്ഷണം",
    navNeeds: "സ്വീകർത്താക്കളുടെ ആവശ്യങ്ങൾ",
    navMatching: "സ്മാർട്ട് പൊരുത്തപ്പെടുത്തൽ",
    navAnalytics: "മാലിന്യ വിശകലനം",
    navReports: "റിപ്പോർട്ടുകൾ & ഇറക്കുമതി",
    navDataImport: "ഡാറ്റ ഇറക്കുമതി",
    navNearbyMap: "സമീപത്തെ ഭക്ഷണം & മാപ്പ്",
    navDatabaseAdmin: "ഡാറ്റാബേസ് അഡ്മിൻ",

    kpiTotalSurplus: "ആകെ മിച്ചഭക്ഷണം",
    kpiWasteReduced: "കുറച്ച മാലിന്യം",
    kpiCostSavings: "ചെലവ് ലാഭം",
    kpiNgoPartnerships: "എൻ‌ജി‌ഒ പങ്കാളിത്തങ്ങൾ",
    kpiCarbonOffset: "കാർബൺ കുറയ്ക്കൽ",
    kpiMealsProvided: "നൽകിയ ഭക്ഷണങ്ങൾ",
    kpiVsLastPeriod: "കഴിഞ്ഞ ആഴ്ചയെ അപേക്ഷിച്ച്",
    kpiReductionRate: "മാലിന്യ കുറയ്ക്കൽ നിരക്ക്",

    surplusInventoryTitle: "മിച്ചഭക്ഷണ ലിസ്റ്റ്",
    surplusInventorySubtitle: "വിതരണത്തിന് തയ്യാറായ നിലവിലെ മിച്ച ഭക്ഷണ ഇനങ്ങൾ",
    activeRedistributionsTitle: "സജീവ പുനർവിതരണങ്ങൾ",
    activeRedistributionsSubtitle: "എൻ‌ജി‌ഒകൾക്ക് നൽകുന്ന ഭക്ഷണ സംഭാവനകൾ",
    quickActionsTitle: "ദ്രുത പ്രവർത്തനങ്ങൾ",
    quickActionsSubtitle: "പ്രധാന പ്രവർത്തനങ്ങൾ",
    surplusTrendTitle: "മിച്ചഭക്ഷണ ട്രെൻഡ്",
    surplusTrendSubtitle: "കാലക്രമേണ രേഖപ്പെടുത്തിയ മിച്ചഭക്ഷണം",
    categoryBreakdownTitle: "വിഭാഗ വിശകലനം",
    categoryBreakdownSubtitle: "ലഭ്യമായ മിച്ചവും ആവശ്യങ്ങളും തമ്മിലുള്ള താരതമ്യം",
    alertHighSurplus: "ഉയർന്ന മിച്ച മുന്നറിയിപ്പ്",
    alertHighSurplusDesc: "ഭക്ഷണം കേടാകാതിരിക്കാൻ ഉടൻ തന്നെ സംഭാവന ചെയ്യുക.",

    addSurplus: "മിച്ചഭക്ഷണം ചേർക്കുക",
    contactNgo: "ആവശ്യം ചേർക്കുക",
    runSmartMatch: "സ്മാർട്ട് മാച്ച് നടത്തുക",
    viewReports: "റിപ്പോർട്ടുകൾ കാണുക",
    impactAnalysis: "സ്വാധീന വിശകലനം",
    importDataset: "CSV/Excel ഇറക്കുമതി ചെയ്യുക",
    refreshData: "പുതുക്കുക",
    generatingMatches: "പൊരുത്തങ്ങൾ കണ്ടെത്തുന്നു...",
    generateSuccess: "പൊരുത്തങ്ങൾ വിജയകരമായി സൃഷ്ടിച്ചു!",
    approve: "അംഗീകരിക്കുക",
    reject: "നിരസിക്കുക",
    deleteBtn: "നീക്കം ചെയ്യുക",
    cancel: "റദ്ദാക്കുക",
    save: "സമർപ്പിക്കുക",
    loading: "ഡാറ്റ ലോഡുചെയ്യുന്നു...",
    noData: "ഡാറ്റാബേസിൽ വിവരങ്ങളൊന്നും കണ്ടെത്തിയില്ല.",

    donorName: "ദാതാവ് / ഉറവിടം",
    recipientOrg: "സ്വീകർത്താവ് എൻ‌ജി‌ഒ",
    category: "വിഭാഗം",
    quantity: "അളവ്",
    unit: "യൂണിറ്റ്",
    location: "സ്ഥലം",
    deadline: "ശേഖരണ സമയപരിധി",
    priority: "മുൻഗണന",
    status: "നില",
    description: "വിവരണം",
    actions: "നടപടികൾ",
    score: "പൊരുത്ത സ്കോർ",
    explanation: "ശുപാർശ കാരണം",

    statusPending: "തീർച്ചപ്പെടുത്തിയിട്ടില്ല",
    statusApproved: "അംഗീകരിച്ചു",
    statusRejected: "നിരസിച്ചു",
    statusUrgent: "അടിയന്തിരം",
    statusReady: "തയ്യാറാണ്",
    statusInTransit: "വഴിയിലാണ്",
    statusDelivered: "വിതരണം ചെയ്തു",
    statusScheduled: "ഷെഡ്യൂൾ ചെയ്തു",
    statusOpen: "തുറന്നത്",
    statusFulfilled: "പൂർത്തിയായി",

    userRole: "ഓപ്പറേഷൻസ് ലീഡ്",
    signOut: "പുറത്തുകടക്കുക",
    signIn: "ലോഗിൻ ചെയ്യുക",
    register: "രജിസ്റ്റർ ചെയ്യുക",
    myProfile: "എന്റെ പ്രൊഫൈൽ",
    demoBadge: "FastAPI • SQLite ലൈവ് ഡാറ്റാബേസുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു",

    useMyLocation: "എന്റെ നിലവിലെ സ്ഥാനം ഉപയോഗിക്കുക",
    locatingUser: "ജിപിഎസ് സ്ഥാനം കണ്ടെത്തുന്നു...",
    locationDetected: "സ്ഥാനം വിജയകരമായി കണ്ടെത്തി",
    locationDenied: "ലൊക്കേഷൻ അനുമതി നിരസിച്ചു. സ്വമേധയാ നൽകുക.",
    distanceRadius: "തിരയൽ പരിധി",
    kmAway: "കി.മീ അകലെ",
    nearbyFoodTitle: "സമീപത്തെ ഭക്ഷണം & മാപ്പ്",
    nearbyFoodSubtitle: "ജിപിഎസ് ഉപയോഗിച്ച് അടുത്തുള്ള ഭക്ഷണ ദാതാക്കളെയും എൻജിഒകളെയും കണ്ടെത്തുക",
    viewMap: "മാപ്പ് കാഴ്‌ച",
    viewList: "ലിസ്റ്റ് കാഴ്‌ച",

    adminTitle: "ഡാറ്റാബേസ് മാനേജ്മെന്റും ഭരണവും",
    adminSubtitle: "ലൈവ് SQLite ഡാറ്റാബേസ് പട്ടികകൾ പരിശോധിച്ച് രജിസ്റ്റർ ചെയ്ത അക്കൗണ്ടുകൾ കൈകാര്യം ചെയ്യുക",
    totalUsersCount: "ആകെ രജിസ്റ്റർ ചെയ്ത ഉപയോക്താക്കൾ",
    exportCsv: "CSV എക്സ്പോർട്ട്",
    editUser: "മാറ്റം വരുത്തുക",
    deleteUser: "ഡിലീറ്റ് ചെയ്യുക",
    deleteUserConfirm: "ഈ അക്കൗണ്ട് തീർച്ചയായും ഇല്ലാതാക്കണോ?",
  },

  kn: {
    appName: "ನಗರ ಆಹಾರ ತ್ಯಾಜ್ಯ ಬುದ್ಧಿಮತ್ತೆ",
    tagline: "ಆಹಾರ ತ್ಯಾಜ್ಯ ಬುದ್ಧಿಮತ್ತೆ",
    taglineSubtitle: "ಡೇಟಾ-ಚಾಲಿತ ಒಳನೋಟಗಳೊಂದಿಗೆ ವ್ಯರ್ಥವನ್ನು ಕಡಿಮೆ ಮಾಡಿ, ವೆಚ್ಚವನ್ನು ಉಳಿಸಿ ಮತ್ತು ಪರಿಸರವನ್ನು ಸಂರಕ್ಷಿಸಿ.",
    manageInventory: "ದಾಸ್ತಾನು ನಿರ್ವಹಿಸಿ",
    viewAnalytics: "ವಿಶ್ಲೇಷಣೆ ವೀಕ್ಷಿಸಿ",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navSurplus: "ಹೆಚ್ಚುವರಿ ಆಹಾರ",
    navNeeds: "ಸ್ವೀಕರಿಸುವವರ ಅಗತ್ಯಗಳು",
    navMatching: "ಸ್ಮಾರ್ಟ್ ಹೊಂದಾಣಿಕೆ",
    navAnalytics: "ತ್ಯಾಜ್ಯ ವಿಶ್ಲೇಷಣೆ",
    navReports: "ವರದಿಗಳು ಮತ್ತು ಆಮದು",
    navDataImport: "ಡೇಟಾ ಆಮದು",
    navNearbyMap: "ಹತ್ತಿರದ ಆಹಾರ ಮತ್ತು ನಕ್ಷೆ",
    navDatabaseAdmin: "ಡೇಟಾಬೇಸ್ ಅಡ್ಮಿನ್",

    kpiTotalSurplus: "ಒಟ್ಟು ಹೆಚ್ಚುವರಿ ಆಹಾರ",
    kpiWasteReduced: "ಕಡಿಮೆಗೊಳಿಸಿದ ತ್ಯಾಜ್ಯ",
    kpiCostSavings: "ವೆಚ್ಚ ಉಳಿತಾಯ",
    kpiNgoPartnerships: "ಎನ್‌ಜಿಒ ಪಾಲುದಾರಿಕೆಗಳು",
    kpiCarbonOffset: "ಕಾರ್ಬನ್ ತಗ್ಗಿಸುವಿಕೆ",
    kpiMealsProvided: "ಒದಗಿಸಲಾದ ಊಟಗಳು",
    kpiVsLastPeriod: "ಕಳೆದ ವಾರಕ್ಕಿಂತ",
    kpiReductionRate: "ತ್ಯಾಜ್ಯ ಕಡಿತ ದರ",

    surplusInventoryTitle: "ಹೆಚ್ಚುವರಿ ಆಹಾರ ದಾಸ್ತಾನು",
    surplusInventorySubtitle: "ಮರುಹಂಚಿಕೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಪ್ರಸ್ತುತ ಹೆಚ್ಚುವರಿ ಆಹಾರ ಪದಾರ್ಥಗಳು",
    activeRedistributionsTitle: "ಸಕ್ರಿಯ ಪುನರ್ವಿತರಣೆಗಳು",
    activeRedistributionsSubtitle: "ಪಾಲುದಾರ ಎನ್‌ಜಿಒಗಳಿಗೆ ನಡೆಯುತ್ತಿರುವ ಆಹಾರ ದೇಣಿಗೆಗಳು",
    quickActionsTitle: "ತ್ವರಿತ ಕ್ರಮಗಳು",
    quickActionsSubtitle: "ಸಾಮಾನ್ಯ ಕಾರ್ಯಾಚರಣೆಗಳು",
    surplusTrendTitle: "ಹೆಚ್ಚುವರಿ ಆಹಾರ ಪ್ರವೃತ್ತಿ",
    surplusTrendSubtitle: "ದೈನಂದಿನ ಹೆಚ್ಚುವರಿ ಆಹಾರದ ವಿವರ",
    categoryBreakdownTitle: "ವರ್ಗ ಸಮತೋಲನ",
    categoryBreakdownSubtitle: "ಲಭ್ಯವಿರುವ ಹೆಚ್ಚುವರಿ ಮತ್ತು ಅಗತ್ಯಗಳ ಹೋಲಿಕೆ",
    alertHighSurplus: "ಹೆಚ್ಚಿನ ಹೆಚ್ಚುವರಿ ಎಚ್ಚರಿಕೆ",
    alertHighSurplusDesc: "ಹಾಳಾಗುವುದನ್ನು ತಪ್ಪಿಸಲು ಶೀಘ್ರದಲ್ಲೇ ಆಹಾರವನ್ನು ದಾನ ಮಾಡಿ.",

    addSurplus: "ಹೆಚ್ಚುವರಿ ಆಹಾರ ಸೇರಿಸಿ",
    contactNgo: "ಅಗತ್ಯತೆಯನ್ನು ಸೇರಿಸಿ",
    runSmartMatch: "ಹೊಂದಾಣಿಕೆ ನಡೆಸಿ",
    viewReports: "ವರದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    impactAnalysis: "ಪರಿಣಾಮ ವಿಶ್ಲೇಷಣೆ",
    importDataset: "CSV/Excel ಆಮದು ಮಾಡಿ",
    refreshData: "ನವೀಕರಿಸಿ",
    generatingMatches: "ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...",
    generateSuccess: "ಹೊಂದಾಣಿಕೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲ್ಪಟ್ಟಿವೆ!",
    approve: "ಅನುಮೋದಿಸಿ",
    reject: "ತಿರಸ್ಕರಿಸಿ",
    deleteBtn: "ಅಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    save: "ಸಲ್ಲಿಸಿ",
    loading: "ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    noData: "ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

    donorName: "ದಾನಿ / ಮೂಲ",
    recipientOrg: "ಸ್ವೀಕರಿಸುವ ಎನ್‌ಜಿಒ",
    category: "ವರ್ಗ",
    quantity: "ಪ್ರಮಾಣ",
    unit: "ಘಟಕ",
    location: "ಸ್ಥಳ",
    deadline: "ಸಂಗ್ರಹಣಾ ಗಡುವು",
    priority: "ಆದ್ಯತೆ",
    status: "ಸ್ಥಿತಿ",
    description: "ವಿವರಣೆ",
    actions: "ಕ್ರಮಗಳು",
    score: "ಹೊಂದಾಣಿಕೆ ಅಂಕ",
    explanation: "ಶಿಫಾರಸು ಕಾರಣ",

    statusPending: "ಬಾಕಿ ಇದೆ",
    statusApproved: "ಅನುಮೋದಿಸಲಾಗಿದೆ",
    statusRejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
    statusUrgent: "ತುರ್ತು",
    statusReady: "ಸಿದ್ಧವಾಗಿದೆ",
    statusInTransit: "ಮಾರ್ಗದಲ್ಲಿದೆ",
    statusDelivered: "ತಲುಪಿಸಲಾಗಿದೆ",
    statusScheduled: "ನಿಗದಿಪಡಿಸಲಾಗಿದೆ",
    statusOpen: "ತೆರೆದಿದೆ",
    statusFulfilled: "ಪೂರ್ಣಗೊಂಡಿದೆ",

    userRole: "ಕಾರ್ಯಾಚರಣೆಗಳ ಮುಖ್ಯಸ್ಥ",
    signOut: "ಸೈನ್ ಔಟ್",
    signIn: "ಸೈನ್ ಇನ್",
    register: "ನೋಂದಣಿ ಮಾಡಿ",
    myProfile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    demoBadge: "FastAPI • SQLite ಲೈವ್ ಡೇಟಾಬೇಸ್‌ನೊಂದಿಗೆ ಸಂಪರ್ಕಗೊಂಡಿದೆ",

    useMyLocation: "ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಬಳಸಿ",
    locatingUser: "ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    locationDetected: "ಸ್ಥಳವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ",
    locationDenied: "ಸ್ಥಳದ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ.",
    distanceRadius: "ಹುಡುಕಾಟದ ತ್ರಿಜ್ಯ",
    kmAway: "ಕಿಮೀ ದೂರದಲ್ಲಿದೆ",
    nearbyFoodTitle: "ಹತ್ತಿರದ ಆಹಾರ ಮತ್ತು ನಕ್ಷೆ",
    nearbyFoodSubtitle: "ಜಿಪಿಎಸ್ ಬಳಸಿ ಸಮೀಪದ ಆಹಾರ ದಾನಿಗಳು ಮತ್ತು ಎನ್‌ಜಿಒಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ",
    viewMap: "ನಕ್ಷೆ ನೋಟ",
    viewList: "ಪಟ್ಟಿ ನೋಟ",

    adminTitle: "ಡೇಟಾಬೇಸ್ ನಿರ್ವಹಣೆ ಮತ್ತು ಆಡಳಿತ",
    adminSubtitle: "ಲೈವ್ SQLite ಕೋಷ್ಟಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನೋಂದಾಯಿತ ಖಾತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    totalUsersCount: "ಒಟ್ಟು ನೋಂದಾಯಿತ ಬಳಕೆದಾರರು",
    exportCsv: "CSV ರಫ್ತು",
    editUser: "ತಿದ್ದುಪಡಿ",
    deleteUser: "ಅಳಿಸಿ",
    deleteUserConfirm: "ನೀವು ಖಚಿತವಾಗಿ ಈ ಖಾತೆಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?",
  },

  te: {
    appName: "పట్టణ ఆహార వ్యర్థాల ఇంటెలిజెన్స్",
    tagline: "ఆహార వ్యర్థాల ఇంటెలిజెన్స్",
    taglineSubtitle: "డేటా ఆధారిత అంతర్దృష్టులతో ఆహార వృధాను తగ్గించండి, ఖర్చులను ఆదా చేయండి మరియు పర్యావరణాన్ని పరిరక్షించండి.",
    manageInventory: "ఇన్వెంటరీని నిర్వహించండి",
    viewAnalytics: "విశ్లేషణను చూడండి",
    navDashboard: "డాష్‌బోర్డ్",
    navSurplus: "మిగులు ఆహారం",
    navNeeds: "స్వీకర్తల అవసరాలు",
    navMatching: "స్మార్ట్ మ్యాచ్",
    navAnalytics: "వ్యర్థాల విశ్లేషణ",
    navReports: "నివేదికలు & దిగుమతి",
    navDataImport: "డేటా దిగుమతి",
    navNearbyMap: "సమీప ఆహారం & మ్యాప్",
    navDatabaseAdmin: "డేటాబేస్ అడ్మిన్",

    kpiTotalSurplus: "మొత్తం మిగులు ఆహారం",
    kpiWasteReduced: "తగ్గించిన వ్యర్థాలు",
    kpiCostSavings: "ఖర్చు ఆదా",
    kpiNgoPartnerships: "ఎన్జీవో భాగస్వామ్యాలు",
    kpiCarbonOffset: "కార్బన్ తగ్గింపు",
    kpiMealsProvided: "అందించిన భోజనాలు",
    kpiVsLastPeriod: "గత వారంతో పోలిస్తే",
    kpiReductionRate: "వ్యర్థాల తగ్గింపు రేటు",

    surplusInventoryTitle: "మిగులు ఆహార నిల్వలు",
    surplusInventorySubtitle: "పునర్విభజనకు సిద్ధంగా ఉన్న ప్రస్తుత మిగులు ఆహార పదార్థాలు",
    activeRedistributionsTitle: "క్రియాశీల పునర్విభజనలు",
    activeRedistributionsSubtitle: "భాగస్వామ్య ఎన్జీవోలకు కొనసాగుతున్న ఆహార విరాళాలు",
    quickActionsTitle: "శీఘ్ర చర్యలు",
    quickActionsSubtitle: "సాధారణ కార్యకలాపాలు",
    surplusTrendTitle: "మిగులు ఆహార ధోరణి",
    surplusTrendSubtitle: "రోజువారీ నమోదైన మిగులు ఆహారం",
    categoryBreakdownTitle: "వర్గ సమతుల్యత",
    categoryBreakdownSubtitle: "అందుబాటులో ఉన్న మిగులు మరియు అవసరాల పోలిక",
    alertHighSurplus: "అధిక మిగులు హెచ్చరిక",
    alertHighSurplusDesc: "ఆహారం పాడవకుండా ఉండటానికి త్వరలోనే విరాళం ఇవ్వండి.",

    addSurplus: "మిగులు ఆహారాన్ని జోడించండి",
    contactNgo: "అవసరాన్ని జోడించండి",
    runSmartMatch: "మ్యాచ్ ప్రారంభించండి",
    viewReports: "నివేదికలను చూడండి",
    impactAnalysis: "ప్రభావ విశ్లేషణ",
    importDataset: "CSV/Excel దిగుమతి చేయండి",
    refreshData: "రిఫ్రెష్ చేయండి",
    generatingMatches: "మ్యాచ్‌లను గణిస్తోంది...",
    generateSuccess: "మ్యాచ్‌లు విజయవంతంగా రూపొందించబడ్డాయి!",
    approve: "ఆమోదించండి",
    reject: "తిరస్కరించండి",
    deleteBtn: "తొలగించండి",
    cancel: "రద్దు చేయండి",
    save: "సమర్పించండి",
    loading: "డేటా లోడ్ అవుతోంది...",
    noData: "డేటాబేస్‌లో రికార్డులు కనుగొనబడలేదు.",

    donorName: "దాత / మూలం",
    recipientOrg: "స్వీకరించే ఎన్జీవో",
    category: "వర్గం",
    quantity: "పరిమాణం",
    unit: "యూనిట్",
    location: "ప్రదేశం",
    deadline: "సేకరణ గడువు",
    priority: "ప్రాధాన్యత",
    status: "స్థితి",
    description: "వివరాలు",
    actions: "చర్యలు",
    score: "మ్యాచ్ స్కోరు",
    explanation: "సిఫార్సు కారణం",

    statusPending: "పెండింగ్‌లో ఉంది",
    statusApproved: "ఆమోదించబడింది",
    statusRejected: "తిరస్కరించబడింది",
    statusUrgent: "అత్యవసరం",
    statusReady: "సిద్ధంగా ఉంది",
    statusInTransit: "దారిలో ఉంది",
    statusDelivered: "పంపిణీ చేయబడింది",
    statusScheduled: "షెడ్యూల్ చేయబడింది",
    statusOpen: "ఓపెన్",
    statusFulfilled: "పూర్తయింది",

    userRole: "ఆపరేషన్స్ లీడ్",
    signOut: "సైన్ అవుట్",
    signIn: "సైన్ ఇన్",
    register: "నమోదు చేసుకోండి",
    myProfile: "నా ప్రొఫైల్",
    demoBadge: "FastAPI • SQLite లైవ్ డేటాబేస్‌కు అనుసంధానించబడింది",

    useMyLocation: "నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి",
    locatingUser: "జీపీఎస్ లొకేషన్ గుర్తిస్తోంది...",
    locationDetected: "స్థానం విజయవంతంగా గుర్తించబడింది",
    locationDenied: "లొకేషన్ అనుమతి నిరాకరించబడింది. మాన్యువల్‌గా నమోదు చేయండి.",
    distanceRadius: "శోధన వ్యాసార్థం",
    kmAway: "కి.మీ దూరంలో",
    nearbyFoodTitle: "సమీప ఆహారం & మ్యాప్",
    nearbyFoodSubtitle: "జీపీఎస్ ఉపయోగించి సమీప ఆహార దాతలు మరియు ఎన్జీవోలను కనుగొనండి",
    viewMap: "మ్యాప్ వీక్షణ",
    viewList: "జాబితా వీక్షణ",

    adminTitle: "డేటాబేస్ నిర్వహణ & పరిపాలన",
    adminSubtitle: "లైవ్ SQLite డేటాబేస్ పట్టికలను పరిశీలించండి మరియు వినియోగదారులను నిర్వహించండి",
    totalUsersCount: "మొత్తం నమోదైన వినియోగదారులు",
    exportCsv: "CSV ఎగుమతి",
    editUser: "సవరించండి",
    deleteUser: "తొలగించండి",
    deleteUserConfirm: "మీరు ఖచ్చితంగా ఈ ఖాతాను తొలగించాలనుకుంటున్నారా?",
  },
};
