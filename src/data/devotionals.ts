/**
 * DEVOTIONAL / ARTICLE CONTENT STORE
 * ----------------------------------
 * Paste real devotionals into the `DEVOTIONALS` array below. Any date you add
 * here replaces the auto-generated placeholder for that same date.
 *
 * Field guide:
 *   date       "YYYY-MM-DD" — the day the devotional is for (URL: /devotional/2026-08-17)
 *   title      Topic / headline
 *   scripture  Reference, e.g. "John 15:5"
 *   verse      The verse text
 *   body       Array of paragraphs — one string per paragraph
 *   prayer     Closing prayer
 *   declarations  Optional array of confessions/declarations
 *   readingPlan   Optional Bible reading plan line
 *   author     Optional writer name
 */

export type Devotional = {
  date: string;
  title: string;
  scripture: string;
  verse: string;
  body: string[];
  prayer: string;
  declarations?: string[];
  readingPlan?: string;
  author?: string;
};

/** ==== PASTE REAL DEVOTIONALS HERE ==== */
export const DEVOTIONALS: Devotional[] = [
  {
    date: "2026-06-01",
    title: "Abounding Love",
    scripture: "Philippians 1:9",
    verse:
      "And this I pray, that your love may abound yet more and more in knowledge and in all judgment.",
    body: [
      "Love is one of the greatest evidences that God is working within a person. Not surface love that changes with emotions, but deep spiritual love that continues growing even through difficulty, correction, and misunderstanding. Paul prayed that the believers' love would abound more and more because spiritual love is never meant to remain stagnant. God desires love that matures, deepens, and becomes rooted in truth.",
      "Many people think love is only about affection, but biblical love carries discernment. It has the ability to recognize what pleases God and what grieves Him. Love without discernment can become compromise, while discernment without love can become harshness. God desires both working together within the believer.",
      "As your heart grows closer to God, His love begins to change the way you see people and situations. Pride begins to weaken. Unforgiveness loses its strength in you. Compassion increases. You become slower to speak carelessly and quicker to extend grace. This is part of the transforming work of the Holy Spirit.",
      "There are moments when love is tested deeply. It is easy to love when everything feels comfortable, but true spiritual maturity appears when you choose patience over offense, humility over pride, and peace over strife. In those moments, God often reveals areas of your heart that still need healing and growth.",
      "Paul also prayed that believers would approve things that are excellent. This means spiritual love should produce wisdom and clarity. In a world filled with distractions and competing voices, every believer needs discernment to recognize what aligns with God's nature. Not every opportunity, relationship, or desire leads toward spiritual growth. The Holy Spirit teaches us how to walk with wisdom while keeping our hearts pure before God.",
      "A life filled with the love of God naturally begins to produce spiritual fruit. Kindness becomes visible. Integrity becomes consistent. Mercy becomes genuine. You slowly begin to reflect the character of Christ in daily living. God desires believers whose hearts remain tender before Him: hearts that continue growing in love, truth, purity, and discernment. The more His love fills the heart, the more the life of Christ becomes visible through words, actions, and conduct.",
    ],
    prayer:
      "Father, teach me to walk in love, wisdom, discernment and humility. I declare that my heart will remain pure, tender, and sensitive to the Holy Spirit. Bitterness, pride, offense, and hardness will not rule my life in Jesus' Name. Amen.",
    readingPlan: "1 Kgs 11-12",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-02",
    title: "Authority In The Name Of Jesus",
    scripture: "Philippians 2:9, KJV",
    verse:
      "Wherefore God also hath highly exalted him, and given him a name which is above every name",
    body: [
      "The Name of Jesus is not an ordinary Name. It carries power, authority, victory, and dominion. Throughout the Scriptures, we see the mighty works accomplished through that Name. The sick were healed, demons were cast out, lives were transformed, and impossible situations changed because of the authority vested in it.",
      "The word “authority” comes from the Greek word exousia, which means delegated power, jurisdiction, or the right to exercise dominion. This is important because when Jesus gave us authority in His Name, He gave us the legal right to act on His behalf. As believers, we are not operating in our own strength; we function in the authority of Christ Himself.",
      "Before Jesus ascended into heaven, He declared that all power in heaven and on earth had been given unto Him (Matthew 28:18). Then, He entrusted that authority to the Church. This is why the believer should never live intimidated by fear, darkness, or the attacks of the enemy. We've been given victory in Christ.",
      "In the book of Acts, the apostles understood the power in the Name of Jesus. When Peter spoke to the lame man at the gate called Beautiful, he said, “In the name of Jesus Christ of Nazareth rise up and walk.” Immediately, strength entered the man's feet and ankles. The miracle was not produced by human ability but by faith in the authority of Jesus' Name.",
      "Many believers know the Name of Jesus but have not fully understood the authority connected to it. The Name of Jesus is effective because of who He is and what He accomplished through His death, burial, and resurrection. At the mention of His Name, every force of darkness must bow.",
      "This authority is exercised through faith. When you pray, declare the Word, or confront situations in the Name of Jesus, you do so with confidence, knowing heaven backs that Name. Fear should never dominate the believer because we belong to the One whose Name is above every name.",
      "Walk daily with the consciousness that you carry divine authority. Speak with faith. Pray with boldness. Stand firm against the enemy. The Name of Jesus still has power today, and every believer has been given the privilege to use that Name.",
    ],
    prayer:
      "Father, thank You for the authority given to me in the Name of Jesus. I walk in boldness, victory, and dominion over every work of darkness. Through the power in the Name of Jesus, I declare healing, peace, strength, and victory in every area of my life in Jesus' Name, Amen.",
    readingPlan: "1 Kgs 13; John 12",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-03",
    title: "Be Temperate In All Things",
    scripture: "1 Corinthians 9:25",
    verse:
      "And every man that strives for the mastery is temperate in all things.",
    body: [
      "To strive for mastery is to enter into a contest with determination and focus. The Greek word agonizomenos, translated as “strive,” is the root of our word “agonize”, emphasizing effort, struggle, and enduring commitment. Just as an athlete agonizes in training, the believer must exert intentional effort in the race of life and faith.",
      "Being “temperate in all things” means exercising self-control in every area of your life. It is not selective or occasional; it is consistent, vigorous discipline over your desires, appetites, and passions. It is more than simply avoiding excess; it is directing your life according to God's plan.",
      "In the ancient games, competitors trained for months, abstaining from all indulgence and maintaining strict routines of exercise, diet, and discipline. Victory requires sacrifice, persistence, and order. Similarly, in your modern life, mastery requires you to say “no” to distractions and habits that weaken your spirit, mind, or body. This might mean resisting gossip, limiting unhelpful entertainment, controlling your temper, prioritizing time for prayer and study, or practicing financial self- discipline.",
      "Every great achievement, whether spiritual, personal, or professional is built on consistent self-control. By exercising discipline over your thoughts, actions, and habits, you prepare yourself to fulfill God's purpose in your life.",
      "Remember: the crown is eternal, but the effort requires vigilance. Mastery is tasking, but relying on the Holy Spirit always makes it easier for you. Let every choice reflect your commitment to God's purpose and your pursuit of excellence.",
    ],
    prayer:
      "Dear Lord, teach me self-control over my thoughts, actions, and desires. Strengthen me to persevere in discipline and live a life that honors You. Let my habits, choices, and priorities reflect my pursuit of mastery in Your kingdom. In Jesus' Name, Amen.",
    readingPlan: "1 Kgs 14-15",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-04",
    title: "Christ Consciousness",
    scripture: "Philippians 1:21 KJV",
    verse:
      "For to me to live is Christ, and to die is gain.",
    body: [
      "Christ consciousness is living with the awareness that Jesus lives in you and that His presence is part of your everyday life. It is not something reserved for church services or special spiritual moments. It is a daily walk with God.",
      "Many believers love God sincerely, yet their minds remain filled with fear, guilt, pressure, insecurity, and constant self-criticism. Their attention stays fixed on what is wrong with them instead of what God has already done in them through Christ. This is why many struggle to walk in spiritual confidence even though they are saved.",
      "Paul understood this truth deeply when he said, “Yet not I, but Christ liveth in me” in Galatians 2:20. His life was no longer controlled by the old nature. Christ was now the center of his life, his decisions, and his purpose.",
      "A person who is conscious of Christ carries a different attitude through life. There is greater peace in difficult moments. There is restraint in moments of anger. There is wisdom before speaking. There is strength during temptation. There is hope even during uncertainty. The believer becomes more aware",
      "that God is present and actively working within them.",
      "Christ consciousness also affects identity. Many people define themselves by failure, rejection, past mistakes, or human opinions. God does not see His children through those things. In Christ, you are redeemed, accepted, loved, and made new. The more your heart stays focused on this truth, the more confidence and stability begin to grow within you.",
      "Your Fellowship with God no longer feels empty or mechanical because there is an awareness of communion with the Holy Spirit. Scripture becomes alive and Worship becomes personal.",
      "This awareness grows through consistent fellowship with God. Time in prayer, meditation on Scripture, worship, and obedience help keep the heart sensitive to His presence. The goal of the Christian life is not only to know about Christ, but for His nature to be revealed through us daily.",
    ],
    prayer:
      "Lord Jesus, cause my heart to remain conscious of You every day. Help me to walk in Your wisdom, love, purity, and strength. I declare that fear, guilt, insecurity, and condemnation will not control my life. Christ lives in me, and His nature is revealed through me daily. Amen!",
    readingPlan: "1 Kgs 16-17; John 13",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-05",
    title: "Christ Is Coming Back Soon",
    scripture: "Revelation 22:12",
    verse:
      "And, behold, I come quickly; and my reward is with me, to give every man according as his work shall be.",
    body: [
      "One of the greatest promises in Scripture is the return of Jesus Christ. From the early church until now, believers have lived with the expectation that the Lord will return again just as He promised. His coming is not symbolic imagination or religious tradition. It is a certain event established by the Word of God.",
      "Jesus told His disciples in John 14:3, “I will come again, and receive you unto myself.” The same Christ who ascended into heaven will return again in glory and power.The world often becomes consumed with temporary pursuits, distractions, and pleasures that cause many people to live without eternity in view. Yet Scripture continually reminds us that this present world is passing away. Life on earth is temporary, but eternity is everlasting.",
      "The return of Christ is not meant to produce fear in the believer. It is meant to awaken readiness, faithfulness, and holy living. 1 John 3:2–3 says, “When he shall appear, we shall be like him... And every man that hath this hope in him purifieth himself.” The expectation of Christ's return should stir the heart toward deeper devotion and spiritual alertness. How are you living your life? Does your lifestyle please God? Jesus also warned us to remain watchful. In Matthew 24:42, He said, “Watch therefore: for ye know not what hour your Lord doth come.” Spiritual carelessness and compromise become dangerous when people lose awareness of eternity. The early church carried this expectation deeply. They lived with urgency in prayer, holiness, evangelism, and devotion to God because they believed the Lord's return was near. Their hearts were not dependent on earthly security but in eternal hope.",
      "No one knows the exact day or hour of Christ's return except the Father, but Scripture reveals signs that remind believers to remain spiritually awake. Darkness may increase in the world, but we are called to remain steadfast, faithful, and full of hope. Jesus is coming again for a people who know Him, love Him, and remain faithful to Him.",
      "This is not the time for spiritual slumber. This is the time to remain close to God, walk in obedience, guard the heart, and live with eternity in view. If you are not saved yet, I would like to invite you to make Jesus the lord of your life so you can find peace with God - kindly say the prayer of salvation written out for you at the final page of this devotional.",
    ],
    prayer:
      "Father, thank You for the promise of Christ's return. Thank You because Your Spirit continually keeps my heart watchful and prepared. My life will remain focused on you in obedience and devotion in Jesus' Name, Amen.",
    readingPlan: "1 Kgs 18; John 14",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-06",
    title: "Christian Conduct",
    scripture: "Philippians 1:27",
    verse:
      "Only let your conversation be as it becometh the gospel of Christ…",
    body: [
      "One of the strongest testimonies of a believer is not found in eloquent words, titles, or public appearance. It is found in daily conduct. The life of a Christian should reflect the nature of Christ in every environment. People may not always listen to what we say, but they constantly observe how we live, respond, and even treat others.",
      "The truth is that conduct reveals what is happening within the heart. A person who spends time with God will eventually begin to reflect Him. The way they speak changes. Their attitude changes. Their response to pressure begins to change. This is because genuine fellowship with God affects the inner man before it affects outward actions.",
      "Christian conduct becomes most visible during difficult moments. Anyone can appear calm when everything is going well. But when offense comes, when misunderstandings arise, or when pressure increases, the true condition of the heart is often revealed. In those moments, the Holy Spirit teaches us to respond differently. Instead of bitterness, He produces love, and instead of harshness, He releases meekness and self- control.",
      "As believers, we must understand that we represent Christ everywhere we go. Our conduct in public and private matters to God. The conversations we have, the way we handle conflict, the way we honor people, and even the attitudes we carry all speak loudly. Sometimes, one act of kindness can minister more deeply than many sermons.",
      "This implies that God did not call us only to speak about Christianity. He called us to live it. A life that reflects patience, purity, integrity, compassion, and love becomes a light in a dark world. When people encounter believers whose conduct reflects Christ, they witness the reality of God through human vessels. May our lives never contradict the gospel we preach. Instead, may our conduct reveal the beauty, wisdom, and transforming power of Jesus Christ to everyone around us.",
    ],
    prayer:
      "I declare that my life reflects the nature of Christ. My words, attitudes, and actions will honor God daily. The Holy Spirit is shaping my character and teaching me to respond according to God's will. Everywhere I go, I carry the light of God and reveal His nature through my life. In Jesus' Name. Amen.",
    readingPlan: "1 Kgs 19-20",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-07",
    title: "Christian Consecration",
    scripture: "Romans 12:1 KJV",
    verse:
      "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.",
    body: [
      "Consecration is one of the deepest expressions of love and surrender to God. It is the decision to separate yourself unto Him and allow your life to come under His authority completely. Many believers desire the power of God, the voice of God, and the hand of God upon their lives, but often overlook the place of consecration. Throughout Scripture, those who carried unusual dimensions of God's presence were people who lived separated unto Him.",
      "Consecration begins in the heart. It is beyond avoiding certain things outwardly. It is a posture of surrender where a believer says, “Lord, my life belongs to You.” It will affect desires, decisions, priorities, relationships, speech, and your conduct. When a life is consecrated, pleasing God becomes more important than pleasing self or pleasing people.",
      "In a world filled with distractions, compromise, and spiritual carelessness, consecration has become rare. Yet God still seeks believers whose hearts are fully yielded to Him. This may cost comfort, convenience, or popularity, but it produces intimacy with God. There are dimensions of spiritual strength and sensitivity that cannot be accessed casually. They are cultivated through a life that remains surrendered before the Lord. Joshua told the people in Joshua 3:5, “Sanctify yourselves: for tomorrow the Lord will do wonders among you.” Before wonders came, consecration came first. God often prepares vessels privately before using them publicly. He works on the heart before revealing His power openly.",
      "Consecration requires your consistency. It is not a one-time emotional decision made during a powerful service. It is a daily walk with God. Every day, the believer chooses purity over compromise, obedience over rebellion, and intimacy over distraction. As this walk continues, the heart becomes more aligned with God's desires.",
      "The beauty of consecration is that it draws a believer closer to God. The more yielded you become, the more His nature begins to shape your life. God is still calling believers to live set apart lives. Not for religious appearance, but so that their lives may become vessels through which His glory can be revealed in the earth.",
    ],
    prayer:
      "I declare that my life belongs completely to God. I am set apart for God's purpose and His glory. My heart, mind, desires, and decisions are surrendered to Him. I will not be ruled by compromise, distraction, or worldly influences. The Holy Spirit is helping me walk in purity, obedience, and holiness daily in Jesus' Name. Amen.",
    readingPlan: "1 Kgs 21; John 15",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-08",
    title: "Consecration In Everyday Life",
    scripture: "1 Peter 1:15-16",
    verse:
      "But as he which hath called you is holy, so be ye holy in all manner of conversation; Because it is written, Be ye holy; for I am holy",
    body: [
      "Someone once asked, “How can I live a life fully consecrated to God in my daily routine?” The answer is simple: let your faith touch every part of your life. Consecration is not just for Sunday; it is a lifestyle that shapes how you pray, speak, work, and even manage your resources. When every area of life is offered to God, He can work through you to manifest His glory.",
      "The Bible says in Colossians 3:17, “And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him.” This means that consecration is practical. It is shown in the way you handle your job with honesty, your words with grace, your relationships with love, and your finances with stewardship. Each act becomes an offering to God, pleasing to Him and beneficial to others.",
      "Think of Joseph. In every workplace (from Potiphar's house to prison). Joseph conducted himself with integrity and faithfulness. His consecration in ordinary tasks prepared him for God's extraordinary plan. Even in trials, his life demonstrated holiness and devotion, and God elevated him to a position of influence that saved nations. 1 Peter 1:15-16 says, “but as he which hath called you is holy, so be ye holy in all manner of conversation; because it is written, Be ye holy; for I am holy.” Today, God calls you to a life of practical consecration. You can start with the simple things that please the Holy Spirit, such as creating time to study God's word, praying, giving generously, working with diligence and other things that make you stay aligned with God's will. Each small act of obedience strengthens your spirit, trains your character, and becomes a channel for God's power.",
      "Consecration in daily life produces not only spiritual growth but also boldness, peace, and influence. When your routine, your speech, and your work reflect God's holiness, you become a living testimony of His grace.",
    ],
    prayer:
      "Father, I dedicate every part of my life to You. My words, my work, my relationships, and my resources are Yours. Guide me in holiness and integrity. I declare that my life will always reflect Your glory. All my actions and thought will honor You and draw others into Your Kingdom, in Jesus' Name. Amen.",
    readingPlan: "1 Kgs 22; 2 Kgs 1;",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-09",
    title: "Desire Spiritual Gifts",
    scripture: "1 Corinthians 14:1, KJV",
    verse:
      "Follow after charity, and desire spiritual gifts, but rather that ye may prophesy",
    body: [
      "Throughout Scripture, we see God revealing Himself through the operation of His Spirit. From the prophets in the Old Testament to the early Church in the book of Acts, the Holy Spirit empowered ordinary men and women to speak, discern, heal, strengthen others, and reveal the heart of God. This is why Paul encouraged believers to desire spiritual gifts. The word “gifts” comes from the Greek word charismata, which means expressions of grace or divine enablements given freely by the Holy Spirit. These are supernatural workings of God through yielded believers for the blessing and edification of others.",
      "In our opening scripture, the Apostle Paul specifically instructs believers to “desire spiritual gifts.” This shows that spiritual growth should never become stagnant. God wants His children to remain spiritually hungry and open to the work of the Holy Spirit in their lives.",
      "The Holy Spirit desires to express Himself through gifts such as prophecy, discernment, healing, faith, tongues, interpretation of tongues, wisdom, and knowledge. These gifts strengthen believers, encourage the Church, and reveal the reality of God's presence among His people.",
      "However, spiritual gifts must always function through the foundation of love. This is why Paul first emphasized charity before speaking about spiritual gifts. Without love, spiritual activities lose their true purpose and can become empty displays. Love keeps the believer humble, sincere, and aligned with God's nature.",
      "As you spend time in prayer, worship, and meditation on the Word, your spiritual sensitivity increases. The more you fellowship with the Holy Spirit, the more you recognize His leading and become available for His use. Spiritual gifts are cultivated in an atmosphere of intimacy with God.",
      "Many believers desire power but neglect fellowship. Yet the deeper your relationship with the Lord becomes, the more room there is for the Holy Spirit to work through you effectively. Do not ignore spiritual hunger within you. Feed it with the Word, prayer, and fellowship with the Spirit. Remain expectant and available to God. He delights in using those who are humble, willing, and sensitive to His voice.",
    ],
    prayer:
      "Father, thank You for the gift of the Holy Spirit. Stir a deeper hunger within me for spiritual growth and sensitivity to Your voice. Teach me to walk in love and make me a vessel through which Your gifts can flow to bless others and glorify Christ. I yield myself completely to Your Spirit. In Jesus' Name, Amen.",
    readingPlan: "2 Kgs 2-3",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-10",
    title: "Fear Not",
    scripture: "Isaiah 41:10 (KJV)",
    verse:
      "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee…",
    body: [
      "God's message to you is simple and steady: fear not. No matter the day, no matter the situation, His word remains the same. You often hear that “fear not” appears 365 times in the Bible; almost like God is reminding you every single day not to fear. Whether you count it or not, the truth behind it is powerful: God is consistently speaking peace over your life.",
      "Fear does not just show up without a reason. Something usually triggers it: a report, uncertainty about the future, a delay, or even something you remember from the past. And once fear gets in, it does not stay quiet. It slowly spreads, affecting how you think, how you speak, and how you respond. That is why God speaks to it directly. He does not say “try not to fear.” He says fear not. It is clear, firm, and intentional.",
      "In your walk with God, especially in moments of pressure, fear can become a real battle. It shifts your focus away from God and places it on the problem. Suddenly, what you are facing looks bigger than the One who is with you. That is how fear works; it magnifies the situation and minimizes your confidence in God.",
      "But God brings you back to truth: “for I am with thee.” That",
      "changes everything. His instruction to not fear is not empty; it is backed by His presence. You are not facing life alone, and you are not expected to handle everything by yourself.",
      "Fear may try to creep in, but you have a choice. You can dwell on what is happening around you, or you can hold on to what God has said. The more you stay in His Word, the more your heart settles. Faith begins to rise, and fear begins to lose its hold.",
      "Living without fear does not mean challenges will disappear. It means you refuse to let those challenges control your heart. It means you stay grounded, knowing that God is with you. So, each day, no matter what comes your way, carry this truth with you: fear not. Not because everything is perfect, but because God is present.",
    ],
    prayer:
      "I will not fear. God is with me, strengthening and guiding me. My heart is steady, and my trust is in Him. The shackles of fear are broken off from me in Jesus' Name. Amen!",
    readingPlan: "2 Kgs 4; John 17",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-11",
    title: "God Delights In You",
    scripture: "Zephaniah 3:17",
    verse:
      "The Lord thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy.",
    body: [
      "Many believers know that God is holy and powerful, yet they still struggle to believe He truly delights in them. Their relationship with Him becomes shaped by fear, pressure, and a constant awareness of personal failure. They pray, worship, and serve God, but deep within, they still feel unworthy of His affection.",
      "Scripture reveals something different about the heart of God. Zephaniah says “the Lord rejoices over His people with joy”. The word “rejoice” speaks of delight and affection. God is not enduring His children reluctantly. He loves them sincerely.",
      "This becomes difficult for some believers to accept because they continue measuring themselves by past mistakes and personal weaknesses. Condemnation keeps reminding them of where they failed. Grace reminds them of what Christ has done on their behalf.",
      "God does correct His children, but correction is not rejection. A father disciplines the child he loves. The purpose is growth and closeness with Him, not separation from Him. Jesus revealed",
      "this heart of the Father throughout His ministry. He welcomed people others avoided. He restored those who had fallen. He showed compassion to those carrying shame and guilt. Even before Jesus began His ministry publicly, the Father declared His pleasure in Him.",
      "Many believers still approach God as though acceptance must be earned constantly. But salvation brought us into relationship with Him through Christ. Obedience now flows from love for God, not fear of rejection. Knowing that God delights in you changes the way you approach prayer. There is less hiding and less hesitation. Your heart becomes more open before Him because you understand that He receives you as His child.",
      "The enemy often tries to keep believers trapped in shame so they remain distant in their hearts from God. But the Lord continues drawing His people near to Himself. You are not abandoned by God. You are not ignored by Him. In Christ, you have been accepted by the Father.",
    ],
    prayer:
      "Father, thank You for loving me through Christ Jesus. Help me to live free from condemnation and fear. Teach me to rest in Your love and to walk closely with You daily. Let my heart remain open before You, and help me grow in faith and obedience. I declare that my confidence is rooted in what Christ has done for me. In Jesus' Name, Amen. FURTHER",
    readingPlan: "2 Kgs 5-6; John 18",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-12",
    title: "God Derives Pleasure In You",
    scripture: "Zephaniah 3:17",
    verse:
      "The Lord thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.",
    body: [
      "Many believers live with the feeling that God is constantly disappointed in them. They pray, worship, and serve Him, yet deep within their hearts they struggle to believe that God truly delights in them. Because of past failures, weaknesses, or personal battles, they approach God with fear instead of confidence. But Scripture reveals something beautiful about the heart of God toward His children: He takes pleasure in them.",
      "God's love for you is so real. It is personal. He does not tolerate you reluctantly. He delights in you as a Father delights in His child. Zephaniah says He rejoices over His people with joy and sings over them. What a powerful picture of God's affection toward those who belong to Him.",
      "This does not mean God ignores sin or leaves us unchanged. He corrects those He loves because He desires our growth and maturity. But even in correction, His heart toward us remains full of mercy and compassion. Many believers know God as Lord, Judge, and King, yet struggle to know Him as a loving Father who enjoys fellowship with them.",
      "One of the enemy's greatest weapons is condemnation. Condemnation pushes people away from God and convinces them they are unwanted in His presence. But conviction from the Holy Spirit draws believers closer to God, leading them into repentance and restoration. The cross of Christ stands as proof that you are deeply loved and desired by God.",
      "As you understand that God derives pleasure in you, your relationship with Him begins to change. Prayer becomes fellowship instead of duty. Stop striving to earn His acceptance and begin walking confidently in the love He has already given through Christ.",
      "There are moments when you may feel weak or unworthy, but God does not abandon His children in their struggles. He remains patient and faithful. His grace continues to shape and strengthen you daily. He sees not only where you are, but also who you are becoming through His Spirit. Today, rest in this truth: God is not looking for reasons to reject you. Through Christ, you have become accepted as His Beloved. His love toward you is constant and unfailing.",
    ],
    prayer:
      "I declare that I am loved by God and accepted through Jesus Christ. God delights in me and rejoices over my life with joy. I reject every voice of condemnation, guilt, and rejection. I walk confidently in the love of the Father in Jesus' Name. Amen.",
    readingPlan: "2 Kgs 7-8",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-13",
    title: "Growing In The Knowledge Of God’s Will",
    scripture: "Colossians 1:9",
    verse:
      "For this cause we also… do not cease to pray for you, and to desire that ye might be filled with the knowledge of his will...",
    body: [
      "God does not want you to walk through life confused, unstable, or spiritually blind. His desire is for you to grow in the knowledge of His will and become sensitive to His direction. Many believers spend time searching for answers about the future while neglecting the place of intimacy where God reveals Himself personally. But the more you grow in fellowship with God, the clearer His leading becomes.",
      "The knowledge of God's will is not just information. It is spiritual understanding produced through prayer, and time in His presence. As you continue walking with God, your desires begin to change. Your discernment becomes sharper. You slowly begin to recognize what pleases the Lord and what could weaken your spiritual life.",
      "There are times where you may not fully understand what God is doing. At times, His direction may unfold gradually instead of all at once. In those moments, God is teaching you dependence. He wants you to trust Him daily instead of relying only on visible signs and human understanding.",
      "Paul prayed that we would walk worthy of the Lord and become",
      "fruitful in every good work. This means your relationship with God should eventually affect the way you live. The more you grow spiritually, the more transformation begins to appear in your conduct, speech, decisions, and character. God's will is not meant to remain theory. It should produce visible fruit in your life.",
      "You must also remember that God is committed to your growth. Even when you feel uncertain, He continues teaching, correcting, strengthening, and guiding you through the Holy Spirit. The enemy may try to bring confusion, discouragement, or fear, but God is not the author of confusion. He knows how to lead those who seek Him sincerely.",
      "The beautiful thing about walking with God is that you do not have to figure everything out alone. You have been brought into the kingdom of Christ and given access to the wisdom of God through His Spirit. As you remain close to Him, clarity increases and spiritual confidence begins to grow within you. God is faithful to direct the life that is surrendered to Him.",
    ],
    prayer:
      "Father, fill me with the knowledge of Your will in all wisdom and spiritual understanding. I declare that my heart is sensitive to the leading of the Holy Spirit. My mind is being renewed, and my discernment is becoming sharper through God's Word, in Jesus' Name. Amen.",
    readingPlan: "2 Kgs 9; John 19",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-14",
    title: "Guard your Heart",
    scripture: "Proverbs 4:23",
    verse:
      "Keep thy heart with all diligence; for out of it are the issues of life.",
    body: [
      "Your mind is a gate. What enters consistently through that gate will eventually influence your emotions, decisions, character, and spiritual condition. This is why Scripture places such strong emphasis on guarding the heart and renewing the mind. The enemy understands that if he can influence thoughts long enough, he can influence direction.",
      "The battlefield is often internal before it becomes external. Many believers pray against attacks around them while ignoring the conversations happening within them. Yet thoughts have power. Thoughts repeated continually begin to shape perception, expectation, and behavior. A person may hear fear long enough until fear begins to feel normal. Bitterness entertained long enough can slowly harden the heart. Condemnation repeated continually can distort identity and weaken spiritual confidence.",
      "The enemy attacks the mind because thoughts eventually become strongholds, habits, and lifestyle patterns. He introduces confusion to weaken clarity. He introduces fear to weaken faith. He introduces accusation to weaken identity. Many spiritual battles begin with a single unchecked thought.",
      "This is why the Word of God commands us to cast down imaginations and bring every thought into obedience to Christ. Not every thought deserves agreement. Some thoughts must be rejected immediately because they contradict God's word. A renewed mind does not absorb everything. It learns to discern, filter, and confront thoughts through the Word of God.",
      "What you feed consistently will grow stronger. If the mind feeds continually on fear, lust, negativity, offense, and corruption, spiritual sensitivity becomes weakened. But when the mind is filled with truth, purity, worship, prayer, and Scripture, spiritual stability increases. Peace becomes stronger. Discernment becomes clearer. Faith becomes more established.",
      "Guarding your heart also means being deliberate about influences. Conversations, entertainment, environments, and voices all leave impressions on the soul. Not everything that enters your ears deserves access to your heart. Wisdom knows how to protect spiritual atmosphere. A guarded heart is not a fearful heart. It is a disciplined heart. The believer who learns to govern the mind through the Spirit develops strength inwardly and stability outwardly.",
    ],
    prayer:
      "I declare that my mind belongs to God. Every thought that opposes the truth of God is cast down and brought into obedience to Christ. Fear, condemnation, confusion, lust, anxiety, and bitterness will not rule my mind. My heart is guarded by the peace of God in Jesus' Name. Amen.",
    readingPlan: "2 Kgs 10-11",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-15",
    title: "Guarding The Ear Gate",
    scripture: "Romans 10:17",
    verse:
      "So, then faith cometh by hearing, and hearing by the word of God.",
    body: [
      "The ear is one of the strongest gates of influence in a person's life. What enters through hearing does not remain at the surface for long. Words have a way of settling into the heart and shaping thoughts, beliefs, emotions, and expectations over time.",
      "Romans 10:17 says, “Faith cometh by hearing, and hearing by the word of God.” If faith can enter through hearing, then fear, unbelief, deception, and confusion can also enter through what a person continually listens to.",
      "This is why the enemy fights for influence over conversations, atmospheres, music, teachings, and relationships. He understands that repeated words eventually shape the inner life of a person. What someone hears consistently often becomes the framework through which they interpret life.",
      "Many people carry fear because fear has been fed constantly through negative voices and discouraging words. Others struggle with instability because confusion has surrounded them continually. Some believers become spiritually drained because their souls are feeding daily on gossip, corruption, anger, unbelief, or worldly influences.",
      "Scripture shows how powerful words can be. In Numbers 13, the spies returned from Canaan with conflicting reports. Joshua and Caleb spoke with faith concerning God's promise, but the other spies spread fear among the people. Numbers 13:32 says they brought “an evil report of the land.” That report affected an entire generation. Fear entered their hearts through words until they no longer believed they could possess what God had promised.",
      "This is why discernment is necessary concerning the voices allowed into your life. Not every voice deserves access to your soul. Some voices strengthen faith and draw the heart toward God. Others weaken conviction and slowly normalize compromise.",
      "Jesus said, “Take heed what ye hear” (Mark 4:24). Notice He did not only warn about what people say, but also about what we allow ourselves to hear. You must learn to feed continually on truth. God's Word strengthens faith, renews the mind, and brings stability to the heart. The more a person listens to truth, the stronger spiritual discernment becomes.",
    ],
    prayer:
      "Father, help me to guard the voices I allow into my heart. Grant me discernment concerning conversations, influences, and teachings around me. Let my soul be strengthened by Your Word and not weakened by fear or unbelief in Jesus' Name, Amen.",
    readingPlan: "2 Kgs 12-13; John 20",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-16",
    title: "Guarding The Gate Of Vision",
    scripture: "Matthew 6:22",
    verse:
      "The light of the body is the eye: if therefore thine eye be single, thy whole body shall be full of light.",
    body: [
      "The eyes are more than natural instruments for sight. Scripture reveals that they also influence the condition of the inner life. What enters through the eyes affects thoughts, desires, emotions, imagination, and spiritual sensitivity.",
      "This is why the enemy often works through visual exposure first. Many forms of corruption do not begin outwardly. They begin subtly through what a person continually allows before their eyes. Over time, repeated exposure weakens conviction and reshapes what the heart becomes comfortable accepting.",
      "The Bible shows this clearly in the story of Eve. Genesis 3:6 says, “And when the woman saw that the tree was good for food, and that it was pleasant to the eyes...” Before she took the fruit, she first looked upon it and desired it. The battle entered through vision before it appeared in action. What the eyes continually entertain eventually influences the direction of the heart.",
      "This is why we must be careful about what we feed our eyes daily. Not everything that is visible is spiritually healthy. Some forms of entertainment, media, and environments slowly affect spiritual sensitivity without immediate notice. A person may not fall suddenly, but constant exposure can gradually weaken discernment and spiritual hunger.",
      "Jesus said, “If therefore thine eye be single, thy whole body shall be full of light” (Matthew 6:22). The word “single” here carries the idea of clarity, focus, and soundness. A guarded eye helps to preserve a guarded heart. Job understood the importance of guarding the eye gate when he declared, “I made a covenant with mine eyes...” (Job 31:1). These scriptures reveal intentional discipline concerning what entered their hearts through vision.",
      "What a person watches consistently often shapes desires and influences thoughts. Over time, it can affect convictions, emotional responses, and spiritual appetite. This is why wisdom and discernment are necessary in daily life. Guarding the eye is you protecting the condition of the heart. Proverbs 4:23 says, “Keep thy heart with all diligence; for out of it are the issues of life.” A believer who desires closeness with God must remain mindful of what continually enters the soul through vision.",
    ],
    prayer:
      "Father, help me to guard my heart and my eyes carefully. At all times, cause me to walk in wisdom and discernment concerning the things I allow into my life. I declare that my mind will not be shaped by corruption or compromise. My eyes will remain focused on things that strengthen my walk with You. In Jesus' Name, Amen.",
    readingPlan: "2 Kgs 14-15; John 21",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-17",
    title: "Guarding The Mouth Gate",
    scripture: "Proverbs 18:21",
    verse:
      "Death and life are in the power of the tongue.",
    body: [
      "The mouth is more than an instrument for communication. Scripture reveals that it is also a gate of release. Words carry influence, and what a person continually speaks often reveals what is taking root within the heart.",
      "Jesus said, “Out of the abundance of the heart the mouth speaketh” (Matthew 12:34). Speech is often the overflow of inward thoughts, emotions, beliefs, and spiritual condition. A heart filled with fear eventually speaks fearful words. A heart filled with bitterness eventually releases bitterness. A heart established in faith will eventually speak with expectation and confidence in God.",
      "This is why words matter deeply. Scripture shows that speech can build or tear down. Words can encourage faith or strengthen hopelessness. They can bring healing or spread corruption. Many people continually speak defeat, limitation, and despair without realizing those words are reinforcing the condition of their soul.",
      "The enemy understands the power of speech. One of his goals is to influence confession because repeated negative language can strengthen inward strongholds. Some people speak constantly from pain, disappointment, anger, or fear until those words begin to shape their perspective and expectations about life.",
      "David understood this when he prayed, “Set a watch, O Lord, before my mouth; keep the door of my lips” (Psalm 141:3). He recognized that an unguarded mouth could become dangerous. Believers must learn to speak with wisdom and spiritual awareness. Words spoken continually shape thoughts, influence atmospheres, and affect the condition of the heart over time. A guarded mouth often reflects a guarded soul.",
    ],
    prayer:
      "Father, thank You for the power of Your Word working within me. Thank You because the Holy Spirit continually teaches my heart to speak with wisdom, faith, and truth. My mouth will not release fear, bitterness, defeat, or corruption. My heart remains established in truth, and my confession will continually align with Your Word. In Jesus' Name, Amen.",
    readingPlan: "2 Kgs 16-17",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-18",
    title: "He Brings Greater Glory",
    scripture: "Isaiah 60:17",
    verse:
      "For brass I will bring gold, and for iron I will bring silver, and for wood brass, and for stones iron: I will also make thy officers peace, and thine exactors righteousness",
    body: [
      "God is a God of increase, progress, and greater glory. He never intended for His children to remain stagnant or limited. His desire is to continually lift, strengthen, refine, and beautify their lives. In our opening scripture, we see a remarkable picture of divine improvement and supernatural upgrade. The Lord said, “For brass I will bring gold, and for iron I will bring silver.” This reveals His heart to replace lower things with better things.",
      "The Christian life is a life of advancement. God delights in bringing His children from glory to glory and from strength to strength. He takes ordinary lives and fills them with extraordinary grace. What once seemed insufficient becomes more than enough through His power and favour.",
      "Perhaps there are areas of your life where you desire improvement. It may be in your spiritual growth, health, finances, career, family, or ministry. Never settle for less than God's best. The Lord is able to increase your capacity, enlarge your influence, and bring beauty and excellence into every aspect of your life.",
      "Notice also that the scripture says, “I will also make thy officers peace, and thine exactors righteousness.” This means God is not only concerned about material increase; He is also interested in establishing peace, order, righteousness, and stability around His people. His blessings produce wholeness.",
      "Sometimes people become discouraged because things appear slow or difficult. But God often works progressively. Just as gold is more precious than brass, God knows how to elevate your life step by step into greater value, honour, and usefulness. He can open doors that no human effort could open and position you in places you never imagined possible.",
      "Therefore, maintain a strong expectation of increase and transformation. Speak words consistent with God's promises concerning your life. Refuse to think small or live beneath your divine inheritance. The glory of God in your life is designed to grow brighter and stronger.",
    ],
    prayer:
      "The glory of God is evident in my life, and I walk in continual increase and advancement. I refuse stagnation or limitation, because my path shines brighter and brighter. I grow in wisdom, strength, prosperity, and righteousness every day. Hallelujah!",
    readingPlan: "2 Kgs 18; Acts 1",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-19",
    title: "He Gives You Double",
    scripture: "Isaiah 61:7",
    verse:
      "For your shame ye shall have double; and for confusion they shall rejoice in their portion: therefore in their land they shall possess the double: everlasting joy shall be unto them",
    body: [
      "God never intended for His children to live under shame, defeat, regret, or sorrow. His desire is that you walk in the consciousness of His love, righteousness, glory, and victory. Our opening scripture reveals His heart towards His people: “For your shame ye shall have double.” What a powerful assurance!",
      "Notice that He didn't merely say He would remove the shame; He said He would give you double in its place. That means divine restoration, increase, honour, and joy. God is a restorer. He knows how to turn painful seasons into testimonies and make your life a display of His grace.",
      "Perhaps there were moments when things didn't go as expected. Maybe you experienced loss, disappointment, rejection, delay, or situations that brought confusion. Refuse to allow those things define your identity or future. Your life is in God's hands, and He specializes in glorious reversals.",
      "Think about Job. After all he went through, the Bible says the Lord gave him twice as much as he had before. Joseph also experienced shame and betrayal before he was elevated to a",
      "place of honour and influence. Throughout the Scriptures, we see a consistent pattern: God brings His people from mourning to rejoicing, from obscurity to glory.",
      "This is why you must maintain your faith and confidence in the Word. Never speak defeat or hopelessness over your life. Keep affirming who you are in Christ. You're the seed of Abraham, an heir of God, and a joint-heir with Christ. You've been called into a life of glory, excellence, and victory.",
      "The Lord can restore years that seemed wasted. He can open doors no man can shut and bring beauty out of difficult situations. His grace can lift a man from obscurity and place him before kings. Therefore, never conclude that your best days are behind you. In Christ, your path is one of increasing glory. Even now, God's favour is working in your life. He's aligning circumstances, ordering your steps, and bringing you into the place He ordained for you. What looked like shame will become a testimony of His power and faithfulness. What caused tears will produce rejoicing. Remain joyful and full of expectation, because the Lord has ordained everlasting joy for you.",
    ],
    prayer:
      "I refuse to walk in shame, defeat, or confusion, because the Lord has given me beauty for ashes and joy instead of mourning. I walk in divine favour, restoration, honour, and increase. Hallelujah!",
    readingPlan: "2 Kgs 19-20",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-20",
    title: "Manifesting The Presence Of God",
    scripture: "2 Corinthians 3:18",
    verse:
      "But we all, with open face beholding as in a glass the glory of the Lord, are changed into the same image from glory to glory, even as by the Spirit of the Lord.",
    body: [
      "As a believer, God's presence dwells within you. The question is not whether He is present, but whether His presence is being manifested. To manifest means to make visible, to reveal openly what is already there. As a child of God, the Holy Spirit lives in you; manifesting His presence is allowing His nature, power, and character to be seen through your life.",
      "Throughout Scripture, when God's presence was manifested, there was undeniable evidence. In the Old Testament, His glory filled the temple. In the New Testament, His presence brought boldness, miracles, transformation, and conviction. On the day of Pentecost in Acts 2, the Spirit's presence was revealed with power, and lives were changed instantly. What was invisible became unmistakably evident.",
      "Manifesting God's presence begins with fellowship. You cannot reveal what you do not behold. As 2 Corinthians 3:18 teaches, “as we behold His glory, we are transformed”. Time in prayer, meditation on the Word, worship, and obedience create sensitivity to the Spirit. The more yielded you are, the more His",
      "character (love, peace, authority, wisdom) flows through you naturally.",
      "It is also a matter of alignment. When your thoughts align with His Word, your speech reflects His truth, and your actions mirror His love, His presence becomes tangible around you. The presence of God is the weight of His glory expressed through a surrendered vessel.",
      "You don't have to strive to manufacture anything spiritual. Simply cultivate intimacy with Him. As you walk in the Spirit daily, His presence will radiate through your words, decisions, and demeanor. People may not always understand it, but they will recognize that something is different. That difference is the manifested presence of God.",
    ],
    prayer:
      "Father, thank You that Your Spirit dwells in me. I yield myself completely to You. As I behold Your glory, transform me from glory to glory. Let Your presence be evident in my life: through my words, actions, and character. Manifest Yourself through me for Your glory, in Jesus' Name. Amen.",
    readingPlan: "2 Kgs 21-22; Acts 2",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-21",
    title: "Achieved Only Through Fasting",
    scripture: "Matthew 17:21",
    verse:
      "Howbeit this kind goeth not out but by prayer and fasting.",
    body: [
      "There are moments in the believer's life when ordinary spiritual routines are no longer enough for the season ahead. Not because God has changed, but because deeper spiritual focus, discipline, and sensitivity are required. This is one reason fasting remains important in the life of a Christian.",
      "In Matthew 17, the disciples were unable to cast out a demon from a young boy. They had seen miracles before and had already been given authority by Jesus, yet this particular situation exposed a lack of spiritual preparedness. Jesus later explained that “this kind” required prayer and fasting.",
      "Fasting does not increase God's power because God is already all powerful. Neither does fasting make God more willing to answer prayer. The purpose of fasting is often to position the believer spiritually. It sharpens focus, strengthens discipline, quiets distractions, and helps the heart become more sensitive to the Holy Spirit. There are battles that require persistence in prayer. There are seasons where spiritual distractions, weariness, fleshly desires, and mental heaviness must be confronted intentionally. Fasting helps bring the body under discipline so the spirit can remain attentive to God.",
      "Throughout Scripture, fasting often accompanied moments of breakthrough, direction, repentance, consecration, and spiritual victory. Esther called for fasting before approaching the king. Daniel fasted while seeking understanding. Jesus fasted before beginning His earthly ministry. The early church fasted while seeking direction and appointing leaders.",
      "Fasting also reveals what controls the heart. Many times, people discover during fasting how dependent they have become on comfort, routine, entertainment, or physical satisfaction. Seasons of fasting help realign the heart toward God again. Not every challenge disappears instantly through fasting, but fasting strengthens the believer inwardly. It builds spiritual endurance, patience, focus, and sensitivity. It creates room for deeper fellowship with God and greater attentiveness to His voice. The Christian life was never meant to be lived casually. There are victories, breakthroughs, and levels of spiritual growth that require intentional pursuit of God through prayer and fasting.",
    ],
    prayer:
      "Father, strengthen my heart to seek You sincerely through prayer and fasting. Help me grow in spiritual discipline, sensitivity, and obedience. I declare that distractions, spiritual laziness, and fleshly desires will not control my life. Lead me into deeper fellowship through the power of the Holy Spirit. In Jesus' Name, Amen.",
    readingPlan: "2 Kgs 23-24; Acts 3",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-22",
    title: "Overcoming Gluttony",
    scripture: "Proverbs 23:2",
    verse:
      "And put a knife to thy throat, if thou be a man given to appetite.",
    body: [
      "Gluttony is not simply about eating large amounts of food. At its root, it is the lack of restraint over appetite and desire. Scripture continually teaches the importance of self-control because anything left unchecked can eventually begin to rule the heart.",
      "God created food for nourishment and enjoyment, but appetite was never meant to become a master. When physical cravings constantly dominate a person's decisions, discipline weakens and spiritual sensitivity can slowly decline.",
      "The Bible warns repeatedly about becoming controlled by appetite. Philippians 3:19 speaks of people “whose God is their belly.” This describes more than food alone. It reveals a life driven by cravings rather than by wisdom and spiritual discipline.",
      "Many times, gluttony develops quietly through habits of comfort, emotional eating, stress, boredom, or constant indulgence. What begins as occasional lack of restraint can slowly become dependence. Over time, the flesh grows stronger wherever discipline is neglected.",
      "We are called to live with temperance and self-control. Galatians 5:23 lists temperance as part of the fruit of the Spirit. The word temperance carries the idea of mastery over desires and impulses. Through the Holy Spirit, believers are not meant to live enslaved to appetite.",
      "This is one reason fasting remains valuable in the Christian life. Fasting helps train the body to submit rather than dominate. It reminds the soul that true satisfaction is not found merely in physical consumption but in fellowship with God. Proverbs 25:28 says, “He that hath no rule over his own spirit is like a city that is broken down, and without walls.” A life without restraint becomes spiritually vulnerable.",
      "Freedom from gluttony does not come merely through willpower alone. It grows through spiritual discipline, honesty before God, renewing the mind, and learning to live under the guidance of the Holy Spirit daily. God desires believers to walk in freedom, discipline, and healthy stewardship over the body He has given them.",
    ],
    prayer:
      "Father, thank You for the strength and discipline supplied through the Holy Spirit. Thank You because appetite and desire will not rule over my life. My body is under godly control, and my mind is being renewed by Your Word daily. My life will reflect discipline, restraint, and spiritual sensitivity. In Jesus' Name, Amen.",
    readingPlan: "2 Kgs 25; 1 Chr 1",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-23",
    title: "Stay Connected",
    scripture: "John 15:4",
    verse:
      "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine…",
    body: [
      "Life flows from connection. Just like a phone needs to stay plugged in to remain charged, your spirit needs to stay connected to God to remain strong, clear, and full of life.",
      "Jesus made it simple; you don't have to struggle to produce results on your own. Your responsibility is to stay connected. When you abide in Him, everything else begins to flow naturally: wisdom for decisions, strength in challenges, peace in uncertainty, and direction for your next steps.",
      "There will be moments when life feels overwhelming or distracting. It's easy to drift, to get busy, or to rely on your own strength. But that's when connection matters the most. The more you stay rooted in Him through prayer, through His Word, and through quiet moments of fellowship, the more stable and grounded you become.",
      "“Those who wait on the Lord shall renew their strength…” (Isaiah 40:31). That renewal doesn't come from pushing harder; it comes from staying connected. You don't have to have perfect routines or long hours of prayer to stay connected.",
      "Start where you are. Talk to Him throughout your day. Meditate on His Word. Keep your heart open to Him. Connection is not about performance; it's about relationship.",
      "When you stay connected, you won't run dry. You'll keep growing, keep producing, and keep moving forward with strength that doesn't run out. Stay close. Stay rooted. Stay connected.",
    ],
    prayer:
      "Dear Father, thank You for being my source. I choose to stay connected to You every day. I draw strength, peace, and wisdom from Your presence. I refuse to rely on my own understanding, and I remain rooted in You. My life is fruitful, stable, and full of Your grace, in Jesus' Name. Amen.",
    readingPlan: "1 Chr 2-3; Acts 4",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-24",
    title: "Strength For Every Season",
    scripture: "2 Corinthians 12:9",
    verse:
      "My grace is sufficient for thee: for my strength is made perfect in weakness.",
    body: [
      "Life does not always move through easy seasons. There are moments of pressure, uncertainty, disappointment, and waiting that can leave a person feeling drained mentally, emotionally, and spiritually. Even strong believers sometimes grow tired. But one comforting truth remains constant through every season: God never runs out of strength.",
      "Many people try to handle life entirely through their own ability. They carry burdens silently, fight battles privately, and push themselves until they become weary. God never intended for His children to live that way. His desire is that we learn to depend on His grace daily.",
      "Paul understood this deeply. He faced opposition, hardship, persecution, and moments of weakness, yet he continued moving forward because he discovered that God's strength becomes most evident when human strength reaches its limit. Weakness does not disqualify a believer from God's help. Very often, it becomes the place where His power is experienced most clearly.",
      "This is why prayer is so important during seasons of challenge.",
      "Prayer reminds the heart that we are not helpless. Time in God's presence brings renewal, peace, wisdom, and strength that cannot be produced naturally. Sometimes, God changes the situation immediately. Other times, He strengthens us while we walk through it.",
      "The Bible says in Isaiah 40:31, “They that wait upon the Lord shall renew their strength”. Notice that Scripture does not say they will borrow strength temporarily. It says their strength will be renewed. God knows how to refresh a weary heart. He knows how to restore joy, revive faith, and bring peace in the middle of uncertainty.",
      "No season lasts forever. Difficult moments have an expiration date. God remains faithful through every stage of life, and His grace is sufficient for whatever stands before you today. Do not allow discouragement to convince you that you are alone or forgotten. God is still working in your life even when progress feels slow. His hand is still upon you, and His strength will sustain you through every season.",
    ],
    prayer:
      "Father, thank You for being my strength in every season of life. I declare that I will not be overcome by fear, pressure, discouragement, or weariness. Your grace sustains me daily. My heart is strengthened, my mind is renewed, and my faith remains steady. In Jesus' Name, Amen.",
    readingPlan: "1 Chr 4-5",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-25",
    title: "Strengthened by His Grace",
    scripture: "2 Corinthians 12:9",
    verse:
      "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness",
    body: [
      "There are moments in life when you realize your own strength is not enough. You may have the desire to keep moving forward, yet feel tired, stretched or uncertain within yourself. But one of the beautiful truths of God's Word is this: He never asked you to live the Christian life by your strength. He supplies grace for every season, every assignment and every challenge.",
      "God's grace is more than favour. It is His divine help working in you. It strengthens you when you feel weak, gives wisdom when you do not know what to do and keeps you standing when life becomes difficult. Grace is God helping you do what you could never accomplish by yourself.",
      "Paul understood this: He experienced pressure, hardship and opposition, yet he learned not to depend on himself. Instead, he leaned on the grace of God. That is why he could boldly say, “By the grace of God I am what I am” (1 Corinthians 15:10). Paul knew that every victory in his life was connected to God's grace at work within him.",
      "Sometimes, people could become frustrated because they focus too much on their weaknesses, mistakes or limitations. But God does not relate to you based on your insufficiency. He relates to you through Christ. His grace is available to strengthen and sustain you every single day.",
      "When you become conscious of His grace, the fear begins to lose its grip. You stop depending entirely on your natural ability and start trusting the Spirit of God working in you. Suddenly, things that once felt impossible no longer seem beyond reach.",
      "Grace also changes the way you walk through life. It gives you quiet confidence. You are no longer striving desperately to prove yourself because you know God is working in you and through you. His grace distinguishes your life and causes you to rise above limitations.",
      "Today, refuse to speak weakness or defeat over yourself. Instead, remind yourself that the grace of God is carrying you, strengthening you and preparing you for everything He has called you to do. His grace truly is sufficient for you. Hallelujah!",
    ],
    prayer:
      "Dear Father, thank You for Your grace that strengthens and sustains me daily. I declare that I will not be overwhelmed by challenges, fear or limitation, because Your power is working in me. I walk in confidence today, knowing You are with me and helping me every step of the way, in Jesus' Name. Amen.",
    readingPlan: "1 Chr 6-7; Acts 5",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-26",
    title: "The Benefits Of Fasting",
    scripture: "Matthew 6:17",
    verse:
      "But thou, when thou fastest, anoint thine head, and wash thy face.",
    body: [
      "Fasting has always been an important part of the believer's walk with God. Throughout Scripture, men and women fasted during seasons of prayer, consecration, repentance, direction, and spiritual hunger. Fasting is not a way to force God to move, nor is it a religious exercise meant to impress others. It is a deliberate act of setting aside natural appetites to give greater attention to spiritual things.",
      "In the Bible, the word fasting carries the idea of abstaining from food for a spiritual purpose. It creates room for deeper focus, prayer, meditation on God's Word, and sensitivity to the Holy Spirit. While the body is denied temporarily, the spirit becomes more attentive to God.",
      "One major benefit of fasting is spiritual sensitivity. Life can become noisy and distracting, making it difficult to hear God clearly. Fasting helps quiet the flesh and brings greater awareness to God's voice and direction. Many believers discover renewed clarity during times of fasting because their attention becomes centered on the Lord.",
      "Fasting also strengthens discipline. The flesh naturally desires comfort, pleasure, and immediate satisfaction. Fasting teaches self-control and reminds the believer that spiritual desires must take priority over physical cravings. It develops endurance and helps train the heart toward obedience.",
      "Another benefit of fasting is deeper fellowship with God. Times of prayer often become more meaningful during fasting because the heart is intentionally seeking Him. Scripture becomes more alive, worship becomes more personal, and the believer grows more conscious of God's presence. In many places throughout Scripture, fasting also accompanied seasons of seeking wisdom and direction. Before important decisions or assignments, people sought God through prayer and fasting. It was an expression of dependence upon Him.",
      "Fasting does not make God love you more, and it is not a replacement for obedience or holy living. But it does position the heart to seek Him more sincerely and remove distractions that weaken spiritual focus. Jesus Himself fasted, and He expected believers to practice it with the right attitude. He said, “When ye fast,” not “If ye fast.” This shows that fasting was meant to remain part of the believer's spiritual life. True fasting draws the heart closer to God and strengthens the believer spiritually.",
    ],
    prayer:
      "Father, thank You for your word that has come to me today. Help me to grow in spiritual discipline, sensitivity, and hunger for Your presence. As I seek You through prayer and fasting, strengthen my spirit and align my heart with Your will, in Jesus' Name, Amen.",
    readingPlan: "1 Chr 8-9; Acts 6",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-27",
    title: "Waiting ON God",
    scripture: "1 John 5:14",
    verse:
      "This is the confidence that we have in him, that, if we ask any thing according to his will, he heareth us",
    body: [
      "Waiting on God can feel uncomfortable because the flesh always wants movement. We want answers quickly. We want to understand what God is doing. We want to see change immediately. But some of God's deepest work happens in seasons where nothing appears to be changing outwardly.",
      "Many people in Scripture experienced this. Joseph carried dreams from God while sitting in prison. David was anointed king while still running through wilderness seasons. Abraham received a promise yet waited until his own strength could no longer produce what only God could fulfill. In each of these situations, heaven was still working even when circumstances appeared silent.",
      "Waiting reveals what is happening within the heart. A person may believe they trust God until the season becomes long and uncomfortable. Questions begin to rise. Discouragement tries to settle into the mind. The enemy often attacks heavily during waiting seasons because delay can tempt believers to doubt God's faithfulness. But God does not waste waiting seasons. Sometimes, He is preparing the heart before releasing the promise. Pride is dealt with there. Self-reliance begins to weaken there. Waiting teaches believers how to depend on",
      "God instead of leaning completely on visible signs and human control.",
      "There is something powerful about remaining faithful while nothing appears to be moving. Continuing to pray when answers have not come. Continuing to worship while emotions feel heavy. Continuing to trust God even when the path ahead feels unclear. This kind of faith develops endurance within the believer. Waiting on God is remaining positioned before Him without forcing things to happen through fleshly effort. Many people create unnecessary struggles because they become impatient and move ahead of God's timing. But what God establishes in His timing carries peace and stability.",
      "The beautiful thing about God is that He continues working behind the scenes even when we cannot see it. He knows how to align circumstances, prepare hearts, and open doors at the appointed time. What appears delayed is often divine preparation. God never forgets His promises. And when the season of waiting has accomplished its work, strength begins to rise again, and the believer begins to realize that God was faithful through every moment of the process.",
    ],
    prayer:
      "Father, teach me to trust You in every waiting season. I declare that discouragement, fear, frustration, and doubt will not rule my heart. My strength is being renewed as I wait upon the Lord, in Jesus' Name. Amen.",
    readingPlan: "1 Chr 10-11",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-28",
    title: "The Secret Of The Lord",
    scripture: "Psalm 25:14",
    verse:
      "The secret of the Lord is with them that fear him; and he will show them his covenant.",
    body: [
      "There are things God reveals only in closeness. Not everything about God is discovered in crowds. Some things are learned quietly in fellowship with Him. There is a depth of understanding that comes when you consistently spend time in God's presence. This is what the Scripture refers to as “the secret of the Lord.”",
      "Many people know about God, but God desires more than occasional acknowledgment. He desires relationship. He wants you to walk with Him closely enough to recognize His voice, understand His heart, and become sensitive to His leading. Throughout Scripture, the people who had deep revelations of God were people who walked with God closely. Moses remained on the mountain with Him. David sought God continually. Daniel prayed until understanding came. John leaned on Jesus closely. These were not perfect men, but they valued fellowship with God.",
      "The secret place changes a person gradually. Certain things that once distracted you begin losing their hold because your heart becomes more aware of God's presence. Intimacy with God has a way of making spiritual things feel real.",
      "The fear of the Lord is connected to this kind of closeness. It is not fear that pushes you away from God. People who fear the Lord begin to guard their hearts differently because they value their relationship with Him.",
      "Many people want revelation, but revelation flows from relationship. There are things God teaches in private that cannot be learned through information alone. Sometimes, one moment in prayer can bring clarity that removes confusion instantly. God knows how to speak to the heart that becomes still before Him.",
      "The beautiful thing about intimacy with God is that it affects every part of life. It brings wisdom during uncertainty. It brings peace during difficult seasons. It brings correction when the heart begins drifting. The closer a believer walks with God, the more sensitive they become to His Spirit. God still desires closeness with His people today. He still speaks to those who make room for Him. And often, the deepest things God shares are reserved for those who choose to stay near.",
    ],
    prayer:
      "Father, let my heart remain tender to Your presence. I declare that I will walk closely with you and grow in spiritual understanding. Teach me Your ways and help me recognize Your voice clearly. Every distraction that weakens my fellowship with You loses its hold over my life. In Jesus' Name. Amen.",
    readingPlan: "1 Chr 12-14; Acts 7",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-29",
    title: "Understanding The Anointing",
    scripture: "1 John2:20",
    verse:
      "But ye have an unction from the Holy One, and ye know all things.",
    body: [
      "Many people use the terms Holy Spirit and anointing interchangeably, but they are not exactly the same. Understanding the difference will strengthen your walk with God and increase your spiritual effectiveness.",
      "The Holy Spirit is the third Person of the Trinity. He is not a force, not a feeling, and not power; He is God Himself dwelling in the believer. Jesus promised the coming of the Holy Spirit in John14:16–17, calling Him the Comforter who would abide with us forever. When you received Christ, the Holy Spirit came to live in you. He guides, teaches, corrects, strengthens, and reveals truth. He is a divine Person with will, mind, and emotion.",
      "The anointing, however, is the manifestation of the Holy Spirit's power and grace in and through your life. It is the effect of His presence. If the Holy Spirit is the Person, the anointing is His expressed power. Acts 10:38 says, “God anointed Jesus of Nazareth with the Holy Spirit and with power”. Notice the distinction: the Holy Spirit is the One who anoints; the anointing is the empowerment that flows from Him.",
      "You don't receive “pieces” of the Holy Spirit. He is given without measure (John 3:34). But the expression of His anointing in your life can grow. As you yield more, pray more, study more, and obey more, the anointing becomes more evident and effective. It is not that you receive more of the Spirit; it is that the Spirit has more of you.",
      "Think of it like this: electricity in a building is constant, but the brightness of the light depends on connection and capacity. The Holy Spirit is the constant divine presence; the anointing is the light that shines as you stay connected and yielded.",
      "So don't chase an anointing; cultivate intimacy with the Holy Spirit. Fellowship with Him. As you do, His power will flow naturally through your life, bringing wisdom, boldness, healing, influence and impact.",
    ],
    prayer:
      "Father, thank You for the gift of the Holy Spirit who lives in me. I honor Him as a divine Person and yield to His leading daily. Let Your anointing flow freely through my life as I grow in fellowship and yeildedness to your Spirit. In Jesus' Name, Amen.",
    readingPlan: "1 Chr 15-16",
    author: "Apostle Chuks",
  },
  {
    date: "2026-06-30",
    title: "Walking In Wisdom",
    scripture: "James 1:5",
    verse:
      "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not.",
    body: [
      "In Scripture, wisdom is more than intelligence or human reasoning. The Greek word used for wisdom here is sophia, which speaks of insight, understanding, sound judgment, and the ability to live according to God's truth. It is not merely knowing information. It is knowing how to live rightly before God.",
      "Many people are educated yet still struggle in life because wisdom is different from knowledge. Knowledge gathers facts. Wisdom applies truth correctly. Wisdom helps a person speak carefully, make sound decisions, handle relationships properly, and respond to situations with discernment.",
      "God desires His children to walk in wisdom daily. Life presents many choices, and not every open door is the right one. Without wisdom, emotions can control decisions. Pressure can lead to haste. Pride can blind judgment. But wisdom brings clarity, stability, and direction.",
      "James tells believers to ask God for wisdom because He gives generously. God is willing to guide those who seek Him sincerely. He does not ignore the believer who desires direction. Through His Word and the leading of the Holy Spirit, He teaches His children how to walk rightly. The Bible also says, “The fear of the Lord is the beginning of wisdom” (Proverbs 9:10). The word fear here does not mean terror. It speaks of reverence, honor, and deep respect for God. True wisdom begins when a person values God's voice above personal opinion.",
      "Jesus walked in perfect wisdom during His earthly ministry. He knew when to speak and when to remain silent. He responded to people with grace, truth, discernment, and compassion. Even His enemies recognized there was something different about the wisdom He carried.",
      "Wisdom also protects a believer. It keeps a person from unnecessary battles, careless words, destructive relationships, and harmful decisions. Many difficulties in life can be avoided through patience, prayer, and godly discernment. As believers, we must learn to slow down and seek God before making decisions. Wisdom grows through prayer, meditation on Scripture, humility, and obedience. The more a person walks with God, the more their life begins to reflect His understanding and direction.",
    ],
    prayer:
      "Father, thank You for giving me wisdom through Your Word and by Your Spirit. I declare that my mind is guided by truth and understanding. I will not be ruled by confusion, pride, or impulse. My decisions will reflect godly discernment, patience, and sound judgment. In Jesus' Name, Amen.",
    readingPlan: "1 Chr 17-20; Acts 8",
    author: "Apostle Chuks",
  },
];

/* -------------------------------------------------------------------------
 * PLACEHOLDER LIBRARY
 * Auto-generates one devotional per day for the year below so the archive is
 * populated. Delete or shrink this once real content fills the array above.
 * ---------------------------------------------------------------------- */
export const DEVOTIONAL_YEAR = 2026;

const TEMPLATES = [
  {
    title: "The Word Settles It",
    scripture: "Psalm 119:89",
    verse: "For ever, O LORD, thy word is settled in heaven.",
    theme: "Let the Word, not your circumstances, define what is true about your day.",
  },
  {
    title: "Grace for Today",
    scripture: "2 Corinthians 12:9",
    verse: "My grace is sufficient for thee: for my strength is made perfect in weakness.",
    theme: "God's supply always matches the demand of the day He has given you.",
  },
  {
    title: "Walking in Purpose",
    scripture: "Ephesians 2:10",
    verse: "For we are his workmanship, created in Christ Jesus unto good works.",
    theme: "You were prepared for the works God prepared for you — nothing about you is accidental.",
  },
  {
    title: "The Discipline of Prayer",
    scripture: "1 Thessalonians 5:17",
    verse: "Pray without ceasing.",
    theme: "Prayer is not an interruption of your day; it is the thread that holds it together.",
  },
  {
    title: "Rest for the Weary",
    scripture: "Matthew 11:28",
    verse: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    theme: "Rest is not the reward for finishing; it is the place from which you work.",
  },
  {
    title: "Guarding Your Heart",
    scripture: "Proverbs 4:23",
    verse: "Keep thy heart with all diligence; for out of it are the issues of life.",
    theme: "What you allow into your heart eventually shapes the direction of your life.",
  },
  {
    title: "Your Inheritance in Christ",
    scripture: "Colossians 1:12",
    verse: "Giving thanks unto the Father, which hath made us meet to be partakers of the inheritance.",
    theme: "You do not beg for what has already been handed to you — you take hold of it.",
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function generated(): Devotional[] {
  const out: Devotional[] = [];
  for (let m = 1; m <= 12; m += 1) {
    const days = new Date(Date.UTC(DEVOTIONAL_YEAR, m, 0)).getUTCDate();
    for (let d = 1; d <= days; d += 1) {
      const t = TEMPLATES[(m + d) % TEMPLATES.length]!;
      out.push({
        date: `${DEVOTIONAL_YEAR}-${pad(m)}-${pad(d)}`,
        title: t.title,
        scripture: t.scripture,
        verse: t.verse,
        body: [
          t.theme,
          "Take a few quiet minutes this morning to read the passage slowly. Ask the Holy Spirit to show you one sentence to carry through the day.",
          "Then act on it. Truth that is not obeyed quickly becomes truth that is forgotten.",
        ],
        prayer:
          "Father, thank You for Your Word today. Help me to believe it, obey it and walk in it. In Jesus' name, amen.",
        declarations: [
          "I am led by the Spirit of God today.",
          "The Word of God is working mightily in me.",
        ],
        readingPlan: `Psalm ${((m + d) % 150) + 1}`,
        author: "FLC USA",
      });
    }
  }
  return out;
}

/** Every devotional available on the site — real entries override placeholders. */
export const ALL_DEVOTIONALS: Devotional[] = (() => {
  const map = new Map<string, Devotional>();
  for (const d of generated()) map.set(d.date, d);
  for (const d of DEVOTIONALS) map.set(d.date, d);
  return [...map.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
})();

/**
 * MONTHLY PDF ARCHIVE
 * Upload the PDF into `public/devotional-pdfs/` using the filename below,
 * then set `available: true` so the download link activates.
 */
export type DevotionalPdf = { month: string; label: string; file: string; available: boolean };

export const DEVOTIONAL_PDFS: DevotionalPdf[] = Array.from({ length: 12 }, (_, i) => {
  const month = `${DEVOTIONAL_YEAR}-${pad(i + 1)}`;
  return {
    month,
    label: new Date(Date.UTC(DEVOTIONAL_YEAR, i, 1)).toLocaleDateString("en-US", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    }),
    file: `/devotional-pdfs/${month}.pdf`,
    available: month === "2026-06",
  };
});

/** The devotional for a date, falling back to the most recent one available. */
export function getDevotional(date: string): Devotional {
  const exact = ALL_DEVOTIONALS.find((d) => d.date === date);
  if (exact) return exact;
  const previous = (ALL_DEVOTIONALS.find((d) => d.date <= date) ?? ALL_DEVOTIONALS[0]) as Devotional;
  return { ...previous, date };
}

export function getPdfForDate(date: string): DevotionalPdf | undefined {
  return DEVOTIONAL_PDFS.find((p) => p.month === date.slice(0, 7));
}

/** All devotionals in a given "YYYY-MM", oldest first. */
export function devotionalsForMonth(month: string): Devotional[] {
  return ALL_DEVOTIONALS.filter((d) => d.date.startsWith(month)).sort((a, b) =>
    a.date < b.date ? -1 : 1,
  );
}

export function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, 1)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
}

export function formatDevotionalDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}