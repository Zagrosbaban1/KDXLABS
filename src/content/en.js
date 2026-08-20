/* ------------------------------------------------------------------ *
 *  ENGLISH — every word the site says, in one file.
 *
 *  ckb.js is the Sorani Kurdish twin of this file and must keep the
 *  same shape: same keys, same array lengths, same placeholder tokens
 *  ({name}, {email}, {year}). content/index.js checks that at startup
 *  in development and warns about anything that has drifted.
 *
 *  What is NOT here: anything that is not language. Phone numbers,
 *  URLs, map geometry and service ids live in data.js and are shared
 *  by both languages.
 * ------------------------------------------------------------------ */

export default {
  meta: {
    id: "en",
    htmlLang: "en",
    dir: "ltr",
    name: "English",
    short: "EN",
    /* what to call this language in the OTHER language's switcher */
    nativeName: "English",
  },

  nav: {
    about: "About",
    services: "Services",
    work: "Work",
    approach: "Approach",
    faq: "FAQ",
  },

  ui: {
    skipToContent: "Skip to content",
    brandHome: "KDX Labs, home",
    sections: "Sections",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    contact: "Contact",
    startConversation: "Start a conversation",
    languages: "Kurdish · Arabic · English",
    whatsapp: "WhatsApp",
    whatsappAria: "Message KDX Labs on WhatsApp",
    backToTop: "Back to top",
    copy: "Copy",
    copied: "Copied",
    copiedToast: "{what} copied to your clipboard",
    switchLanguage: "Change language",
  },

  hero: {
    badge: "Digital transformation",
    /* line by line, word by word — each word takes its own gradient, so
       the split here is a design decision as well as a copy one */
    headline: [
      ["We", "build", "the", "systems"],
      ["modern", "businesses"],
      ["run", "on."],
    ],
    lede: "Recruitment, software, AI, data, and brand. One team, based in Erbil.",
    primary: "Start a conversation",
    secondary: "See what we do",
    note: "The first conversation is free · we reply within one working day",
  },

  services: {
    eyebrow: "What we do",
    heading: "Five services. One accountable team.",
    lede: "Usually bought from five suppliers. We deliver them as one system.",
    ask: "Ask about {name}",
    consultEyebrow: "Running through all five",
    consultLead: "Consulting.",
    consultBody:
      "We start every engagement by asking whether you need a new system at all — and we'll say so if you don't.",
    items: {
      recruitment: {
        name: "Recruitment",
        role: "Hiring & talent",
        body:
          "Sourcing, screening, and shortlisting through KDXJobs, our own hiring platform. You interview finalists, not a pile of CVs.",
        tags: ["Sourcing", "Screening", "Shortlisting"],
      },
      social: {
        name: "Social Media Management",
        role: "Brand & audience",
        body:
          "Strategy, content, and channel management — written natively in Kurdish and Arabic, not translated.",
        tags: ["Content", "Campaigns", "Brand"],
      },
      software: {
        name: "Software Development",
        role: "Web, mobile & systems",
        body:
          "Websites, platforms, mobile apps, and internal systems built around how your business actually works.",
        tags: ["Web", "Mobile", "Integrations"],
      },
      ai: {
        name: "AI & Automation",
        role: "Removing manual work",
        body:
          "Data entry, document processing, routine replies, monthly reports — rebuilt as workflows that run without supervision.",
        tags: ["Workflow automation", "AI assistants", "Document processing"],
      },
      data: {
        name: "Data Analytics",
        role: "Decisions & reporting",
        body:
          "You already have the data. We connect it and build dashboards that answer the questions leadership actually asks.",
        tags: ["Dashboards", "Modelling", "KPIs"],
      },
    },
  },

  work: {
    eyebrow: "Proof of work",
    heading: "We ship our own products.",
    productEyebrow: "KDX Labs product",
    productName: "KDXJobs",
    productBody:
      "A trilingual recruitment platform for the Kurdistan Region, with an AI-assisted pipeline from application to shortlist. We designed it, built it, and run it.",
    stats: [
      { value: "3", label: "Languages, natively" },
      { value: "RTL", label: "Built in from day one" },
      { value: "Live", label: "In market, in use" },
    ],
    visit: "Visit kdxjobs.com",
    hire: "Hire through us",
  },

  why: {
    eyebrow: "Why KDX Labs",
    heading: "What you get that you wouldn't elsewhere.",
    items: [
      {
        title: "We're from here",
        body: "The market, the languages, and how business actually gets done here.",
      },
      {
        title: "We build what we recommend",
        body: "The team that advises you is the team that builds it.",
      },
      {
        title: "One team, whole picture",
        body: "Software, data, and brand under one roof, designed to work together.",
      },
      {
        title: "We stay after launch",
        body: "We support and improve what we build, long after handover.",
      },
    ],
  },

  approach: {
    eyebrow: "How we work",
    heading: "Four stages. Something real in each.",
    cta: "Stage one is free.",
    ctaButton: "Start with a conversation",
    stages: [
      { n: "01", title: "Listen", body: "We spend time inside your operation before proposing anything." },
      { n: "02", title: "Scope", body: "A written plan with fixed scope, timeline, and price — before work starts." },
      { n: "03", title: "Build", body: "Delivered in stages you can see and use. No six-month silence." },
      { n: "04", title: "Support", body: "Training, documentation you own, and ongoing maintenance." },
    ],
  },

  faq: {
    eyebrow: "Before you ask",
    heading: "Common questions.",
    moreLead: "Something else?",
    moreLink: "Ask us",
    items: [
      {
        q: "What does it cost?",
        a: "Depends on scope. You get a fixed price in writing before any work starts. The first conversation is free.",
      },
      {
        q: "How long until we see something?",
        a: "Weeks for a dashboard or a small automation. Longer for a full platform, but you see each stage as it lands.",
      },
      { q: "Are we too small?", a: "No. If the smaller answer is the right one, we'll say so." },
      {
        q: "Which languages?",
        a: "Kurdish, Arabic, and English — in meetings, documentation, and the systems themselves.",
      },
      { q: "Who owns what you build?", a: "You do. Code, data, and documentation." },
    ],
  },

  about: {
    eyebrow: "Who we are",
    heading: "Local team. International range.",
    lead: "We learn how your business really works, build what it needs, and stay after launch.",
    moreLink: "More about us",
    storyEyebrow: "Our story",
    storyHeading: "Why we started.",
    story: [
      "Businesses in the Kurdistan Region are ready to modernize. The support available to them isn't: foreign firms don't know the market, and freelancers can't carry a project through to a working system.",
      "KDX Labs was built to close that gap. We are a local team working to international standards — the people who advise you are the people who build it, and we are still here once it's running.",
      "That means meetings in Kurdish, Arabic, or English, documentation you own, and systems designed for how business is actually done here rather than a template imported from somewhere else.",
    ],
    disciplinesEyebrow: "How we're organised",
    timelineEyebrow: "How we got here",
    timelineIntro: "We started in Erbil in {year}. This is the first year.",
    closingLead: "See what we've built with all this.",
    closingButton: "View our work",
  },

  mission: {
    label: "Our mission",
    statement: "World-class digital capability, available locally.",
    body:
      "A business in Erbil, Duhok, or Sulaymaniyah should be able to get the same standard of software, data, and brand work it would get from a firm abroad — in Kurdish, Arabic, or English, at a price agreed in writing, from a team that is still here after launch. That is the whole reason we exist.",
  },

  vision: {
    label: "Our vision",
    statement: "A region that runs on systems built here.",
    body:
      "We want the Kurdistan Region's businesses competing on the strength of their technology rather than held back by it — with the platforms, the data, and the people behind that work owned locally rather than rented from somewhere else.",
  },

  commitmentsEyebrow: "What that means in practice",
  commitments: [
    "A fixed scope, timeline, and price in writing before work starts.",
    "Kurdish, Arabic, and English — in meetings, documentation, and the systems themselves.",
    "You own everything we build: code, data, and documentation.",
    "We support and improve what we ship, long after handover.",
  ],

  disciplines: [
    {
      name: "Engineering",
      body:
        "Web, mobile, and the systems behind them. Builds the platforms and integrations, and keeps them running after handover.",
      services: ["software", "ai"],
    },
    {
      name: "Data",
      body:
        "Modelling, pipelines, dashboards, and governance. Turns what you already collect into something leadership can act on.",
      services: ["data"],
    },
    {
      name: "Brand & content",
      body:
        "Identity, campaigns, and channel management — written natively in Kurdish and Arabic, designed for print and screen alike.",
      services: ["social"],
    },
    {
      name: "Talent",
      body:
        "Sourcing and screening through KDXJobs, plus the hiring advice around it: what the role really needs and what it should pay.",
      services: ["recruitment"],
    },
  ],

  timeline: {
    futureLabel: "In the future",
    items: [
      {
        title: "KDX Labs founded in Erbil",
        body: "Started as a small team doing software and data work for local businesses.",
      },
      {
        title: "First platform work ships",
        body: "LinguaLink proves local payment rails — FIB, ZainCash, NassWallet — can be first-class in a product.",
      },
      {
        title: "Data practice opens",
        body: "Executive reporting over thousands of POS terminals, plus the governance case behind it.",
      },
      {
        title: "KDXJobs goes live",
        body: "Our own trilingual recruitment platform, in market and in use.",
      },
    ],
  },

  coverage: {
    eyebrow: "Where we work",
    heading: "On the ground, not on a call from abroad.",
    body: "Office in Erbil. Work across the Kurdistan Region and the rest of Iraq.",
    ourOffice: "Our office",
    hint: "Select a governorate on the map — or use the arrow keys.",
    cta: "Talk to us in Erbil",
    mapAria: "Map of Iraq. Select a governorate of the Kurdistan Region to see what we do there.",
    governorate: "Governorate",
    governorateAria: "{name} governorate",
    stats: [
      { label: "Governorates covered" },
      { label: "Languages, natively" },
      { label: "Office, in Erbil" },
    ],
  },

  regions: {
    duhok: {
      name: "Duhok",
      blurb: "Retail, logistics, and cross-border trade — the work here leans on stock and supplier systems.",
      focus: ["Software", "Data analytics"],
    },
    erbil: {
      name: "Erbil",
      blurb: "Our office, and where most projects start. Banking, government, and the region's largest employers.",
      focus: ["All five services"],
    },
    sulaymaniyah: {
      name: "Sulaymaniyah",
      blurb: "A growing tech and education base — recruitment and platform work, often trilingual from day one.",
      focus: ["Recruitment", "Software"],
    },
  },

  mapCities: {
    mosul: "Mosul",
    baghdad: "Baghdad",
    basra: "Basra",
  },

  form: {
    eyebrow: "Start a conversation",
    heading: "Tell us what's slow.",
    sentHeading: "Your message is ready to send.",
    sentBody: "It's open in your mail app. If it isn't, copy it and send it to {email}.",
    copyMessage: "Copy the message",
    writeAnother: "Write another",
    nameLabel: "Your name",
    namePlaceholder: "Who we're talking to",
    companyLabel: "Company",
    companyPlaceholder: "Where you work",
    optional: "optional",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    phoneLabel: "Phone or WhatsApp",
    phonePlaceholder: "+964 …",
    eitherIsEnough: "Either one is enough.",
    serviceLabel: "What do you need?",
    serviceAria: "Service",
    notSure: "Not sure yet",
    messageLabel: "What's the problem?",
    messagePlaceholder: "A sentence or two is enough.",
    send: "Send the message",
    sendWhatsApp: "Send on WhatsApp",
    draftKept: "We kept what you started typing.",
    clearDraft: "Clear it",
    replyNote: "We reply within one working day.",
    errName: "Add your name so we know who we're replying to.",
    errContact: "Add an email or a phone number so we can reply.",
    errEmail: "That email address doesn't look right.",
    errMessage: "Tell us briefly what you need — a sentence or two is enough.",
    /* what goes into the actual email / WhatsApp message */
    mailName: "Name",
    mailCompany: "Company",
    mailEmail: "Email",
    mailPhone: "Phone",
    mailService: "Service",
    mailSubjectService: "{service} enquiry — {who}",
    mailSubjectPlain: "Enquiry — {who}",
    whatsappGreeting: "Hello KDX Labs —",
    copyLabelMessage: "Message",
    copyLabelEmail: "Email address",
    copyLabelPhone: "Phone number",
  },

  details: {
    email: "Email",
    phone: "Phone",
    web: "Web",
    office: "Office",
    officeValue: "Erbil, Kurdistan Region of Iraq",
    whatsappCta: "Message us on WhatsApp",
    footMeta: "© {year} KDX Labs · Kurdish · Arabic · English",
  },
};
