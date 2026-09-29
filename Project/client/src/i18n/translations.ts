export type LanguageKey = 'en' | 'hi' | 'mr' | 'te' | 'ta';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    diagnose: string;
    farms: string;
    market: string;
    soilHealth: string;
    records: string;
    agronomistPortal: string;
    adminPortal: string;
    login: string;
    register: string;
    logout: string;
    roleFarmer: string;
    roleAgronomist: string;
    roleAdmin: string;
  };
  diagnose: {
    title: string;
    subtitle: string;
    uploadOrDrop: string;
    selectSample: string;
    takePhoto: string;
    cropType: string;
    cropStage: string;
    selectFarm: string;
    recentSpray: string;
    affectedArea: string;
    analyzeBtn: string;
    analyzing: string;
    resultTitle: string;
    confidence: string;
    severity: string;
    pathogen: string;
    symptoms: string;
    organicTab: string;
    chemicalTab: string;
    preventionTab: string;
    agronomistReview: string;
    weatherAdvisory: string;
    offlineSaved: string;
  };
  market: {
    title: string;
    subtitle: string;
    searchCommodity: string;
    filterState: string;
    filterDistrict: string;
    commodity: string;
    marketName: string;
    modalPrice: string;
    minMax: string;
    trend: string;
    date: string;
  };
  soil: {
    title: string;
    subtitle: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    ph: string;
    ec: string;
    cropTarget: string;
    farmAcreage: string;
    calculateBtn: string;
    calculating: string;
    recommendationTitle: string;
  };
  common: {
    save: string;
    cancel: string;
    downloadPdf: string;
    print: string;
    offlineMode: string;
    onlineMode: string;
    queuedCount: string;
    syncNow: string;
  };
}

export const translations: Record<LanguageKey, TranslationDictionary> = {
  en: {
    appName: 'AgriVision AI',
    tagline: 'AI-Powered Agriculture Crop Advisory Assistant',
    nav: {
      dashboard: 'Dashboard',
      diagnose: 'Crop Scanner',
      farms: 'My Farms',
      market: 'Mandi Rates',
      soilHealth: 'Soil Health',
      records: 'Diagnosis History',
      agronomistPortal: 'Agronomist Portal',
      adminPortal: 'Admin Command',
      login: 'Sign In',
      register: 'Join Platform',
      logout: 'Sign Out',
      roleFarmer: 'Farmer',
      roleAgronomist: 'Agronomist',
      roleAdmin: 'Administrator'
    },
    diagnose: {
      title: 'Multimodal Crop Diagnostic Scanner',
      subtitle: 'Upload or snap an infected leaf photo to receive real-time biological pathogen identification and weather-adaptive treatment protocols.',
      uploadOrDrop: 'Drag and drop infected leaf image, or click to browse',
      selectSample: 'Or test with a verified field sample:',
      takePhoto: 'Use Live Camera',
      cropType: 'Crop Type',
      cropStage: 'Growth Stage',
      selectFarm: 'Associate with Farm Plot',
      recentSpray: 'Recent Foliar Spray (if any)',
      affectedArea: 'Estimated Area Affected (%)',
      analyzeBtn: 'Run AI Disease Diagnosis',
      analyzing: 'Processing with Gemini Multimodal Vision...',
      resultTitle: 'Diagnostic Analysis & Prescriptions',
      confidence: 'Confidence Rating',
      severity: 'Infection Severity',
      pathogen: 'Pathogen Classification',
      symptoms: 'Observed Pathological Symptoms',
      organicTab: 'Organic & Bio-Remedies',
      chemicalTab: 'Targeted Chemical Formulations',
      preventionTab: 'Long-term Prevention & Cultural Control',
      agronomistReview: 'Agronomist Verification Status',
      weatherAdvisory: 'Micro-Climate Spray Window Advisory',
      offlineSaved: 'Saved to local offline queue. Will auto-sync when network returns.'
    },
    market: {
      title: 'Real-Time Mandi Rates & Market Trends',
      subtitle: 'Live agricultural commodity prices from regional APMC mandis with predictive price trajectories.',
      searchCommodity: 'Search by crop or commodity...',
      filterState: 'Filter by State',
      filterDistrict: 'Filter by District',
      commodity: 'Commodity & Variety',
      marketName: 'Mandi / APMC Yard',
      modalPrice: 'Modal Price (₹/Quintal)',
      minMax: 'Min - Max Range',
      trend: '24h Trend',
      date: 'Arrival Date'
    },
    soil: {
      title: 'Precision Soil Health & Fertilizer Calculator',
      subtitle: 'Input lab test values (N-P-K, pH, EC) to generate scientific, split-dose fertilizer schedules and soil amendments.',
      nitrogen: 'Available Nitrogen (N in ppm / kg-ha)',
      phosphorus: 'Available Phosphorus (P in ppm)',
      potassium: 'Available Potassium (K in ppm)',
      ph: 'Soil pH (1 - 14)',
      ec: 'Electrical Conductivity (EC in dS/m)',
      cropTarget: 'Target Crop',
      farmAcreage: 'Plot Size (Acres)',
      calculateBtn: 'Calculate Balanced Fertilizer Prescription',
      calculating: 'Computing Soil Stoichiometry...',
      recommendationTitle: 'Scientific Fertilizer Dosage & Split Schedule'
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      downloadPdf: 'Download PDF Report',
      print: 'Print Prescription',
      offlineMode: 'Offline Mode (Local Storage Active)',
      onlineMode: 'Connected to AgriVision Cloud',
      queuedCount: 'Pending Scans in Queue',
      syncNow: 'Sync Queued Scans'
    }
  },
  hi: {
    appName: 'एग्रीविज़न एआई',
    tagline: 'एआई-संचालित कृषि फसल सलाहकार सहायक',
    nav: {
      dashboard: 'डैशबोर्ड',
      diagnose: 'फसल स्कैनर',
      farms: 'मेरे खेत',
      market: 'मंडी भाव',
      soilHealth: 'मृदा स्वास्थ्य',
      records: 'इतिहास',
      agronomistPortal: 'कृषि विशेषज्ञ पोर्टल',
      adminPortal: 'प्रशासक पोर्टल',
      login: 'लॉग इन',
      register: 'पंजीकरण',
      logout: 'लॉग आउट',
      roleFarmer: 'किसान',
      roleAgronomist: 'कृषि वैज्ञानिक',
      roleAdmin: 'प्रशासक'
    },
    diagnose: {
      title: 'मल्टीमॉडल फसल रोग निदान स्कैनर',
      subtitle: 'रोगग्रस्त पत्ती की फोटो अपलोड करें और तुरंत वैज्ञानिक पहचान एवं उपचार योजना प्राप्त करें।',
      uploadOrDrop: 'पत्ती की तस्वीर यहां खींचें या अपलोड करें',
      selectSample: 'या नमूना छवि के साथ जांचें:',
      takePhoto: 'कैमरा चालू करें',
      cropType: 'फसल का नाम',
      cropStage: 'फसल की अवस्था',
      selectFarm: 'खेत का चयन करें',
      recentSpray: 'हाल ही में किया गया छिड़काव',
      affectedArea: 'प्रभावित क्षेत्र का अनुमान (%)',
      analyzeBtn: 'एआई रोग निदान शुरू करें',
      analyzing: 'जेमिनी एआई विश्लेषण कर रहा है...',
      resultTitle: 'निदान परिणाम एवं उपचार नुस्खा',
      confidence: 'सटीकता स्तर',
      severity: 'रोग की गंभीरता',
      pathogen: 'रोगज़नक़ का प्रकार',
      symptoms: 'देखे गए लक्षण',
      organicTab: 'जैविक व प्राकृतिक उपचार',
      chemicalTab: 'रासायनिक उपचार व खुराक',
      preventionTab: 'दीर्घकालिक रोकथाम के उपाय',
      agronomistReview: 'कृषि विशेषज्ञ सत्यापन स्थिति',
      weatherAdvisory: 'मौसम व छिड़काव परामर्श',
      offlineSaved: 'ऑफ़लाइन सहेज लिया गया है। नेटवर्क आने पर सिंक होगा।'
    },
    market: {
      title: 'लाइव मंडी भाव एवं बाजार रुझान',
      subtitle: 'नजदीकी कृषि उपज मंडियों के ताज़ा न्यूनतम, अधिकतम और मॉडल भाव।',
      searchCommodity: 'फसल खोजें...',
      filterState: 'राज्य चुनें',
      filterDistrict: 'जिला चुनें',
      commodity: 'फसल व किस्म',
      marketName: 'मंडी का नाम',
      modalPrice: 'मॉडल भाव (₹/क्विंटल)',
      minMax: 'न्यूनतम - अधिकतम',
      trend: '24 घंटे का रुझान',
      date: 'आवक तारीख'
    },
    soil: {
      title: 'मृदा स्वास्थ्य एवं खाद कैलकुलेटर',
      subtitle: 'मिट्टी की जांच (एन-पी-के, पीएच) दर्ज करें और संतुलित उर्वरक अनुसूची पाएं।',
      nitrogen: 'नाइट्रोजन (N ppm)',
      phosphorus: 'फास्फोरस (P ppm)',
      potassium: 'पोटाश (K ppm)',
      ph: 'मृदा पीएच (pH)',
      ec: 'विद्युत चालकता (EC dS/m)',
      cropTarget: 'लक्ष्य फसल',
      farmAcreage: 'खेत का क्षेत्रफल (एकड़)',
      calculateBtn: 'उर्वरक मात्रा की गणना करें',
      calculating: 'खाद अनुसूची तैयार हो रही है...',
      recommendationTitle: 'वैज्ञानिक उर्वरक मात्रा व चरणबद्ध छिड़काव'
    },
    common: {
      save: 'सहेजें',
      cancel: 'रद्द करें',
      downloadPdf: 'पीडीएफ डाउनलोड करें',
      print: 'प्रिंट करें',
      offlineMode: 'ऑफ़लाइन मोड सक्रिय',
      onlineMode: 'क्लाउड से जुड़ा हुआ',
      queuedCount: 'लंबित स्कैन',
      syncNow: 'अभी सिंक करें'
    }
  },
  mr: {
    appName: 'अ‍ॅग्रीव्हिजन एआय',
    tagline: 'एआय-आधारित कृषी पीक सल्लागार सहाय्यक',
    nav: {
      dashboard: 'डॅशबोर्ड',
      diagnose: 'पीक स्कॅनर',
      farms: 'माझी शेती',
      market: 'बाजारभाव (मंडी)',
      soilHealth: 'माती परीक्षण',
      records: 'निदान इतिहास',
      agronomistPortal: 'कृषी तज्ञ पोर्टल',
      adminPortal: 'प्रशासक कक्ष',
      login: 'लॉग इन',
      register: 'नोंदणी करा',
      logout: 'बाहेर पडा',
      roleFarmer: 'शेतकरी',
      roleAgronomist: 'कृषी शास्त्रज्ञ',
      roleAdmin: 'प्रशासक'
    },
    diagnose: {
      title: 'अत्याधुनिक पीक रोग निदान स्कॅनर',
      subtitle: 'रोगाची लक्षणे असलेल्या पानाचा फोटो अपलोड करा आणि अचूक उपचार मिळवा.',
      uploadOrDrop: 'पानाचा फोटो येथे ड्रॅग करा किंवा निवडा',
      selectSample: 'किंवा चाचणी नमुना निवडा:',
      takePhoto: 'थेट कॅमेरा वापरा',
      cropType: 'पिकाचे नाव',
      cropStage: 'पिकाची वाढीची अवस्था',
      selectFarm: 'शेताची निवड करा',
      recentSpray: 'अलीकडील फवारणी',
      affectedArea: 'बाधित क्षेत्राची टक्केवारी (%)',
      analyzeBtn: 'एआय रोग निदान करा',
      analyzing: 'रोग तपासणी सुरू आहे...',
      resultTitle: 'रोग निदान व फवारणी सल्ला',
      confidence: 'अचूकता विश्वासार्हता',
      severity: 'रोगाची तीव्रता',
      pathogen: 'रोगजंतूचा प्रकार',
      symptoms: 'निदर्शनास आलेली लक्षणे',
      organicTab: 'सेंद्रिय व जैविक उपाय',
      chemicalTab: 'रासायनिक औषधे व प्रमाण',
      preventionTab: 'दीर्घकालीन प्रतिबंधात्मक उपाय',
      agronomistReview: 'कृषी तज्ञ तपासणी स्थिती',
      weatherAdvisory: 'हवामान व फवारणी अनुकूलता',
      offlineSaved: 'ऑफलाइन जतन केले. इंटरनेट आल्यावर आपोआप अपलोड होईल.'
    },
    market: {
      title: 'थेट कृषी उत्पन्न बाजारभाव (मंडी)',
      subtitle: 'महाराष्ट्रासह प्रमुख बाजार समित्यांमधील आजचे ताजे दर आणि अंदाज.',
      searchCommodity: 'पीक शोधा...',
      filterState: 'राज्य निवडा',
      filterDistrict: 'जिल्हा निवडा',
      commodity: 'शेतमाल व जात',
      marketName: 'बाजार समिती (APMC)',
      modalPrice: 'सरासरी भाव (₹/क्विंटल)',
      minMax: 'किमान - कमाल',
      trend: '२४ तासांतील बदल',
      date: 'आवक दिनांक'
    },
    soil: {
      title: 'अचूक माती आरोग्य व खत व्यवस्थापन',
      subtitle: 'नत्र, स्फुरद, पालाश व सामू (pH) नुसार खताचे संतुलित डोस मिळवा.',
      nitrogen: 'उपलब्ध नत्र (N ppm)',
      phosphorus: 'उपलब्ध स्फुरद (P ppm)',
      potassium: 'उपलब्ध पालाश (K ppm)',
      ph: 'जमिनीचा सामू (pH)',
      ec: 'विद्युत वाहकता (EC dS/m)',
      cropTarget: 'लागवड केलेले पीक',
      farmAcreage: 'शेती क्षेत्र (एकर)',
      calculateBtn: 'संतुलित खतांची मात्रा मोजा',
      calculating: 'हिशोब करत आहे...',
      recommendationTitle: 'शिफारस केलेले रासायनिक व सेंद्रिय खत वेळापत्रक'
    },
    common: {
      save: 'जतन करा',
      cancel: 'रद्द करा',
      downloadPdf: 'पीडीएफ प्रत घ्या',
      print: 'प्रिंट काढा',
      offlineMode: 'ऑफलाइन मोड सुरू आहे',
      onlineMode: 'सर्व्हरशी जोडले गेले आहे',
      queuedCount: 'प्रलंबित स्कॅन',
      syncNow: 'आताच सिंक करा'
    }
  },
  te: {
    appName: 'అగ్రివిజన్ AI',
    tagline: 'AI-ఆధారిత పంట సంరక్షణ మరియు సలహా సహాయకుడు',
    nav: {
      dashboard: 'డ్యాష్‌బోర్డ్',
      diagnose: 'పంట స్కానర్',
      farms: 'నా పొలాలు',
      market: 'మార్కెట్ ధరలు',
      soilHealth: 'నేల ఆరోగ్యం',
      records: 'చరిత్ర',
      agronomistPortal: 'వ్యవసాయ నిపుణుల పోర్టల్',
      adminPortal: 'అడ్మిన్',
      login: 'లాగిన్',
      register: 'నమోదు',
      logout: 'లాగౌట్',
      roleFarmer: 'రైతు',
      roleAgronomist: 'వ్యవసాయ శాస్త్రవేత్త',
      roleAdmin: 'నిర్వాహకుడు'
    },
    diagnose: {
      title: 'పంట తెగుళ్ల గుర్తింపు స్కానర్',
      subtitle: 'పంట తెగులు ఆకు ఫోటోను అప్‌లోడ్ చేసి తక్షణ పరిష్కారాలు పొందండి.',
      uploadOrDrop: 'ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి',
      selectSample: 'నమూనా చిత్రంతో పరీక్షించండి:',
      takePhoto: 'కెమెరా ఆన్ చేయండి',
      cropType: 'పంట పేరు',
      cropStage: 'పంట దశ',
      selectFarm: 'పొలం ఎంపిక',
      recentSpray: 'ఇటీవలి పిచికారీ వివరాలు',
      affectedArea: 'ప్రభావిత ప్రాంతం (%)',
      analyzeBtn: 'AI తెగుళ్ల విశ్లేషణ ప్రారంభించండి',
      analyzing: 'చిత్రాన్ని విశ్లేషిస్తోంది...',
      resultTitle: 'వ్యాధి నిర్ధారణ మరియు నివారణ సూచనలు',
      confidence: 'ఖచ్చితత్వ రేటింగ్',
      severity: 'తీవ్రత స్థాయి',
      pathogen: 'వ్యాధికారక రకం',
      symptoms: 'గమనించిన లక్షణాలు',
      organicTab: 'సేంద్రీయ నివారణలు',
      chemicalTab: 'రసాయన మందుల మోతాదు',
      preventionTab: 'ముందస్తు జాగ్రత్తలు',
      agronomistReview: 'నిపుణుల పరిశీలన',
      weatherAdvisory: 'వాతావరణం & పిచికారీ సలహా',
      offlineSaved: 'ఆఫ్‌లైన్‌లో భద్రపరచబడింది.'
    },
    market: {
      title: 'వ్యవసాయ మార్కెట్ (మండి) ధరలు',
      subtitle: 'స్థానిక మార్కెట్లలో తాజా పంట ధరలు మరియు ట్రెండ్స్.',
      searchCommodity: 'పంట కోసం వెతకండి...',
      filterState: 'రాష్ట్రం ఎంచుకోండి',
      filterDistrict: 'జిల్లా ఎంచుకోండి',
      commodity: 'పంట & రకం',
      marketName: 'మార్కెట్ పేరు',
      modalPrice: 'సగటు ధర (₹/క్వింటాల్)',
      minMax: 'కనిష్ట - గరిష్ట ధర',
      trend: 'ధరల మార్పు',
      date: 'తేదీ'
    },
    soil: {
      title: 'నేల ఆరోగ్య విశ్లేషణ & ఎరువుల కాలిక్యులేటర్',
      subtitle: 'మీ నేల పరీక్ష విలువల ఆధారంగా ఖచ్చితమైన ఎరువుల ప్రణాళిక పొందండి.',
      nitrogen: 'నత్రజని (N ppm)',
      phosphorus: 'భాస్వరం (P ppm)',
      potassium: 'పొటాష్ (K ppm)',
      ph: 'నేల pH',
      ec: 'విద్యుత్ వాహకత (EC dS/m)',
      cropTarget: 'పంట రకం',
      farmAcreage: 'పొలం విస్తీర్ణం (ఎకరాలు)',
      calculateBtn: 'ఎరువుల మోతాదును లెక్కించండి',
      calculating: 'లెక్కిస్తోంది...',
      recommendationTitle: 'శాస్త్రీయ ఎరువుల షెడ్యూల్'
    },
    common: {
      save: 'సేవ్ చేయండి',
      cancel: 'రద్దు చేయండి',
      downloadPdf: 'PDF డౌన్‌లోడ్ చేయండి',
      print: 'ప్రింట్ చేయండి',
      offlineMode: 'ఆఫ్‌లైన్ మోడ్ యాక్టివ్',
      onlineMode: 'క్లౌడ్‌కి కనెక్ట్ అయ్యింది',
      queuedCount: 'పెండింగ్ స్కాన్లు',
      syncNow: 'ఇప్పుడే సింక్ చేయండి'
    }
  },
  ta: {
    appName: 'அக்ரிவிஷன் AI',
    tagline: 'AI-இயங்கும் விவசாய பயிர் ஆலோசனை உதவியாளர்',
    nav: {
      dashboard: 'டாஷ்போர்டு',
      diagnose: 'பயிர் ஸ்கேனர்',
      farms: 'என் பண்ணைகள்',
      market: 'சந்தை விலைகள் (மண்டி)',
      soilHealth: 'மண் வளம்',
      records: 'வரலாறு',
      agronomistPortal: 'விவசாய ஆலோசகர் தளம்',
      adminPortal: 'நிர்வாகி தளம்',
      login: 'உள்நுழைக',
      register: 'பதிவு செய்க',
      logout: 'வெளியேறு',
      roleFarmer: 'விவசாயி',
      roleAgronomist: 'வேளாண் விஞ்ஞானி',
      roleAdmin: 'நிர்வாகி'
    },
    diagnose: {
      title: 'பயிர் நோய் கண்டறியும் ஸ்கேனர்',
      subtitle: 'பாதிக்கப்பட்ட இலையின் புகைப்படத்தை பதிவேற்றி உடனடி தீர்வு பெறுங்கள்.',
      uploadOrDrop: 'படத்தைப் பதிவேற்ற கிளிக் செய்க',
      selectSample: 'மாதிரி படத்தைத் தேர்வு செய்க:',
      takePhoto: 'கேமராவைப் பயன்படுத்துங்கள்',
      cropType: 'பயிர் வகை',
      cropStage: 'பயிர் வளர்ச்சி நிலை',
      selectFarm: 'பண்ணையைத் தேர்ந்தெடுக்கவும்',
      recentSpray: 'சமீபத்திய தெளிப்பு விவரம்',
      affectedArea: 'பாதிக்கப்பட்ட பரப்பளவு (%)',
      analyzeBtn: 'AI நோய் பரிசோதனை செய்க',
      analyzing: 'ஆய்வு நடைபெறுகிறது...',
      resultTitle: 'நோய் கண்டறிதல் மற்றும் மருந்து பரிந்துரை',
      confidence: 'துல்லிய மதிப்பீடு',
      severity: 'தீவிரத்தன்மை',
      pathogen: 'நோய் வகை',
      symptoms: 'கண்டறியப்பட்ட அறிகுறிகள்',
      organicTab: 'இயற்கை மற்றும் உயிரியல் தீர்வுகள்',
      chemicalTab: 'இரசாயன மருந்துகள் மற்றும் அளவு',
      preventionTab: 'நீண்டகால தடுப்பு முறைகள்',
      agronomistReview: 'விவசாய நிபுணர் சரிபார்ப்பு',
      weatherAdvisory: 'வானிலை மற்றும் தெளிப்பு ஆலோசனை',
      offlineSaved: 'ஆஃப்லைனில் சேமிக்கப்பட்டது.'
    },
    market: {
      title: 'நேரலை சந்தை விலைகள் (மண்டி நிலவரம்)',
      subtitle: 'முக்கிய ஒழுங்குமுறை விற்பனைக்கூடங்களின் அன்றாட விலை நிலவரங்கள்.',
      searchCommodity: 'பயிரைத் தேடுங்கள்...',
      filterState: 'மாநிலம்',
      filterDistrict: 'மாவட்டம்',
      commodity: 'பயிர் மற்றும் ரகம்',
      marketName: 'சந்தை பெயர்',
      modalPrice: 'சராசரி விலை (₹/குவிண்டால்)',
      minMax: 'குறைந்தபட்ச - அதிகபட்ச விலை',
      trend: 'விலை மாற்றம்',
      date: 'தேதி'
    },
    soil: {
      title: 'துல்லிய மண் பரிசோதனை மற்றும் உரக் கணக்கீடு',
      subtitle: 'மண் பரிசோதனை முடிவுகளை உள்ளிட்டு தேவையான உரங்களை கணக்கிடுங்கள்.',
      nitrogen: 'தழைச்சத்து (N ppm)',
      phosphorus: 'மணிச்சத்து (P ppm)',
      potassium: 'சாம்பல் சத்து (K ppm)',
      ph: 'மண் கார அமில நிலை (pH)',
      ec: 'மின் கடத்துத்திறன் (EC)',
      cropTarget: 'சாகுபடி பயிர்',
      farmAcreage: 'பரப்பளவு (ஏக்கர்)',
      calculateBtn: 'உரத் தேவையை கணக்கிடுக',
      calculating: 'கணக்கிடுகிறது...',
      recommendationTitle: 'பரிந்துரைக்கப்பட்ட உர அட்டவணை'
    },
    common: {
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      downloadPdf: 'PDF பதிவிறக்குக',
      print: 'அச்சிடுக',
      offlineMode: 'ஆஃப்லைன் முறை செயலில் உள்ளது',
      onlineMode: 'இணைக்கப்பட்டுள்ளது',
      queuedCount: 'நிலுவையில் உள்ளவை',
      syncNow: 'ஒத்திசைக்க'
    }
  }
};
