# BoloBazaar — Test Scenarios
## 10+ Call Scripts for QA Testing (Hindi / English / Hinglish)

---

## How to Use These Scripts

Each test scenario includes:
- **Scenario**: What's being tested
- **Language**: Hindi / English / Hinglish
- **Test purpose**: Which aspect of the agent is being validated
- **Call script**: Customer lines + expected agent responses
- **Success criteria**: What must happen for the test to pass
- **Failure modes**: What to look for as bugs

Run each test using the voice agent in a sandbox call environment. Mark PASS/FAIL.

---

## Test 1: Simple Order — 2 Items (English)

| Field | Value |
|---|---|
| **Scenario** | Customer orders 2 items in clear English |
| **Language** | English |
| **Test purpose** | Basic order flow, item recognition, confirmation |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | "Hello! Welcome to Sharma Kirana. I'm BoloBazaar — I'm here to help you. Could you please tell me your name?" |
| 2 | Customer | "Yes, this is Rajesh from Sector 12." |
| 3 | Agent | "Thank you, Rajesh ji! What would you like to order today?" |
| 4 | Customer | "I need 2 kg of wheat flour and 1 litre of mustard oil." |
| 5 | Agent | "I got that — 2 kg of wheat flour and 1 litre of mustard oil. Let me confirm one at a time. 2 kg of wheat flour — is that correct?" |
| 6 | Customer | "Yes, correct." |
| 7 | Agent | "Good. And 1 litre of mustard oil — correct?" |
| 8 | Customer | "Yes." |
| 9 | Agent | "Anything else you need?" |
| 10 | Customer | "No, that's it." |
| 11 | Agent | "Great! Where should this be delivered?" |
| 12 | Customer | "Sector 12, near the park, house number 45." |
| 13 | Agent | "And what time would you like delivery — today or tomorrow?" |
| 14 | Customer | "Today evening, around 6 PM." |
| 15 | Agent | "Let me repeat your order, Rajesh ji: 2 kg of wheat flour and 1 litre of mustard oil, delivered to Sector 12, near the park, house number 45, today by 6 PM. Is everything correct?" |
| 16 | Customer | "Yes, all correct." |
| 17 | Agent | "Excellent! Your order is confirmed. Aapka order confirm ho gaya hai. Thank you for calling Sharma Kirana. Have a great day, namaste!" |

**Success Criteria:**
- All items accurately recognized
- Quantities correctly captured
- Address and time captured
- Full order repeated back correctly

**Failure Modes:**
- Agent misses one of the two items
- Quantities swapped between items
- Confirmation step skipped

---

## Test 2: Simple Order — 3 Items (Hindi)

| Field | Value |
|---|---|
| **Scenario** | Customer orders 3 items in pure Hindi |
| **Language** | Hindi (pure) |
| **Test purpose** | Hindi-only conversation flow, no English word leakage |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | "Namaste! Sharma Kirana mein aapka swagat hai. Main BoloBazaar bol raha hoon. Aap kahan se bol rahe hain, aapka naam kya hai?" |
| 2 | Customer | "Mera naam Sushma hai. Mai Patel Nagar se bol rahi hoon." |
| 3 | Agent | "Dhanyavaad Sushma ji! Aap kya order karna chahengi?" |
| 4 | Customer | "Mujhe 2 kilo aata chahiye, 1 kilo chawal aur aadha kilo mithai." |
| 5 | Agent | "Sushma ji, aapne 2 kilo aata, 1 kilo chawal aur aadha kilo mithai bataya hai. Ek ek karke lete hain. Pehle 2 kilo aata — sahi hai na?" |
| 6 | Customer | "Haan, sahi hai." |
| 7 | Agent | "Achha. 1 kilo chawal — sahi?" |
| 8 | Customer | "Haan." |
| 9 | Agent | "Aur aadha kilo mithai — sahi?" |
| 10 | Customer | "Haan ji." |
| 11 | Agent | "Bahut achha. Aur kuch chahiye?" |
| 12 | Customer | "Bas, itna hi." |
| 13 | Agent | "Theek hai. Yeh samaan kahan pahunchaana hai?" |
| 14 | Customer | "Patel Nagar, gali no 5, ghar no 23." |
| 15 | Agent | "Kab tak chahiye — aaj ya kal?" |
| 16 | Customer | "Aaj shaam tak." |
| 17 | Agent | "Sushma ji, mai ek baar aapka aadesh dohraati hoon: 2 kilo aata, 1 kilo chawal, aadha kilo mithai — Patel Nagar, gali no 5, ghar no 23 par aaj shaam tak pahunchaana hai. Sab sahi hai na?" |
| 18 | Customer | "Haan, sab sahi hai." |
| 19 | Agent | "Dhanyavaad Sushma ji! Aapka aadesh pakka ho gaya hai. Sharma Kirana ki taraf se jald hi pahuncha denge. Shukriya, namaste!" |

**Success Criteria:**
- Entire conversation in Hindi (no English words like "order", "delivery", "confirm" from agent)
- Agent uses "aap", "ji" — polite respectful Hindi
- Quantities correctly parsed (aadha kilo = 0.5 kg)
- All three items captured and confirmed

**Failure Modes:**
- Agent uses English words mid-conversation
- "aadha kilo" parsed incorrectly
- Agent fails to use respectful Hindi

---

## Test 3: Out of Stock — Suggest Alternative (Hinglish)

| Field | Value |
|---|---|
| **Scenario** | Item is out of stock, agent suggests alternatives |
| **Language** | Hinglish |
| **Test purpose** | Stock-checking logic, alternative suggestion flow, customer acceptance |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | "Namaste! Verma General Store mein aapka swagat hai. Main BoloBazaar hoon. Aap kahan se bol rahe hain aur aapka naam?" |
| 2 | Customer | "Ha, main Vikram hoon, Indira Nagar se." |
| 3 | Agent | "Dhanyavaad Vikram ji! Kya order karna chahenge?" |
| 4 | Customer | "Mujhe 5 litre Sarson ka tel chahiye." |
| 5 | Agent | *(checking inventory — mustard oil out of stock)* "Maaf kijiye Vikram ji, sarson ka tel abhi stock mein nahi hai. Lekin refined oil ₹160 per litre aur sunflower oil ₹140 per litre maujood hai. Aap inmein se kya lena chahenge?" |
| 6 | Customer | "Achha... Refined oil kitne ka hai?" |
| 7 | Agent | "Refined oil ₹160 per litre hai. Aap kitna lena chahenge?" |
| 8 | Customer | "Theek hai, 5 litre refined oil de do." |
| 9 | Agent | "5 litre refined oil — sahi hai na?" |
| 10 | Customer | "Haan sahi hai." |
| 11 | Agent | "Aur kuch chahiye?" |
| 12 | Customer | "Bas." |
| 13 | Agent | *(continues with delivery flow)* |

**Success Criteria:**
- Agent correctly identifies out-of-stock item
- Agent suggests 2 alternatives naturally
- Customer's price query answered correctly
- Alternative accepted and order proceeds

**Failure Modes:**
- Agent says "sorry item not available" without suggesting alternatives
- Agent suggests only 1 alternative instead of options
- Agent can't answer price query for the alternative
- Agent forgets to confirm the substituted item separately

---

## Test 4: Out of Stock — Alternative Refused (Hindi)

| Field | Value |
|---|---|
| **Scenario** | Customer rejects both alternatives for out-of-stock item |
| **Language** | Hindi |
| **Test purpose** | Graceful handling when customer refuses alternatives |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | "Namaste! Gupta Kirana mein..." *(standard greeting)* |
| 2 | Customer | "Mujhe 1 packet namkeen chahiye, Haldiram's." |
| 3 | Agent | *(checking — Haldiram's namkeen out of stock)* "Maaf kijiye, Haldiram's namkeen abhi nahi hai. Lekin Bikaji aur Lehar namkeen maujood hai. Kya aap yeh lena chahenge?" |
| 4 | Customer | "Nahi, nahi. Mujhe sirf Haldiram's chahiye." |
| 5 | Agent | "Koi baat nahi. Kya aapko kuch aur chahiye?" |
| 6 | Customer | "Nahi, bas itna hi tha." |
| 7 | Agent | "Theek hai. Aaj kuch order save nahi kiya. Agar baad mein zaroorat ho toh phone kar lijiye. Dhanyavaad, namaste!" |

**Success Criteria:**
- Agent doesn't pressure customer
- Accepts "nahi" gracefully
- Doesn't save partial order
- Ends call politely

**Failure Modes:**
- Agent keeps pushing alternatives after refusal
- Agent creates an order with the out-of-stock item anyway

---

## Test 5: Fast/Slurred Speech (English)

| Field | Value |
|---|---|
| **Scenario** | Customer speaks very fast, possibly unclear |
| **Language** | English (fast) |
| **Test purpose** | Agent's ability to handle rapid speech and ask for clarification |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | *(greeting)* |
| 2 | Customer | *(speaking very fast)* "Hineed2kgatta1ltrrefinedoiland500gmtoordaland3packetsmaggi." |
| 3 | Agent | "I'm sorry, you're speaking a bit fast. Could you please tell me one item at a time? What would you like first?" |
| 4 | Customer | *(slightly slower)* "2 kg atta." |
| 5 | Agent | "2 kg atta — correct?" |
| 6 | Customer | "Yes. And 1 litre refined oil." |
| 7 | Agent | "1 litre refined oil — correct." |
| 8 | Customer | "And 500 gm toor dal." |
| 9 | Agent | "500 grams of toor dal — correct?" |
| 10 | Customer | "Yes, and 3 packets Maggi." |
| 11 | Agent | "3 packets Maggi — correct. Anything else?" |
| 12 | Customer | "That's all." |
| 13 | Agent | *(continues with delivery flow)* |

**Success Criteria:**
- Agent detects fast speech and asks customer to slow down
- All items correctly captured once customer slows
- One-at-a-time technique works

**Failure Modes:**
- Agent hallucinates items from the fast speech (e.g., "Hineed" → misrecognized)
- Agent doesn't ask customer to slow down
- Agent misses items

---

## Test 6: Mixed Language Order (Hinglish)

| Field | Value |
|---|---|
| **Scenario** | Customer mixes Hindi and English freely in same sentences |
| **Language** | Hinglish |
| **Test purpose** | Code-switching, mixed-language parsing |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | *(Hindi greeting)* |
| 2 | Customer | "Haan ji, main Amit. Mujhe kuch grocery items order karne hain." |
| 3 | Agent | "Bataaiye Amit ji, kaunsi cheezein chahiye?" |
| 4 | Customer | "Ek kilo toor dal do, aur 2 packet namkeen — Haldiram's wala." |
| 5 | Agent | "Pehle 1 kilo toor dal — sahi hai na?" |
| 6 | Customer | "Yes, correct." |
| 7 | Agent | "Aur 2 packet Haldiram's namkeen — sahi?" |
| 8 | Customer | "Haan, and also 1 litre milk." |
| 9 | Agent | "1 litre milk — theek hai? Koi specific brand?" |
| 10 | Customer | "Amul hi theek hai." |
| 11 | Agent | "Amul milk, 1 litre — add kar diya. Aur kuch?" |
| 12 | Customer | "Bas. Itna hi. And jaldi delivery karna." |
| 13 | Agent | "Delivery address bataaiye." |
| 14 | Customer | "Same address — Ganga Nagar, near the temple. Time: today hi." |
| 15 | Agent | *(repeats order in mix of Hindi+English)* "1 kilo toor dal, 2 packet Haldiram's namkeen, 1 litre Amul milk — Ganga Nagar, temple ke paas — aaj deliver. Sab sahi hai?" |
| 16 | Customer | "Haan, all good." |

**Success Criteria:**
- Agent responds in matching Hinglish (doesn't flip to pure Hindi or pure English)
- Mixed-language items correctly parsed ("toor dal" in Hindi, "milk" in English, "packet" in Hindi context)
- Brand name "Amul" correctly associated with "milk"

**Failure Modes:**
- Agent switches entirely to English or Hindi
- Agent fails to associate brand with product
- "Same address" not handled — agent should know previous orders or ask for it

---

## Test 7: Customer Who Speaks Only Hindi (Elderly)

| Field | Value |
|---|---|
| **Scenario** | Elderly customer, pure Hindi, speaks slowly, uses traditional names for items |
| **Language** | Pure Hindi |
| **Test purpose** | Handling pure Hindi with traditional ingredient names |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | *(Hindi greeting)* |
| 2 | Customer | "Beta, mujhe kuch samaan chahiye. Mera naam Shyam Lal hai, purani basti se." |
| 3 | Agent | "Shyam Lal ji, aap kya lena chahenge?" |
| 4 | Customer | "Mujhe gehu ka aata chahiye, mota wala, 5 kilo. Aur ghee chaahiye, shuddh ghee — ek kilo." |
| 5 | Agent | "5 kilo gehu ka aata, mota wala — sahi hai?" |
| 6 | Customer | "Haan beta, sahi hai." |
| 7 | Agent | "Aur 1 kilo shuddh ghee — sahi?" |
| 8 | Customer | "Haan, lekin ghee mein desi ghee se matlab hai, Dalda nahi." |
| 9 | Agent | "Haan Shyam Lal ji, 1 kilo desi ghee — add kar diya. Aur kuch?" |
| 10 | Customer | "Haan, thode aloo bhi de do... 2 kilo." |
| 11 | Agent | "2 kilo aloo — sahi hai?" |
| 12 | Customer | "Haan." |
| 13 | Agent | "Aur kuch chahiye?" |
| 14 | Customer | "Bas, ho gaya." |
| 15 | Agent | *(order summary and delivery flow)* |
| 16 | Customer | "Mera pata: purani basti, kacheri ke saamne, lal gate ke paas, Mota Singh ke makaan ke upar." |
| 17 | Agent | "Purani basti, kacheri ke saamne, lal gate ke paas — sahi hai? Kab tak chahiye?" |
| 18 | Customer | "Kal subah 9 baje tak." |
| 19 | Agent | *(full confirmation in pure Hindi)* |

**Success Criteria:**
- Agent maintains respectful tone ("beta" is elder calling younger — OK, no need to correct)
- No English words used by agent
- "Desi ghee" vs "Dalda" distinction understood
- Traditional address format (landmarks, neighbors' houses) accepted

**Failure Modes:**
- Agent inserts English words
- Agent asks for pincode/house number (irrelevant for this demographic)
- Agent doesn't understand "mota wala" (coarse) as a modifier for atta

---

## Test 8: Customer Who Speaks Only English

| Field | Value |
|---|---|
| **Scenario** | Customer speaks only English, formal tone |
| **Language** | English |
| **Test purpose** | Pure English flow, formal register |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | *(Hindi greeting)* |
| 2 | Customer | "Hello? Do you speak English?" |
| 3 | Agent | "Yes, absolutely! Welcome to Sharma Kirana. I'm BoloBazaar, your order assistant. May I have your name and location, please?" |
| 4 | Customer | "My name is Priya Mehta. I'm calling from Green Valley Apartments." |
| 5 | Agent | "Thank you, Ms. Mehta. What would you like to order today?" |
| 6 | Customer | "I need organic eggs — one dozen. Also, 500 grams of cheddar cheese and a loaf of brown bread." |
| 7 | Agent | "Let me confirm each item. One dozen organic eggs — correct?" |
| 8 | Customer | "Yes." |
| 9 | Agent | "500 grams of cheddar cheese — correct?" |
| 10 | Customer | "Yes." |
| 11 | Agent | "And one loaf of brown bread — correct?" |
| 12 | Customer | "That's right." |
| 13 | Agent | "Anything else?" |
| 14 | Customer | "No, that will be all." |
| 15 | Agent | "Where should this be delivered?" |
| 16 | Customer | "Green Valley Apartments, Tower B, Flat 302." |
| 17 | Agent | "And preferred delivery time?" |
| 18 | Customer | "Tomorrow morning, between 8 and 9 AM." |
| 19 | Agent | *(full order summary in English)* |

**Success Criteria:**
- Agent detects English and switches fully to English
- Formal register maintained ("Ms. Mehta", proper grammar)
- Western grocery items (cheddar cheese, brown bread, organic eggs) recognized correctly

**Failure Modes:**
- Agent continues in Hindi after customer says "Do you speak English?"
- Agent uses "ji" suffix with English-only customer
- Agent misidentifies "brown bread" or doesn't parse "one dozen"

---

## Test 9: Vague Quantities

| Field | Value |
|---|---|
| **Scenario** | Customer uses vague/vague quantities like "thoda sa", "do-teen kg" |
| **Language** | Hindi/Hinglish |
| **Test purpose** | Clarifying vague quantities without annoying customer |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1-3 | Agent | *(greeting + asking)* |
| 4 | Customer | "Mujhe thoda sa chawal chahiye." |
| 5 | Agent | "Chawal — sahi hai. Aap roughly kitna lenge? Jaise — ek kilo, do kilo, ya aadha kilo? Bataaiye." |
| 6 | Customer | "Do-teen kilo kar do." |
| 7 | Agent | "Theek teen kilo ya do kilo? Kya final hai?" |
| 8 | Customer | "Do kilo rakh do." |
| 9 | Agent | "2 kilo chawal — sahi hai. Aur kuch?" |
| 10 | Customer | "Haan, kuch aloo bhi de do. Thode se." |
| 11 | Agent | "Aloo — roughly kitne kilo? Ek kilo, do kilo?" |
| 12 | Customer | "Bas do-teen aloo — gin ke." |
| 13 | Agent | "Theek hai — 3 aloo? Ya 4? Bataaiye." |
| 14 | Customer | "4 aloo de do." |
| 15 | Agent | "4 aloo — add kar diye. Aur kuch?" |

**Success Criteria:**
- "thoda sa" → agent asks for rough quantity without being rude
- "do-teen kg" → agent resolves ambiguity to exact "do kg"
- "thode se aloo" (countable vs uncountable) → agent correctly switches to pieces/units
- Customer not annoyed by clarifications

**Failure Modes:**
- Agent accepts "do-teen kg" without clarification
- Agent treats "thode se aloo" as kg instead of pieces
- Agent asks too many times or sounds robotic

---

## Test 10: Customer Asking About Prices (Multiple Items)

| Field | Value |
|---|---|
| **Scenario** | Customer asks price for every item before ordering |
| **Language** | Hinglish |
| **Test purpose** | Price inquiry handling, price memory, ordering after pricing |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1-3 | Agent | *(greeting)* |
| 4 | Customer | "Aata kitne ka hai?" |
| 5 | Agent | "Aata ₹32 per kilo hai. Aap kitna lenge?" |
| 6 | Customer | "Achha. Chawal kitne ka?" |
| 7 | Agent | "Chawal ₹85 per kilo. Bataaiye, kitna chahiye?" |
| 8 | Customer | "Tel kitne ka?" |
| 9 | Agent | "Kaunsa tel? Sarson tel ₹180, refined ₹160, sunflower ₹140 per litre." |
| 10 | Customer | "Achha achha. Do kilo atta, ek kilo chawal, aur ek litre sarson tel." |
| 11 | Agent | "2 kilo aata — ₹32 per kilo se total ₹64. Ek kilo chawal — ₹85. Aur 1 litre sarson tel — ₹180. Total approximately ₹329. Sahi hai?" |
| 12 | Customer | "Haan, theek hai." |
| 13 | Agent | *(continues with per-item confirmation)* |

**Alternative branch — Agent doesn't know price:**
| 9 | Customer | "Gold Winner oil kitne ka hai?" |
| 10 | Agent | "Ji, iska exact daam mujhe nahi pata. Agar aap order de dete hain toh main store owner se confirm kar ke aapko bata dunga." |

**Success Criteria:**
- Agent answers each price query correctly
- Agent tracks prices across multiple items
- After last price query, agent summarizes total when confirming
- For unknown prices, agent is honest and offers to check

**Failure Modes:**
- Agent forgets previously quoted prices
- Agent ignores price query and keeps asking "what do you want"
- Agent makes up a price when unsure

---

## Test 11: Customer Changing Mind Mid-Order

| Field | Value |
|---|---|
| **Scenario** | Customer adds item, then removes it, changes quantity midway |
| **Language** | Hinglish |
| **Test purpose** | Edit/cancellation during active order flow |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1-5 | Agent | *(greeting + first items ordered)* |
| 6 | Customer | "2 kilo aata." |
| 7 | Agent | "2 kilo aata — sahi hai." |
| 8 | Customer | "Haan, aur 1 kilo cheeni." |
| 9 | Agent | "1 kilo cheeni — sahi hai." |
| 10 | Customer | "Haan... nahi nahi, cheeni nahi, wo 500 gram matlab aadha kilo." |
| 11 | Agent | "Theek hai, aadha kilo cheeni — update kar diya." |
| 12 | Customer | "Haan. Aur ek aur cheez — namak. Pakka 1 kilo." |
| 13 | Agent | "1 kilo namak — sahi hai." |
| 14 | Customer | "Ruko... aata 2 kilo nahi, 3 kilo karo." |
| 15 | Agent | "Theek hai — aata 2 kilo se 3 kilo kar diya." |
| 16 | Customer | "Haan. Aur cheeni nahi chahiye. Hata do." |
| 17 | Agent | "Cheeni hata di. Ab aapke order mein hai: 3 kilo aata aur 1 kilo namak. Sahi hai?" |
| 18 | Customer | "Haan, sahi hai." |

**Success Criteria:**
- Agent handles mid-order quantity change (2kg→3kg)
- Agent handles partial cancellation (remove cheeni)
- Agent gives clean updated summary after changes
- No confusion or double-counting

**Failure Modes:**
- Agent adds cheeni AND aadha kilo cheeni (double entry)
- Agent doesn't update when customer cancels an item
- Agent gets confused by multiple edits and gives wrong summary

---

## Test 12: Wrong Number / Confused Caller

| Field | Value |
|---|---|
| **Scenario** | Caller has dialed wrong number or is confused about why someone answered |
| **Language** | Hindi |
| **Test purpose** | Wrong number detection and graceful exit |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | *(Hindi greeting — "Namaste! Sharma Kirana mein...")* |
| 2 | Customer | "Kaun? Kaun bol raha hai? Ye kya hai?" |
| 3 | Agent | "Main Sharma Kirana ki taraf se BoloBazaar bol raha hoon — order lene wala assistant. Kya aapne yahan phone kiya tha?" |
| 4 | Customer | "Nahi nahi, maine toh kisi aur ko phone kiya tha." |
| 5 | Agent | "Maaf kijiye, galti ho gayi. Aap apna kaam karein. Dhanyavaad, namaste!" |
| 6 | — | *(call ends)* |

**Alternative — confused about AI:**
| 4 | Customer | "Yeh kaunsa naya system hai? Muje dukaan waale se baat karni hai." |
| 5 | Agent | "Maaf kijiye. Main ek minute mein store owner ko bataata hoon. Kripya line pe rahiye." |
| 6 | — | *(human handoff triggered)* |

**Success Criteria:**
- Agent doesn't argue with wrong-number caller
- Graceful, polite exit
- Confused caller → human handoff triggered, not argued with

**Failure Modes:**
- Agent tries to sell to wrong-number caller
- Agent argues "no, you called this number"
- Agent doesn't recognize confused caller and keeps asking for orders

---

## Test 13: Customer Wants to Cancel Entire Order Mid-Call

| Field | Value |
|---|---|
| **Scenario** | Customer decides they don't want anything after starting order |
| **Language** | Hinglish |
| **Test purpose** | Full cancellation mid-flow |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1-6 | Agent | *(greeting, already has 2 items recorded)* |
| 7 | Agent | "Aur kuch chahiye?" |
| 8 | Customer | "Nahi yaar, cancel karo. Baad mein order karunga." |
| 9 | Agent | "Pura order cancel karna chahenge ya sirf aakhri wali cheez?" |
| 10 | Customer | "Pura cancel." |
| 11 | Agent | "Theek hai, maine koi order save nahi kiya. Aap kabhi bhi phone kar sakte hain. Dhanyavaad, namaste!" |

**Success Criteria:**
- Agent confirms full vs partial cancel
- No order saved
- Ends politely without pressure

**Failure Modes:**
- Agent argues or tries to convince customer to continue
- Agent partially saves the order despite full cancellation
- Agent sounds annoyed

---

## Test 14: Very Long Order (10+ items)

| Field | Value |
|---|---|
| **Scenario** | Customer orders many items for monthly grocery |
| **Language** | Hinglish |
| **Test purpose** | Memory/accuracy over long conversations, patience |

**Call Script:**
*(Customer orders: atta, chawal, toor dal, moong dal, sugar, tea, cooking oil, biscuits, soap, detergent, toothpaste, and 4 more)*

**Critical Checkpoints:**
- Agent confirms each item one at a time
- Agent doesn't get confused or drop items
- Order summary includes ALL items correctly
- Agent maintains same energy throughout (doesn't sound tired/impatient)

**Success Criteria:**
- All 10+ items captured
- Summary matches what was ordered
- No hallucinations of items not ordered

**Failure Modes:**
- Agent drops items from middle of list
- Summary misses items
- Agent sounds rushed/impatient

---

## Test 15: Background Noise / Distorted Audio

| Field | Value |
|---|---|
| **Scenario** | Customer calling from a noisy environment (market, street, TV on) |
| **Language** | Hindi |
| **Test purpose** | Noise resilience, error recovery |

**Call Script:**

| Turn | Speaker | Dialogue |
|---|---|---|
| 1 | Agent | *(greeting)* |
| 2 | Customer | *(background noise - TV/music)* "Haan bhai, [unclear] kilo [unclear] chahiye." |
| 3 | Agent | "Maaf kijiye, background mein bahut awaaz aa rahi hai. Kya aap thoda aaram se bata sakte hain?" |
| 4 | Customer | *(louder, clearer)* "Haan, do kilo aata!" |
| 5 | Agent | "2 kilo aata — sahi hai. Aur kuch?" |
| 6 | Customer | *(still noisy)* "Aur ek [unclear]." |
| 7 | Agent | "Mujhe samajh nahi aaya. Kya aap wapas bata sakte hain? Aapne 'tel' kaha ya 'namak'?" |
| 8 | Customer | "Tel! 1 litre." |
| 9 | Agent | "1 litre tel — kaunsa tel? Sarson, refined, ya sunflower?" |
| 10 | Customer | "Refined." |
| 11 | Agent | "1 litre refined oil — add kar diya." |

**Success Criteria:**
- Agent detects noise/audio issues and asks customer to speak clearly
- On unclear word, agent offers guesses ("tel" vs "namak")
- Agent recovers gracefully without dropping the order

**Failure Modes:**
- Agent hallucinates items from background noise
- Agent doesn't ask for clarity and proceeds with wrong items
- Agent repeatedly fails and escalates to handoff too early
