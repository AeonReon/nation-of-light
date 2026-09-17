"""v77 (2026-09-17): the school works anywhere, not only in Northern Ireland.

His: "there will be others on it from other places. Just make it so it works for everywhere."
Every place-specific word found by a scan (NI bodies, towns, currency, UK services and slang) is replaced
with the plain, general version. Idempotent: each edit asserts the old text or the new text is there.
Run from the app folder: python3 tools/global/unlocal_v77.py
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'health'))
from lib import load, save

EDITS = {  # 'track#n.field' | 'track.field' | 'daily:id.field' : [(old, new), ...]
 'body.skip.about': [("A rope costs a few pounds;", "A rope costs very little;")],
 'wild.weather.about': [("In Northern Ireland the weather changes by the hour,", "In many places the weather changes by the hour,")],
 'wild.weather#2.note': [("Use the hour-by-hour view on the Met Office website or app, both free.", "Use the hour-by-hour view from your national weather service; its website or app is free."),
                         ("The point is that a day in Northern Ireland is often three different days.", "The point is that one day can be three different days.")],
 'wild.weather#5.note': [("The Met Office has a free rain map", "Most national weather services have a free rain map")],
 'wild.weather#6.test': [("Look up the weather warnings for Northern Ireland today, and say what yellow, amber and red each mean.", "Look up today's weather warnings for your area, and say what each warning level means.")],
 'wild.weather#6.note': [("The Met Office website lists them by region. Roughly: yellow means be aware and plan around it, amber means be prepared for real disruption, red means take action and avoid travel if you can. If there are no warnings today, that counts: say so, and say what each colour would mean.",
                          "Your national weather service lists them by region, usually in colours or levels. In many countries the lowest means be aware and plan around it, the middle means be prepared for real disruption, and the highest means take action and avoid travel if you can. If there are no warnings today, that counts: say so, and say what each level would mean.")],
 'wild.weather#7.note': [("In Northern Ireland the sun sets around four o'clock in December and after ten in June, so \"before dark\" means very different things.", "In many places the sun sets hours earlier in winter than in summer, so \"before dark\" means very different things through the year.")],
 'wild.weather#10.note': [("The NHS lists them:", "Health services list them:"), ("and 999 if they stop shivering", "and ring your emergency number if they stop shivering")],
 'wild.weather#13.note': [("Free tide times come from the Admiralty EasyTide website, and harbours", "Free tide times are on tide-times websites and apps, and harbours")],
 'wild.weather#14.note': [("ring 999 and ask for the Coastguard;", "ring your emergency number and ask for the coastguard or sea rescue;"),
                          ("which is the RNLI's \"Float to Live\" advice.", "which is what sea-rescue services teach.")],
 'wild.weather#17.note': [("It is free on the Met Office website and read out on the radio.", "Many national weather services publish a free forecast for coastal waters, and some read it out on the radio."),
                          ("It gives the wind strength on a scale of numbers,", "It usually gives the wind strength on a scale of numbers,")],
 'water.swim.about': [("most council leisure centres are a few pounds and many have free or cheap family sessions.", "public pools are usually cheap and many have free or low-cost family sessions.")],
 'sky.stars.about': [("It starts with the one shape you can see from Northern Ireland on every clear night of the year, the Plough,", "It is written for the northern half of the world; south of the equator the sky is different, so start with the Southern Cross instead. It starts with the one shape you can see on every clear night of the year from most northern countries, the Plough,")],
 'sky.stars.who': [("For everybody; a grown-up with any child in the dark", "For everybody in the northern half of the world; a grown-up with any child in the dark")],
 'sky.stars#1.note': [("From Northern Ireland it never sets, so it is up on every clear night of the year,", "From north of about 40 degrees (most of Europe, North America and northern Asia) it never sets, so it is up on every clear night of the year,")],
 'sky.stars#2.note': [("From here it sits a little over halfway up the sky, and it hardly moves.", "How high it sits matches how far north you live: about halfway up the sky in northern Europe, lower further south. It hardly moves.")],
 'sky.stars#3.note': [("Like the Plough, it never sets from Northern Ireland.", "Like the Plough, it never sets from most northern countries.")],
 'sky.stars#8.note': [("In June and early July the sky here never gets fully dark, so try late in the evening.", "Far in the north, the sky in June and early July never gets fully dark, so try late in the evening.")],
 'sky.stars#15.note': [("Davagh Forest in County Tyrone is an official Dark Sky Park. The best nights are the week either side of new moon, which the Met Office and most calendars show.", "Many countries have official Dark Sky Parks; search for the nearest one. The best nights are the week either side of new moon, which most calendars and weather apps show.")],
 'sky.stars#16.note': [("From Northern Ireland it is best from August to October in the evening,", "From northern countries it is best from August to October in the evening,")],
 'mind.cube.about': [("You need a cube, about five pounds, and nothing else.", "You need a cube, which costs very little, and nothing else.")],
 'mind.mental#15.test': [("be within a pound at the till.", "be within one whole unit of your money at the till.")],
 'mind.findout#7.note': [("I rent a flat in Northern Ireland and one radiator", "I rent a flat and one radiator")],
 'words.irish.name': [("Irish", "The old language of your place")],
 'words.irish.line': [],
 'words.irish#1.test': [("in Irish.", "in the old language of where you live or where your family comes from.")],
 'words.irish#3.test': [("Count to ten in Irish.", "Count to ten in that language.")],
 'words.irish#4.test': [("Learn the Irish for ten things in your house,", "Learn the words in that language for ten things in your house,")],
 'words.irish#7.test': [("Find out what your own town or townland name means in Irish.", "Find out what the name of your own town or area means in that language.")],
 'words.irish#7.note': [("Almost every place name here is Irish underneath.", "Many place names come from an older language underneath.")],
 'words.irish#10.test': [("and ask for something in Irish.", "and ask for something in that language.")],
 'words.irish#13.test': [("Listen to five minutes of Irish radio or television", "Listen to five minutes of radio or television in that language")],
 'words.irish#16.test': [("Tell somebody in Irish what you did yesterday.", "Tell somebody in that language what you did yesterday.")],
 'words.irish#17.test': [("in Irish and say it from memory.", "in that language and say it from memory.")],
 'words.irish#20.test': [("Tell a short story in Irish to the group.", "Tell a short story in that language to the group.")],
 'words.books.about': [("joining Libraries NI is free,", "joining a public library is free in most places,")],
 'words.sign#1.note': [("Any short video of the British Sign Language alphabet will show you the letters.", "Any short video of the sign-language alphabet used where you live (for example British, American or Auslan) will show you the letters.")],
 'speak.strangers#1.note': [("A chippy, a bakery,", "A chip shop, a bakery,")],
 'speak.strangers#11.note': [("a librarian, a postie.", "a librarian, a postal worker.")],
 'make.something1#11.note': [("A pound-shop kit,", "A cheap kit,")],
 'make.clay.about': [("A bag of air-drying clay is a few pounds and needs no kiln.", "A bag of air-drying clay costs little and needs no kiln.")],
 'food.bake.about': [("which costs about thirty pence and beats anything in a shop", "which costs very little and beats anything in a shop")],
 'food.bake#1.how': [("Kitchen scales are a few pounds second hand and every charity shop has one.", "Kitchen scales are cheap second hand and most charity shops have one.")],
 'food.bake#11.how': [("It costs about thirty pence and takes", "It costs very little and takes")],
 'food.bake#16.note': [("and it costs about three pounds.", "and it costs very little.")],
 'food.bake#19.note': [("Ten pounds earned from something you made", "Money earned from something you made")],
 'food.bake#19.how': [("A stall, a car boot, a school fair,", "A stall, a second-hand sale, a school fair,")],
 'money.value1#4.note': [("An online listing, a car boot, a friend. Given away does not count; a pound does.", "An online listing, a second-hand sale, a friend. Given away does not count; any price does.")],
 'money.value1#10.test': [("Earn one pound you did not have this morning.", "Earn some money you did not have this morning, however small.")],
 'money.value1#10.note': [("Most people go years without earning a single pound outside their job.", "Most people go years without earning anything outside their job.")],
 'money.value1#12.note': [("\"£200 by the end of next month, from things I make or do.\"", "\"200 by the end of next month, from things I make or do.\"")],
 'money.handling#1.test': [],
 'money.handling#1.note': [("1p, 2p, 5p, 10p, 20p, 50p, £1, £2. A child names each one out loud. No coins in the house: use the pictures on the Royal Mint website.", "Every coin your country uses, from the smallest to the largest. A child names each one out loud. No coins in the house: your central bank or mint shows pictures of them online.")],
 'money.handling#2.test': [("Make one pound out of coins in three different ways.", "Make one whole unit of your money (a pound, a dollar, a euro) out of coins in three different ways.")],
 'money.handling#2.note': [("Two 50ps; five 20ps; a 50p, two 20ps and a 10p. A grown-up can make £3.85 in the fewest coins possible, then in the most.", "For example two halves, five fifths, or one half, two fifths and a tenth, in whatever coins you have. A grown-up can make 3.85 in the fewest coins possible, then in the most.")],
 'money.handling#3.note': [("Round each price to the nearest ten pence", "Round each price to the nearest tenth of a unit (10p, 10 cents)")],
 'money.handling#5.test': [("gives change from a £5 note,", "gives change from a 5 note,")],
 'money.handling#5.note': [("Prices under £5, like £3.40 or £1.85. Count up from the price to £5,", "Prices under 5, like 3.40 or 1.85. Count up from the price to 5,")],
 'money.handling#6.test': [("the change from £10 and from £20", "the change from 10 and from 20")],
 'money.handling#6.note': [("£7.35 from £10 is £2.65.", "7.35 from 10 is 2.65.")],
 'money.earn#13.test': [("Turn ten pounds into thirty pounds honestly,", "Turn a small amount of money into three times as much honestly,")],
 'money.invest#5.test': [("Work out what a pound a week becomes in a year.", "Work out what one coin a week becomes in a year.")],
 'nerve.asking#8.note': [("A stall at a market or a car boot sale", "A stall at a market or a second-hand sale"), ("A child can do the car boot with a grown-up.", "A child can do the second-hand sale with a grown-up.")],
 'deal.price#4.note': [("\"Would you take £30 for it?\" or \"I have seen this for £45 elsewhere;", "\"Would you take 30 for it?\" or \"I have seen this for 45 elsewhere;")],
 'deal.price#5.test': [("at a car boot sale, a market stall,", "at a second-hand sale, a market stall,")],
 'deal.price#5.note': [("for a £20 item, £15.", "for something marked 20, offer 15.")],
 'deal.price#6.note': [("They ask £20, you offer £15, they say £18, you say \"£17 and it is a deal\".", "They ask 20, you offer 15, they say 18, you say \"17 and we have a deal\".")],
 'deal.price#8.note': [("\"I have seen this for £45 in another shop;", "\"I have seen this for 45 in another shop;")],
 'belong.town1#19.note': [("The butcher, the postie,", "The butcher, the postal worker,")],
 'belong.chair#1.note': [("Belfast City Hall, for example, has free public tours. ", "Many city halls and parliament buildings run free public tours. ")],
 'belong.chair#2.note': [("European Heritage Open Days in September open many buildings in Northern Ireland that are usually closed, for free. Some country houses have free gardens or grounds even when the house costs money. Parliament Buildings at Stormont has run free tours.",
                          "Many countries hold heritage open days once a year, when buildings that are usually closed open for free. Some country houses have free gardens or grounds even when the house costs money, and many parliaments and city halls run free tours.")],
 'belong.chair#3.note': [("the best restaurant in your county.", "the best restaurant in your area.")],
 'belong.chair#6.note': [("anybody can have a coffee, about four pounds.\"", "anybody can have a coffee, and here is the price.\"")],
 'home.mend#3.note': [("Gas work in Northern Ireland needs a Gas Safe registered engineer; wiring needs a qualified electrician. If you smell gas, open windows, do not touch switches, and ring the Northern Ireland gas emergency number, 0800 002 001.",
                      "Gas work needs a registered gas engineer; wiring needs a qualified electrician. If you smell gas, open windows, do not touch switches, and ring the gas emergency number for your area: look it up now and write it on the list.")],
 'home.mend#12.note': [("Filler is a few pounds;", "Filler is cheap;")],
 'home.firstaid#1.test': [("as if to the 999 operator,", "as if to the emergency operator (999, 112, 911: whichever number works where you live),")],
 'care.giving#8.note': [("leave a thank-you note for the postie,", "leave a thank-you note for the person who delivers the post,")],
 'care.giving#10.note': [("A child might choose 20p from pocket money; a grown-up might choose a pound or five.", "A child might choose a small coin from pocket money; a grown-up might choose a little more.")],
 'care.place#4.note': [("Your council's website says", "Your local council's website usually says")],
 'care.place#5.note': [("Your council website takes most reports; roads and street lights can be reported through nidirect.", "Your local council or government website usually takes these reports, often through an online form.")],
 'care.place#7.note': [("but it might be the Housing Executive, a housing association, the Department for Infrastructure for a roadside verge,", "but it might be a housing body, a roads department for a roadside verge,")],
 'care.place#14.note': [("Keep Northern Ireland Beautiful also supports local clean-ups.", "Many places also have a national litter or clean-up charity that supports local tidies.")],
 'calm.gratitude#6.note': [("the lollipop person,", "the school crossing guard,")],
 'daily:q-lang-thanks.note': [("such as Irish, Polish, Italian and Portuguese.", "such as Spanish, Polish, Italian and Japanese.")],
 'daily:q-lang-morning.note': [("Search good morning in German, then in Irish,", "Search good morning in German, then in Japanese,")],
 'daily:q-ten-percent.note': [("so ten per cent of 24 pounds is 2 pounds 40. Five per cent is half of that, 1 pound 20. Fifteen per cent is both added: 3 pounds 60. Try 18 pounds, 60 pounds and 7 pounds 50.",
                               "so ten per cent of 24.00 is 2.40. Five per cent is half of that, 1.20. Fifteen per cent is both added: 3.60. Try 18.00, 60.00 and 7.50.")],
 'daily:q-coin-look.note': [("such as 50p coin designs.", "such as the country's name and coin designs.")],
 'daily:q-renewal-date.note': [("Car insurance, the TV licence and home insurance are common ones;", "Car insurance, home insurance and a phone contract are common ones;")],
 'daily:q-proverb-meaning.test': [("Look up one saying in Irish or Ulster Scots and write down what it means word for word.", "Look up one old saying in a language spoken where you live, or where your family comes from, and write down what it means word for word.")],
 'daily:q-proverb-meaning.note': [("Search Irish proverbs or Ulster Scots sayings and pick one short one.", "Search proverbs in that language and pick one short one.")],
 'daily:q-price-per-100.note': [("For example, 1 pound 50 for 500 grams is 30p per 100 grams.", "For example, 1.50 for 500 grams is 0.30 per 100 grams.")],
 'daily:x-cook-crepes.test': [],
 'daily:x-potato-story.test': [("and how it reached Ireland,", "and how it reached the country you live in,")],
 'daily:x-tea-story.note': [("If the packet does not say, pick Kenya: a large share of the tea drunk in Britain and Ireland is grown there.", "If the packet does not say, pick Kenya, one of the biggest tea growers in the world.")],
 'daily:x-cassiopeia.note': [("From Northern Ireland, Cassiopeia is above the horizon every clear night of the year,", "From most northern countries, Cassiopeia is above the horizon every clear night of the year,"),
                             ("instead.", "instead. South of the equator, find the Southern Cross the same way.")],
 'daily:x-street-trees.note': [("such as Seek or the Woodland Trust's tree guide online.", "such as Seek, or a tree guide online.")],
 'daily:x-street-birds.note': [("Blackbirds, robins, starlings, jackdaws and blue tits are common in Northern Ireland towns. On a wet evening, look up those five on the RSPB website", "The app lists the birds most common where you live. On a wet evening, look up the five most common on a bird website")],
 'daily:x-listen-dusk.note': [("or describe it in words and search the RSPB website.", "or describe it in words and search a bird website.")],
 'daily:x-space-station.note': [("website for Belfast or the nearest large town.", "website for your town or the nearest large one.")],
 'daily:x-name-clouds.test': [("using the Met Office cloud guide.", "using a free cloud guide.")],
 'daily:x-name-clouds.note': [("The free Met Office website has pictures of each type:", "National weather services put free cloud guides online, with pictures of each type:")],
 'daily:x-street-built.note': [("The free PRONI Historical Maps viewer online lets you look at your area on old maps from the 1830s onwards;", "Many national archives and libraries put old maps online for free, so you can look at your area as it was over a hundred years ago;")],
 'daily:x-read-plaques.note': [("At home, open the Ulster History Circle website, which puts up blue plaques across Northern Ireland, and read about the plaque nearest to you.", "At home, search for historic plaques or monuments near you and read about the nearest one.")],
 'daily:x-oldest-mile.note': [("The free Historic Environment Map Viewer from the Department for Communities shows recorded old sites on a map,", "Many countries have a free online map of recorded old sites and listed buildings,")],
 'daily:x-town-name.note': [("Most place names in Northern Ireland come from Irish, and some from Scots or English. The free PlaceNamesNI website gives the meaning and the old spellings: Belfast, for example, comes from Béal Feirste, the mouth of the sandbank ford. Then look up the name of your townland or street the same way.",
                            "Many place names come from an older language, and describe the land: a hill, a river crossing, a church. Search the name of your town with the words \"place name meaning\" or \"origin of the name\". Then look up the name of your street or area the same way.")],
 'daily:x-tap-water.note': [("The NI Water website explains where water for each area comes from", "Your water company's website usually explains where the water for each area comes from")],
 'daily:x-old-photos-town.note': [("Try the PRONI or National Museums NI websites, or the museum run by your local council,", "Try your national archive or museum websites, or your local museum or library,")],
 'daily:x-library-town-book.note': [("The Libraries NI website also lets you search the catalogue and borrow e-books from home.", "Most library services also let you search the catalogue and borrow e-books from home."), ("or your county.", "or your region.")],
 'daily:x-trade-lighthouse.note': [("Rathlin Island and St John's Point both have lighthouses with written histories online.", "Many lighthouses have their written histories online; pick the nearest one to you, or a famous one.")],
 'daily:x-trade-shipwright.test': [("Read about the people who built ships in Belfast a hundred years ago,", "Read about the people who built ships in one of the great shipbuilding cities a hundred years ago,")],
 'daily:x-trade-shipwright.note': [],
 'daily:x-trade-waller.note': [("Northern Ireland has miles of these walls in the Mournes.", "Many hill countries have miles of these walls.")],
}

d = load()
T = {t['id']: t for c in d['categories'] for t in c['tracks']}
D = {it['id']: it for pool in ('quick', 'extra') for it in d['daily'][pool]}

def target(key):
    if key.startswith('daily:'):
        iid, f = key[6:].rsplit('.', 1); return D[iid], f
    head, f = key.rsplit('.', 1)
    if '#' in head:
        tid, n = head.split('#'); return T[tid]['steps'][int(n) - 1], f
    return T[head], f

done = 0
for key, pairs in EDITS.items():
    obj, f = target(key)
    for old, new in pairs:
        if f == 'how':
            hits = [i for i, h in enumerate(obj['how']) if old in h or new in h]; assert hits, key
            i = hits[0]; obj['how'][i] = obj['how'][i].replace(old, new)
        else:
            if old in obj[f]: obj[f] = obj[f].replace(old, new)
            else: assert new in obj[f], (key, old[:50])
        done += 1
# Shipwright note may still name Belfast
sw = D['x-trade-shipwright']
sw['note'] = sw['note'].replace('in Belfast', 'in that city')
save(d)

# the app's own copy
cp = os.path.join(HERE, '..', '..', 'content.json'); C = json.load(open(cp))
C['apps']['lede'] = C['apps']['lede'].replace('free apps built for families in Northern Ireland:', 'free apps built for families:')
json.dump(C, open(cp, 'w'), ensure_ascii=False, indent=1); open(cp, 'a').write('\n')
print('edits applied:', done)
