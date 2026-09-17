"""v74: Creating order rungs that stand on their own and take 10-20 minutes, read by hand.
They can come up as Today's extra. Doing one as an extra does NOT tick the rung or enrol you
in the ladder. (rung n, minutes, note written for when it arrives without its ladder)."""
EXTRAS = {
 'order.bedroom': [
  (1, 20, "Bedside table, chest of drawers, windowsill, the chair that collects clothes. Everything off, then back only what you picked up in the last seven days. The rest goes where it lives, or into one bag to decide about at the weekend."),
  (3, 15, "Every house has one: the box, bag or corner where things wait to be dealt with. Tip it out. Each thing gets one of three answers: bin, give, or a real home. No fourth pile."),
  (4, 10, "Clothes into the wash basket or back on a hanger, shoes in a pair, bags on a hook, anything else into its place. Set a timer for ten minutes and see how much of the floor comes back."),
  (5, 20, "Look where you never look: under the bed with a torch, along the skirting, into the corners, and the light switch that everybody touches. A damp cloth does all of it."),
  (7, 15, "The bedroom is for sleeping and dressing. The ironing pile, the exercise bike used as a rail, the work bag, the laptop charger: take one of them out and find it a better place tonight."),
 ],
 'order.desk': [
  (1, 15, "Everything off: the pens, the mugs, the post. Wipe it with a damp cloth until it is bare. Then choose three things you actually use every day, and only those go back. A kitchen table you work at counts."),
  (2, 20, "Gather every loose piece of paper in the house into one pile. Go through it once, top to bottom: bin it, put it in a folder, or do what it asks today. A shoebox is a perfectly good folder."),
  (3, 15, "Pick one drawer to hold what you use: pens that work, the stapler, the chargers you need. Everything else comes out of the drawers and gets a home somewhere else, or goes."),
  (4, 15, "Unplug anything that has not been used this month. Coil the rest loosely and hold each one with a bread-bag tie or a strip of paper. Write on the tie what the cable is for."),
  (6, 10, "Sit as you normally do. Your feet should be flat on the floor and the top of the screen at eye level. A cushion raises you, a stack of books raises the screen. Nothing needs buying."),
 ],
 'order.wardrobe': [
  (6, 20, "Summer things in winter, heavy coats in summer. Fold them into a bag or a box and put it under the bed, on top of the wardrobe, or in the loft. What is left is only what you can wear this month."),
  (7, 10, "Look at what you wear every week and ask what would make mornings easier. A plain jumper that goes with everything, a pair of shoes that do not hurt. Write the list. Buying is not today; knowing is."),
 ],
 'order.broken': [
  (1, 15, "Room by room with a pen: the dripping tap, the door that sticks, the lamp with a dead bulb, the drawer that jams, the phone with a cracked screen. Just the list tonight. Seeing it all written down is the job."),
  (6, 20, "Every home has one thing everybody has stepped round for a year. The loose handle, the wobbly chair, the cupboard door on one hinge. Tonight, fix that one. A free video search of the exact problem usually shows how."),
 ],
 'order.giving': [
  (1, 15, "Any bag. Walk the house and fill it with things you have not used in a year: the spare mugs, the gadget in its box, the clothes that wait for a different you. Tie it and put it by the front door."),
  (3, 20, "Open every kitchen cupboard. The third spatula, the mugs nobody picks, the machine used twice, the tins past their date. One bag of things to give, one bin bag for what is past it."),
  (4, 15, "Books you have read and will not read again, board games nobody asks for, the kit from a hobby you have finished with. Put them in a bag for a friend, a school, or a charity shop."),
  (5, 15, "Take everything out of the bathroom cupboard. Check every date on the medicines. Out-of-date medicines go back to a pharmacy, not in the bin. Half-used bottles you do not like: out."),
  (7, 10, "Not the thing you do not want. Something good that you like and hardly use: a book you loved, a good coat, a tool. Pick the person who will use it more and send them a message to say it is theirs."),
 ],
 'order.digital': [
  (1, 10, "Go through your apps page by page. If you cannot remember opening it in the last month, delete it. You can always get it back for free. Most phones can list apps by last use in the settings."),
  (2, 10, "Open your photos and scroll back one month. Delete the screenshots you no longer need, the blurry ones, the six copies of the same thing. Keep the best one of each."),
  (3, 15, "Open your email and search the word unsubscribe. For every newsletter or shop email you never read, open one and press the unsubscribe link at the bottom. Count to twenty."),
  (4, 10, "Settings, then notifications. Go down the list. Messages and calls from people stay on. Shops, games, news and anything else that buzzes you: off. You can still open the app whenever you choose."),
  (5, 20, "Start with the oldest. Anything older than a month that needs nothing from you: archive it all at once. Then go through what is left: reply, delete, or archive. The goal is an empty inbox once, tonight."),
  (6, 10, "Keep only the apps you use every day on the first page, eight or so. Everything else goes onto the second page or into one folder. The first page is what your thumb sees first."),
  (8, 15, "The photographs you would be most sorry to lose: children, weddings, the people who are gone. Turn on your phone's free photo backup, or copy them onto a computer or a memory stick you already own."),
  (10, 10, "Look through a month of your bank statement or the subscriptions list in your phone settings. Find the one you forgot about, the app or channel you do not use. Cancel it tonight."),
  (11, 15, "Open your main email account's security settings. It lists the devices and apps still signed in. Sign out of old phones, old computers, and apps you no longer use."),
 ],
 'order.forgotten': [
  (1, 20, "Warm water with a drop of washing-up liquid, a cloth, and a dry tea towel or newspaper to finish. Inside first, then outside where you can reach safely from the ground. Never lean out of an upstairs window."),
  (2, 15, "Close the blinds and wipe each slat with a damp cloth, or a sock over your hand. Then run the cloth along the top of the curtain rail, where the dust has been sitting for months."),
  (3, 20, "Empty the cupboard under the kitchen sink. Wipe the floor of it, bin what is empty or dried up, and put back only what you use. Then wash the bin itself, inside and out, and dry it."),
  (4, 20, "Everything out of one shelf at a time. Check dates, bin what is past, wipe the shelf, put back what is good. Door shelves last. Warm water and a spoon of bicarbonate of soda cleans it, if you have some."),
  (7, 20, "One room. Stand on a steady step, never a chair on wheels. Wipe the top of the cupboards, dust the light shade with the light switched off and cool, then go all the way round the skirting with a damp cloth."),
  (9, 15, "The front door is the first thing you touch coming home. Wipe the door, polish the handle and the letterbox, sweep the step. A bucket of warm soapy water and a cloth is everything."),
  (10, 20, "The top of the wardrobe, behind the washing machine, the back of the cupboard under the stairs. Pick the one place nobody in the house has looked at in years. Twenty minutes, and it is done."),
  (11, 15, "The kettle with white scale inside, the extractor fan filter, the shower head, the hoover filter. Pick one. For a kettle: half water, half vinegar, boil, leave an hour, rinse well and boil fresh water twice."),
 ],
 'order.keeping': [
  (1, 15, "Keys, glasses, chargers, the post, shoes: the things that always end up on the table. Walk the house and choose one spot for each, close to where you use it. A bowl by the door for keys counts."),
  (12, 20, "Walk every room slowly, the way a visitor would see it. Where are the piles back? The chair, the stairs, the kitchen counter. Pick the worst one and put it right tonight."),
  (13, 15, "Every house has a spot that always goes wrong: the hall table, the end of the kitchen counter. Watch what lands there. Then give it a new job: a hook for bags, a basket for post, or nothing at all."),
 ],
}
